const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DIR = __dirname;
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'ecoscore2025';
const DATA_FILE = path.join(DIR, 'appdata.json');
const SESSIONS = new Set();

// ── Légifrance PISTE API (gratuit sur inscription à developer.aife.economie.gouv.fr) ──
const PISTE_CLIENT_ID = process.env.PISTE_CLIENT_ID || '';
const PISTE_CLIENT_SECRET = process.env.PISTE_CLIENT_SECRET || '';
const PISTE_TOKEN_URL = 'https://oauth.aife.economie.gouv.fr/api/oauth/token';
const PISTE_API_BASE = 'https://api.aife.economie.gouv.fr/dila/legifrance/lf-engine-app';
let _pisteToken = null;
let _pisteTokenExpiry = 0;

function makeSession() {
  const tok = crypto.randomBytes(32).toString('hex');
  SESSIONS.add(tok);
  setTimeout(() => SESSIONS.delete(tok), 8 * 60 * 60 * 1000);
  return tok;
}
function checkSession(req) {
  const cookie = (req.headers.cookie || '').split(';').find(c => c.trim().startsWith('es_session='));
  if (!cookie) return false;
  return SESSIONS.has(cookie.trim().replace('es_session=', ''));
}
function getApiKey(reqKey) {
  if (reqKey && reqKey.startsWith('sk-')) return reqKey;
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try { return JSON.parse(fs.readFileSync(path.join(DIR,'config.json'),'utf8')).anthropicApiKey || ''; } catch { return ''; }
}

const MIME = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.ico':'image/x-icon','.png':'image/png','.json':'application/json'};

// ── Helpers HTTP ───────────────────────────────────────────────────────────────
function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const mod = options.hostname.startsWith('localhost') ? http : https;
    const req = mod.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch { resolve({ status: res.statusCode, body: data }); } });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

// ── Claude API ────────────────────────────────────────────────────────────────
async function callAnthropic(apiKey, body) {
  const payload = JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:2048, system:body.system||'', messages:body.messages||[] });
  const r = await httpRequest({
    hostname:'api.anthropic.com', path:'/v1/messages', method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','Content-Length':Buffer.byteLength(payload)}
  }, payload);
  return r.body;
}

// ── Légifrance PISTE Token ────────────────────────────────────────────────────
async function getPisteToken() {
  if (_pisteToken && Date.now() < _pisteTokenExpiry) return _pisteToken;
  if (!PISTE_CLIENT_ID || !PISTE_CLIENT_SECRET) return null;
  try {
    const body = `grant_type=client_credentials&client_id=${encodeURIComponent(PISTE_CLIENT_ID)}&client_secret=${encodeURIComponent(PISTE_CLIENT_SECRET)}&scope=openid`;
    const r = await httpRequest({
      hostname:'oauth.aife.economie.gouv.fr', path:'/api/oauth/token', method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded','Content-Length':Buffer.byteLength(body)}
    }, body);
    if (r.body.access_token) {
      _pisteToken = r.body.access_token;
      _pisteTokenExpiry = Date.now() + (r.body.expires_in - 60) * 1000;
      return _pisteToken;
    }
  } catch(e) { console.error('Légifrance token error:', e.message); }
  return null;
}

// ── Légifrance Search ─────────────────────────────────────────────────────────
async function searchLegifrance(query, filters) {
  const token = await getPisteToken();
  if (!token) return null;
  const payload = JSON.stringify({
    recherche: {
      champs: [{ typeChamp:'ALL', criteres:[{ typeRecherche:'EXACTE', valeur:query }], operateur:'ET' }],
      filtres: filters || [],
      pageNumber: 1, pageSize: 10, operateur:'ET', sort:'PERTINENCE', typePagination:'DEFAUT'
    },
    fond: 'CODE_DATE'
  });
  try {
    const r = await httpRequest({
      hostname:'api.aife.economie.gouv.fr',
      path:'/dila/legifrance/lf-engine-app/search',
      method:'POST',
      headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload)}
    }, payload);
    return r.body;
  } catch(e) { console.error('Légifrance search error:', e.message); return null; }
}

// ── Légifrance Get Article ────────────────────────────────────────────────────
async function getLegifranceArticle(id) {
  const token = await getPisteToken();
  if (!token) return null;
  try {
    const r = await httpRequest({
      hostname:'api.aife.economie.gouv.fr',
      path:`/dila/legifrance/lf-engine-app/consult/getArticle?id=${encodeURIComponent(id)}`,
      method:'GET',
      headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'}
    });
    return r.body;
  } catch(e) { return null; }
}

// ── EUR-Lex SPARQL (gratuit, sans auth) ──────────────────────────────────────
async function searchEurLex(query) {
  const sparql = `
    PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
    SELECT DISTINCT ?work ?title ?date ?celex WHERE {
      ?work cdm:work_has_expression ?expr .
      ?expr cdm:expression_uses_language <http://publications.europa.eu/resource/authority/language/FRA> .
      ?expr cdm:expression_title ?title .
      FILTER(CONTAINS(LCASE(?title), LCASE("${query.replace(/"/g,'')}")))
      OPTIONAL { ?work cdm:work_date_document ?date }
      OPTIONAL { ?work cdm:resource_legal_eli ?celex }
    } LIMIT 8
  `;
  try {
    const encoded = encodeURIComponent(sparql);
    const r = await httpRequest({
      hostname:'publications.europa.eu',
      path:`/webapi/rdf/sparql?query=${encoded}&format=application%2Fsparql-results%2Bjson`,
      method:'GET',
      headers:{'Accept':'application/sparql-results+json'}
    });
    return r.body;
  } catch(e) { console.error('EUR-Lex error:', e.message); return null; }
}

// ── AI Legal Research (Claude avec contexte juridique) ────────────────────────
async function aiLegalSearch(apiKey, query, context) {
  const system = `Tu es un juriste expert en droit français et européen, spécialisé en droit ESG, droit du travail, droit de l'environnement et droit des sociétés.

Quand on te pose une question juridique :
1. Cite les textes officiels PRÉCIS (numéros d'articles, décrets, règlements UE)
2. Donne la source officielle (Légifrance, EUR-Lex)
3. Indique la date d'entrée en vigueur et si le texte a été modifié récemment
4. Explique concrètement les obligations pour une PME française
5. Signale les sanctions applicables
6. Structure ta réponse en Markdown avec des titres clairs

Contexte : ${context || 'Logiciel ESG pour PME françaises'}

Format de réponse :
## 📋 Textes applicables
## ⚖️ Obligations concrètes
## 🏢 Impact PME
## ⚡ Sanctions
## 🔗 Sources officielles`;

  return callAnthropic(apiKey, { system, messages:[{ role:'user', content: query }] });
}

// ── Login HTML ────────────────────────────────────────────────────────────────
const LOGIN_HTML = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EcoScore</title><link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#F7F6F3;font-family:'Sora',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:#fff;border-radius:20px;border:1px solid #E4E4E7;padding:48px 40px;width:100%;max-width:400px;box-shadow:0 8px 40px rgba(0,0,0,.08)}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:36px;justify-content:center}
.li{width:44px;height:44px;background:#1D3D2E;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px}
.lt p:first-child{font-family:'DM Serif Display',serif;font-size:22px;color:#1D3D2E;line-height:1}.lt p:last-child{font-size:10px;color:#A1A1AA;letter-spacing:.5px;margin-top:2px}
h2{font-size:17px;font-weight:700;margin-bottom:4px;color:#18181B}.sub{font-size:12px;color:#A1A1AA;margin-bottom:28px}
label{display:block;font-size:11px;font-weight:700;color:#52525B;margin-bottom:6px;letter-spacing:.3px;text-transform:uppercase}
input{width:100%;padding:11px 14px;border:1.5px solid #E4E4E7;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;outline:none;transition:.15s;margin-bottom:20px}
input:focus{border-color:#3D9A6E;box-shadow:0 0 0 3px #EBF5EF}
button{width:100%;padding:12px;background:#1D3D2E;color:#fff;border:none;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;cursor:pointer}
button:hover{background:#2D5A45}.err{color:#EF4444;font-size:12px;margin-top:12px;text-align:center;padding:8px;background:#FEF2F2;border-radius:8px;border:1px solid #FECACA}
.foot{text-align:center;margin-top:20px;font-size:11px;color:#A1A1AA}</style></head><body>
<div class="card"><div class="logo"><div class="li">🌿</div><div class="lt"><p>EcoScore</p><p>ESG · CSRD · PME</p></div></div>
<h2>Accès sécurisé</h2><p class="sub">Plateforme ESG & CSRD pour PME</p>
<form method="POST" action="/login"><label>Mot de passe</label>
<input type="password" name="password" placeholder="Entrez votre mot de passe" autofocus/>
<button type="submit">Se connecter →</button>{{ERROR}}</form>
<p class="foot">Accès restreint — Données confidentielles</p></div></body></html>`;

// ── SERVEUR ───────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method==='OPTIONS') { res.writeHead(200); res.end(); return; }

  const json = (data, status=200) => { res.writeHead(status,{'Content-Type':'application/json'}); res.end(JSON.stringify(data)); };
  const readBody = () => new Promise(r => { let b=''; req.on('data',c=>b+=c); req.on('end',()=>r(b)); });

  // Login
  if (req.url==='/login' && req.method==='GET') {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(LOGIN_HTML.replace('{{ERROR}}', req.url.includes('error') ? '<p class="err">Mot de passe incorrect.</p>' : ''));
    return;
  }
  if (req.url.startsWith('/login') && req.method==='POST') {
    const b = await readBody();
    const p = new URLSearchParams(b);
    if (p.get('password')===ACCESS_PASSWORD) {
      const tok = makeSession();
      res.writeHead(302,{'Set-Cookie':`es_session=${tok}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`,'Location':'/'});
    } else {
      res.writeHead(302,{'Location':'/login?error=1'});
    }
    res.end(); return;
  }
  if (!checkSession(req) && !req.url.includes('favicon') && !req.url.startsWith('/login')) {
    res.writeHead(302,{'Location':'/login'}); res.end(); return;
  }

  // ── SAVE/LOAD DATA ─────────────────────────────────────────────────────────
  if (req.method==='POST' && req.url==='/api/save') {
    const body = await readBody();
    try { JSON.parse(body); fs.writeFileSync(DATA_FILE, body, 'utf8'); json({ok:true,ts:Date.now()}); }
    catch(e) { json({ok:false,error:e.message}, 400); }
    return;
  }
  if (req.method==='GET' && req.url==='/api/load') {
    try {
      if (fs.existsSync(DATA_FILE)) { const d=fs.readFileSync(DATA_FILE,'utf8'); res.writeHead(200,{'Content-Type':'application/json'}); res.end(d); }
      else { json({notFound:true}, 404); }
    } catch(e) { json({error:e.message}, 500); }
    return;
  }

  // ── CLAUDE AI ──────────────────────────────────────────────────────────────
  if (req.method==='POST' && req.url==='/api/ai') {
    const body = await readBody();
    try {
      const parsed = JSON.parse(body);
      const apiKey = getApiKey(parsed.apiKey);
      if (!apiKey || !apiKey.startsWith('sk-')) { json({content:[{type:'text',text:'**Clé API non configurée.** Allez dans Paramètres.'}]}); return; }
      const result = await callAnthropic(apiKey, parsed);
      json(result);
    } catch(e) { json({error:e.message}, 500); }
    return;
  }

  // ── RECHERCHE JURIDIQUE IA ────────────────────────────────────────────────
  if (req.method==='POST' && req.url==='/api/legal/ai-search') {
    const body = await readBody();
    try {
      const { query, context, apiKey: reqKey } = JSON.parse(body);
      const apiKey = getApiKey(reqKey);
      if (!apiKey || !apiKey.startsWith('sk-')) { json({error:'Clé API requise'}); return; }
      const result = await aiLegalSearch(apiKey, query, context);
      json(result);
    } catch(e) { json({error:e.message}, 500); }
    return;
  }

  // ── LÉGIFRANCE SEARCH ─────────────────────────────────────────────────────
  if (req.method==='POST' && req.url==='/api/legal/legifrance') {
    const body = await readBody();
    try {
      const { query, filters } = JSON.parse(body);
      if (!PISTE_CLIENT_ID || !PISTE_CLIENT_SECRET) {
        json({ error:'PISTE_NOT_CONFIGURED', message:'Credentials Légifrance non configurées. Ajoutez PISTE_CLIENT_ID et PISTE_CLIENT_SECRET dans vos variables d\'environnement Render.' });
        return;
      }
      const result = await searchLegifrance(query, filters);
      json(result || { error:'Aucun résultat' });
    } catch(e) { json({error:e.message}, 500); }
    return;
  }

  // ── LÉGIFRANCE GET ARTICLE ────────────────────────────────────────────────
  if (req.method==='GET' && req.url.startsWith('/api/legal/article')) {
    const url = new URL('http://x' + req.url);
    const id = url.searchParams.get('id');
    if (!id) { json({error:'id requis'}, 400); return; }
    try {
      const result = await getLegifranceArticle(id);
      json(result || {error:'Article non trouvé'});
    } catch(e) { json({error:e.message}, 500); }
    return;
  }

  // ── EUR-LEX SEARCH ────────────────────────────────────────────────────────
  if (req.method==='POST' && req.url==='/api/legal/eurlex') {
    const body = await readBody();
    try {
      const { query } = JSON.parse(body);
      const result = await searchEurLex(query);
      json(result || {error:'Aucun résultat EUR-Lex'});
    } catch(e) { json({error:e.message}, 500); }
    return;
  }

  // ── CHECK LÉGIFRANCE STATUS ───────────────────────────────────────────────
  if (req.method==='GET' && req.url==='/api/legal/status') {
    const pisteConfigured = !!(PISTE_CLIENT_ID && PISTE_CLIENT_SECRET);
    let pisteConnected = false;
    if (pisteConfigured) {
      const token = await getPisteToken();
      pisteConnected = !!token;
    }
    json({ piste: { configured: pisteConfigured, connected: pisteConnected }, eurlex: { available: true, url: 'https://publications.europa.eu/webapi/rdf/sparql' } });
    return;
  }

  // ── SAVE API KEY ──────────────────────────────────────────────────────────
  if (req.method==='POST' && req.url==='/api/config') {
    const body = await readBody();
    try {
      const { apiKey } = JSON.parse(body);
      if (apiKey && apiKey.startsWith('sk-')) fs.writeFileSync(path.join(DIR,'config.json'),JSON.stringify({anthropicApiKey:apiKey},null,2));
    } catch {}
    json({ok:true}); return;
  }

  // ── STATIC FILES ──────────────────────────────────────────────────────────
  const filePath = path.join(DIR, req.url==='/'?'index.html':req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath,(err,data)=>{
    if(err){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':MIME[ext]||'text/plain'});res.end(data);
  });
});

server.listen(PORT, () => {
  const pisteOk = !!(PISTE_CLIENT_ID && PISTE_CLIENT_SECRET);
  console.log('\n┌──────────────────────────────────────────────────┐');
  console.log('│  🌿  EcoScore — ESG & CSRD pour PME              │');
  console.log('├──────────────────────────────────────────────────┤');
  console.log(`│  ✅  http://localhost:${PORT}                        │`);
  console.log(`│  🔐  Mot de passe : ${ACCESS_PASSWORD}                   │`);
  console.log(`│  ⚖️   Légifrance API : ${pisteOk ? '✅ Connectée' : '⚠️  Non configurée (optionnel)'}    │`);
  console.log('│  🇪🇺  EUR-Lex SPARQL : ✅ Disponible               │');
  console.log('│  🤖  Claude IA juridique : ✅ Disponible           │');
  console.log('│  💾  Sauvegarde : localStorage + serveur          │');
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│  Variables Render :                               │');
  console.log('│  ANTHROPIC_API_KEY, ACCESS_PASSWORD, PORT=10000  │');
  console.log('│  PISTE_CLIENT_ID, PISTE_CLIENT_SECRET (optionnel)│');
  console.log('└──────────────────────────────────────────────────┘\n');
});
