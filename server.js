const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DIR = __dirname;
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'ecoscore2025';
const SESSIONS = new Set();

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

const MIME = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.ico':'image/x-icon','.png':'image/png'};

function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try { return JSON.parse(fs.readFileSync(path.join(DIR,'config.json'),'utf8')).anthropicApiKey || ''; } catch { return ''; }
}

function callAnthropic(apiKey, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:2048, system:body.system||'', messages:body.messages||[] });
    const req = https.request({
      hostname:'api.anthropic.com', path:'/v1/messages', method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({error:'Erreur parsing'}); } });
    });
    req.on('error', reject);
    req.write(payload); req.end();
  });
}

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EcoScore</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#F7F6F3;font-family:'Sora',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:#fff;border-radius:20px;border:1px solid #E4E4E7;padding:48px 40px;width:100%;max-width:400px;box-shadow:0 8px 40px rgba(0,0,0,.08)}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:36px;justify-content:center}
.li{width:44px;height:44px;background:#1D3D2E;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px}
.lt p:first-child{font-family:'DM Serif Display',serif;font-size:22px;color:#1D3D2E;line-height:1}
.lt p:last-child{font-size:10px;color:#A1A1AA;letter-spacing:.5px;margin-top:2px}
h2{font-size:17px;font-weight:700;margin-bottom:4px;color:#18181B}
.sub{font-size:12px;color:#A1A1AA;margin-bottom:28px}
label{display:block;font-size:11px;font-weight:700;color:#52525B;margin-bottom:6px;letter-spacing:.3px;text-transform:uppercase}
input{width:100%;padding:11px 14px;border:1.5px solid #E4E4E7;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;outline:none;transition:.15s;margin-bottom:20px}
input:focus{border-color:#3D9A6E;box-shadow:0 0 0 3px #EBF5EF}
button{width:100%;padding:12px;background:#1D3D2E;color:#fff;border:none;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:.15s}
button:hover{background:#2D5A45}
.err{color:#EF4444;font-size:12px;margin-top:12px;text-align:center;padding:8px;background:#FEF2F2;border-radius:8px;border:1px solid #FECACA}
.foot{text-align:center;margin-top:20px;font-size:11px;color:#A1A1AA}
</style></head><body>
<div class="card">
  <div class="logo"><div class="li">🌿</div><div class="lt"><p>EcoScore</p><p>ESG · CSRD · PME</p></div></div>
  <h2>Accès sécurisé</h2>
  <p class="sub">Plateforme ESG — Lacavalerie Group</p>
  <form method="POST" action="/login">
    <label>Mot de passe</label>
    <input type="password" name="password" placeholder="Entrez votre mot de passe" autofocus/>
    <button type="submit">Se connecter →</button>
    {{ERROR}}
  </form>
  <p class="foot">Accès restreint — Données confidentielles</p>
</div></body></html>`;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method==='OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.url==='/login' && req.method==='GET') {
    const showError = req.url.includes('error');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(LOGIN_HTML.replace('{{ERROR}}', showError ? '<p class="err">Mot de passe incorrect. Réessayez.</p>' : ''));
    return;
  }

  if (req.url.startsWith('/login') && req.method==='POST') {
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      const params = new URLSearchParams(body);
      if (params.get('password')===ACCESS_PASSWORD) {
        const token = makeSession();
        res.writeHead(302,{'Set-Cookie':`es_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`,'Location':'/'});
      } else {
        res.writeHead(302,{'Location':'/login?error=1'});
      }
      res.end();
    }); return;
  }

  if (!checkSession(req) && !req.url.includes('favicon')) {
    res.writeHead(302,{'Location':'/login'}); res.end(); return;
  }

  if (req.method==='POST' && req.url==='/api/ai') {
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',async()=>{
      try {
        const parsed=JSON.parse(body);
        const apiKey=parsed.apiKey||getApiKey();
        if (!apiKey||!apiKey.startsWith('sk-')) {
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({content:[{type:'text',text:'**Clé API non configurée.**\n\nAllez dans **Paramètres** pour entrer votre clé Anthropic (sk-ant-…).\n\nObtenez-la gratuitement sur console.anthropic.com'}]}));
          return;
        }
        const result=await callAnthropic(apiKey,parsed);
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(result));
      } catch(err) {
        res.writeHead(500,{'Content-Type':'application/json'});
        res.end(JSON.stringify({error:err.message}));
      }
    }); return;
  }

  if (req.method==='POST' && req.url==='/api/config') {
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      try { const {apiKey}=JSON.parse(body); if(apiKey) { const cfg={anthropicApiKey:apiKey}; fs.writeFileSync(path.join(DIR,'config.json'),JSON.stringify(cfg,null,2)); } } catch {}
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:true}));
    }); return;
  }

  if (req.method==='POST' && req.url==='/api/export-csv') {
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      try {
        const {type,data}=JSON.parse(body);
        let csv='';
        if(type==='employees') {
          csv='Prénom,Nom,Poste,Département,Contrat,Email,Genre,Formation(h),Salaire(€)\n';
          data.forEach(e=>{csv+=`${e.prenom},${e.nom},"${e.poste}",${e.dept},${e.contrat},${e.email},${e.genre},${e.formation||''},${e.salaire||''}\n`;});
        } else if(type==='esg') {
          csv='Pilier,Indicateur,Valeur,Unité\n';
          csv+=`Environnement,CO2 Scope 1+2,${data.env.co2},tCO2\n`;
          csv+=`Environnement,CO2 Scope 3,${data.env.scope3},tCO2\n`;
          csv+=`Environnement,Énergie,${data.env.energie},kWh\n`;
          csv+=`Environnement,Renouvelable,${data.env.renouvelable},%\n`;
          csv+=`Environnement,Eau,${data.env.eau},m3\n`;
          csv+=`Environnement,Déchets recyclés,${data.env.dechets},%\n`;
          csv+=`Social,Écart rémunération F/H,${data.soc.ecartSalaire},%\n`;
          csv+=`Social,Formation/salarié,${data.soc.formation},h/an\n`;
          csv+=`Social,Turnover,${data.soc.turnover},%\n`;
          csv+=`Social,Accidents TF,${data.soc.accidents},TF\n`;
          csv+=`Gouvernance,Femmes direction,${data.gov.femmesDirigeantes},%\n`;
          csv+=`Gouvernance,Formation éthique,${data.gov.ethique},%\n`;
        } else if(type==='suppliers') {
          csv='Nom,Catégorie,Score ESG,Évaluation,Certifications,Pays,Depuis\n';
          data.forEach(f=>{csv+=`"${f.nom}",${f.categorie||''},${f.scoreESG},"${f.evaluation}","${f.certifications||''}",${f.pays},${f.depuis||''}\n`;});
        }
        res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="ecoscore-${type}-${new Date().toISOString().slice(0,10)}.csv"`});
        res.end('\ufeff'+csv);
      } catch(err) { res.writeHead(500); res.end(err.message); }
    }); return;
  }

  const filePath = path.join(DIR, req.url==='/'?'index.html':req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath,(err,data)=>{
    if(err){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':MIME[ext]||'text/plain'});
    res.end(data);
  });
});

server.listen(PORT,()=>{
  console.log('\n┌──────────────────────────────────────────┐');
  console.log('│  🌿  EcoScore — Lacavalerie Group         │');
  console.log('├──────────────────────────────────────────┤');
  console.log(`│  ✅  http://localhost:${PORT}                 │`);
  console.log(`│  🔐  Mot de passe: ${ACCESS_PASSWORD}             │`);
  console.log('│  🤖  IA: configurer clé dans Paramètres  │');
  console.log('├──────────────────────────────────────────┤');
  console.log('│  Ctrl+C pour arrêter                      │');
  console.log('└──────────────────────────────────────────┘\n');
});
