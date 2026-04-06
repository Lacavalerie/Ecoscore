(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // home/claude/.npm-global/lib/node_modules/react-dom/node_modules/scheduler/cjs/scheduler.production.js
  var require_scheduler_production = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react-dom/node_modules/scheduler/cjs/scheduler.production.js"(exports) {
      "use strict";
      function push(heap, node) {
        var index = heap.length;
        heap.push(node);
        a: for (; 0 < index; ) {
          var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
          if (0 < compare(parent, node))
            heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
          else break a;
        }
      }
      function peek(heap) {
        return 0 === heap.length ? null : heap[0];
      }
      function pop(heap) {
        if (0 === heap.length) return null;
        var first = heap[0], last = heap.pop();
        if (last !== first) {
          heap[0] = last;
          a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength; ) {
            var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
            if (0 > compare(left, last))
              rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
            else if (rightIndex < length && 0 > compare(right, last))
              heap[index] = right, heap[rightIndex] = last, index = rightIndex;
            else break a;
          }
        }
        return first;
      }
      function compare(a, b) {
        var diff = a.sortIndex - b.sortIndex;
        return 0 !== diff ? diff : a.id - b.id;
      }
      exports.unstable_now = void 0;
      if ("object" === typeof performance && "function" === typeof performance.now) {
        localPerformance = performance;
        exports.unstable_now = function() {
          return localPerformance.now();
        };
      } else {
        localDate = Date, initialTime = localDate.now();
        exports.unstable_now = function() {
          return localDate.now() - initialTime;
        };
      }
      var localPerformance;
      var localDate;
      var initialTime;
      var taskQueue = [];
      var timerQueue = [];
      var taskIdCounter = 1;
      var currentTask = null;
      var currentPriorityLevel = 3;
      var isPerformingWork = false;
      var isHostCallbackScheduled = false;
      var isHostTimeoutScheduled = false;
      var needsPaint = false;
      var localSetTimeout = "function" === typeof setTimeout ? setTimeout : null;
      var localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null;
      var localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
      function advanceTimers(currentTime) {
        for (var timer = peek(timerQueue); null !== timer; ) {
          if (null === timer.callback) pop(timerQueue);
          else if (timer.startTime <= currentTime)
            pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
          else break;
          timer = peek(timerQueue);
        }
      }
      function handleTimeout(currentTime) {
        isHostTimeoutScheduled = false;
        advanceTimers(currentTime);
        if (!isHostCallbackScheduled)
          if (null !== peek(taskQueue))
            isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
          else {
            var firstTimer = peek(timerQueue);
            null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
          }
      }
      var isMessageLoopRunning = false;
      var taskTimeoutID = -1;
      var frameInterval = 5;
      var startTime = -1;
      function shouldYieldToHost() {
        return needsPaint ? true : exports.unstable_now() - startTime < frameInterval ? false : true;
      }
      function performWorkUntilDeadline() {
        needsPaint = false;
        if (isMessageLoopRunning) {
          var currentTime = exports.unstable_now();
          startTime = currentTime;
          var hasMoreWork = true;
          try {
            a: {
              isHostCallbackScheduled = false;
              isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
              isPerformingWork = true;
              var previousPriorityLevel = currentPriorityLevel;
              try {
                b: {
                  advanceTimers(currentTime);
                  for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                    var callback = currentTask.callback;
                    if ("function" === typeof callback) {
                      currentTask.callback = null;
                      currentPriorityLevel = currentTask.priorityLevel;
                      var continuationCallback = callback(
                        currentTask.expirationTime <= currentTime
                      );
                      currentTime = exports.unstable_now();
                      if ("function" === typeof continuationCallback) {
                        currentTask.callback = continuationCallback;
                        advanceTimers(currentTime);
                        hasMoreWork = true;
                        break b;
                      }
                      currentTask === peek(taskQueue) && pop(taskQueue);
                      advanceTimers(currentTime);
                    } else pop(taskQueue);
                    currentTask = peek(taskQueue);
                  }
                  if (null !== currentTask) hasMoreWork = true;
                  else {
                    var firstTimer = peek(timerQueue);
                    null !== firstTimer && requestHostTimeout(
                      handleTimeout,
                      firstTimer.startTime - currentTime
                    );
                    hasMoreWork = false;
                  }
                }
                break a;
              } finally {
                currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
              }
              hasMoreWork = void 0;
            }
          } finally {
            hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
          }
        }
      }
      var schedulePerformWorkUntilDeadline;
      if ("function" === typeof localSetImmediate)
        schedulePerformWorkUntilDeadline = function() {
          localSetImmediate(performWorkUntilDeadline);
        };
      else if ("undefined" !== typeof MessageChannel) {
        channel = new MessageChannel(), port = channel.port2;
        channel.port1.onmessage = performWorkUntilDeadline;
        schedulePerformWorkUntilDeadline = function() {
          port.postMessage(null);
        };
      } else
        schedulePerformWorkUntilDeadline = function() {
          localSetTimeout(performWorkUntilDeadline, 0);
        };
      var channel;
      var port;
      function requestHostTimeout(callback, ms) {
        taskTimeoutID = localSetTimeout(function() {
          callback(exports.unstable_now());
        }, ms);
      }
      exports.unstable_IdlePriority = 5;
      exports.unstable_ImmediatePriority = 1;
      exports.unstable_LowPriority = 4;
      exports.unstable_NormalPriority = 3;
      exports.unstable_Profiling = null;
      exports.unstable_UserBlockingPriority = 2;
      exports.unstable_cancelCallback = function(task) {
        task.callback = null;
      };
      exports.unstable_forceFrameRate = function(fps) {
        0 > fps || 125 < fps ? console.error(
          "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
        ) : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
      };
      exports.unstable_getCurrentPriorityLevel = function() {
        return currentPriorityLevel;
      };
      exports.unstable_next = function(eventHandler) {
        switch (currentPriorityLevel) {
          case 1:
          case 2:
          case 3:
            var priorityLevel = 3;
            break;
          default:
            priorityLevel = currentPriorityLevel;
        }
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = priorityLevel;
        try {
          return eventHandler();
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
      exports.unstable_requestPaint = function() {
        needsPaint = true;
      };
      exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
        switch (priorityLevel) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            priorityLevel = 3;
        }
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = priorityLevel;
        try {
          return eventHandler();
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
      exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
        var currentTime = exports.unstable_now();
        "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
        switch (priorityLevel) {
          case 1:
            var timeout = -1;
            break;
          case 2:
            timeout = 250;
            break;
          case 5:
            timeout = 1073741823;
            break;
          case 4:
            timeout = 1e4;
            break;
          default:
            timeout = 5e3;
        }
        timeout = options + timeout;
        priorityLevel = {
          id: taskIdCounter++,
          callback,
          priorityLevel,
          startTime: options,
          expirationTime: timeout,
          sortIndex: -1
        };
        options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
        return priorityLevel;
      };
      exports.unstable_shouldYield = shouldYieldToHost;
      exports.unstable_wrapCallback = function(callback) {
        var parentPriorityLevel = currentPriorityLevel;
        return function() {
          var previousPriorityLevel = currentPriorityLevel;
          currentPriorityLevel = parentPriorityLevel;
          try {
            return callback.apply(this, arguments);
          } finally {
            currentPriorityLevel = previousPriorityLevel;
          }
        };
      };
    }
  });

  // home/claude/.npm-global/lib/node_modules/react-dom/node_modules/scheduler/index.js
  var require_scheduler = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react-dom/node_modules/scheduler/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_scheduler_production();
      } else {
        module.exports = null;
      }
    }
  });

  // home/claude/.npm-global/lib/node_modules/react/cjs/react.production.js
  var require_react_production = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react/cjs/react.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
      var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
      var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
      var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
      var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
      var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      var ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function() {
        },
        enqueueReplaceState: function() {
        },
        enqueueSetState: function() {
        }
      };
      var assign = Object.assign;
      var emptyObject = {};
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      function ComponentDummy() {
      }
      ComponentDummy.prototype = Component.prototype;
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
      pureComponentPrototype.constructor = PureComponent;
      assign(pureComponentPrototype, Component.prototype);
      pureComponentPrototype.isPureReactComponent = true;
      var isArrayImpl = Array.isArray;
      function noop() {
      }
      var ReactSharedInternals = { H: null, A: null, T: null, S: null };
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function ReactElement(type, key, props) {
        var refProp = props.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== refProp ? refProp : null,
          props
        };
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        return ReactElement(oldElement.type, newKey, oldElement.props);
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      var userProvidedKeyEscapeRegex = /\/+/g;
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback)
          return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + invokeCallback
          )), array.push(callback)), 1;
        invokeCallback = 0;
        var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ctor = payload._result;
          ctor = ctor();
          ctor.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 1, payload._result = moduleObject;
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 2, payload._result = error;
            }
          );
          -1 === payload._status && (payload._status = 0, payload._result = ctor);
        }
        if (1 === payload._status) return payload._result.default;
        throw payload._result;
      }
      var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      };
      var Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = Children;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(size) {
          return ReactSharedInternals.H.useMemoCache(size);
        }
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key;
        if (null != config)
          for (propName in void 0 !== config.key && (key = "" + config.key), config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          for (var childArray = Array(propName), i = 0; i < propName; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        return ReactElement(element.type, key, props);
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        var propName, props = {}, key = null;
        if (null != config)
          for (propName in void 0 !== config.key && (key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === props[propName] && (props[propName] = childrenLength[propName]);
        return ReactElement(type, key, props);
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(render) {
        return { $$typeof: REACT_FORWARD_REF_TYPE, render };
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        return {
          $$typeof: REACT_LAZY_TYPE,
          _payload: { _status: -1, _result: ctor },
          _init: lazyInitializer
        };
      };
      exports.memo = function(type, compare) {
        return {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return ReactSharedInternals.H.useCacheRefresh();
      };
      exports.use = function(usable) {
        return ReactSharedInternals.H.use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return ReactSharedInternals.H.useActionState(action, initialState, permalink);
      };
      exports.useCallback = function(callback, deps) {
        return ReactSharedInternals.H.useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        return ReactSharedInternals.H.useContext(Context);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(value, initialValue) {
        return ReactSharedInternals.H.useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        return ReactSharedInternals.H.useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return ReactSharedInternals.H.useEffectEvent(callback);
      };
      exports.useId = function() {
        return ReactSharedInternals.H.useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        return ReactSharedInternals.H.useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        return ReactSharedInternals.H.useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return ReactSharedInternals.H.useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return ReactSharedInternals.H.useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return ReactSharedInternals.H.useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return ReactSharedInternals.H.useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return ReactSharedInternals.H.useTransition();
      };
      exports.version = "19.2.4";
    }
  });

  // home/claude/.npm-global/lib/node_modules/react/index.js
  var require_react = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_production();
      } else {
        module.exports = null;
      }
    }
  });

  // home/claude/.npm-global/lib/node_modules/react-dom/cjs/react-dom.production.js
  var require_react_dom_production = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react-dom/cjs/react-dom.production.js"(exports) {
      "use strict";
      var React = require_react();
      function formatProdErrorMessage(code) {
        var url = "https://react.dev/errors/" + code;
        if (1 < arguments.length) {
          url += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var i = 2; i < arguments.length; i++)
            url += "&args[]=" + encodeURIComponent(arguments[i]);
        }
        return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      function noop() {
      }
      var Internals = {
        d: {
          f: noop,
          r: function() {
            throw Error(formatProdErrorMessage(522));
          },
          D: noop,
          C: noop,
          L: noop,
          m: noop,
          X: noop,
          S: noop,
          M: noop
        },
        p: 0,
        findDOMNode: null
      };
      var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
      function createPortal$1(children, containerInfo, implementation) {
        var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return {
          $$typeof: REACT_PORTAL_TYPE,
          key: null == key ? null : "" + key,
          children,
          containerInfo,
          implementation
        };
      }
      var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      function getCrossOriginStringAs(as, input) {
        if ("font" === as) return "";
        if ("string" === typeof input)
          return "use-credentials" === input ? input : "";
      }
      exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
      exports.createPortal = function(children, container) {
        var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
          throw Error(formatProdErrorMessage(299));
        return createPortal$1(children, container, null, key);
      };
      exports.flushSync = function(fn) {
        var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
        try {
          if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
        } finally {
          ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
        }
      };
      exports.preconnect = function(href, options) {
        "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
      };
      exports.prefetchDNS = function(href) {
        "string" === typeof href && Internals.d.D(href);
      };
      exports.preinit = function(href, options) {
        if ("string" === typeof href && options && "string" === typeof options.as) {
          var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
          "style" === as ? Internals.d.S(
            href,
            "string" === typeof options.precedence ? options.precedence : void 0,
            {
              crossOrigin,
              integrity,
              fetchPriority
            }
          ) : "script" === as && Internals.d.X(href, {
            crossOrigin,
            integrity,
            fetchPriority,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
          });
        }
      };
      exports.preinitModule = function(href, options) {
        if ("string" === typeof href)
          if ("object" === typeof options && null !== options) {
            if (null == options.as || "script" === options.as) {
              var crossOrigin = getCrossOriginStringAs(
                options.as,
                options.crossOrigin
              );
              Internals.d.M(href, {
                crossOrigin,
                integrity: "string" === typeof options.integrity ? options.integrity : void 0,
                nonce: "string" === typeof options.nonce ? options.nonce : void 0
              });
            }
          } else null == options && Internals.d.M(href);
      };
      exports.preload = function(href, options) {
        if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
          var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
          Internals.d.L(href, as, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
            type: "string" === typeof options.type ? options.type : void 0,
            fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
            referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
            imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
            imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
            media: "string" === typeof options.media ? options.media : void 0
          });
        }
      };
      exports.preloadModule = function(href, options) {
        if ("string" === typeof href)
          if (options) {
            var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
            Internals.d.m(href, {
              as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0
            });
          } else Internals.d.m(href);
      };
      exports.requestFormReset = function(form) {
        Internals.d.r(form);
      };
      exports.unstable_batchedUpdates = function(fn, a) {
        return fn(a);
      };
      exports.useFormState = function(action, initialState, permalink) {
        return ReactSharedInternals.H.useFormState(action, initialState, permalink);
      };
      exports.useFormStatus = function() {
        return ReactSharedInternals.H.useHostTransitionStatus();
      };
      exports.version = "19.2.4";
    }
  });

  // home/claude/.npm-global/lib/node_modules/react-dom/index.js
  var require_react_dom = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react-dom/index.js"(exports, module) {
      "use strict";
      function checkDCE() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
          return;
        }
        if (false) {
          throw new Error("^_^");
        }
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
          console.error(err);
        }
      }
      if (true) {
        checkDCE();
        module.exports = require_react_dom_production();
      } else {
        module.exports = null;
      }
    }
  });

  // home/claude/.npm-global/lib/node_modules/react-dom/cjs/react-dom-client.production.js
  var require_react_dom_client_production = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react-dom/cjs/react-dom-client.production.js"(exports) {
      "use strict";
      var Scheduler = require_scheduler();
      var React = require_react();
      var ReactDOM = require_react_dom();
      function formatProdErrorMessage(code) {
        var url = "https://react.dev/errors/" + code;
        if (1 < arguments.length) {
          url += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var i = 2; i < arguments.length; i++)
            url += "&args[]=" + encodeURIComponent(arguments[i]);
        }
        return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      function isValidContainer(node) {
        return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
      }
      function getNearestMountedFiber(fiber) {
        var node = fiber, nearestMounted = fiber;
        if (fiber.alternate) for (; node.return; ) node = node.return;
        else {
          fiber = node;
          do
            node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
          while (fiber);
        }
        return 3 === node.tag ? nearestMounted : null;
      }
      function getSuspenseInstanceFromFiber(fiber) {
        if (13 === fiber.tag) {
          var suspenseState = fiber.memoizedState;
          null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
          if (null !== suspenseState) return suspenseState.dehydrated;
        }
        return null;
      }
      function getActivityInstanceFromFiber(fiber) {
        if (31 === fiber.tag) {
          var activityState = fiber.memoizedState;
          null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
          if (null !== activityState) return activityState.dehydrated;
        }
        return null;
      }
      function assertIsMounted(fiber) {
        if (getNearestMountedFiber(fiber) !== fiber)
          throw Error(formatProdErrorMessage(188));
      }
      function findCurrentFiberUsingSlowPath(fiber) {
        var alternate = fiber.alternate;
        if (!alternate) {
          alternate = getNearestMountedFiber(fiber);
          if (null === alternate) throw Error(formatProdErrorMessage(188));
          return alternate !== fiber ? null : fiber;
        }
        for (var a = fiber, b = alternate; ; ) {
          var parentA = a.return;
          if (null === parentA) break;
          var parentB = parentA.alternate;
          if (null === parentB) {
            b = parentA.return;
            if (null !== b) {
              a = b;
              continue;
            }
            break;
          }
          if (parentA.child === parentB.child) {
            for (parentB = parentA.child; parentB; ) {
              if (parentB === a) return assertIsMounted(parentA), fiber;
              if (parentB === b) return assertIsMounted(parentA), alternate;
              parentB = parentB.sibling;
            }
            throw Error(formatProdErrorMessage(188));
          }
          if (a.return !== b.return) a = parentA, b = parentB;
          else {
            for (var didFindChild = false, child$0 = parentA.child; child$0; ) {
              if (child$0 === a) {
                didFindChild = true;
                a = parentA;
                b = parentB;
                break;
              }
              if (child$0 === b) {
                didFindChild = true;
                b = parentA;
                a = parentB;
                break;
              }
              child$0 = child$0.sibling;
            }
            if (!didFindChild) {
              for (child$0 = parentB.child; child$0; ) {
                if (child$0 === a) {
                  didFindChild = true;
                  a = parentB;
                  b = parentA;
                  break;
                }
                if (child$0 === b) {
                  didFindChild = true;
                  b = parentB;
                  a = parentA;
                  break;
                }
                child$0 = child$0.sibling;
              }
              if (!didFindChild) throw Error(formatProdErrorMessage(189));
            }
          }
          if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
        }
        if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
        return a.stateNode.current === a ? fiber : alternate;
      }
      function findCurrentHostFiberImpl(node) {
        var tag = node.tag;
        if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
        for (node = node.child; null !== node; ) {
          tag = findCurrentHostFiberImpl(node);
          if (null !== tag) return tag;
          node = node.sibling;
        }
        return null;
      }
      var assign = Object.assign;
      var REACT_LEGACY_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element");
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
      var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
      var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
      var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
      var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
      var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch (type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      var isArrayImpl = Array.isArray;
      var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      var sharedNotPendingObject = {
        pending: false,
        data: null,
        method: null,
        action: null
      };
      var valueStack = [];
      var index = -1;
      function createCursor(defaultValue) {
        return { current: defaultValue };
      }
      function pop(cursor) {
        0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
      }
      function push(cursor, value) {
        index++;
        valueStack[index] = cursor.current;
        cursor.current = value;
      }
      var contextStackCursor = createCursor(null);
      var contextFiberStackCursor = createCursor(null);
      var rootInstanceStackCursor = createCursor(null);
      var hostTransitionProviderCursor = createCursor(null);
      function pushHostContainer(fiber, nextRootInstance) {
        push(rootInstanceStackCursor, nextRootInstance);
        push(contextFiberStackCursor, fiber);
        push(contextStackCursor, null);
        switch (nextRootInstance.nodeType) {
          case 9:
          case 11:
            fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
            break;
          default:
            if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI)
              nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
            else
              switch (fiber) {
                case "svg":
                  fiber = 1;
                  break;
                case "math":
                  fiber = 2;
                  break;
                default:
                  fiber = 0;
              }
        }
        pop(contextStackCursor);
        push(contextStackCursor, fiber);
      }
      function popHostContainer() {
        pop(contextStackCursor);
        pop(contextFiberStackCursor);
        pop(rootInstanceStackCursor);
      }
      function pushHostContext(fiber) {
        null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
        var context = contextStackCursor.current;
        var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
        context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
      }
      function popHostContext(fiber) {
        contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
        hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
      }
      var prefix;
      var suffix;
      function describeBuiltInComponentFrame(name) {
        if (void 0 === prefix)
          try {
            throw Error();
          } catch (x) {
            var match = x.stack.trim().match(/\n( *(at )?)/);
            prefix = match && match[1] || "";
            suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
          }
        return "\n" + prefix + name + suffix;
      }
      var reentry = false;
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry) return "";
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
          var RunInRootFrame = {
            DetermineComponentFrameRoot: function() {
              try {
                if (construct) {
                  var Fake = function() {
                    throw Error();
                  };
                  Object.defineProperty(Fake.prototype, "props", {
                    set: function() {
                      throw Error();
                    }
                  });
                  if ("object" === typeof Reflect && Reflect.construct) {
                    try {
                      Reflect.construct(Fake, []);
                    } catch (x) {
                      var control = x;
                    }
                    Reflect.construct(fn, [], Fake);
                  } else {
                    try {
                      Fake.call();
                    } catch (x$1) {
                      control = x$1;
                    }
                    fn.call(Fake.prototype);
                  }
                } else {
                  try {
                    throw Error();
                  } catch (x$2) {
                    control = x$2;
                  }
                  (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
                  });
                }
              } catch (sample) {
                if (sample && control && "string" === typeof sample.stack)
                  return [sample.stack, control.stack];
              }
              return [null, null];
            }
          };
          RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
          var namePropDescriptor = Object.getOwnPropertyDescriptor(
            RunInRootFrame.DetermineComponentFrameRoot,
            "name"
          );
          namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
            RunInRootFrame.DetermineComponentFrameRoot,
            "name",
            { value: "DetermineComponentFrameRoot" }
          );
          var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
          if (sampleStack && controlStack) {
            var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
            for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
              RunInRootFrame++;
            for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
              "DetermineComponentFrameRoot"
            ); )
              namePropDescriptor++;
            if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
              for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
                namePropDescriptor--;
            for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
              if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                  do
                    if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                      var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                      fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                      return frame;
                    }
                  while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
                }
                break;
              }
          }
        } finally {
          reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
        }
        return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
      }
      function describeFiber(fiber, childFiber) {
        switch (fiber.tag) {
          case 26:
          case 27:
          case 5:
            return describeBuiltInComponentFrame(fiber.type);
          case 16:
            return describeBuiltInComponentFrame("Lazy");
          case 13:
            return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
          case 19:
            return describeBuiltInComponentFrame("SuspenseList");
          case 0:
          case 15:
            return describeNativeComponentFrame(fiber.type, false);
          case 11:
            return describeNativeComponentFrame(fiber.type.render, false);
          case 1:
            return describeNativeComponentFrame(fiber.type, true);
          case 31:
            return describeBuiltInComponentFrame("Activity");
          default:
            return "";
        }
      }
      function getStackByFiberInDevAndProd(workInProgress2) {
        try {
          var info = "", previous = null;
          do
            info += describeFiber(workInProgress2, previous), previous = workInProgress2, workInProgress2 = workInProgress2.return;
          while (workInProgress2);
          return info;
        } catch (x) {
          return "\nError generating stack: " + x.message + "\n" + x.stack;
        }
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var scheduleCallback$3 = Scheduler.unstable_scheduleCallback;
      var cancelCallback$1 = Scheduler.unstable_cancelCallback;
      var shouldYield = Scheduler.unstable_shouldYield;
      var requestPaint = Scheduler.unstable_requestPaint;
      var now = Scheduler.unstable_now;
      var getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel;
      var ImmediatePriority = Scheduler.unstable_ImmediatePriority;
      var UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
      var NormalPriority$1 = Scheduler.unstable_NormalPriority;
      var LowPriority = Scheduler.unstable_LowPriority;
      var IdlePriority = Scheduler.unstable_IdlePriority;
      var log$1 = Scheduler.log;
      var unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue;
      var rendererID = null;
      var injectedHook = null;
      function setIsStrictModeForDevtools(newIsStrictMode) {
        "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
        if (injectedHook && "function" === typeof injectedHook.setStrictMode)
          try {
            injectedHook.setStrictMode(rendererID, newIsStrictMode);
          } catch (err) {
          }
      }
      var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
      var log = Math.log;
      var LN2 = Math.LN2;
      function clz32Fallback(x) {
        x >>>= 0;
        return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
      }
      var nextTransitionUpdateLane = 256;
      var nextTransitionDeferredLane = 262144;
      var nextRetryLane = 4194304;
      function getHighestPriorityLanes(lanes) {
        var pendingSyncLanes = lanes & 42;
        if (0 !== pendingSyncLanes) return pendingSyncLanes;
        switch (lanes & -lanes) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 4:
            return 4;
          case 8:
            return 8;
          case 16:
            return 16;
          case 32:
            return 32;
          case 64:
            return 64;
          case 128:
            return 128;
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
            return lanes & 261888;
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return lanes & 3932160;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
            return lanes & 62914560;
          case 67108864:
            return 67108864;
          case 134217728:
            return 134217728;
          case 268435456:
            return 268435456;
          case 536870912:
            return 536870912;
          case 1073741824:
            return 0;
          default:
            return lanes;
        }
      }
      function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
        var pendingLanes = root2.pendingLanes;
        if (0 === pendingLanes) return 0;
        var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
        root2 = root2.warmLanes;
        var nonIdlePendingLanes = pendingLanes & 134217727;
        0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
        return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
      }
      function checkIfRootIsPrerendering(root2, renderLanes2) {
        return 0 === (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2);
      }
      function computeExpirationTime(lane, currentTime) {
        switch (lane) {
          case 1:
          case 2:
          case 4:
          case 8:
          case 64:
            return currentTime + 250;
          case 16:
          case 32:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return currentTime + 5e3;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
            return -1;
          case 67108864:
          case 134217728:
          case 268435456:
          case 536870912:
          case 1073741824:
            return -1;
          default:
            return -1;
        }
      }
      function claimNextRetryLane() {
        var lane = nextRetryLane;
        nextRetryLane <<= 1;
        0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
        return lane;
      }
      function createLaneMap(initial) {
        for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
        return laneMap;
      }
      function markRootUpdated$1(root2, updateLane) {
        root2.pendingLanes |= updateLane;
        268435456 !== updateLane && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
      }
      function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
        var previouslyPendingLanes = root2.pendingLanes;
        root2.pendingLanes = remainingLanes;
        root2.suspendedLanes = 0;
        root2.pingedLanes = 0;
        root2.warmLanes = 0;
        root2.expiredLanes &= remainingLanes;
        root2.entangledLanes &= remainingLanes;
        root2.errorRecoveryDisabledLanes &= remainingLanes;
        root2.shellSuspendCounter = 0;
        var entanglements = root2.entanglements, expirationTimes = root2.expirationTimes, hiddenUpdates = root2.hiddenUpdates;
        for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes; ) {
          var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
          entanglements[index$7] = 0;
          expirationTimes[index$7] = -1;
          var hiddenUpdatesForLane = hiddenUpdates[index$7];
          if (null !== hiddenUpdatesForLane)
            for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
              var update = hiddenUpdatesForLane[index$7];
              null !== update && (update.lane &= -536870913);
            }
          remainingLanes &= ~lane;
        }
        0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, 0);
        0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root2.tag && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
      }
      function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
        root2.pendingLanes |= spawnedLane;
        root2.suspendedLanes &= ~spawnedLane;
        var spawnedLaneIndex = 31 - clz32(spawnedLane);
        root2.entangledLanes |= spawnedLane;
        root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
      }
      function markRootEntangled(root2, entangledLanes) {
        var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
        for (root2 = root2.entanglements; rootEntangledLanes; ) {
          var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
          lane & entangledLanes | root2[index$8] & entangledLanes && (root2[index$8] |= entangledLanes);
          rootEntangledLanes &= ~lane;
        }
      }
      function getBumpedLaneForHydration(root2, renderLanes2) {
        var renderLane = renderLanes2 & -renderLanes2;
        renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
        return 0 !== (renderLane & (root2.suspendedLanes | renderLanes2)) ? 0 : renderLane;
      }
      function getBumpedLaneForHydrationByLane(lane) {
        switch (lane) {
          case 2:
            lane = 1;
            break;
          case 8:
            lane = 4;
            break;
          case 32:
            lane = 16;
            break;
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
            lane = 128;
            break;
          case 268435456:
            lane = 134217728;
            break;
          default:
            lane = 0;
        }
        return lane;
      }
      function lanesToEventPriority(lanes) {
        lanes &= -lanes;
        return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
      }
      function resolveUpdatePriority() {
        var updatePriority = ReactDOMSharedInternals.p;
        if (0 !== updatePriority) return updatePriority;
        updatePriority = window.event;
        return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
      }
      function runWithPriority(priority, fn) {
        var previousPriority = ReactDOMSharedInternals.p;
        try {
          return ReactDOMSharedInternals.p = priority, fn();
        } finally {
          ReactDOMSharedInternals.p = previousPriority;
        }
      }
      var randomKey = Math.random().toString(36).slice(2);
      var internalInstanceKey = "__reactFiber$" + randomKey;
      var internalPropsKey = "__reactProps$" + randomKey;
      var internalContainerInstanceKey = "__reactContainer$" + randomKey;
      var internalEventHandlersKey = "__reactEvents$" + randomKey;
      var internalEventHandlerListenersKey = "__reactListeners$" + randomKey;
      var internalEventHandlesSetKey = "__reactHandles$" + randomKey;
      var internalRootNodeResourcesKey = "__reactResources$" + randomKey;
      var internalHoistableMarker = "__reactMarker$" + randomKey;
      function detachDeletedInstance(node) {
        delete node[internalInstanceKey];
        delete node[internalPropsKey];
        delete node[internalEventHandlersKey];
        delete node[internalEventHandlerListenersKey];
        delete node[internalEventHandlesSetKey];
      }
      function getClosestInstanceFromNode(targetNode) {
        var targetInst = targetNode[internalInstanceKey];
        if (targetInst) return targetInst;
        for (var parentNode = targetNode.parentNode; parentNode; ) {
          if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
            parentNode = targetInst.alternate;
            if (null !== targetInst.child || null !== parentNode && null !== parentNode.child)
              for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode; ) {
                if (parentNode = targetNode[internalInstanceKey]) return parentNode;
                targetNode = getParentHydrationBoundary(targetNode);
              }
            return targetInst;
          }
          targetNode = parentNode;
          parentNode = targetNode.parentNode;
        }
        return null;
      }
      function getInstanceFromNode(node) {
        if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
          var tag = node.tag;
          if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag)
            return node;
        }
        return null;
      }
      function getNodeFromInstance(inst) {
        var tag = inst.tag;
        if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
        throw Error(formatProdErrorMessage(33));
      }
      function getResourcesFromRoot(root2) {
        var resources = root2[internalRootNodeResourcesKey];
        resources || (resources = root2[internalRootNodeResourcesKey] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() });
        return resources;
      }
      function markNodeAsHoistable(node) {
        node[internalHoistableMarker] = true;
      }
      var allNativeEvents = /* @__PURE__ */ new Set();
      var registrationNameDependencies = {};
      function registerTwoPhaseEvent(registrationName, dependencies) {
        registerDirectEvent(registrationName, dependencies);
        registerDirectEvent(registrationName + "Capture", dependencies);
      }
      function registerDirectEvent(registrationName, dependencies) {
        registrationNameDependencies[registrationName] = dependencies;
        for (registrationName = 0; registrationName < dependencies.length; registrationName++)
          allNativeEvents.add(dependencies[registrationName]);
      }
      var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
        "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
      );
      var illegalAttributeNameCache = {};
      var validatedAttributeNameCache = {};
      function isAttributeNameSafe(attributeName) {
        if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
          return true;
        if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
        if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
          return validatedAttributeNameCache[attributeName] = true;
        illegalAttributeNameCache[attributeName] = true;
        return false;
      }
      function setValueForAttribute(node, name, value) {
        if (isAttributeNameSafe(name))
          if (null === value) node.removeAttribute(name);
          else {
            switch (typeof value) {
              case "undefined":
              case "function":
              case "symbol":
                node.removeAttribute(name);
                return;
              case "boolean":
                var prefix$10 = name.toLowerCase().slice(0, 5);
                if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
                  node.removeAttribute(name);
                  return;
                }
            }
            node.setAttribute(name, "" + value);
          }
      }
      function setValueForKnownAttribute(node, name, value) {
        if (null === value) node.removeAttribute(name);
        else {
          switch (typeof value) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
              node.removeAttribute(name);
              return;
          }
          node.setAttribute(name, "" + value);
        }
      }
      function setValueForNamespacedAttribute(node, namespace, name, value) {
        if (null === value) node.removeAttribute(name);
        else {
          switch (typeof value) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
              node.removeAttribute(name);
              return;
          }
          node.setAttributeNS(namespace, name, "" + value);
        }
      }
      function getToStringValue(value) {
        switch (typeof value) {
          case "bigint":
          case "boolean":
          case "number":
          case "string":
          case "undefined":
            return value;
          case "object":
            return value;
          default:
            return "";
        }
      }
      function isCheckable(elem) {
        var type = elem.type;
        return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
      }
      function trackValueOnNode(node, valueField, currentValue) {
        var descriptor = Object.getOwnPropertyDescriptor(
          node.constructor.prototype,
          valueField
        );
        if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
          var get = descriptor.get, set = descriptor.set;
          Object.defineProperty(node, valueField, {
            configurable: true,
            get: function() {
              return get.call(this);
            },
            set: function(value) {
              currentValue = "" + value;
              set.call(this, value);
            }
          });
          Object.defineProperty(node, valueField, {
            enumerable: descriptor.enumerable
          });
          return {
            getValue: function() {
              return currentValue;
            },
            setValue: function(value) {
              currentValue = "" + value;
            },
            stopTracking: function() {
              node._valueTracker = null;
              delete node[valueField];
            }
          };
        }
      }
      function track(node) {
        if (!node._valueTracker) {
          var valueField = isCheckable(node) ? "checked" : "value";
          node._valueTracker = trackValueOnNode(
            node,
            valueField,
            "" + node[valueField]
          );
        }
      }
      function updateValueIfChanged(node) {
        if (!node) return false;
        var tracker = node._valueTracker;
        if (!tracker) return true;
        var lastValue = tracker.getValue();
        var value = "";
        node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
        node = value;
        return node !== lastValue ? (tracker.setValue(node), true) : false;
      }
      function getActiveElement(doc) {
        doc = doc || ("undefined" !== typeof document ? document : void 0);
        if ("undefined" === typeof doc) return null;
        try {
          return doc.activeElement || doc.body;
        } catch (e) {
          return doc.body;
        }
      }
      var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
      function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
        return value.replace(
          escapeSelectorAttributeValueInsideDoubleQuotesRegex,
          function(ch) {
            return "\\" + ch.charCodeAt(0).toString(16) + " ";
          }
        );
      }
      function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
        element.name = "";
        null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
        if (null != value)
          if ("number" === type) {
            if (0 === value && "" === element.value || element.value != value)
              element.value = "" + getToStringValue(value);
          } else
            element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
        else
          "submit" !== type && "reset" !== type || element.removeAttribute("value");
        null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
        null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
        null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
        null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
      }
      function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating2) {
        null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
        if (null != value || null != defaultValue) {
          if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
            track(element);
            return;
          }
          defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
          value = null != value ? "" + getToStringValue(value) : defaultValue;
          isHydrating2 || value === element.value || (element.value = value);
          element.defaultValue = value;
        }
        checked = null != checked ? checked : defaultChecked;
        checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
        element.checked = isHydrating2 ? element.checked : !!checked;
        element.defaultChecked = !!checked;
        null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
        track(element);
      }
      function setDefaultValue(node, type, value) {
        "number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
      }
      function updateOptions(node, multiple, propValue, setDefaultSelected) {
        node = node.options;
        if (multiple) {
          multiple = {};
          for (var i = 0; i < propValue.length; i++)
            multiple["$" + propValue[i]] = true;
          for (propValue = 0; propValue < node.length; propValue++)
            i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
        } else {
          propValue = "" + getToStringValue(propValue);
          multiple = null;
          for (i = 0; i < node.length; i++) {
            if (node[i].value === propValue) {
              node[i].selected = true;
              setDefaultSelected && (node[i].defaultSelected = true);
              return;
            }
            null !== multiple || node[i].disabled || (multiple = node[i]);
          }
          null !== multiple && (multiple.selected = true);
        }
      }
      function updateTextarea(element, value, defaultValue) {
        if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
          element.defaultValue !== value && (element.defaultValue = value);
          return;
        }
        element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
      }
      function initTextarea(element, value, defaultValue, children) {
        if (null == value) {
          if (null != children) {
            if (null != defaultValue) throw Error(formatProdErrorMessage(92));
            if (isArrayImpl(children)) {
              if (1 < children.length) throw Error(formatProdErrorMessage(93));
              children = children[0];
            }
            defaultValue = children;
          }
          null == defaultValue && (defaultValue = "");
          value = defaultValue;
        }
        defaultValue = getToStringValue(value);
        element.defaultValue = defaultValue;
        children = element.textContent;
        children === defaultValue && "" !== children && null !== children && (element.value = children);
        track(element);
      }
      function setTextContent(node, text) {
        if (text) {
          var firstChild = node.firstChild;
          if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
            firstChild.nodeValue = text;
            return;
          }
        }
        node.textContent = text;
      }
      var unitlessNumbers = new Set(
        "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
          " "
        )
      );
      function setValueForStyle(style2, styleName, value) {
        var isCustomProperty = 0 === styleName.indexOf("--");
        null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style2.setProperty(styleName, "") : "float" === styleName ? style2.cssFloat = "" : style2[styleName] = "" : isCustomProperty ? style2.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style2.cssFloat = value : style2[styleName] = ("" + value).trim() : style2[styleName] = value + "px";
      }
      function setValueForStyles(node, styles, prevStyles) {
        if (null != styles && "object" !== typeof styles)
          throw Error(formatProdErrorMessage(62));
        node = node.style;
        if (null != prevStyles) {
          for (var styleName in prevStyles)
            !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
          for (var styleName$16 in styles)
            styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
        } else
          for (var styleName$17 in styles)
            styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
      }
      function isCustomElement(tagName) {
        if (-1 === tagName.indexOf("-")) return false;
        switch (tagName) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return false;
          default:
            return true;
        }
      }
      var aliases = /* @__PURE__ */ new Map([
        ["acceptCharset", "accept-charset"],
        ["htmlFor", "for"],
        ["httpEquiv", "http-equiv"],
        ["crossOrigin", "crossorigin"],
        ["accentHeight", "accent-height"],
        ["alignmentBaseline", "alignment-baseline"],
        ["arabicForm", "arabic-form"],
        ["baselineShift", "baseline-shift"],
        ["capHeight", "cap-height"],
        ["clipPath", "clip-path"],
        ["clipRule", "clip-rule"],
        ["colorInterpolation", "color-interpolation"],
        ["colorInterpolationFilters", "color-interpolation-filters"],
        ["colorProfile", "color-profile"],
        ["colorRendering", "color-rendering"],
        ["dominantBaseline", "dominant-baseline"],
        ["enableBackground", "enable-background"],
        ["fillOpacity", "fill-opacity"],
        ["fillRule", "fill-rule"],
        ["floodColor", "flood-color"],
        ["floodOpacity", "flood-opacity"],
        ["fontFamily", "font-family"],
        ["fontSize", "font-size"],
        ["fontSizeAdjust", "font-size-adjust"],
        ["fontStretch", "font-stretch"],
        ["fontStyle", "font-style"],
        ["fontVariant", "font-variant"],
        ["fontWeight", "font-weight"],
        ["glyphName", "glyph-name"],
        ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
        ["glyphOrientationVertical", "glyph-orientation-vertical"],
        ["horizAdvX", "horiz-adv-x"],
        ["horizOriginX", "horiz-origin-x"],
        ["imageRendering", "image-rendering"],
        ["letterSpacing", "letter-spacing"],
        ["lightingColor", "lighting-color"],
        ["markerEnd", "marker-end"],
        ["markerMid", "marker-mid"],
        ["markerStart", "marker-start"],
        ["overlinePosition", "overline-position"],
        ["overlineThickness", "overline-thickness"],
        ["paintOrder", "paint-order"],
        ["panose-1", "panose-1"],
        ["pointerEvents", "pointer-events"],
        ["renderingIntent", "rendering-intent"],
        ["shapeRendering", "shape-rendering"],
        ["stopColor", "stop-color"],
        ["stopOpacity", "stop-opacity"],
        ["strikethroughPosition", "strikethrough-position"],
        ["strikethroughThickness", "strikethrough-thickness"],
        ["strokeDasharray", "stroke-dasharray"],
        ["strokeDashoffset", "stroke-dashoffset"],
        ["strokeLinecap", "stroke-linecap"],
        ["strokeLinejoin", "stroke-linejoin"],
        ["strokeMiterlimit", "stroke-miterlimit"],
        ["strokeOpacity", "stroke-opacity"],
        ["strokeWidth", "stroke-width"],
        ["textAnchor", "text-anchor"],
        ["textDecoration", "text-decoration"],
        ["textRendering", "text-rendering"],
        ["transformOrigin", "transform-origin"],
        ["underlinePosition", "underline-position"],
        ["underlineThickness", "underline-thickness"],
        ["unicodeBidi", "unicode-bidi"],
        ["unicodeRange", "unicode-range"],
        ["unitsPerEm", "units-per-em"],
        ["vAlphabetic", "v-alphabetic"],
        ["vHanging", "v-hanging"],
        ["vIdeographic", "v-ideographic"],
        ["vMathematical", "v-mathematical"],
        ["vectorEffect", "vector-effect"],
        ["vertAdvY", "vert-adv-y"],
        ["vertOriginX", "vert-origin-x"],
        ["vertOriginY", "vert-origin-y"],
        ["wordSpacing", "word-spacing"],
        ["writingMode", "writing-mode"],
        ["xmlnsXlink", "xmlns:xlink"],
        ["xHeight", "x-height"]
      ]);
      var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
      function sanitizeURL(url) {
        return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
      }
      function noop$1() {
      }
      var currentReplayingEvent = null;
      function getEventTarget(nativeEvent) {
        nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
        nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
        return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
      }
      var restoreTarget = null;
      var restoreQueue = null;
      function restoreStateOfTarget(target) {
        var internalInstance = getInstanceFromNode(target);
        if (internalInstance && (target = internalInstance.stateNode)) {
          var props = target[internalPropsKey] || null;
          a: switch (target = internalInstance.stateNode, internalInstance.type) {
            case "input":
              updateInput(
                target,
                props.value,
                props.defaultValue,
                props.defaultValue,
                props.checked,
                props.defaultChecked,
                props.type,
                props.name
              );
              internalInstance = props.name;
              if ("radio" === props.type && null != internalInstance) {
                for (props = target; props.parentNode; ) props = props.parentNode;
                props = props.querySelectorAll(
                  'input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes(
                    "" + internalInstance
                  ) + '"][type="radio"]'
                );
                for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
                  var otherNode = props[internalInstance];
                  if (otherNode !== target && otherNode.form === target.form) {
                    var otherProps = otherNode[internalPropsKey] || null;
                    if (!otherProps) throw Error(formatProdErrorMessage(90));
                    updateInput(
                      otherNode,
                      otherProps.value,
                      otherProps.defaultValue,
                      otherProps.defaultValue,
                      otherProps.checked,
                      otherProps.defaultChecked,
                      otherProps.type,
                      otherProps.name
                    );
                  }
                }
                for (internalInstance = 0; internalInstance < props.length; internalInstance++)
                  otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
              }
              break a;
            case "textarea":
              updateTextarea(target, props.value, props.defaultValue);
              break a;
            case "select":
              internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
          }
        }
      }
      var isInsideEventHandler = false;
      function batchedUpdates$1(fn, a, b) {
        if (isInsideEventHandler) return fn(a, b);
        isInsideEventHandler = true;
        try {
          var JSCompiler_inline_result = fn(a);
          return JSCompiler_inline_result;
        } finally {
          if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
            if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn))
              for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
          }
        }
      }
      function getListener(inst, registrationName) {
        var stateNode = inst.stateNode;
        if (null === stateNode) return null;
        var props = stateNode[internalPropsKey] || null;
        if (null === props) return null;
        stateNode = props[registrationName];
        a: switch (registrationName) {
          case "onClick":
          case "onClickCapture":
          case "onDoubleClick":
          case "onDoubleClickCapture":
          case "onMouseDown":
          case "onMouseDownCapture":
          case "onMouseMove":
          case "onMouseMoveCapture":
          case "onMouseUp":
          case "onMouseUpCapture":
          case "onMouseEnter":
            (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
            inst = !props;
            break a;
          default:
            inst = false;
        }
        if (inst) return null;
        if (stateNode && "function" !== typeof stateNode)
          throw Error(
            formatProdErrorMessage(231, registrationName, typeof stateNode)
          );
        return stateNode;
      }
      var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
      var passiveBrowserEventsSupported = false;
      if (canUseDOM)
        try {
          options = {};
          Object.defineProperty(options, "passive", {
            get: function() {
              passiveBrowserEventsSupported = true;
            }
          });
          window.addEventListener("test", options, options);
          window.removeEventListener("test", options, options);
        } catch (e) {
          passiveBrowserEventsSupported = false;
        }
      var options;
      var root = null;
      var startText = null;
      var fallbackText = null;
      function getData() {
        if (fallbackText) return fallbackText;
        var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
        for (start = 0; start < startLength && startValue[start] === endValue[start]; start++) ;
        var minEnd = startLength - start;
        for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++) ;
        return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
      }
      function getEventCharCode(nativeEvent) {
        var keyCode = nativeEvent.keyCode;
        "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
        10 === nativeEvent && (nativeEvent = 13);
        return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
      }
      function functionThatReturnsTrue() {
        return true;
      }
      function functionThatReturnsFalse() {
        return false;
      }
      function createSyntheticEvent(Interface) {
        function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
          this._reactName = reactName;
          this._targetInst = targetInst;
          this.type = reactEventType;
          this.nativeEvent = nativeEvent;
          this.target = nativeEventTarget;
          this.currentTarget = null;
          for (var propName in Interface)
            Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
          this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
          this.isPropagationStopped = functionThatReturnsFalse;
          return this;
        }
        assign(SyntheticBaseEvent.prototype, {
          preventDefault: function() {
            this.defaultPrevented = true;
            var event = this.nativeEvent;
            event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
          },
          stopPropagation: function() {
            var event = this.nativeEvent;
            event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
          },
          persist: function() {
          },
          isPersistent: functionThatReturnsTrue
        });
        return SyntheticBaseEvent;
      }
      var EventInterface = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(event) {
          return event.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0
      };
      var SyntheticEvent = createSyntheticEvent(EventInterface);
      var UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 });
      var SyntheticUIEvent = createSyntheticEvent(UIEventInterface);
      var lastMovementX;
      var lastMovementY;
      var lastMouseEvent;
      var MouseEventInterface = assign({}, UIEventInterface, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: getEventModifierState,
        button: 0,
        buttons: 0,
        relatedTarget: function(event) {
          return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
        },
        movementX: function(event) {
          if ("movementX" in event) return event.movementX;
          event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
          return lastMovementX;
        },
        movementY: function(event) {
          return "movementY" in event ? event.movementY : lastMovementY;
        }
      });
      var SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
      var DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 });
      var SyntheticDragEvent = createSyntheticEvent(DragEventInterface);
      var FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 });
      var SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface);
      var AnimationEventInterface = assign({}, EventInterface, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
      });
      var SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface);
      var ClipboardEventInterface = assign({}, EventInterface, {
        clipboardData: function(event) {
          return "clipboardData" in event ? event.clipboardData : window.clipboardData;
        }
      });
      var SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface);
      var CompositionEventInterface = assign({}, EventInterface, { data: 0 });
      var SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface);
      var normalizeKey = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
      };
      var translateToKey = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
      };
      var modifierKeyToProp = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
      };
      function modifierStateGetter(keyArg) {
        var nativeEvent = this.nativeEvent;
        return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
      }
      function getEventModifierState() {
        return modifierStateGetter;
      }
      var KeyboardEventInterface = assign({}, UIEventInterface, {
        key: function(nativeEvent) {
          if (nativeEvent.key) {
            var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
            if ("Unidentified" !== key) return key;
          }
          return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: getEventModifierState,
        charCode: function(event) {
          return "keypress" === event.type ? getEventCharCode(event) : 0;
        },
        keyCode: function(event) {
          return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
        },
        which: function(event) {
          return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
        }
      });
      var SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface);
      var PointerEventInterface = assign({}, MouseEventInterface, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
      });
      var SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface);
      var TouchEventInterface = assign({}, UIEventInterface, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: getEventModifierState
      });
      var SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
      var TransitionEventInterface = assign({}, EventInterface, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
      });
      var SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface);
      var WheelEventInterface = assign({}, MouseEventInterface, {
        deltaX: function(event) {
          return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
        },
        deltaY: function(event) {
          return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
        },
        deltaZ: 0,
        deltaMode: 0
      });
      var SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
      var ToggleEventInterface = assign({}, EventInterface, {
        newState: 0,
        oldState: 0
      });
      var SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface);
      var END_KEYCODES = [9, 13, 27, 32];
      var canUseCompositionEvent = canUseDOM && "CompositionEvent" in window;
      var documentMode = null;
      canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
      var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode;
      var useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode);
      var SPACEBAR_CHAR = String.fromCharCode(32);
      var hasSpaceKeypress = false;
      function isFallbackCompositionEnd(domEventName, nativeEvent) {
        switch (domEventName) {
          case "keyup":
            return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
          case "keydown":
            return 229 !== nativeEvent.keyCode;
          case "keypress":
          case "mousedown":
          case "focusout":
            return true;
          default:
            return false;
        }
      }
      function getDataFromCustomEvent(nativeEvent) {
        nativeEvent = nativeEvent.detail;
        return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
      }
      var isComposing = false;
      function getNativeBeforeInputChars(domEventName, nativeEvent) {
        switch (domEventName) {
          case "compositionend":
            return getDataFromCustomEvent(nativeEvent);
          case "keypress":
            if (32 !== nativeEvent.which) return null;
            hasSpaceKeypress = true;
            return SPACEBAR_CHAR;
          case "textInput":
            return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
          default:
            return null;
        }
      }
      function getFallbackBeforeInputChars(domEventName, nativeEvent) {
        if (isComposing)
          return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = false, domEventName) : null;
        switch (domEventName) {
          case "paste":
            return null;
          case "keypress":
            if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
              if (nativeEvent.char && 1 < nativeEvent.char.length)
                return nativeEvent.char;
              if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
            }
            return null;
          case "compositionend":
            return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
          default:
            return null;
        }
      }
      var supportedInputTypes = {
        color: true,
        date: true,
        datetime: true,
        "datetime-local": true,
        email: true,
        month: true,
        number: true,
        password: true,
        range: true,
        search: true,
        tel: true,
        text: true,
        time: true,
        url: true,
        week: true
      };
      function isTextInputElement(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
      }
      function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
        restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
        inst = accumulateTwoPhaseListeners(inst, "onChange");
        0 < inst.length && (nativeEvent = new SyntheticEvent(
          "onChange",
          "change",
          null,
          nativeEvent,
          target
        ), dispatchQueue.push({ event: nativeEvent, listeners: inst }));
      }
      var activeElement$1 = null;
      var activeElementInst$1 = null;
      function runEventInBatch(dispatchQueue) {
        processDispatchQueue(dispatchQueue, 0);
      }
      function getInstIfValueChanged(targetInst) {
        var targetNode = getNodeFromInstance(targetInst);
        if (updateValueIfChanged(targetNode)) return targetInst;
      }
      function getTargetInstForChangeEvent(domEventName, targetInst) {
        if ("change" === domEventName) return targetInst;
      }
      var isInputEventSupported = false;
      if (canUseDOM) {
        if (canUseDOM) {
          isSupported$jscomp$inline_427 = "oninput" in document;
          if (!isSupported$jscomp$inline_427) {
            element$jscomp$inline_428 = document.createElement("div");
            element$jscomp$inline_428.setAttribute("oninput", "return;");
            isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
          }
          JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
        } else JSCompiler_inline_result$jscomp$286 = false;
        isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
      }
      var JSCompiler_inline_result$jscomp$286;
      var isSupported$jscomp$inline_427;
      var element$jscomp$inline_428;
      function stopWatchingForValueChange() {
        activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
      }
      function handlePropertyChange(nativeEvent) {
        if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
          var dispatchQueue = [];
          createAndAccumulateChangeEvent(
            dispatchQueue,
            activeElementInst$1,
            nativeEvent,
            getEventTarget(nativeEvent)
          );
          batchedUpdates$1(runEventInBatch, dispatchQueue);
        }
      }
      function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
        "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
      }
      function getTargetInstForInputEventPolyfill(domEventName) {
        if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName)
          return getInstIfValueChanged(activeElementInst$1);
      }
      function getTargetInstForClickEvent(domEventName, targetInst) {
        if ("click" === domEventName) return getInstIfValueChanged(targetInst);
      }
      function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
        if ("input" === domEventName || "change" === domEventName)
          return getInstIfValueChanged(targetInst);
      }
      function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
      }
      var objectIs = "function" === typeof Object.is ? Object.is : is;
      function shallowEqual(objA, objB) {
        if (objectIs(objA, objB)) return true;
        if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB)
          return false;
        var keysA = Object.keys(objA), keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return false;
        for (keysB = 0; keysB < keysA.length; keysB++) {
          var currentKey = keysA[keysB];
          if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
            return false;
        }
        return true;
      }
      function getLeafNode(node) {
        for (; node && node.firstChild; ) node = node.firstChild;
        return node;
      }
      function getNodeForCharacterOffset(root2, offset) {
        var node = getLeafNode(root2);
        root2 = 0;
        for (var nodeEnd; node; ) {
          if (3 === node.nodeType) {
            nodeEnd = root2 + node.textContent.length;
            if (root2 <= offset && nodeEnd >= offset)
              return { node, offset: offset - root2 };
            root2 = nodeEnd;
          }
          a: {
            for (; node; ) {
              if (node.nextSibling) {
                node = node.nextSibling;
                break a;
              }
              node = node.parentNode;
            }
            node = void 0;
          }
          node = getLeafNode(node);
        }
      }
      function containsNode(outerNode, innerNode) {
        return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
      }
      function getActiveElementDeep(containerInfo) {
        containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
        for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement; ) {
          try {
            var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
          } catch (err) {
            JSCompiler_inline_result = false;
          }
          if (JSCompiler_inline_result) containerInfo = element.contentWindow;
          else break;
          element = getActiveElement(containerInfo.document);
        }
        return element;
      }
      function hasSelectionCapabilities(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
      }
      var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode;
      var activeElement = null;
      var activeElementInst = null;
      var lastSelection = null;
      var mouseDown = false;
      function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
        var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
        mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = { start: doc.selectionStart, end: doc.selectionEnd } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
          anchorNode: doc.anchorNode,
          anchorOffset: doc.anchorOffset,
          focusNode: doc.focusNode,
          focusOffset: doc.focusOffset
        }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent(
          "onSelect",
          "select",
          null,
          nativeEvent,
          nativeEventTarget
        ), dispatchQueue.push({ event: nativeEvent, listeners: doc }), nativeEvent.target = activeElement)));
      }
      function makePrefixMap(styleProp, eventName) {
        var prefixes = {};
        prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
        prefixes["Webkit" + styleProp] = "webkit" + eventName;
        prefixes["Moz" + styleProp] = "moz" + eventName;
        return prefixes;
      }
      var vendorPrefixes = {
        animationend: makePrefixMap("Animation", "AnimationEnd"),
        animationiteration: makePrefixMap("Animation", "AnimationIteration"),
        animationstart: makePrefixMap("Animation", "AnimationStart"),
        transitionrun: makePrefixMap("Transition", "TransitionRun"),
        transitionstart: makePrefixMap("Transition", "TransitionStart"),
        transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
        transitionend: makePrefixMap("Transition", "TransitionEnd")
      };
      var prefixedEventNames = {};
      var style = {};
      canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
      function getVendorPrefixedEventName(eventName) {
        if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
        if (!vendorPrefixes[eventName]) return eventName;
        var prefixMap = vendorPrefixes[eventName], styleProp;
        for (styleProp in prefixMap)
          if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
            return prefixedEventNames[eventName] = prefixMap[styleProp];
        return eventName;
      }
      var ANIMATION_END = getVendorPrefixedEventName("animationend");
      var ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration");
      var ANIMATION_START = getVendorPrefixedEventName("animationstart");
      var TRANSITION_RUN = getVendorPrefixedEventName("transitionrun");
      var TRANSITION_START = getVendorPrefixedEventName("transitionstart");
      var TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel");
      var TRANSITION_END = getVendorPrefixedEventName("transitionend");
      var topLevelEventsToReactNames = /* @__PURE__ */ new Map();
      var simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " "
      );
      simpleEventPluginEvents.push("scrollEnd");
      function registerSimpleEvent(domEventName, reactName) {
        topLevelEventsToReactNames.set(domEventName, reactName);
        registerTwoPhaseEvent(reactName, [domEventName]);
      }
      var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      };
      var concurrentQueues = [];
      var concurrentQueuesIndex = 0;
      var concurrentlyUpdatedLanes = 0;
      function finishQueueingConcurrentUpdates() {
        for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex; ) {
          var fiber = concurrentQueues[i];
          concurrentQueues[i++] = null;
          var queue = concurrentQueues[i];
          concurrentQueues[i++] = null;
          var update = concurrentQueues[i];
          concurrentQueues[i++] = null;
          var lane = concurrentQueues[i];
          concurrentQueues[i++] = null;
          if (null !== queue && null !== update) {
            var pending = queue.pending;
            null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
            queue.pending = update;
          }
          0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
        }
      }
      function enqueueUpdate$1(fiber, queue, update, lane) {
        concurrentQueues[concurrentQueuesIndex++] = fiber;
        concurrentQueues[concurrentQueuesIndex++] = queue;
        concurrentQueues[concurrentQueuesIndex++] = update;
        concurrentQueues[concurrentQueuesIndex++] = lane;
        concurrentlyUpdatedLanes |= lane;
        fiber.lanes |= lane;
        fiber = fiber.alternate;
        null !== fiber && (fiber.lanes |= lane);
      }
      function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
        enqueueUpdate$1(fiber, queue, update, lane);
        return getRootForUpdatedFiber(fiber);
      }
      function enqueueConcurrentRenderForLane(fiber, lane) {
        enqueueUpdate$1(fiber, null, null, lane);
        return getRootForUpdatedFiber(fiber);
      }
      function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
        sourceFiber.lanes |= lane;
        var alternate = sourceFiber.alternate;
        null !== alternate && (alternate.lanes |= lane);
        for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
          parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
        return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
      }
      function getRootForUpdatedFiber(sourceFiber) {
        if (50 < nestedUpdateCount)
          throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
        for (var parent = sourceFiber.return; null !== parent; )
          sourceFiber = parent, parent = sourceFiber.return;
        return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
      }
      var emptyContextObject = {};
      function FiberNode(tag, pendingProps, key, mode) {
        this.tag = tag;
        this.key = key;
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
        this.index = 0;
        this.refCleanup = this.ref = null;
        this.pendingProps = pendingProps;
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
        this.mode = mode;
        this.subtreeFlags = this.flags = 0;
        this.deletions = null;
        this.childLanes = this.lanes = 0;
        this.alternate = null;
      }
      function createFiberImplClass(tag, pendingProps, key, mode) {
        return new FiberNode(tag, pendingProps, key, mode);
      }
      function shouldConstruct(Component) {
        Component = Component.prototype;
        return !(!Component || !Component.isReactComponent);
      }
      function createWorkInProgress(current, pendingProps) {
        var workInProgress2 = current.alternate;
        null === workInProgress2 ? (workInProgress2 = createFiberImplClass(
          current.tag,
          pendingProps,
          current.key,
          current.mode
        ), workInProgress2.elementType = current.elementType, workInProgress2.type = current.type, workInProgress2.stateNode = current.stateNode, workInProgress2.alternate = current, current.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null);
        workInProgress2.flags = current.flags & 65011712;
        workInProgress2.childLanes = current.childLanes;
        workInProgress2.lanes = current.lanes;
        workInProgress2.child = current.child;
        workInProgress2.memoizedProps = current.memoizedProps;
        workInProgress2.memoizedState = current.memoizedState;
        workInProgress2.updateQueue = current.updateQueue;
        pendingProps = current.dependencies;
        workInProgress2.dependencies = null === pendingProps ? null : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
        workInProgress2.sibling = current.sibling;
        workInProgress2.index = current.index;
        workInProgress2.ref = current.ref;
        workInProgress2.refCleanup = current.refCleanup;
        return workInProgress2;
      }
      function resetWorkInProgress(workInProgress2, renderLanes2) {
        workInProgress2.flags &= 65011714;
        var current = workInProgress2.alternate;
        null === current ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null) : (workInProgress2.childLanes = current.childLanes, workInProgress2.lanes = current.lanes, workInProgress2.child = current.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current.memoizedProps, workInProgress2.memoizedState = current.memoizedState, workInProgress2.updateQueue = current.updateQueue, workInProgress2.type = current.type, renderLanes2 = current.dependencies, workInProgress2.dependencies = null === renderLanes2 ? null : {
          lanes: renderLanes2.lanes,
          firstContext: renderLanes2.firstContext
        });
        return workInProgress2;
      }
      function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
        var fiberTag = 0;
        owner = type;
        if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
        else if ("string" === typeof type)
          fiberTag = isHostHoistableType(
            type,
            pendingProps,
            contextStackCursor.current
          ) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
        else
          a: switch (type) {
            case REACT_ACTIVITY_TYPE:
              return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
            case REACT_FRAGMENT_TYPE:
              return createFiberFromFragment(pendingProps.children, mode, lanes, key);
            case REACT_STRICT_MODE_TYPE:
              fiberTag = 8;
              mode |= 24;
              break;
            case REACT_PROFILER_TYPE:
              return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
            case REACT_SUSPENSE_TYPE:
              return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
            case REACT_SUSPENSE_LIST_TYPE:
              return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
            default:
              if ("object" === typeof type && null !== type)
                switch (type.$$typeof) {
                  case REACT_CONTEXT_TYPE:
                    fiberTag = 10;
                    break a;
                  case REACT_CONSUMER_TYPE:
                    fiberTag = 9;
                    break a;
                  case REACT_FORWARD_REF_TYPE:
                    fiberTag = 11;
                    break a;
                  case REACT_MEMO_TYPE:
                    fiberTag = 14;
                    break a;
                  case REACT_LAZY_TYPE:
                    fiberTag = 16;
                    owner = null;
                    break a;
                }
              fiberTag = 29;
              pendingProps = Error(
                formatProdErrorMessage(130, null === type ? "null" : typeof type, "")
              );
              owner = null;
          }
        key = createFiberImplClass(fiberTag, pendingProps, key, mode);
        key.elementType = type;
        key.type = owner;
        key.lanes = lanes;
        return key;
      }
      function createFiberFromFragment(elements, mode, lanes, key) {
        elements = createFiberImplClass(7, elements, key, mode);
        elements.lanes = lanes;
        return elements;
      }
      function createFiberFromText(content, mode, lanes) {
        content = createFiberImplClass(6, content, null, mode);
        content.lanes = lanes;
        return content;
      }
      function createFiberFromDehydratedFragment(dehydratedNode) {
        var fiber = createFiberImplClass(18, null, null, 0);
        fiber.stateNode = dehydratedNode;
        return fiber;
      }
      function createFiberFromPortal(portal, mode, lanes) {
        mode = createFiberImplClass(
          4,
          null !== portal.children ? portal.children : [],
          portal.key,
          mode
        );
        mode.lanes = lanes;
        mode.stateNode = {
          containerInfo: portal.containerInfo,
          pendingChildren: null,
          implementation: portal.implementation
        };
        return mode;
      }
      var CapturedStacks = /* @__PURE__ */ new WeakMap();
      function createCapturedValueAtFiber(value, source) {
        if ("object" === typeof value && null !== value) {
          var existing = CapturedStacks.get(value);
          if (void 0 !== existing) return existing;
          source = {
            value,
            source,
            stack: getStackByFiberInDevAndProd(source)
          };
          CapturedStacks.set(value, source);
          return source;
        }
        return {
          value,
          source,
          stack: getStackByFiberInDevAndProd(source)
        };
      }
      var forkStack = [];
      var forkStackIndex = 0;
      var treeForkProvider = null;
      var treeForkCount = 0;
      var idStack = [];
      var idStackIndex = 0;
      var treeContextProvider = null;
      var treeContextId = 1;
      var treeContextOverflow = "";
      function pushTreeFork(workInProgress2, totalChildren) {
        forkStack[forkStackIndex++] = treeForkCount;
        forkStack[forkStackIndex++] = treeForkProvider;
        treeForkProvider = workInProgress2;
        treeForkCount = totalChildren;
      }
      function pushTreeId(workInProgress2, totalChildren, index2) {
        idStack[idStackIndex++] = treeContextId;
        idStack[idStackIndex++] = treeContextOverflow;
        idStack[idStackIndex++] = treeContextProvider;
        treeContextProvider = workInProgress2;
        var baseIdWithLeadingBit = treeContextId;
        workInProgress2 = treeContextOverflow;
        var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
        baseIdWithLeadingBit &= ~(1 << baseLength);
        index2 += 1;
        var length = 32 - clz32(totalChildren) + baseLength;
        if (30 < length) {
          var numberOfOverflowBits = baseLength - baseLength % 5;
          length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
          baseIdWithLeadingBit >>= numberOfOverflowBits;
          baseLength -= numberOfOverflowBits;
          treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index2 << baseLength | baseIdWithLeadingBit;
          treeContextOverflow = length + workInProgress2;
        } else
          treeContextId = 1 << length | index2 << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
      }
      function pushMaterializedTreeId(workInProgress2) {
        null !== workInProgress2.return && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
      }
      function popTreeContext(workInProgress2) {
        for (; workInProgress2 === treeForkProvider; )
          treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
        for (; workInProgress2 === treeContextProvider; )
          treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
      }
      function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
        idStack[idStackIndex++] = treeContextId;
        idStack[idStackIndex++] = treeContextOverflow;
        idStack[idStackIndex++] = treeContextProvider;
        treeContextId = suspendedContext.id;
        treeContextOverflow = suspendedContext.overflow;
        treeContextProvider = workInProgress2;
      }
      var hydrationParentFiber = null;
      var nextHydratableInstance = null;
      var isHydrating = false;
      var hydrationErrors = null;
      var rootOrSingletonContext = false;
      var HydrationMismatchException = Error(formatProdErrorMessage(519));
      function throwOnHydrationMismatch(fiber) {
        var error = Error(
          formatProdErrorMessage(
            418,
            1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
            ""
          )
        );
        queueHydrationError(createCapturedValueAtFiber(error, fiber));
        throw HydrationMismatchException;
      }
      function prepareToHydrateHostInstance(fiber) {
        var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
        instance[internalInstanceKey] = fiber;
        instance[internalPropsKey] = props;
        switch (type) {
          case "dialog":
            listenToNonDelegatedEvent("cancel", instance);
            listenToNonDelegatedEvent("close", instance);
            break;
          case "iframe":
          case "object":
          case "embed":
            listenToNonDelegatedEvent("load", instance);
            break;
          case "video":
          case "audio":
            for (type = 0; type < mediaEventTypes.length; type++)
              listenToNonDelegatedEvent(mediaEventTypes[type], instance);
            break;
          case "source":
            listenToNonDelegatedEvent("error", instance);
            break;
          case "img":
          case "image":
          case "link":
            listenToNonDelegatedEvent("error", instance);
            listenToNonDelegatedEvent("load", instance);
            break;
          case "details":
            listenToNonDelegatedEvent("toggle", instance);
            break;
          case "input":
            listenToNonDelegatedEvent("invalid", instance);
            initInput(
              instance,
              props.value,
              props.defaultValue,
              props.checked,
              props.defaultChecked,
              props.type,
              props.name,
              true
            );
            break;
          case "select":
            listenToNonDelegatedEvent("invalid", instance);
            break;
          case "textarea":
            listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
        }
        type = props.children;
        "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
        instance || throwOnHydrationMismatch(fiber, true);
      }
      function popToNextHostParent(fiber) {
        for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
          switch (hydrationParentFiber.tag) {
            case 5:
            case 31:
            case 13:
              rootOrSingletonContext = false;
              return;
            case 27:
            case 3:
              rootOrSingletonContext = true;
              return;
            default:
              hydrationParentFiber = hydrationParentFiber.return;
          }
      }
      function popHydrationState(fiber) {
        if (fiber !== hydrationParentFiber) return false;
        if (!isHydrating) return popToNextHostParent(fiber), isHydrating = true, false;
        var tag = fiber.tag, JSCompiler_temp;
        if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
          if (JSCompiler_temp = 5 === tag)
            JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
          JSCompiler_temp = !JSCompiler_temp;
        }
        JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
        popToNextHostParent(fiber);
        if (13 === tag) {
          fiber = fiber.memoizedState;
          fiber = null !== fiber ? fiber.dehydrated : null;
          if (!fiber) throw Error(formatProdErrorMessage(317));
          nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
        } else if (31 === tag) {
          fiber = fiber.memoizedState;
          fiber = null !== fiber ? fiber.dehydrated : null;
          if (!fiber) throw Error(formatProdErrorMessage(317));
          nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
        } else
          27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
        return true;
      }
      function resetHydrationState() {
        nextHydratableInstance = hydrationParentFiber = null;
        isHydrating = false;
      }
      function upgradeHydrationErrorsToRecoverable() {
        var queuedErrors = hydrationErrors;
        null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(
          workInProgressRootRecoverableErrors,
          queuedErrors
        ), hydrationErrors = null);
        return queuedErrors;
      }
      function queueHydrationError(error) {
        null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
      }
      var valueCursor = createCursor(null);
      var currentlyRenderingFiber$1 = null;
      var lastContextDependency = null;
      function pushProvider(providerFiber, context, nextValue) {
        push(valueCursor, context._currentValue);
        context._currentValue = nextValue;
      }
      function popProvider(context) {
        context._currentValue = valueCursor.current;
        pop(valueCursor);
      }
      function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
        for (; null !== parent; ) {
          var alternate = parent.alternate;
          (parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, null !== alternate && (alternate.childLanes |= renderLanes2)) : null !== alternate && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2);
          if (parent === propagationRoot) break;
          parent = parent.return;
        }
      }
      function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
        var fiber = workInProgress2.child;
        null !== fiber && (fiber.return = workInProgress2);
        for (; null !== fiber; ) {
          var list = fiber.dependencies;
          if (null !== list) {
            var nextFiber = fiber.child;
            list = list.firstContext;
            a: for (; null !== list; ) {
              var dependency = list;
              list = fiber;
              for (var i = 0; i < contexts.length; i++)
                if (dependency.context === contexts[i]) {
                  list.lanes |= renderLanes2;
                  dependency = list.alternate;
                  null !== dependency && (dependency.lanes |= renderLanes2);
                  scheduleContextWorkOnParentPath(
                    list.return,
                    renderLanes2,
                    workInProgress2
                  );
                  forcePropagateEntireTree || (nextFiber = null);
                  break a;
                }
              list = dependency.next;
            }
          } else if (18 === fiber.tag) {
            nextFiber = fiber.return;
            if (null === nextFiber) throw Error(formatProdErrorMessage(341));
            nextFiber.lanes |= renderLanes2;
            list = nextFiber.alternate;
            null !== list && (list.lanes |= renderLanes2);
            scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2);
            nextFiber = null;
          } else nextFiber = fiber.child;
          if (null !== nextFiber) nextFiber.return = fiber;
          else
            for (nextFiber = fiber; null !== nextFiber; ) {
              if (nextFiber === workInProgress2) {
                nextFiber = null;
                break;
              }
              fiber = nextFiber.sibling;
              if (null !== fiber) {
                fiber.return = nextFiber.return;
                nextFiber = fiber;
                break;
              }
              nextFiber = nextFiber.return;
            }
          fiber = nextFiber;
        }
      }
      function propagateParentContextChanges(current, workInProgress2, renderLanes2, forcePropagateEntireTree) {
        current = null;
        for (var parent = workInProgress2, isInsidePropagationBailout = false; null !== parent; ) {
          if (!isInsidePropagationBailout) {
            if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
            else if (0 !== (parent.flags & 262144)) break;
          }
          if (10 === parent.tag) {
            var currentParent = parent.alternate;
            if (null === currentParent) throw Error(formatProdErrorMessage(387));
            currentParent = currentParent.memoizedProps;
            if (null !== currentParent) {
              var context = parent.type;
              objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
            }
          } else if (parent === hostTransitionProviderCursor.current) {
            currentParent = parent.alternate;
            if (null === currentParent) throw Error(formatProdErrorMessage(387));
            currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
          }
          parent = parent.return;
        }
        null !== current && propagateContextChanges(
          workInProgress2,
          current,
          renderLanes2,
          forcePropagateEntireTree
        );
        workInProgress2.flags |= 262144;
      }
      function checkIfContextChanged(currentDependencies) {
        for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies; ) {
          if (!objectIs(
            currentDependencies.context._currentValue,
            currentDependencies.memoizedValue
          ))
            return true;
          currentDependencies = currentDependencies.next;
        }
        return false;
      }
      function prepareToReadContext(workInProgress2) {
        currentlyRenderingFiber$1 = workInProgress2;
        lastContextDependency = null;
        workInProgress2 = workInProgress2.dependencies;
        null !== workInProgress2 && (workInProgress2.firstContext = null);
      }
      function readContext(context) {
        return readContextForConsumer(currentlyRenderingFiber$1, context);
      }
      function readContextDuringReconciliation(consumer, context) {
        null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
        return readContextForConsumer(consumer, context);
      }
      function readContextForConsumer(consumer, context) {
        var value = context._currentValue;
        context = { context, memoizedValue: value, next: null };
        if (null === lastContextDependency) {
          if (null === consumer) throw Error(formatProdErrorMessage(308));
          lastContextDependency = context;
          consumer.dependencies = { lanes: 0, firstContext: context };
          consumer.flags |= 524288;
        } else lastContextDependency = lastContextDependency.next = context;
        return value;
      }
      var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
        var listeners = [], signal = this.signal = {
          aborted: false,
          addEventListener: function(type, listener) {
            listeners.push(listener);
          }
        };
        this.abort = function() {
          signal.aborted = true;
          listeners.forEach(function(listener) {
            return listener();
          });
        };
      };
      var scheduleCallback$2 = Scheduler.unstable_scheduleCallback;
      var NormalPriority = Scheduler.unstable_NormalPriority;
      var CacheContext = {
        $$typeof: REACT_CONTEXT_TYPE,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0
      };
      function createCache() {
        return {
          controller: new AbortControllerLocal(),
          data: /* @__PURE__ */ new Map(),
          refCount: 0
        };
      }
      function releaseCache(cache) {
        cache.refCount--;
        0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
          cache.controller.abort();
        });
      }
      var currentEntangledListeners = null;
      var currentEntangledPendingCount = 0;
      var currentEntangledLane = 0;
      var currentEntangledActionThenable = null;
      function entangleAsyncAction(transition, thenable) {
        if (null === currentEntangledListeners) {
          var entangledListeners = currentEntangledListeners = [];
          currentEntangledPendingCount = 0;
          currentEntangledLane = requestTransitionLane();
          currentEntangledActionThenable = {
            status: "pending",
            value: void 0,
            then: function(resolve) {
              entangledListeners.push(resolve);
            }
          };
        }
        currentEntangledPendingCount++;
        thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
        return thenable;
      }
      function pingEngtangledActionScope() {
        if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
          null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
          var listeners = currentEntangledListeners;
          currentEntangledListeners = null;
          currentEntangledLane = 0;
          currentEntangledActionThenable = null;
          for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
        }
      }
      function chainThenableValue(thenable, result) {
        var listeners = [], thenableWithOverride = {
          status: "pending",
          value: null,
          reason: null,
          then: function(resolve) {
            listeners.push(resolve);
          }
        };
        thenable.then(
          function() {
            thenableWithOverride.status = "fulfilled";
            thenableWithOverride.value = result;
            for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
          },
          function(error) {
            thenableWithOverride.status = "rejected";
            thenableWithOverride.reason = error;
            for (error = 0; error < listeners.length; error++)
              (0, listeners[error])(void 0);
          }
        );
        return thenableWithOverride;
      }
      var prevOnStartTransitionFinish = ReactSharedInternals.S;
      ReactSharedInternals.S = function(transition, returnValue) {
        globalMostRecentTransitionTime = now();
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
        null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
      };
      var resumedCache = createCursor(null);
      function peekCacheFromPool() {
        var cacheResumedFromPreviousRender = resumedCache.current;
        return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
      }
      function pushTransition(offscreenWorkInProgress, prevCachePool) {
        null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
      }
      function getSuspendedCache() {
        var cacheFromPool = peekCacheFromPool();
        return null === cacheFromPool ? null : { parent: CacheContext._currentValue, pool: cacheFromPool };
      }
      var SuspenseException = Error(formatProdErrorMessage(460));
      var SuspenseyCommitException = Error(formatProdErrorMessage(474));
      var SuspenseActionException = Error(formatProdErrorMessage(542));
      var noopSuspenseyCommitThenable = { then: function() {
      } };
      function isThenableResolved(thenable) {
        thenable = thenable.status;
        return "fulfilled" === thenable || "rejected" === thenable;
      }
      function trackUsedThenable(thenableState2, thenable, index2) {
        index2 = thenableState2[index2];
        void 0 === index2 ? thenableState2.push(thenable) : index2 !== thenable && (thenable.then(noop$1, noop$1), thenable = index2);
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
          default:
            if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
            else {
              thenableState2 = workInProgressRoot;
              if (null !== thenableState2 && 100 < thenableState2.shellSuspendCounter)
                throw Error(formatProdErrorMessage(482));
              thenableState2 = thenable;
              thenableState2.status = "pending";
              thenableState2.then(
                function(fulfilledValue) {
                  if ("pending" === thenable.status) {
                    var fulfilledThenable = thenable;
                    fulfilledThenable.status = "fulfilled";
                    fulfilledThenable.value = fulfilledValue;
                  }
                },
                function(error) {
                  if ("pending" === thenable.status) {
                    var rejectedThenable = thenable;
                    rejectedThenable.status = "rejected";
                    rejectedThenable.reason = error;
                  }
                }
              );
            }
            switch (thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
            }
            suspendedThenable = thenable;
            throw SuspenseException;
        }
      }
      function resolveLazy(lazyType) {
        try {
          var init = lazyType._init;
          return init(lazyType._payload);
        } catch (x) {
          if (null !== x && "object" === typeof x && "function" === typeof x.then)
            throw suspendedThenable = x, SuspenseException;
          throw x;
        }
      }
      var suspendedThenable = null;
      function getSuspendedThenable() {
        if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
        var thenable = suspendedThenable;
        suspendedThenable = null;
        return thenable;
      }
      function checkIfUseWrappedInAsyncCatch(rejectedReason) {
        if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
          throw Error(formatProdErrorMessage(483));
      }
      var thenableState$1 = null;
      var thenableIndexCounter$1 = 0;
      function unwrapThenable(thenable) {
        var index2 = thenableIndexCounter$1;
        thenableIndexCounter$1 += 1;
        null === thenableState$1 && (thenableState$1 = []);
        return trackUsedThenable(thenableState$1, thenable, index2);
      }
      function coerceRef(workInProgress2, element) {
        element = element.props.ref;
        workInProgress2.ref = void 0 !== element ? element : null;
      }
      function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
        if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
          throw Error(formatProdErrorMessage(525));
        returnFiber = Object.prototype.toString.call(newChild);
        throw Error(
          formatProdErrorMessage(
            31,
            "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber
          )
        );
      }
      function createChildReconciler(shouldTrackSideEffects) {
        function deleteChild(returnFiber, childToDelete) {
          if (shouldTrackSideEffects) {
            var deletions = returnFiber.deletions;
            null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
          }
        }
        function deleteRemainingChildren(returnFiber, currentFirstChild) {
          if (!shouldTrackSideEffects) return null;
          for (; null !== currentFirstChild; )
            deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
          return null;
        }
        function mapRemainingChildren(currentFirstChild) {
          for (var existingChildren = /* @__PURE__ */ new Map(); null !== currentFirstChild; )
            null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
          return existingChildren;
        }
        function useFiber(fiber, pendingProps) {
          fiber = createWorkInProgress(fiber, pendingProps);
          fiber.index = 0;
          fiber.sibling = null;
          return fiber;
        }
        function placeChild(newFiber, lastPlacedIndex, newIndex) {
          newFiber.index = newIndex;
          if (!shouldTrackSideEffects)
            return newFiber.flags |= 1048576, lastPlacedIndex;
          newIndex = newFiber.alternate;
          if (null !== newIndex)
            return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
          newFiber.flags |= 67108866;
          return lastPlacedIndex;
        }
        function placeSingleChild(newFiber) {
          shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
          return newFiber;
        }
        function updateTextNode(returnFiber, current, textContent, lanes) {
          if (null === current || 6 !== current.tag)
            return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
          current = useFiber(current, textContent);
          current.return = returnFiber;
          return current;
        }
        function updateElement(returnFiber, current, element, lanes) {
          var elementType = element.type;
          if (elementType === REACT_FRAGMENT_TYPE)
            return updateFragment(
              returnFiber,
              current,
              element.props.children,
              lanes,
              element.key
            );
          if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type))
            return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
          current = createFiberFromTypeAndProps(
            element.type,
            element.key,
            element.props,
            null,
            returnFiber.mode,
            lanes
          );
          coerceRef(current, element);
          current.return = returnFiber;
          return current;
        }
        function updatePortal(returnFiber, current, portal, lanes) {
          if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation)
            return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
          current = useFiber(current, portal.children || []);
          current.return = returnFiber;
          return current;
        }
        function updateFragment(returnFiber, current, fragment, lanes, key) {
          if (null === current || 7 !== current.tag)
            return current = createFiberFromFragment(
              fragment,
              returnFiber.mode,
              lanes,
              key
            ), current.return = returnFiber, current;
          current = useFiber(current, fragment);
          current.return = returnFiber;
          return current;
        }
        function createChild(returnFiber, newChild, lanes) {
          if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
            return newChild = createFiberFromText(
              "" + newChild,
              returnFiber.mode,
              lanes
            ), newChild.return = returnFiber, newChild;
          if ("object" === typeof newChild && null !== newChild) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                return lanes = createFiberFromTypeAndProps(
                  newChild.type,
                  newChild.key,
                  newChild.props,
                  null,
                  returnFiber.mode,
                  lanes
                ), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
              case REACT_PORTAL_TYPE:
                return newChild = createFiberFromPortal(
                  newChild,
                  returnFiber.mode,
                  lanes
                ), newChild.return = returnFiber, newChild;
              case REACT_LAZY_TYPE:
                return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
            }
            if (isArrayImpl(newChild) || getIteratorFn(newChild))
              return newChild = createFiberFromFragment(
                newChild,
                returnFiber.mode,
                lanes,
                null
              ), newChild.return = returnFiber, newChild;
            if ("function" === typeof newChild.then)
              return createChild(returnFiber, unwrapThenable(newChild), lanes);
            if (newChild.$$typeof === REACT_CONTEXT_TYPE)
              return createChild(
                returnFiber,
                readContextDuringReconciliation(returnFiber, newChild),
                lanes
              );
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
          }
          return null;
        }
        function updateSlot(returnFiber, oldFiber, newChild, lanes) {
          var key = null !== oldFiber ? oldFiber.key : null;
          if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
            return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
          if ("object" === typeof newChild && null !== newChild) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
              case REACT_PORTAL_TYPE:
                return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
              case REACT_LAZY_TYPE:
                return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
            }
            if (isArrayImpl(newChild) || getIteratorFn(newChild))
              return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
            if ("function" === typeof newChild.then)
              return updateSlot(
                returnFiber,
                oldFiber,
                unwrapThenable(newChild),
                lanes
              );
            if (newChild.$$typeof === REACT_CONTEXT_TYPE)
              return updateSlot(
                returnFiber,
                oldFiber,
                readContextDuringReconciliation(returnFiber, newChild),
                lanes
              );
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
          }
          return null;
        }
        function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
          if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
            return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
          if ("object" === typeof newChild && null !== newChild) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                return existingChildren = existingChildren.get(
                  null === newChild.key ? newIdx : newChild.key
                ) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
              case REACT_PORTAL_TYPE:
                return existingChildren = existingChildren.get(
                  null === newChild.key ? newIdx : newChild.key
                ) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
              case REACT_LAZY_TYPE:
                return newChild = resolveLazy(newChild), updateFromMap(
                  existingChildren,
                  returnFiber,
                  newIdx,
                  newChild,
                  lanes
                );
            }
            if (isArrayImpl(newChild) || getIteratorFn(newChild))
              return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
            if ("function" === typeof newChild.then)
              return updateFromMap(
                existingChildren,
                returnFiber,
                newIdx,
                unwrapThenable(newChild),
                lanes
              );
            if (newChild.$$typeof === REACT_CONTEXT_TYPE)
              return updateFromMap(
                existingChildren,
                returnFiber,
                newIdx,
                readContextDuringReconciliation(returnFiber, newChild),
                lanes
              );
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
          }
          return null;
        }
        function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
          for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
            oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
            var newFiber = updateSlot(
              returnFiber,
              oldFiber,
              newChildren[newIdx],
              lanes
            );
            if (null === newFiber) {
              null === oldFiber && (oldFiber = nextOldFiber);
              break;
            }
            shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
            currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
            null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
          }
          if (newIdx === newChildren.length)
            return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
          if (null === oldFiber) {
            for (; newIdx < newChildren.length; newIdx++)
              oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(
                oldFiber,
                currentFirstChild,
                newIdx
              ), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
            isHydrating && pushTreeFork(returnFiber, newIdx);
            return resultingFirstChild;
          }
          for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)
            nextOldFiber = updateFromMap(
              oldFiber,
              returnFiber,
              newIdx,
              newChildren[newIdx],
              lanes
            ), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(
              null === nextOldFiber.key ? newIdx : nextOldFiber.key
            ), currentFirstChild = placeChild(
              nextOldFiber,
              currentFirstChild,
              newIdx
            ), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
          shouldTrackSideEffects && oldFiber.forEach(function(child) {
            return deleteChild(returnFiber, child);
          });
          isHydrating && pushTreeFork(returnFiber, newIdx);
          return resultingFirstChild;
        }
        function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
          if (null == newChildren) throw Error(formatProdErrorMessage(151));
          for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
            oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
            var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
            if (null === newFiber) {
              null === oldFiber && (oldFiber = nextOldFiber);
              break;
            }
            shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
            currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
            null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
          }
          if (step.done)
            return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
          if (null === oldFiber) {
            for (; !step.done; newIdx++, step = newChildren.next())
              step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
            isHydrating && pushTreeFork(returnFiber, newIdx);
            return resultingFirstChild;
          }
          for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())
            step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
          shouldTrackSideEffects && oldFiber.forEach(function(child) {
            return deleteChild(returnFiber, child);
          });
          isHydrating && pushTreeFork(returnFiber, newIdx);
          return resultingFirstChild;
        }
        function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
          "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
          if ("object" === typeof newChild && null !== newChild) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                a: {
                  for (var key = newChild.key; null !== currentFirstChild; ) {
                    if (currentFirstChild.key === key) {
                      key = newChild.type;
                      if (key === REACT_FRAGMENT_TYPE) {
                        if (7 === currentFirstChild.tag) {
                          deleteRemainingChildren(
                            returnFiber,
                            currentFirstChild.sibling
                          );
                          lanes = useFiber(
                            currentFirstChild,
                            newChild.props.children
                          );
                          lanes.return = returnFiber;
                          returnFiber = lanes;
                          break a;
                        }
                      } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                        deleteRemainingChildren(
                          returnFiber,
                          currentFirstChild.sibling
                        );
                        lanes = useFiber(currentFirstChild, newChild.props);
                        coerceRef(lanes, newChild);
                        lanes.return = returnFiber;
                        returnFiber = lanes;
                        break a;
                      }
                      deleteRemainingChildren(returnFiber, currentFirstChild);
                      break;
                    } else deleteChild(returnFiber, currentFirstChild);
                    currentFirstChild = currentFirstChild.sibling;
                  }
                  newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(
                    newChild.props.children,
                    returnFiber.mode,
                    lanes,
                    newChild.key
                  ), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(
                    newChild.type,
                    newChild.key,
                    newChild.props,
                    null,
                    returnFiber.mode,
                    lanes
                  ), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
                }
                return placeSingleChild(returnFiber);
              case REACT_PORTAL_TYPE:
                a: {
                  for (key = newChild.key; null !== currentFirstChild; ) {
                    if (currentFirstChild.key === key)
                      if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                        deleteRemainingChildren(
                          returnFiber,
                          currentFirstChild.sibling
                        );
                        lanes = useFiber(currentFirstChild, newChild.children || []);
                        lanes.return = returnFiber;
                        returnFiber = lanes;
                        break a;
                      } else {
                        deleteRemainingChildren(returnFiber, currentFirstChild);
                        break;
                      }
                    else deleteChild(returnFiber, currentFirstChild);
                    currentFirstChild = currentFirstChild.sibling;
                  }
                  lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
                  lanes.return = returnFiber;
                  returnFiber = lanes;
                }
                return placeSingleChild(returnFiber);
              case REACT_LAZY_TYPE:
                return newChild = resolveLazy(newChild), reconcileChildFibersImpl(
                  returnFiber,
                  currentFirstChild,
                  newChild,
                  lanes
                );
            }
            if (isArrayImpl(newChild))
              return reconcileChildrenArray(
                returnFiber,
                currentFirstChild,
                newChild,
                lanes
              );
            if (getIteratorFn(newChild)) {
              key = getIteratorFn(newChild);
              if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
              newChild = key.call(newChild);
              return reconcileChildrenIterator(
                returnFiber,
                currentFirstChild,
                newChild,
                lanes
              );
            }
            if ("function" === typeof newChild.then)
              return reconcileChildFibersImpl(
                returnFiber,
                currentFirstChild,
                unwrapThenable(newChild),
                lanes
              );
            if (newChild.$$typeof === REACT_CONTEXT_TYPE)
              return reconcileChildFibersImpl(
                returnFiber,
                currentFirstChild,
                readContextDuringReconciliation(returnFiber, newChild),
                lanes
              );
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
          }
          return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
        }
        return function(returnFiber, currentFirstChild, newChild, lanes) {
          try {
            thenableIndexCounter$1 = 0;
            var firstChildFiber = reconcileChildFibersImpl(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            );
            thenableState$1 = null;
            return firstChildFiber;
          } catch (x) {
            if (x === SuspenseException || x === SuspenseActionException) throw x;
            var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
            fiber.lanes = lanes;
            fiber.return = returnFiber;
            return fiber;
          } finally {
          }
        };
      }
      var reconcileChildFibers = createChildReconciler(true);
      var mountChildFibers = createChildReconciler(false);
      var hasForceUpdate = false;
      function initializeUpdateQueue(fiber) {
        fiber.updateQueue = {
          baseState: fiber.memoizedState,
          firstBaseUpdate: null,
          lastBaseUpdate: null,
          shared: { pending: null, lanes: 0, hiddenCallbacks: null },
          callbacks: null
        };
      }
      function cloneUpdateQueue(current, workInProgress2) {
        current = current.updateQueue;
        workInProgress2.updateQueue === current && (workInProgress2.updateQueue = {
          baseState: current.baseState,
          firstBaseUpdate: current.firstBaseUpdate,
          lastBaseUpdate: current.lastBaseUpdate,
          shared: current.shared,
          callbacks: null
        });
      }
      function createUpdate(lane) {
        return { lane, tag: 0, payload: null, callback: null, next: null };
      }
      function enqueueUpdate(fiber, update, lane) {
        var updateQueue = fiber.updateQueue;
        if (null === updateQueue) return null;
        updateQueue = updateQueue.shared;
        if (0 !== (executionContext & 2)) {
          var pending = updateQueue.pending;
          null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
          updateQueue.pending = update;
          update = getRootForUpdatedFiber(fiber);
          markUpdateLaneFromFiberToRoot(fiber, null, lane);
          return update;
        }
        enqueueUpdate$1(fiber, updateQueue, update, lane);
        return getRootForUpdatedFiber(fiber);
      }
      function entangleTransitions(root2, fiber, lane) {
        fiber = fiber.updateQueue;
        if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
          var queueLanes = fiber.lanes;
          queueLanes &= root2.pendingLanes;
          lane |= queueLanes;
          fiber.lanes = lane;
          markRootEntangled(root2, lane);
        }
      }
      function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
        var queue = workInProgress2.updateQueue, current = workInProgress2.alternate;
        if (null !== current && (current = current.updateQueue, queue === current)) {
          var newFirst = null, newLast = null;
          queue = queue.firstBaseUpdate;
          if (null !== queue) {
            do {
              var clone = {
                lane: queue.lane,
                tag: queue.tag,
                payload: queue.payload,
                callback: null,
                next: null
              };
              null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
              queue = queue.next;
            } while (null !== queue);
            null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
          } else newFirst = newLast = capturedUpdate;
          queue = {
            baseState: current.baseState,
            firstBaseUpdate: newFirst,
            lastBaseUpdate: newLast,
            shared: current.shared,
            callbacks: current.callbacks
          };
          workInProgress2.updateQueue = queue;
          return;
        }
        workInProgress2 = queue.lastBaseUpdate;
        null === workInProgress2 ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate;
        queue.lastBaseUpdate = capturedUpdate;
      }
      var didReadFromEntangledAsyncAction = false;
      function suspendIfUpdateReadFromEntangledAsyncAction() {
        if (didReadFromEntangledAsyncAction) {
          var entangledActionThenable = currentEntangledActionThenable;
          if (null !== entangledActionThenable) throw entangledActionThenable;
        }
      }
      function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes2) {
        didReadFromEntangledAsyncAction = false;
        var queue = workInProgress$jscomp$0.updateQueue;
        hasForceUpdate = false;
        var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
        if (null !== pendingQueue) {
          queue.shared.pending = null;
          var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = null;
          null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
          lastBaseUpdate = lastPendingUpdate;
          var current = workInProgress$jscomp$0.alternate;
          null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
        }
        if (null !== firstBaseUpdate) {
          var newState = queue.baseState;
          lastBaseUpdate = 0;
          current = firstPendingUpdate = lastPendingUpdate = null;
          pendingQueue = firstBaseUpdate;
          do {
            var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
            if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
              0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
              null !== current && (current = current.next = {
                lane: 0,
                tag: pendingQueue.tag,
                payload: pendingQueue.payload,
                callback: null,
                next: null
              });
              a: {
                var workInProgress2 = workInProgress$jscomp$0, update = pendingQueue;
                updateLane = props;
                var instance = instance$jscomp$0;
                switch (update.tag) {
                  case 1:
                    workInProgress2 = update.payload;
                    if ("function" === typeof workInProgress2) {
                      newState = workInProgress2.call(instance, newState, updateLane);
                      break a;
                    }
                    newState = workInProgress2;
                    break a;
                  case 3:
                    workInProgress2.flags = workInProgress2.flags & -65537 | 128;
                  case 0:
                    workInProgress2 = update.payload;
                    updateLane = "function" === typeof workInProgress2 ? workInProgress2.call(instance, newState, updateLane) : workInProgress2;
                    if (null === updateLane || void 0 === updateLane) break a;
                    newState = assign({}, newState, updateLane);
                    break a;
                  case 2:
                    hasForceUpdate = true;
                }
              }
              updateLane = pendingQueue.callback;
              null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
            } else
              isHiddenUpdate = {
                lane: updateLane,
                tag: pendingQueue.tag,
                payload: pendingQueue.payload,
                callback: pendingQueue.callback,
                next: null
              }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
            pendingQueue = pendingQueue.next;
            if (null === pendingQueue)
              if (pendingQueue = queue.shared.pending, null === pendingQueue)
                break;
              else
                isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
          } while (1);
          null === current && (lastPendingUpdate = newState);
          queue.baseState = lastPendingUpdate;
          queue.firstBaseUpdate = firstPendingUpdate;
          queue.lastBaseUpdate = current;
          null === firstBaseUpdate && (queue.shared.lanes = 0);
          workInProgressRootSkippedLanes |= lastBaseUpdate;
          workInProgress$jscomp$0.lanes = lastBaseUpdate;
          workInProgress$jscomp$0.memoizedState = newState;
        }
      }
      function callCallback(callback, context) {
        if ("function" !== typeof callback)
          throw Error(formatProdErrorMessage(191, callback));
        callback.call(context);
      }
      function commitCallbacks(updateQueue, context) {
        var callbacks = updateQueue.callbacks;
        if (null !== callbacks)
          for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)
            callCallback(callbacks[updateQueue], context);
      }
      var currentTreeHiddenStackCursor = createCursor(null);
      var prevEntangledRenderLanesCursor = createCursor(0);
      function pushHiddenContext(fiber, context) {
        fiber = entangledRenderLanes;
        push(prevEntangledRenderLanesCursor, fiber);
        push(currentTreeHiddenStackCursor, context);
        entangledRenderLanes = fiber | context.baseLanes;
      }
      function reuseHiddenContextOnStack() {
        push(prevEntangledRenderLanesCursor, entangledRenderLanes);
        push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
      }
      function popHiddenContext() {
        entangledRenderLanes = prevEntangledRenderLanesCursor.current;
        pop(currentTreeHiddenStackCursor);
        pop(prevEntangledRenderLanesCursor);
      }
      var suspenseHandlerStackCursor = createCursor(null);
      var shellBoundary = null;
      function pushPrimaryTreeSuspenseHandler(handler) {
        var current = handler.alternate;
        push(suspenseStackCursor, suspenseStackCursor.current & 1);
        push(suspenseHandlerStackCursor, handler);
        null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
      }
      function pushDehydratedActivitySuspenseHandler(fiber) {
        push(suspenseStackCursor, suspenseStackCursor.current);
        push(suspenseHandlerStackCursor, fiber);
        null === shellBoundary && (shellBoundary = fiber);
      }
      function pushOffscreenSuspenseHandler(fiber) {
        22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack(fiber);
      }
      function reuseSuspenseHandlerOnStack() {
        push(suspenseStackCursor, suspenseStackCursor.current);
        push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
      }
      function popSuspenseHandler(fiber) {
        pop(suspenseHandlerStackCursor);
        shellBoundary === fiber && (shellBoundary = null);
        pop(suspenseStackCursor);
      }
      var suspenseStackCursor = createCursor(0);
      function findFirstSuspended(row) {
        for (var node = row; null !== node; ) {
          if (13 === node.tag) {
            var state = node.memoizedState;
            if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state)))
              return node;
          } else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
            if (0 !== (node.flags & 128)) return node;
          } else if (null !== node.child) {
            node.child.return = node;
            node = node.child;
            continue;
          }
          if (node === row) break;
          for (; null === node.sibling; ) {
            if (null === node.return || node.return === row) return null;
            node = node.return;
          }
          node.sibling.return = node.return;
          node = node.sibling;
        }
        return null;
      }
      var renderLanes = 0;
      var currentlyRenderingFiber = null;
      var currentHook = null;
      var workInProgressHook = null;
      var didScheduleRenderPhaseUpdate = false;
      var didScheduleRenderPhaseUpdateDuringThisPass = false;
      var shouldDoubleInvokeUserFnsInHooksDEV = false;
      var localIdCounter = 0;
      var thenableIndexCounter = 0;
      var thenableState = null;
      var globalClientIdCounter = 0;
      function throwInvalidHookError() {
        throw Error(formatProdErrorMessage(321));
      }
      function areHookInputsEqual(nextDeps, prevDeps) {
        if (null === prevDeps) return false;
        for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
          if (!objectIs(nextDeps[i], prevDeps[i])) return false;
        return true;
      }
      function renderWithHooks(current, workInProgress2, Component, props, secondArg, nextRenderLanes) {
        renderLanes = nextRenderLanes;
        currentlyRenderingFiber = workInProgress2;
        workInProgress2.memoizedState = null;
        workInProgress2.updateQueue = null;
        workInProgress2.lanes = 0;
        ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
        shouldDoubleInvokeUserFnsInHooksDEV = false;
        nextRenderLanes = Component(props, secondArg);
        shouldDoubleInvokeUserFnsInHooksDEV = false;
        didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(
          workInProgress2,
          Component,
          props,
          secondArg
        ));
        finishRenderingHooks(current);
        return nextRenderLanes;
      }
      function finishRenderingHooks(current) {
        ReactSharedInternals.H = ContextOnlyDispatcher;
        var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
        renderLanes = 0;
        workInProgressHook = currentHook = currentlyRenderingFiber = null;
        didScheduleRenderPhaseUpdate = false;
        thenableIndexCounter = 0;
        thenableState = null;
        if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
        null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
      }
      function renderWithHooksAgain(workInProgress2, Component, props, secondArg) {
        currentlyRenderingFiber = workInProgress2;
        var numberOfReRenders = 0;
        do {
          didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
          thenableIndexCounter = 0;
          didScheduleRenderPhaseUpdateDuringThisPass = false;
          if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
          numberOfReRenders += 1;
          workInProgressHook = currentHook = null;
          if (null != workInProgress2.updateQueue) {
            var children = workInProgress2.updateQueue;
            children.lastEffect = null;
            children.events = null;
            children.stores = null;
            null != children.memoCache && (children.memoCache.index = 0);
          }
          ReactSharedInternals.H = HooksDispatcherOnRerender;
          children = Component(props, secondArg);
        } while (didScheduleRenderPhaseUpdateDuringThisPass);
        return children;
      }
      function TransitionAwareHostComponent() {
        var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
        maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
        dispatcher = dispatcher.useState()[0];
        (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
        return maybeThenable;
      }
      function checkDidRenderIdHook() {
        var didRenderIdHook = 0 !== localIdCounter;
        localIdCounter = 0;
        return didRenderIdHook;
      }
      function bailoutHooks(current, workInProgress2, lanes) {
        workInProgress2.updateQueue = current.updateQueue;
        workInProgress2.flags &= -2053;
        current.lanes &= ~lanes;
      }
      function resetHooksOnUnwind(workInProgress2) {
        if (didScheduleRenderPhaseUpdate) {
          for (workInProgress2 = workInProgress2.memoizedState; null !== workInProgress2; ) {
            var queue = workInProgress2.queue;
            null !== queue && (queue.pending = null);
            workInProgress2 = workInProgress2.next;
          }
          didScheduleRenderPhaseUpdate = false;
        }
        renderLanes = 0;
        workInProgressHook = currentHook = currentlyRenderingFiber = null;
        didScheduleRenderPhaseUpdateDuringThisPass = false;
        thenableIndexCounter = localIdCounter = 0;
        thenableState = null;
      }
      function mountWorkInProgressHook() {
        var hook = {
          memoizedState: null,
          baseState: null,
          baseQueue: null,
          queue: null,
          next: null
        };
        null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
        return workInProgressHook;
      }
      function updateWorkInProgressHook() {
        if (null === currentHook) {
          var nextCurrentHook = currentlyRenderingFiber.alternate;
          nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
        } else nextCurrentHook = currentHook.next;
        var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
        if (null !== nextWorkInProgressHook)
          workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
        else {
          if (null === nextCurrentHook) {
            if (null === currentlyRenderingFiber.alternate)
              throw Error(formatProdErrorMessage(467));
            throw Error(formatProdErrorMessage(310));
          }
          currentHook = nextCurrentHook;
          nextCurrentHook = {
            memoizedState: currentHook.memoizedState,
            baseState: currentHook.baseState,
            baseQueue: currentHook.baseQueue,
            queue: currentHook.queue,
            next: null
          };
          null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
        }
        return workInProgressHook;
      }
      function createFunctionComponentUpdateQueue() {
        return { lastEffect: null, events: null, stores: null, memoCache: null };
      }
      function useThenable(thenable) {
        var index2 = thenableIndexCounter;
        thenableIndexCounter += 1;
        null === thenableState && (thenableState = []);
        thenable = trackUsedThenable(thenableState, thenable, index2);
        index2 = currentlyRenderingFiber;
        null === (null === workInProgressHook ? index2.memoizedState : workInProgressHook.next) && (index2 = index2.alternate, ReactSharedInternals.H = null === index2 || null === index2.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
        return thenable;
      }
      function use(usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return useThenable(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
        }
        throw Error(formatProdErrorMessage(438, String(usable)));
      }
      function useMemoCache(size) {
        var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
        null !== updateQueue && (memoCache = updateQueue.memoCache);
        if (null == memoCache) {
          var current = currentlyRenderingFiber.alternate;
          null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
            data: current.data.map(function(array) {
              return array.slice();
            }),
            index: 0
          })));
        }
        null == memoCache && (memoCache = { data: [], index: 0 });
        null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
        updateQueue.memoCache = memoCache;
        updateQueue = memoCache.data[memoCache.index];
        if (void 0 === updateQueue)
          for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)
            updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
        memoCache.index++;
        return updateQueue;
      }
      function basicStateReducer(state, action) {
        return "function" === typeof action ? action(state) : action;
      }
      function updateReducer(reducer) {
        var hook = updateWorkInProgressHook();
        return updateReducerImpl(hook, currentHook, reducer);
      }
      function updateReducerImpl(hook, current, reducer) {
        var queue = hook.queue;
        if (null === queue) throw Error(formatProdErrorMessage(311));
        queue.lastRenderedReducer = reducer;
        var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
        if (null !== pendingQueue) {
          if (null !== baseQueue) {
            var baseFirst = baseQueue.next;
            baseQueue.next = pendingQueue.next;
            pendingQueue.next = baseFirst;
          }
          current.baseQueue = baseQueue = pendingQueue;
          queue.pending = null;
        }
        pendingQueue = hook.baseState;
        if (null === baseQueue) hook.memoizedState = pendingQueue;
        else {
          current = baseQueue.next;
          var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = false;
          do {
            var updateLane = update.lane & -536870913;
            if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
              var revertLane = update.revertLane;
              if (0 === revertLane)
                null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: update.action,
                  hasEagerState: update.hasEagerState,
                  eagerState: update.eagerState,
                  next: null
                }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
              else if ((renderLanes & revertLane) === revertLane) {
                update = update.next;
                revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
                continue;
              } else
                updateLane = {
                  lane: 0,
                  revertLane: update.revertLane,
                  gesture: null,
                  action: update.action,
                  hasEagerState: update.hasEagerState,
                  eagerState: update.eagerState,
                  next: null
                }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
              updateLane = update.action;
              shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
              pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
            } else
              revertLane = {
                lane: updateLane,
                revertLane: update.revertLane,
                gesture: update.gesture,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
              }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
            update = update.next;
          } while (null !== update && update !== current);
          null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
          if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer)))
            throw reducer;
          hook.memoizedState = pendingQueue;
          hook.baseState = baseFirst;
          hook.baseQueue = newBaseQueueLast;
          queue.lastRenderedState = pendingQueue;
        }
        null === baseQueue && (queue.lanes = 0);
        return [hook.memoizedState, queue.dispatch];
      }
      function rerenderReducer(reducer) {
        var hook = updateWorkInProgressHook(), queue = hook.queue;
        if (null === queue) throw Error(formatProdErrorMessage(311));
        queue.lastRenderedReducer = reducer;
        var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
        if (null !== lastRenderPhaseUpdate) {
          queue.pending = null;
          var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
          do
            newState = reducer(newState, update.action), update = update.next;
          while (update !== lastRenderPhaseUpdate);
          objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
          hook.memoizedState = newState;
          null === hook.baseQueue && (hook.baseState = newState);
          queue.lastRenderedState = newState;
        }
        return [newState, dispatch];
      }
      function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
        var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
        if (isHydrating$jscomp$0) {
          if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
          getServerSnapshot = getServerSnapshot();
        } else getServerSnapshot = getSnapshot();
        var snapshotChanged = !objectIs(
          (currentHook || hook).memoizedState,
          getServerSnapshot
        );
        snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
        hook = hook.queue;
        updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
          subscribe
        ]);
        if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
          fiber.flags |= 2048;
          pushSimpleEffect(
            9,
            { destroy: void 0 },
            updateStoreInstance.bind(
              null,
              fiber,
              hook,
              getServerSnapshot,
              getSnapshot
            ),
            null
          );
          if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
          isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
        }
        return getServerSnapshot;
      }
      function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
        fiber.flags |= 16384;
        fiber = { getSnapshot, value: renderedSnapshot };
        getSnapshot = currentlyRenderingFiber.updateQueue;
        null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
      }
      function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
        inst.value = nextSnapshot;
        inst.getSnapshot = getSnapshot;
        checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
      }
      function subscribeToStore(fiber, inst, subscribe) {
        return subscribe(function() {
          checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
        });
      }
      function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
          var nextValue = latestGetSnapshot();
          return !objectIs(inst, nextValue);
        } catch (error) {
          return true;
        }
      }
      function forceStoreRerender(fiber) {
        var root2 = enqueueConcurrentRenderForLane(fiber, 2);
        null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2);
      }
      function mountStateImpl(initialState) {
        var hook = mountWorkInProgressHook();
        if ("function" === typeof initialState) {
          var initialStateInitializer = initialState;
          initialState = initialStateInitializer();
          if (shouldDoubleInvokeUserFnsInHooksDEV) {
            setIsStrictModeForDevtools(true);
            try {
              initialStateInitializer();
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }
        }
        hook.memoizedState = hook.baseState = initialState;
        hook.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: initialState
        };
        return hook;
      }
      function updateOptimisticImpl(hook, current, passthrough, reducer) {
        hook.baseState = passthrough;
        return updateReducerImpl(
          hook,
          currentHook,
          "function" === typeof reducer ? reducer : basicStateReducer
        );
      }
      function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
        if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
        fiber = actionQueue.action;
        if (null !== fiber) {
          var actionNode = {
            payload,
            action: fiber,
            next: null,
            isTransition: true,
            status: "pending",
            value: null,
            reason: null,
            listeners: [],
            then: function(listener) {
              actionNode.listeners.push(listener);
            }
          };
          null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
          setState(actionNode);
          setPendingState = actionQueue.pending;
          null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
        }
      }
      function runActionStateAction(actionQueue, node) {
        var action = node.action, payload = node.payload, prevState = actionQueue.state;
        if (node.isTransition) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          ReactSharedInternals.T = currentTransition;
          try {
            var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            handleActionReturnValue(actionQueue, node, returnValue);
          } catch (error) {
            onActionError(actionQueue, node, error);
          } finally {
            null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
          }
        } else
          try {
            prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
          } catch (error$66) {
            onActionError(actionQueue, node, error$66);
          }
      }
      function handleActionReturnValue(actionQueue, node, returnValue) {
        null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(
          function(nextState) {
            onActionSuccess(actionQueue, node, nextState);
          },
          function(error) {
            return onActionError(actionQueue, node, error);
          }
        ) : onActionSuccess(actionQueue, node, returnValue);
      }
      function onActionSuccess(actionQueue, actionNode, nextState) {
        actionNode.status = "fulfilled";
        actionNode.value = nextState;
        notifyActionListeners(actionNode);
        actionQueue.state = nextState;
        actionNode = actionQueue.pending;
        null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
      }
      function onActionError(actionQueue, actionNode, error) {
        var last = actionQueue.pending;
        actionQueue.pending = null;
        if (null !== last) {
          last = last.next;
          do
            actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
          while (actionNode !== last);
        }
        actionQueue.action = null;
      }
      function notifyActionListeners(actionNode) {
        actionNode = actionNode.listeners;
        for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
      }
      function actionStateReducer(oldState, newState) {
        return newState;
      }
      function mountActionState(action, initialStateProp) {
        if (isHydrating) {
          var ssrFormState = workInProgressRoot.formState;
          if (null !== ssrFormState) {
            a: {
              var JSCompiler_inline_result = currentlyRenderingFiber;
              if (isHydrating) {
                if (nextHydratableInstance) {
                  b: {
                    var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
                    for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType; ) {
                      if (!inRootOrSingleton) {
                        JSCompiler_inline_result$jscomp$0 = null;
                        break b;
                      }
                      JSCompiler_inline_result$jscomp$0 = getNextHydratable(
                        JSCompiler_inline_result$jscomp$0.nextSibling
                      );
                      if (null === JSCompiler_inline_result$jscomp$0) {
                        JSCompiler_inline_result$jscomp$0 = null;
                        break b;
                      }
                    }
                    inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
                    JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
                  }
                  if (JSCompiler_inline_result$jscomp$0) {
                    nextHydratableInstance = getNextHydratable(
                      JSCompiler_inline_result$jscomp$0.nextSibling
                    );
                    JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
                    break a;
                  }
                }
                throwOnHydrationMismatch(JSCompiler_inline_result);
              }
              JSCompiler_inline_result = false;
            }
            JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
          }
        }
        ssrFormState = mountWorkInProgressHook();
        ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
        JSCompiler_inline_result = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: actionStateReducer,
          lastRenderedState: initialStateProp
        };
        ssrFormState.queue = JSCompiler_inline_result;
        ssrFormState = dispatchSetState.bind(
          null,
          currentlyRenderingFiber,
          JSCompiler_inline_result
        );
        JSCompiler_inline_result.dispatch = ssrFormState;
        JSCompiler_inline_result = mountStateImpl(false);
        inRootOrSingleton = dispatchOptimisticSetState.bind(
          null,
          currentlyRenderingFiber,
          false,
          JSCompiler_inline_result.queue
        );
        JSCompiler_inline_result = mountWorkInProgressHook();
        JSCompiler_inline_result$jscomp$0 = {
          state: initialStateProp,
          dispatch: null,
          action,
          pending: null
        };
        JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
        ssrFormState = dispatchActionState.bind(
          null,
          currentlyRenderingFiber,
          JSCompiler_inline_result$jscomp$0,
          inRootOrSingleton,
          ssrFormState
        );
        JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
        JSCompiler_inline_result.memoizedState = action;
        return [initialStateProp, ssrFormState, false];
      }
      function updateActionState(action) {
        var stateHook = updateWorkInProgressHook();
        return updateActionStateImpl(stateHook, currentHook, action);
      }
      function updateActionStateImpl(stateHook, currentStateHook, action) {
        currentStateHook = updateReducerImpl(
          stateHook,
          currentStateHook,
          actionStateReducer
        )[0];
        stateHook = updateReducer(basicStateReducer)[0];
        if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then)
          try {
            var state = useThenable(currentStateHook);
          } catch (x) {
            if (x === SuspenseException) throw SuspenseActionException;
            throw x;
          }
        else state = currentStateHook;
        currentStateHook = updateWorkInProgressHook();
        var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
        action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(
          9,
          { destroy: void 0 },
          actionStateActionEffect.bind(null, actionQueue, action),
          null
        ));
        return [state, dispatch, stateHook];
      }
      function actionStateActionEffect(actionQueue, action) {
        actionQueue.action = action;
      }
      function rerenderActionState(action) {
        var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
        if (null !== currentStateHook)
          return updateActionStateImpl(stateHook, currentStateHook, action);
        updateWorkInProgressHook();
        stateHook = stateHook.memoizedState;
        currentStateHook = updateWorkInProgressHook();
        var dispatch = currentStateHook.queue.dispatch;
        currentStateHook.memoizedState = action;
        return [stateHook, dispatch, false];
      }
      function pushSimpleEffect(tag, inst, create, deps) {
        tag = { tag, create, deps, inst, next: null };
        inst = currentlyRenderingFiber.updateQueue;
        null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
        create = inst.lastEffect;
        null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
        return tag;
      }
      function updateRef() {
        return updateWorkInProgressHook().memoizedState;
      }
      function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
        var hook = mountWorkInProgressHook();
        currentlyRenderingFiber.flags |= fiberFlags;
        hook.memoizedState = pushSimpleEffect(
          1 | hookFlags,
          { destroy: void 0 },
          create,
          void 0 === deps ? null : deps
        );
      }
      function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
        var hook = updateWorkInProgressHook();
        deps = void 0 === deps ? null : deps;
        var inst = hook.memoizedState.inst;
        null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(
          1 | hookFlags,
          inst,
          create,
          deps
        ));
      }
      function mountEffect(create, deps) {
        mountEffectImpl(8390656, 8, create, deps);
      }
      function updateEffect(create, deps) {
        updateEffectImpl(2048, 8, create, deps);
      }
      function useEffectEventImpl(payload) {
        currentlyRenderingFiber.flags |= 4;
        var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
        if (null === componentUpdateQueue)
          componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
        else {
          var events = componentUpdateQueue.events;
          null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
        }
      }
      function updateEvent(callback) {
        var ref = updateWorkInProgressHook().memoizedState;
        useEffectEventImpl({ ref, nextImpl: callback });
        return function() {
          if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
          return ref.impl.apply(void 0, arguments);
        };
      }
      function updateInsertionEffect(create, deps) {
        return updateEffectImpl(4, 2, create, deps);
      }
      function updateLayoutEffect(create, deps) {
        return updateEffectImpl(4, 4, create, deps);
      }
      function imperativeHandleEffect(create, ref) {
        if ("function" === typeof ref) {
          create = create();
          var refCleanup = ref(create);
          return function() {
            "function" === typeof refCleanup ? refCleanup() : ref(null);
          };
        }
        if (null !== ref && void 0 !== ref)
          return create = create(), ref.current = create, function() {
            ref.current = null;
          };
      }
      function updateImperativeHandle(ref, create, deps) {
        deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
        updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
      }
      function mountDebugValue() {
      }
      function updateCallback(callback, deps) {
        var hook = updateWorkInProgressHook();
        deps = void 0 === deps ? null : deps;
        var prevState = hook.memoizedState;
        if (null !== deps && areHookInputsEqual(deps, prevState[1]))
          return prevState[0];
        hook.memoizedState = [callback, deps];
        return callback;
      }
      function updateMemo(nextCreate, deps) {
        var hook = updateWorkInProgressHook();
        deps = void 0 === deps ? null : deps;
        var prevState = hook.memoizedState;
        if (null !== deps && areHookInputsEqual(deps, prevState[1]))
          return prevState[0];
        prevState = nextCreate();
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            nextCreate();
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
        hook.memoizedState = [prevState, deps];
        return prevState;
      }
      function mountDeferredValueImpl(hook, value, initialValue) {
        if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
          return hook.memoizedState = value;
        hook.memoizedState = initialValue;
        hook = requestDeferredLane();
        currentlyRenderingFiber.lanes |= hook;
        workInProgressRootSkippedLanes |= hook;
        return initialValue;
      }
      function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
        if (objectIs(value, prevValue)) return value;
        if (null !== currentTreeHiddenStackCursor.current)
          return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
        if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
          return didReceiveUpdate = true, hook.memoizedState = value;
        hook = requestDeferredLane();
        currentlyRenderingFiber.lanes |= hook;
        workInProgressRootSkippedLanes |= hook;
        return prevValue;
      }
      function startTransition(fiber, queue, pendingState, finishedState, callback) {
        var previousPriority = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        dispatchOptimisticSetState(fiber, false, queue, pendingState);
        try {
          var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
            var thenableForFinishedState = chainThenableValue(
              returnValue,
              finishedState
            );
            dispatchSetStateInternal(
              fiber,
              queue,
              thenableForFinishedState,
              requestUpdateLane(fiber)
            );
          } else
            dispatchSetStateInternal(
              fiber,
              queue,
              finishedState,
              requestUpdateLane(fiber)
            );
        } catch (error) {
          dispatchSetStateInternal(
            fiber,
            queue,
            { then: function() {
            }, status: "rejected", reason: error },
            requestUpdateLane()
          );
        } finally {
          ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      }
      function noop() {
      }
      function startHostTransition(formFiber, pendingState, action, formData) {
        if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
        var queue = ensureFormComponentIsStateful(formFiber).queue;
        startTransition(
          formFiber,
          queue,
          pendingState,
          sharedNotPendingObject,
          null === action ? noop : function() {
            requestFormReset$1(formFiber);
            return action(formData);
          }
        );
      }
      function ensureFormComponentIsStateful(formFiber) {
        var existingStateHook = formFiber.memoizedState;
        if (null !== existingStateHook) return existingStateHook;
        existingStateHook = {
          memoizedState: sharedNotPendingObject,
          baseState: sharedNotPendingObject,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: basicStateReducer,
            lastRenderedState: sharedNotPendingObject
          },
          next: null
        };
        var initialResetState = {};
        existingStateHook.next = {
          memoizedState: initialResetState,
          baseState: initialResetState,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: basicStateReducer,
            lastRenderedState: initialResetState
          },
          next: null
        };
        formFiber.memoizedState = existingStateHook;
        formFiber = formFiber.alternate;
        null !== formFiber && (formFiber.memoizedState = existingStateHook);
        return existingStateHook;
      }
      function requestFormReset$1(formFiber) {
        var stateHook = ensureFormComponentIsStateful(formFiber);
        null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
        dispatchSetStateInternal(
          formFiber,
          stateHook.next.queue,
          {},
          requestUpdateLane()
        );
      }
      function useHostTransitionStatus() {
        return readContext(HostTransitionContext);
      }
      function updateId() {
        return updateWorkInProgressHook().memoizedState;
      }
      function updateRefresh() {
        return updateWorkInProgressHook().memoizedState;
      }
      function refreshCache(fiber) {
        for (var provider = fiber.return; null !== provider; ) {
          switch (provider.tag) {
            case 24:
            case 3:
              var lane = requestUpdateLane();
              fiber = createUpdate(lane);
              var root$69 = enqueueUpdate(provider, fiber, lane);
              null !== root$69 && (scheduleUpdateOnFiber(root$69, provider, lane), entangleTransitions(root$69, provider, lane));
              provider = { cache: createCache() };
              fiber.payload = provider;
              return;
          }
          provider = provider.return;
        }
      }
      function dispatchReducerAction(fiber, queue, action) {
        var lane = requestUpdateLane();
        action = {
          lane,
          revertLane: 0,
          gesture: null,
          action,
          hasEagerState: false,
          eagerState: null,
          next: null
        };
        isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
      }
      function dispatchSetState(fiber, queue, action) {
        var lane = requestUpdateLane();
        dispatchSetStateInternal(fiber, queue, action, lane);
      }
      function dispatchSetStateInternal(fiber, queue, action, lane) {
        var update = {
          lane,
          revertLane: 0,
          gesture: null,
          action,
          hasEagerState: false,
          eagerState: null,
          next: null
        };
        if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
        else {
          var alternate = fiber.alternate;
          if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate))
            try {
              var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
              update.hasEagerState = true;
              update.eagerState = eagerState;
              if (objectIs(eagerState, currentState))
                return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), false;
            } catch (error) {
            } finally {
            }
          action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
          if (null !== action)
            return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), true;
        }
        return false;
      }
      function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
        action = {
          lane: 2,
          revertLane: requestTransitionLane(),
          gesture: null,
          action,
          hasEagerState: false,
          eagerState: null,
          next: null
        };
        if (isRenderPhaseUpdate(fiber)) {
          if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
        } else
          throwIfDuringRender = enqueueConcurrentHookUpdate(
            fiber,
            queue,
            action,
            2
          ), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
      }
      function isRenderPhaseUpdate(fiber) {
        var alternate = fiber.alternate;
        return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
      }
      function enqueueRenderPhaseUpdate(queue, update) {
        didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
        var pending = queue.pending;
        null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
        queue.pending = update;
      }
      function entangleTransitionUpdate(root2, queue, lane) {
        if (0 !== (lane & 4194048)) {
          var queueLanes = queue.lanes;
          queueLanes &= root2.pendingLanes;
          lane |= queueLanes;
          queue.lanes = lane;
          markRootEntangled(root2, lane);
        }
      }
      var ContextOnlyDispatcher = {
        readContext,
        use,
        useCallback: throwInvalidHookError,
        useContext: throwInvalidHookError,
        useEffect: throwInvalidHookError,
        useImperativeHandle: throwInvalidHookError,
        useLayoutEffect: throwInvalidHookError,
        useInsertionEffect: throwInvalidHookError,
        useMemo: throwInvalidHookError,
        useReducer: throwInvalidHookError,
        useRef: throwInvalidHookError,
        useState: throwInvalidHookError,
        useDebugValue: throwInvalidHookError,
        useDeferredValue: throwInvalidHookError,
        useTransition: throwInvalidHookError,
        useSyncExternalStore: throwInvalidHookError,
        useId: throwInvalidHookError,
        useHostTransitionStatus: throwInvalidHookError,
        useFormState: throwInvalidHookError,
        useActionState: throwInvalidHookError,
        useOptimistic: throwInvalidHookError,
        useMemoCache: throwInvalidHookError,
        useCacheRefresh: throwInvalidHookError
      };
      ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
      var HooksDispatcherOnMount = {
        readContext,
        use,
        useCallback: function(callback, deps) {
          mountWorkInProgressHook().memoizedState = [
            callback,
            void 0 === deps ? null : deps
          ];
          return callback;
        },
        useContext: readContext,
        useEffect: mountEffect,
        useImperativeHandle: function(ref, create, deps) {
          deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
          mountEffectImpl(
            4194308,
            4,
            imperativeHandleEffect.bind(null, create, ref),
            deps
          );
        },
        useLayoutEffect: function(create, deps) {
          return mountEffectImpl(4194308, 4, create, deps);
        },
        useInsertionEffect: function(create, deps) {
          mountEffectImpl(4, 2, create, deps);
        },
        useMemo: function(nextCreate, deps) {
          var hook = mountWorkInProgressHook();
          deps = void 0 === deps ? null : deps;
          var nextValue = nextCreate();
          if (shouldDoubleInvokeUserFnsInHooksDEV) {
            setIsStrictModeForDevtools(true);
            try {
              nextCreate();
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }
          hook.memoizedState = [nextValue, deps];
          return nextValue;
        },
        useReducer: function(reducer, initialArg, init) {
          var hook = mountWorkInProgressHook();
          if (void 0 !== init) {
            var initialState = init(initialArg);
            if (shouldDoubleInvokeUserFnsInHooksDEV) {
              setIsStrictModeForDevtools(true);
              try {
                init(initialArg);
              } finally {
                setIsStrictModeForDevtools(false);
              }
            }
          } else initialState = initialArg;
          hook.memoizedState = hook.baseState = initialState;
          reducer = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: reducer,
            lastRenderedState: initialState
          };
          hook.queue = reducer;
          reducer = reducer.dispatch = dispatchReducerAction.bind(
            null,
            currentlyRenderingFiber,
            reducer
          );
          return [hook.memoizedState, reducer];
        },
        useRef: function(initialValue) {
          var hook = mountWorkInProgressHook();
          initialValue = { current: initialValue };
          return hook.memoizedState = initialValue;
        },
        useState: function(initialState) {
          initialState = mountStateImpl(initialState);
          var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
          queue.dispatch = dispatch;
          return [initialState.memoizedState, dispatch];
        },
        useDebugValue: mountDebugValue,
        useDeferredValue: function(value, initialValue) {
          var hook = mountWorkInProgressHook();
          return mountDeferredValueImpl(hook, value, initialValue);
        },
        useTransition: function() {
          var stateHook = mountStateImpl(false);
          stateHook = startTransition.bind(
            null,
            currentlyRenderingFiber,
            stateHook.queue,
            true,
            false
          );
          mountWorkInProgressHook().memoizedState = stateHook;
          return [false, stateHook];
        },
        useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
          var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
          if (isHydrating) {
            if (void 0 === getServerSnapshot)
              throw Error(formatProdErrorMessage(407));
            getServerSnapshot = getServerSnapshot();
          } else {
            getServerSnapshot = getSnapshot();
            if (null === workInProgressRoot)
              throw Error(formatProdErrorMessage(349));
            0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
          }
          hook.memoizedState = getServerSnapshot;
          var inst = { value: getServerSnapshot, getSnapshot };
          hook.queue = inst;
          mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
            subscribe
          ]);
          fiber.flags |= 2048;
          pushSimpleEffect(
            9,
            { destroy: void 0 },
            updateStoreInstance.bind(
              null,
              fiber,
              inst,
              getServerSnapshot,
              getSnapshot
            ),
            null
          );
          return getServerSnapshot;
        },
        useId: function() {
          var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
          if (isHydrating) {
            var JSCompiler_inline_result = treeContextOverflow;
            var idWithLeadingBit = treeContextId;
            JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
            identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
            JSCompiler_inline_result = localIdCounter++;
            0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
            identifierPrefix += "_";
          } else
            JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
          return hook.memoizedState = identifierPrefix;
        },
        useHostTransitionStatus,
        useFormState: mountActionState,
        useActionState: mountActionState,
        useOptimistic: function(passthrough) {
          var hook = mountWorkInProgressHook();
          hook.memoizedState = hook.baseState = passthrough;
          var queue = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null
          };
          hook.queue = queue;
          hook = dispatchOptimisticSetState.bind(
            null,
            currentlyRenderingFiber,
            true,
            queue
          );
          queue.dispatch = hook;
          return [passthrough, hook];
        },
        useMemoCache,
        useCacheRefresh: function() {
          return mountWorkInProgressHook().memoizedState = refreshCache.bind(
            null,
            currentlyRenderingFiber
          );
        },
        useEffectEvent: function(callback) {
          var hook = mountWorkInProgressHook(), ref = { impl: callback };
          hook.memoizedState = ref;
          return function() {
            if (0 !== (executionContext & 2))
              throw Error(formatProdErrorMessage(440));
            return ref.impl.apply(void 0, arguments);
          };
        }
      };
      var HooksDispatcherOnUpdate = {
        readContext,
        use,
        useCallback: updateCallback,
        useContext: readContext,
        useEffect: updateEffect,
        useImperativeHandle: updateImperativeHandle,
        useInsertionEffect: updateInsertionEffect,
        useLayoutEffect: updateLayoutEffect,
        useMemo: updateMemo,
        useReducer: updateReducer,
        useRef: updateRef,
        useState: function() {
          return updateReducer(basicStateReducer);
        },
        useDebugValue: mountDebugValue,
        useDeferredValue: function(value, initialValue) {
          var hook = updateWorkInProgressHook();
          return updateDeferredValueImpl(
            hook,
            currentHook.memoizedState,
            value,
            initialValue
          );
        },
        useTransition: function() {
          var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
          return [
            "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
            start
          ];
        },
        useSyncExternalStore: updateSyncExternalStore,
        useId: updateId,
        useHostTransitionStatus,
        useFormState: updateActionState,
        useActionState: updateActionState,
        useOptimistic: function(passthrough, reducer) {
          var hook = updateWorkInProgressHook();
          return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
        },
        useMemoCache,
        useCacheRefresh: updateRefresh
      };
      HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
      var HooksDispatcherOnRerender = {
        readContext,
        use,
        useCallback: updateCallback,
        useContext: readContext,
        useEffect: updateEffect,
        useImperativeHandle: updateImperativeHandle,
        useInsertionEffect: updateInsertionEffect,
        useLayoutEffect: updateLayoutEffect,
        useMemo: updateMemo,
        useReducer: rerenderReducer,
        useRef: updateRef,
        useState: function() {
          return rerenderReducer(basicStateReducer);
        },
        useDebugValue: mountDebugValue,
        useDeferredValue: function(value, initialValue) {
          var hook = updateWorkInProgressHook();
          return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(
            hook,
            currentHook.memoizedState,
            value,
            initialValue
          );
        },
        useTransition: function() {
          var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
          return [
            "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
            start
          ];
        },
        useSyncExternalStore: updateSyncExternalStore,
        useId: updateId,
        useHostTransitionStatus,
        useFormState: rerenderActionState,
        useActionState: rerenderActionState,
        useOptimistic: function(passthrough, reducer) {
          var hook = updateWorkInProgressHook();
          if (null !== currentHook)
            return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
          hook.baseState = passthrough;
          return [passthrough, hook.queue.dispatch];
        },
        useMemoCache,
        useCacheRefresh: updateRefresh
      };
      HooksDispatcherOnRerender.useEffectEvent = updateEvent;
      function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
        ctor = workInProgress2.memoizedState;
        getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
        getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
        workInProgress2.memoizedState = getDerivedStateFromProps;
        0 === workInProgress2.lanes && (workInProgress2.updateQueue.baseState = getDerivedStateFromProps);
      }
      var classComponentUpdater = {
        enqueueSetState: function(inst, payload, callback) {
          inst = inst._reactInternals;
          var lane = requestUpdateLane(), update = createUpdate(lane);
          update.payload = payload;
          void 0 !== callback && null !== callback && (update.callback = callback);
          payload = enqueueUpdate(inst, update, lane);
          null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
        },
        enqueueReplaceState: function(inst, payload, callback) {
          inst = inst._reactInternals;
          var lane = requestUpdateLane(), update = createUpdate(lane);
          update.tag = 1;
          update.payload = payload;
          void 0 !== callback && null !== callback && (update.callback = callback);
          payload = enqueueUpdate(inst, update, lane);
          null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
        },
        enqueueForceUpdate: function(inst, callback) {
          inst = inst._reactInternals;
          var lane = requestUpdateLane(), update = createUpdate(lane);
          update.tag = 2;
          void 0 !== callback && null !== callback && (update.callback = callback);
          callback = enqueueUpdate(inst, update, lane);
          null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
        }
      };
      function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
        workInProgress2 = workInProgress2.stateNode;
        return "function" === typeof workInProgress2.shouldComponentUpdate ? workInProgress2.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
      }
      function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
        workInProgress2 = instance.state;
        "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
        "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
        instance.state !== workInProgress2 && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
      }
      function resolveClassComponentProps(Component, baseProps) {
        var newProps = baseProps;
        if ("ref" in baseProps) {
          newProps = {};
          for (var propName in baseProps)
            "ref" !== propName && (newProps[propName] = baseProps[propName]);
        }
        if (Component = Component.defaultProps) {
          newProps === baseProps && (newProps = assign({}, newProps));
          for (var propName$73 in Component)
            void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
        }
        return newProps;
      }
      function defaultOnUncaughtError(error) {
        reportGlobalError(error);
      }
      function defaultOnCaughtError(error) {
        console.error(error);
      }
      function defaultOnRecoverableError(error) {
        reportGlobalError(error);
      }
      function logUncaughtError(root2, errorInfo) {
        try {
          var onUncaughtError = root2.onUncaughtError;
          onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
        } catch (e$74) {
          setTimeout(function() {
            throw e$74;
          });
        }
      }
      function logCaughtError(root2, boundary, errorInfo) {
        try {
          var onCaughtError = root2.onCaughtError;
          onCaughtError(errorInfo.value, {
            componentStack: errorInfo.stack,
            errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
          });
        } catch (e$75) {
          setTimeout(function() {
            throw e$75;
          });
        }
      }
      function createRootErrorUpdate(root2, errorInfo, lane) {
        lane = createUpdate(lane);
        lane.tag = 3;
        lane.payload = { element: null };
        lane.callback = function() {
          logUncaughtError(root2, errorInfo);
        };
        return lane;
      }
      function createClassErrorUpdate(lane) {
        lane = createUpdate(lane);
        lane.tag = 3;
        return lane;
      }
      function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
        var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
        if ("function" === typeof getDerivedStateFromError) {
          var error = errorInfo.value;
          update.payload = function() {
            return getDerivedStateFromError(error);
          };
          update.callback = function() {
            logCaughtError(root2, fiber, errorInfo);
          };
        }
        var inst = fiber.stateNode;
        null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
          logCaughtError(root2, fiber, errorInfo);
          "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
          var stack = errorInfo.stack;
          this.componentDidCatch(errorInfo.value, {
            componentStack: null !== stack ? stack : ""
          });
        });
      }
      function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
        sourceFiber.flags |= 32768;
        if (null !== value && "object" === typeof value && "function" === typeof value.then) {
          returnFiber = sourceFiber.alternate;
          null !== returnFiber && propagateParentContextChanges(
            returnFiber,
            sourceFiber,
            rootRenderLanes,
            true
          );
          sourceFiber = suspenseHandlerStackCursor.current;
          if (null !== sourceFiber) {
            switch (sourceFiber.tag) {
              case 31:
              case 13:
                return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = /* @__PURE__ */ new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), false;
              case 22:
                return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
                  transitions: null,
                  markerInstances: null,
                  retryQueue: /* @__PURE__ */ new Set([value])
                }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = /* @__PURE__ */ new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), false;
            }
            throw Error(formatProdErrorMessage(435, sourceFiber.tag));
          }
          attachPingListener(root2, value, rootRenderLanes);
          renderDidSuspendDelayIfPossible();
          return false;
        }
        if (isHydrating)
          return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root2 = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root2, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
            cause: value
          }), queueHydrationError(
            createCapturedValueAtFiber(returnFiber, sourceFiber)
          )), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(
            root2.stateNode,
            value,
            rootRenderLanes
          ), enqueueCapturedUpdate(root2, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
        var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
        wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
        null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
        4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
        if (null === returnFiber) return true;
        value = createCapturedValueAtFiber(value, sourceFiber);
        sourceFiber = returnFiber;
        do {
          switch (sourceFiber.tag) {
            case 3:
              return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), false;
            case 1:
              if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError))))
                return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(
                  rootRenderLanes,
                  root2,
                  sourceFiber,
                  value
                ), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
          }
          sourceFiber = sourceFiber.return;
        } while (null !== sourceFiber);
        return false;
      }
      var SelectiveHydrationException = Error(formatProdErrorMessage(461));
      var didReceiveUpdate = false;
      function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
        workInProgress2.child = null === current ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(
          workInProgress2,
          current.child,
          nextChildren,
          renderLanes2
        );
      }
      function updateForwardRef(current, workInProgress2, Component, nextProps, renderLanes2) {
        Component = Component.render;
        var ref = workInProgress2.ref;
        if ("ref" in nextProps) {
          var propsWithoutRef = {};
          for (var key in nextProps)
            "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
        } else propsWithoutRef = nextProps;
        prepareToReadContext(workInProgress2);
        nextProps = renderWithHooks(
          current,
          workInProgress2,
          Component,
          propsWithoutRef,
          ref,
          renderLanes2
        );
        key = checkDidRenderIdHook();
        if (null !== current && !didReceiveUpdate)
          return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
        isHydrating && key && pushMaterializedTreeId(workInProgress2);
        workInProgress2.flags |= 1;
        reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
        return workInProgress2.child;
      }
      function updateMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
        if (null === current) {
          var type = Component.type;
          if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare)
            return workInProgress2.tag = 15, workInProgress2.type = type, updateSimpleMemoComponent(
              current,
              workInProgress2,
              type,
              nextProps,
              renderLanes2
            );
          current = createFiberFromTypeAndProps(
            Component.type,
            null,
            nextProps,
            workInProgress2,
            workInProgress2.mode,
            renderLanes2
          );
          current.ref = workInProgress2.ref;
          current.return = workInProgress2;
          return workInProgress2.child = current;
        }
        type = current.child;
        if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
          var prevProps = type.memoizedProps;
          Component = Component.compare;
          Component = null !== Component ? Component : shallowEqual;
          if (Component(prevProps, nextProps) && current.ref === workInProgress2.ref)
            return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
        }
        workInProgress2.flags |= 1;
        current = createWorkInProgress(type, nextProps);
        current.ref = workInProgress2.ref;
        current.return = workInProgress2;
        return workInProgress2.child = current;
      }
      function updateSimpleMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
        if (null !== current) {
          var prevProps = current.memoizedProps;
          if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref)
            if (didReceiveUpdate = false, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes2))
              0 !== (current.flags & 131072) && (didReceiveUpdate = true);
            else
              return workInProgress2.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
        }
        return updateFunctionComponent(
          current,
          workInProgress2,
          Component,
          nextProps,
          renderLanes2
        );
      }
      function updateOffscreenComponent(current, workInProgress2, renderLanes2, nextProps) {
        var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
        null === current && null === workInProgress2.stateNode && (workInProgress2.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null
        });
        if ("hidden" === nextProps.mode) {
          if (0 !== (workInProgress2.flags & 128)) {
            prevState = null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2;
            if (null !== current) {
              nextProps = workInProgress2.child = current.child;
              for (nextChildren = 0; null !== nextProps; )
                nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
              nextProps = nextChildren & ~prevState;
            } else nextProps = 0, workInProgress2.child = null;
            return deferHiddenOffscreenComponent(
              current,
              workInProgress2,
              prevState,
              renderLanes2,
              nextProps
            );
          }
          if (0 !== (renderLanes2 & 536870912))
            workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, null !== current && pushTransition(
              workInProgress2,
              null !== prevState ? prevState.cachePool : null
            ), null !== prevState ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress2);
          else
            return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(
              current,
              workInProgress2,
              null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2,
              renderLanes2,
              nextProps
            );
        } else
          null !== prevState ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(workInProgress2), workInProgress2.memoizedState = null) : (null !== current && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack(workInProgress2));
        reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
        return workInProgress2.child;
      }
      function bailoutOffscreenComponent(current, workInProgress2) {
        null !== current && 22 === current.tag || null !== workInProgress2.stateNode || (workInProgress2.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null
        });
        return workInProgress2.sibling;
      }
      function deferHiddenOffscreenComponent(current, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
        var JSCompiler_inline_result = peekCacheFromPool();
        JSCompiler_inline_result = null === JSCompiler_inline_result ? null : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
        workInProgress2.memoizedState = {
          baseLanes: nextBaseLanes,
          cachePool: JSCompiler_inline_result
        };
        null !== current && pushTransition(workInProgress2, null);
        reuseHiddenContextOnStack();
        pushOffscreenSuspenseHandler(workInProgress2);
        null !== current && propagateParentContextChanges(current, workInProgress2, renderLanes2, true);
        workInProgress2.childLanes = remainingChildLanes;
        return null;
      }
      function mountActivityChildren(workInProgress2, nextProps) {
        nextProps = mountWorkInProgressOffscreenFiber(
          { mode: nextProps.mode, children: nextProps.children },
          workInProgress2.mode
        );
        nextProps.ref = workInProgress2.ref;
        workInProgress2.child = nextProps;
        nextProps.return = workInProgress2;
        return nextProps;
      }
      function retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
        reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
        current = mountActivityChildren(workInProgress2, workInProgress2.pendingProps);
        current.flags |= 2;
        popSuspenseHandler(workInProgress2);
        workInProgress2.memoizedState = null;
        return current;
      }
      function updateActivityComponent(current, workInProgress2, renderLanes2) {
        var nextProps = workInProgress2.pendingProps, didSuspend = 0 !== (workInProgress2.flags & 128);
        workInProgress2.flags &= -129;
        if (null === current) {
          if (isHydrating) {
            if ("hidden" === nextProps.mode)
              return current = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, bailoutOffscreenComponent(null, current);
            pushDehydratedActivitySuspenseHandler(workInProgress2);
            (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
              current,
              rootOrSingletonContext
            ), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
              dehydrated: current,
              treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
            if (null === current) throw throwOnHydrationMismatch(workInProgress2);
            workInProgress2.lanes = 536870912;
            return null;
          }
          return mountActivityChildren(workInProgress2, nextProps);
        }
        var prevState = current.memoizedState;
        if (null !== prevState) {
          var dehydrated = prevState.dehydrated;
          pushDehydratedActivitySuspenseHandler(workInProgress2);
          if (didSuspend)
            if (workInProgress2.flags & 256)
              workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(
                current,
                workInProgress2,
                renderLanes2
              );
            else if (null !== workInProgress2.memoizedState)
              workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null;
            else throw Error(formatProdErrorMessage(558));
          else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), didSuspend = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || didSuspend) {
            nextProps = workInProgressRoot;
            if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes2), 0 !== dehydrated && dehydrated !== prevState.retryLane))
              throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
            renderDidSuspendDelayIfPossible();
            workInProgress2 = retryActivityComponentWithoutHydrating(
              current,
              workInProgress2,
              renderLanes2
            );
          } else
            current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 4096;
          return workInProgress2;
        }
        current = createWorkInProgress(current.child, {
          mode: nextProps.mode,
          children: nextProps.children
        });
        current.ref = workInProgress2.ref;
        workInProgress2.child = current;
        current.return = workInProgress2;
        return current;
      }
      function markRef(current, workInProgress2) {
        var ref = workInProgress2.ref;
        if (null === ref)
          null !== current && null !== current.ref && (workInProgress2.flags |= 4194816);
        else {
          if ("function" !== typeof ref && "object" !== typeof ref)
            throw Error(formatProdErrorMessage(284));
          if (null === current || current.ref !== ref)
            workInProgress2.flags |= 4194816;
        }
      }
      function updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
        prepareToReadContext(workInProgress2);
        Component = renderWithHooks(
          current,
          workInProgress2,
          Component,
          nextProps,
          void 0,
          renderLanes2
        );
        nextProps = checkDidRenderIdHook();
        if (null !== current && !didReceiveUpdate)
          return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
        isHydrating && nextProps && pushMaterializedTreeId(workInProgress2);
        workInProgress2.flags |= 1;
        reconcileChildren(current, workInProgress2, Component, renderLanes2);
        return workInProgress2.child;
      }
      function replayFunctionComponent(current, workInProgress2, nextProps, Component, secondArg, renderLanes2) {
        prepareToReadContext(workInProgress2);
        workInProgress2.updateQueue = null;
        nextProps = renderWithHooksAgain(
          workInProgress2,
          Component,
          nextProps,
          secondArg
        );
        finishRenderingHooks(current);
        Component = checkDidRenderIdHook();
        if (null !== current && !didReceiveUpdate)
          return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
        isHydrating && Component && pushMaterializedTreeId(workInProgress2);
        workInProgress2.flags |= 1;
        reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
        return workInProgress2.child;
      }
      function updateClassComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
        prepareToReadContext(workInProgress2);
        if (null === workInProgress2.stateNode) {
          var context = emptyContextObject, contextType = Component.contextType;
          "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
          context = new Component(nextProps, context);
          workInProgress2.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
          context.updater = classComponentUpdater;
          workInProgress2.stateNode = context;
          context._reactInternals = workInProgress2;
          context = workInProgress2.stateNode;
          context.props = nextProps;
          context.state = workInProgress2.memoizedState;
          context.refs = {};
          initializeUpdateQueue(workInProgress2);
          contextType = Component.contextType;
          context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
          context.state = workInProgress2.memoizedState;
          contextType = Component.getDerivedStateFromProps;
          "function" === typeof contextType && (applyDerivedStateFromProps(
            workInProgress2,
            Component,
            contextType,
            nextProps
          ), context.state = workInProgress2.memoizedState);
          "function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress2, nextProps, context, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress2.memoizedState);
          "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308);
          nextProps = true;
        } else if (null === current) {
          context = workInProgress2.stateNode;
          var unresolvedOldProps = workInProgress2.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
          context.props = oldProps;
          var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
          contextType = emptyContextObject;
          "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
          var getDerivedStateFromProps = Component.getDerivedStateFromProps;
          contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
          unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps;
          contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(
            workInProgress2,
            context,
            nextProps,
            contextType
          );
          hasForceUpdate = false;
          var oldState = workInProgress2.memoizedState;
          context.state = oldState;
          processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
          suspendIfUpdateReadFromEntangledAsyncAction();
          oldContext = workInProgress2.memoizedState;
          unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(
            workInProgress2,
            Component,
            getDerivedStateFromProps,
            nextProps
          ), oldContext = workInProgress2.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(
            workInProgress2,
            Component,
            oldProps,
            nextProps,
            oldState,
            oldContext,
            contextType
          )) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), nextProps = false);
        } else {
          context = workInProgress2.stateNode;
          cloneUpdateQueue(current, workInProgress2);
          contextType = workInProgress2.memoizedProps;
          contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
          context.props = contextType$jscomp$0;
          getDerivedStateFromProps = workInProgress2.pendingProps;
          oldState = context.context;
          oldContext = Component.contextType;
          oldProps = emptyContextObject;
          "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
          unresolvedOldProps = Component.getDerivedStateFromProps;
          (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(
            workInProgress2,
            context,
            nextProps,
            oldProps
          );
          hasForceUpdate = false;
          oldState = workInProgress2.memoizedState;
          context.state = oldState;
          processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
          suspendIfUpdateReadFromEntangledAsyncAction();
          var newState = workInProgress2.memoizedState;
          contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(
            workInProgress2,
            Component,
            unresolvedOldProps,
            nextProps
          ), newState = workInProgress2.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(
            workInProgress2,
            Component,
            contextType$jscomp$0,
            nextProps,
            oldState,
            newState,
            oldProps
          ) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(
            nextProps,
            newState,
            oldProps
          )), "function" === typeof context.componentDidUpdate && (workInProgress2.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress2.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), nextProps = false);
        }
        context = nextProps;
        markRef(current, workInProgress2);
        nextProps = 0 !== (workInProgress2.flags & 128);
        context || nextProps ? (context = workInProgress2.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress2.flags |= 1, null !== current && nextProps ? (workInProgress2.child = reconcileChildFibers(
          workInProgress2,
          current.child,
          null,
          renderLanes2
        ), workInProgress2.child = reconcileChildFibers(
          workInProgress2,
          null,
          Component,
          renderLanes2
        )) : reconcileChildren(current, workInProgress2, Component, renderLanes2), workInProgress2.memoizedState = context.state, current = workInProgress2.child) : current = bailoutOnAlreadyFinishedWork(
          current,
          workInProgress2,
          renderLanes2
        );
        return current;
      }
      function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2) {
        resetHydrationState();
        workInProgress2.flags |= 256;
        reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
        return workInProgress2.child;
      }
      var SUSPENDED_MARKER = {
        dehydrated: null,
        treeContext: null,
        retryLane: 0,
        hydrationErrors: null
      };
      function mountSuspenseOffscreenState(renderLanes2) {
        return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
      }
      function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes2) {
        current = null !== current ? current.childLanes & ~renderLanes2 : 0;
        primaryTreeDidDefer && (current |= workInProgressDeferredLane);
        return current;
      }
      function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
        var nextProps = workInProgress2.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress2.flags & 128), JSCompiler_temp;
        (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
        JSCompiler_temp && (showFallback = true, workInProgress2.flags &= -129);
        JSCompiler_temp = 0 !== (workInProgress2.flags & 32);
        workInProgress2.flags &= -33;
        if (null === current) {
          if (isHydrating) {
            showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack(workInProgress2);
            (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
              current,
              rootOrSingletonContext
            ), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
              dehydrated: current,
              treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
            if (null === current) throw throwOnHydrationMismatch(workInProgress2);
            isSuspenseInstanceFallback(current) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912;
            return null;
          }
          var nextPrimaryChildren = nextProps.children;
          nextProps = nextProps.fallback;
          if (showFallback)
            return reuseSuspenseHandlerOnStack(workInProgress2), showFallback = workInProgress2.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber(
              { mode: "hidden", children: nextPrimaryChildren },
              showFallback
            ), nextProps = createFiberFromFragment(
              nextProps,
              showFallback,
              renderLanes2,
              null
            ), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextPrimaryChildren.sibling = nextProps, workInProgress2.child = nextPrimaryChildren, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
              current,
              JSCompiler_temp,
              renderLanes2
            ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
          pushPrimaryTreeSuspenseHandler(workInProgress2);
          return mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
        }
        var prevState = current.memoizedState;
        if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
          if (didSuspend)
            workInProgress2.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, workInProgress2 = retrySuspenseComponentWithoutHydrating(
              current,
              workInProgress2,
              renderLanes2
            )) : null !== workInProgress2.memoizedState ? (reuseSuspenseHandlerOnStack(workInProgress2), workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null) : (reuseSuspenseHandlerOnStack(workInProgress2), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, nextProps = mountWorkInProgressOffscreenFiber(
              { mode: "visible", children: nextProps.children },
              showFallback
            ), nextPrimaryChildren = createFiberFromFragment(
              nextPrimaryChildren,
              showFallback,
              renderLanes2,
              null
            ), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress2, nextPrimaryChildren.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, reconcileChildFibers(
              workInProgress2,
              current.child,
              null,
              renderLanes2
            ), nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
              current,
              JSCompiler_temp,
              renderLanes2
            ), workInProgress2.memoizedState = SUSPENDED_MARKER, workInProgress2 = bailoutOffscreenComponent(null, nextProps));
          else if (pushPrimaryTreeSuspenseHandler(workInProgress2), isSuspenseInstanceFallback(nextPrimaryChildren)) {
            JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
            if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
            JSCompiler_temp = digest;
            nextProps = Error(formatProdErrorMessage(419));
            nextProps.stack = "";
            nextProps.digest = JSCompiler_temp;
            queueHydrationError({ value: nextProps, source: null, stack: null });
            workInProgress2 = retrySuspenseComponentWithoutHydrating(
              current,
              workInProgress2,
              renderLanes2
            );
          } else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), JSCompiler_temp = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
            JSCompiler_temp = workInProgressRoot;
            if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes2), 0 !== nextProps && nextProps !== prevState.retryLane))
              throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
            isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
            workInProgress2 = retrySuspenseComponentWithoutHydrating(
              current,
              workInProgress2,
              renderLanes2
            );
          } else
            isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress2.flags |= 192, workInProgress2.child = current.child, workInProgress2 = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(
              nextPrimaryChildren.nextSibling
            ), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountSuspensePrimaryChildren(
              workInProgress2,
              nextProps.children
            ), workInProgress2.flags |= 4096);
          return workInProgress2;
        }
        if (showFallback)
          return reuseSuspenseHandlerOnStack(workInProgress2), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
            mode: "hidden",
            children: nextProps.children
          }), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(
            digest,
            nextPrimaryChildren
          ) : (nextPrimaryChildren = createFiberFromFragment(
            nextPrimaryChildren,
            showFallback,
            renderLanes2,
            null
          ), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes2) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? { parent: prevState, pool: prevState } : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
            baseLanes: nextPrimaryChildren.baseLanes | renderLanes2,
            cachePool: showFallback
          }), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(
            current,
            JSCompiler_temp,
            renderLanes2
          ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
        pushPrimaryTreeSuspenseHandler(workInProgress2);
        renderLanes2 = current.child;
        current = renderLanes2.sibling;
        renderLanes2 = createWorkInProgress(renderLanes2, {
          mode: "visible",
          children: nextProps.children
        });
        renderLanes2.return = workInProgress2;
        renderLanes2.sibling = null;
        null !== current && (JSCompiler_temp = workInProgress2.deletions, null === JSCompiler_temp ? (workInProgress2.deletions = [current], workInProgress2.flags |= 16) : JSCompiler_temp.push(current));
        workInProgress2.child = renderLanes2;
        workInProgress2.memoizedState = null;
        return renderLanes2;
      }
      function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
        primaryChildren = mountWorkInProgressOffscreenFiber(
          { mode: "visible", children: primaryChildren },
          workInProgress2.mode
        );
        primaryChildren.return = workInProgress2;
        return workInProgress2.child = primaryChildren;
      }
      function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
        offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
        offscreenProps.lanes = 0;
        return offscreenProps;
      }
      function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
        reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
        current = mountSuspensePrimaryChildren(
          workInProgress2,
          workInProgress2.pendingProps.children
        );
        current.flags |= 2;
        workInProgress2.memoizedState = null;
        return current;
      }
      function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
        fiber.lanes |= renderLanes2;
        var alternate = fiber.alternate;
        null !== alternate && (alternate.lanes |= renderLanes2);
        scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
      }
      function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
        var renderState = workInProgress2.memoizedState;
        null === renderState ? workInProgress2.memoizedState = {
          isBackwards,
          rendering: null,
          renderingStartTime: 0,
          last: lastContentRow,
          tail,
          tailMode,
          treeForkCount: treeForkCount2
        } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
      }
      function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
        var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
        nextProps = nextProps.children;
        var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
        shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress2.flags |= 128) : suspenseContext &= 1;
        push(suspenseStackCursor, suspenseContext);
        reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
        nextProps = isHydrating ? treeForkCount : 0;
        if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128))
          a: for (current = workInProgress2.child; null !== current; ) {
            if (13 === current.tag)
              null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
            else if (19 === current.tag)
              scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
            else if (null !== current.child) {
              current.child.return = current;
              current = current.child;
              continue;
            }
            if (current === workInProgress2) break a;
            for (; null === current.sibling; ) {
              if (null === current.return || current.return === workInProgress2)
                break a;
              current = current.return;
            }
            current.sibling.return = current.return;
            current = current.sibling;
          }
        switch (revealOrder) {
          case "forwards":
            renderLanes2 = workInProgress2.child;
            for (revealOrder = null; null !== renderLanes2; )
              current = renderLanes2.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes2), renderLanes2 = renderLanes2.sibling;
            renderLanes2 = revealOrder;
            null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null);
            initSuspenseListRenderState(
              workInProgress2,
              false,
              revealOrder,
              renderLanes2,
              tailMode,
              nextProps
            );
            break;
          case "backwards":
          case "unstable_legacy-backwards":
            renderLanes2 = null;
            revealOrder = workInProgress2.child;
            for (workInProgress2.child = null; null !== revealOrder; ) {
              current = revealOrder.alternate;
              if (null !== current && null === findFirstSuspended(current)) {
                workInProgress2.child = revealOrder;
                break;
              }
              current = revealOrder.sibling;
              revealOrder.sibling = renderLanes2;
              renderLanes2 = revealOrder;
              revealOrder = current;
            }
            initSuspenseListRenderState(
              workInProgress2,
              true,
              renderLanes2,
              null,
              tailMode,
              nextProps
            );
            break;
          case "together":
            initSuspenseListRenderState(
              workInProgress2,
              false,
              null,
              null,
              void 0,
              nextProps
            );
            break;
          default:
            workInProgress2.memoizedState = null;
        }
        return workInProgress2.child;
      }
      function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
        null !== current && (workInProgress2.dependencies = current.dependencies);
        workInProgressRootSkippedLanes |= workInProgress2.lanes;
        if (0 === (renderLanes2 & workInProgress2.childLanes))
          if (null !== current) {
            if (propagateParentContextChanges(
              current,
              workInProgress2,
              renderLanes2,
              false
            ), 0 === (renderLanes2 & workInProgress2.childLanes))
              return null;
          } else return null;
        if (null !== current && workInProgress2.child !== current.child)
          throw Error(formatProdErrorMessage(153));
        if (null !== workInProgress2.child) {
          current = workInProgress2.child;
          renderLanes2 = createWorkInProgress(current, current.pendingProps);
          workInProgress2.child = renderLanes2;
          for (renderLanes2.return = workInProgress2; null !== current.sibling; )
            current = current.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current, current.pendingProps), renderLanes2.return = workInProgress2;
          renderLanes2.sibling = null;
        }
        return workInProgress2.child;
      }
      function checkScheduledUpdateOrContext(current, renderLanes2) {
        if (0 !== (current.lanes & renderLanes2)) return true;
        current = current.dependencies;
        return null !== current && checkIfContextChanged(current) ? true : false;
      }
      function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
        switch (workInProgress2.tag) {
          case 3:
            pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
            pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
            resetHydrationState();
            break;
          case 27:
          case 5:
            pushHostContext(workInProgress2);
            break;
          case 4:
            pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
            break;
          case 10:
            pushProvider(
              workInProgress2,
              workInProgress2.type,
              workInProgress2.memoizedProps.value
            );
            break;
          case 31:
            if (null !== workInProgress2.memoizedState)
              return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
            break;
          case 13:
            var state$102 = workInProgress2.memoizedState;
            if (null !== state$102) {
              if (null !== state$102.dehydrated)
                return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
              if (0 !== (renderLanes2 & workInProgress2.child.childLanes))
                return updateSuspenseComponent(current, workInProgress2, renderLanes2);
              pushPrimaryTreeSuspenseHandler(workInProgress2);
              current = bailoutOnAlreadyFinishedWork(
                current,
                workInProgress2,
                renderLanes2
              );
              return null !== current ? current.sibling : null;
            }
            pushPrimaryTreeSuspenseHandler(workInProgress2);
            break;
          case 19:
            var didSuspendBefore = 0 !== (current.flags & 128);
            state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes);
            state$102 || (propagateParentContextChanges(
              current,
              workInProgress2,
              renderLanes2,
              false
            ), state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes));
            if (didSuspendBefore) {
              if (state$102)
                return updateSuspenseListComponent(
                  current,
                  workInProgress2,
                  renderLanes2
                );
              workInProgress2.flags |= 128;
            }
            didSuspendBefore = workInProgress2.memoizedState;
            null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
            push(suspenseStackCursor, suspenseStackCursor.current);
            if (state$102) break;
            else return null;
          case 22:
            return workInProgress2.lanes = 0, updateOffscreenComponent(
              current,
              workInProgress2,
              renderLanes2,
              workInProgress2.pendingProps
            );
          case 24:
            pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
        }
        return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      }
      function beginWork(current, workInProgress2, renderLanes2) {
        if (null !== current)
          if (current.memoizedProps !== workInProgress2.pendingProps)
            didReceiveUpdate = true;
          else {
            if (!checkScheduledUpdateOrContext(current, renderLanes2) && 0 === (workInProgress2.flags & 128))
              return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(
                current,
                workInProgress2,
                renderLanes2
              );
            didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
          }
        else
          didReceiveUpdate = false, isHydrating && 0 !== (workInProgress2.flags & 1048576) && pushTreeId(workInProgress2, treeForkCount, workInProgress2.index);
        workInProgress2.lanes = 0;
        switch (workInProgress2.tag) {
          case 16:
            a: {
              var props = workInProgress2.pendingProps;
              current = resolveLazy(workInProgress2.elementType);
              workInProgress2.type = current;
              if ("function" === typeof current)
                shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress2.tag = 1, workInProgress2 = updateClassComponent(
                  null,
                  workInProgress2,
                  current,
                  props,
                  renderLanes2
                )) : (workInProgress2.tag = 0, workInProgress2 = updateFunctionComponent(
                  null,
                  workInProgress2,
                  current,
                  props,
                  renderLanes2
                ));
              else {
                if (void 0 !== current && null !== current) {
                  var $$typeof = current.$$typeof;
                  if ($$typeof === REACT_FORWARD_REF_TYPE) {
                    workInProgress2.tag = 11;
                    workInProgress2 = updateForwardRef(
                      null,
                      workInProgress2,
                      current,
                      props,
                      renderLanes2
                    );
                    break a;
                  } else if ($$typeof === REACT_MEMO_TYPE) {
                    workInProgress2.tag = 14;
                    workInProgress2 = updateMemoComponent(
                      null,
                      workInProgress2,
                      current,
                      props,
                      renderLanes2
                    );
                    break a;
                  }
                }
                workInProgress2 = getComponentNameFromType(current) || current;
                throw Error(formatProdErrorMessage(306, workInProgress2, ""));
              }
            }
            return workInProgress2;
          case 0:
            return updateFunctionComponent(
              current,
              workInProgress2,
              workInProgress2.type,
              workInProgress2.pendingProps,
              renderLanes2
            );
          case 1:
            return props = workInProgress2.type, $$typeof = resolveClassComponentProps(
              props,
              workInProgress2.pendingProps
            ), updateClassComponent(
              current,
              workInProgress2,
              props,
              $$typeof,
              renderLanes2
            );
          case 3:
            a: {
              pushHostContainer(
                workInProgress2,
                workInProgress2.stateNode.containerInfo
              );
              if (null === current) throw Error(formatProdErrorMessage(387));
              props = workInProgress2.pendingProps;
              var prevState = workInProgress2.memoizedState;
              $$typeof = prevState.element;
              cloneUpdateQueue(current, workInProgress2);
              processUpdateQueue(workInProgress2, props, null, renderLanes2);
              var nextState = workInProgress2.memoizedState;
              props = nextState.cache;
              pushProvider(workInProgress2, CacheContext, props);
              props !== prevState.cache && propagateContextChanges(
                workInProgress2,
                [CacheContext],
                renderLanes2,
                true
              );
              suspendIfUpdateReadFromEntangledAsyncAction();
              props = nextState.element;
              if (prevState.isDehydrated)
                if (prevState = {
                  element: props,
                  isDehydrated: false,
                  cache: nextState.cache
                }, workInProgress2.updateQueue.baseState = prevState, workInProgress2.memoizedState = prevState, workInProgress2.flags & 256) {
                  workInProgress2 = mountHostRootWithoutHydrating(
                    current,
                    workInProgress2,
                    props,
                    renderLanes2
                  );
                  break a;
                } else if (props !== $$typeof) {
                  $$typeof = createCapturedValueAtFiber(
                    Error(formatProdErrorMessage(424)),
                    workInProgress2
                  );
                  queueHydrationError($$typeof);
                  workInProgress2 = mountHostRootWithoutHydrating(
                    current,
                    workInProgress2,
                    props,
                    renderLanes2
                  );
                  break a;
                } else {
                  current = workInProgress2.stateNode.containerInfo;
                  switch (current.nodeType) {
                    case 9:
                      current = current.body;
                      break;
                    default:
                      current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
                  }
                  nextHydratableInstance = getNextHydratable(current.firstChild);
                  hydrationParentFiber = workInProgress2;
                  isHydrating = true;
                  hydrationErrors = null;
                  rootOrSingletonContext = true;
                  renderLanes2 = mountChildFibers(
                    workInProgress2,
                    null,
                    props,
                    renderLanes2
                  );
                  for (workInProgress2.child = renderLanes2; renderLanes2; )
                    renderLanes2.flags = renderLanes2.flags & -3 | 4096, renderLanes2 = renderLanes2.sibling;
                }
              else {
                resetHydrationState();
                if (props === $$typeof) {
                  workInProgress2 = bailoutOnAlreadyFinishedWork(
                    current,
                    workInProgress2,
                    renderLanes2
                  );
                  break a;
                }
                reconcileChildren(current, workInProgress2, props, renderLanes2);
              }
              workInProgress2 = workInProgress2.child;
            }
            return workInProgress2;
          case 26:
            return markRef(current, workInProgress2), null === current ? (renderLanes2 = getResource(
              workInProgress2.type,
              null,
              workInProgress2.pendingProps,
              null
            )) ? workInProgress2.memoizedState = renderLanes2 : isHydrating || (renderLanes2 = workInProgress2.type, current = workInProgress2.pendingProps, props = getOwnerDocumentFromRootContainer(
              rootInstanceStackCursor.current
            ).createElement(renderLanes2), props[internalInstanceKey] = workInProgress2, props[internalPropsKey] = current, setInitialProperties(props, renderLanes2, current), markNodeAsHoistable(props), workInProgress2.stateNode = props) : workInProgress2.memoizedState = getResource(
              workInProgress2.type,
              current.memoizedProps,
              workInProgress2.pendingProps,
              current.memoizedState
            ), null;
          case 27:
            return pushHostContext(workInProgress2), null === current && isHydrating && (props = workInProgress2.stateNode = resolveSingletonInstance(
              workInProgress2.type,
              workInProgress2.pendingProps,
              rootInstanceStackCursor.current
            ), hydrationParentFiber = workInProgress2, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress2.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(
              current,
              workInProgress2,
              workInProgress2.pendingProps.children,
              renderLanes2
            ), markRef(current, workInProgress2), null === current && (workInProgress2.flags |= 4194304), workInProgress2.child;
          case 5:
            if (null === current && isHydrating) {
              if ($$typeof = props = nextHydratableInstance)
                props = canHydrateInstance(
                  props,
                  workInProgress2.type,
                  workInProgress2.pendingProps,
                  rootOrSingletonContext
                ), null !== props ? (workInProgress2.stateNode = props, hydrationParentFiber = workInProgress2, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
              $$typeof || throwOnHydrationMismatch(workInProgress2);
            }
            pushHostContext(workInProgress2);
            $$typeof = workInProgress2.type;
            prevState = workInProgress2.pendingProps;
            nextState = null !== current ? current.memoizedProps : null;
            props = prevState.children;
            shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress2.flags |= 32);
            null !== workInProgress2.memoizedState && ($$typeof = renderWithHooks(
              current,
              workInProgress2,
              TransitionAwareHostComponent,
              null,
              null,
              renderLanes2
            ), HostTransitionContext._currentValue = $$typeof);
            markRef(current, workInProgress2);
            reconcileChildren(current, workInProgress2, props, renderLanes2);
            return workInProgress2.child;
          case 6:
            if (null === current && isHydrating) {
              if (current = renderLanes2 = nextHydratableInstance)
                renderLanes2 = canHydrateTextInstance(
                  renderLanes2,
                  workInProgress2.pendingProps,
                  rootOrSingletonContext
                ), null !== renderLanes2 ? (workInProgress2.stateNode = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, current = true) : current = false;
              current || throwOnHydrationMismatch(workInProgress2);
            }
            return null;
          case 13:
            return updateSuspenseComponent(current, workInProgress2, renderLanes2);
          case 4:
            return pushHostContainer(
              workInProgress2,
              workInProgress2.stateNode.containerInfo
            ), props = workInProgress2.pendingProps, null === current ? workInProgress2.child = reconcileChildFibers(
              workInProgress2,
              null,
              props,
              renderLanes2
            ) : reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
          case 11:
            return updateForwardRef(
              current,
              workInProgress2,
              workInProgress2.type,
              workInProgress2.pendingProps,
              renderLanes2
            );
          case 7:
            return reconcileChildren(
              current,
              workInProgress2,
              workInProgress2.pendingProps,
              renderLanes2
            ), workInProgress2.child;
          case 8:
            return reconcileChildren(
              current,
              workInProgress2,
              workInProgress2.pendingProps.children,
              renderLanes2
            ), workInProgress2.child;
          case 12:
            return reconcileChildren(
              current,
              workInProgress2,
              workInProgress2.pendingProps.children,
              renderLanes2
            ), workInProgress2.child;
          case 10:
            return props = workInProgress2.pendingProps, pushProvider(workInProgress2, workInProgress2.type, props.value), reconcileChildren(current, workInProgress2, props.children, renderLanes2), workInProgress2.child;
          case 9:
            return $$typeof = workInProgress2.type._context, props = workInProgress2.pendingProps.children, prepareToReadContext(workInProgress2), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress2.flags |= 1, reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
          case 14:
            return updateMemoComponent(
              current,
              workInProgress2,
              workInProgress2.type,
              workInProgress2.pendingProps,
              renderLanes2
            );
          case 15:
            return updateSimpleMemoComponent(
              current,
              workInProgress2,
              workInProgress2.type,
              workInProgress2.pendingProps,
              renderLanes2
            );
          case 19:
            return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
          case 31:
            return updateActivityComponent(current, workInProgress2, renderLanes2);
          case 22:
            return updateOffscreenComponent(
              current,
              workInProgress2,
              renderLanes2,
              workInProgress2.pendingProps
            );
          case 24:
            return prepareToReadContext(workInProgress2), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes2), $$typeof = prevState), workInProgress2.memoizedState = { parent: props, cache: $$typeof }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes2) && (cloneUpdateQueue(current, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress2.memoizedState, $$typeof.parent !== props ? ($$typeof = { parent: props, cache: props }, workInProgress2.memoizedState = $$typeof, 0 === workInProgress2.lanes && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = $$typeof), pushProvider(workInProgress2, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress2, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(
              workInProgress2,
              [CacheContext],
              renderLanes2,
              true
            ))), reconcileChildren(
              current,
              workInProgress2,
              workInProgress2.pendingProps.children,
              renderLanes2
            ), workInProgress2.child;
          case 29:
            throw workInProgress2.pendingProps;
        }
        throw Error(formatProdErrorMessage(156, workInProgress2.tag));
      }
      function markUpdate(workInProgress2) {
        workInProgress2.flags |= 4;
      }
      function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
        if (type = 0 !== (workInProgress2.mode & 32)) type = false;
        if (type) {
          if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2)
            if (workInProgress2.stateNode.complete) workInProgress2.flags |= 8192;
            else if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
            else
              throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
        } else workInProgress2.flags &= -16777217;
      }
      function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
        if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
          workInProgress2.flags &= -16777217;
        else if (workInProgress2.flags |= 16777216, !preloadResource(resource))
          if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
          else
            throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
      }
      function scheduleRetryEffect(workInProgress2, retryQueue) {
        null !== retryQueue && (workInProgress2.flags |= 4);
        workInProgress2.flags & 16384 && (retryQueue = 22 !== workInProgress2.tag ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
      }
      function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
        if (!isHydrating)
          switch (renderState.tailMode) {
            case "hidden":
              hasRenderedATailFallback = renderState.tail;
              for (var lastTailNode = null; null !== hasRenderedATailFallback; )
                null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
              null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
              break;
            case "collapsed":
              lastTailNode = renderState.tail;
              for (var lastTailNode$106 = null; null !== lastTailNode; )
                null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
              null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
          }
      }
      function bubbleProperties(completedWork) {
        var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
        if (didBailout)
          for (var child$107 = completedWork.child; null !== child$107; )
            newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
        else
          for (child$107 = completedWork.child; null !== child$107; )
            newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
        completedWork.subtreeFlags |= subtreeFlags;
        completedWork.childLanes = newChildLanes;
        return didBailout;
      }
      function completeWork(current, workInProgress2, renderLanes2) {
        var newProps = workInProgress2.pendingProps;
        popTreeContext(workInProgress2);
        switch (workInProgress2.tag) {
          case 16:
          case 15:
          case 0:
          case 11:
          case 7:
          case 8:
          case 12:
          case 9:
          case 14:
            return bubbleProperties(workInProgress2), null;
          case 1:
            return bubbleProperties(workInProgress2), null;
          case 3:
            renderLanes2 = workInProgress2.stateNode;
            newProps = null;
            null !== current && (newProps = current.memoizedState.cache);
            workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048);
            popProvider(CacheContext);
            popHostContainer();
            renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null);
            if (null === current || null === current.child)
              popHydrationState(workInProgress2) ? markUpdate(workInProgress2) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress2.flags & 256) || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
            bubbleProperties(workInProgress2);
            return null;
          case 26:
            var type = workInProgress2.type, nextResource = workInProgress2.memoizedState;
            null === current ? (markUpdate(workInProgress2), null !== nextResource ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
              workInProgress2,
              type,
              null,
              newProps,
              renderLanes2
            ))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
              workInProgress2,
              type,
              current,
              newProps,
              renderLanes2
            ));
            return null;
          case 27:
            popHostContext(workInProgress2);
            renderLanes2 = rootInstanceStackCursor.current;
            type = workInProgress2.type;
            if (null !== current && null != workInProgress2.stateNode)
              current.memoizedProps !== newProps && markUpdate(workInProgress2);
            else {
              if (!newProps) {
                if (null === workInProgress2.stateNode)
                  throw Error(formatProdErrorMessage(166));
                bubbleProperties(workInProgress2);
                return null;
              }
              current = contextStackCursor.current;
              popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2, current) : (current = resolveSingletonInstance(type, newProps, renderLanes2), workInProgress2.stateNode = current, markUpdate(workInProgress2));
            }
            bubbleProperties(workInProgress2);
            return null;
          case 5:
            popHostContext(workInProgress2);
            type = workInProgress2.type;
            if (null !== current && null != workInProgress2.stateNode)
              current.memoizedProps !== newProps && markUpdate(workInProgress2);
            else {
              if (!newProps) {
                if (null === workInProgress2.stateNode)
                  throw Error(formatProdErrorMessage(166));
                bubbleProperties(workInProgress2);
                return null;
              }
              nextResource = contextStackCursor.current;
              if (popHydrationState(workInProgress2))
                prepareToHydrateHostInstance(workInProgress2, nextResource);
              else {
                var ownerDocument = getOwnerDocumentFromRootContainer(
                  rootInstanceStackCursor.current
                );
                switch (nextResource) {
                  case 1:
                    nextResource = ownerDocument.createElementNS(
                      "http://www.w3.org/2000/svg",
                      type
                    );
                    break;
                  case 2:
                    nextResource = ownerDocument.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      type
                    );
                    break;
                  default:
                    switch (type) {
                      case "svg":
                        nextResource = ownerDocument.createElementNS(
                          "http://www.w3.org/2000/svg",
                          type
                        );
                        break;
                      case "math":
                        nextResource = ownerDocument.createElementNS(
                          "http://www.w3.org/1998/Math/MathML",
                          type
                        );
                        break;
                      case "script":
                        nextResource = ownerDocument.createElement("div");
                        nextResource.innerHTML = "<script><\/script>";
                        nextResource = nextResource.removeChild(
                          nextResource.firstChild
                        );
                        break;
                      case "select":
                        nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                          is: newProps.is
                        }) : ownerDocument.createElement("select");
                        newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
                        break;
                      default:
                        nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
                    }
                }
                nextResource[internalInstanceKey] = workInProgress2;
                nextResource[internalPropsKey] = newProps;
                a: for (ownerDocument = workInProgress2.child; null !== ownerDocument; ) {
                  if (5 === ownerDocument.tag || 6 === ownerDocument.tag)
                    nextResource.appendChild(ownerDocument.stateNode);
                  else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
                    ownerDocument.child.return = ownerDocument;
                    ownerDocument = ownerDocument.child;
                    continue;
                  }
                  if (ownerDocument === workInProgress2) break a;
                  for (; null === ownerDocument.sibling; ) {
                    if (null === ownerDocument.return || ownerDocument.return === workInProgress2)
                      break a;
                    ownerDocument = ownerDocument.return;
                  }
                  ownerDocument.sibling.return = ownerDocument.return;
                  ownerDocument = ownerDocument.sibling;
                }
                workInProgress2.stateNode = nextResource;
                a: switch (setInitialProperties(nextResource, type, newProps), type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    newProps = !!newProps.autoFocus;
                    break a;
                  case "img":
                    newProps = true;
                    break a;
                  default:
                    newProps = false;
                }
                newProps && markUpdate(workInProgress2);
              }
            }
            bubbleProperties(workInProgress2);
            preloadInstanceAndSuspendIfNeeded(
              workInProgress2,
              workInProgress2.type,
              null === current ? null : current.memoizedProps,
              workInProgress2.pendingProps,
              renderLanes2
            );
            return null;
          case 6:
            if (current && null != workInProgress2.stateNode)
              current.memoizedProps !== newProps && markUpdate(workInProgress2);
            else {
              if ("string" !== typeof newProps && null === workInProgress2.stateNode)
                throw Error(formatProdErrorMessage(166));
              current = rootInstanceStackCursor.current;
              if (popHydrationState(workInProgress2)) {
                current = workInProgress2.stateNode;
                renderLanes2 = workInProgress2.memoizedProps;
                newProps = null;
                type = hydrationParentFiber;
                if (null !== type)
                  switch (type.tag) {
                    case 27:
                    case 5:
                      newProps = type.memoizedProps;
                  }
                current[internalInstanceKey] = workInProgress2;
                current = current.nodeValue === renderLanes2 || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes2) ? true : false;
                current || throwOnHydrationMismatch(workInProgress2, true);
              } else
                current = getOwnerDocumentFromRootContainer(current).createTextNode(
                  newProps
                ), current[internalInstanceKey] = workInProgress2, workInProgress2.stateNode = current;
            }
            bubbleProperties(workInProgress2);
            return null;
          case 31:
            renderLanes2 = workInProgress2.memoizedState;
            if (null === current || null !== current.memoizedState) {
              newProps = popHydrationState(workInProgress2);
              if (null !== renderLanes2) {
                if (null === current) {
                  if (!newProps) throw Error(formatProdErrorMessage(318));
                  current = workInProgress2.memoizedState;
                  current = null !== current ? current.dehydrated : null;
                  if (!current) throw Error(formatProdErrorMessage(557));
                  current[internalInstanceKey] = workInProgress2;
                } else
                  resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
                bubbleProperties(workInProgress2);
                current = false;
              } else
                renderLanes2 = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes2), current = true;
              if (!current) {
                if (workInProgress2.flags & 256)
                  return popSuspenseHandler(workInProgress2), workInProgress2;
                popSuspenseHandler(workInProgress2);
                return null;
              }
              if (0 !== (workInProgress2.flags & 128))
                throw Error(formatProdErrorMessage(558));
            }
            bubbleProperties(workInProgress2);
            return null;
          case 13:
            newProps = workInProgress2.memoizedState;
            if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
              type = popHydrationState(workInProgress2);
              if (null !== newProps && null !== newProps.dehydrated) {
                if (null === current) {
                  if (!type) throw Error(formatProdErrorMessage(318));
                  type = workInProgress2.memoizedState;
                  type = null !== type ? type.dehydrated : null;
                  if (!type) throw Error(formatProdErrorMessage(317));
                  type[internalInstanceKey] = workInProgress2;
                } else
                  resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
                bubbleProperties(workInProgress2);
                type = false;
              } else
                type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
              if (!type) {
                if (workInProgress2.flags & 256)
                  return popSuspenseHandler(workInProgress2), workInProgress2;
                popSuspenseHandler(workInProgress2);
                return null;
              }
            }
            popSuspenseHandler(workInProgress2);
            if (0 !== (workInProgress2.flags & 128))
              return workInProgress2.lanes = renderLanes2, workInProgress2;
            renderLanes2 = null !== newProps;
            current = null !== current && null !== current.memoizedState;
            renderLanes2 && (newProps = workInProgress2.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
            renderLanes2 !== current && renderLanes2 && (workInProgress2.child.flags |= 8192);
            scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue);
            bubbleProperties(workInProgress2);
            return null;
          case 4:
            return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress2.stateNode.containerInfo), bubbleProperties(workInProgress2), null;
          case 10:
            return popProvider(workInProgress2.type), bubbleProperties(workInProgress2), null;
          case 19:
            pop(suspenseStackCursor);
            newProps = workInProgress2.memoizedState;
            if (null === newProps) return bubbleProperties(workInProgress2), null;
            type = 0 !== (workInProgress2.flags & 128);
            nextResource = newProps.rendering;
            if (null === nextResource)
              if (type) cutOffTailIfNeeded(newProps, false);
              else {
                if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128))
                  for (current = workInProgress2.child; null !== current; ) {
                    nextResource = findFirstSuspended(current);
                    if (null !== nextResource) {
                      workInProgress2.flags |= 128;
                      cutOffTailIfNeeded(newProps, false);
                      current = nextResource.updateQueue;
                      workInProgress2.updateQueue = current;
                      scheduleRetryEffect(workInProgress2, current);
                      workInProgress2.subtreeFlags = 0;
                      current = renderLanes2;
                      for (renderLanes2 = workInProgress2.child; null !== renderLanes2; )
                        resetWorkInProgress(renderLanes2, current), renderLanes2 = renderLanes2.sibling;
                      push(
                        suspenseStackCursor,
                        suspenseStackCursor.current & 1 | 2
                      );
                      isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
                      return workInProgress2.child;
                    }
                    current = current.sibling;
                  }
                null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
              }
            else {
              if (!type)
                if (current = findFirstSuspended(nextResource), null !== current) {
                  if (workInProgress2.flags |= 128, type = true, current = current.updateQueue, workInProgress2.updateQueue = current, scheduleRetryEffect(workInProgress2, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating)
                    return bubbleProperties(workInProgress2), null;
                } else
                  2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes2 && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
              newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
            }
            if (null !== newProps.tail)
              return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes2 = suspenseStackCursor.current, push(
                suspenseStackCursor,
                type ? renderLanes2 & 1 | 2 : renderLanes2 & 1
              ), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), current;
            bubbleProperties(workInProgress2);
            return null;
          case 22:
          case 23:
            return popSuspenseHandler(workInProgress2), popHiddenContext(), newProps = null !== workInProgress2.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? 0 !== (renderLanes2 & 536870912) && 0 === (workInProgress2.flags & 128) && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, null !== renderLanes2 && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes2 = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress2.memoizedState && null !== workInProgress2.memoizedState.cachePool && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), null !== current && pop(resumedCache), null;
          case 24:
            return renderLanes2 = null, null !== current && (renderLanes2 = current.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress2), null;
          case 25:
            return null;
          case 30:
            return null;
        }
        throw Error(formatProdErrorMessage(156, workInProgress2.tag));
      }
      function unwindWork(current, workInProgress2) {
        popTreeContext(workInProgress2);
        switch (workInProgress2.tag) {
          case 1:
            return current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
          case 3:
            return popProvider(CacheContext), popHostContainer(), current = workInProgress2.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
          case 26:
          case 27:
          case 5:
            return popHostContext(workInProgress2), null;
          case 31:
            if (null !== workInProgress2.memoizedState) {
              popSuspenseHandler(workInProgress2);
              if (null === workInProgress2.alternate)
                throw Error(formatProdErrorMessage(340));
              resetHydrationState();
            }
            current = workInProgress2.flags;
            return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
          case 13:
            popSuspenseHandler(workInProgress2);
            current = workInProgress2.memoizedState;
            if (null !== current && null !== current.dehydrated) {
              if (null === workInProgress2.alternate)
                throw Error(formatProdErrorMessage(340));
              resetHydrationState();
            }
            current = workInProgress2.flags;
            return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
          case 19:
            return pop(suspenseStackCursor), null;
          case 4:
            return popHostContainer(), null;
          case 10:
            return popProvider(workInProgress2.type), null;
          case 22:
          case 23:
            return popSuspenseHandler(workInProgress2), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
          case 24:
            return popProvider(CacheContext), null;
          case 25:
            return null;
          default:
            return null;
        }
      }
      function unwindInterruptedWork(current, interruptedWork) {
        popTreeContext(interruptedWork);
        switch (interruptedWork.tag) {
          case 3:
            popProvider(CacheContext);
            popHostContainer();
            break;
          case 26:
          case 27:
          case 5:
            popHostContext(interruptedWork);
            break;
          case 4:
            popHostContainer();
            break;
          case 31:
            null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
            break;
          case 13:
            popSuspenseHandler(interruptedWork);
            break;
          case 19:
            pop(suspenseStackCursor);
            break;
          case 10:
            popProvider(interruptedWork.type);
            break;
          case 22:
          case 23:
            popSuspenseHandler(interruptedWork);
            popHiddenContext();
            null !== current && pop(resumedCache);
            break;
          case 24:
            popProvider(CacheContext);
        }
      }
      function commitHookEffectListMount(flags, finishedWork) {
        try {
          var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
          if (null !== lastEffect) {
            var firstEffect = lastEffect.next;
            updateQueue = firstEffect;
            do {
              if ((updateQueue.tag & flags) === flags) {
                lastEffect = void 0;
                var create = updateQueue.create, inst = updateQueue.inst;
                lastEffect = create();
                inst.destroy = lastEffect;
              }
              updateQueue = updateQueue.next;
            } while (updateQueue !== firstEffect);
          }
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
        try {
          var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
          if (null !== lastEffect) {
            var firstEffect = lastEffect.next;
            updateQueue = firstEffect;
            do {
              if ((updateQueue.tag & flags) === flags) {
                var inst = updateQueue.inst, destroy = inst.destroy;
                if (void 0 !== destroy) {
                  inst.destroy = void 0;
                  lastEffect = finishedWork;
                  var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
                  try {
                    destroy_();
                  } catch (error) {
                    captureCommitPhaseError(
                      lastEffect,
                      nearestMountedAncestor,
                      error
                    );
                  }
                }
              }
              updateQueue = updateQueue.next;
            } while (updateQueue !== firstEffect);
          }
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      function commitClassCallbacks(finishedWork) {
        var updateQueue = finishedWork.updateQueue;
        if (null !== updateQueue) {
          var instance = finishedWork.stateNode;
          try {
            commitCallbacks(updateQueue, instance);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
      }
      function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
        instance.props = resolveClassComponentProps(
          current.type,
          current.memoizedProps
        );
        instance.state = current.memoizedState;
        try {
          instance.componentWillUnmount();
        } catch (error) {
          captureCommitPhaseError(current, nearestMountedAncestor, error);
        }
      }
      function safelyAttachRef(current, nearestMountedAncestor) {
        try {
          var ref = current.ref;
          if (null !== ref) {
            switch (current.tag) {
              case 26:
              case 27:
              case 5:
                var instanceToUse = current.stateNode;
                break;
              case 30:
                instanceToUse = current.stateNode;
                break;
              default:
                instanceToUse = current.stateNode;
            }
            "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
          }
        } catch (error) {
          captureCommitPhaseError(current, nearestMountedAncestor, error);
        }
      }
      function safelyDetachRef(current, nearestMountedAncestor) {
        var ref = current.ref, refCleanup = current.refCleanup;
        if (null !== ref)
          if ("function" === typeof refCleanup)
            try {
              refCleanup();
            } catch (error) {
              captureCommitPhaseError(current, nearestMountedAncestor, error);
            } finally {
              current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
            }
          else if ("function" === typeof ref)
            try {
              ref(null);
            } catch (error$140) {
              captureCommitPhaseError(current, nearestMountedAncestor, error$140);
            }
          else ref.current = null;
      }
      function commitHostMount(finishedWork) {
        var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
        try {
          a: switch (type) {
            case "button":
            case "input":
            case "select":
            case "textarea":
              props.autoFocus && instance.focus();
              break a;
            case "img":
              props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
          }
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      function commitHostUpdate(finishedWork, newProps, oldProps) {
        try {
          var domElement = finishedWork.stateNode;
          updateProperties(domElement, finishedWork.type, oldProps, newProps);
          domElement[internalPropsKey] = newProps;
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      function isHostParent(fiber) {
        return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
      }
      function getHostSibling(fiber) {
        a: for (; ; ) {
          for (; null === fiber.sibling; ) {
            if (null === fiber.return || isHostParent(fiber.return)) return null;
            fiber = fiber.return;
          }
          fiber.sibling.return = fiber.return;
          for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag; ) {
            if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
            if (fiber.flags & 2) continue a;
            if (null === fiber.child || 4 === fiber.tag) continue a;
            else fiber.child.return = fiber, fiber = fiber.child;
          }
          if (!(fiber.flags & 2)) return fiber.stateNode;
        }
      }
      function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
        var tag = node.tag;
        if (5 === tag || 6 === tag)
          node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
        else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node))
          for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node; )
            insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
      }
      function insertOrAppendPlacementNode(node, before, parent) {
        var tag = node.tag;
        if (5 === tag || 6 === tag)
          node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
        else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node))
          for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node; )
            insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
      }
      function commitHostSingletonAcquisition(finishedWork) {
        var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
        try {
          for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length; )
            singleton.removeAttributeNode(attributes[0]);
          setInitialProperties(singleton, type, props);
          singleton[internalInstanceKey] = finishedWork;
          singleton[internalPropsKey] = props;
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
      var offscreenSubtreeIsHidden = false;
      var offscreenSubtreeWasHidden = false;
      var needsFormReset = false;
      var PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set;
      var nextEffect = null;
      function commitBeforeMutationEffects(root2, firstChild) {
        root2 = root2.containerInfo;
        eventsEnabled = _enabled;
        root2 = getActiveElementDeep(root2);
        if (hasSelectionCapabilities(root2)) {
          if ("selectionStart" in root2)
            var JSCompiler_temp = {
              start: root2.selectionStart,
              end: root2.selectionEnd
            };
          else
            a: {
              JSCompiler_temp = (JSCompiler_temp = root2.ownerDocument) && JSCompiler_temp.defaultView || window;
              var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
              if (selection && 0 !== selection.rangeCount) {
                JSCompiler_temp = selection.anchorNode;
                var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
                selection = selection.focusOffset;
                try {
                  JSCompiler_temp.nodeType, focusNode.nodeType;
                } catch (e$20) {
                  JSCompiler_temp = null;
                  break a;
                }
                var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root2, parentNode = null;
                b: for (; ; ) {
                  for (var next; ; ) {
                    node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
                    node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
                    3 === node.nodeType && (length += node.nodeValue.length);
                    if (null === (next = node.firstChild)) break;
                    parentNode = node;
                    node = next;
                  }
                  for (; ; ) {
                    if (node === root2) break b;
                    parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
                    parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
                    if (null !== (next = node.nextSibling)) break;
                    node = parentNode;
                    parentNode = node.parentNode;
                  }
                  node = next;
                }
                JSCompiler_temp = -1 === start || -1 === end ? null : { start, end };
              } else JSCompiler_temp = null;
            }
          JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
        } else JSCompiler_temp = null;
        selectionInformation = { focusedElem: root2, selectionRange: JSCompiler_temp };
        _enabled = false;
        for (nextEffect = firstChild; null !== nextEffect; )
          if (firstChild = nextEffect, root2 = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root2)
            root2.return = firstChild, nextEffect = root2;
          else
            for (; null !== nextEffect; ) {
              firstChild = nextEffect;
              focusNode = firstChild.alternate;
              root2 = firstChild.flags;
              switch (firstChild.tag) {
                case 0:
                  if (0 !== (root2 & 4) && (root2 = firstChild.updateQueue, root2 = null !== root2 ? root2.events : null, null !== root2))
                    for (JSCompiler_temp = 0; JSCompiler_temp < root2.length; JSCompiler_temp++)
                      anchorOffset = root2[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
                  break;
                case 11:
                case 15:
                  break;
                case 1:
                  if (0 !== (root2 & 1024) && null !== focusNode) {
                    root2 = void 0;
                    JSCompiler_temp = firstChild;
                    anchorOffset = focusNode.memoizedProps;
                    focusNode = focusNode.memoizedState;
                    selection = JSCompiler_temp.stateNode;
                    try {
                      var resolvedPrevProps = resolveClassComponentProps(
                        JSCompiler_temp.type,
                        anchorOffset
                      );
                      root2 = selection.getSnapshotBeforeUpdate(
                        resolvedPrevProps,
                        focusNode
                      );
                      selection.__reactInternalSnapshotBeforeUpdate = root2;
                    } catch (error) {
                      captureCommitPhaseError(
                        JSCompiler_temp,
                        JSCompiler_temp.return,
                        error
                      );
                    }
                  }
                  break;
                case 3:
                  if (0 !== (root2 & 1024)) {
                    if (root2 = firstChild.stateNode.containerInfo, JSCompiler_temp = root2.nodeType, 9 === JSCompiler_temp)
                      clearContainerSparingly(root2);
                    else if (1 === JSCompiler_temp)
                      switch (root2.nodeName) {
                        case "HEAD":
                        case "HTML":
                        case "BODY":
                          clearContainerSparingly(root2);
                          break;
                        default:
                          root2.textContent = "";
                      }
                  }
                  break;
                case 5:
                case 26:
                case 27:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  if (0 !== (root2 & 1024)) throw Error(formatProdErrorMessage(163));
              }
              root2 = firstChild.sibling;
              if (null !== root2) {
                root2.return = firstChild.return;
                nextEffect = root2;
                break;
              }
              nextEffect = firstChild.return;
            }
      }
      function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
        var flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            flags & 4 && commitHookEffectListMount(5, finishedWork);
            break;
          case 1:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            if (flags & 4)
              if (finishedRoot = finishedWork.stateNode, null === current)
                try {
                  finishedRoot.componentDidMount();
                } catch (error) {
                  captureCommitPhaseError(finishedWork, finishedWork.return, error);
                }
              else {
                var prevProps = resolveClassComponentProps(
                  finishedWork.type,
                  current.memoizedProps
                );
                current = current.memoizedState;
                try {
                  finishedRoot.componentDidUpdate(
                    prevProps,
                    current,
                    finishedRoot.__reactInternalSnapshotBeforeUpdate
                  );
                } catch (error$139) {
                  captureCommitPhaseError(
                    finishedWork,
                    finishedWork.return,
                    error$139
                  );
                }
              }
            flags & 64 && commitClassCallbacks(finishedWork);
            flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 3:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
              current = null;
              if (null !== finishedWork.child)
                switch (finishedWork.child.tag) {
                  case 27:
                  case 5:
                    current = finishedWork.child.stateNode;
                    break;
                  case 1:
                    current = finishedWork.child.stateNode;
                }
              try {
                commitCallbacks(finishedRoot, current);
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
            break;
          case 27:
            null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
          case 26:
          case 5:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            null === current && flags & 4 && commitHostMount(finishedWork);
            flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
            break;
          case 12:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            break;
          case 31:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
            break;
          case 13:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
            flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(
              null,
              finishedWork
            ), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
            break;
          case 22:
            flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
            if (!flags) {
              current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
              prevProps = offscreenSubtreeIsHidden;
              var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
              offscreenSubtreeIsHidden = flags;
              (offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                0 !== (finishedWork.subtreeFlags & 8772)
              ) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
              offscreenSubtreeIsHidden = prevProps;
              offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
            }
            break;
          case 30:
            break;
          default:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        }
      }
      function detachFiberAfterEffects(fiber) {
        var alternate = fiber.alternate;
        null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
        fiber.child = null;
        fiber.deletions = null;
        fiber.sibling = null;
        5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
        fiber.stateNode = null;
        fiber.return = null;
        fiber.dependencies = null;
        fiber.memoizedProps = null;
        fiber.memoizedState = null;
        fiber.pendingProps = null;
        fiber.stateNode = null;
        fiber.updateQueue = null;
      }
      var hostParent = null;
      var hostParentIsContainer = false;
      function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
        for (parent = parent.child; null !== parent; )
          commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
      }
      function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
        if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
          try {
            injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
          } catch (err) {
          }
        switch (deletedFiber.tag) {
          case 26:
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
            break;
          case 27:
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
            var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
            isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            releaseSingletonInstance(deletedFiber.stateNode);
            hostParent = prevHostParent;
            hostParentIsContainer = prevHostParentIsContainer;
            break;
          case 5:
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
          case 6:
            prevHostParent = hostParent;
            prevHostParentIsContainer = hostParentIsContainer;
            hostParent = null;
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            hostParent = prevHostParent;
            hostParentIsContainer = prevHostParentIsContainer;
            if (null !== hostParent)
              if (hostParentIsContainer)
                try {
                  (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
                } catch (error) {
                  captureCommitPhaseError(
                    deletedFiber,
                    nearestMountedAncestor,
                    error
                  );
                }
              else
                try {
                  hostParent.removeChild(deletedFiber.stateNode);
                } catch (error) {
                  captureCommitPhaseError(
                    deletedFiber,
                    nearestMountedAncestor,
                    error
                  );
                }
            break;
          case 18:
            null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(
              9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot,
              deletedFiber.stateNode
            ), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
            break;
          case 4:
            prevHostParent = hostParent;
            prevHostParentIsContainer = hostParentIsContainer;
            hostParent = deletedFiber.stateNode.containerInfo;
            hostParentIsContainer = true;
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            hostParent = prevHostParent;
            hostParentIsContainer = prevHostParentIsContainer;
            break;
          case 0:
          case 11:
          case 14:
          case 15:
            commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
            offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            break;
          case 1:
            offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(
              deletedFiber,
              nearestMountedAncestor,
              prevHostParent
            ));
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            break;
          case 21:
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            break;
          case 22:
            offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
            offscreenSubtreeWasHidden = prevHostParent;
            break;
          default:
            recursivelyTraverseDeletionEffects(
              finishedRoot,
              nearestMountedAncestor,
              deletedFiber
            );
        }
      }
      function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
        if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
          finishedRoot = finishedRoot.dehydrated;
          try {
            retryIfBlockedOn(finishedRoot);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
      }
      function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
        if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot))))
          try {
            retryIfBlockedOn(finishedRoot);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
      }
      function getRetryCache(finishedWork) {
        switch (finishedWork.tag) {
          case 31:
          case 13:
          case 19:
            var retryCache = finishedWork.stateNode;
            null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
            return retryCache;
          case 22:
            return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
          default:
            throw Error(formatProdErrorMessage(435, finishedWork.tag));
        }
      }
      function attachSuspenseRetryListeners(finishedWork, wakeables) {
        var retryCache = getRetryCache(finishedWork);
        wakeables.forEach(function(wakeable) {
          if (!retryCache.has(wakeable)) {
            retryCache.add(wakeable);
            var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
            wakeable.then(retry, retry);
          }
        });
      }
      function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
        var deletions = parentFiber.deletions;
        if (null !== deletions)
          for (var i = 0; i < deletions.length; i++) {
            var childToDelete = deletions[i], root2 = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
            a: for (; null !== parent; ) {
              switch (parent.tag) {
                case 27:
                  if (isSingletonScope(parent.type)) {
                    hostParent = parent.stateNode;
                    hostParentIsContainer = false;
                    break a;
                  }
                  break;
                case 5:
                  hostParent = parent.stateNode;
                  hostParentIsContainer = false;
                  break a;
                case 3:
                case 4:
                  hostParent = parent.stateNode.containerInfo;
                  hostParentIsContainer = true;
                  break a;
              }
              parent = parent.return;
            }
            if (null === hostParent) throw Error(formatProdErrorMessage(160));
            commitDeletionEffectsOnFiber(root2, returnFiber, childToDelete);
            hostParent = null;
            hostParentIsContainer = false;
            root2 = childToDelete.alternate;
            null !== root2 && (root2.return = null);
            childToDelete.return = null;
          }
        if (parentFiber.subtreeFlags & 13886)
          for (parentFiber = parentFiber.child; null !== parentFiber; )
            commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
      }
      var currentHoistableRoot = null;
      function commitMutationEffectsOnFiber(finishedWork, root2) {
        var current = finishedWork.alternate, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
            break;
          case 1:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
            break;
          case 26:
            var hoistableRoot = currentHoistableRoot;
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            if (flags & 4) {
              var currentResource = null !== current ? current.memoizedState : null;
              flags = finishedWork.memoizedState;
              if (null === current)
                if (null === flags)
                  if (null === finishedWork.stateNode) {
                    a: {
                      flags = finishedWork.type;
                      current = finishedWork.memoizedProps;
                      hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
                      b: switch (flags) {
                        case "title":
                          currentResource = hoistableRoot.getElementsByTagName("title")[0];
                          if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop"))
                            currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(
                              currentResource,
                              hoistableRoot.querySelector("head > title")
                            );
                          setInitialProperties(currentResource, flags, current);
                          currentResource[internalInstanceKey] = finishedWork;
                          markNodeAsHoistable(currentResource);
                          flags = currentResource;
                          break a;
                        case "link":
                          var maybeNodes = getHydratableHoistableCache(
                            "link",
                            "href",
                            hoistableRoot
                          ).get(flags + (current.href || ""));
                          if (maybeNodes) {
                            for (var i = 0; i < maybeNodes.length; i++)
                              if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
                                maybeNodes.splice(i, 1);
                                break b;
                              }
                          }
                          currentResource = hoistableRoot.createElement(flags);
                          setInitialProperties(currentResource, flags, current);
                          hoistableRoot.head.appendChild(currentResource);
                          break;
                        case "meta":
                          if (maybeNodes = getHydratableHoistableCache(
                            "meta",
                            "content",
                            hoistableRoot
                          ).get(flags + (current.content || ""))) {
                            for (i = 0; i < maybeNodes.length; i++)
                              if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
                                maybeNodes.splice(i, 1);
                                break b;
                              }
                          }
                          currentResource = hoistableRoot.createElement(flags);
                          setInitialProperties(currentResource, flags, current);
                          hoistableRoot.head.appendChild(currentResource);
                          break;
                        default:
                          throw Error(formatProdErrorMessage(468, flags));
                      }
                      currentResource[internalInstanceKey] = finishedWork;
                      markNodeAsHoistable(currentResource);
                      flags = currentResource;
                    }
                    finishedWork.stateNode = flags;
                  } else
                    mountHoistable(
                      hoistableRoot,
                      finishedWork.type,
                      finishedWork.stateNode
                    );
                else
                  finishedWork.stateNode = acquireResource(
                    hoistableRoot,
                    flags,
                    finishedWork.memoizedProps
                  );
              else
                currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(
                  hoistableRoot,
                  finishedWork.type,
                  finishedWork.stateNode
                ) : acquireResource(
                  hoistableRoot,
                  flags,
                  finishedWork.memoizedProps
                )) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(
                  finishedWork,
                  finishedWork.memoizedProps,
                  current.memoizedProps
                );
            }
            break;
          case 27:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            null !== current && flags & 4 && commitHostUpdate(
              finishedWork,
              finishedWork.memoizedProps,
              current.memoizedProps
            );
            break;
          case 5:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            if (finishedWork.flags & 32) {
              hoistableRoot = finishedWork.stateNode;
              try {
                setTextContent(hoistableRoot, "");
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
            flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(
              finishedWork,
              hoistableRoot,
              null !== current ? current.memoizedProps : hoistableRoot
            ));
            flags & 1024 && (needsFormReset = true);
            break;
          case 6:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            if (flags & 4) {
              if (null === finishedWork.stateNode)
                throw Error(formatProdErrorMessage(162));
              flags = finishedWork.memoizedProps;
              current = finishedWork.stateNode;
              try {
                current.nodeValue = flags;
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
            break;
          case 3:
            tagCaches = null;
            hoistableRoot = currentHoistableRoot;
            currentHoistableRoot = getHoistableRoot(root2.containerInfo);
            recursivelyTraverseMutationEffects(root2, finishedWork);
            currentHoistableRoot = hoistableRoot;
            commitReconciliationEffects(finishedWork);
            if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
              try {
                retryIfBlockedOn(root2.containerInfo);
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
            break;
          case 4:
            flags = currentHoistableRoot;
            currentHoistableRoot = getHoistableRoot(
              finishedWork.stateNode.containerInfo
            );
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            currentHoistableRoot = flags;
            break;
          case 12:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            break;
          case 31:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
            break;
          case 13:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
            flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
            break;
          case 22:
            hoistableRoot = null !== finishedWork.memoizedState;
            var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
            offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
            offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
            recursivelyTraverseMutationEffects(root2, finishedWork);
            offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
            offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
            commitReconciliationEffects(finishedWork);
            if (flags & 8192)
              a: for (root2 = finishedWork.stateNode, root2._visibility = hoistableRoot ? root2._visibility & -2 : root2._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root2 = finishedWork; ; ) {
                if (5 === root2.tag || 26 === root2.tag) {
                  if (null === current) {
                    wasHidden = current = root2;
                    try {
                      if (currentResource = wasHidden.stateNode, hoistableRoot)
                        maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
                      else {
                        i = wasHidden.stateNode;
                        var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                        i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
                      }
                    } catch (error) {
                      captureCommitPhaseError(wasHidden, wasHidden.return, error);
                    }
                  }
                } else if (6 === root2.tag) {
                  if (null === current) {
                    wasHidden = root2;
                    try {
                      wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
                    } catch (error) {
                      captureCommitPhaseError(wasHidden, wasHidden.return, error);
                    }
                  }
                } else if (18 === root2.tag) {
                  if (null === current) {
                    wasHidden = root2;
                    try {
                      var instance = wasHidden.stateNode;
                      hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, true) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, false);
                    } catch (error) {
                      captureCommitPhaseError(wasHidden, wasHidden.return, error);
                    }
                  }
                } else if ((22 !== root2.tag && 23 !== root2.tag || null === root2.memoizedState || root2 === finishedWork) && null !== root2.child) {
                  root2.child.return = root2;
                  root2 = root2.child;
                  continue;
                }
                if (root2 === finishedWork) break a;
                for (; null === root2.sibling; ) {
                  if (null === root2.return || root2.return === finishedWork) break a;
                  current === root2 && (current = null);
                  root2 = root2.return;
                }
                current === root2 && (current = null);
                root2.sibling.return = root2.return;
                root2 = root2.sibling;
              }
            flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
            break;
          case 19:
            recursivelyTraverseMutationEffects(root2, finishedWork);
            commitReconciliationEffects(finishedWork);
            flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
            break;
          case 30:
            break;
          case 21:
            break;
          default:
            recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork);
        }
      }
      function commitReconciliationEffects(finishedWork) {
        var flags = finishedWork.flags;
        if (flags & 2) {
          try {
            for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber; ) {
              if (isHostParent(parentFiber)) {
                hostParentFiber = parentFiber;
                break;
              }
              parentFiber = parentFiber.return;
            }
            if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
            switch (hostParentFiber.tag) {
              case 27:
                var parent = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
                insertOrAppendPlacementNode(finishedWork, before, parent);
                break;
              case 5:
                var parent$141 = hostParentFiber.stateNode;
                hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
                var before$142 = getHostSibling(finishedWork);
                insertOrAppendPlacementNode(finishedWork, before$142, parent$141);
                break;
              case 3:
              case 4:
                var parent$143 = hostParentFiber.stateNode.containerInfo, before$144 = getHostSibling(finishedWork);
                insertOrAppendPlacementNodeIntoContainer(
                  finishedWork,
                  before$144,
                  parent$143
                );
                break;
              default:
                throw Error(formatProdErrorMessage(161));
            }
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
          finishedWork.flags &= -3;
        }
        flags & 4096 && (finishedWork.flags &= -4097);
      }
      function recursivelyResetForms(parentFiber) {
        if (parentFiber.subtreeFlags & 1024)
          for (parentFiber = parentFiber.child; null !== parentFiber; ) {
            var fiber = parentFiber;
            recursivelyResetForms(fiber);
            5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
            parentFiber = parentFiber.sibling;
          }
      }
      function recursivelyTraverseLayoutEffects(root2, parentFiber) {
        if (parentFiber.subtreeFlags & 8772)
          for (parentFiber = parentFiber.child; null !== parentFiber; )
            commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
      }
      function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          var finishedWork = parentFiber;
          switch (finishedWork.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
              commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
              recursivelyTraverseDisappearLayoutEffects(finishedWork);
              break;
            case 1:
              safelyDetachRef(finishedWork, finishedWork.return);
              var instance = finishedWork.stateNode;
              "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(
                finishedWork,
                finishedWork.return,
                instance
              );
              recursivelyTraverseDisappearLayoutEffects(finishedWork);
              break;
            case 27:
              releaseSingletonInstance(finishedWork.stateNode);
            case 26:
            case 5:
              safelyDetachRef(finishedWork, finishedWork.return);
              recursivelyTraverseDisappearLayoutEffects(finishedWork);
              break;
            case 22:
              null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
              break;
            case 30:
              recursivelyTraverseDisappearLayoutEffects(finishedWork);
              break;
            default:
              recursivelyTraverseDisappearLayoutEffects(finishedWork);
          }
          parentFiber = parentFiber.sibling;
        }
      }
      function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
        includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
          switch (finishedWork.tag) {
            case 0:
            case 11:
            case 15:
              recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
              commitHookEffectListMount(4, finishedWork);
              break;
            case 1:
              recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
              current = finishedWork;
              finishedRoot = current.stateNode;
              if ("function" === typeof finishedRoot.componentDidMount)
                try {
                  finishedRoot.componentDidMount();
                } catch (error) {
                  captureCommitPhaseError(current, current.return, error);
                }
              current = finishedWork;
              finishedRoot = current.updateQueue;
              if (null !== finishedRoot) {
                var instance = current.stateNode;
                try {
                  var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
                  if (null !== hiddenCallbacks)
                    for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)
                      callCallback(hiddenCallbacks[finishedRoot], instance);
                } catch (error) {
                  captureCommitPhaseError(current, current.return, error);
                }
              }
              includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
              safelyAttachRef(finishedWork, finishedWork.return);
              break;
            case 27:
              commitHostSingletonAcquisition(finishedWork);
            case 26:
            case 5:
              recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
              includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
              safelyAttachRef(finishedWork, finishedWork.return);
              break;
            case 12:
              recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
              break;
            case 31:
              recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
              includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
              break;
            case 13:
              recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
              includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
              break;
            case 22:
              null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
              safelyAttachRef(finishedWork, finishedWork.return);
              break;
            case 30:
              break;
            default:
              recursivelyTraverseReappearLayoutEffects(
                finishedRoot,
                finishedWork,
                includeWorkInProgressEffects
              );
          }
          parentFiber = parentFiber.sibling;
        }
      }
      function commitOffscreenPassiveMountEffects(current, finishedWork) {
        var previousCache = null;
        null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
        current = null;
        null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
        current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
      }
      function commitCachePassiveMountEffect(current, finishedWork) {
        current = null;
        null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
        finishedWork = finishedWork.memoizedState.cache;
        finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
      }
      function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions) {
        if (parentFiber.subtreeFlags & 10256)
          for (parentFiber = parentFiber.child; null !== parentFiber; )
            commitPassiveMountOnFiber(
              root2,
              parentFiber,
              committedLanes,
              committedTransitions
            ), parentFiber = parentFiber.sibling;
      }
      function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
        var flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            flags & 2048 && commitHookEffectListMount(9, finishedWork);
            break;
          case 1:
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            break;
          case 3:
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
            break;
          case 12:
            if (flags & 2048) {
              recursivelyTraversePassiveMountEffects(
                finishedRoot,
                finishedWork,
                committedLanes,
                committedTransitions
              );
              finishedRoot = finishedWork.stateNode;
              try {
                var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
                "function" === typeof onPostCommit && onPostCommit(
                  id,
                  null === finishedWork.alternate ? "mount" : "update",
                  finishedRoot.passiveEffectDuration,
                  -0
                );
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            } else
              recursivelyTraversePassiveMountEffects(
                finishedRoot,
                finishedWork,
                committedLanes,
                committedTransitions
              );
            break;
          case 31:
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            break;
          case 13:
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            break;
          case 23:
            break;
          case 22:
            _finishedWork$memoize2 = finishedWork.stateNode;
            id = finishedWork.alternate;
            null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            ) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            ) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions,
              0 !== (finishedWork.subtreeFlags & 10256) || false
            ));
            flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
            break;
          case 24:
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
            flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
            break;
          default:
            recursivelyTraversePassiveMountEffects(
              finishedRoot,
              finishedWork,
              committedLanes,
              committedTransitions
            );
        }
      }
      function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
        includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
          switch (finishedWork.tag) {
            case 0:
            case 11:
            case 15:
              recursivelyTraverseReconnectPassiveEffects(
                finishedRoot,
                finishedWork,
                committedLanes,
                committedTransitions,
                includeWorkInProgressEffects
              );
              commitHookEffectListMount(8, finishedWork);
              break;
            case 23:
              break;
            case 22:
              var instance = finishedWork.stateNode;
              null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(
                finishedRoot,
                finishedWork,
                committedLanes,
                committedTransitions,
                includeWorkInProgressEffects
              ) : recursivelyTraverseAtomicPassiveEffects(
                finishedRoot,
                finishedWork
              ) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
                finishedRoot,
                finishedWork,
                committedLanes,
                committedTransitions,
                includeWorkInProgressEffects
              ));
              includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(
                finishedWork.alternate,
                finishedWork
              );
              break;
            case 24:
              recursivelyTraverseReconnectPassiveEffects(
                finishedRoot,
                finishedWork,
                committedLanes,
                committedTransitions,
                includeWorkInProgressEffects
              );
              includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
              break;
            default:
              recursivelyTraverseReconnectPassiveEffects(
                finishedRoot,
                finishedWork,
                committedLanes,
                committedTransitions,
                includeWorkInProgressEffects
              );
          }
          parentFiber = parentFiber.sibling;
        }
      }
      function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
        if (parentFiber.subtreeFlags & 10256)
          for (parentFiber = parentFiber.child; null !== parentFiber; ) {
            var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
            switch (finishedWork.tag) {
              case 22:
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
                flags & 2048 && commitOffscreenPassiveMountEffects(
                  finishedWork.alternate,
                  finishedWork
                );
                break;
              case 24:
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
                flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
                break;
              default:
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
            }
            parentFiber = parentFiber.sibling;
          }
      }
      var suspenseyCommitFlag = 8192;
      function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
        if (parentFiber.subtreeFlags & suspenseyCommitFlag)
          for (parentFiber = parentFiber.child; null !== parentFiber; )
            accumulateSuspenseyCommitOnFiber(
              parentFiber,
              committedLanes,
              suspendedState
            ), parentFiber = parentFiber.sibling;
      }
      function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
        switch (fiber.tag) {
          case 26:
            recursivelyAccumulateSuspenseyCommit(
              fiber,
              committedLanes,
              suspendedState
            );
            fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(
              suspendedState,
              currentHoistableRoot,
              fiber.memoizedState,
              fiber.memoizedProps
            );
            break;
          case 5:
            recursivelyAccumulateSuspenseyCommit(
              fiber,
              committedLanes,
              suspendedState
            );
            break;
          case 3:
          case 4:
            var previousHoistableRoot = currentHoistableRoot;
            currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
            recursivelyAccumulateSuspenseyCommit(
              fiber,
              committedLanes,
              suspendedState
            );
            currentHoistableRoot = previousHoistableRoot;
            break;
          case 22:
            null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(
              fiber,
              committedLanes,
              suspendedState
            ), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(
              fiber,
              committedLanes,
              suspendedState
            ));
            break;
          default:
            recursivelyAccumulateSuspenseyCommit(
              fiber,
              committedLanes,
              suspendedState
            );
        }
      }
      function detachAlternateSiblings(parentFiber) {
        var previousFiber = parentFiber.alternate;
        if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
          previousFiber.child = null;
          do
            previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
          while (null !== parentFiber);
        }
      }
      function recursivelyTraversePassiveUnmountEffects(parentFiber) {
        var deletions = parentFiber.deletions;
        if (0 !== (parentFiber.flags & 16)) {
          if (null !== deletions)
            for (var i = 0; i < deletions.length; i++) {
              var childToDelete = deletions[i];
              nextEffect = childToDelete;
              commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
                childToDelete,
                parentFiber
              );
            }
          detachAlternateSiblings(parentFiber);
        }
        if (parentFiber.subtreeFlags & 10256)
          for (parentFiber = parentFiber.child; null !== parentFiber; )
            commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
      }
      function commitPassiveUnmountOnFiber(finishedWork) {
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
            finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
            break;
          case 3:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
            break;
          case 12:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
            break;
          case 22:
            var instance = finishedWork.stateNode;
            null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
            break;
          default:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
        }
      }
      function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
        var deletions = parentFiber.deletions;
        if (0 !== (parentFiber.flags & 16)) {
          if (null !== deletions)
            for (var i = 0; i < deletions.length; i++) {
              var childToDelete = deletions[i];
              nextEffect = childToDelete;
              commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
                childToDelete,
                parentFiber
              );
            }
          detachAlternateSiblings(parentFiber);
        }
        for (parentFiber = parentFiber.child; null !== parentFiber; ) {
          deletions = parentFiber;
          switch (deletions.tag) {
            case 0:
            case 11:
            case 15:
              commitHookEffectListUnmount(8, deletions, deletions.return);
              recursivelyTraverseDisconnectPassiveEffects(deletions);
              break;
            case 22:
              i = deletions.stateNode;
              i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
              break;
            default:
              recursivelyTraverseDisconnectPassiveEffects(deletions);
          }
          parentFiber = parentFiber.sibling;
        }
      }
      function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
        for (; null !== nextEffect; ) {
          var fiber = nextEffect;
          switch (fiber.tag) {
            case 0:
            case 11:
            case 15:
              commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
              break;
            case 23:
            case 22:
              if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
                var cache = fiber.memoizedState.cachePool.pool;
                null != cache && cache.refCount++;
              }
              break;
            case 24:
              releaseCache(fiber.memoizedState.cache);
          }
          cache = fiber.child;
          if (null !== cache) cache.return = fiber, nextEffect = cache;
          else
            a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
              cache = nextEffect;
              var sibling = cache.sibling, returnFiber = cache.return;
              detachFiberAfterEffects(cache);
              if (cache === fiber) {
                nextEffect = null;
                break a;
              }
              if (null !== sibling) {
                sibling.return = returnFiber;
                nextEffect = sibling;
                break a;
              }
              nextEffect = returnFiber;
            }
        }
      }
      var DefaultAsyncDispatcher = {
        getCacheForType: function(resourceType) {
          var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
          void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
          return cacheForType;
        },
        cacheSignal: function() {
          return readContext(CacheContext).controller.signal;
        }
      };
      var PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map;
      var executionContext = 0;
      var workInProgressRoot = null;
      var workInProgress = null;
      var workInProgressRootRenderLanes = 0;
      var workInProgressSuspendedReason = 0;
      var workInProgressThrownValue = null;
      var workInProgressRootDidSkipSuspendedSiblings = false;
      var workInProgressRootIsPrerendering = false;
      var workInProgressRootDidAttachPingListener = false;
      var entangledRenderLanes = 0;
      var workInProgressRootExitStatus = 0;
      var workInProgressRootSkippedLanes = 0;
      var workInProgressRootInterleavedUpdatedLanes = 0;
      var workInProgressRootPingedLanes = 0;
      var workInProgressDeferredLane = 0;
      var workInProgressSuspendedRetryLanes = 0;
      var workInProgressRootConcurrentErrors = null;
      var workInProgressRootRecoverableErrors = null;
      var workInProgressRootDidIncludeRecursiveRenderUpdate = false;
      var globalMostRecentFallbackTime = 0;
      var globalMostRecentTransitionTime = 0;
      var workInProgressRootRenderTargetTime = Infinity;
      var workInProgressTransitions = null;
      var legacyErrorBoundariesThatAlreadyFailed = null;
      var pendingEffectsStatus = 0;
      var pendingEffectsRoot = null;
      var pendingFinishedWork = null;
      var pendingEffectsLanes = 0;
      var pendingEffectsRemainingLanes = 0;
      var pendingPassiveTransitions = null;
      var pendingRecoverableErrors = null;
      var nestedUpdateCount = 0;
      var rootWithNestedUpdates = null;
      function requestUpdateLane() {
        return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
      }
      function requestDeferredLane() {
        if (0 === workInProgressDeferredLane)
          if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
            var lane = nextTransitionDeferredLane;
            nextTransitionDeferredLane <<= 1;
            0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
            workInProgressDeferredLane = lane;
          } else workInProgressDeferredLane = 536870912;
        lane = suspenseHandlerStackCursor.current;
        null !== lane && (lane.flags |= 32);
        return workInProgressDeferredLane;
      }
      function scheduleUpdateOnFiber(root2, fiber, lane) {
        if (root2 === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
          prepareFreshStack(root2, 0), markRootSuspended(
            root2,
            workInProgressRootRenderLanes,
            workInProgressDeferredLane,
            false
          );
        markRootUpdated$1(root2, lane);
        if (0 === (executionContext & 2) || root2 !== workInProgressRoot)
          root2 === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(
            root2,
            workInProgressRootRenderLanes,
            workInProgressDeferredLane,
            false
          )), ensureRootIsScheduled(root2);
      }
      function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
        if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
        var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
        do {
          if (0 === exitStatus) {
            workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
            break;
          } else {
            forceSync = root$jscomp$0.current.alternate;
            if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
              exitStatus = renderRootSync(root$jscomp$0, lanes, false);
              renderWasConcurrent = false;
              continue;
            }
            if (2 === exitStatus) {
              renderWasConcurrent = lanes;
              if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
                var JSCompiler_inline_result = 0;
              else
                JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
              if (0 !== JSCompiler_inline_result) {
                lanes = JSCompiler_inline_result;
                a: {
                  var root2 = root$jscomp$0;
                  exitStatus = workInProgressRootConcurrentErrors;
                  var wasRootDehydrated = root2.current.memoizedState.isDehydrated;
                  wasRootDehydrated && (prepareFreshStack(root2, JSCompiler_inline_result).flags |= 256);
                  JSCompiler_inline_result = renderRootSync(
                    root2,
                    JSCompiler_inline_result,
                    false
                  );
                  if (2 !== JSCompiler_inline_result) {
                    if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                      root2.errorRecoveryDisabledLanes |= renderWasConcurrent;
                      workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                      exitStatus = 4;
                      break a;
                    }
                    renderWasConcurrent = workInProgressRootRecoverableErrors;
                    workInProgressRootRecoverableErrors = exitStatus;
                    null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(
                      workInProgressRootRecoverableErrors,
                      renderWasConcurrent
                    ));
                  }
                  exitStatus = JSCompiler_inline_result;
                }
                renderWasConcurrent = false;
                if (2 !== exitStatus) continue;
              }
            }
            if (1 === exitStatus) {
              prepareFreshStack(root$jscomp$0, 0);
              markRootSuspended(root$jscomp$0, lanes, 0, true);
              break;
            }
            a: {
              shouldTimeSlice = root$jscomp$0;
              renderWasConcurrent = exitStatus;
              switch (renderWasConcurrent) {
                case 0:
                case 1:
                  throw Error(formatProdErrorMessage(345));
                case 4:
                  if ((lanes & 4194048) !== lanes) break;
                case 6:
                  markRootSuspended(
                    shouldTimeSlice,
                    lanes,
                    workInProgressDeferredLane,
                    !workInProgressRootDidSkipSuspendedSiblings
                  );
                  break a;
                case 2:
                  workInProgressRootRecoverableErrors = null;
                  break;
                case 3:
                case 5:
                  break;
                default:
                  throw Error(formatProdErrorMessage(329));
              }
              if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
                markRootSuspended(
                  shouldTimeSlice,
                  lanes,
                  workInProgressDeferredLane,
                  !workInProgressRootDidSkipSuspendedSiblings
                );
                if (0 !== getNextLanes(shouldTimeSlice, 0, true)) break a;
                pendingEffectsLanes = lanes;
                shouldTimeSlice.timeoutHandle = scheduleTimeout(
                  commitRootWhenReady.bind(
                    null,
                    shouldTimeSlice,
                    forceSync,
                    workInProgressRootRecoverableErrors,
                    workInProgressTransitions,
                    workInProgressRootDidIncludeRecursiveRenderUpdate,
                    lanes,
                    workInProgressDeferredLane,
                    workInProgressRootInterleavedUpdatedLanes,
                    workInProgressSuspendedRetryLanes,
                    workInProgressRootDidSkipSuspendedSiblings,
                    renderWasConcurrent,
                    "Throttled",
                    -0,
                    0
                  ),
                  exitStatus
                );
                break a;
              }
              commitRootWhenReady(
                shouldTimeSlice,
                forceSync,
                workInProgressRootRecoverableErrors,
                workInProgressTransitions,
                workInProgressRootDidIncludeRecursiveRenderUpdate,
                lanes,
                workInProgressDeferredLane,
                workInProgressRootInterleavedUpdatedLanes,
                workInProgressSuspendedRetryLanes,
                workInProgressRootDidSkipSuspendedSiblings,
                renderWasConcurrent,
                null,
                -0,
                0
              );
            }
          }
          break;
        } while (1);
        ensureRootIsScheduled(root$jscomp$0);
      }
      function commitRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
        root2.timeoutHandle = -1;
        suspendedCommitReason = finishedWork.subtreeFlags;
        if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
          suspendedCommitReason = {
            stylesheets: null,
            count: 0,
            imgCount: 0,
            imgBytes: 0,
            suspenseyImages: [],
            waitingForImages: true,
            waitingForViewTransition: false,
            unsuspend: noop$1
          };
          accumulateSuspenseyCommitOnFiber(
            finishedWork,
            lanes,
            suspendedCommitReason
          );
          var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
          timeoutOffset = waitForCommitToBeReady(
            suspendedCommitReason,
            timeoutOffset
          );
          if (null !== timeoutOffset) {
            pendingEffectsLanes = lanes;
            root2.cancelPendingCommit = timeoutOffset(
              commitRoot.bind(
                null,
                root2,
                finishedWork,
                lanes,
                recoverableErrors,
                transitions,
                didIncludeRenderPhaseUpdate,
                spawnedLane,
                updatedLanes,
                suspendedRetryLanes,
                exitStatus,
                suspendedCommitReason,
                null,
                completedRenderStartTime,
                completedRenderEndTime
              )
            );
            markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
            return;
          }
        }
        commitRoot(
          root2,
          finishedWork,
          lanes,
          recoverableErrors,
          transitions,
          didIncludeRenderPhaseUpdate,
          spawnedLane,
          updatedLanes,
          suspendedRetryLanes
        );
      }
      function isRenderConsistentWithExternalStores(finishedWork) {
        for (var node = finishedWork; ; ) {
          var tag = node.tag;
          if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag)))
            for (var i = 0; i < tag.length; i++) {
              var check = tag[i], getSnapshot = check.getSnapshot;
              check = check.value;
              try {
                if (!objectIs(getSnapshot(), check)) return false;
              } catch (error) {
                return false;
              }
            }
          tag = node.child;
          if (node.subtreeFlags & 16384 && null !== tag)
            tag.return = node, node = tag;
          else {
            if (node === finishedWork) break;
            for (; null === node.sibling; ) {
              if (null === node.return || node.return === finishedWork) return true;
              node = node.return;
            }
            node.sibling.return = node.return;
            node = node.sibling;
          }
        }
        return true;
      }
      function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
        suspendedLanes &= ~workInProgressRootPingedLanes;
        suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
        root2.suspendedLanes |= suspendedLanes;
        root2.pingedLanes &= ~suspendedLanes;
        didAttemptEntireTree && (root2.warmLanes |= suspendedLanes);
        didAttemptEntireTree = root2.expirationTimes;
        for (var lanes = suspendedLanes; 0 < lanes; ) {
          var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
          didAttemptEntireTree[index$6] = -1;
          lanes &= ~lane;
        }
        0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
      }
      function flushSyncWork$1() {
        return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0, false), false) : true;
      }
      function resetWorkInProgressStack() {
        if (null !== workInProgress) {
          if (0 === workInProgressSuspendedReason)
            var interruptedWork = workInProgress.return;
          else
            interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
          for (; null !== interruptedWork; )
            unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
          workInProgress = null;
        }
      }
      function prepareFreshStack(root2, lanes) {
        var timeoutHandle = root2.timeoutHandle;
        -1 !== timeoutHandle && (root2.timeoutHandle = -1, cancelTimeout(timeoutHandle));
        timeoutHandle = root2.cancelPendingCommit;
        null !== timeoutHandle && (root2.cancelPendingCommit = null, timeoutHandle());
        pendingEffectsLanes = 0;
        resetWorkInProgressStack();
        workInProgressRoot = root2;
        workInProgress = timeoutHandle = createWorkInProgress(root2.current, null);
        workInProgressRootRenderLanes = lanes;
        workInProgressSuspendedReason = 0;
        workInProgressThrownValue = null;
        workInProgressRootDidSkipSuspendedSiblings = false;
        workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
        workInProgressRootDidAttachPingListener = false;
        workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
        workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
        workInProgressRootDidIncludeRecursiveRenderUpdate = false;
        0 !== (lanes & 8) && (lanes |= lanes & 32);
        var allEntangledLanes = root2.entangledLanes;
        if (0 !== allEntangledLanes)
          for (root2 = root2.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes; ) {
            var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
            lanes |= root2[index$4];
            allEntangledLanes &= ~lane;
          }
        entangledRenderLanes = lanes;
        finishQueueingConcurrentUpdates();
        return timeoutHandle;
      }
      function handleThrow(root2, thrownValue) {
        currentlyRenderingFiber = null;
        ReactSharedInternals.H = ContextOnlyDispatcher;
        thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
        workInProgressThrownValue = thrownValue;
        null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(
          root2,
          createCapturedValueAtFiber(thrownValue, root2.current)
        ));
      }
      function shouldRemainOnPreviousScreen() {
        var handler = suspenseHandlerStackCursor.current;
        return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
      }
      function pushDispatcher() {
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = ContextOnlyDispatcher;
        return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
      }
      function pushAsyncDispatcher() {
        var prevAsyncDispatcher = ReactSharedInternals.A;
        ReactSharedInternals.A = DefaultAsyncDispatcher;
        return prevAsyncDispatcher;
      }
      function renderDidSuspendDelayIfPossible() {
        workInProgressRootExitStatus = 4;
        workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
        0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(
          workInProgressRoot,
          workInProgressRootRenderLanes,
          workInProgressDeferredLane,
          false
        );
      }
      function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
        var prevExecutionContext = executionContext;
        executionContext |= 2;
        var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
        if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes)
          workInProgressTransitions = null, prepareFreshStack(root2, lanes);
        lanes = false;
        var exitStatus = workInProgressRootExitStatus;
        a: do
          try {
            if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
              var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
              switch (workInProgressSuspendedReason) {
                case 8:
                  resetWorkInProgressStack();
                  exitStatus = 6;
                  break a;
                case 3:
                case 2:
                case 9:
                case 6:
                  null === suspenseHandlerStackCursor.current && (lanes = true);
                  var reason = workInProgressSuspendedReason;
                  workInProgressSuspendedReason = 0;
                  workInProgressThrownValue = null;
                  throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
                  if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                    exitStatus = 0;
                    break a;
                  }
                  break;
                default:
                  reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
              }
            }
            workLoopSync();
            exitStatus = workInProgressRootExitStatus;
            break;
          } catch (thrownValue$165) {
            handleThrow(root2, thrownValue$165);
          }
        while (1);
        lanes && root2.shellSuspendCounter++;
        lastContextDependency = currentlyRenderingFiber$1 = null;
        executionContext = prevExecutionContext;
        ReactSharedInternals.H = prevDispatcher;
        ReactSharedInternals.A = prevAsyncDispatcher;
        null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
        return exitStatus;
      }
      function workLoopSync() {
        for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
      }
      function renderRootConcurrent(root2, lanes) {
        var prevExecutionContext = executionContext;
        executionContext |= 2;
        var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
        workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root2, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
          root2,
          lanes
        );
        a: do
          try {
            if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
              lanes = workInProgress;
              var thrownValue = workInProgressThrownValue;
              b: switch (workInProgressSuspendedReason) {
                case 1:
                  workInProgressSuspendedReason = 0;
                  workInProgressThrownValue = null;
                  throwAndUnwindWorkLoop(root2, lanes, thrownValue, 1);
                  break;
                case 2:
                case 9:
                  if (isThenableResolved(thrownValue)) {
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    replaySuspendedUnitOfWork(lanes);
                    break;
                  }
                  lanes = function() {
                    2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root2 || (workInProgressSuspendedReason = 7);
                    ensureRootIsScheduled(root2);
                  };
                  thrownValue.then(lanes, lanes);
                  break a;
                case 3:
                  workInProgressSuspendedReason = 7;
                  break a;
                case 4:
                  workInProgressSuspendedReason = 5;
                  break a;
                case 7:
                  isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, thrownValue, 7));
                  break;
                case 5:
                  var resource = null;
                  switch (workInProgress.tag) {
                    case 26:
                      resource = workInProgress.memoizedState;
                    case 5:
                    case 27:
                      var hostFiber = workInProgress;
                      if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                        workInProgressSuspendedReason = 0;
                        workInProgressThrownValue = null;
                        var sibling = hostFiber.sibling;
                        if (null !== sibling) workInProgress = sibling;
                        else {
                          var returnFiber = hostFiber.return;
                          null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                        }
                        break b;
                      }
                  }
                  workInProgressSuspendedReason = 0;
                  workInProgressThrownValue = null;
                  throwAndUnwindWorkLoop(root2, lanes, thrownValue, 5);
                  break;
                case 6:
                  workInProgressSuspendedReason = 0;
                  workInProgressThrownValue = null;
                  throwAndUnwindWorkLoop(root2, lanes, thrownValue, 6);
                  break;
                case 8:
                  resetWorkInProgressStack();
                  workInProgressRootExitStatus = 6;
                  break a;
                default:
                  throw Error(formatProdErrorMessage(462));
              }
            }
            workLoopConcurrentByScheduler();
            break;
          } catch (thrownValue$167) {
            handleThrow(root2, thrownValue$167);
          }
        while (1);
        lastContextDependency = currentlyRenderingFiber$1 = null;
        ReactSharedInternals.H = prevDispatcher;
        ReactSharedInternals.A = prevAsyncDispatcher;
        executionContext = prevExecutionContext;
        if (null !== workInProgress) return 0;
        workInProgressRoot = null;
        workInProgressRootRenderLanes = 0;
        finishQueueingConcurrentUpdates();
        return workInProgressRootExitStatus;
      }
      function workLoopConcurrentByScheduler() {
        for (; null !== workInProgress && !shouldYield(); )
          performUnitOfWork(workInProgress);
      }
      function performUnitOfWork(unitOfWork) {
        var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
        unitOfWork.memoizedProps = unitOfWork.pendingProps;
        null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
      }
      function replaySuspendedUnitOfWork(unitOfWork) {
        var next = unitOfWork;
        var current = next.alternate;
        switch (next.tag) {
          case 15:
          case 0:
            next = replayFunctionComponent(
              current,
              next,
              next.pendingProps,
              next.type,
              void 0,
              workInProgressRootRenderLanes
            );
            break;
          case 11:
            next = replayFunctionComponent(
              current,
              next,
              next.pendingProps,
              next.type.render,
              next.ref,
              workInProgressRootRenderLanes
            );
            break;
          case 5:
            resetHooksOnUnwind(next);
          default:
            unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
        }
        unitOfWork.memoizedProps = unitOfWork.pendingProps;
        null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
      }
      function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
        lastContextDependency = currentlyRenderingFiber$1 = null;
        resetHooksOnUnwind(unitOfWork);
        thenableState$1 = null;
        thenableIndexCounter$1 = 0;
        var returnFiber = unitOfWork.return;
        try {
          if (throwException(
            root2,
            returnFiber,
            unitOfWork,
            thrownValue,
            workInProgressRootRenderLanes
          )) {
            workInProgressRootExitStatus = 1;
            logUncaughtError(
              root2,
              createCapturedValueAtFiber(thrownValue, root2.current)
            );
            workInProgress = null;
            return;
          }
        } catch (error) {
          if (null !== returnFiber) throw workInProgress = returnFiber, error;
          workInProgressRootExitStatus = 1;
          logUncaughtError(
            root2,
            createCapturedValueAtFiber(thrownValue, root2.current)
          );
          workInProgress = null;
          return;
        }
        if (unitOfWork.flags & 32768) {
          if (isHydrating || 1 === suspendedReason) root2 = true;
          else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912))
            root2 = false;
          else if (workInProgressRootDidSkipSuspendedSiblings = root2 = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
            suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
          unwindUnitOfWork(unitOfWork, root2);
        } else completeUnitOfWork(unitOfWork);
      }
      function completeUnitOfWork(unitOfWork) {
        var completedWork = unitOfWork;
        do {
          if (0 !== (completedWork.flags & 32768)) {
            unwindUnitOfWork(
              completedWork,
              workInProgressRootDidSkipSuspendedSiblings
            );
            return;
          }
          unitOfWork = completedWork.return;
          var next = completeWork(
            completedWork.alternate,
            completedWork,
            entangledRenderLanes
          );
          if (null !== next) {
            workInProgress = next;
            return;
          }
          completedWork = completedWork.sibling;
          if (null !== completedWork) {
            workInProgress = completedWork;
            return;
          }
          workInProgress = completedWork = unitOfWork;
        } while (null !== completedWork);
        0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
      }
      function unwindUnitOfWork(unitOfWork, skipSiblings) {
        do {
          var next = unwindWork(unitOfWork.alternate, unitOfWork);
          if (null !== next) {
            next.flags &= 32767;
            workInProgress = next;
            return;
          }
          next = unitOfWork.return;
          null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
          if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
            workInProgress = unitOfWork;
            return;
          }
          workInProgress = unitOfWork = next;
        } while (null !== unitOfWork);
        workInProgressRootExitStatus = 6;
        workInProgress = null;
      }
      function commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
        root2.cancelPendingCommit = null;
        do
          flushPendingEffects();
        while (0 !== pendingEffectsStatus);
        if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
        if (null !== finishedWork) {
          if (finishedWork === root2.current) throw Error(formatProdErrorMessage(177));
          didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
          didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
          markRootFinished(
            root2,
            lanes,
            didIncludeRenderPhaseUpdate,
            spawnedLane,
            updatedLanes,
            suspendedRetryLanes
          );
          root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
          pendingFinishedWork = finishedWork;
          pendingEffectsRoot = root2;
          pendingEffectsLanes = lanes;
          pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
          pendingPassiveTransitions = transitions;
          pendingRecoverableErrors = recoverableErrors;
          0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
            flushPassiveEffects();
            return null;
          })) : (root2.callbackNode = null, root2.callbackPriority = 0);
          recoverableErrors = 0 !== (finishedWork.flags & 13878);
          if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
            recoverableErrors = ReactSharedInternals.T;
            ReactSharedInternals.T = null;
            transitions = ReactDOMSharedInternals.p;
            ReactDOMSharedInternals.p = 2;
            spawnedLane = executionContext;
            executionContext |= 4;
            try {
              commitBeforeMutationEffects(root2, finishedWork, lanes);
            } finally {
              executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
            }
          }
          pendingEffectsStatus = 1;
          flushMutationEffects();
          flushLayoutEffects();
          flushSpawnedWork();
        }
      }
      function flushMutationEffects() {
        if (1 === pendingEffectsStatus) {
          pendingEffectsStatus = 0;
          var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
          if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
            rootMutationHasEffect = ReactSharedInternals.T;
            ReactSharedInternals.T = null;
            var previousPriority = ReactDOMSharedInternals.p;
            ReactDOMSharedInternals.p = 2;
            var prevExecutionContext = executionContext;
            executionContext |= 4;
            try {
              commitMutationEffectsOnFiber(finishedWork, root2);
              var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root2.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
              if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(
                priorFocusedElem.ownerDocument.documentElement,
                priorFocusedElem
              )) {
                if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
                  var start = priorSelectionRange.start, end = priorSelectionRange.end;
                  void 0 === end && (end = start);
                  if ("selectionStart" in priorFocusedElem)
                    priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(
                      end,
                      priorFocusedElem.value.length
                    );
                  else {
                    var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
                    if (win.getSelection) {
                      var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                      !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                      var startMarker = getNodeForCharacterOffset(
                        priorFocusedElem,
                        start$jscomp$0
                      ), endMarker = getNodeForCharacterOffset(
                        priorFocusedElem,
                        end$jscomp$0
                      );
                      if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                        var range = doc.createRange();
                        range.setStart(startMarker.node, startMarker.offset);
                        selection.removeAllRanges();
                        start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                      }
                    }
                  }
                }
                doc = [];
                for (selection = priorFocusedElem; selection = selection.parentNode; )
                  1 === selection.nodeType && doc.push({
                    element: selection,
                    left: selection.scrollLeft,
                    top: selection.scrollTop
                  });
                "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
                for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
                  var info = doc[priorFocusedElem];
                  info.element.scrollLeft = info.left;
                  info.element.scrollTop = info.top;
                }
              }
              _enabled = !!eventsEnabled;
              selectionInformation = eventsEnabled = null;
            } finally {
              executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
            }
          }
          root2.current = finishedWork;
          pendingEffectsStatus = 2;
        }
      }
      function flushLayoutEffects() {
        if (2 === pendingEffectsStatus) {
          pendingEffectsStatus = 0;
          var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
          if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
            rootHasLayoutEffect = ReactSharedInternals.T;
            ReactSharedInternals.T = null;
            var previousPriority = ReactDOMSharedInternals.p;
            ReactDOMSharedInternals.p = 2;
            var prevExecutionContext = executionContext;
            executionContext |= 4;
            try {
              commitLayoutEffectOnFiber(root2, finishedWork.alternate, finishedWork);
            } finally {
              executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
            }
          }
          pendingEffectsStatus = 3;
        }
      }
      function flushSpawnedWork() {
        if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
          pendingEffectsStatus = 0;
          requestPaint();
          var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
          0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root2, root2.pendingLanes));
          var remainingLanes = root2.pendingLanes;
          0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
          lanesToEventPriority(lanes);
          finishedWork = finishedWork.stateNode;
          if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
            try {
              injectedHook.onCommitFiberRoot(
                rendererID,
                finishedWork,
                void 0,
                128 === (finishedWork.current.flags & 128)
              );
            } catch (err) {
            }
          if (null !== recoverableErrors) {
            finishedWork = ReactSharedInternals.T;
            remainingLanes = ReactDOMSharedInternals.p;
            ReactDOMSharedInternals.p = 2;
            ReactSharedInternals.T = null;
            try {
              for (var onRecoverableError = root2.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
                var recoverableError = recoverableErrors[i];
                onRecoverableError(recoverableError.value, {
                  componentStack: recoverableError.stack
                });
              }
            } finally {
              ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
            }
          }
          0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
          ensureRootIsScheduled(root2);
          remainingLanes = root2.pendingLanes;
          0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root2 === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root2) : nestedUpdateCount = 0;
          flushSyncWorkAcrossRoots_impl(0, false);
        }
      }
      function releaseRootPooledCache(root2, remainingLanes) {
        0 === (root2.pooledCacheLanes &= remainingLanes) && (remainingLanes = root2.pooledCache, null != remainingLanes && (root2.pooledCache = null, releaseCache(remainingLanes)));
      }
      function flushPendingEffects() {
        flushMutationEffects();
        flushLayoutEffects();
        flushSpawnedWork();
        return flushPassiveEffects();
      }
      function flushPassiveEffects() {
        if (5 !== pendingEffectsStatus) return false;
        var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
        pendingEffectsRemainingLanes = 0;
        var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
        try {
          ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
          ReactSharedInternals.T = null;
          renderPriority = pendingPassiveTransitions;
          pendingPassiveTransitions = null;
          var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
          pendingEffectsStatus = 0;
          pendingFinishedWork = pendingEffectsRoot = null;
          pendingEffectsLanes = 0;
          if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
          var prevExecutionContext = executionContext;
          executionContext |= 4;
          commitPassiveUnmountOnFiber(root$jscomp$0.current);
          commitPassiveMountOnFiber(
            root$jscomp$0,
            root$jscomp$0.current,
            lanes,
            renderPriority
          );
          executionContext = prevExecutionContext;
          flushSyncWorkAcrossRoots_impl(0, false);
          if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot)
            try {
              injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
            } catch (err) {
            }
          return true;
        } finally {
          ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root2, remainingLanes);
        }
      }
      function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
        sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
        sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
        rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
        null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
      }
      function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
        if (3 === sourceFiber.tag)
          captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
        else
          for (; null !== nearestMountedAncestor; ) {
            if (3 === nearestMountedAncestor.tag) {
              captureCommitPhaseErrorOnRoot(
                nearestMountedAncestor,
                sourceFiber,
                error
              );
              break;
            } else if (1 === nearestMountedAncestor.tag) {
              var instance = nearestMountedAncestor.stateNode;
              if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
                sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
                error = createClassErrorUpdate(2);
                instance = enqueueUpdate(nearestMountedAncestor, error, 2);
                null !== instance && (initializeClassErrorUpdate(
                  error,
                  instance,
                  nearestMountedAncestor,
                  sourceFiber
                ), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
                break;
              }
            }
            nearestMountedAncestor = nearestMountedAncestor.return;
          }
      }
      function attachPingListener(root2, wakeable, lanes) {
        var pingCache = root2.pingCache;
        if (null === pingCache) {
          pingCache = root2.pingCache = new PossiblyWeakMap();
          var threadIDs = /* @__PURE__ */ new Set();
          pingCache.set(wakeable, threadIDs);
        } else
          threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = /* @__PURE__ */ new Set(), pingCache.set(wakeable, threadIDs));
        threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root2 = pingSuspendedRoot.bind(null, root2, wakeable, lanes), wakeable.then(root2, root2));
      }
      function pingSuspendedRoot(root2, wakeable, pingedLanes) {
        var pingCache = root2.pingCache;
        null !== pingCache && pingCache.delete(wakeable);
        root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
        root2.warmLanes &= ~pingedLanes;
        workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
        ensureRootIsScheduled(root2);
      }
      function retryTimedOutBoundary(boundaryFiber, retryLane) {
        0 === retryLane && (retryLane = claimNextRetryLane());
        boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
        null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
      }
      function retryDehydratedSuspenseBoundary(boundaryFiber) {
        var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
        null !== suspenseState && (retryLane = suspenseState.retryLane);
        retryTimedOutBoundary(boundaryFiber, retryLane);
      }
      function resolveRetryWakeable(boundaryFiber, wakeable) {
        var retryLane = 0;
        switch (boundaryFiber.tag) {
          case 31:
          case 13:
            var retryCache = boundaryFiber.stateNode;
            var suspenseState = boundaryFiber.memoizedState;
            null !== suspenseState && (retryLane = suspenseState.retryLane);
            break;
          case 19:
            retryCache = boundaryFiber.stateNode;
            break;
          case 22:
            retryCache = boundaryFiber.stateNode._retryCache;
            break;
          default:
            throw Error(formatProdErrorMessage(314));
        }
        null !== retryCache && retryCache.delete(wakeable);
        retryTimedOutBoundary(boundaryFiber, retryLane);
      }
      function scheduleCallback$1(priorityLevel, callback) {
        return scheduleCallback$3(priorityLevel, callback);
      }
      var firstScheduledRoot = null;
      var lastScheduledRoot = null;
      var didScheduleMicrotask = false;
      var mightHavePendingSyncWork = false;
      var isFlushingWork = false;
      var currentEventTransitionLane = 0;
      function ensureRootIsScheduled(root2) {
        root2 !== lastScheduledRoot && null === root2.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2);
        mightHavePendingSyncWork = true;
        didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
      }
      function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
        if (!isFlushingWork && mightHavePendingSyncWork) {
          isFlushingWork = true;
          do {
            var didPerformSomeWork = false;
            for (var root$170 = firstScheduledRoot; null !== root$170; ) {
              if (!onlyLegacy)
                if (0 !== syncTransitionLanes) {
                  var pendingLanes = root$170.pendingLanes;
                  if (0 === pendingLanes) var JSCompiler_inline_result = 0;
                  else {
                    var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
                    JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
                    JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
                    JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
                  }
                  0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
                } else
                  JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(
                    root$170,
                    root$170 === workInProgressRoot ? JSCompiler_inline_result : 0,
                    null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle
                  ), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
              root$170 = root$170.next;
            }
          } while (didPerformSomeWork);
          isFlushingWork = false;
        }
      }
      function processRootScheduleInImmediateTask() {
        processRootScheduleInMicrotask();
      }
      function processRootScheduleInMicrotask() {
        mightHavePendingSyncWork = didScheduleMicrotask = false;
        var syncTransitionLanes = 0;
        0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
        for (var currentTime = now(), prev = null, root2 = firstScheduledRoot; null !== root2; ) {
          var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
          if (0 === nextLanes)
            root2.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
          else if (prev = root2, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
            mightHavePendingSyncWork = true;
          root2 = next;
        }
        0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes, false);
        0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
      }
      function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
        for (var suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes, expirationTimes = root2.expirationTimes, lanes = root2.pendingLanes & -62914561; 0 < lanes; ) {
          var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
          if (-1 === expirationTime) {
            if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
              expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
          } else expirationTime <= currentTime && (root2.expiredLanes |= lane);
          lanes &= ~lane;
        }
        currentTime = workInProgressRoot;
        suspendedLanes = workInProgressRootRenderLanes;
        suspendedLanes = getNextLanes(
          root2,
          root2 === currentTime ? suspendedLanes : 0,
          null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
        );
        pingedLanes = root2.callbackNode;
        if (0 === suspendedLanes || root2 === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
          return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
        if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root2, suspendedLanes)) {
          currentTime = suspendedLanes & -suspendedLanes;
          if (currentTime === root2.callbackPriority) return currentTime;
          null !== pingedLanes && cancelCallback$1(pingedLanes);
          switch (lanesToEventPriority(suspendedLanes)) {
            case 2:
            case 8:
              suspendedLanes = UserBlockingPriority;
              break;
            case 32:
              suspendedLanes = NormalPriority$1;
              break;
            case 268435456:
              suspendedLanes = IdlePriority;
              break;
            default:
              suspendedLanes = NormalPriority$1;
          }
          pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2);
          suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
          root2.callbackPriority = currentTime;
          root2.callbackNode = suspendedLanes;
          return currentTime;
        }
        null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
        root2.callbackPriority = 2;
        root2.callbackNode = null;
        return 2;
      }
      function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
        if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus)
          return root2.callbackNode = null, root2.callbackPriority = 0, null;
        var originalCallbackNode = root2.callbackNode;
        if (flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
          return null;
        var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
        workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
          root2,
          root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0,
          null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
        );
        if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
        performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout);
        scheduleTaskForRootDuringMicrotask(root2, now());
        return null != root2.callbackNode && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
      }
      function performSyncWorkOnRoot(root2, lanes) {
        if (flushPendingEffects()) return null;
        performWorkOnRoot(root2, lanes, true);
      }
      function scheduleImmediateRootScheduleTask() {
        scheduleMicrotask(function() {
          0 !== (executionContext & 6) ? scheduleCallback$3(
            ImmediatePriority,
            processRootScheduleInImmediateTask
          ) : processRootScheduleInMicrotask();
        });
      }
      function requestTransitionLane() {
        if (0 === currentEventTransitionLane) {
          var actionScopeLane = currentEntangledLane;
          0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
          currentEventTransitionLane = actionScopeLane;
        }
        return currentEventTransitionLane;
      }
      function coerceFormActionProp(actionProp) {
        return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
      }
      function createFormDataWithSubmitter(form, submitter) {
        var temp = submitter.ownerDocument.createElement("input");
        temp.name = submitter.name;
        temp.value = submitter.value;
        form.id && temp.setAttribute("form", form.id);
        submitter.parentNode.insertBefore(temp, submitter);
        form = new FormData(form);
        temp.parentNode.removeChild(temp);
        return form;
      }
      function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
        if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
          var action = coerceFormActionProp(
            (nativeEventTarget[internalPropsKey] || null).action
          ), submitter = nativeEvent.submitter;
          submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
          var event = new SyntheticEvent(
            "action",
            "action",
            null,
            nativeEvent,
            nativeEventTarget
          );
          dispatchQueue.push({
            event,
            listeners: [
              {
                instance: null,
                listener: function() {
                  if (nativeEvent.defaultPrevented) {
                    if (0 !== currentEventTransitionLane) {
                      var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
                      startHostTransition(
                        maybeTargetInst,
                        {
                          pending: true,
                          data: formData,
                          method: nativeEventTarget.method,
                          action
                        },
                        null,
                        formData
                      );
                    }
                  } else
                    "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(
                      maybeTargetInst,
                      {
                        pending: true,
                        data: formData,
                        method: nativeEventTarget.method,
                        action
                      },
                      action,
                      formData
                    ));
                },
                currentTarget: nativeEventTarget
              }
            ]
          });
        }
      }
      for (i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
        eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577], domEventName$jscomp$inline_1579 = eventName$jscomp$inline_1578.toLowerCase(), capitalizedEvent$jscomp$inline_1580 = eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1);
        registerSimpleEvent(
          domEventName$jscomp$inline_1579,
          "on" + capitalizedEvent$jscomp$inline_1580
        );
      }
      var eventName$jscomp$inline_1578;
      var domEventName$jscomp$inline_1579;
      var capitalizedEvent$jscomp$inline_1580;
      var i$jscomp$inline_1577;
      registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
      registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
      registerSimpleEvent(ANIMATION_START, "onAnimationStart");
      registerSimpleEvent("dblclick", "onDoubleClick");
      registerSimpleEvent("focusin", "onFocus");
      registerSimpleEvent("focusout", "onBlur");
      registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
      registerSimpleEvent(TRANSITION_START, "onTransitionStart");
      registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
      registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
      registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
      registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
      registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
      registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
      registerTwoPhaseEvent(
        "onChange",
        "change click focusin focusout input keydown keyup selectionchange".split(" ")
      );
      registerTwoPhaseEvent(
        "onSelect",
        "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
          " "
        )
      );
      registerTwoPhaseEvent("onBeforeInput", [
        "compositionend",
        "keypress",
        "textInput",
        "paste"
      ]);
      registerTwoPhaseEvent(
        "onCompositionEnd",
        "compositionend focusout keydown keypress keyup mousedown".split(" ")
      );
      registerTwoPhaseEvent(
        "onCompositionStart",
        "compositionstart focusout keydown keypress keyup mousedown".split(" ")
      );
      registerTwoPhaseEvent(
        "onCompositionUpdate",
        "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
      );
      var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " "
      );
      var nonDelegatedEvents = new Set(
        "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes)
      );
      function processDispatchQueue(dispatchQueue, eventSystemFlags) {
        eventSystemFlags = 0 !== (eventSystemFlags & 4);
        for (var i = 0; i < dispatchQueue.length; i++) {
          var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
          _dispatchQueue$i = _dispatchQueue$i.listeners;
          a: {
            var previousInstance = void 0;
            if (eventSystemFlags)
              for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
                var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
                _dispatchListeners$i = _dispatchListeners$i.listener;
                if (instance !== previousInstance && event.isPropagationStopped())
                  break a;
                previousInstance = _dispatchListeners$i;
                event.currentTarget = currentTarget;
                try {
                  previousInstance(event);
                } catch (error) {
                  reportGlobalError(error);
                }
                event.currentTarget = null;
                previousInstance = instance;
              }
            else
              for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
                _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
                instance = _dispatchListeners$i.instance;
                currentTarget = _dispatchListeners$i.currentTarget;
                _dispatchListeners$i = _dispatchListeners$i.listener;
                if (instance !== previousInstance && event.isPropagationStopped())
                  break a;
                previousInstance = _dispatchListeners$i;
                event.currentTarget = currentTarget;
                try {
                  previousInstance(event);
                } catch (error) {
                  reportGlobalError(error);
                }
                event.currentTarget = null;
                previousInstance = instance;
              }
          }
        }
      }
      function listenToNonDelegatedEvent(domEventName, targetElement) {
        var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
        void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = /* @__PURE__ */ new Set());
        var listenerSetKey = domEventName + "__bubble";
        JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
      }
      function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
        var eventSystemFlags = 0;
        isCapturePhaseListener && (eventSystemFlags |= 4);
        addTrappedEventListener(
          target,
          domEventName,
          eventSystemFlags,
          isCapturePhaseListener
        );
      }
      var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
      function listenToAllSupportedEvents(rootContainerElement) {
        if (!rootContainerElement[listeningMarker]) {
          rootContainerElement[listeningMarker] = true;
          allNativeEvents.forEach(function(domEventName) {
            "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
          });
          var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
          null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
        }
      }
      function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
        switch (getEventPriority(domEventName)) {
          case 2:
            var listenerWrapper = dispatchDiscreteEvent;
            break;
          case 8:
            listenerWrapper = dispatchContinuousEvent;
            break;
          default:
            listenerWrapper = dispatchEvent;
        }
        eventSystemFlags = listenerWrapper.bind(
          null,
          domEventName,
          eventSystemFlags,
          targetContainer
        );
        listenerWrapper = void 0;
        !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
        isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
          capture: true,
          passive: listenerWrapper
        }) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
          passive: listenerWrapper
        }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
      }
      function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
        var ancestorInst = targetInst$jscomp$0;
        if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0)
          a: for (; ; ) {
            if (null === targetInst$jscomp$0) return;
            var nodeTag = targetInst$jscomp$0.tag;
            if (3 === nodeTag || 4 === nodeTag) {
              var container = targetInst$jscomp$0.stateNode.containerInfo;
              if (container === targetContainer) break;
              if (4 === nodeTag)
                for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
                  var grandTag = nodeTag.tag;
                  if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer)
                    return;
                  nodeTag = nodeTag.return;
                }
              for (; null !== container; ) {
                nodeTag = getClosestInstanceFromNode(container);
                if (null === nodeTag) return;
                grandTag = nodeTag.tag;
                if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
                  targetInst$jscomp$0 = ancestorInst = nodeTag;
                  continue a;
                }
                container = container.parentNode;
              }
            }
            targetInst$jscomp$0 = targetInst$jscomp$0.return;
          }
        batchedUpdates$1(function() {
          var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
          a: {
            var reactName = topLevelEventsToReactNames.get(domEventName);
            if (void 0 !== reactName) {
              var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
              switch (domEventName) {
                case "keypress":
                  if (0 === getEventCharCode(nativeEvent)) break a;
                case "keydown":
                case "keyup":
                  SyntheticEventCtor = SyntheticKeyboardEvent;
                  break;
                case "focusin":
                  reactEventType = "focus";
                  SyntheticEventCtor = SyntheticFocusEvent;
                  break;
                case "focusout":
                  reactEventType = "blur";
                  SyntheticEventCtor = SyntheticFocusEvent;
                  break;
                case "beforeblur":
                case "afterblur":
                  SyntheticEventCtor = SyntheticFocusEvent;
                  break;
                case "click":
                  if (2 === nativeEvent.button) break a;
                case "auxclick":
                case "dblclick":
                case "mousedown":
                case "mousemove":
                case "mouseup":
                case "mouseout":
                case "mouseover":
                case "contextmenu":
                  SyntheticEventCtor = SyntheticMouseEvent;
                  break;
                case "drag":
                case "dragend":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "dragstart":
                case "drop":
                  SyntheticEventCtor = SyntheticDragEvent;
                  break;
                case "touchcancel":
                case "touchend":
                case "touchmove":
                case "touchstart":
                  SyntheticEventCtor = SyntheticTouchEvent;
                  break;
                case ANIMATION_END:
                case ANIMATION_ITERATION:
                case ANIMATION_START:
                  SyntheticEventCtor = SyntheticAnimationEvent;
                  break;
                case TRANSITION_END:
                  SyntheticEventCtor = SyntheticTransitionEvent;
                  break;
                case "scroll":
                case "scrollend":
                  SyntheticEventCtor = SyntheticUIEvent;
                  break;
                case "wheel":
                  SyntheticEventCtor = SyntheticWheelEvent;
                  break;
                case "copy":
                case "cut":
                case "paste":
                  SyntheticEventCtor = SyntheticClipboardEvent;
                  break;
                case "gotpointercapture":
                case "lostpointercapture":
                case "pointercancel":
                case "pointerdown":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "pointerup":
                  SyntheticEventCtor = SyntheticPointerEvent;
                  break;
                case "toggle":
                case "beforetoggle":
                  SyntheticEventCtor = SyntheticToggleEvent;
              }
              var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
              inCapturePhase = [];
              for (var instance = targetInst, lastHostComponent; null !== instance; ) {
                var _instance = instance;
                lastHostComponent = _instance.stateNode;
                _instance = _instance.tag;
                5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(
                  createDispatchListener(instance, _instance, lastHostComponent)
                ));
                if (accumulateTargetOnly) break;
                instance = instance.return;
              }
              0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(
                reactName,
                reactEventType,
                null,
                nativeEvent,
                nativeEventTarget
              ), dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
            }
          }
          if (0 === (eventSystemFlags & 7)) {
            a: {
              reactName = "mouseover" === domEventName || "pointerover" === domEventName;
              SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
              if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey]))
                break a;
              if (SyntheticEventCtor || reactName) {
                reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
                if (SyntheticEventCtor) {
                  if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase))
                    reactEventType = null;
                } else SyntheticEventCtor = null, reactEventType = targetInst;
                if (SyntheticEventCtor !== reactEventType) {
                  inCapturePhase = SyntheticMouseEvent;
                  _instance = "onMouseLeave";
                  reactEventName = "onMouseEnter";
                  instance = "mouse";
                  if ("pointerout" === domEventName || "pointerover" === domEventName)
                    inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
                  accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
                  lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
                  reactName = new inCapturePhase(
                    _instance,
                    instance + "leave",
                    SyntheticEventCtor,
                    nativeEvent,
                    nativeEventTarget
                  );
                  reactName.target = accumulateTargetOnly;
                  reactName.relatedTarget = lastHostComponent;
                  _instance = null;
                  getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(
                    reactEventName,
                    instance + "enter",
                    reactEventType,
                    nativeEvent,
                    nativeEventTarget
                  ), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
                  accumulateTargetOnly = _instance;
                  if (SyntheticEventCtor && reactEventType)
                    b: {
                      inCapturePhase = getParent;
                      reactEventName = SyntheticEventCtor;
                      instance = reactEventType;
                      lastHostComponent = 0;
                      for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance))
                        lastHostComponent++;
                      _instance = 0;
                      for (var tempB = instance; tempB; tempB = inCapturePhase(tempB))
                        _instance++;
                      for (; 0 < lastHostComponent - _instance; )
                        reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
                      for (; 0 < _instance - lastHostComponent; )
                        instance = inCapturePhase(instance), _instance--;
                      for (; lastHostComponent--; ) {
                        if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
                          inCapturePhase = reactEventName;
                          break b;
                        }
                        reactEventName = inCapturePhase(reactEventName);
                        instance = inCapturePhase(instance);
                      }
                      inCapturePhase = null;
                    }
                  else inCapturePhase = null;
                  null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(
                    dispatchQueue,
                    reactName,
                    SyntheticEventCtor,
                    inCapturePhase,
                    false
                  );
                  null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(
                    dispatchQueue,
                    accumulateTargetOnly,
                    reactEventType,
                    inCapturePhase,
                    true
                  );
                }
              }
            }
            a: {
              reactName = targetInst ? getNodeFromInstance(targetInst) : window;
              SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
              if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type)
                var getTargetInstFunc = getTargetInstForChangeEvent;
              else if (isTextInputElement(reactName))
                if (isInputEventSupported)
                  getTargetInstFunc = getTargetInstForInputOrChangeEvent;
                else {
                  getTargetInstFunc = getTargetInstForInputEventPolyfill;
                  var handleEventFunc = handleEventsForInputEventPolyfill;
                }
              else
                SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
              if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
                createAndAccumulateChangeEvent(
                  dispatchQueue,
                  getTargetInstFunc,
                  nativeEvent,
                  nativeEventTarget
                );
                break a;
              }
              handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
              "focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
            }
            handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
            switch (domEventName) {
              case "focusin":
                if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable)
                  activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
                break;
              case "focusout":
                lastSelection = activeElementInst = activeElement = null;
                break;
              case "mousedown":
                mouseDown = true;
                break;
              case "contextmenu":
              case "mouseup":
              case "dragend":
                mouseDown = false;
                constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
                break;
              case "selectionchange":
                if (skipSelectionChangeEvent) break;
              case "keydown":
              case "keyup":
                constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
            }
            var fallbackData;
            if (canUseCompositionEvent)
              b: {
                switch (domEventName) {
                  case "compositionstart":
                    var eventType = "onCompositionStart";
                    break b;
                  case "compositionend":
                    eventType = "onCompositionEnd";
                    break b;
                  case "compositionupdate":
                    eventType = "onCompositionUpdate";
                    break b;
                }
                eventType = void 0;
              }
            else
              isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
            eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(
              eventType,
              domEventName,
              null,
              nativeEvent,
              nativeEventTarget
            ), dispatchQueue.push({ event: eventType, listeners: handleEventFunc }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
            if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent))
              eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent(
                "onBeforeInput",
                "beforeinput",
                null,
                nativeEvent,
                nativeEventTarget
              ), dispatchQueue.push({
                event: handleEventFunc,
                listeners: eventType
              }), handleEventFunc.data = fallbackData);
            extractEvents$1(
              dispatchQueue,
              domEventName,
              targetInst,
              nativeEvent,
              nativeEventTarget
            );
          }
          processDispatchQueue(dispatchQueue, eventSystemFlags);
        });
      }
      function createDispatchListener(instance, listener, currentTarget) {
        return {
          instance,
          listener,
          currentTarget
        };
      }
      function accumulateTwoPhaseListeners(targetFiber, reactName) {
        for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber; ) {
          var _instance2 = targetFiber, stateNode = _instance2.stateNode;
          _instance2 = _instance2.tag;
          5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(
            createDispatchListener(targetFiber, _instance2, stateNode)
          ), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(
            createDispatchListener(targetFiber, _instance2, stateNode)
          ));
          if (3 === targetFiber.tag) return listeners;
          targetFiber = targetFiber.return;
        }
        return [];
      }
      function getParent(inst) {
        if (null === inst) return null;
        do
          inst = inst.return;
        while (inst && 5 !== inst.tag && 27 !== inst.tag);
        return inst ? inst : null;
      }
      function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
        for (var registrationName = event._reactName, listeners = []; null !== target && target !== common; ) {
          var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
          _instance3 = _instance3.tag;
          if (null !== alternate && alternate === common) break;
          5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(
            createDispatchListener(target, stateNode, alternate)
          )) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(
            createDispatchListener(target, stateNode, alternate)
          )));
          target = target.return;
        }
        0 !== listeners.length && dispatchQueue.push({ event, listeners });
      }
      var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
      var NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
      function normalizeMarkupForTextOrAttribute(markup) {
        return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
      }
      function checkForUnmatchedText(serverText, clientText) {
        clientText = normalizeMarkupForTextOrAttribute(clientText);
        return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
      }
      function setProp(domElement, tag, key, value, props, prevValue) {
        switch (key) {
          case "children":
            "string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
            break;
          case "className":
            setValueForKnownAttribute(domElement, "class", value);
            break;
          case "tabIndex":
            setValueForKnownAttribute(domElement, "tabindex", value);
            break;
          case "dir":
          case "role":
          case "viewBox":
          case "width":
          case "height":
            setValueForKnownAttribute(domElement, key, value);
            break;
          case "style":
            setValueForStyles(domElement, value, prevValue);
            break;
          case "data":
            if ("object" !== tag) {
              setValueForKnownAttribute(domElement, "data", value);
              break;
            }
          case "src":
          case "href":
            if ("" === value && ("a" !== tag || "href" !== key)) {
              domElement.removeAttribute(key);
              break;
            }
            if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
              domElement.removeAttribute(key);
              break;
            }
            value = sanitizeURL("" + value);
            domElement.setAttribute(key, value);
            break;
          case "action":
          case "formAction":
            if ("function" === typeof value) {
              domElement.setAttribute(
                key,
                "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
              );
              break;
            } else
              "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(
                domElement,
                tag,
                "formEncType",
                props.formEncType,
                props,
                null
              ), setProp(
                domElement,
                tag,
                "formMethod",
                props.formMethod,
                props,
                null
              ), setProp(
                domElement,
                tag,
                "formTarget",
                props.formTarget,
                props,
                null
              )) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
            if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
              domElement.removeAttribute(key);
              break;
            }
            value = sanitizeURL("" + value);
            domElement.setAttribute(key, value);
            break;
          case "onClick":
            null != value && (domElement.onclick = noop$1);
            break;
          case "onScroll":
            null != value && listenToNonDelegatedEvent("scroll", domElement);
            break;
          case "onScrollEnd":
            null != value && listenToNonDelegatedEvent("scrollend", domElement);
            break;
          case "dangerouslySetInnerHTML":
            if (null != value) {
              if ("object" !== typeof value || !("__html" in value))
                throw Error(formatProdErrorMessage(61));
              key = value.__html;
              if (null != key) {
                if (null != props.children) throw Error(formatProdErrorMessage(60));
                domElement.innerHTML = key;
              }
            }
            break;
          case "multiple":
            domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
            break;
          case "muted":
            domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
            break;
          case "suppressContentEditableWarning":
          case "suppressHydrationWarning":
          case "defaultValue":
          case "defaultChecked":
          case "innerHTML":
          case "ref":
            break;
          case "autoFocus":
            break;
          case "xlinkHref":
            if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
              domElement.removeAttribute("xlink:href");
              break;
            }
            key = sanitizeURL("" + value);
            domElement.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "xlink:href",
              key
            );
            break;
          case "contentEditable":
          case "spellCheck":
          case "draggable":
          case "value":
          case "autoReverse":
          case "externalResourcesRequired":
          case "focusable":
          case "preserveAlpha":
            null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
            break;
          case "inert":
          case "allowFullScreen":
          case "async":
          case "autoPlay":
          case "controls":
          case "default":
          case "defer":
          case "disabled":
          case "disablePictureInPicture":
          case "disableRemotePlayback":
          case "formNoValidate":
          case "hidden":
          case "loop":
          case "noModule":
          case "noValidate":
          case "open":
          case "playsInline":
          case "readOnly":
          case "required":
          case "reversed":
          case "scoped":
          case "seamless":
          case "itemScope":
            value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
            break;
          case "capture":
          case "download":
            true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
            break;
          case "cols":
          case "rows":
          case "size":
          case "span":
            null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
            break;
          case "rowSpan":
          case "start":
            null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
            break;
          case "popover":
            listenToNonDelegatedEvent("beforetoggle", domElement);
            listenToNonDelegatedEvent("toggle", domElement);
            setValueForAttribute(domElement, "popover", value);
            break;
          case "xlinkActuate":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/1999/xlink",
              "xlink:actuate",
              value
            );
            break;
          case "xlinkArcrole":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/1999/xlink",
              "xlink:arcrole",
              value
            );
            break;
          case "xlinkRole":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/1999/xlink",
              "xlink:role",
              value
            );
            break;
          case "xlinkShow":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/1999/xlink",
              "xlink:show",
              value
            );
            break;
          case "xlinkTitle":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/1999/xlink",
              "xlink:title",
              value
            );
            break;
          case "xlinkType":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/1999/xlink",
              "xlink:type",
              value
            );
            break;
          case "xmlBase":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/XML/1998/namespace",
              "xml:base",
              value
            );
            break;
          case "xmlLang":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/XML/1998/namespace",
              "xml:lang",
              value
            );
            break;
          case "xmlSpace":
            setValueForNamespacedAttribute(
              domElement,
              "http://www.w3.org/XML/1998/namespace",
              "xml:space",
              value
            );
            break;
          case "is":
            setValueForAttribute(domElement, "is", value);
            break;
          case "innerText":
          case "textContent":
            break;
          default:
            if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1])
              key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
        }
      }
      function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
        switch (key) {
          case "style":
            setValueForStyles(domElement, value, prevValue);
            break;
          case "dangerouslySetInnerHTML":
            if (null != value) {
              if ("object" !== typeof value || !("__html" in value))
                throw Error(formatProdErrorMessage(61));
              key = value.__html;
              if (null != key) {
                if (null != props.children) throw Error(formatProdErrorMessage(60));
                domElement.innerHTML = key;
              }
            }
            break;
          case "children":
            "string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
            break;
          case "onScroll":
            null != value && listenToNonDelegatedEvent("scroll", domElement);
            break;
          case "onScrollEnd":
            null != value && listenToNonDelegatedEvent("scrollend", domElement);
            break;
          case "onClick":
            null != value && (domElement.onclick = noop$1);
            break;
          case "suppressContentEditableWarning":
          case "suppressHydrationWarning":
          case "innerHTML":
          case "ref":
            break;
          case "innerText":
          case "textContent":
            break;
          default:
            if (!registrationNameDependencies.hasOwnProperty(key))
              a: {
                if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
                  "function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
                  domElement.addEventListener(tag, value, props);
                  break a;
                }
                key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
              }
        }
      }
      function setInitialProperties(domElement, tag, props) {
        switch (tag) {
          case "div":
          case "span":
          case "svg":
          case "path":
          case "a":
          case "g":
          case "p":
          case "li":
            break;
          case "img":
            listenToNonDelegatedEvent("error", domElement);
            listenToNonDelegatedEvent("load", domElement);
            var hasSrc = false, hasSrcSet = false, propKey;
            for (propKey in props)
              if (props.hasOwnProperty(propKey)) {
                var propValue = props[propKey];
                if (null != propValue)
                  switch (propKey) {
                    case "src":
                      hasSrc = true;
                      break;
                    case "srcSet":
                      hasSrcSet = true;
                      break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                      throw Error(formatProdErrorMessage(137, tag));
                    default:
                      setProp(domElement, tag, propKey, propValue, props, null);
                  }
              }
            hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
            hasSrc && setProp(domElement, tag, "src", props.src, props, null);
            return;
          case "input":
            listenToNonDelegatedEvent("invalid", domElement);
            var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
            for (hasSrc in props)
              if (props.hasOwnProperty(hasSrc)) {
                var propValue$184 = props[hasSrc];
                if (null != propValue$184)
                  switch (hasSrc) {
                    case "name":
                      hasSrcSet = propValue$184;
                      break;
                    case "type":
                      propValue = propValue$184;
                      break;
                    case "checked":
                      checked = propValue$184;
                      break;
                    case "defaultChecked":
                      defaultChecked = propValue$184;
                      break;
                    case "value":
                      propKey = propValue$184;
                      break;
                    case "defaultValue":
                      defaultValue = propValue$184;
                      break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                      if (null != propValue$184)
                        throw Error(formatProdErrorMessage(137, tag));
                      break;
                    default:
                      setProp(domElement, tag, hasSrc, propValue$184, props, null);
                  }
              }
            initInput(
              domElement,
              propKey,
              defaultValue,
              checked,
              defaultChecked,
              propValue,
              hasSrcSet,
              false
            );
            return;
          case "select":
            listenToNonDelegatedEvent("invalid", domElement);
            hasSrc = propValue = propKey = null;
            for (hasSrcSet in props)
              if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue))
                switch (hasSrcSet) {
                  case "value":
                    propKey = defaultValue;
                    break;
                  case "defaultValue":
                    propValue = defaultValue;
                    break;
                  case "multiple":
                    hasSrc = defaultValue;
                  default:
                    setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
                }
            tag = propKey;
            props = propValue;
            domElement.multiple = !!hasSrc;
            null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
            return;
          case "textarea":
            listenToNonDelegatedEvent("invalid", domElement);
            propKey = hasSrcSet = hasSrc = null;
            for (propValue in props)
              if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue))
                switch (propValue) {
                  case "value":
                    hasSrc = defaultValue;
                    break;
                  case "defaultValue":
                    hasSrcSet = defaultValue;
                    break;
                  case "children":
                    propKey = defaultValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    if (null != defaultValue) throw Error(formatProdErrorMessage(91));
                    break;
                  default:
                    setProp(domElement, tag, propValue, defaultValue, props, null);
                }
            initTextarea(domElement, hasSrc, hasSrcSet, propKey);
            return;
          case "option":
            for (checked in props)
              if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc))
                switch (checked) {
                  case "selected":
                    domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
                    break;
                  default:
                    setProp(domElement, tag, checked, hasSrc, props, null);
                }
            return;
          case "dialog":
            listenToNonDelegatedEvent("beforetoggle", domElement);
            listenToNonDelegatedEvent("toggle", domElement);
            listenToNonDelegatedEvent("cancel", domElement);
            listenToNonDelegatedEvent("close", domElement);
            break;
          case "iframe":
          case "object":
            listenToNonDelegatedEvent("load", domElement);
            break;
          case "video":
          case "audio":
            for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
              listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
            break;
          case "image":
            listenToNonDelegatedEvent("error", domElement);
            listenToNonDelegatedEvent("load", domElement);
            break;
          case "details":
            listenToNonDelegatedEvent("toggle", domElement);
            break;
          case "embed":
          case "source":
          case "link":
            listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
          case "area":
          case "base":
          case "br":
          case "col":
          case "hr":
          case "keygen":
          case "meta":
          case "param":
          case "track":
          case "wbr":
          case "menuitem":
            for (defaultChecked in props)
              if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc))
                switch (defaultChecked) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(formatProdErrorMessage(137, tag));
                  default:
                    setProp(domElement, tag, defaultChecked, hasSrc, props, null);
                }
            return;
          default:
            if (isCustomElement(tag)) {
              for (propValue$184 in props)
                props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(
                  domElement,
                  tag,
                  propValue$184,
                  hasSrc,
                  props,
                  void 0
                ));
              return;
            }
        }
        for (defaultValue in props)
          props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
      }
      function updateProperties(domElement, tag, lastProps, nextProps) {
        switch (tag) {
          case "div":
          case "span":
          case "svg":
          case "path":
          case "a":
          case "g":
          case "p":
          case "li":
            break;
          case "input":
            var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
            for (propKey in lastProps) {
              var lastProp = lastProps[propKey];
              if (lastProps.hasOwnProperty(propKey) && null != lastProp)
                switch (propKey) {
                  case "checked":
                    break;
                  case "value":
                    break;
                  case "defaultValue":
                    lastDefaultValue = lastProp;
                  default:
                    nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
                }
            }
            for (var propKey$201 in nextProps) {
              var propKey = nextProps[propKey$201];
              lastProp = lastProps[propKey$201];
              if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp))
                switch (propKey$201) {
                  case "type":
                    type = propKey;
                    break;
                  case "name":
                    name = propKey;
                    break;
                  case "checked":
                    checked = propKey;
                    break;
                  case "defaultChecked":
                    defaultChecked = propKey;
                    break;
                  case "value":
                    value = propKey;
                    break;
                  case "defaultValue":
                    defaultValue = propKey;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (null != propKey)
                      throw Error(formatProdErrorMessage(137, tag));
                    break;
                  default:
                    propKey !== lastProp && setProp(
                      domElement,
                      tag,
                      propKey$201,
                      propKey,
                      nextProps,
                      lastProp
                    );
                }
            }
            updateInput(
              domElement,
              value,
              defaultValue,
              lastDefaultValue,
              checked,
              defaultChecked,
              type,
              name
            );
            return;
          case "select":
            propKey = value = defaultValue = propKey$201 = null;
            for (type in lastProps)
              if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue)
                switch (type) {
                  case "value":
                    break;
                  case "multiple":
                    propKey = lastDefaultValue;
                  default:
                    nextProps.hasOwnProperty(type) || setProp(
                      domElement,
                      tag,
                      type,
                      null,
                      nextProps,
                      lastDefaultValue
                    );
                }
            for (name in nextProps)
              if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue))
                switch (name) {
                  case "value":
                    propKey$201 = type;
                    break;
                  case "defaultValue":
                    defaultValue = type;
                    break;
                  case "multiple":
                    value = type;
                  default:
                    type !== lastDefaultValue && setProp(
                      domElement,
                      tag,
                      name,
                      type,
                      nextProps,
                      lastDefaultValue
                    );
                }
            tag = defaultValue;
            lastProps = value;
            nextProps = propKey;
            null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
            return;
          case "textarea":
            propKey = propKey$201 = null;
            for (defaultValue in lastProps)
              if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue))
                switch (defaultValue) {
                  case "value":
                    break;
                  case "children":
                    break;
                  default:
                    setProp(domElement, tag, defaultValue, null, nextProps, name);
                }
            for (value in nextProps)
              if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type))
                switch (value) {
                  case "value":
                    propKey$201 = name;
                    break;
                  case "defaultValue":
                    propKey = name;
                    break;
                  case "children":
                    break;
                  case "dangerouslySetInnerHTML":
                    if (null != name) throw Error(formatProdErrorMessage(91));
                    break;
                  default:
                    name !== type && setProp(domElement, tag, value, name, nextProps, type);
                }
            updateTextarea(domElement, propKey$201, propKey);
            return;
          case "option":
            for (var propKey$217 in lastProps)
              if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217))
                switch (propKey$217) {
                  case "selected":
                    domElement.selected = false;
                    break;
                  default:
                    setProp(
                      domElement,
                      tag,
                      propKey$217,
                      null,
                      nextProps,
                      propKey$201
                    );
                }
            for (lastDefaultValue in nextProps)
              if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
                switch (lastDefaultValue) {
                  case "selected":
                    domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
                    break;
                  default:
                    setProp(
                      domElement,
                      tag,
                      lastDefaultValue,
                      propKey$201,
                      nextProps,
                      propKey
                    );
                }
            return;
          case "img":
          case "link":
          case "area":
          case "base":
          case "br":
          case "col":
          case "embed":
          case "hr":
          case "keygen":
          case "meta":
          case "param":
          case "source":
          case "track":
          case "wbr":
          case "menuitem":
            for (var propKey$222 in lastProps)
              propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
            for (checked in nextProps)
              if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
                switch (checked) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (null != propKey$201)
                      throw Error(formatProdErrorMessage(137, tag));
                    break;
                  default:
                    setProp(
                      domElement,
                      tag,
                      checked,
                      propKey$201,
                      nextProps,
                      propKey
                    );
                }
            return;
          default:
            if (isCustomElement(tag)) {
              for (var propKey$227 in lastProps)
                propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(
                  domElement,
                  tag,
                  propKey$227,
                  void 0,
                  nextProps,
                  propKey$201
                );
              for (defaultChecked in nextProps)
                propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(
                  domElement,
                  tag,
                  defaultChecked,
                  propKey$201,
                  nextProps,
                  propKey
                );
              return;
            }
        }
        for (var propKey$232 in lastProps)
          propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
        for (lastProp in nextProps)
          propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
      }
      function isLikelyStaticResource(initiatorType) {
        switch (initiatorType) {
          case "css":
          case "script":
          case "font":
          case "img":
          case "image":
          case "input":
          case "link":
            return true;
          default:
            return false;
        }
      }
      function estimateBandwidth() {
        if ("function" === typeof performance.getEntriesByType) {
          for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
            var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
            if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
              initiatorType = 0;
              duration = entry.responseEnd;
              for (i += 1; i < resourceEntries.length; i++) {
                var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
                if (overlapStartTime > duration) break;
                var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
                overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
              }
              --i;
              bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
              count++;
              if (10 < count) break;
            }
          }
          if (0 < count) return bits / count / 1e6;
        }
        return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
      }
      var eventsEnabled = null;
      var selectionInformation = null;
      function getOwnerDocumentFromRootContainer(rootContainerElement) {
        return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
      }
      function getOwnHostContext(namespaceURI) {
        switch (namespaceURI) {
          case "http://www.w3.org/2000/svg":
            return 1;
          case "http://www.w3.org/1998/Math/MathML":
            return 2;
          default:
            return 0;
        }
      }
      function getChildHostContextProd(parentNamespace, type) {
        if (0 === parentNamespace)
          switch (type) {
            case "svg":
              return 1;
            case "math":
              return 2;
            default:
              return 0;
          }
        return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
      }
      function shouldSetTextContent(type, props) {
        return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
      }
      var currentPopstateTransitionEvent = null;
      function shouldAttemptEagerTransition() {
        var event = window.event;
        if (event && "popstate" === event.type) {
          if (event === currentPopstateTransitionEvent) return false;
          currentPopstateTransitionEvent = event;
          return true;
        }
        currentPopstateTransitionEvent = null;
        return false;
      }
      var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0;
      var cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0;
      var localPromise = "function" === typeof Promise ? Promise : void 0;
      var scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
        return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
      } : scheduleTimeout;
      function handleErrorInNextTick(error) {
        setTimeout(function() {
          throw error;
        });
      }
      function isSingletonScope(type) {
        return "head" === type;
      }
      function clearHydrationBoundary(parentInstance, hydrationInstance) {
        var node = hydrationInstance, depth = 0;
        do {
          var nextNode = node.nextSibling;
          parentInstance.removeChild(node);
          if (nextNode && 8 === nextNode.nodeType)
            if (node = nextNode.data, "/$" === node || "/&" === node) {
              if (0 === depth) {
                parentInstance.removeChild(nextNode);
                retryIfBlockedOn(hydrationInstance);
                return;
              }
              depth--;
            } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node)
              depth++;
            else if ("html" === node)
              releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
            else if ("head" === node) {
              node = parentInstance.ownerDocument.head;
              releaseSingletonInstance(node);
              for (var node$jscomp$0 = node.firstChild; node$jscomp$0; ) {
                var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
                node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
                node$jscomp$0 = nextNode$jscomp$0;
              }
            } else
              "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
          node = nextNode;
        } while (node);
        retryIfBlockedOn(hydrationInstance);
      }
      function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
        var node = suspenseInstance;
        suspenseInstance = 0;
        do {
          var nextNode = node.nextSibling;
          1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
          if (nextNode && 8 === nextNode.nodeType)
            if (node = nextNode.data, "/$" === node)
              if (0 === suspenseInstance) break;
              else suspenseInstance--;
            else
              "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
          node = nextNode;
        } while (node);
      }
      function clearContainerSparingly(container) {
        var nextNode = container.firstChild;
        nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
        for (; nextNode; ) {
          var node = nextNode;
          nextNode = nextNode.nextSibling;
          switch (node.nodeName) {
            case "HTML":
            case "HEAD":
            case "BODY":
              clearContainerSparingly(node);
              detachDeletedInstance(node);
              continue;
            case "SCRIPT":
            case "STYLE":
              continue;
            case "LINK":
              if ("stylesheet" === node.rel.toLowerCase()) continue;
          }
          container.removeChild(node);
        }
      }
      function canHydrateInstance(instance, type, props, inRootOrSingleton) {
        for (; 1 === instance.nodeType; ) {
          var anyProps = props;
          if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
            if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type))
              break;
          } else if (!inRootOrSingleton)
            if ("input" === type && "hidden" === instance.type) {
              var name = null == anyProps.name ? null : "" + anyProps.name;
              if ("hidden" === anyProps.type && instance.getAttribute("name") === name)
                return instance;
            } else return instance;
          else if (!instance[internalHoistableMarker])
            switch (type) {
              case "meta":
                if (!instance.hasAttribute("itemprop")) break;
                return instance;
              case "link":
                name = instance.getAttribute("rel");
                if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
                  break;
                else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title))
                  break;
                return instance;
              case "style":
                if (instance.hasAttribute("data-precedence")) break;
                return instance;
              case "script":
                name = instance.getAttribute("src");
                if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop"))
                  break;
                return instance;
              default:
                return instance;
            }
          instance = getNextHydratable(instance.nextSibling);
          if (null === instance) break;
        }
        return null;
      }
      function canHydrateTextInstance(instance, text, inRootOrSingleton) {
        if ("" === text) return null;
        for (; 3 !== instance.nodeType; ) {
          if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
            return null;
          instance = getNextHydratable(instance.nextSibling);
          if (null === instance) return null;
        }
        return instance;
      }
      function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
        for (; 8 !== instance.nodeType; ) {
          if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
            return null;
          instance = getNextHydratable(instance.nextSibling);
          if (null === instance) return null;
        }
        return instance;
      }
      function isSuspenseInstancePending(instance) {
        return "$?" === instance.data || "$~" === instance.data;
      }
      function isSuspenseInstanceFallback(instance) {
        return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
      }
      function registerSuspenseInstanceRetry(instance, callback) {
        var ownerDocument = instance.ownerDocument;
        if ("$~" === instance.data) instance._reactRetry = callback;
        else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState)
          callback();
        else {
          var listener = function() {
            callback();
            ownerDocument.removeEventListener("DOMContentLoaded", listener);
          };
          ownerDocument.addEventListener("DOMContentLoaded", listener);
          instance._reactRetry = listener;
        }
      }
      function getNextHydratable(node) {
        for (; null != node; node = node.nextSibling) {
          var nodeType = node.nodeType;
          if (1 === nodeType || 3 === nodeType) break;
          if (8 === nodeType) {
            nodeType = node.data;
            if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType)
              break;
            if ("/$" === nodeType || "/&" === nodeType) return null;
          }
        }
        return node;
      }
      var previousHydratableOnEnteringScopedSingleton = null;
      function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
        hydrationInstance = hydrationInstance.nextSibling;
        for (var depth = 0; hydrationInstance; ) {
          if (8 === hydrationInstance.nodeType) {
            var data = hydrationInstance.data;
            if ("/$" === data || "/&" === data) {
              if (0 === depth)
                return getNextHydratable(hydrationInstance.nextSibling);
              depth--;
            } else
              "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
          }
          hydrationInstance = hydrationInstance.nextSibling;
        }
        return null;
      }
      function getParentHydrationBoundary(targetInstance) {
        targetInstance = targetInstance.previousSibling;
        for (var depth = 0; targetInstance; ) {
          if (8 === targetInstance.nodeType) {
            var data = targetInstance.data;
            if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
              if (0 === depth) return targetInstance;
              depth--;
            } else "/$" !== data && "/&" !== data || depth++;
          }
          targetInstance = targetInstance.previousSibling;
        }
        return null;
      }
      function resolveSingletonInstance(type, props, rootContainerInstance) {
        props = getOwnerDocumentFromRootContainer(rootContainerInstance);
        switch (type) {
          case "html":
            type = props.documentElement;
            if (!type) throw Error(formatProdErrorMessage(452));
            return type;
          case "head":
            type = props.head;
            if (!type) throw Error(formatProdErrorMessage(453));
            return type;
          case "body":
            type = props.body;
            if (!type) throw Error(formatProdErrorMessage(454));
            return type;
          default:
            throw Error(formatProdErrorMessage(451));
        }
      }
      function releaseSingletonInstance(instance) {
        for (var attributes = instance.attributes; attributes.length; )
          instance.removeAttributeNode(attributes[0]);
        detachDeletedInstance(instance);
      }
      var preloadPropsMap = /* @__PURE__ */ new Map();
      var preconnectsSet = /* @__PURE__ */ new Set();
      function getHoistableRoot(container) {
        return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
      }
      var previousDispatcher = ReactDOMSharedInternals.d;
      ReactDOMSharedInternals.d = {
        f: flushSyncWork,
        r: requestFormReset,
        D: prefetchDNS,
        C: preconnect,
        L: preload,
        m: preloadModule,
        X: preinitScript,
        S: preinitStyle,
        M: preinitModuleScript
      };
      function flushSyncWork() {
        var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
        return previousWasRendering || wasRendering;
      }
      function requestFormReset(form) {
        var formInst = getInstanceFromNode(form);
        null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
      }
      var globalDocument = "undefined" === typeof document ? null : document;
      function preconnectAs(rel, href, crossOrigin) {
        var ownerDocument = globalDocument;
        if (ownerDocument && "string" === typeof href && href) {
          var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
          limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
          "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
          preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = { rel, crossOrigin, href }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
        }
      }
      function prefetchDNS(href) {
        previousDispatcher.D(href);
        preconnectAs("dns-prefetch", href, null);
      }
      function preconnect(href, crossOrigin) {
        previousDispatcher.C(href, crossOrigin);
        preconnectAs("preconnect", href, crossOrigin);
      }
      function preload(href, as, options2) {
        previousDispatcher.L(href, as, options2);
        var ownerDocument = globalDocument;
        if (ownerDocument && href && as) {
          var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
          "image" === as ? options2 && options2.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(
            options2.imageSrcSet
          ) + '"]', "string" === typeof options2.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(
            options2.imageSizes
          ) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
          var key = preloadSelector;
          switch (as) {
            case "style":
              key = getStyleKey(href);
              break;
            case "script":
              key = getScriptKey(href);
          }
          preloadPropsMap.has(key) || (href = assign(
            {
              rel: "preload",
              href: "image" === as && options2 && options2.imageSrcSet ? void 0 : href,
              as
            },
            options2
          ), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
        }
      }
      function preloadModule(href, options2) {
        previousDispatcher.m(href, options2);
        var ownerDocument = globalDocument;
        if (ownerDocument && href) {
          var as = options2 && "string" === typeof options2.as ? options2.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
          switch (as) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              key = getScriptKey(href);
          }
          if (!preloadPropsMap.has(key) && (href = assign({ rel: "modulepreload", href }, options2), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
            switch (as) {
              case "audioworklet":
              case "paintworklet":
              case "serviceworker":
              case "sharedworker":
              case "worker":
              case "script":
                if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
                  return;
            }
            as = ownerDocument.createElement("link");
            setInitialProperties(as, "link", href);
            markNodeAsHoistable(as);
            ownerDocument.head.appendChild(as);
          }
        }
      }
      function preinitStyle(href, precedence, options2) {
        previousDispatcher.S(href, precedence, options2);
        var ownerDocument = globalDocument;
        if (ownerDocument && href) {
          var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
          precedence = precedence || "default";
          var resource = styles.get(key);
          if (!resource) {
            var state = { loading: 0, preload: null };
            if (resource = ownerDocument.querySelector(
              getStylesheetSelectorFromKey(key)
            ))
              state.loading = 5;
            else {
              href = assign(
                { rel: "stylesheet", href, "data-precedence": precedence },
                options2
              );
              (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options2);
              var link = resource = ownerDocument.createElement("link");
              markNodeAsHoistable(link);
              setInitialProperties(link, "link", href);
              link._p = new Promise(function(resolve, reject) {
                link.onload = resolve;
                link.onerror = reject;
              });
              link.addEventListener("load", function() {
                state.loading |= 1;
              });
              link.addEventListener("error", function() {
                state.loading |= 2;
              });
              state.loading |= 4;
              insertStylesheet(resource, precedence, ownerDocument);
            }
            resource = {
              type: "stylesheet",
              instance: resource,
              count: 1,
              state
            };
            styles.set(key, resource);
          }
        }
      }
      function preinitScript(src, options2) {
        previousDispatcher.X(src, options2);
        var ownerDocument = globalDocument;
        if (ownerDocument && src) {
          var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
          resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
            type: "script",
            instance: resource,
            count: 1,
            state: null
          }, scripts.set(key, resource));
        }
      }
      function preinitModuleScript(src, options2) {
        previousDispatcher.M(src, options2);
        var ownerDocument = globalDocument;
        if (ownerDocument && src) {
          var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
          resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true, type: "module" }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
            type: "script",
            instance: resource,
            count: 1,
            state: null
          }, scripts.set(key, resource));
        }
      }
      function getResource(type, currentProps, pendingProps, currentResource) {
        var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
        if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
        switch (type) {
          case "meta":
          case "title":
            return null;
          case "style":
            return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(
              JSCompiler_inline_result
            ).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
              type: "style",
              instance: null,
              count: 0,
              state: null
            }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
          case "link":
            if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
              type = getStyleKey(pendingProps.href);
              var styles$243 = getResourcesFromRoot(
                JSCompiler_inline_result
              ).hoistableStyles, resource$244 = styles$243.get(type);
              resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null }
              }, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(
                getStylesheetSelectorFromKey(type)
              )) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
                rel: "preload",
                as: "style",
                href: pendingProps.href,
                crossOrigin: pendingProps.crossOrigin,
                integrity: pendingProps.integrity,
                media: pendingProps.media,
                hrefLang: pendingProps.hrefLang,
                referrerPolicy: pendingProps.referrerPolicy
              }, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(
                JSCompiler_inline_result,
                type,
                pendingProps,
                resource$244.state
              )));
              if (currentProps && null === currentResource)
                throw Error(formatProdErrorMessage(528, ""));
              return resource$244;
            }
            if (currentProps && null !== currentResource)
              throw Error(formatProdErrorMessage(529, ""));
            return null;
          case "script":
            return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(
              JSCompiler_inline_result
            ).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
              type: "script",
              instance: null,
              count: 0,
              state: null
            }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
          default:
            throw Error(formatProdErrorMessage(444, type));
        }
      }
      function getStyleKey(href) {
        return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
      }
      function getStylesheetSelectorFromKey(key) {
        return 'link[rel="stylesheet"][' + key + "]";
      }
      function stylesheetPropsFromRawProps(rawProps) {
        return assign({}, rawProps, {
          "data-precedence": rawProps.precedence,
          precedence: null
        });
      }
      function preloadStylesheet(ownerDocument, key, preloadProps, state) {
        ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
          return state.loading |= 1;
        }), key.addEventListener("error", function() {
          return state.loading |= 2;
        }), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
      }
      function getScriptKey(src) {
        return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
      }
      function getScriptSelectorFromKey(key) {
        return "script[async]" + key;
      }
      function acquireResource(hoistableRoot, resource, props) {
        resource.count++;
        if (null === resource.instance)
          switch (resource.type) {
            case "style":
              var instance = hoistableRoot.querySelector(
                'style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]'
              );
              if (instance)
                return resource.instance = instance, markNodeAsHoistable(instance), instance;
              var styleProps = assign({}, props, {
                "data-href": props.href,
                "data-precedence": props.precedence,
                href: null,
                precedence: null
              });
              instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement(
                "style"
              );
              markNodeAsHoistable(instance);
              setInitialProperties(instance, "style", styleProps);
              insertStylesheet(instance, props.precedence, hoistableRoot);
              return resource.instance = instance;
            case "stylesheet":
              styleProps = getStyleKey(props.href);
              var instance$249 = hoistableRoot.querySelector(
                getStylesheetSelectorFromKey(styleProps)
              );
              if (instance$249)
                return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
              instance = stylesheetPropsFromRawProps(props);
              (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
              instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
              markNodeAsHoistable(instance$249);
              var linkInstance = instance$249;
              linkInstance._p = new Promise(function(resolve, reject) {
                linkInstance.onload = resolve;
                linkInstance.onerror = reject;
              });
              setInitialProperties(instance$249, "link", instance);
              resource.state.loading |= 4;
              insertStylesheet(instance$249, props.precedence, hoistableRoot);
              return resource.instance = instance$249;
            case "script":
              instance$249 = getScriptKey(props.src);
              if (styleProps = hoistableRoot.querySelector(
                getScriptSelectorFromKey(instance$249)
              ))
                return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
              instance = props;
              if (styleProps = preloadPropsMap.get(instance$249))
                instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
              hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
              styleProps = hoistableRoot.createElement("script");
              markNodeAsHoistable(styleProps);
              setInitialProperties(styleProps, "link", instance);
              hoistableRoot.head.appendChild(styleProps);
              return resource.instance = styleProps;
            case "void":
              return null;
            default:
              throw Error(formatProdErrorMessage(443, resource.type));
          }
        else
          "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
        return resource.instance;
      }
      function insertStylesheet(instance, precedence, root2) {
        for (var nodes = root2.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]'
        ), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if (node.dataset.precedence === precedence) prior = node;
          else if (prior !== last) break;
        }
        prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root2.nodeType ? root2.head : root2, precedence.insertBefore(instance, precedence.firstChild));
      }
      function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
        null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
        null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
        null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
      }
      function adoptPreloadPropsForScript(scriptProps, preloadProps) {
        null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
        null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
        null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
      }
      var tagCaches = null;
      function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
        if (null === tagCaches) {
          var cache = /* @__PURE__ */ new Map();
          var caches = tagCaches = /* @__PURE__ */ new Map();
          caches.set(ownerDocument, cache);
        } else
          caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = /* @__PURE__ */ new Map(), caches.set(ownerDocument, cache));
        if (cache.has(type)) return cache;
        cache.set(type, null);
        ownerDocument = ownerDocument.getElementsByTagName(type);
        for (caches = 0; caches < ownerDocument.length; caches++) {
          var node = ownerDocument[caches];
          if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
            var nodeKey = node.getAttribute(keyAttribute) || "";
            nodeKey = type + nodeKey;
            var existing = cache.get(nodeKey);
            existing ? existing.push(node) : cache.set(nodeKey, [node]);
          }
        }
        return cache;
      }
      function mountHoistable(hoistableRoot, type, instance) {
        hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
        hoistableRoot.head.insertBefore(
          instance,
          "title" === type ? hoistableRoot.querySelector("head > title") : null
        );
      }
      function isHostHoistableType(type, props, hostContext) {
        if (1 === hostContext || null != props.itemProp) return false;
        switch (type) {
          case "meta":
          case "title":
            return true;
          case "style":
            if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href)
              break;
            return true;
          case "link":
            if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError)
              break;
            switch (props.rel) {
              case "stylesheet":
                return type = props.disabled, "string" === typeof props.precedence && null == type;
              default:
                return true;
            }
          case "script":
            if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src)
              return true;
        }
        return false;
      }
      function preloadResource(resource) {
        return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
      }
      function suspendResource(state, hoistableRoot, resource, props) {
        if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
          if (null === resource.instance) {
            var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(
              getStylesheetSelectorFromKey(key)
            );
            if (instance) {
              hoistableRoot = instance._p;
              null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
              resource.state.loading |= 4;
              resource.instance = instance;
              markNodeAsHoistable(instance);
              return;
            }
            instance = hoistableRoot.ownerDocument || hoistableRoot;
            props = stylesheetPropsFromRawProps(props);
            (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
            instance = instance.createElement("link");
            markNodeAsHoistable(instance);
            var linkInstance = instance;
            linkInstance._p = new Promise(function(resolve, reject) {
              linkInstance.onload = resolve;
              linkInstance.onerror = reject;
            });
            setInitialProperties(instance, "link", props);
            resource.instance = instance;
          }
          null === state.stylesheets && (state.stylesheets = /* @__PURE__ */ new Map());
          state.stylesheets.set(resource, hoistableRoot);
          (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
        }
      }
      var estimatedBytesWithinLimit = 0;
      function waitForCommitToBeReady(state, timeoutOffset) {
        state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
        return 0 < state.count || 0 < state.imgCount ? function(commit) {
          var stylesheetTimer = setTimeout(function() {
            state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
            if (state.unsuspend) {
              var unsuspend = state.unsuspend;
              state.unsuspend = null;
              unsuspend();
            }
          }, 6e4 + timeoutOffset);
          0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
          var imgTimer = setTimeout(
            function() {
              state.waitingForImages = false;
              if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
                var unsuspend = state.unsuspend;
                state.unsuspend = null;
                unsuspend();
              }
            },
            (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset
          );
          state.unsuspend = commit;
          return function() {
            state.unsuspend = null;
            clearTimeout(stylesheetTimer);
            clearTimeout(imgTimer);
          };
        } : null;
      }
      function onUnsuspend() {
        this.count--;
        if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
          if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
          else if (this.unsuspend) {
            var unsuspend = this.unsuspend;
            this.unsuspend = null;
            unsuspend();
          }
        }
      }
      var precedencesByRoot = null;
      function insertSuspendedStylesheets(state, resources) {
        state.stylesheets = null;
        null !== state.unsuspend && (state.count++, precedencesByRoot = /* @__PURE__ */ new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
      }
      function insertStylesheetIntoRoot(root2, resource) {
        if (!(resource.state.loading & 4)) {
          var precedences = precedencesByRoot.get(root2);
          if (precedences) var last = precedences.get(null);
          else {
            precedences = /* @__PURE__ */ new Map();
            precedencesByRoot.set(root2, precedences);
            for (var nodes = root2.querySelectorAll(
              "link[data-precedence],style[data-precedence]"
            ), i = 0; i < nodes.length; i++) {
              var node = nodes[i];
              if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media"))
                precedences.set(node.dataset.precedence, node), last = node;
            }
            last && precedences.set(null, last);
          }
          nodes = resource.instance;
          node = nodes.getAttribute("data-precedence");
          i = precedences.get(node) || last;
          i === last && precedences.set(null, nodes);
          precedences.set(node, nodes);
          this.count++;
          last = onUnsuspend.bind(this);
          nodes.addEventListener("load", last);
          nodes.addEventListener("error", last);
          i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root2 = 9 === root2.nodeType ? root2.head : root2, root2.insertBefore(nodes, root2.firstChild));
          resource.state.loading |= 4;
        }
      }
      var HostTransitionContext = {
        $$typeof: REACT_CONTEXT_TYPE,
        Provider: null,
        Consumer: null,
        _currentValue: sharedNotPendingObject,
        _currentValue2: sharedNotPendingObject,
        _threadCount: 0
      };
      function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
        this.tag = 1;
        this.containerInfo = containerInfo;
        this.pingCache = this.current = this.pendingChildren = null;
        this.timeoutHandle = -1;
        this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
        this.callbackPriority = 0;
        this.expirationTimes = createLaneMap(-1);
        this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
        this.entanglements = createLaneMap(0);
        this.hiddenUpdates = createLaneMap(null);
        this.identifierPrefix = identifierPrefix;
        this.onUncaughtError = onUncaughtError;
        this.onCaughtError = onCaughtError;
        this.onRecoverableError = onRecoverableError;
        this.pooledCache = null;
        this.pooledCacheLanes = 0;
        this.formState = formState;
        this.incompleteTransitions = /* @__PURE__ */ new Map();
      }
      function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
        containerInfo = new FiberRootNode(
          containerInfo,
          tag,
          hydrate,
          identifierPrefix,
          onUncaughtError,
          onCaughtError,
          onRecoverableError,
          onDefaultTransitionIndicator,
          formState
        );
        tag = 1;
        true === isStrictMode && (tag |= 24);
        isStrictMode = createFiberImplClass(3, null, null, tag);
        containerInfo.current = isStrictMode;
        isStrictMode.stateNode = containerInfo;
        tag = createCache();
        tag.refCount++;
        containerInfo.pooledCache = tag;
        tag.refCount++;
        isStrictMode.memoizedState = {
          element: initialChildren,
          isDehydrated: hydrate,
          cache: tag
        };
        initializeUpdateQueue(isStrictMode);
        return containerInfo;
      }
      function getContextForSubtree(parentComponent) {
        if (!parentComponent) return emptyContextObject;
        parentComponent = emptyContextObject;
        return parentComponent;
      }
      function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
        parentComponent = getContextForSubtree(parentComponent);
        null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
        container = createUpdate(lane);
        container.payload = { element };
        callback = void 0 === callback ? null : callback;
        null !== callback && (container.callback = callback);
        element = enqueueUpdate(rootFiber, container, lane);
        null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
      }
      function markRetryLaneImpl(fiber, retryLane) {
        fiber = fiber.memoizedState;
        if (null !== fiber && null !== fiber.dehydrated) {
          var a = fiber.retryLane;
          fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
        }
      }
      function markRetryLaneIfNotHydrated(fiber, retryLane) {
        markRetryLaneImpl(fiber, retryLane);
        (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
      }
      function attemptContinuousHydration(fiber) {
        if (13 === fiber.tag || 31 === fiber.tag) {
          var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
          null !== root2 && scheduleUpdateOnFiber(root2, fiber, 67108864);
          markRetryLaneIfNotHydrated(fiber, 67108864);
        }
      }
      function attemptHydrationAtCurrentPriority(fiber) {
        if (13 === fiber.tag || 31 === fiber.tag) {
          var lane = requestUpdateLane();
          lane = getBumpedLaneForHydrationByLane(lane);
          var root2 = enqueueConcurrentRenderForLane(fiber, lane);
          null !== root2 && scheduleUpdateOnFiber(root2, fiber, lane);
          markRetryLaneIfNotHydrated(fiber, lane);
        }
      }
      var _enabled = true;
      function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
        var prevTransition = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        try {
          ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
        } finally {
          ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
        }
      }
      function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
        var prevTransition = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        try {
          ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
        } finally {
          ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
        }
      }
      function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        if (_enabled) {
          var blockedOn = findInstanceBlockingEvent(nativeEvent);
          if (null === blockedOn)
            dispatchEventForPluginEventSystem(
              domEventName,
              eventSystemFlags,
              nativeEvent,
              return_targetInst,
              targetContainer
            ), clearIfContinuousEvent(domEventName, nativeEvent);
          else if (queueIfContinuousEvent(
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          ))
            nativeEvent.stopPropagation();
          else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
            for (; null !== blockedOn; ) {
              var fiber = getInstanceFromNode(blockedOn);
              if (null !== fiber)
                switch (fiber.tag) {
                  case 3:
                    fiber = fiber.stateNode;
                    if (fiber.current.memoizedState.isDehydrated) {
                      var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                      if (0 !== lanes) {
                        var root2 = fiber;
                        root2.pendingLanes |= 2;
                        for (root2.entangledLanes |= 2; lanes; ) {
                          var lane = 1 << 31 - clz32(lanes);
                          root2.entanglements[1] |= lane;
                          lanes &= ~lane;
                        }
                        ensureRootIsScheduled(fiber);
                        0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0, false));
                      }
                    }
                    break;
                  case 31:
                  case 13:
                    root2 = enqueueConcurrentRenderForLane(fiber, 2), null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
                }
              fiber = findInstanceBlockingEvent(nativeEvent);
              null === fiber && dispatchEventForPluginEventSystem(
                domEventName,
                eventSystemFlags,
                nativeEvent,
                return_targetInst,
                targetContainer
              );
              if (fiber === blockedOn) break;
              blockedOn = fiber;
            }
            null !== blockedOn && nativeEvent.stopPropagation();
          } else
            dispatchEventForPluginEventSystem(
              domEventName,
              eventSystemFlags,
              nativeEvent,
              null,
              targetContainer
            );
        }
      }
      function findInstanceBlockingEvent(nativeEvent) {
        nativeEvent = getEventTarget(nativeEvent);
        return findInstanceBlockingTarget(nativeEvent);
      }
      var return_targetInst = null;
      function findInstanceBlockingTarget(targetNode) {
        return_targetInst = null;
        targetNode = getClosestInstanceFromNode(targetNode);
        if (null !== targetNode) {
          var nearestMounted = getNearestMountedFiber(targetNode);
          if (null === nearestMounted) targetNode = null;
          else {
            var tag = nearestMounted.tag;
            if (13 === tag) {
              targetNode = getSuspenseInstanceFromFiber(nearestMounted);
              if (null !== targetNode) return targetNode;
              targetNode = null;
            } else if (31 === tag) {
              targetNode = getActivityInstanceFromFiber(nearestMounted);
              if (null !== targetNode) return targetNode;
              targetNode = null;
            } else if (3 === tag) {
              if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
                return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
              targetNode = null;
            } else nearestMounted !== targetNode && (targetNode = null);
          }
        }
        return_targetInst = targetNode;
        return null;
      }
      function getEventPriority(domEventName) {
        switch (domEventName) {
          case "beforetoggle":
          case "cancel":
          case "click":
          case "close":
          case "contextmenu":
          case "copy":
          case "cut":
          case "auxclick":
          case "dblclick":
          case "dragend":
          case "dragstart":
          case "drop":
          case "focusin":
          case "focusout":
          case "input":
          case "invalid":
          case "keydown":
          case "keypress":
          case "keyup":
          case "mousedown":
          case "mouseup":
          case "paste":
          case "pause":
          case "play":
          case "pointercancel":
          case "pointerdown":
          case "pointerup":
          case "ratechange":
          case "reset":
          case "resize":
          case "seeked":
          case "submit":
          case "toggle":
          case "touchcancel":
          case "touchend":
          case "touchstart":
          case "volumechange":
          case "change":
          case "selectionchange":
          case "textInput":
          case "compositionstart":
          case "compositionend":
          case "compositionupdate":
          case "beforeblur":
          case "afterblur":
          case "beforeinput":
          case "blur":
          case "fullscreenchange":
          case "focus":
          case "hashchange":
          case "popstate":
          case "select":
          case "selectstart":
            return 2;
          case "drag":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "mousemove":
          case "mouseout":
          case "mouseover":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "scroll":
          case "touchmove":
          case "wheel":
          case "mouseenter":
          case "mouseleave":
          case "pointerenter":
          case "pointerleave":
            return 8;
          case "message":
            switch (getCurrentPriorityLevel()) {
              case ImmediatePriority:
                return 2;
              case UserBlockingPriority:
                return 8;
              case NormalPriority$1:
              case LowPriority:
                return 32;
              case IdlePriority:
                return 268435456;
              default:
                return 32;
            }
          default:
            return 32;
        }
      }
      var hasScheduledReplayAttempt = false;
      var queuedFocus = null;
      var queuedDrag = null;
      var queuedMouse = null;
      var queuedPointers = /* @__PURE__ */ new Map();
      var queuedPointerCaptures = /* @__PURE__ */ new Map();
      var queuedExplicitHydrationTargets = [];
      var discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " "
      );
      function clearIfContinuousEvent(domEventName, nativeEvent) {
        switch (domEventName) {
          case "focusin":
          case "focusout":
            queuedFocus = null;
            break;
          case "dragenter":
          case "dragleave":
            queuedDrag = null;
            break;
          case "mouseover":
          case "mouseout":
            queuedMouse = null;
            break;
          case "pointerover":
          case "pointerout":
            queuedPointers.delete(nativeEvent.pointerId);
            break;
          case "gotpointercapture":
          case "lostpointercapture":
            queuedPointerCaptures.delete(nativeEvent.pointerId);
        }
      }
      function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent)
          return existingQueuedEvent = {
            blockedOn,
            domEventName,
            eventSystemFlags,
            nativeEvent,
            targetContainers: [targetContainer]
          }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
        existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
        blockedOn = existingQueuedEvent.targetContainers;
        null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
        return existingQueuedEvent;
      }
      function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        switch (domEventName) {
          case "focusin":
            return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedFocus,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              nativeEvent
            ), true;
          case "dragenter":
            return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedDrag,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              nativeEvent
            ), true;
          case "mouseover":
            return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
              queuedMouse,
              blockedOn,
              domEventName,
              eventSystemFlags,
              targetContainer,
              nativeEvent
            ), true;
          case "pointerover":
            var pointerId = nativeEvent.pointerId;
            queuedPointers.set(
              pointerId,
              accumulateOrCreateContinuousQueuedReplayableEvent(
                queuedPointers.get(pointerId) || null,
                blockedOn,
                domEventName,
                eventSystemFlags,
                targetContainer,
                nativeEvent
              )
            );
            return true;
          case "gotpointercapture":
            return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(
              pointerId,
              accumulateOrCreateContinuousQueuedReplayableEvent(
                queuedPointerCaptures.get(pointerId) || null,
                blockedOn,
                domEventName,
                eventSystemFlags,
                targetContainer,
                nativeEvent
              )
            ), true;
        }
        return false;
      }
      function attemptExplicitHydrationTarget(queuedTarget) {
        var targetInst = getClosestInstanceFromNode(queuedTarget.target);
        if (null !== targetInst) {
          var nearestMounted = getNearestMountedFiber(targetInst);
          if (null !== nearestMounted) {
            if (targetInst = nearestMounted.tag, 13 === targetInst) {
              if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
                queuedTarget.blockedOn = targetInst;
                runWithPriority(queuedTarget.priority, function() {
                  attemptHydrationAtCurrentPriority(nearestMounted);
                });
                return;
              }
            } else if (31 === targetInst) {
              if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
                queuedTarget.blockedOn = targetInst;
                runWithPriority(queuedTarget.priority, function() {
                  attemptHydrationAtCurrentPriority(nearestMounted);
                });
                return;
              }
            } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
              queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
              return;
            }
          }
        }
        queuedTarget.blockedOn = null;
      }
      function attemptReplayContinuousQueuedEvent(queuedEvent) {
        if (null !== queuedEvent.blockedOn) return false;
        for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length; ) {
          var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
          if (null === nextBlockedOn) {
            nextBlockedOn = queuedEvent.nativeEvent;
            var nativeEventClone = new nextBlockedOn.constructor(
              nextBlockedOn.type,
              nextBlockedOn
            );
            currentReplayingEvent = nativeEventClone;
            nextBlockedOn.target.dispatchEvent(nativeEventClone);
            currentReplayingEvent = null;
          } else
            return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
          targetContainers.shift();
        }
        return true;
      }
      function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
        attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
      }
      function replayUnblockedEvents() {
        hasScheduledReplayAttempt = false;
        null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
        null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
        null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
        queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
        queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
      }
      function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
        queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.unstable_scheduleCallback(
          Scheduler.unstable_NormalPriority,
          replayUnblockedEvents
        )));
      }
      var lastScheduledReplayQueue = null;
      function scheduleReplayQueueIfNeeded(formReplayingQueue) {
        lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(
          Scheduler.unstable_NormalPriority,
          function() {
            lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
            for (var i = 0; i < formReplayingQueue.length; i += 3) {
              var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
              if ("function" !== typeof submitterOrAction)
                if (null === findInstanceBlockingTarget(submitterOrAction || form))
                  continue;
                else break;
              var formInst = getInstanceFromNode(form);
              null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(
                formInst,
                {
                  pending: true,
                  data: formData,
                  method: form.method,
                  action: submitterOrAction
                },
                submitterOrAction,
                formData
              ));
            }
          }
        ));
      }
      function retryIfBlockedOn(unblocked) {
        function unblock(queuedEvent) {
          return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
        }
        null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
        null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
        null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
        queuedPointers.forEach(unblock);
        queuedPointerCaptures.forEach(unblock);
        for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
          var queuedTarget = queuedExplicitHydrationTargets[i];
          queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
        }
        for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn); )
          attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
        i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
        if (null != i)
          for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
            var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
            if ("function" === typeof submitterOrAction)
              formProps || scheduleReplayQueueIfNeeded(i);
            else if (formProps) {
              var action = null;
              if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
                if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null)
                  action = formProps.formAction;
                else {
                  if (null !== findInstanceBlockingTarget(form)) continue;
                }
              else action = formProps.action;
              "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
              scheduleReplayQueueIfNeeded(i);
            }
          }
      }
      function defaultOnDefaultTransitionIndicator() {
        function handleNavigate(event) {
          event.canIntercept && "react-transition" === event.info && event.intercept({
            handler: function() {
              return new Promise(function(resolve) {
                return pendingResolve = resolve;
              });
            },
            focusReset: "manual",
            scroll: "manual"
          });
        }
        function handleNavigateComplete() {
          null !== pendingResolve && (pendingResolve(), pendingResolve = null);
          isCancelled || setTimeout(startFakeNavigation, 20);
        }
        function startFakeNavigation() {
          if (!isCancelled && !navigation.transition) {
            var currentEntry = navigation.currentEntry;
            currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
              state: currentEntry.getState(),
              info: "react-transition",
              history: "replace"
            });
          }
        }
        if ("object" === typeof navigation) {
          var isCancelled = false, pendingResolve = null;
          navigation.addEventListener("navigate", handleNavigate);
          navigation.addEventListener("navigatesuccess", handleNavigateComplete);
          navigation.addEventListener("navigateerror", handleNavigateComplete);
          setTimeout(startFakeNavigation, 100);
          return function() {
            isCancelled = true;
            navigation.removeEventListener("navigate", handleNavigate);
            navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
            navigation.removeEventListener("navigateerror", handleNavigateComplete);
            null !== pendingResolve && (pendingResolve(), pendingResolve = null);
          };
        }
      }
      function ReactDOMRoot(internalRoot) {
        this._internalRoot = internalRoot;
      }
      ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
        var root2 = this._internalRoot;
        if (null === root2) throw Error(formatProdErrorMessage(409));
        var current = root2.current, lane = requestUpdateLane();
        updateContainerImpl(current, lane, children, root2, null, null);
      };
      ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
        var root2 = this._internalRoot;
        if (null !== root2) {
          this._internalRoot = null;
          var container = root2.containerInfo;
          updateContainerImpl(root2.current, 2, null, root2, null, null);
          flushSyncWork$1();
          container[internalContainerInstanceKey] = null;
        }
      };
      function ReactDOMHydrationRoot(internalRoot) {
        this._internalRoot = internalRoot;
      }
      ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
        if (target) {
          var updatePriority = resolveUpdatePriority();
          target = { blockedOn: null, target, priority: updatePriority };
          for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++) ;
          queuedExplicitHydrationTargets.splice(i, 0, target);
          0 === i && attemptExplicitHydrationTarget(target);
        }
      };
      var isomorphicReactPackageVersion$jscomp$inline_1840 = React.version;
      if ("19.2.4" !== isomorphicReactPackageVersion$jscomp$inline_1840)
        throw Error(
          formatProdErrorMessage(
            527,
            isomorphicReactPackageVersion$jscomp$inline_1840,
            "19.2.4"
          )
        );
      ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
        var fiber = componentOrElement._reactInternals;
        if (void 0 === fiber) {
          if ("function" === typeof componentOrElement.render)
            throw Error(formatProdErrorMessage(188));
          componentOrElement = Object.keys(componentOrElement).join(",");
          throw Error(formatProdErrorMessage(268, componentOrElement));
        }
        componentOrElement = findCurrentFiberUsingSlowPath(fiber);
        componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
        componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
        return componentOrElement;
      };
      var internals$jscomp$inline_2347 = {
        bundleType: 0,
        version: "19.2.4",
        rendererPackageName: "react-dom",
        currentDispatcherRef: ReactSharedInternals,
        reconcilerVersion: "19.2.4"
      };
      if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
        hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber)
          try {
            rendererID = hook$jscomp$inline_2348.inject(
              internals$jscomp$inline_2347
            ), injectedHook = hook$jscomp$inline_2348;
          } catch (err) {
          }
      }
      var hook$jscomp$inline_2348;
      exports.createRoot = function(container, options2) {
        if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
        var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
        null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError));
        options2 = createFiberRoot(
          container,
          1,
          false,
          null,
          null,
          isStrictMode,
          identifierPrefix,
          null,
          onUncaughtError,
          onCaughtError,
          onRecoverableError,
          defaultOnDefaultTransitionIndicator
        );
        container[internalContainerInstanceKey] = options2.current;
        listenToAllSupportedEvents(container);
        return new ReactDOMRoot(options2);
      };
      exports.hydrateRoot = function(container, initialChildren, options2) {
        if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
        var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
        null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError), void 0 !== options2.formState && (formState = options2.formState));
        initialChildren = createFiberRoot(
          container,
          1,
          true,
          initialChildren,
          null != options2 ? options2 : null,
          isStrictMode,
          identifierPrefix,
          formState,
          onUncaughtError,
          onCaughtError,
          onRecoverableError,
          defaultOnDefaultTransitionIndicator
        );
        initialChildren.context = getContextForSubtree(null);
        options2 = initialChildren.current;
        isStrictMode = requestUpdateLane();
        isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
        identifierPrefix = createUpdate(isStrictMode);
        identifierPrefix.callback = null;
        enqueueUpdate(options2, identifierPrefix, isStrictMode);
        options2 = isStrictMode;
        initialChildren.current.lanes = options2;
        markRootUpdated$1(initialChildren, options2);
        ensureRootIsScheduled(initialChildren);
        container[internalContainerInstanceKey] = initialChildren.current;
        listenToAllSupportedEvents(container);
        return new ReactDOMHydrationRoot(initialChildren);
      };
      exports.version = "19.2.4";
    }
  });

  // home/claude/.npm-global/lib/node_modules/react-dom/client.js
  var require_client = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react-dom/client.js"(exports, module) {
      "use strict";
      function checkDCE() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
          return;
        }
        if (false) {
          throw new Error("^_^");
        }
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
          console.error(err);
        }
      }
      if (true) {
        checkDCE();
        module.exports = require_react_dom_client_production();
      } else {
        module.exports = null;
      }
    }
  });

  // home/claude/.npm-global/lib/node_modules/react/cjs/react-jsx-runtime.production.js
  var require_react_jsx_runtime_production = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      function jsxProd(type, config, maybeKey) {
        var key = null;
        void 0 !== maybeKey && (key = "" + maybeKey);
        void 0 !== config.key && (key = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        config = maybeKey.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== config ? config : null,
          props: maybeKey
        };
      }
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = jsxProd;
      exports.jsxs = jsxProd;
    }
  });

  // home/claude/.npm-global/lib/node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "home/claude/.npm-global/lib/node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_jsx_runtime_production();
      } else {
        module.exports = null;
      }
    }
  });

  // home/claude/entry-v6.jsx
  var import_client = __toESM(require_client());

  // home/claude/ecoscore-v6-clean.jsx
  var import_react = __toESM(require_react());
  var import_jsx_runtime = __toESM(require_jsx_runtime());
  var GF = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap";
  var C = {
    bg: "#F7F6F3",
    surface: "#FFFFFF",
    brand: "#1D3D2E",
    brandMid: "#2D5A45",
    brandLight: "#EBF5EF",
    accent: "#3D9A6E",
    text: "#18181B",
    sub: "#52525B",
    muted: "#A1A1AA",
    border: "#E4E4E7",
    danger: "#EF4444",
    dangerLight: "#FEF2F2",
    warning: "#F59E0B",
    warningLight: "#FFFBEB",
    success: "#10B981",
    successLight: "#ECFDF5",
    blue: "#3B82F6",
    blueLight: "#EFF6FF",
    purple: "#7C3AED",
    purpleLight: "#F5F3FF",
    orange: "#F97316",
    orangeLight: "#FFF7ED"
  };
  var CSS = `
@import url('${GF}');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Sora',sans-serif;background:#F7F6F3;color:#18181B;font-size:14px}
input,select,textarea{font-family:'Sora',sans-serif;font-size:14px;color:#18181B;background:#fff;border:1px solid #E4E4E7;border-radius:8px;padding:8px 12px;width:100%;outline:none;transition:border-color .15s}
input:focus,select:focus,textarea:focus{border-color:#3D9A6E;box-shadow:0 0 0 3px #EBF5EF}
textarea{resize:vertical;min-height:80px}
button{font-family:'Sora',sans-serif;cursor:pointer;border:none;border-radius:8px;font-size:13px;font-weight:500;transition:all .15s}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#E4E4E7;border-radius:99px}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
`;
  var uid = () => Math.random().toString(36).slice(2, 9);
  var initials = (n) => (n || "").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  var avatarPalette = ["#1D3D2E", "#2D5A45", "#3D9A6E", "#0F766E", "#1D4ED8", "#7C3AED", "#BE185D", "#B45309"];
  var avatarColor = (n) => avatarPalette[(n || "").charCodeAt(0) % avatarPalette.length];
  var DEPTS = ["Direction", "Tech", "RH", "Op\xE9rations", "Commercial", "Finance", "Marketing", "Juridique", "Communication"];
  var CONTRATS = ["CDI", "CDD", "Stage", "Alternance", "Freelance", "Int\xE9rim"];
  var todayStr = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  var daysUntil = (dateStr) => Math.round((new Date(dateStr) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24));
  var formatDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  var STORAGE_KEY = "ecoscore_v6";
  function loadFromLocalStorage(fallback) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        ...fallback,
        ...parsed,
        esg: {
          ...fallback.esg,
          ...parsed.esg,
          env: { ...fallback.esg.env, ...parsed.esg?.env || {} },
          soc: { ...fallback.esg.soc, ...parsed.esg?.soc || {} },
          gov: { ...fallback.esg.gov, ...parsed.esg?.gov || {} }
        },
        rse: { ...fallback.rse, ...parsed.rse }
      };
    } catch {
      return fallback;
    }
  }
  function saveToLocalStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }
  async function saveToServer(data) {
    try {
      const r = await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      return r.ok;
    } catch {
      return false;
    }
  }
  async function loadFromServer() {
    try {
      const r = await fetch("/api/load");
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }
  var LEGISLATION = [
    // REPORTING
    {
      id: "csrd",
      code: "CSRD",
      titre: "Corporate Sustainability Reporting Directive",
      type: "Directive UE",
      cat: "Reporting",
      dom: "Transversal",
      origine: "UE",
      date: "2022-12-14",
      vigueur: "2024-01-01",
      statut: "En vigueur",
      seuils: "Grandes entreprises >500 sal. d\xE8s 2025. PME cot\xE9es >250 sal. ou >40M\u20AC CA d\xE8s 2026. VSME volontaire pour PME non cot\xE9es.",
      resume: "Oblige la publication d'un rapport de durabilit\xE9 standardis\xE9 selon les normes ESRS, int\xE9gr\xE9 au rapport de gestion et audit\xE9 par un OTI.",
      obligations: ["Rapport ESRS E1-G1 \u2014 double mat\xE9rialit\xE9", "Audit par OTI (organisme tiers ind\xE9pendant)", "Int\xE9gration dans le rapport de gestion", "Plan de transition climatique", "Couverture Scope 3 et cha\xEEne de valeur"],
      articles: ["Art. 19a Directive 2013/34/UE modifi\xE9e", "R\xE8glement d\xE9l\xE9gu\xE9 UE 2023/2772 \u2014 ESRS", "Ordonnance n\xB02023-1142 du 6 d\xE9c. 2023 \u2014 Transposition France", "Consid\xE9rant 44 CSRD \u2014 Double mat\xE9rialit\xE9"],
      sanctions: "Amendes jusqu'\xE0 75 000 \u20AC + 5 ans d'emprisonnement (Art. L.225-102-1 Code com.)",
      lien: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022L2464",
      impact: "PME indirectement concern\xE9es d\xE8s maintenant via leurs donneurs d'ordres soumis.",
      tags: ["CSRD", "ESRS", "reporting", "durabilit\xE9"]
    },
    {
      id: "dpef",
      code: "DPEF",
      titre: "D\xE9claration de Performance Extra-Financi\xE8re",
      type: "Loi fran\xE7aise",
      cat: "Reporting",
      dom: "Transversal",
      origine: "France",
      date: "2017-08-19",
      vigueur: "2018-01-01",
      statut: "En vigueur",
      seuils: "SA/SCA cot\xE9es >500 sal. et >40M\u20AC CA. Non cot\xE9es >500 sal. et >100M\u20AC CA.",
      resume: "Rapport int\xE9gr\xE9 sur les risques ESG, politiques et r\xE9sultats. Audit OTI obligatoire. Pr\xE9curseur de la CSRD.",
      obligations: ["Description du mod\xE8le d'affaires", "Risques ESG mat\xE9riels identifi\xE9s et g\xE9r\xE9s", "Indicateurs cl\xE9s (KPI)", "OTI accr\xE9dit\xE9 COFRAC", "Informations sociales, environnementales et soci\xE9tales"],
      articles: ["Art. L.225-102-1 Code de commerce", "Art. R.225-104 \xE0 R.225-105-2 Code com.", "D\xE9cret n\xB02017-1265 du 9 ao\xFBt 2017", "Arr\xEAt\xE9 7 mai 2019 \u2014 Modalit\xE9s OTI"],
      sanctions: "Amende 75 000 \u20AC. Nullit\xE9 du rapport de gestion possible.",
      lien: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038792989",
      impact: "PME hors seuils non soumises mais pratiques recommand\xE9es.",
      tags: ["DPEF", "OTI", "rapport"]
    },
    {
      id: "grenelle2",
      code: "Art. 225 Grenelle II",
      titre: "Loi Grenelle II \u2014 Rapport RSE obligatoire",
      type: "Loi fran\xE7aise",
      cat: "Reporting",
      dom: "Transversal",
      origine: "France",
      date: "2010-07-12",
      vigueur: "2012-12-31",
      statut: "Historique \u2014 pr\xE9curseur DPEF",
      seuils: "Soci\xE9t\xE9s cot\xE9es et non cot\xE9es >500 sal. et >100M\u20AC CA ou bilan.",
      resume: "Premi\xE8re obligation fran\xE7aise de reporting RSE int\xE9gr\xE9 au rapport de gestion. Pr\xE9curseur de la DPEF et de la CSRD.",
      obligations: ["Informations sociales (emploi, sant\xE9, \xE9galit\xE9)", "Informations environnementales (\xE9nergie, GES, eau)", "Informations soci\xE9tales (fournisseurs, territoire)", "V\xE9rification OTI"],
      articles: ["Art. L.225-102-1 et L.225-102-2 Code com.", "D\xE9cret n\xB02012-557 du 24 avril 2012", "Art. R.225-105 Code com."],
      sanctions: "Engagement responsabilit\xE9 dirigeants. Nullit\xE9 rapport.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000022470434",
      impact: "PME d\xE9passant les seuils et non encore soumises \xE0 la CSRD.",
      tags: ["Grenelle", "RSE", "rapport", "225"]
    },
    {
      id: "nre",
      code: "Loi NRE",
      titre: "Loi NRE \u2014 Nouvelles R\xE9gulations \xC9conomiques",
      type: "Loi fran\xE7aise",
      cat: "Reporting",
      dom: "Transversal",
      origine: "France",
      date: "2001-05-15",
      vigueur: "2003-01-01",
      statut: "Historique \u2014 pr\xE9curseur",
      seuils: "Soci\xE9t\xE9s cot\xE9es (rapport annuel).",
      resume: "Premi\xE8re loi mondiale imposant un reporting social et environnemental aux soci\xE9t\xE9s cot\xE9es dans leur rapport annuel. Pionni\xE8re de la RSE r\xE9glementaire.",
      obligations: ["Informations sociales dans le rapport annuel", "Informations environnementales dans le rapport annuel", "Mention de l'impact territorial"],
      articles: ["Art. 116 Loi NRE n\xB02001-420 du 15 mai 2001", "D\xE9cret n\xB02002-221 du 20 f\xE9vrier 2002"],
      sanctions: "Absence d'informations : irr\xE9gularit\xE9 du rapport annuel.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000000222521",
      impact: "Socle historique. Toutes les obligations RSE actuelles en d\xE9coulent.",
      tags: ["NRE", "historique", "RSE", "pr\xE9curseur"]
    },
    // GOUVERNANCE
    {
      id: "pacte",
      code: "Loi PACTE",
      titre: "Loi PACTE \u2014 Raison d'\xEAtre & Soci\xE9t\xE9 \xE0 Mission",
      type: "Loi fran\xE7aise",
      cat: "Gouvernance",
      dom: "Gouvernance",
      origine: "France",
      date: "2019-05-22",
      vigueur: "2019-05-23",
      statut: "En vigueur",
      seuils: "Art. 1833 CC modifi\xE9 : TOUTES soci\xE9t\xE9s. Raison d'\xEAtre et soci\xE9t\xE9 \xE0 mission : optionnel.",
      resume: "Toute soci\xE9t\xE9 doit g\xE9rer son activit\xE9 en tenant compte des enjeux sociaux et environnementaux (art. 1833 CC). Cr\xE9e la soci\xE9t\xE9 \xE0 mission.",
      obligations: ["Art. 1833 CC : int\xE9r\xEAt social \xE9largi (toutes soci\xE9t\xE9s)", "Art. 1835 CC : raison d'\xEAtre possible dans les statuts", "Soci\xE9t\xE9 \xE0 mission : comit\xE9 de mission + OTI + rapport annuel"],
      articles: ["Art. 1833 Code civil \u2014 Int\xE9r\xEAt social \xE9largi", "Art. 1835 Code civil \u2014 Raison d'\xEAtre", "Art. L.210-10 \xE0 L.210-12 Code com. \u2014 Soci\xE9t\xE9 \xE0 mission", "D\xE9cret n\xB02020-1 du 2 janv. 2020"],
      sanctions: "Responsabilit\xE9 dirigeants. Perte du statut soci\xE9t\xE9 \xE0 mission.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000038496102",
      impact: "Applicable \xE0 TOUTES les PME via l'art. 1833 CC.",
      tags: ["PACTE", "raison d'\xEAtre", "mission", "1833"]
    },
    {
      id: "sapin2",
      code: "Loi Sapin II",
      titre: "Loi Sapin II \u2014 Anticorruption & Lanceurs d'Alerte",
      type: "Loi fran\xE7aise",
      cat: "Gouvernance",
      dom: "Gouvernance",
      origine: "France",
      date: "2016-12-09",
      vigueur: "2017-06-01",
      statut: "En vigueur",
      seuils: "Programme AFA : >500 sal. et >100M\u20AC CA. Dispositif d'alerte : \u226550 sal. (Loi Waserman 2022).",
      resume: "Cr\xE9e l'AFA. Programme de pr\xE9vention de la corruption en 8 piliers. Protection renforc\xE9e des lanceurs d'alerte.",
      obligations: ["Code de conduite anticorruption dans le r\xE8glement int\xE9rieur", "Dispositif d'alerte confidentiel (\u226550 sal.)", "Cartographie des risques de corruption", "\xC9valuation des tiers (fournisseurs, clients)", "Formation des salari\xE9s expos\xE9s"],
      articles: ["Art. 17 Loi n\xB02016-1691 \u2014 Programme AFA", "Loi n\xB02022-401 du 21 mars 2022 (Waserman)", "Art. L.1132-3-3 Code du travail \u2014 Protection lanceur d'alerte", "Recommandations AFA 2021 \u2014 Guide 8 piliers"],
      sanctions: "200 000 \u20AC (personne physique), 1 000 000 \u20AC (personne morale) + injonction AFA.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000033558528",
      impact: "Dispositif d'alerte obligatoire d\xE8s 50 sal. Programme AFA d\xE8s 500 sal.",
      tags: ["Sapin II", "anticorruption", "AFA", "whistleblower"]
    },
    {
      id: "vigilance",
      code: "Loi Vigilance",
      titre: "Devoir de Vigilance des Soci\xE9t\xE9s M\xE8res",
      type: "Loi fran\xE7aise",
      cat: "Gouvernance",
      dom: "Social",
      origine: "France",
      date: "2017-03-27",
      vigueur: "2018-03-27",
      statut: "En vigueur",
      seuils: ">5 000 sal. en France ou >10 000 sal. monde (si\xE8ge + filiales).",
      resume: "Premi\xE8re loi mondiale sur le devoir de vigilance. Identifier et pr\xE9venir les risques droits humains, S&S, environnement dans toute la cha\xEEne de valeur.",
      obligations: ["Cartographie des risques droits humains et environnement", "Plan de vigilance publi\xE9 dans le rapport annuel", "\xC9valuation filiales et sous-traitants", "Dispositif d'alerte et suivi", "Couverture cha\xEEne de valeur compl\xE8te"],
      articles: ["Art. L.225-102-4 Code com. \u2014 Plan de vigilance", "Art. L.225-102-5 Code com. \u2014 Responsabilit\xE9 civile", "Loi n\xB02017-399 du 27 mars 2017"],
      sanctions: "Mise en demeure + responsabilit\xE9 civile si pr\xE9judice caus\xE9.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000034290626",
      impact: "PME fournisseurs de grands groupes doivent r\xE9pondre \xE0 leurs questionnaires.",
      tags: ["vigilance", "droits humains", "cha\xEEne valeur"]
    },
    {
      id: "csddd",
      code: "CS3D / CSDDD",
      titre: "Corporate Sustainability Due Diligence Directive",
      type: "Directive UE",
      cat: "Gouvernance",
      dom: "Transversal",
      origine: "UE",
      date: "2024-07-13",
      vigueur: "2027-07-26",
      statut: "Transposition en cours",
      seuils: "Phase 1 (2027) : >5 000 sal. et >1,5 Md\u20AC CA. Phase 2 (2028) : >3 000 sal. et >900M\u20AC. Phase 3 (2029) : >1 000 sal. et >450M\u20AC.",
      resume: "Extension europ\xE9enne du devoir de vigilance. Cha\xEEne de valeur mondiale. Responsabilit\xE9 civile harmonis\xE9e.",
      obligations: ["Cartographie des risques droits humains et environnement", "Plan de vigilance pr\xE9ventif et correctif", "M\xE9canisme de plainte", "Plan de transition Accord de Paris", "Rapport annuel publi\xE9"],
      articles: ["Directive UE 2024/1760 du 13 juillet 2024", "Art. 10 CSDDD \u2014 Plan de transition", "Art. 22 CSDDD \u2014 Responsabilit\xE9 civile"],
      sanctions: "Amendes \u22655% CA mondial net. Publication des entreprises sanctionn\xE9es.",
      lien: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=OJ:L_202401760",
      impact: "Anticipation recommand\xE9e d\xE8s maintenant. PME fournisseurs impact\xE9es d\xE8s 2027.",
      tags: ["CSDDD", "vigilance", "2027"]
    },
    {
      id: "rgpd",
      code: "RGPD",
      titre: "R\xE8glement G\xE9n\xE9ral sur la Protection des Donn\xE9es",
      type: "R\xE8glement UE",
      cat: "Gouvernance",
      dom: "Gouvernance",
      origine: "UE",
      date: "2016-04-27",
      vigueur: "2018-05-25",
      statut: "En vigueur",
      seuils: "Toute organisation traitant des donn\xE9es personnelles de r\xE9sidents UE.",
      resume: "Protection des donn\xE9es personnelles. Droits des personnes, obligations des responsables de traitement, s\xE9curit\xE9.",
      obligations: ["Registre des activit\xE9s de traitement (Art. 30 RGPD)", "DPO si traitements \xE0 grande \xE9chelle", "DPIA pour traitements \xE0 risque \xE9lev\xE9", "Notification violations CNIL dans 72h (Art. 33)", "Consentement \xE9clair\xE9 (Art. 7)", "Contrats sous-traitants (Art. 28)"],
      articles: ["Art. 5 RGPD \u2014 Principes de traitement", "Art. 7 RGPD \u2014 Consentement", "Art. 17 RGPD \u2014 Droit \xE0 l'effacement", "Art. 28 RGPD \u2014 Sous-traitants", "Art. 32 RGPD \u2014 S\xE9curit\xE9", "Art. 33-34 RGPD \u2014 Notification violations"],
      sanctions: "20M\u20AC ou 4% CA mondial. CNIL : amendes publi\xE9es.",
      lien: "https://www.cnil.fr/fr/reglement-europeen-protection-donnees",
      impact: "Toutes PME. Registre de traitement obligatoire d\xE8s 1 salari\xE9.",
      tags: ["RGPD", "donn\xE9es", "CNIL", "DPO"]
    },
    {
      id: "copezimm",
      code: "Loi Cop\xE9-Zimmermann",
      titre: "Loi Cop\xE9-Zimmermann \u2014 Parit\xE9 dans les CA",
      type: "Loi fran\xE7aise",
      cat: "Gouvernance",
      dom: "Social",
      origine: "France",
      date: "2011-01-27",
      vigueur: "2011-01-27",
      statut: "En vigueur",
      seuils: "SA et SCA cot\xE9es (40%) d\xE8s 2012. Non cot\xE9es >500 sal. et >50M\u20AC CA : 40% d\xE8s 2017.",
      resume: "Impose des quotas de femmes dans les conseils d'administration et de surveillance. Objectif 40% minimum.",
      obligations: ["40% de femmes au CA/CS (cot\xE9es et non cot\xE9es \u2265seuils)", "Toute d\xE9lib\xE9ration non conforme est nulle", "Rapport sur la repr\xE9sentation dans le rapport de gestion", "R\xE9mun\xE9ration des administrateurs suspendue si non-conformit\xE9"],
      articles: ["Loi n\xB02011-103 du 27 janvier 2011", "Art. L.225-18-1 Code com. (SA)", "Art. L.225-69-1 Code com. (directoire)", "Art. L.226-4-1 Code com. (SCA)"],
      sanctions: "D\xE9lib\xE9rations nulles. Suspension des jetons de pr\xE9sence.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000023521836",
      impact: "PME non cot\xE9es hors seuils non soumises. Bonnes pratiques recommand\xE9es.",
      tags: ["parit\xE9", "CA", "femmes", "gouvernance", "Cop\xE9-Zimmermann"]
    },
    {
      id: "rixain",
      code: "Loi Rixain",
      titre: "Loi Rixain \u2014 Repr\xE9sentation \xC9quilibr\xE9e F/H",
      type: "Loi fran\xE7aise",
      cat: "Gouvernance",
      dom: "Social",
      origine: "France",
      date: "2021-12-24",
      vigueur: "2022-03-01",
      statut: "En vigueur",
      seuils: ">1 000 sal. : objectif 30% de femmes dans les postes de direction d\xE8s 2026, 40% d\xE8s 2029.",
      resume: "\xC9tend les quotas de parit\xE9 aux postes de direction (cadres dirigeants et instances dirigeantes). Publication des \xE9carts obligatoire.",
      obligations: ["Publication des \xE9carts de repr\xE9sentation F/H dans les postes de direction", "Objectif 30% postes de direction d'ici 2026", "Objectif 40% postes de direction d'ici 2029", "P\xE9nalit\xE9 si objectifs non atteints sans mesures correctives"],
      articles: ["Loi n\xB02021-1774 du 24 d\xE9cembre 2021", "Art. L.1142-11 et L.1142-12 Code du travail", "D\xE9cret n\xB02022-680 du 26 avril 2022"],
      sanctions: "P\xE9nalit\xE9 jusqu'\xE0 1% de la masse salariale si objectifs non atteints (apr\xE8s mise en demeure).",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000044559192",
      impact: "Entreprises >1 000 sal. Indicateur int\xE9gr\xE9 \xE0 l'index F/H \xE9tendu.",
      tags: ["Rixain", "parit\xE9", "direction", "femmes", "1000 sal."]
    },
    // SOCIAL & RH
    {
      id: "indexegalite",
      code: "Index \xC9galit\xE9 F/H",
      titre: "Index de l'\xC9galit\xE9 Professionnelle F/H",
      type: "Loi fran\xE7aise",
      cat: "\xC9galit\xE9",
      dom: "Social",
      origine: "France",
      date: "2018-09-05",
      vigueur: "2019-03-01",
      statut: "En vigueur",
      seuils: "\u226550 sal. Publication obligatoire avant le 1er mars.",
      resume: "Note sur 100 calcul\xE9e sur 5 indicateurs (\u2265250 sal.) ou 4 (50-249 sal.). Plan d'action obligatoire si note <75.",
      obligations: ["Indicateur 1 : \xC9cart de r\xE9mun\xE9ration (40 pts)", "Indicateur 2 : \xC9cart d'augmentations (20 pts)", "Indicateur 3 : \xC9cart de promotions (15 pts \u2014 \u2265250 sal.)", "Indicateur 4 : Augmentations retour maternit\xE9 (15 pts)", "Indicateur 5 : Femmes dans top 10 r\xE9mun\xE9rations (10 pts)", "Publication avant le 1er mars sur index.egapro.travail.gouv.fr", "Plan d'action si note <75 \u2014 accord ou plan unilat\xE9ral si <85"],
      articles: ["Art. L.1142-8 Code du travail", "Art. L.1142-9 et L.1142-10 CT (mesures correctives)", "D\xE9cret n\xB02019-15 du 8 janv. 2019", "D\xE9cret n\xB02022-243 du 25 f\xE9v. 2022 (renforcement)"],
      sanctions: "P\xE9nalit\xE9 jusqu'\xE0 1% masse salariale si note <75/100 pendant 3 ans sans mesures.",
      lien: "https://www.index-egapro.travail.gouv.fr",
      impact: "Obligatoire d\xE8s 50 sal. Outil de calcul gratuit disponible.",
      tags: ["index \xE9galit\xE9", "F/H", "r\xE9mun\xE9ration", "egapro"]
    },
    {
      id: "oeth",
      code: "OETH",
      titre: "Obligation d'Emploi des Travailleurs Handicap\xE9s",
      type: "Loi fran\xE7aise",
      cat: "Handicap",
      dom: "Social",
      origine: "France",
      date: "1987-07-10",
      vigueur: "2020-01-01",
      statut: "En vigueur",
      seuils: "\u226520 sal. D\xE9claration mensuelle via DSN depuis jan. 2020.",
      resume: "Taux d'emploi de 6% de BOETH obligatoire. Contribution URSSAF si taux insuffisant.",
      obligations: ["Taux d'emploi BOETH \u22656% de l'effectif", "D\xE9claration mensuelle via DSN", "Contribution URSSAF trimestrielle si taux insuffisant", "Accord agr\xE9\xE9 possible en alternative", "Recours ESAT/EA valorisable (limite 1/3)"],
      articles: ["Art. L.5212-1 \xE0 L.5212-17 Code du travail", "Art. R.5212-1 \xE0 R.5212-45 CT", "Loi n\xB087-517 du 10 juillet 1987", "Loi n\xB02018-771 du 5 sept. 2018 (r\xE9forme)"],
      sanctions: "Contribution URSSAF proportionnelle \xE0 l'\xE9cart. Majoration si aucune action depuis 3 ans.",
      lien: "https://www.agefiph.fr/entreprises/obligation-demploi",
      impact: "Toutes PME \u226520 sal. Aides AGEFIPH disponibles.",
      tags: ["OETH", "handicap", "BOETH", "AGEFIPH", "6%"]
    },
    {
      id: "santetravail",
      code: "Sant\xE9 au Travail",
      titre: "Loi Sant\xE9 au Travail \u2014 R\xE9forme 2021",
      type: "Loi fran\xE7aise",
      cat: "Sant\xE9 & S\xE9curit\xE9",
      dom: "Social",
      origine: "France",
      date: "2021-08-02",
      vigueur: "2022-03-31",
      statut: "En vigueur",
      seuils: "Toutes entreprises d\xE8s 1 salari\xE9.",
      resume: "DUERP num\xE9ris\xE9 et historis\xE9. Visite mi-carri\xE8re \xE0 45 ans. Passeport pr\xE9vention individuel. Rendez-vous de liaison.",
      obligations: ["DUERP num\xE9ris\xE9 et historis\xE9 (toutes entreprises)", "Visite m\xE9dicale de mi-carri\xE8re \xE0 45 ans", "Rendez-vous de liaison si arr\xEAt >30 jours", "Passeport de pr\xE9vention individuel", "Programme annuel de pr\xE9vention des risques"],
      articles: ["Loi n\xB02021-1018 du 2 ao\xFBt 2021", "Art. L.4121-1 Code du travail (obligation s\xE9curit\xE9)", "Art. R.4121-1 CT \u2014 DUERP", "Art. L.4624-1 CT \u2014 Visite m\xE9dicale", "D\xE9cret n\xB02022-395 du 18 mars 2022 (DUERP num\xE9rique)"],
      sanctions: "Faute inexcusable si DUERP absent lors d'un accident. Amende R.4741-1 : 3 750 \u20AC.",
      lien: "https://www.ameli.fr/employeur/sante-et-prevoyance/sante-au-travail",
      impact: "Toutes PME. DUERP obligatoire d\xE8s 1 salari\xE9.",
      tags: ["DUERP", "sant\xE9", "s\xE9curit\xE9", "pr\xE9vention", "accidents"]
    },
    {
      id: "cse",
      code: "CSE",
      titre: "Comit\xE9 Social et \xC9conomique",
      type: "Ordonnance fran\xE7aise",
      cat: "Dialogue social",
      dom: "Social",
      origine: "France",
      date: "2017-09-22",
      vigueur: "2020-01-01",
      statut: "En vigueur",
      seuils: "CSE obligatoire \u226511 sal. Attributions \xE9tendues \u226550 sal. Comit\xE9s sp\xE9cialis\xE9s \u2265300 sal.",
      resume: "Instance unique de repr\xE9sentation du personnel fusionnant DP, CE et CHSCT. Missions \xE9conomiques, sociales et de sant\xE9/s\xE9curit\xE9.",
      obligations: ["\xC9lection des membres du CSE (tous les 4 ans)", "R\xE9unions pl\xE9ni\xE8res mensuelles (\u226550 sal.)", "Budget de fonctionnement : 0,2% MS (50-2000 sal.) ou 0,22% (>2000)", "Budget activit\xE9s sociales et culturelles", "DUERP soumis au CSE", "Consultation sur les d\xE9cisions strat\xE9giques (\u226550 sal.)"],
      articles: ["Art. L.2311-1 \xE0 L.2315-100 Code du travail", "Ordonnances Macron n\xB02017-1386 et 2017-1388", "Art. L.2312-8 CT \u2014 Attributions g\xE9n\xE9rales \u226550 sal.", "Art. L.2315-61 CT \u2014 Budget fonctionnement", "Art. L.2315-63 CT \u2014 Budget ASC"],
      sanctions: "D\xE9lit d'entrave : 1 an d'emprisonnement et 7 500 \u20AC d'amende (Art. L.2317-1 CT).",
      lien: "https://www.legifrance.gouv.fr/codes/section_lc/LEGISCTA000035611752/",
      impact: "Toutes PME \u226511 sal. Processus \xE9lectoral \xE0 organiser.",
      tags: ["CSE", "repr\xE9sentation", "dialogue social", "\xE9lection"]
    },
    {
      id: "nao",
      code: "NAO",
      titre: "N\xE9gociations Annuelles Obligatoires",
      type: "Loi fran\xE7aise",
      cat: "N\xE9gociation collective",
      dom: "Social",
      origine: "France",
      date: "1982-11-13",
      vigueur: "1982-11-13",
      statut: "En vigueur",
      seuils: "Entreprises avec d\xE9l\xE9gu\xE9s syndicaux (\u226550 sal. en pratique).",
      resume: "Obligation de n\xE9gocier chaque ann\xE9e sur les r\xE9mun\xE9rations, le temps de travail, l'\xE9galit\xE9 professionnelle, la qualit\xE9 de vie au travail.",
      obligations: ["Bloc 1 annuel : R\xE9mun\xE9rations, dur\xE9e du travail, \xE9pargne salariale", "Bloc 1 annuel : \xC9galit\xE9 professionnelle F/H", "Bloc 2 triennal : Gestion pr\xE9visionnelle des emplois (GPEC)", "Bloc 2 triennal : Handicap et p\xE9nibilit\xE9", "Proc\xE8s-verbal de d\xE9saccord si pas d'accord"],
      articles: ["Art. L.2242-1 \xE0 L.2242-20 Code du travail", "Art. L.2242-1 CT \u2014 Blocs de n\xE9gociation", "Art. L.2242-11 CT \u2014 Contenu du Bloc 1", "Art. L.2242-13 CT \u2014 Contenu du Bloc 2"],
      sanctions: "Majoration de la contribution patronale de formation en l'absence de n\xE9gociation sur la formation.",
      lien: "https://www.service-public.fr/particuliers/vosdroits/F2259",
      impact: "PME avec DS. Structure d'un calendrier social annuel.",
      tags: ["NAO", "n\xE9gociation", "syndicats", "r\xE9mun\xE9ration", "\xE9galit\xE9"]
    },
    {
      id: "bilansocial",
      code: "Bilan Social",
      titre: "Bilan Social Annuel",
      type: "Loi fran\xE7aise",
      cat: "Reporting RH",
      dom: "Social",
      origine: "France",
      date: "1977-07-12",
      vigueur: "1978-01-01",
      statut: "En vigueur",
      seuils: "Entreprises \u2265300 salari\xE9s.",
      resume: "Document r\xE9capitulatif des donn\xE9es chiffr\xE9es de l'entreprise sur les 3 derni\xE8res ann\xE9es (emploi, r\xE9mun\xE9rations, conditions de travail, formation, relations sociales).",
      obligations: ["Emploi : effectifs, embauches, d\xE9parts, CDI/CDD", "R\xE9mun\xE9rations et charges accessoires", "Conditions de sant\xE9 et s\xE9curit\xE9 (AT, MP)", "Formation professionnelle", "Relations professionnelles", "Autres conditions de travail", "Soumis au CSE avant le 1er octobre", "D\xE9p\xF4t \xE0 l'inspection du travail"],
      articles: ["Art. L.2323-70 et s. Code du travail", "Art. D.2323-13 \xE0 D.2323-15 CT \u2014 Contenu", "Art. R.2323-17 CT \u2014 D\xE9lais de communication"],
      sanctions: "D\xE9lit d'entrave au CSE si bilan non communiqu\xE9.",
      lien: "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23382",
      impact: "PME \u2265300 sal. Contient la plupart des indicateurs ESRS S1.",
      tags: ["bilan social", "300 sal.", "RH", "indicateurs"]
    },
    {
      id: "deconnexion",
      code: "Droit \xE0 la d\xE9connexion",
      titre: "Droit \xE0 la D\xE9connexion Num\xE9rique",
      type: "Loi fran\xE7aise",
      cat: "Qualit\xE9 de vie",
      dom: "Social",
      origine: "France",
      date: "2016-08-08",
      vigueur: "2017-01-01",
      statut: "En vigueur",
      seuils: "Toutes entreprises \u226550 sal. (accord ou charte). En pratique, recommand\xE9 \xE0 toutes tailles.",
      resume: "Droit pour les salari\xE9s de ne pas \xEAtre connect\xE9s aux outils num\xE9riques professionnels en dehors des horaires de travail. Accord ou charte obligatoire \u226550 sal.",
      obligations: ["Accord collectif sur les modalit\xE9s (\u226550 sal.)", "\xC0 d\xE9faut : charte unilat\xE9rale apr\xE8s avis CSE", "Formation et sensibilisation des salari\xE9s et managers", "Mesures de r\xE9gulation du bon usage des outils", "Suivi de l'application de l'accord/charte"],
      articles: ["Art. L.2242-17 Code du travail (Loi El Khomri 2016)", "Art. L.3121-64 CT \u2014 Accord forfait jours", "Art. L.2242-8 CT (ancienne num\xE9rotation)"],
      sanctions: "Absence d'accord ou charte : irr\xE9gularit\xE9 en cas de contentieux. Burn-out reconnaissable en accident du travail.",
      lien: "https://www.service-public.fr/particuliers/vosdroits/F2448",
      impact: "Toutes PME. Outil de pr\xE9vention des RPS. Facteur d'attractivit\xE9.",
      tags: ["d\xE9connexion", "num\xE9rique", "RPS", "qualit\xE9 de vie", "t\xE9l\xE9travail"]
    },
    {
      id: "teletravail",
      code: "T\xE9l\xE9travail",
      titre: "Accord National Interprofessionnel T\xE9l\xE9travail",
      type: "ANI fran\xE7ais",
      cat: "Organisation travail",
      dom: "Social",
      origine: "France",
      date: "2020-11-26",
      vigueur: "2021-04-24",
      statut: "En vigueur",
      seuils: "Toutes entreprises. Accord ou charte obligatoire si t\xE9l\xE9travail r\xE9gulier.",
      resume: "Cadre national du t\xE9l\xE9travail. Formalis\xE9 par accord ou charte. Principe du double volontariat (salari\xE9 + employeur).",
      obligations: ["Double volontariat : accord salari\xE9 et employeur", "Accord collectif ou charte unilat\xE9rale (avis CSE)", "Prise en charge des frais suppl\xE9mentaires", "Adaptation du management \xE0 distance", "Pr\xE9vention de l'isolement et droit \xE0 la d\xE9connexion", "\xC9galit\xE9 d'acc\xE8s au t\xE9l\xE9travail"],
      articles: ["Art. L.1222-9 Code du travail \u2014 Cadre l\xE9gal", "Art. L.1222-10 CT \u2014 Obligations employeur", "Art. L.1222-11 CT \u2014 T\xE9l\xE9travail en cas de force majeure", "ANI T\xE9l\xE9travail du 26 novembre 2020"],
      sanctions: "Refus de t\xE9l\xE9travail sans justification : recours possible si accord pr\xE9vu.",
      lien: "https://travail-emploi.gouv.fr/dialogue-social/negociation-collective/article/accord-national-interprofessionnel-relatif-au-teletravail",
      impact: "Toutes tailles. Formalisation par charte recommand\xE9e. Impact ESRS S1.",
      tags: ["t\xE9l\xE9travail", "remote", "flexibilit\xE9", "ANI", "charte"]
    },
    {
      id: "c2p",
      code: "C2P / P\xE9nibilit\xE9",
      titre: "Compte Professionnel de Pr\xE9vention (C2P)",
      type: "Loi fran\xE7aise",
      cat: "P\xE9nibilit\xE9",
      dom: "Social",
      origine: "France",
      date: "2014-01-20",
      vigueur: "2015-01-01",
      statut: "En vigueur (r\xE9forme 2023)",
      seuils: "Tous salari\xE9s expos\xE9s \xE0 des facteurs de risques professionnels au-del\xE0 des seuils.",
      resume: "Syst\xE8me de points acquis par les salari\xE9s expos\xE9s aux 6 facteurs de p\xE9nibilit\xE9. Utilisables pour formation, r\xE9duction du temps de travail ou retraite anticip\xE9e.",
      obligations: ["D\xE9claration annuelle des expositions via DSN", "6 facteurs : bruit, produits chimiques dangereux, TS travail de nuit, travaux r\xE9p\xE9titifs, milieu hyperbare, vibrations", "Diagnostic p\xE9nibilit\xE9 int\xE9gr\xE9 au DUERP", "Accord ou plan d'action pr\xE9vention si \u226525% salari\xE9s expos\xE9s et \u226550 sal."],
      articles: ["Art. L.4163-1 \xE0 L.4163-22 Code du travail", "Art. R.4163-1 \xE0 R.4163-17 CT", "Loi n\xB02014-40 du 20 janv. 2014 (r\xE9forme retraites)", "Ordonnance n\xB02017-1389 du 22 sept. 2017 (C3P\u2192C2P)"],
      sanctions: "D\xE9claration incompl\xE8te ou fausse : redressement URSSAF.",
      lien: "https://www.compteprofessionneldeprevention.fr",
      impact: "PME avec salari\xE9s expos\xE9s. Diagnostic via le DUERP.",
      tags: ["C2P", "p\xE9nibilit\xE9", "facteurs risques", "pr\xE9vention", "retraite"]
    },
    {
      id: "atmp",
      code: "AT/MP",
      titre: "Accidents du Travail & Maladies Professionnelles",
      type: "Code de la S\xE9curit\xE9 Sociale",
      cat: "Sant\xE9 & S\xE9curit\xE9",
      dom: "Social",
      origine: "France",
      date: "1946-10-30",
      vigueur: "1947-01-01",
      statut: "En vigueur",
      seuils: "Toutes entreprises d\xE8s 1 salari\xE9.",
      resume: "R\xE9gime de protection des salari\xE9s victimes d'accidents du travail ou de maladies professionnelles. Contribution patronale au taux fix\xE9 par la CARSAT.",
      obligations: ["D\xE9claration AT aupr\xE8s CPAM dans les 48h (Cerfa 14463)", "Registre des AT/MP et des maladies professionnelles", "DUERP tenant compte des risques AT/MP", "Cotisation AT/MP variable selon sinistralit\xE9 (taux individualis\xE9 \u2265200 sal.)", "Faute inexcusable si DUERP insuffisant"],
      articles: ["Art. L.411-1 Code de la S\xE9curit\xE9 Sociale \u2014 D\xE9finition AT", "Art. L.441-1 \xE0 L.441-4 CSS \u2014 D\xE9claration", "Art. L.4121-1 Code du travail \u2014 Pr\xE9vention", "Art. L.452-1 CSS \u2014 Faute inexcusable"],
      sanctions: "Faute inexcusable : majoration de rente + dommages et int\xE9r\xEAts. Amendes si non-d\xE9claration.",
      lien: "https://www.ameli.fr/employeur/vos-salaries/declaration-accident-de-travail",
      impact: "Toutes PME. Taux AT/MP impacte directement le co\xFBt du travail.",
      tags: ["accident du travail", "AT/MP", "d\xE9claration", "CPAM", "faute inexcusable"]
    },
    {
      id: "formation",
      code: "Formation Pro",
      titre: "Formation Professionnelle \u2014 CPF & Plan de Formation",
      type: "Loi fran\xE7aise",
      cat: "Formation",
      dom: "Social",
      origine: "France",
      date: "2018-09-05",
      vigueur: "2019-01-01",
      statut: "En vigueur",
      seuils: "Entretien professionnel : toutes entreprises \u22651 sal. Contribution OPCO : toutes entreprises.",
      resume: "CPF universalis\xE9, reconversion professionnelle, entretien professionnel tous les 2 ans. Abondement correctif si bilan 6 ans non r\xE9alis\xE9.",
      obligations: ["Entretien professionnel tous les 2 ans + bilan \xE0 6 ans", "Plan de d\xE9veloppement des comp\xE9tences annuel", "Contribution formation : 0,55% MS (<11 sal.) ou 1% MS (\u226511 sal.)", "Abondement correctif CPF 3 000 \u20AC si bilan non r\xE9alis\xE9 (\u226550 sal.)"],
      articles: ["Art. L.6315-1 CT \u2014 Entretien professionnel", "Art. L.6321-1 CT \u2014 Plan de d\xE9veloppement comp\xE9tences", "Art. L.6323-1 et s. CT \u2014 CPF", "Loi n\xB02018-771 du 5 sept. 2018"],
      sanctions: "Abondement correctif CPF 3 000 \u20AC si bilan 6 ans non tenu (\u226550 sal.).",
      lien: "https://www.moncompteformation.gouv.fr",
      impact: "Toutes PME. Outil de fid\xE9lisation et d'attractivit\xE9 RH.",
      tags: ["CPF", "formation", "OPCO", "entretien professionnel"]
    },
    {
      id: "interessement",
      code: "Int\xE9ressement/Participation",
      titre: "Int\xE9ressement, Participation et \xC9pargne Salariale",
      type: "Loi fran\xE7aise",
      cat: "\xC9pargne salariale",
      dom: "Social",
      origine: "France",
      date: "1959-01-07",
      vigueur: "1959-01-07",
      statut: "En vigueur (r\xE9forme 2023)",
      seuils: "Participation obligatoire : \u226550 sal. Int\xE9ressement : toutes tailles depuis 2023 (simplification).",
      resume: "M\xE9canismes associant les salari\xE9s aux r\xE9sultats de l'entreprise. Avantages fiscaux et sociaux pour l'employeur et le salari\xE9.",
      obligations: ["Participation obligatoire \u226550 sal. (r\xE9sultat fiscal >0)", "Accord ou formule l\xE9gale de calcul de la r\xE9serve de participation", "Int\xE9ressement : accord collectif ou d\xE9cision unilat\xE9rale (TPE/PME)", "Blocage 5 ans sauf d\xE9blocage anticip\xE9", "PEE obligatoire si participation", "Fonds ISR obligatoire dans le PEE"],
      articles: ["Art. L.3311-1 \xE0 L.3315-5 CT \u2014 Int\xE9ressement", "Art. L.3321-1 \xE0 L.3326-2 CT \u2014 Participation", "Art. L.3332-1 \xE0 L.3332-28 CT \u2014 PEE", "Loi n\xB02023-1107 du 29 nov. 2023 (simplification)"],
      sanctions: "Participation non vers\xE9e : redressement URSSAF + int\xE9r\xEAts de retard.",
      lien: "https://travail-emploi.gouv.fr/dialogue-social/accords-collectifs/article/l-epargne-salariale",
      impact: "Toutes tailles. Levier puissant d'attractivit\xE9 et de fid\xE9lisation RH.",
      tags: ["int\xE9ressement", "participation", "PEE", "\xE9pargne salariale", "ISR"]
    },
    {
      id: "mobilite",
      code: "Plan Mobilit\xE9",
      titre: "Plan de Mobilit\xE9 Employeur (PDME)",
      type: "Loi fran\xE7aise",
      cat: "Mobilit\xE9",
      dom: "Environnement",
      origine: "France",
      date: "2021-08-22",
      vigueur: "2023-09-01",
      statut: "En vigueur",
      seuils: "\u226550 sal. sur un m\xEAme site.",
      resume: "Plan de mobilit\xE9 pour r\xE9duire les \xE9missions li\xE9es aux d\xE9placements. Forfait mobilit\xE9s durables jusqu'\xE0 800\u20AC/an d\xE9fiscalis\xE9.",
      obligations: ["Diagnostic des d\xE9placements domicile-travail", "Plan d'actions avec objectifs de r\xE9duction", "Consultation du CSE", "FMD jusqu'\xE0 800\u20AC/an d\xE9fiscalis\xE9", "50% transports en commun pris en charge (obligatoire)"],
      articles: ["Art. L.1214-8-2 Code des transports", "Art. L.3261-3-1 CT \u2014 Forfait mobilit\xE9s durables", "D\xE9cret n\xB02020-541 du 9 mai 2020", "Art. 82-84 Loi Climat n\xB02021-1104"],
      sanctions: "Proc\xE9dure de mise en conformit\xE9 en cours.",
      lien: "https://www.ecologie.gouv.fr/plan-mobilite-employeur",
      impact: "D\xE8s 50 sal. FMD = avantage RH non charg\xE9.",
      tags: ["mobilit\xE9", "FMD", "transports", "v\xE9lo", "co-voiturage"]
    },
    // ENVIRONNEMENT
    {
      id: "beges",
      code: "BEGES",
      titre: "Bilan des \xC9missions de Gaz \xE0 Effet de Serre",
      type: "D\xE9cret fran\xE7ais",
      cat: "Carbone",
      dom: "Environnement",
      origine: "France",
      date: "2011-07-11",
      vigueur: "2012-01-01",
      statut: "En vigueur",
      seuils: ">500 sal. m\xE9tropole (>250 DROM). Recommand\xE9 50-499 sal. depuis Loi Climat 2021.",
      resume: "Bilan GES tous les 4 ans. Scope 1 et 2 obligatoires, Scope 3 recommand\xE9. Plan de transition obligatoire depuis 2021.",
      obligations: ["Bilan Scope 1 : \xE9missions directes", "Bilan Scope 2 : \xE9missions indirectes (\xE9nergie)", "Plan de transition associ\xE9 (obligatoire depuis 2021)", "Publication sur bilans-ges.ademe.fr", "Mise \xE0 jour tous les 4 ans"],
      articles: ["Art. L.229-25 Code de l'environnement", "Art. R.229-45 \xE0 R.229-56 Code env.", "D\xE9cret n\xB02011-829 du 11 juillet 2011", "Art. 301-303 Loi Climat 2021 \u2014 plan de transition", "Guide ADEME Bilan GES v4 (2022)"],
      sanctions: "Amende 10 000 \u20AC (+ 20 000 \u20AC si r\xE9cidive) en cas d'absence de publication.",
      lien: "https://www.ecologie.gouv.fr/bilan-des-emissions-gaz-effet-serre",
      impact: "PME <500 sal. non soumises l\xE9galement mais recommand\xE9 pour appels d'offres.",
      tags: ["BEGES", "GES", "carbone", "Scope", "ADEME"]
    },
    {
      id: "climatresilience",
      code: "Loi Climat",
      titre: "Loi Climat et R\xE9silience",
      type: "Loi fran\xE7aise",
      cat: "Environnement",
      dom: "Environnement",
      origine: "France",
      date: "2021-08-22",
      vigueur: "2021-08-24",
      statut: "En vigueur",
      seuils: "Variable. Plan mobilit\xE9 : \u226550 sal./site. D\xE9cret tertiaire : \u22651 000 m\xB2. March\xE9s publics : toutes tailles.",
      resume: "305 articles issus de la Convention Citoyenne pour le Climat. Consommation, production, transports, logement, justice climatique.",
      obligations: ["BEGES \xE9tendu aux 50-499 sal. (recommand\xE9)", "Plan mobilit\xE9 \u226550 sal./site (avant 01/09/2023)", "Crit\xE8res environnementaux march\xE9s publics (21%)", "Formation managers aux enjeux climatiques", "ZAN \u2014 Z\xE9ro Artificialisation Nette 2050"],
      articles: ["Art. 301-303 Loi Climat \u2014 BEGES PME", "Art. 82-84 Loi Climat \u2014 Plan mobilit\xE9", "Art. 26 \u2014 March\xE9s publics environnementaux", "Art. 224-226 \u2014 Formation managers", "Art. 191-199 \u2014 ZAN"],
      sanctions: "DPE frauduleux : 3 000 \u20AC. Variable selon infractions.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000043956924",
      impact: "Plan mobilit\xE9 d\xE8s 50 sal. D\xE9cret tertiaire si locaux \u22651 000 m\xB2.",
      tags: ["Loi Climat", "GES", "mobilit\xE9", "ZAN", "DPE"]
    },
    {
      id: "agec",
      code: "Loi AGEC",
      titre: "Loi Anti-Gaspillage pour une \xC9conomie Circulaire",
      type: "Loi fran\xE7aise",
      cat: "\xC9conomie circulaire",
      dom: "Environnement",
      origine: "France",
      date: "2020-02-10",
      vigueur: "2020-02-10",
      statut: "En vigueur",
      seuils: "Variable. Indice r\xE9parabilit\xE9 : fabricants. REP : metteurs sur le march\xE9. Don alimentaire : GMS >400m\xB2.",
      resume: "\xC9conomie circulaire : 5R, plastiques, indice r\xE9parabilit\xE9, fili\xE8res REP \xE9tendues.",
      obligations: ["Interdiction plastiques \xE0 usage unique (progressif 2020-2025)", "Indice de r\xE9parabilit\xE9 sur produits \xE9lectriques", "Extension fili\xE8res REP", "Interdiction destruction invendus", "Information environnementale produits"],
      articles: ["Art. L.541-10 Code env. \u2014 REP", "Art. 13 AGEC \u2014 Indice r\xE9parabilit\xE9", "Art. 17 AGEC \u2014 Information consommateurs", "Art. 24 AGEC \u2014 Invendus interdits", "D\xE9cret n\xB02021-1342 \u2014 REP emballages"],
      sanctions: "3 000 \u20AC pour indice r\xE9parabilit\xE9 absent. Sanctions REP variables.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000041553759",
      impact: "Fabricants, distributeurs, restaurateurs selon activit\xE9.",
      tags: ["AGEC", "REP", "r\xE9parabilit\xE9", "plastique", "\xE9conomie circulaire"]
    },
    {
      id: "decrettertiaire",
      code: "D\xE9cret Tertiaire",
      titre: "D\xE9cret \xC9co-\xC9nergie Tertiaire",
      type: "D\xE9cret fran\xE7ais",
      cat: "\xC9nergie",
      dom: "Environnement",
      origine: "France",
      date: "2019-07-23",
      vigueur: "2021-09-30",
      statut: "En vigueur",
      seuils: "B\xE2timents ou parties \xE0 usage tertiaire \u22651 000 m\xB2.",
      resume: "-40% consommation \xE9nerg\xE9tique en 2030, -50% en 2040, -60% en 2050 vs. ann\xE9e de r\xE9f\xE9rence. D\xE9claration annuelle sur OPERAT.",
      obligations: ["D\xE9claration annuelle sur OPERAT (ADEME)", "Ann\xE9e de r\xE9f\xE9rence d\xE9finie (2010-2019)", "Objectifs : -40% en 2030 / -50% en 2040 / -60% en 2050", "Plan d'actions technique et comportemental"],
      articles: ["Art. L.174-1 Code construction", "D\xE9cret n\xB02019-771 du 23 juillet 2019", "Arr\xEAt\xE9 du 10 avril 2020 (valeurs absolues)", "Arr\xEAt\xE9 du 24 nov. 2020 (plateforme OPERAT)"],
      sanctions: "Name and shame : liste publique des d\xE9faillants.",
      lien: "https://operat.ademe.fr",
      impact: "PME propri\xE9taire ou locataire de locaux \u22651 000 m\xB2.",
      tags: ["D\xE9cret Tertiaire", "\xE9nergie", "OPERAT", "b\xE2timent", "-40%"]
    },
    {
      id: "taxonomy",
      code: "Taxonomie UE",
      titre: "R\xE8glement Taxonomie Verte Europ\xE9enne",
      type: "R\xE8glement UE",
      cat: "Finance durable",
      dom: "Environnement",
      origine: "UE",
      date: "2020-06-18",
      vigueur: "2022-01-01",
      statut: "En vigueur",
      seuils: "Entreprises >500 sal. soumises CSRD + \xE9tablissements financiers.",
      resume: "Classification des activit\xE9s \xE9conomiques durables. Divulgation % CA, CapEx, OpEx align\xE9s. Principe DNSH.",
      obligations: ["% CA align\xE9 taxonomie", "% CapEx align\xE9 taxonomie", "% OpEx align\xE9 taxonomie", "Principe DNSH pour 6 objectifs", "Garanties sociales minimales (droits fondamentaux OCDE)"],
      articles: ["R\xE8glement UE 2020/852", "R\xE8glement d\xE9l\xE9gu\xE9 UE 2021/2139 (crit\xE8res CC)", "Art. 8 Taxonomie \u2014 Divulgation", "Actes d\xE9l\xE9gu\xE9s 2023 \u2014 4 autres objectifs"],
      sanctions: "Via CSRD et SFDR. Responsabilit\xE9 de la direction.",
      lien: "https://finance.ec.europa.eu/sustainable-finance/tools-and-standards/eu-taxonomy-sustainable-activities_fr",
      impact: "Indirect. Vos clients/investisseurs peuvent vous demander vos donn\xE9es d'alignement.",
      tags: ["taxonomie", "finance verte", "DNSH", "alignement"]
    },
    {
      id: "icpe",
      code: "ICPE",
      titre: "Installations Class\xE9es pour la Protection de l'Environnement",
      type: "Loi fran\xE7aise",
      cat: "Environnement industriel",
      dom: "Environnement",
      origine: "France",
      date: "1976-07-19",
      vigueur: "1976-07-19",
      statut: "En vigueur",
      seuils: "Toute installation pr\xE9sentant des risques ou nuisances pour l'environnement. Nomenclature ICPE variable selon activit\xE9.",
      resume: "R\xE9gime d'autorisation, d'enregistrement ou de d\xE9claration selon les risques de l'installation. Inspection des installations class\xE9es.",
      obligations: ["D\xE9claration, enregistrement ou autorisation pr\xE9fectorale selon la nomenclature", "\xC9tude d'impact environnemental", "Plan de pr\xE9vention des risques", "Surveillance des \xE9missions", "Rapport annuel \xE0 l'inspection des installations class\xE9es"],
      articles: ["Art. L.511-1 \xE0 L.514-12 Code de l'environnement", "Art. R.511-9 Code env. \u2014 Nomenclature ICPE", "D\xE9cret n\xB077-1133 du 21 sept. 1977 (codifi\xE9)", "Directive IED 2010/75/UE (grandes installations)"],
      sanctions: "Amende jusqu'\xE0 75 000 \u20AC + 2 ans d'emprisonnement pour exploitation sans autorisation.",
      lien: "https://www.georisques.gouv.fr/risques/installations",
      impact: "PME industrielles, artisanales, agricoles. V\xE9rifier la nomenclature selon votre activit\xE9.",
      tags: ["ICPE", "industrie", "pollution", "autorisation", "inspection"]
    },
    {
      id: "industrie_verte",
      code: "Loi Industrie Verte",
      titre: "Loi Industrie Verte \u2014 R\xE9industrialisation",
      type: "Loi fran\xE7aise",
      cat: "Transition industrielle",
      dom: "Environnement",
      origine: "France",
      date: "2023-10-23",
      vigueur: "2024-01-01",
      statut: "En vigueur",
      seuils: "Variable selon les mesures. Finance verte : toutes tailles. Sobri\xE9t\xE9 : secteurs industriels.",
      resume: "Acc\xE9l\xE8re la r\xE9industrialisation verte en France. Finance verte, acc\xE8s au foncier industriel, sobri\xE9t\xE9 \xE9nerg\xE9tique, d\xE9carbonation.",
      obligations: ["Plan de sobri\xE9t\xE9 et d\xE9carbonation pour industries \xE9nergivores", "Labels bas-carbone pour l'industrie", "Fonds vert pour PME industrielles (subventions)", "Acc\xE8s facilit\xE9 au foncier industriel", "Int\xE9gration de crit\xE8res ESG dans les march\xE9s publics industriels"],
      articles: ["Loi n\xB02023-973 du 23 octobre 2023", "Art. 35 \u2014 D\xE9carbonation des sites industriels", "Art. 47 \u2014 Finance verte dans l'\xE9pargne salariale", "Art. 12 \u2014 Acc\xE9l\xE9ration proc\xE9dures permis"],
      sanctions: "Variables selon les mesures sp\xE9cifiques.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000048127757",
      impact: "PME industrielles : acc\xE8s \xE0 des financements verts et simplification administrative.",
      tags: ["industrie verte", "d\xE9carbonation", "r\xE9industrialisation", "finance verte"]
    },
    {
      id: "reach",
      code: "REACH",
      titre: "REACH \u2014 Enregistrement des Substances Chimiques",
      type: "R\xE8glement UE",
      cat: "Chimie",
      dom: "Environnement",
      origine: "UE",
      date: "2006-12-18",
      vigueur: "2008-06-01",
      statut: "En vigueur",
      seuils: "Fabricants et importateurs de substances chimiques >1 tonne/an. Utilisateurs en aval concern\xE9s.",
      resume: "Enregistrement, \xE9valuation, autorisation et restriction des substances chimiques. Substitution des substances les plus dangereuses (SVHC).",
      obligations: ["Enregistrement des substances >1 t/an aupr\xE8s de l'ECHA", "Fiche de donn\xE9es de s\xE9curit\xE9 (FDS) actualis\xE9e", "Identification des substances extr\xEAmement pr\xE9occupantes (SVHC)", "Autorisation pour les substances de la Liste d'autorisation (Annexe XIV)", "Communication tout au long de la cha\xEEne d'approvisionnement"],
      articles: ["R\xE8glement CE n\xB01907/2006 \u2014 REACH", "Art. 31 REACH \u2014 Fiche de donn\xE9es de s\xE9curit\xE9", "Art. 57 REACH \u2014 Substances extr\xEAmement pr\xE9occupantes", "R\xE8glement CLP n\xB01272/2008 \u2014 Classification"],
      sanctions: "Amendes jusqu'\xE0 150 000 \u20AC + interdiction de commercialisation (droit national).",
      lien: "https://echa.europa.eu/fr/regulations/reach/understanding-reach",
      impact: "PME utilisant, fabriquant ou important des produits chimiques. Secteurs : cosm\xE9tique, textile, peinture, m\xE9tallurgie.",
      tags: ["REACH", "chimie", "SVHC", "substances", "FDS"]
    },
    {
      id: "re2020",
      code: "RE2020",
      titre: "R\xE9glementation Environnementale des B\xE2timents 2020",
      type: "Arr\xEAt\xE9 fran\xE7ais",
      cat: "Construction",
      dom: "Environnement",
      origine: "France",
      date: "2021-08-04",
      vigueur: "2022-01-01",
      statut: "En vigueur",
      seuils: "B\xE2timents neufs r\xE9sidentiels et tertiaires. R\xE9novation : extension et sur\xE9l\xE9vation.",
      resume: "R\xE9glementation thermique et carbone pour les b\xE2timents neufs. Remplace la RT2012. Seuils carbone progressifs jusqu'en 2031.",
      obligations: ["Bilan carbone du b\xE2timent (\xE9nergie grise et usage)", "Performance \xE9nerg\xE9tique am\xE9lior\xE9e vs RT2012", "Confort d'\xE9t\xE9 renforc\xE9 (sans climatisation)", "Indicateurs : Bbio, Cep, Ic Construction, Ic Energie", "Seuils carbone resserr\xE9s en 2025, 2028, 2031"],
      articles: ["Arr\xEAt\xE9 du 4 ao\xFBt 2021 (RE2020)", "Art. R.172-1 \xE0 R.172-25 Code de la construction", "D\xE9cret n\xB02021-1004 du 29 juillet 2021"],
      sanctions: "Non-conformit\xE9 : refus de permis de construire. Responsabilit\xE9 d\xE9cennale.",
      lien: "https://www.ecologie.gouv.fr/reglementation-environnementale-re2020",
      impact: "PME du secteur de la construction et de l'immobilier. Ma\xEEtres d'ouvrage.",
      tags: ["RE2020", "b\xE2timent", "carbone", "\xE9nergie", "construction"]
    },
    {
      id: "egalim",
      code: "Loi EGAlim",
      titre: "Loi EGAlim \u2014 Alimentation Responsable",
      type: "Loi fran\xE7aise",
      cat: "Alimentation",
      dom: "Environnement",
      origine: "France",
      date: "2018-10-30",
      vigueur: "2019-01-01",
      statut: "En vigueur (renforc\xE9 EGAlim 2)",
      seuils: "Restauration collective publique (50% produits durables dont 20% bio). GMS : don alimentaire.",
      resume: "Alimentation durable dans la restauration collective. 50% produits durables/locaux dont 20% bio. R\xE9duction plastiques. Menus v\xE9g\xE9tariens.",
      obligations: ["50% produits durables dont 20% bio en restauration collective publique", "Menu v\xE9g\xE9tarien quotidien en restauration collective", "Don alimentaire pour GMS >400m\xB2 (art. L.541-15-6 Code env.)", "R\xE9duction des emballages plastiques alimentaires", "Interdiction des contenants en plastique dans les cantines scolaires"],
      articles: ["Loi n\xB02018-938 du 30 oct. 2018 (EGAlim)", "Loi n\xB02021-1357 du 18 oct. 2021 (EGAlim 2)", "Art. L.230-5-1 Code rural (50% produits durables)", "Art. L.541-15-6 Code env. (don alimentaire)"],
      sanctions: "Contr\xF4les DGAL et DGCCRF. Amendes pour non-conformit\xE9.",
      lien: "https://www.legifrance.gouv.fr/loi/id/JORFTEXT000037547946",
      impact: "PME de restauration collective, traiteurs, cantines d'entreprise.",
      tags: ["EGAlim", "alimentation", "bio", "restauration", "don alimentaire"]
    },
    {
      id: "cbam",
      code: "CBAM",
      titre: "M\xE9canisme d'Ajustement Carbone aux Fronti\xE8res",
      type: "R\xE8glement UE",
      cat: "Carbone",
      dom: "Environnement",
      origine: "UE",
      date: "2023-05-10",
      vigueur: "2026-01-01",
      statut: "Phase transitoire jusqu'au 31/12/2025",
      seuils: "Importateurs de ciment, acier/fer, aluminium, engrais, \xE9lectricit\xE9, hydrog\xE8ne.",
      resume: "Taxe carbone sur les importations \xE0 forte intensit\xE9 carbone. \xC9vite les fuites de carbone. D\xE9claration trimestrielle en phase transitoire.",
      obligations: ["D\xE9claration trimestrielle des \xE9missions incorpor\xE9es (transitoire)", "Achat de certificats CBAM d\xE8s 2026", "Rapport annuel v\xE9rifi\xE9 par OTI accr\xE9dit\xE9", "Enregistrement aupr\xE8s de l'autorit\xE9 nationale", "Tra\xE7abilit\xE9 des \xE9missions cha\xEEne d'approvisionnement"],
      articles: ["R\xE8glement UE 2023/956 du 10 mai 2023", "R\xE8glement d'ex\xE9cution UE 2023/1773 (transitoire)", "Art. 3 CBAM \u2014 D\xE9finitions", "Art. 5 CBAM \u2014 Autorisation importateur"],
      sanctions: "100 \u20AC par tonne de CO\u2082 non d\xE9clar\xE9e en phase transitoire.",
      lien: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_fr",
      impact: "PME importatrices des secteurs cit\xE9s. R\xE9vision cha\xEEnes d'approvisionnement n\xE9cessaire.",
      tags: ["CBAM", "carbone", "importation", "fronti\xE8res", "acier", "aluminium"]
    },
    {
      id: "eudr",
      code: "EUDR",
      titre: "R\xE8glement Anti-D\xE9forestation (EUDR)",
      type: "R\xE8glement UE",
      cat: "Biodiversit\xE9",
      dom: "Environnement",
      origine: "UE",
      date: "2023-06-29",
      vigueur: "2025-12-30",
      statut: "En vigueur (application d\xE9cal\xE9e)",
      seuils: "Op\xE9rateurs et commer\xE7ants de : bovins, cacao, caf\xE9, huile de palme, soja, bois, caoutchouc et produits d\xE9riv\xE9s.",
      resume: "Interdit la mise sur le march\xE9 de produits li\xE9s \xE0 la d\xE9forestation apr\xE8s le 31 d\xE9cembre 2020. Tra\xE7abilit\xE9 g\xE9olocalis\xE9e exig\xE9e.",
      obligations: ["G\xE9olocalisation des parcelles de production", "D\xE9claration de diligence raisonn\xE9e", "Tra\xE7abilit\xE9 document\xE9e cha\xEEne d'approvisionnement", "\xC9valuation du risque de d\xE9forestation"],
      articles: ["R\xE8glement UE 2023/1115 du 31 mai 2023", "Art. 8 EUDR \u2014 Diligence raisonn\xE9e", "Art. 10 EUDR \u2014 Classification pays par risque", "Art. 19 EUDR \u2014 Sanctions"],
      sanctions: "Amendes \u22654% CA annuel UE + confiscation produits.",
      lien: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R1115",
      impact: "PME fili\xE8res agro-alimentaires, bois, ameublement, caoutchouc.",
      tags: ["EUDR", "d\xE9forestation", "biodiversit\xE9", "soja", "bois", "tra\xE7abilit\xE9"]
    },
    // STANDARDS INTERNATIONAUX
    {
      id: "gri",
      code: "GRI Standards",
      titre: "Global Reporting Initiative Standards",
      type: "Standard international",
      cat: "Reporting",
      dom: "Transversal",
      origine: "International",
      date: "2021-10-05",
      vigueur: "2023-01-01",
      statut: "R\xE9f\xE9rence internationale",
      seuils: "Volontaire \u2014 toute organisation.",
      resume: "R\xE9f\xE9rentiel mondial de reporting durabilit\xE9. GRI 1-3 (Universal) + th\xE9matiques 200-400. Align\xE9 sur les ESRS.",
      obligations: ["GRI 1 : Fondements", "GRI 2 : Informations g\xE9n\xE9rales (gouvernance, strat\xE9gie)", "GRI 3 : Mat\xE9rialit\xE9", "GRI 200-300-400 : \xC9conomique, Environnemental, Social"],
      articles: ["GRI 1 Foundation 2021", "GRI 2 General Disclosures 2021", "GRI 3 Material Topics 2021", "GRI 302 Energy", "GRI 305 Emissions", "GRI 401 Employment", "GRI 405 Diversity"],
      sanctions: "Aucune \u2014 standard volontaire.",
      lien: "https://www.globalreporting.org/standards/",
      impact: "R\xE9f\xE9rentiel id\xE9al pour structurer le reporting avant la CSRD.",
      tags: ["GRI", "reporting", "mat\xE9rialit\xE9", "international"]
    },
    {
      id: "iso14001",
      code: "ISO 14001:2015",
      titre: "ISO 14001 \u2014 Syst\xE8me de Management Environnemental",
      type: "Norme internationale",
      cat: "Management",
      dom: "Environnement",
      origine: "International",
      date: "2015-09-15",
      vigueur: "2018-09-14",
      statut: "En vigueur",
      seuils: "Volontaire \u2014 toute organisation.",
      resume: "SME (Syst\xE8me de Management Environnemental). Approche PDCA. Certification reconnue dans les march\xE9s publics.",
      obligations: ["Politique environnementale document\xE9e", "Analyse des aspects et impacts environnementaux", "Objectifs environnementaux SMART", "Formation et sensibilisation", "Audit interne et revue de direction"],
      articles: ["Norme ISO 14001:2015 \u2014 Chapitres 4 \xE0 10", "ISO 14004:2016 \u2014 Lignes directrices", "ISO 19011:2018 \u2014 Audit de SME"],
      sanctions: "Aucune \u2014 volontaire.",
      lien: "https://www.iso.org/fr/iso-14001-environmental-management.html",
      impact: "Tr\xE8s accessible aux PME. Valoris\xE9 dans les appels d'offres. Facilite la CSRD E1-E5.",
      tags: ["ISO 14001", "SME", "certification", "management environnemental"]
    },
    {
      id: "iso26000",
      code: "ISO 26000",
      titre: "ISO 26000 \u2014 Responsabilit\xE9 Soci\xE9tale",
      type: "Norme internationale",
      cat: "RSE",
      dom: "Transversal",
      origine: "International",
      date: "2010-11-01",
      vigueur: "2010-11-01",
      statut: "Lignes directrices",
      seuils: "Toute organisation.",
      resume: "7 questions centrales de la RSO. Lignes directrices non certifiables.",
      obligations: ["1 \u2014 Gouvernance", "2 \u2014 Droits de l'homme", "3 \u2014 Conditions de travail", "4 \u2014 Environnement", "5 \u2014 Loyaut\xE9 des pratiques", "6 \u2014 Consommateurs", "7 \u2014 Communaut\xE9s locales"],
      articles: ["Norme ISO 26000:2010 \u2014 Chapitre 6 (7 questions)", "Chapitre 7 \u2014 Int\xE9gration RSO", "Annexe A \u2014 Correspondances GRI/UNGC"],
      sanctions: "Aucune \u2014 lignes directrices.",
      lien: "https://www.iso.org/fr/iso-26000-social-responsibility.html",
      impact: "R\xE9f\xE9rentiel de structuration RSE id\xE9al. Compatible GRI et ESRS.",
      tags: ["ISO 26000", "RSE", "7 questions", "parties prenantes"]
    },
    {
      id: "ungc",
      code: "Pacte Mondial ONU",
      titre: "United Nations Global Compact \u2014 10 Principes",
      type: "Engagement volontaire",
      cat: "RSE",
      dom: "Transversal",
      origine: "International",
      date: "2000-07-26",
      vigueur: "2000-07-26",
      statut: "Engagement volontaire",
      seuils: "Volontaire \u2014 toute organisation.",
      resume: "10 principes universels sur les droits de l'homme, les conditions de travail, l'environnement et la lutte contre la corruption. Communication on Progress annuelle.",
      obligations: ["2 principes Droits de l'homme (D\xE9claration ONU)", "4 principes Travail (conventions OIT)", "3 principes Environnement (approche de pr\xE9caution)", "1 principe Anticorruption", "Communication on Progress (COP) annuelle"],
      articles: ["UNGC 10 principes (2000)", "D\xE9claration universelle des droits de l'homme", "Conventions OIT fondamentales", "Accord de Rio sur l'environnement"],
      sanctions: "Exclusion du r\xE9seau si pas de COP depuis 2 ans.",
      lien: "https://www.unglobalcompact.org",
      impact: "Signal fort d'engagement RSE. Reconnu par les acheteurs et investisseurs internationaux.",
      tags: ["Pacte Mondial", "ONU", "UNGC", "droits humains", "10 principes"]
    },
    {
      id: "ruggie",
      code: "Principes Ruggie",
      titre: "Principes Directeurs ONU Entreprises & Droits de l'Homme",
      type: "Cadre de r\xE9f\xE9rence",
      cat: "Droits humains",
      dom: "Gouvernance",
      origine: "International",
      date: "2011-06-16",
      vigueur: "2011-06-16",
      statut: "R\xE9f\xE9rence internationale",
      seuils: "Volontaire \u2014 toute entreprise.",
      resume: "Cadre de r\xE9f\xE9rence ONU en 3 piliers : obligation des \xC9tats de prot\xE9ger, responsabilit\xE9 des entreprises de respecter, acc\xE8s aux voies de recours.",
      obligations: ["Pilier 1 \u2014 Obligation des \xC9tats de prot\xE9ger", "Pilier 2 \u2014 Responsabilit\xE9 des entreprises de respecter les droits humains", "Pilier 3 \u2014 Acc\xE8s des victimes aux voies de recours", "Due diligence droits de l'homme", "M\xE9canisme de r\xE9clamation non judiciaire"],
      articles: ["R\xE9solution ONU A/HRC/17/31 (2011)", "Principes directeurs 11 \xE0 24 \u2014 Responsabilit\xE9 des entreprises", "Principe directeur 17 \u2014 Due diligence droits humains"],
      sanctions: "Aucune directement \u2014 r\xE9f\xE9rence pour le contentieux strat\xE9gique.",
      lien: "https://www.ohchr.org/fr/business-and-human-rights",
      impact: "Socle de la Loi Vigilance et de la CSDDD. R\xE9f\xE9rence pour le reporting ESRS S2.",
      tags: ["Ruggie", "droits humains", "ONU", "due diligence", "vigilance"]
    },
    {
      id: "ecovadis",
      code: "EcoVadis",
      titre: "EcoVadis \u2014 \xC9valuation RSE Fournisseurs",
      type: "Standard march\xE9",
      cat: "Cha\xEEne de valeur",
      dom: "Transversal",
      origine: "International",
      date: "2007-01-01",
      vigueur: "2007-01-01",
      statut: "R\xE9f\xE9rence march\xE9",
      seuils: "Demand\xE9 par les grands donneurs d'ordres \xE0 leurs fournisseurs.",
      resume: "\xC9valuation RSE sur 4 th\xE8mes. Score 0-100. +80 000 entreprises dans 175 pays.",
      obligations: ["Questionnaire RSE document\xE9 avec preuves", "Politique environnementale formalis\xE9e", "Indicateurs sociaux et RH document\xE9s", "Politique anticorruption", "Renouvellement annuel"],
      articles: ["M\xE9thodologie EcoVadis 2024 (GRI, ISO 26000, UNGC, ESRS)", "Scorecard EcoVadis \u2014 Pond\xE9ration par th\xE8me", "ESRS S2 \u2014 Lien direct avec \xE9valuation fournisseurs"],
      sanctions: "Aucune \u2014 \xE9valuation commerciale. Risque de perte de contrat.",
      lien: "https://ecovadis.com/fr/",
      impact: "Grands groupes exigent EcoVadis \xE0 leurs PME fournisseurs (>100k\u20AC/an).",
      tags: ["EcoVadis", "fournisseurs", "notation RSE", "CSRD S2"]
    },
    {
      id: "tcfd",
      code: "TCFD",
      titre: "Task Force on Climate-related Financial Disclosures",
      type: "Cadre de r\xE9f\xE9rence",
      cat: "Climat",
      dom: "Gouvernance",
      origine: "International",
      date: "2017-06-29",
      vigueur: "2017-01-01",
      statut: "Int\xE9gr\xE9 dans ESRS E1 et ISSB S2",
      seuils: "Recommandations int\xE9gr\xE9es dans la CSRD/ESRS.",
      resume: "4 piliers : Gouvernance, Strat\xE9gie, Gestion des risques, M\xE9triques et cibles. Int\xE9gr\xE9 dans l'ESRS E1.",
      obligations: ["Gouvernance : r\xF4le CA/direction sur les risques climatiques", "Strat\xE9gie : impacts risques/opportunit\xE9s court/moyen/long terme", "Gestion des risques : identification et \xE9valuation", "M\xE9triques : Scope 1, 2, 3", "Cibles : objectifs de r\xE9duction des \xE9missions", "Sc\xE9narios climatiques <2\xB0C et 4\xB0C"],
      articles: ["Rapport final TCFD 2017", "TCFD 2021 \u2014 Guidance transition plans", "ESRS E1 \u2014 Alignement TCFD", "ISSB IFRS S2 \u2014 Alignement TCFD"],
      sanctions: "Aucune directement \u2014 int\xE9gr\xE9 dans textes contraignants.",
      lien: "https://www.fsb-tcfd.org",
      impact: "Pr\xE9pare les informations climatiques requises par la CSRD/ESRS E1.",
      tags: ["TCFD", "climat", "sc\xE9narios", "risques", "transition"]
    },
    {
      id: "issb",
      code: "ISSB / IFRS S1-S2",
      titre: "Standards IFRS de Durabilit\xE9 (ISSB)",
      type: "Standard international",
      cat: "Reporting",
      dom: "Transversal",
      origine: "International",
      date: "2023-06-26",
      vigueur: "2024-01-01",
      statut: "Adoption nationale variable",
      seuils: "Standard global \u2014 adoption selon d\xE9cision nationale ou boursi\xE8re.",
      resume: "IFRS S1 (risques de durabilit\xE9 mat\xE9riels) et S2 (informations climatiques). Orient\xE9s investisseurs. Partiellement align\xE9s avec les ESRS.",
      obligations: ["IFRS S1 : Risques et opportunit\xE9s de durabilit\xE9 mat\xE9riels", "IFRS S2 : Risques climatiques physiques et de transition", "Horizons court, moyen et long terme", "Sc\xE9narios climatiques", "Scope 1, 2, 3 (GHG Protocol)", "Indicateurs sectoriels SASB"],
      articles: ["IFRS S1 General Requirements (juin 2023)", "IFRS S2 Climate-related Disclosures (juin 2023)", "SASB Standards \u2014 Sectoral Guidance"],
      sanctions: "Selon r\xE9glementation nationale adoptant les normes.",
      lien: "https://www.ifrs.org/groups/international-sustainability-standards-board/",
      impact: "Entreprises cot\xE9es et celles soumises CSRD concern\xE9es via les ESRS.",
      tags: ["ISSB", "IFRS", "S1", "S2", "investisseurs", "climatique"]
    }
  ];
  var RSE_LEGAL_MAP = {
    "Environnement": {
      lois: ["BEGES", "Loi Climat", "D\xE9cret Tertiaire", "Loi AGEC", "ISO 14001:2015", "CSRD", "Taxonomie UE"],
      articles: ["Art. L. 229-25 Code env. \u2014 Bilan GES", "Art. L. 174-1 CCH \u2014 D\xE9cret tertiaire", "Art. L. 541-10 Code env. \u2014 REP", "ESRS E1 \u2014 Changement climatique", "ESRS E2-E5 \u2014 Pollution, eau, biodiversit\xE9, circularit\xE9"],
      objectifsSugg\u00E9r\u00E9s: ["R\xE9duire les \xE9missions CO\u2082 de 30% d'ici {ann\xE9e}", "Atteindre {%}% d'\xE9nergies renouvelables d'ici {ann\xE9e}", "R\xE9duire la consommation \xE9nerg\xE9tique de 40% d'ici 2030 (D\xE9cret Tertiaire)", "Atteindre un taux de recyclage de 80% des d\xE9chets", "R\xE9aliser un Bilan Carbone Scope 1+2+3 annuel"]
    },
    "Social & RH": {
      lois: ["Index \xC9galit\xE9 F/H", "OETH", "Plan Mobilit\xE9", "Sant\xE9 au Travail", "Formation Pro", "Loi Vigilance"],
      articles: ["Art. L. 1142-8 CT \u2014 Index \xE9galit\xE9 professionnelle", "Art. L. 5212-1 CT \u2014 OETH 6%", "Art. R. 4121-1 CT \u2014 DUERP", "Art. L. 6315-1 CT \u2014 Entretien professionnel", "ESRS S1 \u2014 Personnel propre"],
      objectifsSugg\u00E9r\u00E9s: ["Atteindre un index \xE9galit\xE9 F/H \u2265 85/100 d'ici {ann\xE9e}", "Atteindre un taux OETH \u2265 6% d'ici {ann\xE9e}", "R\xE9duire le taux de turnover \xE0 moins de {%}%", "Atteindre {h} heures de formation par salari\xE9 par an", "Z\xE9ro accident du travail avec arr\xEAt d'ici {ann\xE9e}"]
    },
    "Gouvernance": {
      lois: ["Loi PACTE", "Loi Sapin II", "RGPD", "Loi Vigilance", "CS3D / CSDDD"],
      articles: ["Art. 1833 Code civil \u2014 Int\xE9r\xEAt social \xE9largi (Loi PACTE)", "Art. 17 Loi Sapin II \u2014 Programme anticorruption AFA", "Art. L. 225-102-4 Code com. \u2014 Plan de vigilance", "Art. 5 RGPD \u2014 Principes de traitement", "ESRS G1 \u2014 Conduite des affaires"],
      objectifsSugg\u00E9r\u00E9s: ["Inscrire une raison d'\xEAtre dans les statuts d'ici {ann\xE9e}", "Obtenir la certification soci\xE9t\xE9 \xE0 mission", "100% des salari\xE9s form\xE9s au code de conduite \xE9thique", "Mettre en place un dispositif d'alerte conforme Sapin II", "\xC9valuer 100% des fournisseurs strat\xE9giques sur crit\xE8res ESG"]
    },
    "Achats responsables": {
      lois: ["Loi Vigilance", "CS3D / CSDDD", "EcoVadis", "ISO 26000", "CSRD"],
      articles: ["Art. L. 225-102-4 Code com. \u2014 Plan de vigilance fournisseurs", "ESRS S2 \u2014 Travailleurs dans la cha\xEEne de valeur", "ESRS G1 \u2014 Loyaut\xE9 des pratiques", "Art. 26 Loi Climat \u2014 Crit\xE8res env. march\xE9s publics", "M\xE9thodologie EcoVadis \u2014 Achats responsables"],
      objectifsSugg\u00E9r\u00E9s: ["\xC9valuer 100% des fournisseurs >50k\u20AC/an sur crit\xE8res ESG", "Score EcoVadis minimum de 45/100 pour tous fournisseurs strat\xE9giques", "R\xE9duire les \xE9missions Scope 3 achats de {%}% d'ici {ann\xE9e}", "Int\xE9grer une clause ESG dans 100% des nouveaux contrats fournisseurs"]
    },
    "Diversit\xE9 & Inclusion": {
      lois: ["Index \xC9galit\xE9 F/H", "OETH", "Loi PACTE", "Sant\xE9 au Travail"],
      articles: ["Art. L. 1142-8 CT \u2014 Index \xE9galit\xE9 professionnelle", "Art. L. 5212-1 CT \u2014 OETH travailleurs handicap\xE9s", "Art. L. 1132-1 CT \u2014 Principe de non-discrimination", "Art. L. 1153-1 CT \u2014 Pr\xE9vention harc\xE8lement sexuel", "ESRS S1-6 \u2014 Diversit\xE9 et inclusion"],
      objectifsSugg\u00E9r\u00E9s: ["Atteindre {%}% de femmes dans les instances dirigeantes", "Augmenter le taux OETH \xE0 plus de 6%", "Index \xE9galit\xE9 F/H \u2265 85/100 d'ici {ann\xE9e}", "Z\xE9ro \xE9cart de r\xE9mun\xE9ration non justifi\xE9 entre F et H"]
    },
    "\xC9thique & Conformit\xE9": {
      lois: ["Loi Sapin II", "RGPD", "Loi PACTE", "Loi Vigilance"],
      articles: ["Art. 17 Loi Sapin II \u2014 8 piliers programme AFA", "Art. 8 Loi Sapin II / Loi Waserman \u2014 Dispositif d'alerte", "Art. 32 RGPD \u2014 S\xE9curit\xE9 des donn\xE9es", "Art. 1833 Code civil \u2014 Int\xE9r\xEAt social \xE9largi", "ESRS G1-4 \u2014 Pr\xE9vention de la corruption"],
      objectifsSugg\u00E9r\u00E9s: ["D\xE9ployer un dispositif d'alerte conforme Sapin II / Waserman", "100% des managers form\xE9s \xE0 l'anticorruption", "Audit de conformit\xE9 RGPD annuel", "Int\xE9grer un code \xE9thique dans le r\xE8glement int\xE9rieur"]
    },
    "Donn\xE9es & RGPD": {
      lois: ["RGPD", "Loi Sapin II", "CSRD"],
      articles: ["Art. 5 RGPD \u2014 Principes de lic\xE9it\xE9", "Art. 7 RGPD \u2014 Conditions du consentement", "Art. 13-14 RGPD \u2014 Information des personnes", "Art. 32 RGPD \u2014 S\xE9curit\xE9 du traitement", "Art. 33 RGPD \u2014 Notification de violations \xE0 la CNIL"],
      objectifsSugg\u00E9r\u00E9s: ["Registre de traitement \xE0 jour et document\xE9", "100% des cookies conformes (refus possible)", "Audit RGPD annuel par le DPO ou prestataire", "Z\xE9ro violation de donn\xE9es non notifi\xE9e dans les 72h"]
    },
    "Sant\xE9 & S\xE9curit\xE9": {
      lois: ["Sant\xE9 au Travail", "Formation Pro", "DPEF", "CSRD"],
      articles: ["Art. L. 4121-1 CT \u2014 Obligation g\xE9n\xE9rale de s\xE9curit\xE9", "Art. R. 4121-1 CT \u2014 DUERP et mise \xE0 jour", "Loi n\xB02021-1018 \u2014 R\xE9forme sant\xE9 au travail", "Art. L. 4624-1 CT \u2014 Suivi m\xE9dical individuel", "ESRS S1-3 \u2014 Sant\xE9 et s\xE9curit\xE9 au travail"],
      objectifsSugg\u00E9r\u00E9s: ["DUERP actualis\xE9 et num\xE9ris\xE9 \xE0 jour", "Taux de fr\xE9quence des accidents < {TF} d'ici {ann\xE9e}", "100% des salari\xE9s avec visite m\xE9dicale \xE0 jour", "D\xE9ployer un programme bien-\xEAtre et pr\xE9vention RPS"]
    }
  };
  var RSE_TEMPLATES = {
    "Environnement": `# Politique Environnementale

## 1. Engagement de la direction

La direction de [Nom de l'entreprise] s'engage \xE0 r\xE9duire son impact environnemental de mani\xE8re continue et mesurable, conform\xE9ment aux exigences de la loi Climat et R\xE9silience (n\xB02021-1104) et des normes ESRS E1 \xE0 E5.

## 2. Cadre r\xE9glementaire applicable

Cette politique s'inscrit dans le respect de :
- Loi Climat et R\xE9silience (22 ao\xFBt 2021) \u2014 Art. 301-303 sur les bilans GES des PME
- D\xE9cret \xC9co-\xC9nergie Tertiaire (2019-771) \u2014 si locaux \u22651 000 m\xB2
- Loi AGEC (10 f\xE9vrier 2020) \u2014 \xE9conomie circulaire et REP
- Norme ISO 14001:2015 \u2014 syst\xE8me de management environnemental

## 3. Objectifs mesurables

- R\xE9duire les \xE9missions de GES (Scope 1+2) de **30%** d'ici 2027 (base 2025)
- Atteindre **50%** d'\xE9nergies renouvelables d'ici 2026
- R\xE9duire la consommation \xE9nerg\xE9tique de **40%** d'ici 2030
- Atteindre un taux de recyclage des d\xE9chets de **80%** d'ici 2026

## 4. Gouvernance environnementale

Un r\xE9f\xE9rent environnement est d\xE9sign\xE9 et un comit\xE9 se r\xE9unit trimestriellement pour piloter la politique.

## 5. Plan d'action

- R\xE9aliser un Bilan Carbone\xAE ADEME annuel (Scope 1, 2 et 3)
- Publier le bilan sur la plateforme bilans-ges.ademe.fr
- Mettre en place un plan de mobilit\xE9 employeur (si \u226550 sal.)
- R\xE9aliser les d\xE9clarations OPERAT annuelles (si tertiaire \u22651 000 m\xB2)

## 6. Indicateurs de suivi

| Indicateur | Valeur cible | Fr\xE9quence |
|---|---|---|
| \xC9missions CO\u2082 (tCO\u2082eq) | -30% vs 2025 | Annuelle |
| % \xE9nergies renouvelables | 50% | Annuelle |
| Taux recyclage d\xE9chets | 80% | Semestrielle |

## 7. Communication

Cette politique est accessible \xE0 l'ensemble des collaborateurs et publi\xE9e sur notre site internet.`,
    "Social & RH": `# Politique Sociale et Ressources Humaines

## 1. Engagement

Nous nous engageons \xE0 offrir \xE0 tous nos collaborateurs des conditions de travail de qualit\xE9, conform\xE9ment aux obligations l\xE9gales (Code du travail, loi Sant\xE9 au Travail 2021) et aux exigences ESRS S1.

## 2. Cadre r\xE9glementaire

- Loi n\xB02021-1018 du 2 ao\xFBt 2021 \u2014 R\xE9forme sant\xE9 au travail (DUERP, mi-carri\xE8re)
- Art. L. 1142-8 Code du travail \u2014 Index \xE9galit\xE9 professionnelle F/H
- Art. L. 5212-1 Code du travail \u2014 OETH (\u226520 sal.)
- Art. L. 6315-1 Code du travail \u2014 Entretiens professionnels
- ESRS S1 \u2014 Main-d'\u0153uvre propre

## 3. \xC9galit\xE9 professionnelle

- Publication de l'index \xE9galit\xE9 F/H avant le 1er mars de chaque ann\xE9e
- Objectif : index \u2265 85/100 d'ici [ann\xE9e]
- Plan d'action correctif si index <75/100

## 4. Emploi et inclusion

- Taux OETH \u2265 6% (Art. L. 5212-1 CT)
- Programme d'int\xE9gration des travailleurs handicap\xE9s avec l'AGEFIPH
- Partenariats avec les ESAT et EA

## 5. Formation et d\xE9veloppement

- Entretien professionnel tous les 2 ans (Art. L. 6315-1 CT)
- Bilan professionnel \xE0 6 ans
- Objectif : [X] heures de formation par salari\xE9 par an

## 6. Sant\xE9 et s\xE9curit\xE9

- DUERP num\xE9ris\xE9 et actualis\xE9 (Art. R. 4121-1 CT)
- Programme de pr\xE9vention des risques psychosociaux
- Objectif : taux de fr\xE9quence accidents < [TF]`,
    "Gouvernance": `# Politique de Gouvernance et \xC9thique

## 1. Vision

Nous conduisons nos affaires avec int\xE9grit\xE9, transparence et dans le respect de toutes les parties prenantes, conform\xE9ment \xE0 l'article 1833 du Code civil (Loi PACTE) et aux exigences ESRS G1.

## 2. Cadre r\xE9glementaire

- Art. 1833 Code civil \u2014 Int\xE9r\xEAt social \xE9largi (Loi PACTE 2019)
- Art. 17 Loi Sapin II \u2014 Programme anticorruption AFA (si \u2265500 sal.)
- Loi n\xB02022-401 (Waserman) \u2014 Protection des lanceurs d'alerte
- RGPD \u2014 Protection des donn\xE9es personnelles
- ESRS G1 \u2014 Conduite des affaires

## 3. Anticorruption

- Code de conduite anticorruption int\xE9gr\xE9 au r\xE8glement int\xE9rieur
- Formation annuelle des salari\xE9s expos\xE9s
- Cartographie des risques actualis\xE9e annuellement
- [Si \u226550 sal.] : Dispositif d'alerte confidentiel op\xE9rationnel (loi Waserman)

## 4. Protection des donn\xE9es (RGPD)

- Registre des activit\xE9s de traitement \xE0 jour (Art. 30 RGPD)
- Politique de confidentialit\xE9 publi\xE9e
- DPO d\xE9sign\xE9 [si applicable]
- Audit de conformit\xE9 annuel

## 5. Transparence

- Publication du rapport ESG / DPEF / rapport de durabilit\xE9
- Dialogue r\xE9gulier avec les parties prenantes
- [Si soci\xE9t\xE9 \xE0 mission] : Rapport du comit\xE9 de mission

## 6. Indicateurs

- % de salari\xE9s form\xE9s au code \xE9thique : objectif 100%
- Fr\xE9quence des audits internes : [trimestrielle / semestrielle]
- Nombre de signalements re\xE7us et trait\xE9s`,
    "Achats responsables": `# Politique Achats Responsables

## 1. Ambition

Int\xE9grer des crit\xE8res ESG dans l'ensemble de nos d\xE9cisions d'achat, conform\xE9ment \xE0 nos obligations de vigilance (Loi du 27 mars 2017) et aux exigences ESRS S2.

## 2. Cadre r\xE9glementaire

- Loi n\xB02017-399 \u2014 Devoir de vigilance (Art. L. 225-102-4 Code com.)
- ESRS S2 \u2014 Travailleurs dans la cha\xEEne de valeur
- Art. 26 Loi Climat \u2014 Crit\xE8res env. dans les march\xE9s publics
- Directive CSDDD 2024/1760 \u2014 (anticipation \xE0 partir de 2027)

## 3. P\xE9rim\xE8tre et crit\xE8res

Cette politique s'applique \xE0 tous les achats >50 000 \u20AC annuels. Crit\xE8res de s\xE9lection :
- Score ESG (EcoVadis ou questionnaire interne) \u2265 45/100
- Certification ISO 14001 ou \xE9quivalent appr\xE9ci\xE9e
- Politique anticorruption document\xE9e
- Respect des droits fondamentaux au travail (OIT)
- Pays de production : \xE9valuation niveau de risque

## 4. Processus d'\xE9valuation

1. Questionnaire RSE envoy\xE9 \xE0 tous les fournisseurs strat\xE9giques annuellement
2. \xC9valuation EcoVadis pour les fournisseurs >100k\u20AC/an
3. Plan de progr\xE8s co-construit pour les fournisseurs sous 45/100

## 5. Objectifs

- 100% des fournisseurs strat\xE9giques \xE9valu\xE9s sur crit\xE8res ESG d'ici [ann\xE9e]
- Score EcoVadis moyen panel \u2265 55/100 d'ici [ann\xE9e]
- Clause ESG dans 100% des nouveaux contrats d'ici [ann\xE9e]`
  };
  var DEFAULT_DATA = {
    company: { name: "Mon Entreprise", siren: "", sector: "", taille: "PME", adresse: "", email: "", tel: "" },
    admin: { nom: "Lacavalerie", prenom: "Jahsan", email: "jahsan@lacavalerie.fr", role: "Fondateur & Cr\xE9ateur" },
    apiKey: "",
    employees: [
      { id: uid(), nom: "Dupont", prenom: "Marie", poste: "Responsable ESG", dept: "Direction", contrat: "CDI", dateEntree: "2021-03-15", email: "m.dupont@entreprise.fr", genre: "F", formation: 24, salaire: 52e3 },
      { id: uid(), nom: "Bernard", prenom: "Thomas", poste: "D\xE9veloppeur Full Stack", dept: "Tech", contrat: "CDI", dateEntree: "2022-06-01", email: "t.bernard@entreprise.fr", genre: "M", formation: 18, salaire: 48e3 },
      { id: uid(), nom: "Martin", prenom: "Sophie", poste: "Chef de projet", dept: "Op\xE9rations", contrat: "CDI", dateEntree: "2020-01-10", email: "s.martin@entreprise.fr", genre: "F", formation: 20, salaire: 55e3 },
      { id: uid(), nom: "Leroy", prenom: "Paul", poste: "Responsable Commercial", dept: "Commercial", contrat: "CDI", dateEntree: "2019-05-20", email: "p.leroy@entreprise.fr", genre: "M", formation: 12, salaire: 6e4 }
    ],
    postes: [
      { id: uid(), titre: "Responsable ESG", dept: "Direction", niveau: "Senior", description: "Pilotage de la strat\xE9gie d\xE9veloppement durable et reporting CSRD.", competences: "ESG, CSRD, reporting", contrat: "CDI", teletravail: true, ouvert: false },
      { id: uid(), titre: "Charg\xE9\xB7e RH", dept: "RH", niveau: "Junior", description: "Administration RH et recrutement.", competences: "SIRH, droit social, recrutement", contrat: "CDI", teletravail: false, ouvert: true }
    ],
    fournisseurs: [
      { id: uid(), nom: "GreenPrint SAS", categorie: "Impression", scoreESG: 78, evaluation: "Bon", certifications: "ISO 14001", contact: "contact@greenprint.fr", pays: "France", depuis: "2022", notes: "Papier recycl\xE9 certifi\xE9" },
      { id: uid(), nom: "CleanEnergy Co.", categorie: "\xC9nergie", scoreESG: 91, evaluation: "Excellent", certifications: "RE2020, ISO 50001", contact: "pro@cleanenergy.fr", pays: "France", depuis: "2023", notes: "100% renouvelable" },
      { id: uid(), nom: "TechSupply SARL", categorie: "Mat\xE9riel IT", scoreESG: 52, evaluation: "Moyen", certifications: "", contact: "info@techsupply.fr", pays: "France", depuis: "2020", notes: "\xC0 r\xE9\xE9valuer sur crit\xE8res sociaux" }
    ],
    documents: [
      { id: uid(), nom: "Politique RSE 2025.pdf", type: "Politique", date: "2025-01-15", taille: "2.4 Mo", tag: "RSE" },
      { id: uid(), nom: "Bilan Carbone 2024.pdf", type: "Rapport", date: "2024-12-20", taille: "1.8 Mo", tag: "Environnement" },
      { id: uid(), nom: "Index \xC9galit\xE9 F/H 2025.xlsx", type: "Donn\xE9es", date: "2025-03-01", taille: "0.3 Mo", tag: "Social" }
    ],
    esg: {
      env: { energie: "148000", renouvelable: "38", co2: "210", eau: "2400", dechets: "68", scope3: "620" },
      soc: { ecartSalaire: "7.2", formation: "21", turnover: "9.5", accidents: "2.1", handicap: "4.1", satisfaction: "78" },
      gov: { femmesDirigeantes: "44", ethique: "82", auditFreq: "annual", whistleblower: true, fournisseursEvalues: "65" }
    },
    rse: {
      politiques: [
        { id: uid(), titre: "Politique Environnementale", type: "Environnement", statut: "Publi\xE9", responsable: "Marie Dupont", dateCreation: "2025-01-15", dateMaj: "2025-03-10", contenu: RSE_TEMPLATES["Environnement"], objectifs: [{ id: uid(), titre: "R\xE9duire \xE9missions CO\u2082 de 30%", echeance: "2027-12-31", avancement: 25, indicateur: "tCO\u2082" }, { id: uid(), titre: "50% \xE9nergies renouvelables", echeance: "2026-12-31", avancement: 38, indicateur: "%" }], version: "1.2" }
      ]
    },
    alerts: [
      { id: uid(), type: "warning", msg: "Rapport CSRD \xE0 soumettre avant le 30 juin 2026", date: "Aujourd'hui" },
      { id: uid(), type: "info", msg: "Score ESG am\xE9lior\xE9 de +8 points ce trimestre", date: "Il y a 2 jours" },
      { id: uid(), type: "warning", msg: "2 fournisseurs \xE0 r\xE9\xE9valuer (score ESG < 60)", date: "Il y a 5 jours" }
    ],
    planActions: [
      { id: uid(), titre: "Publier l'Index \xC9galit\xE9 F/H 2026", categorie: "Social", priorite: "Haute", statut: "En cours", responsable: "Marie Dupont", echeance: "2026-03-01", loi: "Index \xC9galit\xE9 F/H \u2014 Art. L.1142-8 CT", notes: "Publication obligatoire avant le 1er mars sur index.egapro.travail.gouv.fr", avancement: 70 },
      { id: uid(), titre: "R\xE9aliser le Bilan Carbone Scope 1+2", categorie: "Environnement", priorite: "Haute", statut: "\xC0 faire", responsable: "", echeance: "2026-06-30", loi: "BEGES \u2014 Art. L.229-25 Code env.", notes: "Prestataire \xE0 s\xE9lectionner. Budget estim\xE9 : 3 500 \u20AC.", avancement: 0 },
      { id: uid(), titre: "D\xE9ployer le dispositif d'alerte \xE9thique", categorie: "Gouvernance", priorite: "Haute", statut: "\xC0 faire", responsable: "", echeance: "2026-09-01", loi: "Loi Waserman 2022 \u2014 Art. 8 Loi Sapin II", notes: "Obligatoire \u226550 salari\xE9s. Canal interne ou plateforme externe.", avancement: 0 },
      { id: uid(), titre: "Mettre \xE0 jour le DUERP num\xE9rique", categorie: "Social", priorite: "Moyenne", statut: "En cours", responsable: "Marie Dupont", echeance: "2026-04-30", loi: "Sant\xE9 au Travail \u2014 Art. R.4121-1 CT", notes: "DUERP doit \xEAtre num\xE9ris\xE9, actualis\xE9 et historis\xE9.", avancement: 40 },
      { id: uid(), titre: "D\xE9clarer OPERAT (D\xE9cret Tertiaire)", categorie: "Environnement", priorite: "Moyenne", statut: "\xC0 faire", responsable: "", echeance: "2026-09-30", loi: "D\xE9cret n\xB02019-771 \u2014 Art. L.174-1 CCH", notes: "D\xE9claration annuelle obligatoire si locaux \u22651 000 m\xB2.", avancement: 0 }
    ]
  };
  function useAppData(fallback) {
    const [data, setDataRaw] = (0, import_react.useState)(() => loadFromLocalStorage(fallback));
    const [saveStatus, setSaveStatus] = (0, import_react.useState)("idle");
    const saveTimer = (0, import_react.useRef)(null);
    const setData = (0, import_react.useCallback)((updater) => {
      setDataRaw((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        saveToLocalStorage(next);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setSaveStatus("saving");
        saveTimer.current = setTimeout(async () => {
          const ok = await saveToServer(next);
          setSaveStatus(ok ? "saved" : "local");
          setTimeout(() => setSaveStatus("idle"), 2e3);
        }, 1e3);
        return next;
      });
    }, []);
    (0, import_react.useEffect)(() => {
      loadFromServer().then((serverData) => {
        if (serverData && !serverData.notFound && !serverData.error) {
          const merged = { ...fallback, ...serverData };
          setDataRaw(merged);
          saveToLocalStorage(merged);
        }
      });
    }, []);
    (0, import_react.useEffect)(() => {
      const interval = setInterval(() => {
        setDataRaw((current) => {
          saveToLocalStorage(current);
          saveToServer(current);
          return current;
        });
      }, 6e4);
      return () => clearInterval(interval);
    }, []);
    return [data, setData, saveStatus];
  }
  function calcScores(esg) {
    const e = esg.env, s = esg.soc, g = esg.gov;
    let E = 0, S = 0, G = 0;
    const rv = parseFloat(e.renouvelable) || 0;
    E += rv >= 70 ? 35 : rv >= 40 ? 22 : rv >= 15 ? 10 : 0;
    const co2 = parseFloat(e.co2) || 9999;
    E += co2 < 50 ? 35 : co2 < 200 ? 24 : co2 < 400 ? 14 : 0;
    const dech = parseFloat(e.dechets) || 0;
    E += dech >= 80 ? 30 : dech >= 55 ? 20 : dech >= 30 ? 10 : 0;
    const gap = parseFloat(s.ecartSalaire) || 99;
    S += gap < 3 ? 35 : gap < 7 ? 24 : gap < 12 ? 12 : 0;
    const form = parseFloat(s.formation) || 0;
    S += form >= 30 ? 35 : form >= 18 ? 24 : form >= 8 ? 12 : 0;
    const turn = parseFloat(s.turnover) || 99;
    S += turn < 5 ? 30 : turn < 12 ? 20 : turn < 20 ? 10 : 0;
    const div = parseFloat(g.femmesDirigeantes) || 0;
    G += div >= 50 ? 35 : div >= 35 ? 22 : div >= 20 ? 12 : 0;
    const eth = parseFloat(g.ethique) || 0;
    G += eth >= 90 ? 35 : eth >= 65 ? 22 : eth >= 40 ? 12 : 0;
    G += g.whistleblower ? 20 : 0;
    G += g.auditFreq === "quarterly" ? 10 : g.auditFreq === "biannual" ? 7 : g.auditFreq === "annual" ? 4 : 0;
    const cl = (v) => Math.min(Math.max(Math.round(v), 0), 100);
    const Ec = cl(E), Sc = cl(S), Gc = cl(G);
    return { E: Ec, S: Sc, G: Gc, total: cl(Math.round((Ec + Sc + Gc) / 3)) };
  }
  function getGrade(score) {
    return score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D";
  }
  function getGradeColor(score) {
    return score >= 80 ? C.success : score >= 65 ? C.accent : score >= 50 ? C.warning : C.danger;
  }
  function exportPDF(title, htmlContent) {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return alert("Autorisez les popups pour t\xE9l\xE9charger le PDF.");
    win.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Sora',sans-serif;color:#18181B;background:#fff;padding:48px 56px;font-size:14px}
.header{display:flex;align-items:center;gap:14px;margin-bottom:36px;padding-bottom:20px;border-bottom:2px solid #1D3D2E}
.logo{width:42px;height:42px;background:#1D3D2E;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px}
.lt h1{font-family:'DM Serif Display',serif;font-size:22px;color:#1D3D2E;line-height:1}
.lt p{font-size:11px;color:#A1A1AA;margin-top:2px}
.doc-title{font-family:'DM Serif Display',serif;font-size:28px;color:#18181B;margin-bottom:6px}
.doc-meta{font-size:12px;color:#A1A1AA;margin-bottom:28px}
h2{font-size:16px;font-weight:700;color:#1D3D2E;margin:24px 0 10px;border-bottom:1px solid #E4E4E7;padding-bottom:6px}
h3{font-size:14px;font-weight:600;color:#18181B;margin:18px 0 8px}
p,li{font-size:13px;color:#52525B;line-height:1.8;margin-bottom:6px}
ul,ol{padding-left:20px;margin-bottom:10px}
table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
th{background:#EBF5EF;color:#1D3D2E;font-weight:600;padding:8px 12px;text-align:left;border-bottom:2px solid #1D3D2E}
td{padding:8px 12px;border-bottom:1px solid #E4E4E7}
.badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;background:#EBF5EF;color:#2D5A45}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #E4E4E7;font-size:10px;color:#A1A1AA;display:flex;justify-content:space-between}
@page{margin:20mm;size:A4}
</style></head><body>
<div class="header">
  <div class="logo">\u{1F33F}</div>
  <div class="lt"><h1>EcoScore</h1><p>Plateforme ESG & CSRD pour PME</p></div>
</div>
<div class="doc-title">${title}</div>
<div class="doc-meta">G\xE9n\xE9r\xE9 le ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} \xB7 EcoScore</div>
${htmlContent}
<div class="footer">
  <span>EcoScore \u2014 Plateforme ESG & CSRD</span>
  <span>Document g\xE9n\xE9r\xE9 le ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}</span>
</div>
<script>window.onload=()=>{setTimeout(()=>window.print(),500)}<\/script>
</body></html>`);
    win.document.close();
  }
  var Btn = ({ children, variant = "primary", onClick, small, danger, disabled, type = "button" }) => {
    const v = danger ? { background: C.dangerLight, color: C.danger, border: `1px solid #FECACA` } : variant === "outline" ? { background: "transparent", color: C.text, border: `1px solid ${C.border}` } : variant === "ghost" ? { background: "transparent", color: C.sub, border: "none" } : variant === "accent" ? { background: C.accent, color: "#fff", border: "none" } : { background: C.brand, color: "#fff", border: "none" };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type, style: { display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "5px 12px" : "8px 16px", fontSize: small ? 12 : 13, fontWeight: 500, borderRadius: 8, ...v, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }, onClick, disabled, children });
  };
  var Badge = ({ label, color = "default" }) => {
    const map = { default: [C.bg, C.sub, C.border], green: [C.successLight, C.success, "#A7F3D0"], amber: [C.warningLight, "#92400E", "#FDE68A"], red: [C.dangerLight, C.danger, "#FECACA"], blue: [C.blueLight, C.blue, "#BFDBFE"], brand: [C.brandLight, C.brandMid, "#BDE5CF"], purple: [C.purpleLight, C.purple, "#DDD6FE"] };
    const [bg, text, border] = map[color] || map.default;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: bg, color: text, border: `1px solid ${border}`, whiteSpace: "nowrap" }, children: label });
  };
  var Avatar = ({ name, size = 32 }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: size, height: size, borderRadius: "50%", background: avatarColor(name || ""), display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 600, color: "#fff", flexShrink: 0 }, children: initials(name) });
  var Field = ({ label, children, hint, required }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 16 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6, letterSpacing: 0.3 }, children: [
      label,
      required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: C.accent, marginLeft: 3 }, children: "*" })
    ] }),
    children,
    hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, marginTop: 4 }, children: hint })
  ] });
  var Modal = ({ title, subtitle, onClose, children, width = 560 }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", inset: 0, background: "rgba(15,23,18,.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 100, padding: "40px 16px", overflowY: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 16, width: "100%", maxWidth: width, border: `1px solid ${C.border}`, boxShadow: "0 20px 60px rgba(0,0,0,.15)" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}` }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 15, fontWeight: 600 }, children: title }),
        subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.muted, marginTop: 2 }, children: subtitle })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onClose, style: { background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.muted, lineHeight: 1 }, children: "\xD7" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24 }, children })
  ] }) });
  var KpiCard = ({ label, value, unit = "", sub, color = C.brand, icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "18px 20px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase" }, children: label }),
      icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 16 }, children: icon })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "baseline", gap: 4 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 26, fontWeight: 700, color, fontFamily: "'DM Serif Display',serif" }, children: value }),
      unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, color: C.muted }, children: unit })
    ] }),
    sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, marginTop: 4 }, children: sub })
  ] });
  function ScoreRing({ score, size = 110, label }) {
    const gc = getGradeColor(score);
    const r = 46, circ = 2 * Math.PI * r, dash = score / 100 * circ * 0.75;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: size, height: size * 0.75, viewBox: `0 0 ${size} ${size * 0.75}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: `M ${size * 0.12} ${size * 0.7} A ${r} ${r} 0 0 1 ${size * 0.88} ${size * 0.7}`, fill: "none", stroke: C.border, strokeWidth: 9, strokeLinecap: "round" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: `M ${size * 0.12} ${size * 0.7} A ${r} ${r} 0 0 1 ${size * 0.88} ${size * 0.7}`, fill: "none", stroke: gc, strokeWidth: 9, strokeLinecap: "round", strokeDasharray: `${dash} ${circ}` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: "50%", y: "68%", textAnchor: "middle", style: { fontSize: size * 0.2, fontWeight: 700, fill: C.text, fontFamily: "'DM Serif Display',serif" }, children: score })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: `Note ${getGrade(score)}`, color: score >= 80 ? "green" : score >= 65 ? "brand" : score >= 50 ? "amber" : "red" }),
      label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: C.sub, marginTop: 2 }, children: label })
    ] });
  }
  function ScoreExplainModal({ scores, esg, onClose }) {
    const pillars = [
      {
        key: "E",
        label: "Environnement",
        icon: "\u{1F331}",
        score: scores.E,
        color: "#10B981",
        desc: "Ce score mesure votre impact environnemental : \xE9missions de carbone, efficacit\xE9 \xE9nerg\xE9tique et gestion des d\xE9chets.",
        indicators: [
          {
            name: "\xC9missions CO\u2082 (Scope 1+2)",
            value: esg.env.co2 || "\u2014",
            unit: "tCO\u2082",
            weight: "35 pts",
            interpretation: parseFloat(esg.env.co2) < 50 ? "\u2705 Excellent \u2014 \xE9missions tr\xE8s faibles" : parseFloat(esg.env.co2) < 200 ? "\u{1F7E1} Correct \u2014 des am\xE9liorations possibles" : "\u{1F534} \xC0 r\xE9duire \u2014 plan de d\xE9carbonation recommand\xE9"
          },
          {
            name: "\xC9nergies renouvelables",
            value: esg.env.renouvelable || "\u2014",
            unit: "%",
            weight: "35 pts",
            interpretation: parseFloat(esg.env.renouvelable) >= 70 ? "\u2705 Excellent \u2014 majorit\xE9 renouvelable" : parseFloat(esg.env.renouvelable) >= 40 ? "\u{1F7E1} Correct \u2014 progression recommand\xE9e" : "\u{1F534} \xC0 am\xE9liorer \u2014 contrat vert \xE0 envisager"
          },
          {
            name: "D\xE9chets recycl\xE9s",
            value: esg.env.dechets || "\u2014",
            unit: "%",
            weight: "30 pts",
            interpretation: parseFloat(esg.env.dechets) >= 80 ? "\u2705 Excellent \u2014 tr\xE8s bon taux" : parseFloat(esg.env.dechets) >= 55 ? "\u{1F7E1} Correct" : "\u{1F534} \xC0 am\xE9liorer \u2014 fili\xE8res REP \xE0 activer"
          }
        ],
        recos: ["R\xE9alisez un Bilan GES Scope 1+2+3 (ADEME)", "Souscrivez un contrat d'\xE9nergie renouvelable (RECs)", "Identifiez vos fili\xE8res REP applicables (Loi AGEC)", "D\xE9clarez sur la plateforme OPERAT si locaux \u22651 000 m\xB2"]
      },
      {
        key: "S",
        label: "Social",
        icon: "\u{1F465}",
        score: scores.S,
        color: "#3B82F6",
        desc: "Ce score \xE9value vos pratiques sociales : \xE9galit\xE9 professionnelle, formation des \xE9quipes et r\xE9tention des talents.",
        indicators: [
          {
            name: "\xC9cart de r\xE9mun\xE9ration F/H",
            value: esg.soc.ecartSalaire || "\u2014",
            unit: "%",
            weight: "35 pts",
            interpretation: parseFloat(esg.soc.ecartSalaire) < 3 ? "\u2705 Excellent \u2014 quasi-parit\xE9" : parseFloat(esg.soc.ecartSalaire) < 7 ? "\u{1F7E1} Correct \u2014 index F/H \xE0 optimiser" : "\u{1F534} Risque l\xE9gal \u2014 plan d'action obligatoire si index <75"
          },
          {
            name: "Heures de formation/salari\xE9",
            value: esg.soc.formation || "\u2014",
            unit: "h/an",
            weight: "35 pts",
            interpretation: parseFloat(esg.soc.formation) >= 30 ? "\u2705 Excellent \u2014 politique formation mature" : parseFloat(esg.soc.formation) >= 18 ? "\u{1F7E1} Correct" : "\u{1F534} Insuffisant \u2014 obligation entretiens pro (art. L.6315-1 CT)"
          },
          {
            name: "Taux de turnover",
            value: esg.soc.turnover || "\u2014",
            unit: "%",
            weight: "30 pts",
            interpretation: parseFloat(esg.soc.turnover) < 5 ? "\u2705 Excellent \u2014 forte fid\xE9lisation" : parseFloat(esg.soc.turnover) < 12 ? "\u{1F7E1} Correct \u2014 dans la moyenne" : "\u{1F534} \xC9lev\xE9 \u2014 enqu\xEAte satisfaction recommand\xE9e"
          }
        ],
        recos: ["Publiez l'index \xE9galit\xE9 F/H avant le 1er mars (index.egapro.travail.gouv.fr)", "V\xE9rifiez votre taux OETH \u22656% (art. L.5212-1 CT) et d\xE9clarez via DSN", "R\xE9alisez les entretiens professionnels tous les 2 ans", "Mettez en place un plan de mobilit\xE9 (\u226550 sal. \u2014 loi Climat 2021)"]
      },
      {
        key: "G",
        label: "Gouvernance",
        icon: "\u{1F3DB}\uFE0F",
        score: scores.G,
        color: "#7C3AED",
        desc: "Ce score refl\xE8te la qualit\xE9 de votre gouvernance : transparence, \xE9thique, diversit\xE9 \xE0 la direction et conformit\xE9 r\xE9glementaire.",
        indicators: [
          {
            name: "Femmes en direction",
            value: esg.gov.femmesDirigeantes || "\u2014",
            unit: "%",
            weight: "35 pts",
            interpretation: parseFloat(esg.gov.femmesDirigeantes) >= 50 ? "\u2705 Excellent \u2014 parit\xE9 atteinte" : parseFloat(esg.gov.femmesDirigeantes) >= 35 ? "\u{1F7E1} Correct \u2014 progression recommand\xE9e" : "\u{1F534} \xC0 am\xE9liorer \u2014 loi PACTE & index F/H"
          },
          {
            name: "Salari\xE9s form\xE9s \xE9thique",
            value: esg.gov.ethique || "\u2014",
            unit: "%",
            weight: "35 pts",
            interpretation: parseFloat(esg.gov.ethique) >= 90 ? "\u2705 Excellent \u2014 conformit\xE9 Sapin II" : parseFloat(esg.gov.ethique) >= 65 ? "\u{1F7E1} Correct \u2014 plan de formation \xE0 compl\xE9ter" : "\u{1F534} Risque Sapin II \u2014 formation prioritaire"
          },
          {
            name: "Dispositif alerte \xE9thique",
            value: esg.gov.whistleblower ? "Oui" : "Non",
            unit: "",
            weight: "20 pts",
            interpretation: esg.gov.whistleblower ? "\u2705 Conforme loi Waserman (\u226550 sal.)" : "\u{1F534} Obligatoire \u226550 sal. \u2014 loi Waserman 2022"
          }
        ],
        recos: ["Mettez en place un dispositif d'alerte (art. 8 Loi Waserman 2022)", "Formez 100% des managers au code \xE9thique (Loi Sapin II)", "R\xE9alisez un audit interne annuel", "Publiez votre DPEF/rapport CSRD si vous \xEAtes dans les seuils"]
      }
    ];
    const gradeInfo = {
      "A": { label: "Excellent", desc: "Votre score est dans le top 20% des PME. Vous anticipez les obligations r\xE9glementaires futures.", color: C.success },
      "B": { label: "Bon", desc: "Votre d\xE9marche ESG est solide. Quelques points d'am\xE9lioration pour atteindre l'excellence.", color: C.accent },
      "C": { label: "En progr\xE8s", desc: "Des actions concr\xE8tes sont n\xE9cessaires pour r\xE9pondre aux obligations r\xE9glementaires \xE0 venir.", color: C.warning },
      "D": { label: "\xC0 am\xE9liorer", desc: "Des risques r\xE9glementaires existent. Un plan d'action ESG prioritaire est recommand\xE9.", color: C.danger }
    };
    const g = getGrade(scores.total);
    const gi = gradeInfo[g];
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, { title: "Comprendre mon score ESG", subtitle: "Analyse d\xE9taill\xE9e par pilier avec recommandations", onClose, width: 720, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { animation: "fadeIn .3s ease" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.bg, borderRadius: 12, padding: 20, marginBottom: 20, display: "flex", gap: 20, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", flexShrink: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }, children: "Score global" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 48, fontWeight: 800, color: gi.color, fontFamily: "'DM Serif Display',serif", lineHeight: 1 }, children: scores.total }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, fontWeight: 700, color: gi.color, marginTop: 4 }, children: [
            "Note ",
            g,
            " \u2014 ",
            gi.label
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, borderLeft: `1px solid ${C.border}`, paddingLeft: 20 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, color: C.text, lineHeight: 1.7, marginBottom: 12 }, children: gi.desc }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }, children: [{ label: "Environnement", s: scores.E }, { label: "Social", s: scores.S }, { label: "Gouvernance", s: scores.G }].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 8, padding: "8px 12px", border: `1px solid ${C.border}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: C.muted, marginBottom: 4 }, children: p.label }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 18, fontWeight: 700, color: getGradeColor(p.s), fontFamily: "'DM Serif Display',serif" }, children: [
              p.s,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, fontWeight: 400, color: C.muted }, children: "/100" })
            ] })
          ] }, p.label)) })
        ] })
      ] }),
      pillars.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 16, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "14px 20px", background: C.bg, display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 20 }, children: p.icon }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 700, fontSize: 14 }, children: p.label }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.muted }, children: p.desc })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 24, fontWeight: 800, color: getGradeColor(p.score), fontFamily: "'DM Serif Display',serif" }, children: p.score }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: `Note ${getGrade(p.score)}`, color: p.score >= 80 ? "green" : p.score >= 65 ? "brand" : p.score >= 50 ? "amber" : "red" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 16 }, children: [
          p.indicators.map((ind, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 12, padding: "8px 0", borderBottom: i < p.indicators.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "flex-start" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600, marginBottom: 2 }, children: ind.name }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.muted }, children: ind.interpretation })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "right", flexShrink: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 15, fontWeight: 700, color: C.text }, children: [
                ind.value,
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, color: C.muted, marginLeft: 2 }, children: ind.unit })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: C.muted }, children: ind.weight })
            ] })
          ] }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14, background: C.brandLight, borderRadius: 8, padding: "12px 14px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.brandMid, marginBottom: 6 }, children: "\u{1F4A1} Recommandations" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { style: { paddingLeft: 16 }, children: p.recos.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { style: { fontSize: 12, color: C.brandMid, lineHeight: 1.7 }, children: r }, i)) })
          ] })
        ] })
      ] }, p.key))
    ] }) });
  }
  function DashView({ data, onScoreDetail }) {
    const sc = calcScores(data.esg);
    const deptCounts = data.employees.reduce((a, e) => {
      a[e.dept] = (a[e.dept] || 0) + 1;
      return a;
    }, {});
    const fournOk = data.fournisseurs.filter((f) => f.scoreESG >= 70).length;
    const polPub = data.rse.politiques.filter((p) => p.statut === "Publi\xE9").length;
    const today = /* @__PURE__ */ new Date();
    const greeting = today.getHours() < 12 ? "Bonjour" : today.getHours() < 18 ? "Bon apr\xE8s-midi" : "Bonsoir";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 20, background: `linear-gradient(135deg,${C.brand} 0%,${C.brandMid} 100%)`, borderRadius: 16, padding: "22px 28px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", right: -20, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.05)" } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", right: 80, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.05)" } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: `${data.admin.prenom} ${data.admin.nom}`, size: 48 }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 18, fontWeight: 700, fontFamily: "'DM Serif Display',serif", lineHeight: 1.2, marginBottom: 4 }, children: [
            greeting,
            ", ",
            data.admin.prenom
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, color: "rgba(255,255,255,.7)" }, children: [
            data.company.name || "Votre entreprise",
            " \xB7 ",
            data.admin.role,
            " \xB7 Exercice 2025"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "right", cursor: "pointer" }, onClick: onScoreDetail, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom: 4 }, children: "Score ESG Global" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "baseline", gap: 4, justifyContent: "flex-end" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 40, fontWeight: 800, fontFamily: "'DM Serif Display',serif", lineHeight: 1, color: getGradeColor(sc.total) }, children: sc.total }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14, color: "rgba(255,255,255,.5)" }, children: "/ 100" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 38, height: 38, borderRadius: 10, background: `${getGradeColor(sc.total)}25`, border: `2px solid ${getGradeColor(sc.total)}`, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 18, fontWeight: 800, color: getGradeColor(sc.total) }, children: getGrade(sc.total) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 4 }, children: "Analyser mon score \u2192" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          KpiCard,
          {
            label: "Salari\xE9s",
            value: data.employees.length,
            icon: "\u{1F464}",
            sub: `${data.employees.filter((e) => e.genre === "F").length} femmes \xB7 ${data.employees.filter((e) => e.genre === "M").length} hommes`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          KpiCard,
          {
            label: "Fournisseurs ESG \u226570",
            value: `${fournOk}/${data.fournisseurs.length}`,
            icon: "\u{1F91D}",
            color: fournOk === data.fournisseurs.length ? C.success : C.warning,
            sub: "conformes sur le panel total"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          KpiCard,
          {
            label: "Politiques RSE publi\xE9es",
            value: polPub,
            icon: "\u{1F4DC}",
            color: C.purple,
            sub: `sur ${data.rse.politiques.length} politique${data.rse.politiques.length > 1 ? "s" : ""} r\xE9dig\xE9e${data.rse.politiques.length > 1 ? "s" : ""}`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          KpiCard,
          {
            label: "Conformit\xE9 CSRD",
            value: 74,
            unit: "%",
            icon: "\u2696\uFE0F",
            color: C.warning,
            sub: "8 crit\xE8res sur 11 remplis"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 280px", gap: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 13, fontWeight: 600 }, children: "Scores ESG par pilier" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: onScoreDetail, children: "D\xE9tails \u2192" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }, children: [{ label: "Environnement", score: sc.E, icon: "\u{1F331}" }, { label: "Social", score: sc.S, icon: "\u{1F465}" }, { label: "Gouvernance", score: sc.G, icon: "\u{1F3DB}\uFE0F" }].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", padding: "14px 10px", background: C.bg, borderRadius: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, marginBottom: 8 }, children: p.icon }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { score: p.score, size: 100, label: p.label })
          ] }, p.label)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: `1px solid ${C.border}`, paddingTop: 16 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }, children: "R\xE9partition par d\xE9partement" }),
            Object.entries(deptCounts).map(([dept, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, color: C.sub, width: 96, flexShrink: 0 }, children: dept }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, height: 5, background: C.bg, borderRadius: 99 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${count / data.employees.length * 100}%`, background: C.accent, borderRadius: 99 } }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, fontWeight: 600, width: 16 }, children: count })
            ] }, dept))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 13, fontWeight: 600, marginBottom: 16 }, children: "Politiques RSE actives" }),
          data.rse.politiques.map((p) => {
            const avg = p.objectifs.length ? Math.round(p.objectifs.reduce((s, o) => s + o.avancement, 0) / p.objectifs.length) : 0;
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "12px 0", borderBottom: `1px solid ${C.border}` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, fontWeight: 600 }, children: p.titre }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.statut, color: p.statut === "Publi\xE9" ? "green" : p.statut === "Valid\xE9" ? "brand" : p.statut === "En r\xE9vision" ? "amber" : "default" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, marginBottom: 8 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.type }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 11, color: C.muted }, children: [
                  "v",
                  p.version,
                  " \xB7 ",
                  p.responsable
                ] })
              ] }),
              p.objectifs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: C.sub }, children: [
                    p.objectifs.length,
                    " objectif",
                    p.objectifs.length > 1 ? "s" : ""
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontWeight: 600 }, children: [
                    avg,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 4, background: C.bg, borderRadius: 99 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${avg}%`, background: C.accent, borderRadius: 99 } }) })
              ] })
            ] }, p.id);
          }),
          data.rse.politiques.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, color: C.muted, textAlign: "center", padding: "20px 0" }, children: "Aucune politique RSE \u2014 cr\xE9ez-en une dans le module RSE" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18, flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 13, fontWeight: 600, marginBottom: 14 }, children: "Alertes" }),
            data.alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, padding: "9px 0", borderBottom: `1px solid ${C.border}` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13 }, children: a.type === "warning" ? "\u26A0\uFE0F" : "\u2705" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.text, lineHeight: 1.5 }, children: a.msg }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, marginTop: 2 }, children: a.date })
              ] })
            ] }, a.id))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.brandLight, borderRadius: 12, border: `1px solid #BDE5CF`, padding: 16 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: C.brandMid, marginBottom: 4 }, children: "\u{1F4CB} Prochaine \xE9ch\xE9ance CSRD" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 14, fontWeight: 700, color: C.brand }, children: "30 juin 2026" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.brandMid, marginTop: 4 }, children: "Rapport de durabilit\xE9 2025" })
          ] })
        ] })
      ] })
    ] });
  }
  function LegislationView() {
    const [search, setSearch] = (0, import_react.useState)("");
    const [filterOrigine, setFilterOrigine] = (0, import_react.useState)("");
    const [filterDomaine, setFilterDomaine] = (0, import_react.useState)("");
    const [selected, setSelected] = (0, import_react.useState)(null);
    const filtered = LEGISLATION.filter((l) => {
      const q = search.toLowerCase();
      const matchQ = !q || (l.titre.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.resume.toLowerCase().includes(q) || l.tags.some((t) => t.toLowerCase().includes(q)));
      return matchQ && (!filterOrigine || l.origine === filterOrigine) && (!filterDomaine || l.dom === filterDomaine);
    });
    const origines = [...new Set(LEGISLATION.map((l) => l.origine))];
    const domaines = [...new Set(LEGISLATION.map((l) => l.dom))];
    const statutColor = (s) => s.includes("En vigueur") ? "green" : s.includes("cours") || s.includes("transitoire") ? "amber" : s.includes("R\xE9f\xE9rence") ? "blue" : "default";
    const origineColor = (o) => o === "UE" ? "blue" : o === "France" ? "brand" : o === "International" ? "purple" : "default";
    const law = selected ? LEGISLATION.find((l) => l.id === selected) : null;
    const handleExportLaw = (l) => {
      const html = `
      <h2>${l.code} \u2014 ${l.titre}</h2>
      <p><strong>Type :</strong> ${l.type} | <strong>Origine :</strong> ${l.origine} | <strong>Statut :</strong> ${l.statut}</p>
      <p><strong>Date :</strong> ${l.date} | <strong>En vigueur :</strong> ${l.vigueur}</p>
      <h2>R\xE9sum\xE9</h2><p>${l.resume}</p>
      <h2>Qui est concern\xE9 ?</h2><p>${l.seuils}</p>
      <h2>Impact pour les PME</h2><p>${l.impact}</p>
      <h2>Obligations cl\xE9s</h2><ul>${l.obligations.map((o) => `<li>${o}</li>`).join("")}</ul>
      <h2>Articles de loi de r\xE9f\xE9rence</h2><ul>${l.articles.map((a) => `<li>${a}</li>`).join("")}</ul>
      <h2>Sanctions</h2><p>${l.sanctions}</p>
      <p><strong>Source officielle :</strong> ${l.lien}</p>
    `;
      exportPDF(`Fiche l\xE9gislative \u2014 ${l.code}`, html);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: law ? "1fr 460px" : "1fr", gap: 16, height: "calc(100vh - 110px)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { overflow: "hidden", display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Rechercher (CSRD, carbone, \xE9galit\xE9, DUERP\u2026)", style: { flex: 1, minWidth: 200 } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: filterOrigine, onChange: (e) => setFilterOrigine(e.target.value), style: { width: 130 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Toutes origines" }),
            origines.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: o }, o))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: filterDomaine, onChange: (e) => setFilterDomaine(e.target.value), style: { width: 150 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Tous domaines" }),
            domaines.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 11, color: C.muted, marginBottom: 10 }, children: [
          filtered.length,
          " texte",
          filtered.length > 1 ? "s" : "",
          " \xB7 ",
          LEGISLATION.length,
          " r\xE9f\xE9rences au total"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { overflow: "auto", flex: 1 }, children: filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            onClick: () => setSelected(l.id === selected ? null : l.id),
            style: { background: selected === l.id ? C.brandLight : C.surface, borderRadius: 12, border: `1.5px solid ${selected === l.id ? C.accent : C.border}`, padding: "14px 18px", marginBottom: 8, cursor: "pointer", transition: "all .15s" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: C.brand, fontFamily: "'DM Serif Display',serif" }, children: l.code }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: l.origine, color: origineColor(l.origine) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: l.statut, color: statutColor(l.statut) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: l.dom })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.4 }, children: l.titre })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, flexShrink: 0 }, children: l.date?.slice(0, 4) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, color: C.sub, lineHeight: 1.6 }, children: [
                l.resume.slice(0, 150),
                "\u2026"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }, children: l.tags.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, background: C.bg, color: C.muted, padding: "2px 7px", borderRadius: 99, border: `1px solid ${C.border}` }, children: t }, t)) })
            ]
          },
          l.id
        )) })
      ] }),
      law && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "auto", display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.surface, zIndex: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 18, fontWeight: 700, color: C.brand, fontFamily: "'DM Serif Display',serif" }, children: law.code }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setSelected(null), style: { background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.muted }, children: "\xD7" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.4, marginBottom: 10 }, children: law.titre }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: law.origine, color: origineColor(law.origine) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: law.statut, color: statutColor(law.statut) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: law.dom }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: law.type })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", overflow: "auto" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.bg, borderRadius: 8, padding: "10px 14px" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: C.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }, children: "Date du texte" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, fontWeight: 600 }, children: law.date })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.bg, borderRadius: 8, padding: "10px 14px" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: C.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }, children: "En vigueur" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, fontWeight: 600 }, children: law.vigueur })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }, children: "R\xE9sum\xE9" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, color: C.sub, lineHeight: 1.8, marginBottom: 16 }, children: law.resume }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.warningLight, borderRadius: 10, padding: "12px 14px", marginBottom: 12, border: `1px solid #FDE68A` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: "#92400E", marginBottom: 6 }, children: "\u26A0\uFE0F Qui est concern\xE9 ?" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: "#78350F", lineHeight: 1.7 }, children: law.seuils })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.brandLight, borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: `1px solid #BDE5CF` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.brandMid, marginBottom: 6 }, children: "\u{1F3E2} Impact PME" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.brand, lineHeight: 1.7 }, children: law.impact })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }, children: "Obligations cl\xE9s" }),
          law.obligations.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, padding: "7px 0", borderBottom: `1px solid ${C.border}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: C.accent, fontWeight: 700, fontSize: 13, marginTop: 1 }, children: "\u2192" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.text, lineHeight: 1.6 }, children: o })
          ] }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 0 8px" }, children: "Articles de loi de r\xE9f\xE9rence" }),
          law.articles.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.border}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: C.blue, fontSize: 12, fontWeight: 700, flexShrink: 0 }, children: "\xA7" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.sub, lineHeight: 1.6, fontFamily: "monospace", fontSize: 11 }, children: a })
          ] }, i)),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.dangerLight, borderRadius: 10, padding: "12px 14px", margin: "14px 0 16px", border: `1px solid #FECACA` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.danger, marginBottom: 6 }, children: "\u26A1 Sanctions" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: "#991B1B", lineHeight: 1.7 }, children: law.sanctions })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "a",
              {
                href: law.lien,
                target: "_blank",
                rel: "noreferrer",
                style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: C.brand, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none" },
                children: "\u{1F517} Texte officiel"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                onClick: () => handleExportLaw(law),
                style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" },
                children: "\u{1F4C4} Exporter PDF"
              }
            )
          ] })
        ] })
      ] })
    ] });
  }
  function RseView({ rse, setRse, admin, apiKey }) {
    const [view, setView] = (0, import_react.useState)("list");
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [aiMessages, setAiMessages] = (0, import_react.useState)([{ role: "assistant", content: `Bonjour ${admin.prenom} ! \u{1F44B} Je suis votre assistant RSE, propuls\xE9 par Claude.

Je connais toute la l\xE9gislation fran\xE7aise et europ\xE9enne applicable \xE0 votre d\xE9marche ESG. Je peux vous aider \xE0 :

**Cr\xE9er et am\xE9liorer vos politiques RSE**
- R\xE9diger une politique environnementale conforme ESRS E1
- Adapter votre code \xE9thique aux exigences Sapin II
- Structurer votre politique achats responsables (Loi Vigilance)

**Analyser votre conformit\xE9 r\xE9glementaire**
- Identifier vos obligations selon votre taille
- Pr\xE9parer votre rapport CSRD/DPEF
- V\xE9rifier votre conformit\xE9 Sapin II, RGPD, Index F/H

**Proposer des objectifs concrets et mesurables**

Que souhaitez-vous faire ?` }]);
    const [aiPrompt, setAiPrompt] = (0, import_react.useState)("");
    const [aiLoading, setAiLoading] = (0, import_react.useState)(false);
    const [showNew, setShowNew] = (0, import_react.useState)(false);
    const chatEndRef = (0, import_react.useRef)(null);
    const TYPES_RSE = Object.keys(RSE_LEGAL_MAP);
    const STATUTS_RSE = ["Brouillon", "En r\xE9vision", "Valid\xE9", "Publi\xE9", "Archiv\xE9"];
    const pol = selected ? rse.politiques.find((p) => p.id === selected) : null;
    const updatePol = (fn) => setRse((r) => ({ ...r, politiques: r.politiques.map((p) => p.id === selected ? fn(p) : p) }));
    const sendAI = async () => {
      if (!aiPrompt.trim()) return;
      const userMsg = { role: "user", content: aiPrompt };
      const newMessages = [...aiMessages, userMsg];
      setAiMessages(newMessages);
      setAiPrompt("");
      setAiLoading(true);
      const system = `Tu es un expert RSE et juriste sp\xE9cialis\xE9 en droit fran\xE7ais et europ\xE9en de la durabilit\xE9.
Tu aides ${admin.prenom} ${admin.nom} (${admin.role}) \xE0 cr\xE9er et optimiser ses politiques RSE.

Tu connais parfaitement et cites les articles de loi pr\xE9cis :
- CSRD (R\xE8glement 2023/2772), ESRS E1-G1, DPEF (Art. L.225-102-1 Code com.)
- Loi PACTE (Art. 1833 CC), Loi Sapin II (Art. 17), Loi Vigilance (Art. L.225-102-4 Code com.)
- Loi Climat (Art. 301-303), AGEC (Art. L.541-10), D\xE9cret Tertiaire (D\xE9cret 2019-771)
- Index \xC9galit\xE9 F/H (Art. L.1142-8 CT), OETH (Art. L.5212-1 CT), RGPD (Art. 5, 28, 32, 33)
- Sant\xE9 au travail (Loi 2021-1018), Formation (Art. L.6315-1 CT), Plan mobilit\xE9 (Art. L.1214-8-2 CT)
- ISO 14001:2015, ISO 26000:2010, GRI Standards 2021, EcoVadis

Tes r\xE9ponses sont :
- Structur\xE9es en Markdown (titres ##, listes -, gras **)
- Concr\xE8tes et directement actionnables pour une PME
- Incluent syst\xE9matiquement les articles de loi pertinents
- Proposent des objectifs SMART avec indicateurs mesurables

Politiques RSE actuelles : ${rse.politiques.map((p) => `${p.titre} (${p.type}, ${p.statut})`).join(", ") || "aucune"}
${pol ? `Politique en cours d'\xE9dition : "${pol.titre}" (${pol.type})` : ""}`;
      try {
        const resp = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })), system, apiKey }) });
        const data = await resp.json();
        const text = data.content?.[0]?.text || data.error || "Erreur de r\xE9ponse.";
        setAiMessages((p) => [...p, { role: "assistant", content: text }]);
      } catch {
        setAiMessages((p) => [...p, { role: "assistant", content: "\u26A0\uFE0F Erreur de connexion. V\xE9rifiez que le serveur est bien lanc\xE9 avec `node server.js`." }]);
      }
      setAiLoading(false);
    };
    (0, import_react.useEffect)(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages]);
    const renderMD = (text) => text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 13, fontWeight: 700, color: C.brand, margin: "14px 0 6px", fontFamily: "'DM Serif Display',serif" }, children: line.slice(3) }, i);
      if (line.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { fontSize: 15, fontWeight: 700, color: C.brand, margin: "0 0 10px", fontFamily: "'DM Serif Display',serif" }, children: line.slice(2) }, i);
      if (line.startsWith("- ") || line.startsWith("\u2022 ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { style: { fontSize: 12, color: C.text, lineHeight: 1.7, marginLeft: 16, marginBottom: 2 }, children: line.slice(2).replace(/\*\*(.*?)\*\*/g, (_, m) => `<b>${m}</b>`) }, i);
      if (line === "") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}, i);
      const html = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 3 }, dangerouslySetInnerHTML: { __html: html } }, i);
    });
    const NewPolModal = () => {
      const [f, setF] = (0, import_react.useState)({ id: uid(), titre: "", type: "Environnement", statut: "Brouillon", responsable: `${admin.prenom} ${admin.nom}`, dateCreation: todayStr(), dateMaj: todayStr(), contenu: "", objectifs: [], version: "1.0" });
      const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
      const lm = RSE_LEGAL_MAP[f.type];
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: "Nouvelle politique RSE", subtitle: "Choisissez un type et partez d'un mod\xE8le pr\xE9-rempli", onClose: () => setShowNew(false), width: 640, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Titre de la politique", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.titre, onChange: (e) => set("titre", e.target.value), placeholder: "Ex: Politique Environnementale 2025" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Type de politique", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.type, onChange: (e) => set("type", e.target.value), children: TYPES_RSE.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Responsable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.responsable, onChange: (e) => set("responsable", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Statut initial", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.statut, onChange: (e) => set("statut", e.target.value), children: STATUTS_RSE.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s)) }) })
        ] }),
        lm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.bg, borderRadius: 10, padding: 16, marginBottom: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, fontWeight: 700, color: C.brand, marginBottom: 8 }, children: [
            "\u2696\uFE0F Cadre l\xE9gal applicable \u2014 ",
            f.type
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }, children: lm.lois.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: l, color: "brand" }, l)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6 }, children: "Articles de loi cl\xE9s :" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { style: { paddingLeft: 16 }, children: lm.articles.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { style: { fontSize: 11, color: C.sub, lineHeight: 1.7, fontFamily: "monospace" }, children: a }, i)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8 }, children: "Partir d'un mod\xE8le pr\xE9-rempli" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }, children: Object.keys(RSE_TEMPLATES).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            onClick: () => {
              set("contenu", RSE_TEMPLATES[t]);
              if (!f.titre) set("titre", t);
            },
            style: { padding: "8px 12px", background: f.contenu === RSE_TEMPLATES[t] ? C.brandLight : C.bg, border: `1px solid ${f.contenu === RSE_TEMPLATES[t] ? C.accent : C.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 12, color: C.text },
            children: [
              "\u{1F4C4} ",
              t
            ]
          },
          t
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setShowNew(false), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => {
            setRse((r) => ({ ...r, politiques: [...r.politiques, f] }));
            setShowNew(false);
            setSelected(f.id);
            setView("editor");
          }, disabled: !f.titre, children: "Cr\xE9er la politique" })
        ] })
      ] });
    };
    if (view === "list" || !pol) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginBottom: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "'DM Serif Display',serif", marginBottom: 4 }, children: "Politiques RSE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, color: C.muted }, children: "R\xE9digez, g\xE9rez et optimisez vos politiques avec l'aide de l'IA et du cadre l\xE9gal." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => {
          setView("ai");
        }, children: "\u{1F916} Assistant IA" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setShowNew(true), children: "+ Nouvelle politique" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }, children: STATUTS_RSE.slice(0, 4).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "14px 18px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, marginBottom: 4 }, children: s }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 24, fontWeight: 700, fontFamily: "'DM Serif Display',serif", color: C.text }, children: rse.politiques.filter((p) => p.statut === s).length })
      ] }, s)) }),
      rse.politiques.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", padding: "60px 24px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 48, marginBottom: 16 }, children: "\u{1F4DC}" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 16, fontWeight: 700, marginBottom: 8 }, children: "Aucune politique RSE" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, color: C.muted, marginBottom: 24 }, children: "Commencez par cr\xE9er votre premi\xE8re politique ou laissez l'IA vous guider." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, justifyContent: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setView("ai"), children: "\u{1F916} Assistant IA" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setShowNew(true), children: "+ Cr\xE9er une politique" })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: rse.politiques.map((p) => {
        const avg = p.objectifs.length ? Math.round(p.objectifs.reduce((s, o) => s + o.avancement, 0) / p.objectifs.length) : 0;
        const sc = { Brouillon: "default", "En r\xE9vision": "amber", Valid\u00E9: "brand", Publi\u00E9: "green", Archiv\u00E9: "default" };
        const lm = RSE_LEGAL_MAP[p.type];
        const handleExport = () => {
          const html = `
                <h2>${p.titre}</h2>
                <p><strong>Type :</strong> ${p.type} | <strong>Statut :</strong> ${p.statut} | <strong>Version :</strong> ${p.version}</p>
                <p><strong>Responsable :</strong> ${p.responsable} | <strong>Mis \xE0 jour :</strong> ${p.dateMaj}</p>
                ${lm ? `<h2>Cadre l\xE9gal applicable</h2><ul>${lm.lois.map((l) => `<li>${l}</li>`).join("")}</ul><h2>Articles de r\xE9f\xE9rence</h2><ul>${lm.articles.map((a) => `<li>${a}</li>`).join("")}</ul>` : ""}
                <h2>Contenu de la politique</h2>
                <div>${p.contenu.replace(/\n/g, "<br/>")}</div>
                ${p.objectifs.length ? `<h2>Objectifs & KPIs</h2><table><tr><th>Objectif</th><th>Indicateur</th><th>\xC9ch\xE9ance</th><th>Avancement</th></tr>${p.objectifs.map((o) => `<tr><td>${o.titre}</td><td>${o.indicateur}</td><td>${o.echeance}</td><td>${o.avancement}%</td></tr>`).join("")}</table>` : ""}
              `;
          exportPDF(p.titre, html);
        };
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 700, fontSize: 14, marginBottom: 6 }, children: p.titre }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.type }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.statut, color: sc[p.statut] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color: C.muted }, children: [
                "v",
                p.version
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, color: C.muted, marginBottom: 10 }, children: [
            "\u{1F464} ",
            p.responsable,
            " \xB7 ",
            p.dateMaj
          ] }),
          lm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }, children: lm.lois.slice(0, 3).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, background: C.brandLight, color: C.brandMid, padding: "2px 7px", borderRadius: 99, fontWeight: 600 }, children: l }, l)) }),
          p.objectifs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: C.sub }, children: [
                p.objectifs.length,
                " objectif",
                p.objectifs.length > 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontWeight: 600 }, children: [
                avg,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 4, background: C.bg, borderRadius: 99 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${avg}%`, background: C.accent, borderRadius: 99 } }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, borderTop: `1px solid ${C.border}`, paddingTop: 12, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: () => {
              setSelected(p.id);
              setView("editor");
            }, children: "\u270F\uFE0F \xC9diter" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: () => {
              setSelected(p.id);
              setView("ai");
              setAiMessages([{ role: "assistant", content: `Bonjour ! Je vais analyser votre politique **"${p.titre}"** (${p.type}).

Cadre l\xE9gal applicable : ${lm?.lois.join(", ") || "\u2014"}

Je peux vous aider \xE0 :
- Am\xE9liorer le contenu et v\xE9rifier la conformit\xE9
- Proposer des objectifs SMART et des KPIs
- Citer les articles de loi pertinents
- R\xE9diger des clauses manquantes

Que souhaitez-vous am\xE9liorer ?` }]);
            }, children: " \u{1F916} IA" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: handleExport, children: "\u{1F4C4} PDF" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, danger: true, onClick: () => setRse((r) => ({ ...r, politiques: r.politiques.filter((x) => x.id !== p.id) })), children: "Supprimer" })
          ] })
        ] }, p.id);
      }) }),
      showNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewPolModal, {})
    ] });
    if (view === "editor" && pol) {
      const lm = RSE_LEGAL_MAP[pol.type];
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "calc(100vh - 110px)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", small: true, onClick: () => setView("list"), children: "\u2190 Retour" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { fontSize: 15, fontWeight: 700, flex: 1 }, children: pol.titre }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: pol.statut, onChange: (e) => updatePol((p) => ({ ...p, statut: e.target.value })), style: { width: 150, padding: "6px 10px", fontSize: 13 }, children: STATUTS_RSE.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: () => setView("ai"), children: "\u{1F916} IA" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, onClick: () => {
            const html = `<h2>${pol.titre}</h2><p>${pol.contenu.replace(/\n/g, "<br/>")}</p>${pol.objectifs.length ? `<h2>Objectifs</h2><table><tr><th>Titre</th><th>Indicateur</th><th>\xC9ch\xE9ance</th><th>Avancement</th></tr>${pol.objectifs.map((o) => `<tr><td>${o.titre}</td><td>${o.indicateur}</td><td>${o.echeance}</td><td>${o.avancement}%</td></tr>`).join("")}</table>` : ""}`;
            exportPDF(pol.titre, html);
          }, children: "\u{1F4C4} Exporter PDF" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, flex: 1, overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12, overflow: "auto" }, children: [
            lm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.brandLight, borderRadius: 10, padding: "12px 16px", border: `1px solid #BDE5CF` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 11, fontWeight: 700, color: C.brandMid, marginBottom: 6 }, children: [
                "\u2696\uFE0F Cadre l\xE9gal applicable \u2014 ",
                pol.type
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }, children: lm.lois.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: l, color: "brand" }, l)) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 10, color: C.brandMid }, children: [
                lm.articles.slice(0, 2).join(" \xB7 "),
                " ",
                lm.articles.length > 2 ? `+ ${lm.articles.length - 2} autres` : ""
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Titre", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: pol.titre, onChange: (e) => updatePol((p) => ({ ...p, titre: e.target.value })) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: pol.type, onChange: (e) => updatePol((p) => ({ ...p, type: e.target.value })), children: TYPES_RSE.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t)) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Responsable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: pol.responsable, onChange: (e) => updatePol((p) => ({ ...p, responsable: e.target.value })) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Version", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: pol.version, onChange: (e) => updatePol((p) => ({ ...p, version: e.target.value })) }) })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, flex: 1 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 10 }, children: "Contenu de la politique" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "textarea",
                {
                  value: pol.contenu,
                  onChange: (e) => updatePol((p) => ({ ...p, contenu: e.target.value })),
                  style: { width: "100%", minHeight: 320, fontSize: 13, lineHeight: 1.8, padding: "12px 16px", border: `1px solid ${C.border}`, borderRadius: 8, resize: "vertical" },
                  placeholder: "R\xE9digez votre politique ici\u2026"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { overflow: "auto" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18, marginBottom: 12 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 12 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, fontWeight: 700 }, children: "Objectifs & KPIs" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, onClick: () => updatePol((p) => ({ ...p, objectifs: [...p.objectifs, { id: uid(), titre: "", echeance: "", avancement: 0, indicateur: "" }] })), children: "+ Ajouter" })
              ] }),
              pol.objectifs.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "10px 0", borderBottom: `1px solid ${C.border}` }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: o.titre, onChange: (e) => updatePol((p) => ({ ...p, objectifs: p.objectifs.map((x, j) => j === i ? { ...x, titre: e.target.value } : x) })), placeholder: "Titre de l'objectif", style: { marginBottom: 6, fontSize: 12 } }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "date", value: o.echeance, onChange: (e) => updatePol((p) => ({ ...p, objectifs: p.objectifs.map((x, j) => j === i ? { ...x, echeance: e.target.value } : x) })), style: { fontSize: 11, padding: "4px 8px" } }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: o.indicateur, onChange: (e) => updatePol((p) => ({ ...p, objectifs: p.objectifs.map((x, j) => j === i ? { ...x, indicateur: e.target.value } : x) })), placeholder: "Unit\xE9 (%,tCO\u2082\u2026)", style: { fontSize: 11, padding: "4px 8px" } })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color: C.muted, width: 28 }, children: [
                    o.avancement,
                    "%"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "range", min: "0", max: "100", step: "1", value: o.avancement, onChange: (e) => updatePol((p) => ({ ...p, objectifs: p.objectifs.map((x, j) => j === i ? { ...x, avancement: parseInt(e.target.value) } : x) })), style: { flex: 1, width: "auto" } }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => updatePol((p) => ({ ...p, objectifs: p.objectifs.filter((_, j) => j !== i) })), style: { background: "none", border: "none", cursor: "pointer", color: C.danger, fontSize: 16, padding: 0 }, children: "\xD7" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 3, background: C.bg, borderRadius: 99, marginTop: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${o.avancement}%`, background: o.avancement >= 75 ? C.success : o.avancement >= 40 ? C.accent : C.warning, borderRadius: 99 } }) })
              ] }, o.id)),
              pol.objectifs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.muted, textAlign: "center", padding: "12px 0" }, children: "Aucun objectif d\xE9fini" })
            ] }),
            lm && lm.objectifsSugg\u00E9r\u00E9s && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 10 }, children: "\u{1F4A1} Objectifs sugg\xE9r\xE9s" }),
              lm.objectifsSugg\u00E9r\u00E9s.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  onClick: () => updatePol((p) => ({ ...p, objectifs: [...p.objectifs, { id: uid(), titre: o.replace(/{([^}]+)}/g, "[\xC0 d\xE9finir]"), echeance: "", avancement: 0, indicateur: "" }] })),
                  style: { display: "block", width: "100%", padding: "7px 10px", marginBottom: 4, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 11, color: C.sub, lineHeight: 1.5 },
                  children: [
                    "+ ",
                    o
                  ]
                },
                i
              ))
            ] })
          ] })
        ] })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "calc(100vh - 110px)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", small: true, onClick: () => setView("list"), children: "\u2190 Retour" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 15, fontWeight: 700 }, children: "\u{1F916} Assistant IA RSE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.muted }, children: "Propuls\xE9 par Claude \xB7 Expert l\xE9gislation ESG fran\xE7aise et europ\xE9enne" })
        ] }),
        !apiKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: "Cl\xE9 API \xE0 configurer dans Param\xE8tres", color: "amber" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 240px", gap: 16, flex: 1, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, overflow: "auto", padding: "16px 20px" }, children: [
            aiMessages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginBottom: 14, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, maxWidth: "88%", flexDirection: m.role === "user" ? "row-reverse" : "row" }, children: [
              m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 28, height: 28, borderRadius: "50%", background: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }, children: "\u{1F33F}" }),
              m.role === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: `${admin.prenom} ${admin.nom}`, size: 28 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: m.role === "user" ? C.brand : C.bg, color: m.role === "user" ? "#fff" : C.text, padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", maxWidth: "100%" }, children: m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderMD(m.content) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, lineHeight: 1.7 }, children: m.content }) })
            ] }) }, i)),
            aiLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 28, height: 28, borderRadius: "50%", background: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }, children: "\u{1F33F}" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.bg, padding: "10px 14px", borderRadius: "12px 12px 12px 4px", display: "flex", gap: 4 }, children: [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` } }, i)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatEndRef })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "textarea",
              {
                value: aiPrompt,
                onChange: (e) => setAiPrompt(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendAI();
                  }
                },
                placeholder: "Posez votre question RSE / l\xE9gislation\u2026 (Entr\xE9e pour envoyer)",
                style: { flex: 1, minHeight: 44, maxHeight: 120, resize: "none", fontSize: 13, lineHeight: 1.6 }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: sendAI, disabled: aiLoading || !aiPrompt.trim(), variant: "accent", children: "Envoyer" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { overflow: "auto", display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }, children: "Questions rapides" }),
            ["Quelles sont mes obligations CSRD ?", "Quelles lois s'appliquent \xE0 une PME de 80 salari\xE9s ?", "R\xE9dige une politique environnementale conforme ESRS E1", "Analyse ma conformit\xE9 Sapin II", "Comment am\xE9liorer mon index \xE9galit\xE9 F/H ?", "Plan d'action pour obtenir ISO 14001", "Qu'est-ce que le devoir de vigilance ?"].map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setAiPrompt(q), style: { display: "block", width: "100%", padding: "8px 10px", marginBottom: 4, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 11, color: C.text, lineHeight: 1.4 }, children: q }, i))
          ] }),
          rse.politiques.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }, children: "Mes politiques" }),
            rse.politiques.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setAiPrompt(`Analyse et am\xE9liore ma politique "${p.titre}" (${p.type}) \u2014 cite les articles de loi pertinents`),
                style: { width: "100%", padding: "7px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 11, color: C.text, marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.titre }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.statut, color: p.statut === "Publi\xE9" ? "green" : p.statut === "Valid\xE9" ? "brand" : "amber" })
                ]
              },
              p.id
            ))
          ] })
        ] })
      ] })
    ] });
  }
  function SalariesView({ employees, setEmployees }) {
    const [modal, setModal] = (0, import_react.useState)(null);
    const [search, setSearch] = (0, import_react.useState)("");
    const [dept, setDept] = (0, import_react.useState)("");
    const [confirm, setConfirm] = (0, import_react.useState)(null);
    const filtered = employees.filter((e) => {
      const q = search.toLowerCase();
      return (`${e.prenom} ${e.nom}`.toLowerCase().includes(q) || e.poste?.toLowerCase().includes(q)) && (!dept || e.dept === dept);
    });
    const save = (f) => {
      setEmployees((p) => p.find((e) => e.id === f.id) ? p.map((e) => e.id === f.id ? f : e) : [...p, f]);
      setModal(null);
    };
    const depts = [...new Set(employees.map((e) => e.dept))].filter(Boolean);
    const EmpModal = ({ emp }) => {
      const blank = { id: uid(), nom: "", prenom: "", poste: "", dept: "", contrat: "CDI", dateEntree: "", email: "", genre: "F", formation: "", salaire: "" };
      const [f, setF] = (0, import_react.useState)(emp || blank);
      const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: emp ? "Modifier le salari\xE9" : "Ajouter un salari\xE9", onClose: () => setModal(null), width: 600, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Pr\xE9nom", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.prenom, onChange: (e) => set("prenom", e.target.value), placeholder: "Marie" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Nom", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.nom, onChange: (e) => set("nom", e.target.value), placeholder: "Dupont" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Poste", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.poste, onChange: (e) => set("poste", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "D\xE9partement", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: f.dept, onChange: (e) => set("dept", e.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "S\xE9lectionner" }),
            DEPTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Contrat", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.contrat, onChange: (e) => set("contrat", e.target.value), children: CONTRATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Genre", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: f.genre, onChange: (e) => set("genre", e.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "F", children: "Femme" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "M", children: "Homme" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "NB", children: "Non-binaire" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Date d'entr\xE9e", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "date", value: f.dateEntree, onChange: (e) => set("dateEntree", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "email", value: f.email, onChange: (e) => set("email", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Formation h/an", hint: "Indicateur ESG Social", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: f.formation, onChange: (e) => set("formation", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Salaire brut annuel (\u20AC)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: f.salaire, onChange: (e) => set("salaire", e.target.value) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setModal(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => save(f), disabled: !f.nom || !f.prenom || !f.dept, children: "Enregistrer" })
        ] })
      ] });
    };
    const handleExport = () => {
      const csv = "\uFEFFPr\xE9nom,Nom,Poste,D\xE9partement,Contrat,Email,Genre,Formation(h),Salaire(\u20AC)\n" + employees.map((e) => `${e.prenom},${e.nom},"${e.poste}",${e.dept},${e.contrat},${e.email},${e.genre},${e.formation || ""},${e.salaire || ""}`).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      a.download = `salaries-${todayStr()}.csv`;
      a.click();
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginBottom: 20 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Rechercher\u2026", style: { maxWidth: 280 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: dept, onChange: (e) => setDept(e.target.value), style: { width: 180 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Tous les d\xE9partements" }),
          depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: handleExport, children: "\u2B07 Export CSV" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal("new"), children: "+ Ajouter un salari\xE9" })
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", padding: "60px 24px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 32, marginBottom: 12 }, children: "\u{1F464}" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 600, marginBottom: 20 }, children: "Aucun salari\xE9" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal("new"), children: "+ Ajouter" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { style: { background: C.bg }, children: ["Salari\xE9", "Poste", "D\xE9partement", "Contrat", "Formation", "Salaire", "Actions"].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.4, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }, children: h }, h)) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { style: { borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: `${e.prenom} ${e.nom}`, size: 34 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontWeight: 600, fontSize: 13 }, children: [
                e.prenom,
                " ",
                e.nom
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted }, children: e.email })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px", fontSize: 13, color: C.sub }, children: e.poste }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: e.dept || "\u2014" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: e.contrat, color: e.contrat === "CDI" ? "green" : e.contrat === "Stage" || e.contrat === "Alternance" ? "blue" : "amber" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px", fontSize: 13 }, children: e.formation ? `${e.formation}h` : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: C.muted }, children: "\u2014" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px", fontSize: 13 }, children: e.salaire ? `${Number(e.salaire).toLocaleString("fr-FR")} \u20AC` : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: C.muted }, children: "\u2014" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: () => setModal(e), children: "Modifier" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, danger: true, onClick: () => setConfirm(e.id), children: "Supprimer" })
          ] }) })
        ] }, e.id)) })
      ] }) }),
      modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmpModal, { emp: modal === "new" ? null : modal }),
      confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: "Supprimer ce salari\xE9 ?", onClose: () => setConfirm(null), width: 380, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 14, color: C.sub, marginBottom: 20 }, children: "Action irr\xE9versible." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setConfirm(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { danger: true, onClick: () => {
            setEmployees((p) => p.filter((e) => e.id !== confirm));
            setConfirm(null);
          }, children: "Supprimer" })
        ] })
      ] })
    ] });
  }
  function PostesView({ postes, setPostes }) {
    const [modal, setModal] = (0, import_react.useState)(null);
    const [confirm, setConfirm] = (0, import_react.useState)(null);
    const [filter, setFilter] = (0, import_react.useState)("all");
    const filtered = postes.filter((p) => filter === "all" ? true : filter === "open" ? p.ouvert : !p.ouvert);
    const save = (f) => {
      setPostes((p) => p.find((x) => x.id === f.id) ? p.map((x) => x.id === f.id ? f : x) : [...p, f]);
      setModal(null);
    };
    const PModal = ({ p: initP }) => {
      const blank = { id: uid(), titre: "", dept: "", niveau: "Confirm\xE9", description: "", competences: "", contrat: "CDI", teletravail: false, ouvert: true };
      const [f, setF] = (0, import_react.useState)(initP || blank);
      const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: initP ? "Modifier la fiche" : "Cr\xE9er une fiche de poste", onClose: () => setModal(null), width: 560, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Intitul\xE9", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.titre, onChange: (e) => set("titre", e.target.value), placeholder: "Ex: Responsable ESG" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "D\xE9partement", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: f.dept, onChange: (e) => set("dept", e.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "S\xE9lectionner" }),
            DEPTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Niveau", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.niveau, onChange: (e) => set("niveau", e.target.value), children: ["Junior", "Confirm\xE9", "Senior", "Lead", "Manager"].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: n }, n)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Contrat", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.contrat, onChange: (e) => set("contrat", e.target.value), children: CONTRATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c)) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Description", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: f.description, onChange: (e) => set("description", e.target.value), placeholder: "Missions, responsabilit\xE9s\u2026" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Comp\xE9tences", hint: "S\xE9par\xE9es par des virgules", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.competences, onChange: (e) => set("competences", e.target.value) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 24, marginBottom: 20 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: f.teletravail, onChange: (e) => set("teletravail", e.target.checked), style: { width: "auto" } }),
            "T\xE9l\xE9travail"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: f.ouvert, onChange: (e) => set("ouvert", e.target.checked), style: { width: "auto" } }),
            "Recrutement ouvert"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setModal(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => save(f), disabled: !f.titre || !f.dept, children: "Enregistrer" })
        ] })
      ] });
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 4, marginBottom: 20 }, children: [
        [["all", "Tous"], ["open", "Ouverts"], ["closed", "Pourvus"]].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setFilter(v), style: { padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: filter === v ? 600 : 400, background: filter === v ? C.brand : "transparent", color: filter === v ? "#fff" : C.sub, border: `1px solid ${filter === v ? C.brand : C.border}`, cursor: "pointer" }, children: l }, v)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal("new"), children: "+ Cr\xE9er une fiche" })
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", padding: "60px 24px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 32, marginBottom: 12 }, children: "\u{1F4CB}" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 600, marginBottom: 20 }, children: "Aucune fiche" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal("new"), children: "+ Cr\xE9er" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 600, fontSize: 14, marginBottom: 6 }, children: p.titre }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.dept }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.niveau, color: "blue" }),
              p.teletravail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: "T\xE9l\xE9travail", color: "brand" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: p.ouvert ? "Ouvert" : "Pourvu", color: p.ouvert ? "green" : "default" })
        ] }),
        p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.sub, lineHeight: 1.6, marginBottom: 10 }, children: p.description }),
        p.competences && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }, children: p.competences.split(",").map((c) => c.trim()).filter(Boolean).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, background: C.bg, color: C.sub, padding: "2px 8px", borderRadius: 6, border: `1px solid ${C.border}` }, children: c }, i)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, borderTop: `1px solid ${C.border}`, paddingTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: () => setModal(p), children: "Modifier" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, danger: true, onClick: () => setConfirm(p.id), children: "Supprimer" })
        ] })
      ] }, p.id)) }),
      modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PModal, { p: modal === "new" ? null : modal }),
      confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: "Supprimer ?", onClose: () => setConfirm(null), width: 380, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 14, color: C.sub, marginBottom: 20 }, children: "Action irr\xE9versible." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setConfirm(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { danger: true, onClick: () => {
            setPostes((p) => p.filter((x) => x.id !== confirm));
            setConfirm(null);
          }, children: "Supprimer" })
        ] })
      ] })
    ] });
  }
  function FournisseursView({ fournisseurs, setFournisseurs }) {
    const [modal, setModal] = (0, import_react.useState)(null);
    const [confirm, setConfirm] = (0, import_react.useState)(null);
    const CATS = ["Impression", "Mat\xE9riel IT", "\xC9nergie", "Logistique", "Services", "Fournitures", "Sous-traitance", "Conseil"];
    const avg = fournisseurs.length ? Math.round(fournisseurs.reduce((s, f) => s + f.scoreESG, 0) / fournisseurs.length) : 0;
    const handleExport = () => {
      const csv = "\uFEFFNom,Cat\xE9gorie,Score ESG,\xC9valuation,Certifications,Pays,Depuis\n" + fournisseurs.map((f) => `"${f.nom}",${f.categorie || ""},${f.scoreESG},"${f.evaluation}","${f.certifications || ""}",${f.pays},${f.depuis || ""}`).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      a.download = `fournisseurs-${todayStr()}.csv`;
      a.click();
    };
    const FModal = ({ f: initF }) => {
      const blank = { id: uid(), nom: "", categorie: "", scoreESG: 50, evaluation: "Bon", certifications: "", contact: "", pays: "France", depuis: "", notes: "" };
      const [f, setF] = (0, import_react.useState)(initF || blank);
      const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: initF ? "Modifier le fournisseur" : "Ajouter un fournisseur", onClose: () => setModal(null), width: 580, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Raison sociale", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.nom, onChange: (e) => set("nom", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Cat\xE9gorie", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: f.categorie, onChange: (e) => set("categorie", e.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u2014" }),
            CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Score ESG (0-100)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", min: "0", max: "100", value: f.scoreESG, onChange: (e) => set("scoreESG", parseInt(e.target.value) || 0) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\xC9valuation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.evaluation, onChange: (e) => set("evaluation", e.target.value), children: ["Excellent", "Bon", "Moyen", "Insuffisant"].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Certifications", hint: "ISO 14001, EcoVadis\u2026", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.certifications, onChange: (e) => set("certifications", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Pays", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.pays, onChange: (e) => set("pays", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email contact", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "email", value: f.contact, onChange: (e) => set("contact", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Client depuis", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.depuis, onChange: (e) => set("depuis", e.target.value), placeholder: "Ex: 2022" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Notes internes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: f.notes, onChange: (e) => set("notes", e.target.value) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setModal(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => {
            setFournisseurs((p) => p.find((x) => x.id === f.id) ? p.map((x) => x.id === f.id ? f : x) : [...p, f]);
            setModal(null);
          }, disabled: !f.nom, children: "Enregistrer" })
        ] })
      ] });
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Fournisseurs", value: fournisseurs.length, icon: "\u{1F91D}", sub: "dans le panel" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Score ESG moyen", value: avg, unit: "/100", icon: "\u2B50", color: avg >= 70 ? C.success : avg >= 50 ? C.warning : C.danger, sub: "sur l'ensemble du panel" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Conformes \u226570", value: fournisseurs.filter((f) => f.scoreESG >= 70).length, icon: "\u2705", color: C.success, sub: "fournisseurs avec bon score ESG" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: handleExport, children: "\u2B07 Export CSV" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal("new"), children: "+ Ajouter un fournisseur" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { style: { background: C.bg }, children: ["Fournisseur", "Cat\xE9gorie", "Score ESG", "\xC9valuation", "Certifications", "Actions"].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.4, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }, children: h }, h)) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: fournisseurs.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { style: { borderBottom: i < fournisseurs.length - 1 ? `1px solid ${C.border}` : "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { style: { padding: "12px 16px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 600, fontSize: 13 }, children: f.nom }),
            f.contact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted }, children: f.contact })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: f.categorie || "\u2014" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 60, height: 4, background: C.bg, borderRadius: 99 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${f.scoreESG}%`, background: f.scoreESG >= 70 ? C.success : f.scoreESG >= 50 ? C.warning : C.danger, borderRadius: 99 } }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, fontWeight: 600, color: f.scoreESG >= 70 ? C.success : f.scoreESG >= 50 ? C.warning : C.danger }, children: f.scoreESG })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: f.evaluation || "\u2014", color: f.evaluation === "Excellent" ? "green" : f.evaluation === "Bon" ? "brand" : f.evaluation === "Moyen" ? "amber" : "red" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px", fontSize: 12, color: C.sub }, children: f.certifications || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: C.muted }, children: "\u2014" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: () => setModal(f), children: "Modifier" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, danger: true, onClick: () => setConfirm(f.id), children: "Supprimer" })
          ] }) })
        ] }, f.id)) })
      ] }) }),
      modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FModal, { f: modal === "new" ? null : modal }),
      confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: "Supprimer ?", onClose: () => setConfirm(null), width: 380, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 14, color: C.sub, marginBottom: 20 }, children: "Action irr\xE9versible." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setConfirm(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { danger: true, onClick: () => {
            setFournisseurs((p) => p.filter((x) => x.id !== confirm));
            setConfirm(null);
          }, children: "Supprimer" })
        ] })
      ] })
    ] });
  }
  function EsgView({ esg, setEsg, onSave }) {
    const [tab, setTab] = (0, import_react.useState)("env");
    const setEnv = (k, v) => setEsg((p) => ({ ...p, env: { ...p.env, [k]: v } }));
    const setSoc = (k, v) => setEsg((p) => ({ ...p, soc: { ...p.soc, [k]: v } }));
    const setGov = (k, v) => setEsg((p) => ({ ...p, gov: { ...p.gov, [k]: v } }));
    const tabs = [{ id: "env", icon: "\u{1F331}", label: "Environnement" }, { id: "soc", icon: "\u{1F465}", label: "Social" }, { id: "gov", icon: "\u{1F3DB}\uFE0F", label: "Gouvernance" }];
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 4, marginBottom: 24, background: C.bg, padding: 4, borderRadius: 10, width: "fit-content" }, children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setTab(t.id), style: { padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: tab === t.id ? 600 : 400, background: tab === t.id ? C.surface : "transparent", color: tab === t.id ? C.text : C.sub, border: tab === t.id ? `1px solid ${C.border}` : "1px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.icon }),
        t.label
      ] }, t.id)) }),
      tab === "env" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Consommation \xE9nerg\xE9tique (kWh/an)", hint: "\xC9lectricit\xE9 + gaz \u2014 tous sites \u2014 Art. R.229-45 Code env.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.env.energie, onChange: (e) => setEnv("energie", e.target.value), placeholder: "Ex: 148000" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Part d'\xE9nergies renouvelables (%)", hint: "Contrat vert, production propre, RECs", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.env.renouvelable, onChange: (e) => setEnv("renouvelable", e.target.value), placeholder: "Ex: 38" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\xC9missions CO\u2082 Scope 1+2 (tCO\u2082)", hint: "Obligatoire BEGES \u2014 Art. L.229-25 Code env.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.env.co2, onChange: (e) => setEnv("co2", e.target.value), placeholder: "Ex: 210" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\xC9missions CO\u2082 Scope 3 (tCO\u2082)", hint: "Achats, d\xE9placements, aval \u2014 recommand\xE9 ADEME", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.env.scope3, onChange: (e) => setEnv("scope3", e.target.value), placeholder: "Ex: 620" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Consommation d'eau (m\xB3/an)", hint: "ESRS E3 \u2014 Ressources en eau", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.env.eau, onChange: (e) => setEnv("eau", e.target.value), placeholder: "Ex: 2400" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Taux de d\xE9chets recycl\xE9s (%)", hint: "Loi AGEC \u2014 Art. L.541-10 Code env.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.env.dechets, onChange: (e) => setEnv("dechets", e.target.value), placeholder: "Ex: 68" }) })
      ] }),
      tab === "soc" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\xC9cart de r\xE9mun\xE9ration F/H (%)", hint: "Index \xE9galit\xE9 \u2014 Art. L.1142-8 CT \u2014 Obligatoire \u226550 sal.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.soc.ecartSalaire, onChange: (e) => setSoc("ecartSalaire", e.target.value), placeholder: "Ex: 7.2" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Heures de formation / salari\xE9 / an", hint: "Art. L.6315-1 CT \u2014 Entretien professionnel obligatoire", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.soc.formation, onChange: (e) => setSoc("formation", e.target.value), placeholder: "Ex: 21" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Taux de turnover (%)", hint: "ESRS S1 \u2014 Indicateur de r\xE9tention et qualit\xE9 de vie au travail", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.soc.turnover, onChange: (e) => setSoc("turnover", e.target.value), placeholder: "Ex: 9.5" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Taux de fr\xE9quence des accidents (TF)", hint: "Art. R.4121-1 CT \u2014 DUERP \u2014 Nb accidents / 1 000 000 h", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.soc.accidents, onChange: (e) => setSoc("accidents", e.target.value), placeholder: "Ex: 2.1" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Taux de travailleurs handicap\xE9s (%)", hint: "OETH \u2014 Art. L.5212-1 CT \u2014 Obligatoire \u226520 sal. \u2014 Cible 6%", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.soc.handicap, onChange: (e) => setSoc("handicap", e.target.value), placeholder: "Ex: 4.1" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Taux de satisfaction des salari\xE9s (%)", hint: "eNPS ou enqu\xEAte interne \u2014 ESRS S1-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.soc.satisfaction, onChange: (e) => setSoc("satisfaction", e.target.value), placeholder: "Ex: 78" }) })
      ] }),
      tab === "gov" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Part de femmes en direction (%)", hint: "ESRS G1 \u2014 Loi PACTE \u2014 Conseil ou CODIR", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.gov.femmesDirigeantes, onChange: (e) => setGov("femmesDirigeantes", e.target.value), placeholder: "Ex: 44" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Salari\xE9s form\xE9s \xE0 l'\xE9thique (%)", hint: "Art. 17 Loi Sapin II \u2014 Formation anticorruption obligatoire", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.gov.ethique, onChange: (e) => setGov("ethique", e.target.value), placeholder: "Ex: 82" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Fr\xE9quence des audits internes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: esg.gov.auditFreq, onChange: (e) => setGov("auditFreq", e.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "quarterly", children: "Trimestrielle" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "biannual", children: "Semestrielle" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "annual", children: "Annuelle" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "none", children: "Aucun audit formalis\xE9" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Fournisseurs \xE9valu\xE9s ESG (%)", hint: "Loi Vigilance \u2014 Art. L.225-102-4 Code com. \u2014 Devoir de vigilance", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: esg.gov.fournisseursEvalues, onChange: (e) => setGov("fournisseursEvalues", e.target.value), placeholder: "Ex: 65" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { gridColumn: "1/-1" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "14px 16px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: esg.gov.whistleblower, onChange: (e) => setGov("whistleblower", e.target.checked), style: { width: "auto", accentColor: C.accent } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 500, fontSize: 13 }, children: "Dispositif d'alerte \xE9thique (whistleblower) en place" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, marginTop: 2 }, children: "Obligatoire \u226550 salari\xE9s \u2014 Loi Waserman (2022) & Art. 8 Loi Sapin II" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 24, display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: onSave, children: "\u2713 Enregistrer les donn\xE9es ESG" }) })
    ] });
  }
  function DocumentsView({ documents, setDocuments }) {
    const [modal, setModal] = (0, import_react.useState)(false);
    const TYPES = ["Politique", "Rapport", "Donn\xE9es", "Charte", "Certification", "Proc\xE9dure", "Contrat", "Autre"];
    const TAGS = ["RSE", "Environnement", "Social", "Gouvernance", "RH", "Juridique", "Finance"];
    const tagColor = (t) => t === "Environnement" ? "green" : t === "Social" ? "blue" : t === "Gouvernance" ? "purple" : t === "RSE" ? "brand" : t === "RH" ? "amber" : "default";
    const DocModal = () => {
      const [f, setF] = (0, import_react.useState)({ id: uid(), nom: "", type: "Rapport", date: todayStr(), taille: "", tag: "RSE" });
      const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: "Ajouter un document", onClose: () => setModal(false), width: 500, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Nom du document", required: true, hint: "Ex: Bilan Carbone 2025.pdf", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.nom, onChange: (e) => set("nom", e.target.value) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.type, onChange: (e) => set("type", e.target.value), children: TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Cat\xE9gorie", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.tag, onChange: (e) => set("tag", e.target.value), children: TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Date", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "date", value: f.date, onChange: (e) => set("date", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Taille", hint: "Ex: 2.4 Mo", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.taille, onChange: (e) => set("taille", e.target.value) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setModal(false), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => {
            setDocuments((p) => [...p, f]);
            setModal(false);
          }, disabled: !f.nom, children: "Ajouter" })
        ] })
      ] });
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal(true), children: "+ Ajouter un document" }) }),
      documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", padding: "60px 24px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 32, marginBottom: 12 }, children: "\u{1F4C1}" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 600, marginBottom: 20 }, children: "Aucun document" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal(true), children: "+ Ajouter" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { style: { background: C.bg }, children: ["Document", "Type", "Cat\xE9gorie", "Date", "Taille", "Actions"].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.4, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }, children: h }, h)) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: documents.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { style: { borderBottom: i < documents.length - 1 ? `1px solid ${C.border}` : "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 20 }, children: d.nom.endsWith(".pdf") ? "\u{1F4C4}" : d.nom.endsWith(".xlsx") ? "\u{1F4CA}" : "\u{1F4C1}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 500, fontSize: 13 }, children: d.nom })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: d.type }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: d.tag, color: tagColor(d.tag) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px", fontSize: 13, color: C.sub }, children: d.date }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px", fontSize: 13, color: C.muted }, children: d.taille || "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, variant: "outline", onClick: () => {
              const html = `<h2>${d.nom}</h2><p><strong>Type :</strong> ${d.type} | <strong>Cat\xE9gorie :</strong> ${d.tag} | <strong>Date :</strong> ${d.date} | <strong>Taille :</strong> ${d.taille || "\u2014"}</p><p>Ce document est r\xE9f\xE9renc\xE9 dans la biblioth\xE8que documentaire EcoScore.</p>`;
              exportPDF(`Fiche document \u2014 ${d.nom}`, html);
            }, children: "\u{1F4C4} PDF" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, danger: true, onClick: () => setDocuments((p) => p.filter((x) => x.id !== d.id)), children: "Supprimer" })
          ] }) })
        ] }, d.id)) })
      ] }) }),
      modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocModal, {})
    ] });
  }
  function RapportView({ data, onScoreDetail }) {
    const sc = calcScores(data.esg);
    const [done, setDone] = (0, import_react.useState)(false);
    const [gen, setGen] = (0, import_react.useState)(false);
    const grade = (v) => v >= 80 ? "A" : v >= 65 ? "B" : v >= 50 ? "C" : "D";
    const checklist = [{ label: "Bilan carbone Scope 1+2", done: !!data.esg.env.co2 }, { label: "Bilan carbone Scope 3", done: !!data.esg.env.scope3 }, { label: "Index \xE9galit\xE9 F/H (Art. L.1142-8 CT)", done: !!data.esg.soc.ecartSalaire }, { label: "Plan de formation (Art. L.6315-1 CT)", done: !!data.esg.soc.formation }, { label: "Turnover & r\xE9tention", done: !!data.esg.soc.turnover }, { label: "Diversit\xE9 en direction (Loi PACTE)", done: !!data.esg.gov.femmesDirigeantes }, { label: "Dispositif alerte \xE9thique (Sapin II)", done: data.esg.gov.whistleblower }, { label: "Panel fournisseurs \xE9valu\xE9 (Loi Vigilance)", done: data.fournisseurs.length > 0 }, { label: "Politiques RSE publi\xE9es", done: data.rse.politiques.some((p) => p.statut === "Publi\xE9") }, { label: "Documents ESG vers\xE9s", done: data.documents.length > 0 }];
    const pct = Math.round(checklist.filter((c) => c.done).length / checklist.length * 100);
    const handleGenerate = () => {
      setGen(true);
      setTimeout(() => {
        setGen(false);
        setDone(true);
        const html = `
        <h2>Synth\xE8se des scores ESG</h2>
        <table><tr><th>Pilier</th><th>Score</th><th>Note</th></tr>
        <tr><td>Environnement</td><td>${sc.E}/100</td><td>${grade(sc.E)}</td></tr>
        <tr><td>Social</td><td>${sc.S}/100</td><td>${grade(sc.S)}</td></tr>
        <tr><td>Gouvernance</td><td>${sc.G}/100</td><td>${grade(sc.G)}</td></tr>
        <tr><td><strong>Score global</strong></td><td><strong>${sc.total}/100</strong></td><td><strong>${grade(sc.total)}</strong></td></tr>
        </table>
        <h2>Donn\xE9es environnementales</h2>
        <table><tr><th>Indicateur</th><th>Valeur</th></tr>
        <tr><td>\xC9missions CO\u2082 Scope 1+2</td><td>${data.esg.env.co2 || "\u2014"} tCO\u2082</td></tr>
        <tr><td>\xC9missions CO\u2082 Scope 3</td><td>${data.esg.env.scope3 || "\u2014"} tCO\u2082</td></tr>
        <tr><td>\xC9nergie totale</td><td>${data.esg.env.energie || "\u2014"} kWh</td></tr>
        <tr><td>\xC9nergies renouvelables</td><td>${data.esg.env.renouvelable || "\u2014"}%</td></tr>
        <tr><td>D\xE9chets recycl\xE9s</td><td>${data.esg.env.dechets || "\u2014"}%</td></tr>
        </table>
        <h2>Donn\xE9es sociales</h2>
        <table><tr><th>Indicateur</th><th>Valeur</th><th>Cadre l\xE9gal</th></tr>
        <tr><td>\xC9cart de r\xE9mun\xE9ration F/H</td><td>${data.esg.soc.ecartSalaire || "\u2014"}%</td><td>Art. L.1142-8 CT</td></tr>
        <tr><td>Formation / salari\xE9 / an</td><td>${data.esg.soc.formation || "\u2014"} h</td><td>Art. L.6315-1 CT</td></tr>
        <tr><td>Taux de turnover</td><td>${data.esg.soc.turnover || "\u2014"}%</td><td>ESRS S1</td></tr>
        <tr><td>Taux OETH</td><td>${data.esg.soc.handicap || "\u2014"}%</td><td>Art. L.5212-1 CT</td></tr>
        </table>
        <h2>Donn\xE9es de gouvernance</h2>
        <table><tr><th>Indicateur</th><th>Valeur</th><th>Cadre l\xE9gal</th></tr>
        <tr><td>Femmes en direction</td><td>${data.esg.gov.femmesDirigeantes || "\u2014"}%</td><td>Loi PACTE</td></tr>
        <tr><td>Formation \xE9thique</td><td>${data.esg.gov.ethique || "\u2014"}%</td><td>Loi Sapin II</td></tr>
        <tr><td>Dispositif alerte \xE9thique</td><td>${data.esg.gov.whistleblower ? "Oui" : "Non"}</td><td>Loi Waserman 2022</td></tr>
        <tr><td>Fournisseurs \xE9valu\xE9s ESG</td><td>${data.esg.gov.fournisseursEvalues || "\u2014"}%</td><td>Loi Vigilance</td></tr>
        </table>
        <h2>Conformit\xE9 CSRD \u2014 Checklist</h2>
        <ul>${checklist.map((c) => `<li>${c.done ? "\u2705" : "\u2B1C"} ${c.label}</li>`).join("")}</ul>
      `;
        exportPDF("Rapport de Durabilit\xE9 CSRD 2025", html);
      }, 1800);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Score global", value: sc.total, unit: "/100", sub: `Note ${grade(sc.total)}`, color: sc.total >= 65 ? C.success : C.warning }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Environnement", value: sc.E, unit: "/100", sub: `Note ${grade(sc.E)}`, color: C.accent }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Social", value: sc.S, unit: "/100", sub: `Note ${grade(sc.S)}`, color: "#0F766E" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Gouvernance", value: sc.G, unit: "/100", sub: `Note ${grade(sc.G)}`, color: C.purple })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 10, marginBottom: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: onScoreDetail, children: "\u{1F50D} Comprendre mon score" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 15, fontWeight: 600 }, children: "Rapport de durabilit\xE9 CSRD 2025" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, color: C.muted, marginTop: 2 }, children: [
                "Exercice 2025 \xB7 ",
                data.employees.length,
                " salari\xE9s"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: "ESRS Conforme", color: "green" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }, children: [{ label: "E1 \u2013 Changement climatique", done: !!data.esg.env.co2, note: data.esg.env.co2 ? `${data.esg.env.co2} tCO\u2082` : "Manquant" }, { label: "E3 \u2013 Eau", done: !!data.esg.env.eau, note: data.esg.env.eau ? `${data.esg.env.eau} m\xB3` : "Manquant" }, { label: "S1 \u2013 Personnel", done: !!data.esg.soc.ecartSalaire, note: !!data.esg.soc.ecartSalaire ? "Compl\xE9t\xE9" : "Manquant" }, { label: "S2 \u2013 Cha\xEEne valeur", done: data.fournisseurs.length > 0, note: data.fournisseurs.length > 0 ? `${data.fournisseurs.length} fourn.` : "Manquant" }, { label: "G1 \u2013 \xC9thique", done: data.esg.gov.whistleblower, note: data.esg.gov.whistleblower ? "Actif" : "Manquant" }, { label: "G2 \u2013 Diversit\xE9", done: !!data.esg.gov.femmesDirigeantes, note: data.esg.gov.femmesDirigeantes ? `${data.esg.gov.femmesDirigeantes}%` : "Manquant" }].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "12px 14px", borderRadius: 8, background: item.done ? C.successLight : C.bg, border: `1px solid ${item.done ? "#A7F3D0" : C.border}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12 }, children: item.done ? "\u2705" : "\u2B1C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 600, color: C.text, marginTop: 4, lineHeight: 1.4 }, children: item.label }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: item.done ? C.success : C.muted, marginTop: 2 }, children: item.note })
          ] }, i)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: handleGenerate, disabled: gen, style: { width: "100%", padding: 13, borderRadius: 10, fontSize: 14, fontWeight: 600, background: gen ? C.bg : C.brand, color: gen ? C.muted : "#fff", border: `1px solid ${gen ? C.border : C.brand}`, cursor: gen ? "not-allowed" : "pointer", transition: "all .2s" }, children: gen ? "\u23F3 G\xE9n\xE9ration en cours\u2026" : done ? "\u2705 Rapport g\xE9n\xE9r\xE9 \u2014 Cliquez pour PDF" : "\u{1F4C4} G\xE9n\xE9rer et exporter le rapport complet (PDF)" }),
          done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.success, textAlign: "center", marginTop: 8 }, children: "Rapport CSRD 2025 \xB7 Conforme ESRS E1\u2013G1 \xB7 Export PDF disponible" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 13, fontWeight: 600 }, children: "Compl\xE9tude donn\xE9es" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 16, fontWeight: 700, color: pct >= 80 ? C.success : C.warning }, children: [
              pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 4, background: C.bg, borderRadius: 99, marginBottom: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${pct}%`, background: pct >= 80 ? C.success : C.warning, borderRadius: 99 } }) }),
          checklist.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < checklist.length - 1 ? `1px solid ${C.border}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12 }, children: item.done ? "\u2705" : "\u2B1C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, color: item.done ? C.text : C.muted, lineHeight: 1.4 }, children: item.label })
          ] }, i))
        ] })
      ] })
    ] });
  }
  function SettingsView({ data, setData }) {
    const [co, setCo] = (0, import_react.useState)(data.company);
    const [ad, setAd] = (0, import_react.useState)(data.admin);
    const [apiKey, setApiKey] = (0, import_react.useState)(data.apiKey || "");
    const [saved, setSaved] = (0, import_react.useState)(false);
    const save = () => {
      setData((p) => ({ ...p, company: co, admin: ad, apiKey }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { maxWidth: 660 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, marginBottom: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 14, fontWeight: 600, marginBottom: 20 }, children: "Mon profil" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: 16, background: C.bg, borderRadius: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: `${ad.prenom} ${ad.nom}`, size: 52 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 15, fontWeight: 700 }, children: [
              ad.prenom,
              " ",
              ad.nom
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.muted }, children: ad.email }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: ad.role, color: "brand" }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Pr\xE9nom", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: ad.prenom, onChange: (e) => setAd((p) => ({ ...p, prenom: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Nom", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: ad.nom, onChange: (e) => setAd((p) => ({ ...p, nom: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "email", value: ad.email, onChange: (e) => setAd((p) => ({ ...p, email: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "R\xF4le / Titre", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: ad.role, onChange: (e) => setAd((p) => ({ ...p, role: e.target.value })) }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, marginBottom: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 14, fontWeight: 600, marginBottom: 20 }, children: "Informations de l'entreprise" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Raison sociale", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: co.name, onChange: (e) => setCo((p) => ({ ...p, name: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "SIREN", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: co.siren, onChange: (e) => setCo((p) => ({ ...p, siren: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Secteur d'activit\xE9", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: co.sector, onChange: (e) => setCo((p) => ({ ...p, sector: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Taille", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: co.taille, onChange: (e) => setCo((p) => ({ ...p, taille: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: co.email, onChange: (e) => setCo((p) => ({ ...p, email: e.target.value })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "T\xE9l\xE9phone", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: co.tel, onChange: (e) => setCo((p) => ({ ...p, tel: e.target.value })) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Adresse", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: co.adresse, onChange: (e) => setCo((p) => ({ ...p, adresse: e.target.value })) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, marginBottom: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 14, fontWeight: 600, marginBottom: 6 }, children: "Cl\xE9 API Anthropic (Assistant IA RSE)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, color: C.muted, marginBottom: 16 }, children: [
          "N\xE9cessaire pour utiliser l'assistant IA dans le module RSE. Obtenez votre cl\xE9 sur ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: "https://console.anthropic.com", target: "_blank", rel: "noreferrer", style: { color: C.accent }, children: "console.anthropic.com" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.warningLight, borderRadius: 8, padding: "10px 14px", marginBottom: 14, border: `1px solid #FDE68A` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, color: "#92400E", lineHeight: 1.6 }, children: [
          "\u26A0\uFE0F ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sur Render (cloud) :" }),
          " la cl\xE9 API doit \xEAtre configur\xE9e dans les variables d'environnement Render (",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "ANTHROPIC_API_KEY" }),
          ") pour persister entre les red\xE9marrages. Sinon elle sera perdue au prochain d\xE9ploiement."
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Cl\xE9 API (sk-ant-\u2026)", hint: "Stock\xE9e localement et sur le serveur. Ne partagez jamais cette cl\xE9.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "password", value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: "sk-ant-api03-\u2026" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: save, children: "Enregistrer toutes les modifications" }),
        saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, color: C.success, fontWeight: 600 }, children: "\u2713 Modifications enregistr\xE9es" })
      ] })
    ] });
  }
  function PlanActionView({ actions, setActions }) {
    const [modal, setModal] = (0, import_react.useState)(null);
    const [filterCat, setFilterCat] = (0, import_react.useState)("");
    const [filterStatut, setFilterStatut] = (0, import_react.useState)("");
    const [confirm, setConfirm] = (0, import_react.useState)(null);
    const CATS = ["Environnement", "Social", "Gouvernance", "RH", "Conformit\xE9", "Autre"];
    const STATUTS = ["\xC0 faire", "En cours", "Termin\xE9", "Bloqu\xE9"];
    const PRIORITES = ["Haute", "Moyenne", "Basse"];
    const pColor = (p) => p === "Haute" ? "red" : p === "Moyenne" ? "amber" : "green";
    const filtered = actions.filter((a) => (!filterCat || a.categorie === filterCat) && (!filterStatut || a.statut === filterStatut));
    const overdue = actions.filter((a) => a.echeance && daysUntil(a.echeance) < 0 && a.statut !== "Termin\xE9");
    const soon = actions.filter((a) => a.echeance && daysUntil(a.echeance) >= 0 && daysUntil(a.echeance) <= 30 && a.statut !== "Termin\xE9");
    const ActionModal = ({ action: init }) => {
      const blank = { id: uid(), titre: "", categorie: "Environnement", priorite: "Moyenne", statut: "\xC0 faire", responsable: "", echeance: "", loi: "", notes: "", avancement: 0 };
      const [f, setF] = (0, import_react.useState)(init || blank);
      const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: init ? "Modifier l'action" : "Nouvelle action ESG", subtitle: "Action concr\xE8te li\xE9e \xE0 la r\xE9glementation", onClose: () => setModal(null), width: 600, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Titre", required: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.titre, onChange: (e) => set("titre", e.target.value), placeholder: "Ex: Publier l'Index \xC9galit\xE9 F/H" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Cat\xE9gorie", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.categorie, onChange: (e) => set("categorie", e.target.value), children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Priorit\xE9", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.priorite, onChange: (e) => set("priorite", e.target.value), children: PRIORITES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Statut", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: f.statut, onChange: (e) => set("statut", e.target.value), children: STATUTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s)) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Responsable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.responsable, onChange: (e) => set("responsable", e.target.value), placeholder: "Pr\xE9nom Nom" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\xC9ch\xE9ance", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "date", value: f.echeance, onChange: (e) => set("echeance", e.target.value) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Texte de loi li\xE9", hint: "Ex: BEGES \u2014 Art. L.229-25 Code env.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: f.loi, onChange: (e) => set("loi", e.target.value) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Notes et plan d\xE9taill\xE9", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: f.notes, onChange: (e) => set("notes", e.target.value) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, { label: `Avancement : ${f.avancement}%`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "range", min: "0", max: "100", step: "5", value: f.avancement, onChange: (e) => set("avancement", parseInt(e.target.value)), style: { padding: 0, height: "auto", border: "none", boxShadow: "none" } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 4, background: C.bg, borderRadius: 99, marginTop: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${f.avancement}%`, background: f.avancement === 100 ? C.success : C.accent, borderRadius: 99 } }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setModal(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => {
            setActions((p) => p.find((x) => x.id === f.id) ? p.map((x) => x.id === f.id ? f : x) : [...p, f]);
            setModal(null);
          }, disabled: !f.titre, children: "Enregistrer" })
        ] })
      ] });
    };
    const handleExport = () => {
      const html = `<h2>Plan d'Action ESG \u2014 ${(/* @__PURE__ */ new Date()).getFullYear()}</h2><table><tr><th>Action</th><th>Cat\xE9gorie</th><th>Priorit\xE9</th><th>Statut</th><th>Responsable</th><th>\xC9ch\xE9ance</th><th>Avancement</th></tr>${actions.map((a) => `<tr><td>${a.titre}</td><td>${a.categorie}</td><td>${a.priorite}</td><td>${a.statut}</td><td>${a.responsable || "\u2014"}</td><td>${a.echeance || "\u2014"}</td><td>${a.avancement}%</td></tr>`).join("")}</table><h2>D\xE9tail</h2>${actions.map((a) => `<h3>${a.titre}</h3><p><strong>Priorit\xE9 :</strong> ${a.priorite} | <strong>Statut :</strong> ${a.statut} | <strong>\xC9ch\xE9ance :</strong> ${a.echeance || "\u2014"}</p>${a.loi ? `<p><strong>Cadre l\xE9gal :</strong> ${a.loi}</p>` : ""}${a.notes ? `<p>${a.notes}</p>` : ""}`).join("<hr/>")}`;
      exportPDF("Plan d'Action ESG", html);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "Actions totales", value: actions.length, icon: "\u{1F4CB}", sub: `${actions.filter((a) => a.statut === "Termin\xE9").length} termin\xE9e(s)` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "En cours", value: actions.filter((a) => a.statut === "En cours").length, icon: "\u26A1", color: C.blue }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "En retard", value: overdue.length, icon: "\u26A0\uFE0F", color: overdue.length > 0 ? C.danger : C.success, sub: overdue.length > 0 ? "\xE0 traiter" : "aucun retard" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "\xC9ch\xE9ances < 30j", value: soon.length, icon: "\u23F0", color: soon.length > 0 ? C.warning : C.success })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginBottom: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: filterCat, onChange: (e) => setFilterCat(e.target.value), style: { width: 160 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Toutes cat\xE9gories" }),
          CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: filterStatut, onChange: (e) => setFilterStatut(e.target.value), style: { width: 150 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Tous statuts" }),
          STATUTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: handleExport, children: "\u{1F4C4} Exporter PDF" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: () => setModal("new"), children: "+ Nouvelle action" })
      ] }),
      overdue.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.dangerLight, border: `1px solid #FECACA`, borderRadius: 12, padding: "12px 16px", marginBottom: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, fontWeight: 700, color: C.danger, marginBottom: 8 }, children: [
          "\u26A0\uFE0F ",
          overdue.length,
          " action(s) en retard"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: overdue.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setModal(a), style: { fontSize: 11, background: "#fff", border: `1px solid #FECACA`, borderRadius: 6, padding: "4px 10px", color: C.danger, cursor: "pointer", fontFamily: "Sora,sans-serif" }, children: [
          a.titre,
          " \u2014 ",
          formatDate(a.echeance)
        ] }, a.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }, children: STATUTS.map((statut) => {
        const col = filtered.filter((a) => a.statut === statut);
        const colColor = { Termin\u00E9: C.success, "En cours": C.blue, "\xC0 faire": C.muted, Bloqu\u00E9: C.danger }[statut];
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 8, height: 8, borderRadius: "50%", background: colColor, flexShrink: 0 } }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 700, color: C.text }, children: statut }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, background: C.bg, color: C.muted, padding: "1px 7px", borderRadius: 99, border: `1px solid ${C.border}` }, children: col.length })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
            col.map((a) => {
              const days = a.echeance ? daysUntil(a.echeance) : null;
              const urg = days !== null && days < 0 ? "red" : days !== null && days <= 7 ? "amber" : null;
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onClick: () => setModal(a), style: { background: C.surface, borderRadius: 10, border: `1px solid ${urg === "red" ? "#FECACA" : urg === "amber" ? "#FDE68A" : C.border}`, padding: "12px 14px", cursor: "pointer" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: a.priorite, color: pColor(a.priorite) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: a.categorie })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.4, marginBottom: 6 }, children: a.titre }),
                a.loi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 10, color: C.muted, marginBottom: 4, fontFamily: "monospace" }, children: [
                  "\u2696 ",
                  a.loi.slice(0, 55),
                  a.loi.length > 55 ? "\u2026" : ""
                ] }),
                a.responsable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 11, color: C.sub, marginBottom: 4 }, children: [
                  "\u{1F464} ",
                  a.responsable
                ] }),
                a.echeance && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 11, fontWeight: 600, color: days < 0 ? C.danger : days <= 7 ? C.warning : C.muted }, children: [
                  "\u{1F4C5} ",
                  formatDate(a.echeance),
                  days !== null && ` (${days < 0 ? `${Math.abs(days)}j retard` : `${days}j`})`
                ] }),
                a.avancement > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 3, background: C.bg, borderRadius: 99 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${a.avancement}%`, background: a.avancement === 100 ? C.success : C.accent, borderRadius: 99 } }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 10, color: C.muted, marginTop: 2, textAlign: "right" }, children: [
                    a.avancement,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: (e) => {
                  e.stopPropagation();
                  setConfirm(a.id);
                }, style: { marginTop: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, color: C.muted, padding: 0, fontFamily: "Sora,sans-serif" }, children: "Supprimer" })
              ] }, a.id);
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                onClick: () => setModal({ id: uid(), titre: "", categorie: CATS[0], priorite: "Moyenne", statut, responsable: "", echeance: "", loi: "", notes: "", avancement: 0 }),
                style: { padding: "10px", border: `1.5px dashed ${C.border}`, borderRadius: 10, background: "transparent", cursor: "pointer", color: C.muted, fontSize: 12, width: "100%" },
                children: "+ Ajouter"
              }
            )
          ] })
        ] }, statut);
      }) }),
      modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionModal, { action: modal === "new" ? null : modal }),
      confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { title: "Supprimer ?", onClose: () => setConfirm(null), width: 360, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, color: C.sub, marginBottom: 20 }, children: "Action irr\xE9versible." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { variant: "outline", onClick: () => setConfirm(null), children: "Annuler" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { danger: true, onClick: () => {
            setActions((p) => p.filter((a) => a.id !== confirm));
            setConfirm(null);
          }, children: "Supprimer" })
        ] })
      ] })
    ] });
  }
  function EcheancesView() {
    const yr = (/* @__PURE__ */ new Date()).getFullYear();
    const ECH = [
      { titre: "Publication Index \xC9galit\xE9 F/H", date: `${yr}-03-01`, loi: "Art. L.1142-8 CT", qui: "\u226550 sal.", urg: "haute" },
      { titre: "Contribution formation OPCO", date: `${yr}-02-28`, loi: "Art. L.6331-1 CT", qui: "Toutes entreprises", urg: "haute" },
      { titre: "Rapport du comit\xE9 de mission", date: `${yr}-06-30`, loi: "Art. L.210-10 Code com.", qui: "Soci\xE9t\xE9s \xE0 mission", urg: "normale" },
      { titre: "Rapport CSRD 2025 (seuils atteints)", date: "2026-06-30", loi: "R\xE8glement UE 2023/2772", qui: "Grandes entreprises", urg: "haute" },
      { titre: "Bilan Carbone BEGES \u2014 mise \xE0 jour", date: `${yr}-12-31`, loi: "Art. L.229-25 Code env.", qui: ">500 sal. (tous les 4 ans)", urg: "moyenne" },
      { titre: "D\xE9claration OPERAT (D\xE9cret Tertiaire)", date: `${yr}-09-30`, loi: "D\xE9cret n\xB02019-771", qui: "Locaux \u22651 000 m\xB2", urg: "haute" },
      { titre: "Entretiens professionnels \u2014 bilan 6 ans", date: `${yr}-12-31`, loi: "Art. L.6315-1 CT", qui: "Tous salari\xE9s (si 6 ans r\xE9volus)", urg: "moyenne" },
      { titre: "NAO \u2014 Bloc 1 (r\xE9mun\xE9rations, \xE9galit\xE9)", date: `${yr}-12-31`, loi: "Art. L.2242-1 CT", qui: "Entreprises avec DS", urg: "moyenne" },
      { titre: "Publication Bilan Social", date: `${yr}-09-30`, loi: "Art. L.2323-70 CT", qui: "\u2265300 sal.", urg: "normale" },
      { titre: "DUERP \u2014 actualisation annuelle", date: `${yr}-12-31`, loi: "Art. R.4121-1 CT", qui: "Toutes entreprises", urg: "normale" },
      { titre: "Plan de mobilit\xE9 \u2014 mise \xE0 jour triennale", date: `${yr + 1}-09-01`, loi: "Art. L.1214-8-2 CT", qui: "\u226550 sal./site", urg: "normale" },
      { titre: "D\xE9claration OETH mensuelle (DSN)", date: `${yr}-01-31`, loi: "Art. L.5212-1 CT", qui: "\u226520 sal.", urg: "permanente" }
    ].sort((a, b) => new Date(a.date) - new Date(b.date));
    const urgColor = (u) => u === "haute" ? C.danger : u === "moyenne" ? C.warning : u === "permanente" ? C.blue : C.muted;
    const urgBg = (u) => u === "haute" ? C.dangerLight : u === "moyenne" ? C.warningLight : u === "permanente" ? C.blueLight : C.bg;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "\xC9ch\xE9ances urgentes", value: ECH.filter((e) => e.urg === "haute" && daysUntil(e.date) >= 0 && daysUntil(e.date) <= 60).length, icon: "\u{1F6A8}", color: C.danger, sub: "dans les 60 jours" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "D\xE9pass\xE9es", value: ECH.filter((e) => daysUntil(e.date) < 0 && e.urg !== "permanente").length, icon: "\u26A0\uFE0F", color: C.warning, sub: "\xE0 v\xE9rifier" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { label: "\xC0 venir (>60j)", value: ECH.filter((e) => daysUntil(e.date) > 60).length, icon: "\u{1F4C5}", color: C.brand })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: ECH.map((e, i) => {
        const days = e.urg === "permanente" ? null : daysUntil(e.date);
        const isPast = days !== null && days < 0;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${isPast ? "#FECACA" : C.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 52, height: 52, borderRadius: 10, background: urgBg(e.urg), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: e.urg === "permanente" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 9, fontWeight: 700, color: urgColor(e.urg), textAlign: "center", lineHeight: 1.3 }, children: "Mensuel" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 16, fontWeight: 800, color: isPast ? C.danger : urgColor(e.urg), lineHeight: 1 }, children: new Date(e.date).getDate() }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, fontWeight: 600, color: isPast ? C.danger : urgColor(e.urg) }, children: new Date(e.date).toLocaleDateString("fr-FR", { month: "short" }) })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontWeight: 600, fontSize: 13, color: isPast ? C.danger : C.text, marginBottom: 4 }, children: e.titre }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, fontFamily: "monospace", color: C.muted }, children: [
                "\u2696 ",
                e.loi
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: e.qui }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: e.urg === "haute" ? "\u{1F534} Prioritaire" : e.urg === "moyenne" ? "\u{1F7E1} Important" : e.urg === "permanente" ? "\u{1F535} Permanent" : "\u{1F7E2} Normal", color: e.urg === "haute" ? "red" : e.urg === "moyenne" ? "amber" : e.urg === "permanente" ? "blue" : "green" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { textAlign: "right", flexShrink: 0 }, children: days === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600, color: C.blue }, children: "R\xE9current" }) : isPast ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, fontWeight: 600, color: C.danger }, children: [
            "En retard (",
            Math.abs(days),
            "j)"
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, fontWeight: 600, color: days <= 30 ? C.warning : C.sub }, children: [
            "dans ",
            days,
            "j"
          ] }) })
        ] }, i);
      }) })
    ] });
  }
  function RechercheJuridiqueView({ apiKey }) {
    const [query, setQuery] = (0, import_react.useState)("");
    const [source, setSource] = (0, import_react.useState)("ai");
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [results, setResults] = (0, import_react.useState)(null);
    const [pisteStatus, setPisteStatus] = (0, import_react.useState)(null);
    const [history, setHistory] = (0, import_react.useState)([]);
    const chatEndRef = (0, import_react.useRef)(null);
    const QUICK = [
      "Quelles sont mes obligations CSRD si j'ai 300 salari\xE9s ?",
      "Texte exact de l'article L.1142-8 du Code du travail (Index \xC9galit\xE9 F/H)",
      "Obligations RGPD pour une PME de 50 salari\xE9s",
      "R\xE8glement CSRD \u2014 articles 19a et 29a de la directive 2013/34/UE",
      "Sanctions en cas de non-publication du bilan carbone (BEGES)",
      "Dispositif d'alerte \xE9thique \u2014 Loi Waserman 2022 obligations",
      "Plan de mobilit\xE9 employeur : obligations et contenu l\xE9gal",
      "Soci\xE9t\xE9 \xE0 mission : articles L.210-10 \xE0 L.210-12 Code de commerce",
      "Index \xE9galit\xE9 F/H \u2014 calcul des 5 indicateurs",
      "OETH : taux 6%, calcul de la contribution URSSAF"
    ];
    (0, import_react.useEffect)(() => {
      fetch("/api/legal/status").then((r) => r.json()).then(setPisteStatus).catch(() => {
      });
    }, []);
    const search = async () => {
      if (!query.trim()) return;
      setLoading(true);
      const q = query.trim();
      setHistory((h) => [...h, { type: "user", content: q }]);
      setQuery("");
      try {
        let aiResult = null, legiResult = null, eurResult = null;
        const sources = source === "all" ? ["ai", "legifrance", "eurlex"] : [source];
        if (sources.includes("ai") || source === "all") {
          const r = await fetch("/api/legal/ai-search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q, context: "PME fran\xE7aise, obligations l\xE9gales ESG", apiKey }) });
          const d = await r.json();
          aiResult = d.content?.[0]?.text || d.error || "Erreur IA";
        }
        if (sources.includes("legifrance") && pisteStatus?.piste?.connected) {
          const r = await fetch("/api/legal/legifrance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) });
          legiResult = await r.json();
        }
        if (sources.includes("eurlex") || source === "all") {
          const r = await fetch("/api/legal/eurlex", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) });
          eurResult = await r.json();
        }
        setHistory((h) => [...h, { type: "result", aiResult, legiResult, eurResult, query: q }]);
      } catch (e) {
        setHistory((h) => [...h, { type: "error", content: "Erreur de connexion au serveur." }]);
      }
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    const renderMD = (text) => {
      if (!text) return null;
      return text.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 13, fontWeight: 700, color: C.brand, margin: "14px 0 6px", fontFamily: "'DM Serif Display',serif" }, children: line.slice(3) }, i);
        if (line.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: { fontSize: 12, fontWeight: 700, color: C.text, margin: "10px 0 4px" }, children: line.slice(4) }, i);
        if (line.startsWith("- ") || line.startsWith("\u2022 ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { style: { fontSize: 12, color: C.text, lineHeight: 1.7, marginLeft: 16, marginBottom: 2 }, dangerouslySetInnerHTML: { __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code style='background:#F4F4F5;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:11px'>$1</code>") } }, i);
        if (line === "") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}, i);
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 3 }, dangerouslySetInnerHTML: { __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code style='background:#F4F4F5;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:11px'>$1</code>") } }, i);
      });
    };
    const renderEurLex = (data) => {
      if (!data?.results?.bindings?.length) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }, children: [
          "\u{1F1EA}\u{1F1FA} R\xE9sultats EUR-Lex (",
          data.results.bindings.length,
          ")"
        ] }),
        data.results.bindings.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "8px 12px", background: C.blueLight, borderRadius: 8, marginBottom: 6, border: `1px solid #BFDBFE` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600, color: C.blue, lineHeight: 1.4, marginBottom: 4 }, children: b.title?.value || "Sans titre" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
            b.date?.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, color: C.muted }, children: b.date.value.slice(0, 10) }),
            b.work?.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: b.work.value, target: "_blank", rel: "noreferrer", style: { fontSize: 10, color: C.blue, textDecoration: "none" }, children: "\u2192 EUR-Lex" })
          ] })
        ] }, i))
      ] });
    };
    const renderLegifrance = (data) => {
      if (!data || data.error) return null;
      const items = data?.results || [];
      if (!items.length) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }, children: [
          "\u{1F3DB}\uFE0F R\xE9sultats L\xE9gifrance (",
          items.length,
          ")"
        ] }),
        items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "8px 12px", background: C.brandLight, borderRadius: 8, marginBottom: 6, border: `1px solid #BDE5CF` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600, color: C.brand, lineHeight: 1.4, marginBottom: 4 }, children: item.title || item.titre || "Sans titre" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8 }, children: item.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: `https://www.legifrance.gouv.fr/codes/article_lc/${item.id}`, target: "_blank", rel: "noreferrer", style: { fontSize: 10, color: C.accent, textDecoration: "none" }, children: "\u2192 L\xE9gifrance" }) })
        ] }, i))
      ] });
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", height: "calc(100vh - 110px)", gap: 16, overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 20 }, children: "\u2696\uFE0F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, fontWeight: 700 }, children: "Recherche juridique intelligente" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted }, children: "Claude IA \xB7 L\xE9gifrance \xB7 EUR-Lex" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6 }, children: [
            { id: "ai", label: "\u{1F916} IA Juridique", desc: "R\xE9ponse instantan\xE9e" },
            { id: "legifrance", label: "\u{1F3DB}\uFE0F L\xE9gifrance", desc: pisteStatus?.piste?.connected ? "Connect\xE9" : "Non configur\xE9" },
            { id: "eurlex", label: "\u{1F1EA}\u{1F1FA} EUR-Lex", desc: "Droit europ\xE9en" },
            { id: "all", label: "\u{1F50D} Tout", desc: "Toutes sources" }
          ].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setSource(s.id), style: { padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: source === s.id ? 700 : 400, background: source === s.id ? C.brand : "transparent", color: source === s.id ? "#fff" : C.sub, border: `1px solid ${source === s.id ? C.brand : C.border}`, cursor: "pointer", lineHeight: 1.3 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: s.label }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, opacity: 0.7 }, children: s.desc })
          ] }, s.id)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: "16px 20px" }, children: [
          history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", padding: "32px 16px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 32, marginBottom: 12 }, children: "\u2696\uFE0F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 15, fontWeight: 700, color: C.brand, marginBottom: 8, fontFamily: "'DM Serif Display',serif" }, children: "Recherche juridique ESG" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, color: C.muted, lineHeight: 1.7 }, children: "Posez vos questions sur la l\xE9gislation fran\xE7aise et europ\xE9enne. L'IA cite les articles de loi pr\xE9cis et les sources officielles." })
          ] }),
          history.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 16 }, children: [
            msg.type === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.brand, color: "#fff", padding: "10px 14px", borderRadius: "12px 12px 4px 12px", maxWidth: "80%" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 13, lineHeight: 1.7 }, children: msg.content }) }) }),
            msg.type === "result" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 28, height: 28, borderRadius: "50%", background: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }, children: "\u2696\uFE0F" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, background: C.bg, borderRadius: "12px 12px 12px 4px", padding: "12px 16px", border: `1px solid ${C.border}` }, children: [
                msg.aiResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderMD(msg.aiResult) }),
                msg.legiResult && renderLegifrance(msg.legiResult),
                msg.eurResult && renderEurLex(msg.eurResult)
              ] })
            ] }),
            msg.type === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.dangerLight, padding: "10px 14px", borderRadius: 10, border: `1px solid #FECACA` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: C.danger }, children: msg.content }) })
          ] }, i)),
          loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 28, height: 28, borderRadius: "50%", background: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }, children: "\u2696\uFE0F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: C.bg, padding: "10px 14px", borderRadius: "12px 12px 12px 4px", border: `1px solid ${C.border}`, display: "flex", gap: 4 }, children: [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` } }, i)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatEndRef })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "textarea",
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  search();
                }
              },
              placeholder: "Ex: Quelles sont les obligations BEGES pour une entreprise de 600 salari\xE9s ? (Entr\xE9e pour envoyer)",
              style: { flex: 1, minHeight: 44, maxHeight: 100, resize: "none", fontSize: 13, lineHeight: 1.6 }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: search, disabled: loading || !query.trim(), variant: "accent", children: "Rechercher" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: 260, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }, children: "Sources disponibles" }),
          [
            { label: "Claude IA juridique", ok: !!apiKey, detail: apiKey ? "Disponible" : "Cl\xE9 API \xE0 configurer" },
            { label: "L\xE9gifrance API", ok: pisteStatus?.piste?.connected, detail: pisteStatus?.piste?.configured ? pisteStatus?.piste?.connected ? "Connect\xE9" : "Erreur de connexion" : "Optionnel \u2014 voir guide" },
            { label: "EUR-Lex SPARQL", ok: true, detail: "Disponible (sans auth)" }
          ].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, marginTop: 1 }, children: s.ok ? "\u2705" : "\u26A0\uFE0F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, fontWeight: 600 }, children: s.label }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: C.muted }, children: s.detail })
            ] })
          ] }, i)),
          !pisteStatus?.piste?.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 10, padding: "8px 10px", background: C.warningLight, borderRadius: 8, border: `1px solid #FDE68A` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 10, color: "#92400E", lineHeight: 1.6, fontWeight: 500 }, children: [
            "\u{1F4A1} Pour activer L\xE9gifrance PISTE : cr\xE9ez un compte gratuit sur ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "developer.aife.economie.gouv.fr" }),
            " puis ajoutez PISTE_CLIENT_ID et PISTE_CLIENT_SECRET dans Render."
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16, flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }, children: "Questions fr\xE9quentes" }),
          QUICK.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => {
            setQuery(q);
          }, style: { display: "block", width: "100%", padding: "8px 10px", marginBottom: 4, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 11, color: C.text, lineHeight: 1.4, fontFamily: "Sora,sans-serif" }, children: q }, i))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: C.brandLight, borderRadius: 12, border: `1px solid #BDE5CF`, padding: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, fontWeight: 700, color: C.brandMid, marginBottom: 8 }, children: "\u{1F4A1} Conseils de recherche" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { style: { paddingLeft: 14 }, children: ["Citez le num\xE9ro d'article (ex: L.1142-8 CT)", "Pr\xE9cisez votre effectif", "Demandez les sanctions applicables", "Comparez les obligations avant/apr\xE8s une loi"].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { style: { fontSize: 10, color: C.brandMid, lineHeight: 1.7 }, children: t }, i)) })
        ] })
      ] })
    ] });
  }
  var NAV_GROUPS = [
    {
      items: [
        { id: "dashboard", label: "Vue d'ensemble", icon: "\u25A6" }
      ]
    },
    {
      label: "PILOTAGE",
      items: [
        { id: "plan", label: "Plan d'action ESG", icon: "\u2705", countKey: "planActions" },
        { id: "echeances", label: "\xC9ch\xE9ances l\xE9gales", icon: "\u{1F4C5}" },
        { id: "rapport", label: "Rapport CSRD", icon: "\u{1F4CA}" }
      ]
    },
    {
      label: "RESSOURCES HUMAINES",
      items: [
        { id: "salaries", label: "Salari\xE9s", icon: "\u{1F464}", countKey: "employees" },
        { id: "postes", label: "Fiches de poste", icon: "\u{1F4CB}", countKey: "postes" }
      ]
    },
    {
      label: "DONN\xC9ES & CONFORMIT\xC9",
      items: [
        { id: "esg", label: "Donn\xE9es ESG", icon: "\u25C7" },
        { id: "fournisseurs", label: "Fournisseurs", icon: "\u{1F91D}", countKey: "fournisseurs" },
        { id: "documents", label: "Documents", icon: "\u{1F4C1}", countKey: "documents" },
        { id: "rse", label: "Politiques RSE", icon: "\u{1F4DC}" }
      ]
    },
    {
      label: "DROIT & L\xC9GISLATION",
      items: [
        { id: "legislation", label: "Base l\xE9gislative", icon: "\u2696\uFE0F" },
        { id: "juridique", label: "Recherche juridique", icon: "\u{1F50D}" }
      ]
    }
  ];
  var TITLES = {
    dashboard: "Vue d'ensemble",
    plan: "Plan d'action ESG",
    echeances: "\xC9ch\xE9ances l\xE9gales",
    salaries: "Salari\xE9s",
    postes: "Fiches de poste",
    fournisseurs: "Fournisseurs",
    esg: "Donn\xE9es ESG",
    documents: "Documents",
    legislation: "Base l\xE9gislative",
    juridique: "Recherche juridique",
    rse: "Politiques RSE",
    rapport: "Rapport CSRD",
    settings: "Param\xE8tres"
  };
  var SUBTITLES = {
    dashboard: "Tableau de bord de votre performance ESG",
    plan: "Pilotez vos actions concr\xE8tes et leur avancement",
    echeances: "Toutes vos obligations l\xE9gales avec leurs dates limites",
    salaries: "Gestion de vos collaborateurs et indicateurs RH",
    postes: "Descriptifs de postes et recrutements en cours",
    fournisseurs: "Panel fournisseurs et scores ESG",
    esg: "Saisie de vos indicateurs Environnement \xB7 Social \xB7 Gouvernance",
    documents: "Biblioth\xE8que de vos documents ESG & CSRD",
    legislation: `${38} textes de r\xE9f\xE9rence \xB7 Droit fran\xE7ais et europ\xE9en`,
    juridique: "Recherche en temps r\xE9el \xB7 L\xE9gifrance \xB7 EUR-Lex \xB7 Claude IA",
    rse: "R\xE9digez et g\xE9rez vos politiques RSE avec l'IA",
    rapport: "G\xE9n\xE9rez votre rapport de durabilit\xE9 conforme CSRD",
    settings: "Configuration de votre profil et int\xE9grations"
  };
  function App() {
    const [view, setView] = (0, import_react.useState)("dashboard");
    const [data, setData, saveStatus] = useAppData(DEFAULT_DATA);
    const [toast, setToast] = (0, import_react.useState)(null);
    const [showScoreDetail, setShowScoreDetail] = (0, import_react.useState)(false);
    (0, import_react.useEffect)(() => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = GF;
      document.head.appendChild(link);
      const s = document.createElement("style");
      s.textContent = CSS;
      document.head.appendChild(s);
    }, []);
    const showToast = (msg, type = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 2800);
    };
    const setEmployees = (fn) => setData((d) => ({ ...d, employees: typeof fn === "function" ? fn(d.employees) : fn }));
    const setPostes = (fn) => setData((d) => ({ ...d, postes: typeof fn === "function" ? fn(d.postes) : fn }));
    const setFournisseurs = (fn) => setData((d) => ({ ...d, fournisseurs: typeof fn === "function" ? fn(d.fournisseurs) : fn }));
    const setDocuments = (fn) => setData((d) => ({ ...d, documents: typeof fn === "function" ? fn(d.documents) : fn }));
    const setEsg = (fn) => setData((d) => ({ ...d, esg: typeof fn === "function" ? fn(d.esg) : fn }));
    const setRse = (fn) => setData((d) => ({ ...d, rse: typeof fn === "function" ? fn(d.rse) : fn }));
    const setPlanActions = (fn) => setData((d) => ({ ...d, planActions: typeof fn === "function" ? fn(d.planActions || []) : fn }));
    const scores = calcScores(data.esg);
    const grade = getGrade(scores.total);
    const gradeColor = getGradeColor(scores.total);
    const fullscreen = ["legislation", "rse", "juridique"].includes(view);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", height: "100vh", overflow: "hidden", position: "relative", background: C.bg }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: 236, flexShrink: 0, background: "#FFFFFF", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${C.brand},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }, children: "\u{1F33F}" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 16, fontWeight: 700, color: C.brand, fontFamily: "'DM Serif Display',serif", lineHeight: 1 }, children: "EcoScore" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: 0.3 }, children: "Plateforme ESG & CSRD" })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onClick: () => setShowScoreDetail(true), style: { margin: "12px 10px 0", padding: "12px 14px", background: `linear-gradient(135deg,${C.brand},${C.brandMid})`, borderRadius: 12, cursor: "pointer", color: "#fff", position: "relative", overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "absolute", right: -10, top: -10, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,.06)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,.65)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }, children: "Score ESG Global" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 30, fontWeight: 800, fontFamily: "'DM Serif Display',serif", lineHeight: 1 }, children: scores.total }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 3 }, children: "/100" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginLeft: "auto", width: 34, height: 34, borderRadius: 9, background: `${gradeColor}30`, border: `2px solid ${gradeColor}`, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 16, fontWeight: 800, color: gradeColor }, children: grade }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8 }, children: [{ l: "E", s: scores.E }, { l: "S", s: scores.S }, { l: "G", s: scores.G }].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 2 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.55)", fontWeight: 600 }, children: p.l }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.75)", fontWeight: 700 }, children: p.s })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 3, background: "rgba(255,255,255,.2)", borderRadius: 99 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${p.s}%`, background: getGradeColor(p.s), borderRadius: 99 } }) })
          ] }, p.l)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 9, color: "rgba(255,255,255,.4)", marginTop: 8 }, children: "Cliquer pour analyser \u2192" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { style: { flex: 1, overflowY: "auto", padding: "6px 8px" }, children: NAV_GROUPS.map((group, gi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 2 }, children: [
          group.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 9, fontWeight: 700, color: C.muted, letterSpacing: 0.9, textTransform: "uppercase", padding: "10px 8px 4px" }, children: group.label }),
          group.items.map((item) => {
            const active = view === item.id;
            const count = item.countKey ? data[item.countKey]?.length ?? 0 : null;
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setView(item.id), style: {
              display: "flex",
              alignItems: "center",
              gap: 9,
              width: "100%",
              padding: "7px 10px",
              borderRadius: 8,
              marginBottom: 1,
              background: active ? C.brandLight : "transparent",
              color: active ? C.brand : C.sub,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 12.5,
              fontWeight: active ? 600 : 400,
              transition: "background .12s",
              fontFamily: "Sora,sans-serif"
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, width: 18, textAlign: "center", flexShrink: 0 }, children: item.icon }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { flex: 1 }, children: item.label }),
              count != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, background: active ? C.brand : "#F4F4F5", color: active ? "#fff" : C.muted, padding: "1px 7px", borderRadius: 99, fontWeight: 600 }, children: count })
            ] }, item.id);
          })
        ] }, gi)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { borderTop: `1px solid ${C.border}`, padding: "10px 8px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setView("settings"), style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: view === "settings" ? C.brandLight : "transparent", border: "none", cursor: "pointer", width: "100%", borderRadius: 9, fontFamily: "Sora,sans-serif" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: `${data.admin.prenom} ${data.admin.nom}`, size: 30 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "left", flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: [
              data.admin.prenom,
              " ",
              data.admin.nom
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 10, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: data.admin.role })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, color: C.muted }, children: "\u2699" })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { height: 58, flexShrink: 0, borderBottom: `1px solid ${C.border}`, background: "#FFFFFF", display: "flex", alignItems: "center", padding: "0 28px", gap: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { style: { fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.2 }, children: TITLES[view] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 11, color: C.muted, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: SUBTITLES[view] })
          ] }),
          view === "legislation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: `${LEGISLATION.length} textes`, color: "blue" }),
          view === "juridique" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { label: "3 sources connect\xE9es", color: "green" }),
          (view === "rse" || view === "juridique") && !data.apiKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setView("settings"), style: { background: C.warningLight, border: `1px solid #FDE68A`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#92400E", fontFamily: "Sora,sans-serif" }, children: "\u26A0\uFE0F Cl\xE9 API manquante \u2192 Param\xE8tres" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, background: saveStatus === "saved" ? C.successLight : saveStatus === "saving" ? C.warningLight : C.bg, border: `1px solid ${saveStatus === "saved" ? "#A7F3D0" : saveStatus === "saving" ? "#FDE68A" : C.border}`, transition: "all .3s" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10 }, children: saveStatus === "saving" ? "\u23F3" : saveStatus === "saved" ? "\u2713" : "\u{1F4BE}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, fontWeight: 500, color: saveStatus === "saved" ? C.success : saveStatus === "saving" ? C.warning : C.muted }, children: saveStatus === "saving" ? "Enregistrement\u2026" : saveStatus === "saved" ? "Enregistr\xE9" : "Synchronis\xE9" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, overflowY: fullscreen ? "hidden" : "auto", padding: fullscreen ? "16px 28px" : "28px 32px", animation: "fadeIn .2s ease" }, children: [
          view === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashView, { data, onScoreDetail: () => setShowScoreDetail(true) }),
          view === "plan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanActionView, { actions: data.planActions || [], setActions: setPlanActions }),
          view === "echeances" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EcheancesView, {}),
          view === "salaries" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalariesView, { employees: data.employees, setEmployees }),
          view === "postes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostesView, { postes: data.postes, setPostes }),
          view === "fournisseurs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FournisseursView, { fournisseurs: data.fournisseurs, setFournisseurs }),
          view === "esg" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsgView, { esg: data.esg, setEsg, onSave: () => showToast("Donn\xE9es ESG enregistr\xE9es") }),
          view === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsView, { documents: data.documents, setDocuments }),
          view === "legislation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegislationView, {}),
          view === "juridique" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RechercheJuridiqueView, { apiKey: data.apiKey }),
          view === "rse" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RseView, { rse: data.rse, setRse, admin: data.admin, apiKey: data.apiKey }),
          view === "rapport" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RapportView, { data, onScoreDetail: () => setShowScoreDetail(true) }),
          view === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, { data, setData })
        ] })
      ] }),
      showScoreDetail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreExplainModal, { scores, esg: data.esg, onClose: () => setShowScoreDetail(false) }),
      toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { position: "fixed", bottom: 28, right: 28, background: toast.type === "error" ? C.danger : C.brand, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 500, zIndex: 300, boxShadow: "0 12px 40px rgba(0,0,0,.2)", animation: "slideIn .25s ease", display: "flex", alignItems: "center", gap: 8, fontFamily: "Sora,sans-serif" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toast.type === "error" ? "\u26A0\uFE0F" : "\u2713" }),
        toast.msg
      ] })
    ] });
  }

  // home/claude/entry-v6.jsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime());
  (0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)(App, {}));
})();
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
