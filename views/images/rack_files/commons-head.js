/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/skin/frontend/rg/angie/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 64);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assign = __webpack_require__(57);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof window.dataLayer === 'undefined') {
  window.dataLayer = [];
}

var _class = function () {
  function _class(config) {
    _classCallCheck(this, _class);

    this.bucketName = config.bucketName || 'No Bucket Name Set';
    this.buckets = config.buckets || {};
    this.testName = config.testName || 'No Test Name Set';
    this.testData = {
      name: this.bucketName,
      buckets: this.buckets
    };

    this.assignedBucket = (0, _assign2.default)(this.testData, this.bucketName);
    this.promoObject = {
      name: this.testName + ' [' + this.assignedBucket + ']'
    };
    this.sendPromoView();
  }

  _createClass(_class, [{
    key: 'sendPromoView',
    value: function sendPromoView() {
      window.dataLayer.push({
        event: 'promotionView',
        ecommerce: {
          promoView: {
            promotions: [this.promoObject]
          }
        }
      });
    }
  }, {
    key: 'sendPromoClick',
    value: function sendPromoClick() {
      window.dataLayer.push({
        event: 'promotionClick',
        ecommerce: {
          promoClick: {
            promotions: [this.promoObject]
          }
        }
      });
    }
  }]);

  return _class;
}();

exports.default = _class;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var index = typeof fetch == 'function' ? fetch.bind() : function (url, options) {
	options = options || {};
	return new Promise(function (resolve, reject) {
		var request = new XMLHttpRequest();

		request.open(options.method || 'get', url, true);

		for (var i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.withCredentials = options.credentials == 'include';

		request.onload = function () {
			resolve(response());
		};

		request.onerror = reject;

		request.send(options.body);

		function response() {
			var _keys = [],
			    all = [],
			    headers = {},
			    header;

			request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (m, key, value) {
				_keys.push(key = key.toLowerCase());
				all.push([key, value]);
				header = headers[key];
				headers[key] = header ? header + "," + value : value;
			});

			return {
				ok: (request.status / 100 | 0) == 2, // 200-299
				status: request.status,
				statusText: request.statusText,
				url: request.responseURL,
				clone: response,
				text: function text() {
					return Promise.resolve(request.responseText);
				},
				json: function json() {
					return Promise.resolve(request.responseText).then(JSON.parse);
				},
				blob: function blob() {
					return Promise.resolve(new Blob([request.response]));
				},
				headers: {
					keys: function keys() {
						return _keys;
					},
					entries: function entries() {
						return all;
					},
					get: function get(n) {
						return headers[n.toLowerCase()];
					},
					has: function has(n) {
						return n.toLowerCase() in headers;
					}
				}
			};
		}
	});
};

exports.default = index;
//# sourceMappingURL=unfetch.es.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MagentoStoreIds = exports.months = exports.days = exports.regions = exports.AUCountries = exports.EUCountries = exports.CACountries = exports.APOCountries = exports.USCountries = exports.states = undefined;

var _states = __webpack_require__(19);

var _countries = __webpack_require__(15);

var _regions = __webpack_require__(18);

var _days = __webpack_require__(16);

var _days2 = _interopRequireDefault(_days);

var _months = __webpack_require__(17);

var _months2 = _interopRequireDefault(_months);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var USRegions = _states.states;
var APORegions = _states.apoStates;

var regions = {
  US: USRegions,
  AT: _regions.ATRegions,
  AU: _regions.AURegions,
  APO: APORegions,
  CA: _regions.CARegions,
  CH: _regions.CHRegions,
  DE: _regions.DERegions,
  EE: _regions.EERegions,
  ES: _regions.ESRegions,
  FI: _regions.FIRegions,
  FR: _regions.FRRegions,
  LT: _regions.LTRegions,
  LV: _regions.LVRegions,
  RO: _regions.RORegions,
  NZ: _regions.NZRegions
};

exports.states = _states.states;
exports.USCountries = _countries.USCountries;
exports.APOCountries = _countries.APOCountries;
exports.CACountries = _countries.CACountries;
exports.EUCountries = _countries.EUCountries;
exports.AUCountries = _countries.AUCountries;
exports.regions = regions;
exports.days = _days2.default;
exports.months = _months2.default;
var MagentoStoreIds = exports.MagentoStoreIds = {
  US: 1,
  CA: 2,
  APO: 4,
  EU: 5,
  AU: 18
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableFirebaseHeaderMethods = exports.setExpirationYears = exports.setSupportsApplePay = exports.isEquivalent = exports.isAutofill = exports.setupRegionId = exports.scrollToElement = exports.scrollToError = exports.rogueCacheTopLinks = exports.getRegionOptions = exports.getCountryOptions = exports.getDefaultCountryId = exports.getParentElement = exports.getQueryString = exports.parseQueryString = exports.loadScript = exports.throttle = exports.debounce = exports.isInViewport = exports.userTiming = exports.getUrl = undefined;

var _getUrl = __webpack_require__(27);

var _getUrl2 = _interopRequireDefault(_getUrl);

var _userTiming = __webpack_require__(40);

var _userTiming2 = _interopRequireDefault(_userTiming);

var _isInViewport = __webpack_require__(30);

var _isInViewport2 = _interopRequireDefault(_isInViewport);

var _debounce = __webpack_require__(20);

var _debounce2 = _interopRequireDefault(_debounce);

var _throttle = __webpack_require__(39);

var _throttle2 = _interopRequireDefault(_throttle);

var _loadScript = __webpack_require__(31);

var _loadScript2 = _interopRequireDefault(_loadScript);

var _parseQueryString = __webpack_require__(32);

var _parseQueryString2 = _interopRequireDefault(_parseQueryString);

var _getQueryString = __webpack_require__(25);

var _getQueryString2 = _interopRequireDefault(_getQueryString);

var _getParentElement = __webpack_require__(24);

var _getParentElement2 = _interopRequireDefault(_getParentElement);

var _getDefaultCountryId = __webpack_require__(23);

var _getDefaultCountryId2 = _interopRequireDefault(_getDefaultCountryId);

var _getCountryOptions = __webpack_require__(22);

var _getCountryOptions2 = _interopRequireDefault(_getCountryOptions);

var _getRegionOptions = __webpack_require__(26);

var _getRegionOptions2 = _interopRequireDefault(_getRegionOptions);

var _rogueCacheTopLinks = __webpack_require__(33);

var _rogueCacheTopLinks2 = _interopRequireDefault(_rogueCacheTopLinks);

var _scrollToError = __webpack_require__(35);

var _scrollToError2 = _interopRequireDefault(_scrollToError);

var _scrollToElement = __webpack_require__(34);

var _scrollToElement2 = _interopRequireDefault(_scrollToElement);

var _setupRegionId = __webpack_require__(38);

var _setupRegionId2 = _interopRequireDefault(_setupRegionId);

var _isAutofill = __webpack_require__(28);

var _isAutofill2 = _interopRequireDefault(_isAutofill);

var _isEquivalent = __webpack_require__(29);

var _isEquivalent2 = _interopRequireDefault(_isEquivalent);

var _setSupportsApplePay = __webpack_require__(37);

var _setSupportsApplePay2 = _interopRequireDefault(_setSupportsApplePay);

var _setExpirationYears = __webpack_require__(36);

var _setExpirationYears2 = _interopRequireDefault(_setExpirationYears);

var _disableFirebaseHeaderMethods = __webpack_require__(21);

var _disableFirebaseHeaderMethods2 = _interopRequireDefault(_disableFirebaseHeaderMethods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getUrl = _getUrl2.default;
exports.userTiming = _userTiming2.default;
exports.isInViewport = _isInViewport2.default;
exports.debounce = _debounce2.default;
exports.throttle = _throttle2.default;
exports.loadScript = _loadScript2.default;
exports.parseQueryString = _parseQueryString2.default;
exports.getQueryString = _getQueryString2.default;
exports.getParentElement = _getParentElement2.default;
exports.getDefaultCountryId = _getDefaultCountryId2.default;
exports.getCountryOptions = _getCountryOptions2.default;
exports.getRegionOptions = _getRegionOptions2.default;
exports.rogueCacheTopLinks = _rogueCacheTopLinks2.default;
exports.scrollToError = _scrollToError2.default;
exports.scrollToElement = _scrollToElement2.default;
exports.setupRegionId = _setupRegionId2.default;
exports.isAutofill = _isAutofill2.default;
exports.isEquivalent = _isEquivalent2.default;
exports.setSupportsApplePay = _setSupportsApplePay2.default;
exports.setExpirationYears = _setExpirationYears2.default;
exports.disableFirebaseHeaderMethods = _disableFirebaseHeaderMethods2.default; /* eslint-disable import/prefer-default-export */

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regeneratorRuntime = __webpack_require__(9);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

__webpack_require__(46);

__webpack_require__(52);

__webpack_require__(50);

__webpack_require__(51);

__webpack_require__(48);

__webpack_require__(49);

__webpack_require__(42);

__webpack_require__(41);

__webpack_require__(43);

__webpack_require__(45);

__webpack_require__(55);

__webpack_require__(54);

__webpack_require__(53);

__webpack_require__(56);

__webpack_require__(44);

__webpack_require__(47);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.regeneratorRuntime = _regeneratorRuntime2.default;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function coreDataLayerHead() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'dataLayer-initialized',
    page: {
      buildDate: "Tue, 28 Apr 2020 15:56:11 GMT",
      pageCategory: window.globalStore.magento.pageCategory
    }
  });
}

coreDataLayerHead();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(58);

var _hideQuickviewButton = __webpack_require__(60);

var _hideQuickviewButton2 = _interopRequireDefault(_hideQuickviewButton);

var _newCheckoutTest = __webpack_require__(61);

var _newCheckoutTest2 = _interopRequireDefault(_newCheckoutTest);

__webpack_require__(59);

__webpack_require__(62);

__webpack_require__(63);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _hideQuickviewButton2.default)();
new _newCheckoutTest2.default();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function processBlock(blocks, module) {
  if (!Object.prototype.hasOwnProperty.call(window.globalStore, module)) {
    window.globalStore[module] = {};
  }

  if (blocks[module]) {
    if (_typeof(blocks[module]) === 'object') {
      Object.keys(blocks[module]).forEach(function (key) {
        window.globalStore[module][key] = blocks[module][key];
      });
    } else {
      window.globalStore[module] = blocks[module];
    }
  }
}

document.observe('fpc:response', function (e) {
  window.globalStore = window.globalStore || {};

  var blocks = e.memo[window.globalStore.fpc.cacheId];
  if (blocks) {
    Object.keys(blocks).forEach(processBlock.bind(undefined, blocks));
  }

  if (window.eventHub) {
    window.eventHub.$emit('fpc:response', e);
  }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = function () {
  return this;
}() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(10);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch (e) {
    g.regeneratorRuntime = undefined;
  }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = ( false ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// In sloppy mode, unbound `this` refers to the global object, fallback to
// Function constructor if we're in global strict mode. That is sadly a form
// of indirect eval which violates Content Security Policy.
function () {
  return this;
}() || Function("return this")());
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var umd =
/******/function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, {
        /******/configurable: false,
        /******/enumerable: true,
        /******/get: getter
        /******/ });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = "";
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = 18);
  /******/
}(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports) {

  var core = module.exports = { version: '2.5.1' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


  /***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

  // Thank's IE8 for his funny defineProperty
  module.exports = !__webpack_require__(4)(function () {
    return Object.defineProperty({}, 'a', { get: function get() {
        return 7;
      } }).a != 7;
  });

  /***/
},
/* 2 */
/***/function (module, exports) {

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


  /***/
},
/* 3 */
/***/function (module, exports, __webpack_require__) {

  var global = __webpack_require__(2);
  var core = __webpack_require__(0);
  var ctx = __webpack_require__(33);
  var hide = __webpack_require__(35);
  var PROTOTYPE = 'prototype';

  var $export = function $export(type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var IS_WRAP = type & $export.W;
    var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
    var expProto = exports[PROTOTYPE];
    var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
    var key, own, out;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      if (own && key in exports) continue;
      // export native or passed
      out = own ? target[key] : source[key];
      // prevent global pollution for namespaces
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
      // bind timers to global for call from export context
      : IS_BIND && own ? ctx(out, global)
      // wrap global constructors for prevent change them in library
      : IS_WRAP && target[key] == out ? function (C) {
        var F = function F(a, b, c) {
          if (this instanceof C) {
            switch (arguments.length) {
              case 0:
                return new C();
              case 1:
                return new C(a);
              case 2:
                return new C(a, b);
            }return new C(a, b, c);
          }return C.apply(this, arguments);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
        // make static versions for prototype methods
      }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
      if (IS_PROTO) {
        (exports.virtual || (exports.virtual = {}))[key] = out;
        // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
        if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
      }
    }
  };
  // type bitmap
  $export.F = 1; // forced
  $export.G = 2; // global
  $export.S = 4; // static
  $export.P = 8; // proto
  $export.B = 16; // bind
  $export.W = 32; // wrap
  $export.U = 64; // safe
  $export.R = 128; // real proto method for `library`
  module.exports = $export;

  /***/
},
/* 4 */
/***/function (module, exports) {

  module.exports = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  /***/
},
/* 5 */
/***/function (module, exports, __webpack_require__) {

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  var $keys = __webpack_require__(24);
  var enumBugKeys = __webpack_require__(16);

  module.exports = Object.keys || function keys(O) {
    return $keys(O, enumBugKeys);
  };

  /***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

  var anObject = __webpack_require__(7);
  var IE8_DOM_DEFINE = __webpack_require__(36);
  var toPrimitive = __webpack_require__(37);
  var dP = Object.defineProperty;

  exports.f = __webpack_require__(1) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return dP(O, P, Attributes);
    } catch (e) {/* empty */}
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  /***/
},
/* 7 */
/***/function (module, exports, __webpack_require__) {

  var isObject = __webpack_require__(8);
  module.exports = function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  /***/
},
/* 8 */
/***/function (module, exports) {

  module.exports = function (it) {
    return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
  };

  /***/
},
/* 9 */
/***/function (module, exports, __webpack_require__) {

  module.exports = { "default": __webpack_require__(22), __esModule: true };

  /***/
},
/* 10 */
/***/function (module, exports, __webpack_require__) {

  // 7.1.13 ToObject(argument)
  var defined = __webpack_require__(11);
  module.exports = function (it) {
    return Object(defined(it));
  };

  /***/
},
/* 11 */
/***/function (module, exports) {

  // 7.2.1 RequireObjectCoercible(argument)
  module.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  /***/
},
/* 12 */
/***/function (module, exports, __webpack_require__) {

  // to indexed object, toObject with fallback for non-array-like ES3 strings
  var IObject = __webpack_require__(13);
  var defined = __webpack_require__(11);
  module.exports = function (it) {
    return IObject(defined(it));
  };

  /***/
},
/* 13 */
/***/function (module, exports, __webpack_require__) {

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var cof = __webpack_require__(26);
  // eslint-disable-next-line no-prototype-builtins
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };

  /***/
},
/* 14 */
/***/function (module, exports) {

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  module.exports = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  /***/
},
/* 15 */
/***/function (module, exports, __webpack_require__) {

  var shared = __webpack_require__(30)('keys');
  var uid = __webpack_require__(31);
  module.exports = function (key) {
    return shared[key] || (shared[key] = uid(key));
  };

  /***/
},
/* 16 */
/***/function (module, exports) {

  // IE 8- don't enum bug keys
  module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

  /***/
},
/* 17 */
/***/function (module, exports, __webpack_require__) {

  var isObject = __webpack_require__(8);
  var document = __webpack_require__(2).document;
  // typeof document.createElement is 'object' in old IE
  var is = isObject(document) && isObject(document.createElement);
  module.exports = function (it) {
    return is ? document.createElement(it) : {};
  };

  /***/
},
/* 18 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _study = __webpack_require__(19);

  var _study2 = _interopRequireDefault(_study);

  var _browserCookie = __webpack_require__(51);

  var _browserCookie2 = _interopRequireDefault(_browserCookie);

  var _local = __webpack_require__(52);

  var _local2 = _interopRequireDefault(_local);

  var _memory = __webpack_require__(53);

  var _memory2 = _interopRequireDefault(_memory);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  // this is the build for webpack and UMD builds
  // try not to use this!
  exports.default = _study2.default;

  var stores = {
    browserCookie: (0, _browserCookie2.default)(),
    local: (0, _local2.default)(),
    memory: (0, _memory2.default)()
  };

  window.Study = _study2.default;
  _study2.default.stores = stores;

  /***/
},
/* 19 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _stringify = __webpack_require__(20);

  var _stringify2 = _interopRequireDefault(_stringify);

  var _keys = __webpack_require__(9);

  var _keys2 = _interopRequireDefault(_keys);

  var _assign = __webpack_require__(39);

  var _assign2 = _interopRequireDefault(_assign);

  var _classCallCheck2 = __webpack_require__(45);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass2 = __webpack_require__(46);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _utils = __webpack_require__(50);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var Study = function () {
    function Study() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      (0, _classCallCheck3.default)(this, Study);

      (0, _assign2.default)(this, {
        storageKey: 'ab-tests',
        root: typeof document !== 'undefined' ? document.body : null
      }, options);

      (0, _utils.validateStore)(this.store);

      this.previousAssignments = {};
      try {
        // assert that the data is a JSON string
        // that represents a JSON object
        // saw a bug where it was, for some reason, stored as `null`
        var data = this.store.get(this.storageKey);
        if (typeof data === 'string' && data[0] === '{') {
          this.previousAssignments = JSON.parse(data);
        }
      } catch (_) {
        // ignore
      }

      this.userAssignments = {};
      this.persistedUserAssignments = {};
      this.providedTests = [];
    }

    (0, _createClass3.default)(Study, [{
      key: 'define',
      value: function define(tests) {
        var _this = this;

        var normalizedData = tests;
        if (!Array.isArray(tests)) normalizedData = [tests];

        normalizedData.forEach(function (test) {
          if (!test.name) throw new Error('Tests must have a name');
          if (!test.buckets) throw new Error('Tests must have buckets');
          if (!(0, _keys2.default)(test.buckets)) throw new Error('Tests must have buckets');
          _this.providedTests.push(test);
        });
      }
    }, {
      key: 'definitions',
      value: function definitions() {
        return this.providedTests;
      }
    }, {
      key: 'removeClasses',
      value: function removeClasses(testName, exceptClassName) {
        var root = this.root;

        if (!root) return;

        // classList does not support returning all classes
        var currentClassNames = root.className.split(/\s+/g).map(function (x) {
          return x.trim();
        }).filter(Boolean);

        currentClassNames.filter(function (x) {
          return x.indexOf(testName + '--') === 0;
        }).filter(function (className) {
          return className !== exceptClassName;
        }).forEach(function (className) {
          return root.classList.remove(className);
        });
      }
    }, {
      key: 'applyClasses',
      value: function applyClasses() {
        var _this2 = this;

        var userAssignments = this.userAssignments,
            root = this.root;

        if (!root) return;

        (0, _keys2.default)(userAssignments).forEach(function (testName) {
          var bucket = userAssignments[testName];

          var className = bucket ? testName + '--' + bucket : null;
          // remove all classes related to this bucket
          _this2.removeClasses(testName, className);

          // only assign a class is the test is assigned to a bucket
          // this removes then adds a class, which is not ideal but is clean
          if (className) root.classList.add(className);
        });
      }
    }, {
      key: 'assignAll',
      value: function assignAll() {
        var previousAssignments = this.previousAssignments,
            userAssignments = this.userAssignments,
            persistedUserAssignments = this.persistedUserAssignments;

        this.providedTests.forEach(function (test) {
          // winners take precedence
          {
            var winner = (0, _keys2.default)(test.buckets).filter(function (name) {
              return test.buckets[name].winner;
            })[0];
            if (winner) {
              userAssignments[test.name] = winner;
              return;
            }
          }

          // already assigned, probably because someone
          // called `.assignAll()` twice.
          if (userAssignments[test.name]) return;

          {
            // previously assigned, so we continue to persist it
            var bucket = previousAssignments[test.name];
            if (bucket && test.buckets[bucket]) {
              var assignment = previousAssignments[test.name];
              persistedUserAssignments[test.name] = assignment;
              userAssignments[test.name] = assignment;
              test.active = true;
              return;
            }
          }

          // inactive tests should be set to default
          if (test.active === false) {
            userAssignments[test.name] = (0, _utils.getDefaultBucket)(test.buckets);
            return;
          }

          // randomly assign
          {
            var _assignment = (0, _utils.getRandomAssignment)(test);
            persistedUserAssignments[test.name] = _assignment;
            userAssignments[test.name] = _assignment;
          }
        });

        this.persist();
        this.applyClasses();
      }
    }, {
      key: 'assign',
      value: function assign(testName, bucketName) {
        if (!testName) return this.assignAll();

        var test = this.providedTests.filter(function (x) {
          return x.name === testName;
        })[0];
        if (bucketName === null || !test) {
          delete this.userAssignments[testName];
          delete this.persistedUserAssignments[testName];
          this.persist();
          this.removeClasses(testName);
          return;
        }

        var assignment = bucketName || (0, _utils.getRandomAssignment)(test);
        this.userAssignments[testName] = assignment;
        this.persistedUserAssignments[testName] = assignment;
        test.active = true;

        this.persist();
        this.applyClasses();
      }
    }, {
      key: 'assignments',
      value: function assignments() {
        return this.userAssignments;
      }
    }, {
      key: 'persist',
      value: function persist() {
        this.store.set(this.storageKey, (0, _stringify2.default)(this.persistedUserAssignments));
      }
    }]);
    return Study;
  }();

  exports.default = Study;

  /***/
},
/* 20 */
/***/function (module, exports, __webpack_require__) {

  module.exports = { "default": __webpack_require__(21), __esModule: true };

  /***/
},
/* 21 */
/***/function (module, exports, __webpack_require__) {

  var core = __webpack_require__(0);
  var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
  module.exports = function stringify(it) {
    // eslint-disable-line no-unused-vars
    return $JSON.stringify.apply($JSON, arguments);
  };

  /***/
},
/* 22 */
/***/function (module, exports, __webpack_require__) {

  __webpack_require__(23);
  module.exports = __webpack_require__(0).Object.keys;

  /***/
},
/* 23 */
/***/function (module, exports, __webpack_require__) {

  // 19.1.2.14 Object.keys(O)
  var toObject = __webpack_require__(10);
  var $keys = __webpack_require__(5);

  __webpack_require__(32)('keys', function () {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });

  /***/
},
/* 24 */
/***/function (module, exports, __webpack_require__) {

  var has = __webpack_require__(25);
  var toIObject = __webpack_require__(12);
  var arrayIndexOf = __webpack_require__(27)(false);
  var IE_PROTO = __webpack_require__(15)('IE_PROTO');

  module.exports = function (object, names) {
    var O = toIObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) {
      if (key != IE_PROTO) has(O, key) && result.push(key);
    } // Don't enum bug & hidden keys
    while (names.length > i) {
      if (has(O, key = names[i++])) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
    }return result;
  };

  /***/
},
/* 25 */
/***/function (module, exports) {

  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  /***/
},
/* 26 */
/***/function (module, exports) {

  var toString = {}.toString;

  module.exports = function (it) {
    return toString.call(it).slice(8, -1);
  };

  /***/
},
/* 27 */
/***/function (module, exports, __webpack_require__) {

  // false -> Array#indexOf
  // true  -> Array#includes
  var toIObject = __webpack_require__(12);
  var toLength = __webpack_require__(28);
  var toAbsoluteIndex = __webpack_require__(29);
  module.exports = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
      } else for (; length > index; index++) {
        if (IS_INCLUDES || index in O) {
          if (O[index] === el) return IS_INCLUDES || index || 0;
        }
      }return !IS_INCLUDES && -1;
    };
  };

  /***/
},
/* 28 */
/***/function (module, exports, __webpack_require__) {

  // 7.1.15 ToLength
  var toInteger = __webpack_require__(14);
  var min = Math.min;
  module.exports = function (it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  /***/
},
/* 29 */
/***/function (module, exports, __webpack_require__) {

  var toInteger = __webpack_require__(14);
  var max = Math.max;
  var min = Math.min;
  module.exports = function (index, length) {
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  };

  /***/
},
/* 30 */
/***/function (module, exports, __webpack_require__) {

  var global = __webpack_require__(2);
  var SHARED = '__core-js_shared__';
  var store = global[SHARED] || (global[SHARED] = {});
  module.exports = function (key) {
    return store[key] || (store[key] = {});
  };

  /***/
},
/* 31 */
/***/function (module, exports) {

  var id = 0;
  var px = Math.random();
  module.exports = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  /***/
},
/* 32 */
/***/function (module, exports, __webpack_require__) {

  // most Object methods by ES6 should accept primitives
  var $export = __webpack_require__(3);
  var core = __webpack_require__(0);
  var fails = __webpack_require__(4);
  module.exports = function (KEY, exec) {
    var fn = (core.Object || {})[KEY] || Object[KEY];
    var exp = {};
    exp[KEY] = exec(fn);
    $export($export.S + $export.F * fails(function () {
      fn(1);
    }), 'Object', exp);
  };

  /***/
},
/* 33 */
/***/function (module, exports, __webpack_require__) {

  // optional / simple context binding
  var aFunction = __webpack_require__(34);
  module.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function () /* ...args */{
      return fn.apply(that, arguments);
    };
  };

  /***/
},
/* 34 */
/***/function (module, exports) {

  module.exports = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  /***/
},
/* 35 */
/***/function (module, exports, __webpack_require__) {

  var dP = __webpack_require__(6);
  var createDesc = __webpack_require__(38);
  module.exports = __webpack_require__(1) ? function (object, key, value) {
    return dP.f(object, key, createDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  /***/
},
/* 36 */
/***/function (module, exports, __webpack_require__) {

  module.exports = !__webpack_require__(1) && !__webpack_require__(4)(function () {
    return Object.defineProperty(__webpack_require__(17)('div'), 'a', { get: function get() {
        return 7;
      } }).a != 7;
  });

  /***/
},
/* 37 */
/***/function (module, exports, __webpack_require__) {

  // 7.1.1 ToPrimitive(input [, PreferredType])
  var isObject = __webpack_require__(8);
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  module.exports = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  /***/
},
/* 38 */
/***/function (module, exports) {

  module.exports = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  /***/
},
/* 39 */
/***/function (module, exports, __webpack_require__) {

  module.exports = { "default": __webpack_require__(40), __esModule: true };

  /***/
},
/* 40 */
/***/function (module, exports, __webpack_require__) {

  __webpack_require__(41);
  module.exports = __webpack_require__(0).Object.assign;

  /***/
},
/* 41 */
/***/function (module, exports, __webpack_require__) {

  // 19.1.3.1 Object.assign(target, source)
  var $export = __webpack_require__(3);

  $export($export.S + $export.F, 'Object', { assign: __webpack_require__(42) });

  /***/
},
/* 42 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  // 19.1.2.1 Object.assign(target, source, ...)

  var getKeys = __webpack_require__(5);
  var gOPS = __webpack_require__(43);
  var pIE = __webpack_require__(44);
  var toObject = __webpack_require__(10);
  var IObject = __webpack_require__(13);
  var $assign = Object.assign;

  // should work with symbols and should have deterministic property order (V8 bug)
  module.exports = !$assign || __webpack_require__(4)(function () {
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var S = Symbol();
    var K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) {
      B[k] = k;
    });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars
    var T = toObject(target);
    var aLen = arguments.length;
    var index = 1;
    var getSymbols = gOPS.f;
    var isEnum = pIE.f;
    while (aLen > index) {
      var S = IObject(arguments[index++]);
      var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
      }
    }return T;
  } : $assign;

  /***/
},
/* 43 */
/***/function (module, exports) {

  exports.f = Object.getOwnPropertySymbols;

  /***/
},
/* 44 */
/***/function (module, exports) {

  exports.f = {}.propertyIsEnumerable;

  /***/
},
/* 45 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  exports.__esModule = true;

  exports.default = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  /***/
},
/* 46 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  exports.__esModule = true;

  var _defineProperty = __webpack_require__(47);

  var _defineProperty2 = _interopRequireDefault(_defineProperty);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        (0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /***/
},
/* 47 */
/***/function (module, exports, __webpack_require__) {

  module.exports = { "default": __webpack_require__(48), __esModule: true };

  /***/
},
/* 48 */
/***/function (module, exports, __webpack_require__) {

  __webpack_require__(49);
  var $Object = __webpack_require__(0).Object;
  module.exports = function defineProperty(it, key, desc) {
    return $Object.defineProperty(it, key, desc);
  };

  /***/
},
/* 49 */
/***/function (module, exports, __webpack_require__) {

  var $export = __webpack_require__(3);
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  $export($export.S + $export.F * !__webpack_require__(1), 'Object', { defineProperty: __webpack_require__(6).f });

  /***/
},
/* 50 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getRandomAssignment = exports.validateStore = exports.getDefaultBucket = exports.chooseWeightedItem = exports.rand = undefined;

  var _keys = __webpack_require__(9);

  var _keys2 = _interopRequireDefault(_keys);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var rand = exports.rand = function rand(min, max) {
    return Math.random() * (max - min) + min;
  };

  // choose a random value with the specified weights
  var chooseWeightedItem = exports.chooseWeightedItem = function chooseWeightedItem(names, weights) {
    if (names.length !== weights.length) throw new Error('names and weights must have equal length!');
    var sum = weights.reduce(function (a, b) {
      return a + b;
    }, 0);
    var limit = 0;
    var n = rand(0, sum);
    for (var i = 0; i < names.length; i++) {
      limit += weights[i];
      if (n <= limit) return names[i];
    }
    // by default, return the last weight
    return names[names.length - 1];
  };

  // get the default bucket,
  // which is either the default/winner,
  // otherwise whichever is returned first
  var getDefaultBucket = exports.getDefaultBucket = function getDefaultBucket(buckets) {
    var defaultBuckets = (0, _keys2.default)(buckets).filter(function (name) {
      var x = buckets[name];
      return x.default || x.winner;
    });
    return defaultBuckets[0] || (0, _keys2.default)(buckets)[0];
  };

  var validateStore = exports.validateStore = function validateStore(store) {
    if (!store) throw new Error('You must supply a store!');
    if (typeof store.get !== 'function') throw new Error('The store must implement .get()');
    if (typeof store.set !== 'function') throw new Error('The store must implement .set()');
    if (typeof store.isSupported !== 'function') throw new Error('The store must implement .isSupported()');
    if (!store.isSupported()) throw new Error('The store is not supported.');
  };

  var getRandomAssignment = exports.getRandomAssignment = function getRandomAssignment(test) {
    var names = (0, _keys2.default)(test.buckets);
    var weights = [];

    names.forEach(function (innerBucketName) {
      var weight = test.buckets[innerBucketName].weight;
      if (weight == null) weight = 1;
      weights.push(weight);
    });

    return chooseWeightedItem(names, weights);
  };

  /***/
},
/* 51 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  // NOTE: use a module
  exports.default = function () {
    return {
      type: 'browserCookie',
      /*eslint-disable */
      get: function get(key) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      },
      set: function set(key, val) {
        return document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(val) + "; expires=expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      },
      /*eslint-enable */
      isSupported: function isSupported() {
        return typeof document !== 'undefined';
      }
    };
  };

  /***/
},
/* 52 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    return {
      type: 'local',
      get: function get(key) {
        return localStorage.getItem(key);
      },
      set: function set(key, val) {
        return localStorage.setItem(key, val);
      },
      isSupported: function isSupported() {
        if (typeof localStorage !== 'undefined') return true;
        var uid = new Date();
        try {
          localStorage.setItem(uid, uid);
          localStorage.removeItem(uid);
          return true;
        } catch (e) {
          return false;
        }
      }
    };
  };

  /***/
},
/* 53 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _create = __webpack_require__(54);

  var _create2 = _interopRequireDefault(_create);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = function () {
    var store = (0, _create2.default)(null);

    return {
      type: 'memory',
      get: function get(key) {
        return store[key];
      },
      set: function set(key, val) {
        store[key] = val;
      },
      isSupported: function isSupported() {
        return true;
      }
    };
  };

  /***/
},
/* 54 */
/***/function (module, exports, __webpack_require__) {

  module.exports = { "default": __webpack_require__(55), __esModule: true };

  /***/
},
/* 55 */
/***/function (module, exports, __webpack_require__) {

  __webpack_require__(56);
  var $Object = __webpack_require__(0).Object;
  module.exports = function create(P, D) {
    return $Object.create(P, D);
  };

  /***/
},
/* 56 */
/***/function (module, exports, __webpack_require__) {

  var $export = __webpack_require__(3);
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  $export($export.S, 'Object', { create: __webpack_require__(57) });

  /***/
},
/* 57 */
/***/function (module, exports, __webpack_require__) {

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  var anObject = __webpack_require__(7);
  var dPs = __webpack_require__(58);
  var enumBugKeys = __webpack_require__(16);
  var IE_PROTO = __webpack_require__(15)('IE_PROTO');
  var Empty = function Empty() {/* empty */};
  var PROTOTYPE = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var _createDict = function createDict() {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = __webpack_require__(17)('iframe');
    var i = enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    __webpack_require__(59).appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    _createDict = iframeDocument.F;
    while (i--) {
      delete _createDict[PROTOTYPE][enumBugKeys[i]];
    }return _createDict();
  };

  module.exports = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = _createDict();
    return Properties === undefined ? result : dPs(result, Properties);
  };

  /***/
},
/* 58 */
/***/function (module, exports, __webpack_require__) {

  var dP = __webpack_require__(6);
  var anObject = __webpack_require__(7);
  var getKeys = __webpack_require__(5);

  module.exports = __webpack_require__(1) ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = getKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) {
      dP.f(O, P = keys[i++], Properties[P]);
    }return O;
  };

  /***/
},
/* 59 */
/***/function (module, exports, __webpack_require__) {

  var document = __webpack_require__(2).document;
  module.exports = document && document.documentElement;

  /***/
}]
/******/);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!window.fetch) window.fetch = __webpack_require__(1).default || __webpack_require__(1);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var USCountries = exports.USCountries = [{ name: 'Afghanistan', code: 'AF' }, { name: 'Åland Islands', code: 'AX' }, { name: 'Albania', code: 'AL' }, { name: 'Algeria', code: 'DZ' }, { name: 'American Samoa', code: 'AS' }, { name: 'Andorra', code: 'AD' }, { name: 'Angola', code: 'AO' }, { name: 'Anguilla', code: 'AI' }, { name: 'Antarctica', code: 'AQ' }, { name: 'Antigua and Barbuda', code: 'AG' }, { name: 'Argentina', code: 'AR' }, { name: 'Armenia', code: 'AM' }, { name: 'Aruba', code: 'AW' }, { name: 'Australia', code: 'AU' }, { name: 'Austria', code: 'AT' }, { name: 'Azerbaijan', code: 'AZ' }, { name: 'Bahamas', code: 'BS' }, { name: 'Bahrain', code: 'BH' }, { name: 'Bangladesh', code: 'BD' }, { name: 'Barbados', code: 'BB' }, { name: 'Belarus', code: 'BY' }, { name: 'Belgium', code: 'BE' }, { name: 'Belize', code: 'BZ' }, { name: 'Benin', code: 'BJ' }, { name: 'Bermuda', code: 'BM' }, { name: 'Bhutan', code: 'BT' }, { name: 'Bolivia', code: 'BO' }, { name: 'Bosnia and Herzegovina', code: 'BA' }, { name: 'Botswana', code: 'BW' }, { name: 'Bouvet Island', code: 'BV' }, { name: 'Brazil', code: 'BR' }, { name: 'British Indian Ocean Territory', code: 'IO' }, { name: 'Brunei Darussalam', code: 'BN' }, { name: 'Bulgaria', code: 'BG' }, { name: 'Burkina Faso', code: 'BF' }, { name: 'Burundi', code: 'BI' }, { name: 'Cambodia', code: 'KH' }, { name: 'Cameroon', code: 'CM' }, { name: 'Canada', code: 'CA' }, { name: 'Cape Verde', code: 'CV' }, { name: 'Cayman Islands', code: 'KY' }, { name: 'Central African Republic', code: 'CF' }, { name: 'Chad', code: 'TD' }, { name: 'Chile', code: 'CL' }, { name: 'China', code: 'CN' }, { name: 'Christmas Island', code: 'CX' }, { name: 'Cocos (Keeling) Islands', code: 'CC' }, { name: 'Colombia', code: 'CO' }, { name: 'Comoros', code: 'KM' }, { name: 'Congo', code: 'CG' }, { name: 'Congo, The Democratic Republic of the', code: 'CD' }, { name: 'Cook Islands', code: 'CK' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Cote D\'Ivoire', code: 'CI' }, { name: 'Croatia', code: 'HR' }, { name: 'Cuba', code: 'CU' }, { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' }, { name: 'Djibouti', code: 'DJ' }, { name: 'Dominica', code: 'DM' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Ecuador', code: 'EC' }, { name: 'Egypt', code: 'EG' }, { name: 'El Salvador', code: 'SV' }, { name: 'Equatorial Guinea', code: 'GQ' }, { name: 'Eritrea', code: 'ER' }, { name: 'Estonia', code: 'EE' }, { name: 'Ethiopia', code: 'ET' }, { name: 'Falkland Islands (Malvinas)', code: 'FK' }, { name: 'Faroe Islands', code: 'FO' }, { name: 'Fiji', code: 'FJ' }, { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'French Guiana', code: 'GF' }, { name: 'French Polynesia', code: 'PF' }, { name: 'French Southern Territories', code: 'TF' }, { name: 'Gabon', code: 'GA' }, { name: 'Gambia', code: 'GM' }, { name: 'Georgia', code: 'GE' }, { name: 'Germany', code: 'DE' }, { name: 'Ghana', code: 'GH' }, { name: 'Gibraltar', code: 'GI' }, { name: 'Greece', code: 'GR' }, { name: 'Greenland', code: 'GL' }, { name: 'Grenada', code: 'GD' }, { name: 'Guadeloupe', code: 'GP' }, { name: 'Guam', code: 'GU' }, { name: 'Guatemala', code: 'GT' }, { name: 'Guernsey', code: 'GG' }, { name: 'Guinea', code: 'GN' }, { name: 'Guinea-Bissau', code: 'GW' }, { name: 'Guyana', code: 'GY' }, { name: 'Haiti', code: 'HT' }, { name: 'Heard Island and Mcdonald Islands', code: 'HM' }, { name: 'Holy See (Vatican City State)', code: 'VA' }, { name: 'Honduras', code: 'HN' }, { name: 'Hong Kong', code: 'HK' }, { name: 'Hungary', code: 'HU' }, { name: 'Iceland', code: 'IS' }, { name: 'India', code: 'IN' }, { name: 'Indonesia', code: 'ID' }, { name: 'Iran, Islamic Republic Of', code: 'IR' }, { name: 'Iraq', code: 'IQ' }, { name: 'Ireland', code: 'IE' }, { name: 'Isle of Man', code: 'IM' }, { name: 'Israel', code: 'IL' }, { name: 'Italy', code: 'IT' }, { name: 'Jamaica', code: 'JM' }, { name: 'Japan', code: 'JP' }, { name: 'Jersey', code: 'JE' }, { name: 'Jordan', code: 'JO' }, { name: 'Kazakhstan', code: 'KZ' }, { name: 'Kenya', code: 'KE' }, { name: 'Kiribati', code: 'KI' }, { name: 'Korea, Democratic People\'S Republic of', code: 'KP' }, { name: 'Korea, Republic of', code: 'KR' }, { name: 'Kuwait', code: 'KW' }, { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Lao People\'S Democratic Republic', code: 'LA' }, { name: 'Latvia', code: 'LV' }, { name: 'Lebanon', code: 'LB' }, { name: 'Lesotho', code: 'LS' }, { name: 'Liberia', code: 'LR' }, { name: 'Libyan Arab Jamahiriya', code: 'LY' }, { name: 'Liechtenstein', code: 'LI' }, { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Macao', code: 'MO' }, { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' }, { name: 'Madagascar', code: 'MG' }, { name: 'Malawi', code: 'MW' }, { name: 'Malaysia', code: 'MY' }, { name: 'Maldives', code: 'MV' }, { name: 'Mali', code: 'ML' }, { name: 'Malta', code: 'MT' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Martinique', code: 'MQ' }, { name: 'Mauritania', code: 'MR' }, { name: 'Mauritius', code: 'MU' }, { name: 'Mayotte', code: 'YT' }, { name: 'Mexico', code: 'MX' }, { name: 'Micronesia, Federated States of', code: 'FM' }, { name: 'Moldova, Republic of', code: 'MD' }, { name: 'Monaco', code: 'MC' }, { name: 'Mongolia', code: 'MN' }, { name: 'Montenegro', code: 'ME' }, { name: 'Montserrat', code: 'MS' }, { name: 'Morocco', code: 'MA' }, { name: 'Mozambique', code: 'MZ' }, { name: 'Myanmar', code: 'MM' }, { name: 'Namibia', code: 'NA' }, { name: 'Nauru', code: 'NR' }, { name: 'Nepal', code: 'NP' }, { name: 'Netherlands', code: 'NL' }, { name: 'Netherlands Antilles', code: 'AN' }, { name: 'New Caledonia', code: 'NC' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Nicaragua', code: 'NI' }, { name: 'Niger', code: 'NE' }, { name: 'Nigeria', code: 'NG' }, { name: 'Niue', code: 'NU' }, { name: 'Norfolk Island', code: 'NF' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Norway', code: 'NO' }, { name: 'Oman', code: 'OM' }, { name: 'Pakistan', code: 'PK' }, { name: 'Palau', code: 'PW' }, { name: 'Palestinian Territory, Occupied', code: 'PS' }, { name: 'Panama', code: 'PA' }, { name: 'Papua New Guinea', code: 'PG' }, { name: 'Paraguay', code: 'PY' }, { name: 'Peru', code: 'PE' }, { name: 'Philippines', code: 'PH' }, { name: 'Pitcairn', code: 'PN' }, { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Qatar', code: 'QA' }, { name: 'Reunion', code: 'RE' }, { name: 'Romania', code: 'RO' }, { name: 'Russian Federation', code: 'RU' }, { name: 'RWANDA', code: 'RW' }, { name: 'Saint Helena', code: 'SH' }, { name: 'Saint Kitts and Nevis', code: 'KN' }, { name: 'Saint Lucia', code: 'LC' }, { name: 'Saint Pierre and Miquelon', code: 'PM' }, { name: 'Saint Vincent and the Grenadines', code: 'VC' }, { name: 'Samoa', code: 'WS' }, { name: 'San Marino', code: 'SM' }, { name: 'Sao Tome and Principe', code: 'ST' },
// { name: 'Saudi Arabia', code: 'SA' },
{ name: 'Senegal', code: 'SN' }, { name: 'Serbia', code: 'RS' }, { name: 'Seychelles', code: 'SC' }, { name: 'Sierra Leone', code: 'SL' }, { name: 'Singapore', code: 'SG' }, { name: 'Slovakia', code: 'SK' }, { name: 'Slovenia', code: 'SI' }, { name: 'Solomon Islands', code: 'SB' }, { name: 'Somalia', code: 'SO' }, { name: 'South Africa', code: 'ZA' }, { name: 'South Georgia and the South Sandwich Islands', code: 'GS' }, { name: 'Spain', code: 'ES' }, { name: 'Sri Lanka', code: 'LK' }, { name: 'Sudan', code: 'SD' }, { name: 'Suriname', code: 'SR' }, { name: 'Svalbard and Jan Mayen', code: 'SJ' }, { name: 'Swaziland', code: 'SZ' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'Syrian Arab Republic', code: 'SY' }, { name: 'Taiwan, Province of China', code: 'TW' }, { name: 'Tajikistan', code: 'TJ' }, { name: 'Tanzania, United Republic of', code: 'TZ' }, { name: 'Thailand', code: 'TH' }, { name: 'Timor-Leste', code: 'TL' }, { name: 'Togo', code: 'TG' }, { name: 'Tokelau', code: 'TK' }, { name: 'Tonga', code: 'TO' }, { name: 'Trinidad and Tobago', code: 'TT' }, { name: 'Tunisia', code: 'TN' }, { name: 'Turkey', code: 'TR' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Turks and Caicos Islands', code: 'TC' }, { name: 'Tuvalu', code: 'TV' }, { name: 'Uganda', code: 'UG' }, { name: 'Ukraine', code: 'UA' }, { name: 'United Arab Emirates', code: 'AE' }, { name: 'United Kingdom', code: 'GB' }, { name: 'United States', code: 'US' }, { name: 'United States Minor Outlying Islands', code: 'UM' }, { name: 'Uruguay', code: 'UY' }, { name: 'Uzbekistan', code: 'UZ' }, { name: 'Vanuatu', code: 'VU' }, { name: 'Venezuela', code: 'VE' }, { name: 'Viet Nam', code: 'VN' }, { name: 'Virgin Islands, British', code: 'VG' }, { name: 'Virgin Islands, U.S.', code: 'VI' }, { name: 'Wallis and Futuna', code: 'WF' }, { name: 'Western Sahara', code: 'EH' }, { name: 'Yemen', code: 'YE' }, { name: 'Zambia', code: 'ZM' }, { name: 'Zimbabwe', code: 'ZW' }];

var APOCountries = exports.APOCountries = [{ name: 'United States', code: 'US' }];

var CACountries = exports.CACountries = [{ name: 'Canada', code: 'CA' }, { name: 'United States', code: 'US' }];

var EUCountries = exports.EUCountries = [{ name: 'Åland Islands', code: 'AX' }, { name: 'Andorra', code: 'AD' }, { name: 'Austria', code: 'AT' }, { name: 'Belgium', code: 'BE' }, { name: 'Bulgaria', code: 'BG' }, { name: 'Croatia', code: 'HR' }, { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' }, { name: 'Estonia', code: 'EE' }, { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'Germany', code: 'DE' }, { name: 'Gibraltar', code: 'GI' }, { name: 'Greece', code: 'GR' }, { name: 'Hungary', code: 'HU' }, { name: 'Iceland', code: 'IS' }, { name: 'Ireland', code: 'IE' }, { name: 'Italy', code: 'IT' }, { name: 'Latvia', code: 'LV' }, { name: 'Liechtenstein', code: 'LI' }, { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Malta', code: 'MT' }, { name: 'Monaco', code: 'MC' }, { name: 'Netherlands', code: 'NL' }, { name: 'Norway', code: 'NO' }, { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Romania', code: 'RO' }, { name: 'San Marino', code: 'SM' }, { name: 'Slovakia', code: 'SK' }, { name: 'Slovenia', code: 'SI' }, { name: 'Spain', code: 'ES' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'United Kingdom', code: 'GB' }];

var AUCountries = exports.AUCountries = [{ name: 'Australia', code: 'AU' }];

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable import/prefer-default-export */
exports.default = [{ name: '1', value: '01' }, { name: '2', value: '02' }, { name: '3', value: '03' }, { name: '4', value: '04' }, { name: '5', value: '05' }, { name: '6', value: '06' }, { name: '7', value: '07' }, { name: '8', value: '08' }, { name: '9', value: '09' }, { name: '10', value: '10' }, { name: '11', value: '11' }, { name: '12', value: '12' }, { name: '13', value: '13' }, { name: '14', value: '14' }, { name: '15', value: '15' }, { name: '16', value: '16' }, { name: '17', value: '17' }, { name: '18', value: '18' }, { name: '19', value: '19' }, { name: '20', value: '20' }, { name: '21', value: '21' }, { name: '22', value: '22' }, { name: '23', value: '23' }, { name: '24', value: '24' }, { name: '25', value: '25' }, { name: '26', value: '26' }, { name: '27', value: '27' }, { name: '28', value: '28' }, { name: '29', value: '29' }, { name: '30', value: '30' }, { name: '31', value: '31' }];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable import/prefer-default-export */
exports.default = [{ name: 'January', value: '01' }, { name: 'February', value: '02' }, { name: 'March', value: '03' }, { name: 'April', value: '04' }, { name: 'May', value: '05' }, { name: 'June', value: '06' }, { name: 'July', value: '07' }, { name: 'August', value: '08' }, { name: 'September', value: '09' }, { name: 'October', value: '10' }, { name: 'November', value: '11' }, { name: 'December', value: '12' }];

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable import/prefer-default-export */
var ATRegions = exports.ATRegions = [{ name: 'Burgenland', code: 'BL', id: 102 }, { name: 'Kärnten', code: 'KN', id: 99 }, { name: 'Niederösterreich', code: 'NO', id: 96 }, { name: 'Oberösterreich', code: 'OO', id: 97 }, { name: 'Salzburg', code: 'SB', id: 98 }, { name: 'Steiermark', code: 'ST', id: 100 }, { name: 'Tirol', code: 'TI', id: 101 }, { name: 'Voralberg', code: 'VB', id: 103 }, { name: 'Wien', code: 'WI', id: 95 }];

var AURegions = exports.AURegions = [{ name: 'Australia Capital Territory', code: 'ACT', id: 651 }, { name: 'New South Wales', code: 'NSW', id: 653 }, { name: 'Northern Territory', code: 'NT', id: 655 }, { name: 'Queensland', code: 'QLD', id: 657 }, { name: 'South Australia', code: 'SA', id: 659 }, { name: 'Tasmania', code: 'TAS', id: 661 }, { name: 'Victoria', code: 'VIC', id: 663 }, { name: 'Western Australia', code: 'WA', id: 665 }];

var CARegions = exports.CARegions = [{ name: 'Alberta', code: 'AB', id: 66 }, { name: 'British Columbia', code: 'BC', id: 67 }, { name: 'Manitoba', code: 'MB', id: 68 }, { name: 'New Brunswick', code: 'NB', id: 70 }, { name: 'Newfoundland and Labrador', code: 'NL', id: 69 }, { name: 'Northwest Territories', code: 'NT', id: 72 }, { name: 'Nova Scotia', code: 'NS', id: 71 }, { name: 'Nunavut', code: 'NU', id: 73 }, { name: 'Ontario', code: 'ON', id: 74 }, { name: 'Prince Edward Island', code: 'PE', id: 75 }, { name: 'Quebec', code: 'QC', id: 76 }, { name: 'Saskatchewan', code: 'SK', id: 77 }, { name: 'Yukon Territory', code: 'YT', id: 78 }];

var CHRegions = exports.CHRegions = [{ name: 'Aargau', code: 'AG', id: 104 }, { name: 'Appenzell Ausserrhoden', code: 'AR', id: 106 }, { name: 'Appenzell Innerrhoden', code: 'AI', id: 105 }, { name: 'Basel-Landschaft', code: 'BL', id: 108 }, { name: 'Basel-Stadt', code: 'BS', id: 109 }, { name: 'Bern', code: 'BE', id: 107 }, { name: 'Freiburg', code: 'FR', id: 110 }, { name: 'Genf', code: 'GE', id: 111 }, { name: 'Glarus', code: 'GL', id: 112 }, { name: 'Graubünden', code: 'GR', id: 113 }, { name: 'Jura', code: 'JU', id: 114 }, { name: 'Luzern', code: 'LU', id: 115 }, { name: 'Neuenburg', code: 'NE', id: 116 }, { name: 'Nidwalden', code: 'NW', id: 117 }, { name: 'Obwalden', code: 'OW', id: 118 }, { name: 'Schaffhausen', code: 'SH', id: 120 }, { name: 'Schwyz', code: 'SZ', id: 122 }, { name: 'Solothurn', code: 'SO', id: 121 }, { name: 'St. Gallen', code: 'SG', id: 119 }, { name: 'Tessin', code: 'TI', id: 124 }, { name: 'Thurgau', code: 'TG', id: 123 }, { name: 'Uri', code: 'UR', id: 125 }, { name: 'Waadt', code: 'VD', id: 126 }, { name: 'Wallis', code: 'VS', id: 127 }, { name: 'Zug', code: 'ZG', id: 128 }, { name: 'Zürich', code: 'ZH', id: 129 }];

var DERegions = exports.DERegions = [{ name: 'Baden-Württemberg', code: 'BAW', id: 80 }, { name: 'Bayern', code: 'BAY', id: 81 }, { name: 'Berlin', code: 'BER', id: 82 }, { name: 'Brandenburg', code: 'BRG', id: 83 }, { name: 'Bremen', code: 'BRE', id: 84 }, { name: 'Hamburg', code: 'HAM', id: 85 }, { name: 'Hessen', code: 'HES', id: 86 }, { name: 'Mecklenburg-Vorpommern', code: 'MEC', id: 87 }, { name: 'Niedersachsen', code: 'NDS', id: 79 }, { name: 'Nordrhein-Westfalen', code: 'NRW', id: 88 }, { name: 'Rheinland-Pfalz', code: 'RHE', id: 89 }, { name: 'Saarland', code: 'SAR', id: 90 }, { name: 'Sachsen', code: 'SAS', id: 91 }, { name: 'Sachsen-Anhalt', code: 'SAC', id: 92 }, { name: 'Schleswig-Holstein', code: 'SCN', id: 93 }, { name: 'Thüringen', code: 'THE', id: 94 }];

var EERegions = exports.EERegions = [{ name: 'Harjumaa', code: 'EE-37', id: 361 }, { name: 'Hiiumaa', code: 'EE-39', id: 363 }, { name: 'Ida-Virumaa', code: 'EE-44', id: 365 }, { name: 'Järvamaa', code: 'EE-51', id: 369 }, { name: 'Jõgevamaa', code: 'EE-49', id: 367 }, { name: 'Lääne-Virumaa', code: 'EE-59', id: 373 }, { name: 'Läänemaa', code: 'EE-57', id: 371 }, { name: 'Pärnumaa', code: 'EE-67', id: 377 }, { name: 'Põlvamaa', code: 'EE-65', id: 375 }, { name: 'Raplamaa', code: 'EE-70', id: 379 }, { name: 'Saaremaa', code: 'EE-74', id: 381 }, { name: 'Tartumaa', code: 'EE-78', id: 383 }, { name: 'Valgamaa', code: 'EE-82', id: 385 }, { name: 'Viljandimaa', code: 'EE-84', id: 387 }, { name: 'Võrumaa', code: 'EE-86', id: 389 }];

var ESRegions = exports.ESRegions = [{ name: 'A Coruña', code: 'A Coruсa', id: 130 }, { name: 'Alava', code: 'Alava', id: 131 }, { name: 'Albacete', code: 'Albacete', id: 132 }, { name: 'Alicante', code: 'Alicante', id: 133 }, { name: 'Almeria', code: 'Almeria', id: 134 }, { name: 'Asturias', code: 'Asturias', id: 135 }, { name: 'Avila', code: 'Avila', id: 136 }, { name: 'Badajoz', code: 'Badajoz', id: 137 }, { name: 'Baleares', code: 'Baleares', id: 138 }, { name: 'Barcelona', code: 'Barcelona', id: 139 }, { name: 'Burgos', code: 'Burgos', id: 140 }, { name: 'Caceres', code: 'Caceres', id: 141 }, { name: 'Cadiz', code: 'Cadiz', id: 142 }, { name: 'Cantabria', code: 'Cantabria', id: 143 }, { name: 'Castellon', code: 'Castellon', id: 144 }, { name: 'Ceuta', code: 'Ceuta', id: 145 }, { name: 'Ciudad Real', code: 'Ciudad Real', id: 146 }, { name: 'Cordoba', code: 'Cordoba', id: 147 }, { name: 'Cuenca', code: 'Cuenca', id: 148 }, { name: 'Girona', code: 'Girona', id: 149 }, { name: 'Granada', code: 'Granada', id: 150 }, { name: 'Guadalajara', code: 'Guadalajara', id: 151 }, { name: 'Guipuzcoa', code: 'Guipuzcoa', id: 152 }, { name: 'Huelva', code: 'Huelva', id: 153 }, { name: 'Huesca', code: 'Huesca', id: 154 }, { name: 'Jaen', code: 'Jaen', id: 155 }, { name: 'La Rioja', code: 'La Rioja', id: 156 }, { name: 'Las Palmas', code: 'Las Palmas', id: 157 }, { name: 'Leon', code: 'Leon', id: 158 }, { name: 'Lleida', code: 'Lleida', id: 159 }, { name: 'Lugo', code: 'Lugo', id: 160 }, { name: 'Madrid', code: 'Madrid', id: 161 }, { name: 'Malaga', code: 'Malaga', id: 162 }, { name: 'Melilla', code: 'Melilla', id: 163 }, { name: 'Murcia', code: 'Murcia', id: 164 }, { name: 'Navarra', code: 'Navarra', id: 165 }, { name: 'Ourense', code: 'Ourense', id: 166 }, { name: 'Palencia', code: 'Palencia', id: 167 }, { name: 'Pontevedra', code: 'Pontevedra', id: 168 }, { name: 'Salamanca', code: 'Salamanca', id: 169 }, { name: 'Santa Cruz de Tenerife', code: 'Santa Cruz de Tenerife', id: 170 }, { name: 'Segovia', code: 'Segovia', id: 171 }, { name: 'Sevilla', code: 'Sevilla', id: 172 }, { name: 'Soria', code: 'Soria', id: 173 }, { name: 'Tarragona', code: 'Tarragona', id: 174 }, { name: 'Teruel', code: 'Teruel', id: 175 }, { name: 'Toledo', code: 'Toledo', id: 176 }, { name: 'Valencia', code: 'Valencia', id: 177 }, { name: 'Valladolid', code: 'Valladolid', id: 178 }, { name: 'Vizcaya', code: 'Vizcaya', id: 179 }, { name: 'Zamora', code: 'Zamora', id: 180 }, { name: 'Zaragoza', code: 'Zaragoza', id: 181 }];

var FIRegions = exports.FIRegions = [{ name: 'Ahvenanmaa', code: 'Ahvenanmaa', id: 359 }, { name: 'Etelä-Karjala', code: 'Etelä-Karjala', id: 347 }, { name: 'Etelä-Pohjanmaa', code: 'Etelä-Pohjanmaa', id: 333 }, { name: 'Etelä-Savo', code: 'Etelä-Savo', id: 331 }, { name: 'Itä-Uusimaa', code: 'Itä-Uusimaa', id: 355 }, { name: 'Kainuu', code: 'Kainuu', id: 325 }, { name: 'Kanta-Häme', code: 'Kanta-Häme', id: 351 }, { name: 'Keski-Pohjanmaa', code: 'Keski-Pohjanmaa', id: 341 }, { name: 'Keski-Suomi', code: 'Keski-Suomi', id: 343 }, { name: 'Kymenlaakso', code: 'Kymenlaakso', id: 357 }, { name: 'Lappi', code: 'Lappi', id: 321 }, { name: 'Päijät-Häme', code: 'Päijät-Häme', id: 349 }, { name: 'Pirkanmaa', code: 'Pirkanmaa', id: 337 }, { name: 'Pohjanmaa', code: 'Pohjanmaa', id: 335 }, { name: 'Pohjois-Karjala', code: 'Pohjois-Karjala', id: 327 }, { name: 'Pohjois-Pohjanmaa', code: 'Pohjois-Pohjanmaa', id: 323 }, { name: 'Pohjois-Savo', code: 'Pohjois-Savo', id: 329 }, { name: 'Satakunta', code: 'Satakunta', id: 339 }, { name: 'Uusimaa', code: 'Uusimaa', id: 353 }, { name: 'Varsinais-Suomi', code: 'Varsinais-Suomi', id: 345 }];

var FRRegions = exports.FRRegions = [{ name: 'Ain', code: 'Ain', id: 182 }, { name: 'Aisne', code: 'Aisne', id: 183 }, { name: 'Allier', code: 'Allier', id: 184 }, { name: 'Alpes-de-Haute-Provence', code: 'Alpes-de-Haute-Provence', id: 185 }, { name: 'Alpes-Maritimes', code: 'Alpes-Maritimes', id: 187 }, { name: 'Ardèche', code: 'Ardèche', id: 188 }, { name: 'Ardennes', code: 'Ardennes', id: 189 }, { name: 'Ariège', code: 'Ariège', id: 190 }, { name: 'Aube', code: 'Aube', id: 191 }, { name: 'Aude', code: 'Aude', id: 192 }, { name: 'Aveyron', code: 'Aveyron', id: 193 }, { name: 'Bas-Rhin', code: 'Bas-Rhin', id: 249 }, { name: 'Bouches-du-Rhône', code: 'Bouches-du-Rhône', id: 194 }, { name: 'Calvados', code: 'Calvados', id: 195 }, { name: 'Cantal', code: 'Cantal', id: 196 }, { name: 'Charente', code: 'Charente', id: 197 }, { name: 'Charente-Maritime', code: 'Charente-Maritime', id: 198 }, { name: 'Cher', code: 'Cher', id: 199 }, { name: 'Corrèze', code: 'Corrèze', id: 200 }, { name: 'Corse-du-Sud', code: 'Corse-du-Sud', id: 201 }, { name: 'Côte-d\'Or', code: 'Côte-d\'Or', id: 203 }, { name: 'Côtes-d\'Armor', code: 'Côtes-d\'Armor', id: 204 }, { name: 'Creuse', code: 'Creuse', id: 205 }, { name: 'Deux-Sèvres', code: 'Deux-Sèvres', id: 261 }, { name: 'Dordogne', code: 'Dordogne', id: 206 }, { name: 'Doubs', code: 'Doubs', id: 207 }, { name: 'Drôme', code: 'Drôme', id: 208 }, { name: 'Essonne', code: 'Essonne', id: 273 }, { name: 'Eure', code: 'Eure', id: 209 }, { name: 'Eure-et-Loir', code: 'Eure-et-Loir', id: 210 }, { name: 'Finistère', code: 'Finistère', id: 211 }, { name: 'Gard', code: 'Gard', id: 212 }, { name: 'Gers', code: 'Gers', id: 214 }, { name: 'Gironde', code: 'Gironde', id: 215 }, { name: 'Haut-Rhin', code: 'Haut-Rhin', id: 250 }, { name: 'Haute-Corse', code: 'Haute-Corse', id: 202 }, { name: 'Haute-Garonne', code: 'Haute-Garonne', id: 213 }, { name: 'Haute-Loire', code: 'Haute-Loire', id: 225 }, { name: 'Haute-Marne', code: 'Haute-Marne', id: 234 }, { name: 'Haute-Saône', code: 'Haute-Saône', id: 252 }, { name: 'Haute-Savoie', code: 'Haute-Savoie', id: 256 }, { name: 'Haute-Vienne', code: 'Haute-Vienne', id: 269 }, { name: 'Hautes-Alpes', code: 'Hautes-Alpes', id: 186 }, { name: 'Hautes-Pyrénées', code: 'Hautes-Pyrénées', id: 247 }, { name: 'Hauts-de-Seine', code: 'Hauts-de-Seine', id: 274 }, { name: 'Hérault', code: 'Hérault', id: 216 }, { name: 'Ille-et-Vilaine', code: 'Ille-et-Vilaine', id: 217 }, { name: 'Indre', code: 'Indre', id: 218 }, { name: 'Indre-et-Loire', code: 'Indre-et-Loire', id: 219 }, { name: 'Isère', code: 'Isère', id: 220 }, { name: 'Jura', code: 'Jura', id: 221 }, { name: 'Landes', code: 'Landes', id: 222 }, { name: 'Loir-et-Cher', code: 'Loir-et-Cher', id: 223 }, { name: 'Loire', code: 'Loire', id: 224 }, { name: 'Loire-Atlantique', code: 'Loire-Atlantique', id: 226 }, { name: 'Loiret', code: 'Loiret', id: 227 }, { name: 'Lot', code: 'Lot', id: 228 }, { name: 'Lot-et-Garonne', code: 'Lot-et-Garonne', id: 229 }, { name: 'Lozère', code: 'Lozère', id: 230 }, { name: 'Maine-et-Loire', code: 'Maine-et-Loire', id: 231 }, { name: 'Manche', code: 'Manche', id: 232 }, { name: 'Marne', code: 'Marne', id: 233 }, { name: 'Mayenne', code: 'Mayenne', id: 235 }, { name: 'Meurthe-et-Moselle', code: 'Meurthe-et-Moselle', id: 236 }, { name: 'Meuse', code: 'Meuse', id: 237 }, { name: 'Morbihan', code: 'Morbihan', id: 238 }, { name: 'Moselle', code: 'Moselle', id: 239 }, { name: 'Nièvre', code: 'Nièvre', id: 240 }, { name: 'Nord', code: 'Nord', id: 241 }, { name: 'Oise', code: 'Oise', id: 242 }, { name: 'Orne', code: 'Orne', id: 243 }, { name: 'Paris', code: 'Paris', id: 257 }, { name: 'Pas-de-Calais', code: 'Pas-de-Calais', id: 244 }, { name: 'Puy-de-Dôme', code: 'Puy-de-Dôme', id: 245 }, { name: 'Pyrénées-Atlantiques', code: 'Pyrénées-Atlantiques', id: 246 }, { name: 'Pyrénées-Orientales', code: 'Pyrénées-Orientales', id: 248 }, { name: 'Rhône', code: 'Rhône', id: 251 }, { name: 'Saône-et-Loire', code: 'Saône-et-Loire', id: 253 }, { name: 'Sarthe', code: 'Sarthe', id: 254 }, { name: 'Savoie', code: 'Savoie', id: 255 }, { name: 'Seine-et-Marne', code: 'Seine-et-Marne', id: 259 }, { name: 'Seine-Maritime', code: 'Seine-Maritime', id: 258 }, { name: 'Seine-Saint-Denis', code: 'Seine-Saint-Denis', id: 275 }, { name: 'Somme', code: 'Somme', id: 262 }, { name: 'Tarn', code: 'Tarn', id: 263 }, { name: 'Tarn-et-Garonne', code: 'Tarn-et-Garonne', id: 264 }, { name: 'Territoire-de-Belfort', code: 'Territoire-de-Belfort', id: 272 }, { name: 'Val-d\'Oise', code: 'Val-d\'Oise', id: 277 }, { name: 'Val-de-Marne', code: 'Val-de-Marne', id: 276 }, { name: 'Var', code: 'Var', id: 265 }, { name: 'Vaucluse', code: 'Vaucluse', id: 266 }, { name: 'Vendée', code: 'Vendée', id: 267 }, { name: 'Vienne', code: 'Vienne', id: 268 }, { name: 'Vosges', code: 'Vosges', id: 270 }, { name: 'Yonne', code: 'Yonne', id: 271 }, { name: 'Yvelines', code: 'Yvelines', id: 260 }];

var LTRegions = exports.LTRegions = [{ name: 'Alytaus Apskritis', code: 'LT-AL', id: 631 }, { name: 'Kauno Apskritis', code: 'LT-KU', id: 633 }, { name: 'Klaipėdos Apskritis', code: 'LT-KL', id: 635 }, { name: 'Marijampolės Apskritis', code: 'LT-MR', id: 637 }, { name: 'Panevėžio Apskritis', code: 'LT-PN', id: 639 }, { name: 'Šiaulių Apskritis', code: 'LT-SA', id: 641 }, { name: 'Tauragės Apskritis', code: 'LT-TA', id: 643 }, { name: 'Telšių Apskritis', code: 'LT-TE', id: 645 }, { name: 'Utenos Apskritis', code: 'LT-UT', id: 647 }, { name: 'Vilniaus Apskritis', code: 'LT-VL', id: 649 }];

var LVRegions = exports.LVRegions = [{ name: 'Ādažu novads', code: 'Ādažu novads', id: 623 }, { name: 'Aglonas novads', code: 'Aglonas novads', id: 413 }, { name: 'Aizkraukles novads', code: 'LV-AI', id: 415 }, { name: 'Aizputes novads', code: 'Aizputes novads', id: 417 }, { name: 'Aknīstes novads', code: 'Aknīstes novads', id: 419 }, { name: 'Alojas novads', code: 'Alojas novads', id: 421 }, { name: 'Alsungas novads', code: 'Alsungas novads', id: 423 }, { name: 'Alūksnes novads', code: 'LV-AL', id: 425 }, { name: 'Amatas novads', code: 'Amatas novads', id: 427 }, { name: 'Apes novads', code: 'Apes novads', id: 429 }, { name: 'Auces novads', code: 'Auces novads', id: 431 }, { name: 'Babītes novads', code: 'Babītes novads', id: 433 }, { name: 'Baldones novads', code: 'Baldones novads', id: 435 }, { name: 'Baltinavas novads', code: 'Baltinavas novads', id: 437 }, { name: 'Balvu novads', code: 'LV-BL', id: 439 }, { name: 'Bauskas novads', code: 'LV-BU', id: 441 }, { name: 'Beverīnas novads', code: 'Beverīnas novads', id: 443 }, { name: 'Brocēnu novads', code: 'Brocēnu novads', id: 445 }, { name: 'Burtnieku novads', code: 'Burtnieku novads', id: 447 }, { name: 'Carnikavas novads', code: 'Carnikavas novads', id: 449 }, { name: 'Cēsu novads', code: 'LV-CE', id: 455 }, { name: 'Cesvaines novads', code: 'Cesvaines novads', id: 451 }, { name: 'Ciblas novads', code: 'Ciblas novads', id: 453 }, { name: 'Dagdas novads', code: 'Dagdas novads', id: 457 }, { name: 'Daugavpils', code: 'LV-DGV', id: 391 }, { name: 'Daugavpils novads', code: 'LV-DA', id: 459 }, { name: 'Dobeles novads', code: 'LV-DO', id: 461 }, { name: 'Dundagas novads', code: 'Dundagas novads', id: 463 }, { name: 'Durbes novads', code: 'Durbes novads', id: 465 }, { name: 'Engures novads', code: 'Engures novads', id: 467 }, { name: 'Ērgļu novads', code: 'Ērgļu novads', id: 625 }, { name: 'Garkalnes novads', code: 'Garkalnes novads', id: 469 }, { name: 'Grobiņas novads', code: 'Grobiņas novads', id: 471 }, { name: 'Gulbenes novads', code: 'LV-GU', id: 473 }, { name: 'Iecavas novads', code: 'Iecavas novads', id: 475 }, { name: 'Ikšķiles novads', code: 'Ikšķiles novads', id: 477 }, { name: 'Ilūkstes novads', code: 'Ilūkstes novads', id: 479 }, { name: 'Inčukalna novads', code: 'Inčukalna novads', id: 481 }, { name: 'Jaunjelgavas novads', code: 'Jaunjelgavas novads', id: 483 }, { name: 'Jaunpiebalgas novads', code: 'Jaunpiebalgas novads', id: 485 }, { name: 'Jaunpils novads', code: 'Jaunpils novads', id: 487 }, { name: 'Jēkabpils', code: 'Jēkabpils', id: 395 }, { name: 'Jēkabpils novads', code: 'LV-JK', id: 491 }, { name: 'Jelgava', code: 'LV-JEL', id: 393 }, { name: 'Jelgavas novads', code: 'LV-JL', id: 489 }, { name: 'Jūrmala', code: 'LV-JUR', id: 397 }, { name: 'Kandavas novads', code: 'Kandavas novads', id: 493 }, { name: 'Kārsavas novads', code: 'Kārsavas novads', id: 505 }, { name: 'Ķeguma novads', code: 'Ķeguma novads', id: 627 }, { name: 'Ķekavas novads', code: 'Ķekavas novads', id: 629 }, { name: 'Kokneses novads', code: 'Kokneses novads', id: 495 }, { name: 'Krāslavas novads', code: 'LV-KR', id: 501 }, { name: 'Krimuldas novads', code: 'Krimuldas novads', id: 497 }, { name: 'Krustpils novads', code: 'Krustpils novads', id: 499 }, { name: 'Kuldīgas novads', code: 'LV-KU', id: 503 }, { name: 'Lielvārdes novads', code: 'Lielvārdes novads', id: 507 }, { name: 'Liepāja', code: 'LV-LPX', id: 399 }, { name: 'Liepājas novads', code: 'LV-LE', id: 401 }, { name: 'Līgatnes novads', code: 'Līgatnes novads', id: 515 }, { name: 'Limbažu novads', code: 'LV-LM', id: 509 }, { name: 'Līvānu novads', code: 'Līvānu novads', id: 517 }, { name: 'Lubānas novads', code: 'Lubānas novads', id: 511 }, { name: 'Ludzas novads', code: 'LV-LU', id: 513 }, { name: 'Madonas novads', code: 'LV-MA', id: 519 }, { name: 'Mālpils novads', code: 'Mālpils novads', id: 523 }, { name: 'Mārupes novads', code: 'Mārupes novads', id: 525 }, { name: 'Mazsalacas novads', code: 'Mazsalacas novads', id: 521 }, { name: 'Naukšēnu novads', code: 'Naukšēnu novads', id: 527 }, { name: 'Neretas novads', code: 'Neretas novads', id: 529 }, { name: 'Nīcas novads', code: 'Nīcas novads', id: 531 }, { name: 'Ogres novads', code: 'LV-OG', id: 533 }, { name: 'Olaines novads', code: 'Olaines novads', id: 535 }, { name: 'Ozolnieku novads', code: 'Ozolnieku novads', id: 537 }, { name: 'Pārgaujas novads', code: 'Pārgaujas novads', id: 545 }, { name: 'Pāvilostas novads', code: 'Pāvilostas novads', id: 547 }, { name: 'Pļaviņu novads', code: 'Pļaviņu novads', id: 549 }, { name: 'Preiļu novads', code: 'LV-PR', id: 539 }, { name: 'Priekules novads', code: 'Priekules novads', id: 541 }, { name: 'Priekuļu novads', code: 'Priekuļu novads', id: 543 }, { name: 'Raunas novads', code: 'Raunas novads', id: 551 }, { name: 'Rēzekne', code: 'LV-REZ', id: 403 }, { name: 'Rēzeknes novads', code: 'LV-RE', id: 565 }, { name: 'Riebiņu novads', code: 'Riebiņu novads', id: 553 }, { name: 'Rīga', code: 'LV-RIX', id: 405 }, { name: 'Rīgas novads', code: 'LV-RI', id: 407 }, { name: 'Rojas novads', code: 'Rojas novads', id: 555 }, { name: 'Ropažu novads', code: 'Ropažu novads', id: 557 }, { name: 'Rucavas novads', code: 'Rucavas novads', id: 559 }, { name: 'Rugāju novads', code: 'Rugāju novads', id: 561 }, { name: 'Rūjienas novads', code: 'Rūjienas novads', id: 567 }, { name: 'Rundāles novads', code: 'Rundāles novads', id: 563 }, { name: 'Salacgrīvas novads', code: 'Salacgrīvas novads', id: 569 }, { name: 'Salas novads', code: 'Salas novads', id: 571 }, { name: 'Salaspils novads', code: 'Salaspils novads', id: 573 }, { name: 'Saldus novads', code: 'LV-SA', id: 575 }, { name: 'Saulkrastu novads', code: 'Saulkrastu novads', id: 577 }, { name: 'Sējas novads', code: 'Sējas novads', id: 591 }, { name: 'Siguldas novads', code: 'Siguldas novads', id: 579 }, { name: 'Skrīveru novads', code: 'Skrīveru novads', id: 583 }, { name: 'Skrundas novads', code: 'Skrundas novads', id: 581 }, { name: 'Smiltenes novads', code: 'Smiltenes novads', id: 585 }, { name: 'Stopiņu novads', code: 'Stopiņu novads', id: 587 }, { name: 'Strenču novads', code: 'Strenču novads', id: 589 }, { name: 'Talsu novads', code: 'LV-TA', id: 593 }, { name: 'Tērvetes novads', code: 'Tērvetes novads', id: 597 }, { name: 'Tukuma novads', code: 'LV-TU', id: 595 }, { name: 'Vaiņodes novads', code: 'Vaiņodes novads', id: 599 }, { name: 'Valkas novads', code: 'LV-VK', id: 601 }, { name: 'Valmiera', code: 'Valmiera', id: 409 }, { name: 'Valmieras novads', code: 'LV-VM', id: 603 }, { name: 'Varakļānu novads', code: 'Varakļānu novads', id: 605 }, { name: 'Vārkavas novads', code: 'Vārkavas novads', id: 619 }, { name: 'Vecpiebalgas novads', code: 'Vecpiebalgas novads', id: 607 }, { name: 'Vecumnieku novads', code: 'Vecumnieku novads', id: 609 }, { name: 'Ventspils', code: 'LV-VEN', id: 411 }, { name: 'Ventspils novads', code: 'LV-VE', id: 611 }, { name: 'Viesītes novads', code: 'Viesītes novads', id: 613 }, { name: 'Viļakas novads', code: 'Viļakas novads', id: 615 }, { name: 'Viļānu novads', code: 'Viļānu novads', id: 617 }, { name: 'Zilupes novads', code: 'Zilupes novads', id: 621 }];

var NZRegions = exports.NZRegions = [{ name: 'Auckland', code: 'Auckland', id: 667 }, { name: 'Bay of Plenty', code: 'Bay of Plenty', id: 669 }, { name: 'Canterbury', code: 'Canterbury', id: 671 }, { name: 'Chatham Islands Territory', code: 'Chatham Islands Territory', id: 673 }, { name: 'Gisborne', code: 'Gisborne', id: 675 }, { name: 'Hawke\'s Bay', code: 'Hawke\'s Bay', id: 677 }, { name: 'Marlborough', code: 'Marlborough', id: 679 }, { name: 'Manawatu', code: 'Manawatu', id: 681 }, { name: 'Nelson', code: 'Nelson', id: 683 }, { name: 'Northland', code: 'Northland', id: 685 }, { name: 'Otago', code: 'Otago', id: 687 }, { name: 'South Canterbury', code: 'South Canterbury', id: 689 }, { name: 'Southland', code: 'Southland', id: 691 }, { name: 'Tasman', code: 'Tasman', id: 693 }, { name: 'Taranaki', code: 'Taranaki', id: 695 }, { name: 'Wellington', code: 'Wellington', id: 697 }, { name: 'Waikato', code: 'Waikato', id: 699 }, { name: 'West Coast', code: 'West Coast', id: 701 }];

var RORegions = exports.RORegions = [{ name: 'Alba', code: 'AB', id: 278 }, { name: 'Arad', code: 'AR', id: 279 }, { name: 'Argeş', code: 'AG', id: 280 }, { name: 'Bacău', code: 'BC', id: 281 }, { name: 'Bihor', code: 'BH', id: 282 }, { name: 'Bistriţa-Năsăud', code: 'BN', id: 283 }, { name: 'Botoşani', code: 'BT', id: 284 }, { name: 'Brăila', code: 'BR', id: 286 }, { name: 'Bucureşti', code: 'B', id: 287 }, { name: 'Brașov', code: 'BV', id: 285 }, { name: 'Buzău', code: 'BZ', id: 288 }, { name: 'Călăraşi', code: 'CL', id: 290 }, { name: 'Caraş-Severin', code: 'CS', id: 289 }, { name: 'Cluj', code: 'CJ', id: 291 }, { name: 'Constanţa', code: 'CT', id: 292 }, { name: 'Covasna', code: 'CV', id: 293 }, { name: 'Dâmboviţa', code: 'DB', id: 294 }, { name: 'Dolj', code: 'DJ', id: 295 }, { name: 'Galaţi', code: 'GL', id: 296 }, { name: 'Giurgiu', code: 'GR', id: 297 }, { name: 'Gorj', code: 'GJ', id: 298 }, { name: 'Harghita', code: 'HR', id: 299 }, { name: 'Hunedoara', code: 'HD', id: 300 }, { name: 'Ialomiţa', code: 'IL', id: 301 }, { name: 'Iaşi', code: 'IS', id: 302 }, { name: 'Ilfov', code: 'IF', id: 303 }, { name: 'Maramureş', code: 'MM', id: 304 }, { name: 'Mehedinţi', code: 'MH', id: 305 }, { name: 'Mureş', code: 'MS', id: 306 }, { name: 'Neamţ', code: 'NT', id: 307 }, { name: 'Olt', code: 'OT', id: 308 }, { name: 'Prahova', code: 'PH', id: 309 }, { name: 'Sălaj', code: 'SJ', id: 311 }, { name: 'Satu-Mare', code: 'SM', id: 310 }, { name: 'Sibiu', code: 'SB', id: 312 }, { name: 'Suceava', code: 'SV', id: 313 }, { name: 'Teleorman', code: 'TR', id: 314 }, { name: 'Timiş', code: 'TM', id: 315 }, { name: 'Tulcea', code: 'TL', id: 316 }, { name: 'Vâlcea', code: 'VL', id: 318 }, { name: 'Vaslui', code: 'VS', id: 317 }, { name: 'Vrancea', code: 'VN', id: 319 }];

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable import/prefer-default-export */

var states = exports.states = [{ name: 'Alabama', code: 'AL', id: 1 }, { name: 'Alaska', code: 'AK', id: 2 }, { name: 'Arizona', code: 'AZ', id: 4 }, { name: 'Arkansas', code: 'AR', id: 5 }, { name: 'California', code: 'CA', id: 12 }, { name: 'Colorado', code: 'CO', id: 13 }, { name: 'Connecticut', code: 'CT', id: 14 }, { name: 'Delaware', code: 'DE', id: 15 }, { name: 'District of Columbia', code: 'DC', id: 16 }, { name: 'Florida', code: 'FL', id: 18 }, { name: 'Georgia', code: 'GA', id: 19 }, { name: 'Hawaii', code: 'HI', id: 21 }, { name: 'Idaho', code: 'ID', id: 22 }, { name: 'Illinois', code: 'IL', id: 23 }, { name: 'Indiana', code: 'IN', id: 24 }, { name: 'Iowa', code: 'IA', id: 25 }, { name: 'Kansas', code: 'KS', id: 26 }, { name: 'Kentucky', code: 'KY', id: 27 }, { name: 'Lousiana', code: 'LA', id: 28 }, { name: 'Maine', code: 'ME', id: 29 }, { name: 'Maryland', code: 'MD', id: 31 }, { name: 'Massachusetts', code: 'MA', id: 32 }, { name: 'Michigan', code: 'MI', id: 33 }, { name: 'Minnesota', code: 'MN', id: 34 }, { name: 'Mississippi', code: 'MS', id: 35 }, { name: 'Missouri', code: 'MO', id: 36 }, { name: 'Montana', code: 'MT', id: 37 }, { name: 'Nebraska', code: 'NE', id: 38 }, { name: 'Nevada', code: 'NV', id: 39 }, { name: 'New Hampshire', code: 'NH', id: 40 }, { name: 'New Jersey', code: 'NJ', id: 41 }, { name: 'New Mexico', code: 'NM', id: 42 }, { name: 'New York', code: 'NY', id: 43 }, { name: 'North Carolina', code: 'NC', id: 44 }, { name: 'North Dakota', code: 'ND', id: 45 }, { name: 'Ohio', code: 'OH', id: 47 }, { name: 'Oklahoma', code: 'OK', id: 48 }, { name: 'Oregon', code: 'OR', id: 49 }, { name: 'Pennsylvania', code: 'PA', id: 51 }, { name: 'Rhode Island', code: 'RI', id: 53 }, { name: 'South Carolina', code: 'SC', id: 54 }, { name: 'South Dakota', code: 'SD', id: 55 }, { name: 'Tennessee', code: 'TN', id: 56 }, { name: 'Texas', code: 'TX', id: 57 }, { name: 'Utah', code: 'UT', id: 58 }, { name: 'Vermont', code: 'VT', id: 59 }, { name: 'Virginia', code: 'VA', id: 61 }, { name: 'Washington', code: 'WA', id: 62 }, { name: 'West Virginia', code: 'WV', id: 63 }, { name: 'Wisconsin', code: 'WI', id: 64 }, { name: 'Wyoming', code: 'WY', id: 65 }];

var apoStates = exports.apoStates = [{ name: 'Alabama', code: 'AL', id: 1 }, { name: 'Alaska', code: 'AK', id: 2 }, { name: 'American Samoa', code: 'AS', id: 3 }, { name: 'Arizona', code: 'AZ', id: 4 }, { name: 'Arkansas', code: 'AR', id: 5 }, { name: 'Armed Forces Africa (AE)', code: 'AE', id: 6 }, { name: 'Armed Forces Americas (AA)', code: 'AA', id: 7 }, { name: 'Armed Forces Canada (AE)', code: 'AE', id: 8 }, { name: 'Armed Forces Europe (AE)', code: 'AE', id: 9 }, { name: 'Armed Forces Middle East (AE)', code: 'AE', id: 10 }, { name: 'Armed Forces Pacific (AP)', code: 'AP', id: 11 }, { name: 'California', code: 'CA', id: 12 }, { name: 'Colorado', code: 'CO', id: 13 }, { name: 'Connecticut', code: 'CT', id: 14 }, { name: 'Delaware', code: 'DE', id: 15 }, { name: 'District of Columbia', code: 'DC', id: 16 }, { name: 'Florida', code: 'FL', id: 18 }, { name: 'Georgia', code: 'GA', id: 19 }, { name: 'Guam', code: 'GU', id: 20 }, { name: 'Hawaii', code: 'HI', id: 21 }, { name: 'Idaho', code: 'ID', id: 22 }, { name: 'Illinois', code: 'IL', id: 23 }, { name: 'Indiana', code: 'IN', id: 24 }, { name: 'Iowa', code: 'IA', id: 25 }, { name: 'Kansas', code: 'KS', id: 26 }, { name: 'Kentucky', code: 'KY', id: 27 }, { name: 'Louisiana', code: 'LA', id: 28 }, { name: 'Maine', code: 'ME', id: 29 }, { name: 'Maryland', code: 'MD', id: 31 }, { name: 'Massachusetts', code: 'MA', id: 32 }, { name: 'Michigan', code: 'MI', id: 33 }, { name: 'Minnesota', code: 'MN', id: 34 }, { name: 'Mississippi', code: 'MS', id: 35 }, { name: 'Missouri', code: 'MO', id: 36 }, { name: 'Montana', code: 'MT', id: 37 }, { name: 'Nebraska', code: 'NE', id: 38 }, { name: 'Nevada', code: 'NV', id: 39 }, { name: 'New Hampshire', code: 'NH', id: 40 }, { name: 'New Jersey', code: 'NJ', id: 41 }, { name: 'New Mexico', code: 'NM', id: 42 }, { name: 'New York', code: 'NY', id: 43 }, { name: 'North Carolina', code: 'NC', id: 44 }, { name: 'North Dakota', code: 'ND', id: 45 }, { name: 'Ohio', code: 'OH', id: 47 }, { name: 'Oklahoma', code: 'OK', id: 48 }, { name: 'Oregon', code: 'OR', id: 49 }, { name: 'Pennsylvania', code: 'PA', id: 51 }, { name: 'Rhode Island', code: 'RI', id: 53 }, { name: 'South Carolina', code: 'SC', id: 54 }, { name: 'South Dakota', code: 'SD', id: 55 }, { name: 'Tennessee', code: 'TN', id: 56 }, { name: 'Texas', code: 'TX', id: 57 }, { name: 'Utah', code: 'UT', id: 58 }, { name: 'Vermont', code: 'VT', id: 59 }, { name: 'Virginia', code: 'VA', id: 61 }, { name: 'Washington', code: 'WA', id: 62 }, { name: 'West Virginia', code: 'WV', id: 63 }, { name: 'Wisconsin', code: 'WI', id: 64 }, { name: 'Wyoming', code: 'WY', id: 65 }];

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (fn, threshold, executeImmediately) {
  var timeout = void 0;

  return function debounced() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    function delayed() {
      if (!executeImmediately) fn.apply(this, args);
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (executeImmediately) {
      fn.apply(this, args);
    }

    timeout = setTimeout(delayed, threshold || 100);
  }.bind(this);
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = disableFirebaseHeaderMethods;
function disableFirebaseHeaderMethods() {
  if (window.disableFirebaseHeaderMethods) {
    return true;
  }

  return false;
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getCountryOptions;

var _data = __webpack_require__(2);

/**
 * Produce country options based on globalstore
 * @return {array}
 */
function getCountryOptions() {
  var countryOptions = _data.USCountries;
  if (window.globalStore.magento.store.id === '2') {
    countryOptions = _data.CACountries;
  } else if (window.globalStore.magento.store.id === '4') {
    countryOptions = _data.APOCountries;
  } else if (window.globalStore.magento.store.id === '5') {
    countryOptions = _data.EUCountries;
  } else if (window.globalStore.magento.store.id === '18') {
    countryOptions = _data.AUCountries;
  }

  return countryOptions;
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDefaultCountryId;
/**
 * Produce default country id based on globalstore
 * @return {string}
 */
function getDefaultCountryId() {
  switch (window.globalStore.magento.store.id) {
    case '1':
      return 'US';
    case '2':
      return 'CA';
    case '4':
      return 'US';
    case '5':
      return 'BE';
    case '18':
      return 'AU';
    default:
      return '';
  }
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (el, selector) {
  if (!(el instanceof Element)) {
    return null;
  } else if (!selector) {
    return el.parentElement;
  }

  var selectorElements = document.querySelectorAll(selector);
  do {
    el = el.parentElement;
  } while (!selectorElementMatch(selectorElements, el) && el);

  return el;
};

/**
 * Check if we've found the parent element given by the selector
 * @param  {NodeList} selectorElements
 * @param  {Element} el Element
 * @return {Boolean}
 */
function selectorElementMatch(selectorElements, el) {
  var l = selectorElements.length;
  for (var i = 0; i < l; i += 1) {
    if (selectorElements[i] === el) {
      return true;
    }
  }

  return false;
}

/**
 * Find the parent element, optionally by selector, of the given element
 * @param  {Element} el
 * @param  {String} selector css selector
 * @return {Element|null}
 */

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = getQueryString;
/**
 * Stringify Object to the query string and return it as String
 * @param  {Object} params
 * @return {String}
 */

function getQueryString(params, prefix) {
  var esc = encodeURIComponent;

  return Object.keys(params).map(function (k) {
    var key = prefix ? prefix.concat('[', k, ']') : k;
    var value = params[k];

    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? getQueryString(value, key) : esc(key).concat('=', esc(value));
  }).join('&');
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRegionOptions;

var _data = __webpack_require__(2);

/**
 * Produce region options based on globalstore and provided countryId
 *
 * @param {string} countryId
 * @return {array}
 */
function getRegionOptions(countryId) {
  var regionOptions = null;
  if (window.globalStore.magento.store.id === '4' && countryId === 'US' && Object.hasOwnProperty.call(_data.regions, 'APO')) {
    regionOptions = _data.regions.APO;
  } else if (Object.hasOwnProperty.call(_data.regions, countryId)) {
    regionOptions = _data.regions[countryId];
  }

  return regionOptions;
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getUrl;
/**
 * remove trailing slash from string
 * @param  {String} string
 * @return {String}
 */
function removeTrailingSlash() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return string.replace(/\/$/, '');
}

/**
 * remove leading slash from string
 * @param  {String} string
 * @return {String}
 */
function removeLeadingSlash() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return string.replace(/^\/+/g, '');
}

/**
 * Get the base url set on the window.globalStore object
 * @return {String}
 */
function getBaseUrl() {
  if (window && window.globalStore && window.globalStore.magento && window.globalStore.magento.baseUrl) {
    return window.globalStore.magento.baseUrl;
  }

  return '/';
}

var baseUrl = removeTrailingSlash(getBaseUrl());

/**
 * Join a path (if passed) with the base url
 * @param  {String} [path='']
 * @return {[type]}
 */
function getUrl() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return baseUrl + '/' + removeLeadingSlash(path);
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAutofill;
function isAutofill(elementSelector, parentElement) {
  return new Promise(function (resolve, reject) {
    var element = parentElement ? parentElement.querySelector(elementSelector) : document.querySelector(elementSelector);
    var hasKeyInteraction = false;

    if (element) {
      element.addEventListener('input', function () {
        if (hasKeyInteraction === false && element !== document.activeElement) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } else {
      reject('no element found');
    }
  });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEquivalent;
function isEquivalent(a, b) {
  var aProps = Object.keys(a);
  var bProps = Object.keys(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInViewport;
function isInViewport(element, offset) {
  var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  var partial = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var rect = element.getBoundingClientRect();
  var html = document.documentElement;
  var width = w.clientWidth || window.innerWidth || html.clientWidth;
  var height = w.clientHeight || window.innerHeight || html.clientHeight;

  offset = parseInt(offset || 0, 10);

  if (partial) {
    return rect.top < height && rect.top > -rect.height && rect.left > -rect.width && rect.left < width;
  }

  return rect.top >= 0 && rect.left >= 0 && rect.bottom + offset <= height && rect.right <= width;
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var scripts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof scripts === 'string') {
    scripts = [scripts];
  }

  var length = scripts.length;
  var promises = [];

  for (var i = 0; i < length; i += 1) {
    promises.push(loadScript(scripts[i], options));
  }

  return Promise.all(promises);
};

function loadScript(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (document.querySelector('[src="' + url + '"]') && options.force !== true) {
    return Promise.resolve();
  }

  return new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    s.async = true;
    s.onerror = reject;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseQueryString;
/**
 * Parse the query string and return it as an object
 * @param  {String} search from window.location.search
 * @return {Object}
 */
function parseQueryString() {
  var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var o = {};
  if (search.startsWith('?')) {
    search = search.substr(1);
  }

  search = search.split('&');
  for (var i = 0; i < search.length; i += 1) {
    var split = search[i].split('=');
    o[split[0]] = split[1] || null;
  }

  return o;
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rogueCacheTopLinks;
/**
 * Load top links from cache
 * @return {Promise}
 */
function rogueCacheTopLinks() {
  if (typeof window.initRogueCache === 'function') {
    window.initRogueCache(this.$getUrl('roguecache'), '', null, ['cache-toplinks', 'cache-js-data']);
  } else {
    window.location.reload();
  }

  return new Promise(function (resolve) {
    window.eventHub.$once('fpc:response', resolve);
  });
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scrollToElement;
/**
 * Scroll to sent element if present
 * @param {string} element Sent element ID (or query selector) to query DOM with
 * @return {void}
 */
function scrollToElement(element) {
  // have to do this here to get event into vue queue
  setTimeout(function () {
    var scrollElement = document.getElementById(element) || document.querySelector(element);

    if (scrollElement) {
      scrollElement.scrollIntoView({ behavior: 'smooth' });
      scrollElement.focus();
    }
  }, 1);
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scrollToError;
/**
 * Scroll to formState error if present
 * @param {object} formState vue-form interaction/validity for each input field in form
 * @return {void}
 */
function scrollToError(formState, containerEl) {
  var container = containerEl || document;
  var topElement = container.querySelector('.vf-invalid');

  Object.keys(formState.$error).forEach(function (field) {
    formState[field].$touched = true;

    var fieldDOM = document.getElementsByName(field)[0];

    if (fieldDOM && topElement && fieldDOM.offsetTop > topElement.offsetTop) {
      topElement = fieldDOM;
    }
  });

  if (topElement) {
    topElement.parentElement.scrollIntoView({ behavior: 'smooth' });
    topElement.focus({ preventScroll: true });
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setExpirationYears;
/**
 * Sets exipration years for credit cards, based on creditCardYears variable
 * @return {Void}
 */
function setExpirationYears(expiration) {
  var year = window.store.state.base.currentDate.year;

  if (expiration.year.length < 1) {
    for (var i = year; i < year + 20; i += 1) {
      expiration.year.push(i);
    }
  }
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Port of apple-pay/index.vue eligibility check, without additional component-specific info
exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var canUseApplePay, applePayConfig, applePayVersion, err;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            err = function err(sentError) {
              if (applePayConfig.debug) {
                console.error(sentError);
              }
            };

            canUseApplePay = false;
            applePayConfig = window.globalStore.applepay;
            // @NOTE version 2 is hardcoded here and in applepay component
            // would need to change if we update apple pay version in component

            applePayVersion = 2;

            if (!(undefined === applePayConfig)) {
              _context.next = 7;
              break;
            }

            console.warn('ApplePay configuration not found'); // eslint-disable-line

            return _context.abrupt('return', false);

          case 7:
            if (window.ApplePaySession) {
              _context.next = 10;
              break;
            }

            err('This browser does not support Apple Pay');

            return _context.abrupt('return', false);

          case 10:
            if (ApplePaySession.supportsVersion(applePayVersion)) {
              _context.next = 13;
              break;
            }

            err('This browser does not support Apple Pay API version ' + applePayVersion);

            return _context.abrupt('return', false);

          case 13:
            if (ApplePaySession.canMakePayments()) {
              _context.next = 16;
              break;
            }

            err('This device does not support making payments with Apple Pay');

            return _context.abrupt('return', false);

          case 16:
            _context.next = 18;
            return ApplePaySession.canMakePaymentsWithActiveCard(applePayConfig.merchantId).then(function (result) {
              if (!result) {
                err('This device supports Apple Pay but there are no active cards in Wallet');

                return;
              }

              canUseApplePay = true;
            });

          case 18:
            return _context.abrupt('return', window.store.commit('canUseApplePay', canUseApplePay));

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function setSupportsApplePay() {
    return _ref.apply(this, arguments);
  }

  return setSupportsApplePay;
}();

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupRegionId;
/**
 * Check for and set region in sent address based on sent region options if found
 * @param {object} address a sent address
 * @param {array} regionOptions regions options sent based on current store
 * @return {Void}
 */
function setupRegionId(address, regionOptions) {
  function findRegionId(region) {
    return address.region === region.code;
  }

  if (regionOptions) {
    var region = regionOptions.find(findRegionId);

    if (region) {
      address.region_id = region.id;
    }
  }
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (fn) {
  var threshhold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  var scope = arguments[2];

  var last = void 0;
  var deferTimer = void 0;

  return function debounced() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = scope || this;
    var now = +new Date();
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var timers = {};

exports.default = {
  start: function start(ctx) {
    var time = new Date().getTime();
    var rand = Math.floor(Math.random() * 1000);
    var timerId = time + '-' + rand;
    timers[timerId] = _extends({}, ctx, { startTime: time });

    return timerId;
  },
  stop: function stop(timerId) {
    if (timerId && timers[timerId]) {
      var timer = timers[timerId];
      timer.stopTime = new Date().getTime();
      timer.timingValue = timer.stopTime - timer.startTime;
      window.dataLayer.push({
        event: 'userTiming',
        timingCategory: timer.timingCategory || null,
        timingVar: timer.timingVar || null,
        timingValue: timer.timingValue,
        timingLabel: timer.timingLabel || null
      });
    }
  }
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://www.sitepoint.com/community/t/javascript-array-polyfills/193601/7
/* eslint-disable */

if (![].entries) {
  Array.prototype.entries = function () {
    var k = 0,
        o = this;

    return {
      next: function next() {
        return k < o.length ? { value: [k, o[k++]], done: false } : { value: undefined, done: true };
      }
    };
  };
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable */
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function value(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function value(valueToFind, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(valueToFind, elementK) is true, return true.
        if (sameValueZero(o[k], valueToFind)) {
          return true;
        }
        // c. Increase k by 1.
        k += 1;
      }

      // 8. Return false
      return false;
    }
  });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = undefined;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// credit: https://github.com/JamesMGreene/Function.name/blob/master/Function.name.js
var fnNameMatchRegex = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;

function _name() {
  var match = void 0;
  var name = void 0;
  if (this === Function || this === Function.prototype.constructor) {
    name = 'Function';
  } else if (this !== Function.prototype) {
    match = ('' + this).match(fnNameMatchRegex);
    name = match && match[1];
  }

  return name || '';
}

var needsPolyfill = !('name' in Function.prototype && 'name' in function x() {});
var canDefineProp = typeof Object.defineProperty === 'function' && function _canDefineProp() {
  var result = void 0;
  try {
    Object.defineProperty(Function.prototype, '_xyz', {
      // eslint-disable-line no-extend-native
      get: function get() {
        return 'blah';
      },

      configurable: true
    });
    result = Function.prototype._xyz === 'blah';
    delete Function.prototype._xyz;
  } catch (e) {
    console.error(e);
    result = false;
  }

  return result;
}();

if (needsPolyfill && canDefineProp) {
  Object.defineProperty(Function.prototype, 'name', {
    // eslint-disable-line no-extend-native
    get: function get() {
      var name = _name.call(this);
      if (this !== Function.prototype) {
        Object.defineProperty(this, 'name', {
          value: name,
          configurable: true
        });
      }

      return name;
    },

    configurable: true
  });
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function forEach(callback, argument) {
    var i = 0;
    argument = argument || window;
    for (i; i < this.length; i += 1) {
      callback.call(argument, this[i], i, this);
    }
  };
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable */
if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }

    return target;
  };
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.values = Object.values || function (obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchStr, Position) {
    // eslint-disable-line
    if (!(Position < this.length)) {
      Position = this.length;
    } else {
      Position |= 0; // eslint-disable-line no-bitwise
    }

    return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
  };
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict';

    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) {
      start = 0;
    }
    return this.indexOf(search, start) !== -1;
  };
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    // eslint-disable-line
    return this.substr(position || 0, searchString.length) === searchString;
  };
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Adapted from https://github.com/eriwen/es6-map-shim

if (typeof Map === 'undefined') {
  (function (module) {
    function Map(iterable) {
      var _items = [];
      var _keys = [];
      var _values = [];

      // Object.is polyfill, courtesy of @WebReflection
      var is = Object.is || function (a, b) {
        return a === b ? a !== 0 || 1 / a == 1 / b : a != a && b != b;
      };

      // More reliable indexOf, courtesy of @WebReflection
      var betterIndexOf = function betterIndexOf(value) {
        if (value != value || value === 0) {
          for (var i = this.length; i-- && !is(this[i], value);) {}
        } else {
          i = [].indexOf.call(this, value);
        }

        return i;
      };

      /**
       * MapIterator used for iterating over all entries in given map.
       *
       * @param map {Map} to iterate
       * @param kind {String} identifying what to yield. Possible values
       *      are 'keys', 'values' and 'keys+values'
       * @constructor
       */
      var MapIterator = function MapIterator(map, kind) {
        var _index = 0;

        return Object.create({}, {
          next: {
            value: function value() {
              // check if index is within bounds
              if (_index < map.items().length) {
                switch (kind) {
                  case 'keys':
                    return map.keys()[_index++];
                  case 'values':
                    return map.values()[_index++];
                  case 'keys+values':
                    return [].slice.call(map.items()[_index++]);
                  default:
                    throw new TypeError('Invalid iterator type');
                }
              }
              // TODO: make sure I'm interpreting the spec correctly here
              throw new Error('Stop Iteration');
            }
          },
          iterator: {
            value: function value() {
              return this;
            }
          },
          toString: {
            value: function value() {
              return '[object Map Iterator]';
            }
          }
        });
      };

      var _set = function _set(key, value) {
        // check if key exists and overwrite
        var index = betterIndexOf.call(_keys, key);
        if (index > -1) {
          _items[index][1] = value;
          _values[index] = value;
        } else {
          _items.push([key, value]);
          _keys.push(key);
          _values.push(value);
        }
      };

      var setItem = function setItem(item) {
        if (item.length !== 2) {
          throw new TypeError('Invalid iterable passed to Map constructor');
        }

        _set(item[0], item[1]);
      };

      // FIXME: accommodate any class that defines an @@iterator method that returns
      //        an iterator object that produces two element array-like objects
      if (Array.isArray(iterable)) {
        iterable.forEach(setItem);
      } else if (iterable !== undefined) {
        throw new TypeError('Invalid Map');
      }

      return Object.create(MapPrototype, {
        /**
         * @return {Array} all entries in the Map, in order
         */
        items: {
          value: function value() {
            return [].slice.call(_items);
          }
        },
        /**
         * @return {Array} all keys in the Map, in order
         */
        keys: {
          value: function value() {
            return [].slice.call(_keys);
          }
        },
        /**
         * @return {Array} all values in the Map, in order
         */
        values: {
          value: function value() {
            return [].slice.call(_values);
          }
        },
        /**
         * Given a key, indicate whether that key exists in this Map.
         *
         * @param key {Object} expected key
         * @return {Boolean} true if key in Map
         */
        has: {
          value: function value(key) {
            // TODO: double-check how spec reads about null values
            var index = betterIndexOf.call(_keys, key);

            return index > -1;
          }
        },
        /**
         * Given a key, retrieve the value associated with that key (or undefined).
         *
         * @param key {Object}
         * @return {Object} value associated with key or undefined
         */
        get: {
          value: function value(key) {
            var index = betterIndexOf.call(_keys, key);

            return index > -1 ? _values[index] : undefined;
          }
        },
        /**
         * Add or overwrite entry associating key with value. Always returns undefined.
         *
         * @param key {Object} anything
         * @param value {Object} also anything
         */
        set: {
          value: _set
        },
        /**
         * Return the number of entries in this Map.
         *
         * @return {Number} number of entries
         */
        size: {
          get: function get() {
            return _items.length;
          }
        },
        /**
         * Remove all entries in this Map. Returns undefined.
         */
        clear: {
          value: function value() {
            _keys.length = _values.length = _items.length = 0;
          }
        },
        /**
         * Delete entry with given key, if it exists.
         *
         * @param key {Object} any possible key
         * @return {Boolean} true if an entry was deleted
         */
        delete: {
          value: function value(key) {
            var index = betterIndexOf.call(_keys, key);
            if (index > -1) {
              _keys.splice(index, 1);
              _values.splice(index, 1);
              _items.splice(index, 1);

              return true;
            }

            return false;
          }
        },
        /**
         * Given a callback function and optional context, invoke the callback on all
         * entries in this Map.
         *
         * @param callbackFn {Function}
         */
        forEach: {
          value: function value(callbackfn /* , thisArg */) {
            if (typeof callbackfn !== 'function') {
              throw new TypeError('Invalid callback function given to forEach');
            }

            function tryNext() {
              try {
                return iter.next();
              } catch (e) {
                return undefined;
              }
            }

            var iter = this.iterator();
            var current = tryNext();
            var next = tryNext();
            while (current !== undefined) {
              callbackfn.apply(arguments[1], [current[1], current[0], this]);
              current = next;
              next = tryNext();
            }
          }
        },
        /**
         * Return a MapIterator object for this map.
         */
        iterator: {
          value: function value() {
            return new MapIterator(this, 'keys+values');
          }
        },
        toString: {
          value: function value() {
            return '[Object Map]';
          }
        }
      });
    }

    var notInNode = module == 'undefined';
    var window = notInNode ? this : global;
    var module = notInNode ? {} : exports;
    var MapPrototype = Map.prototype;

    Map.prototype = MapPrototype = Map();

    window.Map = module.Map = window.Map || Map;
  }).call(undefined,  false ? 'undefined' : _typeof(exports));
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function CustomEvent(event, params) {
  params = params || { bubbles: false, cancelable: false, detail: undefined };
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

  return evt;
}

if (typeof window.CustomEvent !== 'function') {
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(12);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// adapted from https://github.com/googlearchive/WeakMap/blob/master/weakmap.js

if (typeof WeakMap === 'undefined') {
  (function () {
    //eslint-disable-line
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;

    var WeakMap = function WeakMap() {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter += 1) + '__'; //eslint-disable-line
    };

    WeakMap.prototype = {
      set: function set(key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key) {
          entry[1] = value;
        } else {
          defineProperty(key, this.name, { value: [key, value], writable: true });
        }

        return this;
      },
      get: function get(key) {
        var entry = void 0;

        return (entry = key[this.name]) && entry[0] === key ? //eslint-disable-line
        entry[1] : undefined;
      },
      delete: function _delete(key) {
        var entry = key[this.name];
        if (!entry) return false;
        var hasValue = entry[0] === key;
        entry[0] = entry[1] = undefined; //eslint-disable-line

        return hasValue;
      },
      has: function has(key) {
        var entry = key[this.name];
        if (!entry) return false;

        return entry[0] === key;
      }
    };

    window.WeakMap = WeakMap;
  })();
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assign;

var _helpers = __webpack_require__(3);

/**
 * If the test is defined in the query string, use it for the definition
 * Otherwise, randomly assign
 * @return {void}
 */
function assign() {
  var testObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var bucket = arguments[1];

  window.study.define(testObj);

  var queryString = (0, _helpers.parseQueryString)(window.location.search);
  if (Object.keys(queryString).indexOf(bucket) !== -1) {
    window.study.assign(bucket, queryString[bucket]);
  } else {
    window.study.assign();
  }

  return window.study.assignments()[bucket];
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

__webpack_require__(11);

window.study = new Study({
  debug: process.env.NODE_ENV === 'development',
  store: Study.stores.local,
  storageKey: 'studyjs-ab-tests'
}); /* global Study */
// https://github.com/dollarshaveclub/study


document.addEventListener('DOMContentLoaded', function () {
  study.root = document.body;
  study.applyClasses();
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _test = __webpack_require__(0);

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUCKET_NAME = 'apple-pay';
var TEST_NAME = 'Apple Pay';

var ApplePay = function (_StudyJsTestAbstract) {
  _inherits(ApplePay, _StudyJsTestAbstract);

  function ApplePay() {
    _classCallCheck(this, ApplePay);

    var _this = _possibleConstructorReturn(this, (ApplePay.__proto__ || Object.getPrototypeOf(ApplePay)).call(this, {
      bucketName: BUCKET_NAME,
      buckets: {
        control: { weight: 1 - window.AB.applePay },
        applePay: { weight: window.AB.applePay }
      },
      testName: TEST_NAME
    }));

    _this.checkBucketSetVariable();
    return _this;
  }

  _createClass(ApplePay, [{
    key: 'checkBucketSetVariable',
    value: function checkBucketSetVariable() {
      var _this2 = this;

      if (study.assignments()[BUCKET_NAME] === 'applePay') {
        if (Object.prototype.hasOwnProperty.call(window, 'store') && typeof window.store.commit === 'function') {
          window.store.commit('setShowApplePay', true);
        }

        document.addEventListener('DOMContentLoaded', function () {
          _this2.addEventListeners();
        });
      }
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      var els = document.getElementsByClassName('apple-pay-btn');
      if (els.length > 0) {
        for (var i = 0; i < els.length; i += 1) {
          els[i].addEventListener('click', this.sendPromoClick.bind(this));
        }
      }
    }
  }]);

  return ApplePay;
}(_test2.default);

window.runApplePayTest = function () {
  if (window.globalStore.magento.store.id === '1' && window.AB && typeof window.AB.applePay === 'number' && window.AB.applePay >= 0 && window.AB.applePay <= 1) {
    new ApplePay();
  }
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if (window.globalStore.magento.store.id === '1' && window.AB && typeof window.AB.removeQuickviewButton === 'number' && window.AB.removeQuickviewButton >= 0 && window.AB.removeQuickviewButton <= 1) {
    new RapidCheckoutTest();
  }
};

var _test = __webpack_require__(0);

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUCKET_NAME = 'hide-quickview-button';
var TEST_NAME = 'WEB-2280 - Hide Quickview Button';

var RapidCheckoutTest = function (_StudyJsTestAbstract) {
  _inherits(RapidCheckoutTest, _StudyJsTestAbstract);

  function RapidCheckoutTest() {
    _classCallCheck(this, RapidCheckoutTest);

    var _this = _possibleConstructorReturn(this, (RapidCheckoutTest.__proto__ || Object.getPrototypeOf(RapidCheckoutTest)).call(this, {
      bucketName: BUCKET_NAME,
      buckets: {
        control: { weight: 1 - window.AB.removeQuickviewButton },
        hide: { weight: window.AB.removeQuickviewButton }
      },
      testName: TEST_NAME
    }));

    if (study.assignments()['hide-quickview-button'] === 'hide') {
      document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementsByClassName('qv-link');
        var btnLength = btn.length;
        for (var i = 0; i < btnLength; i += 1) {
          btn[i].style.display = 'none';
        }
      });
    }
    return _this;
  }

  return RapidCheckoutTest;
}(_test2.default);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var isEligibleForNewCheckoutTest = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(window.globalStore.checkout.is_enabled && (!window.globalStore.customer.logged_in || window.globalStore.checkout.enabled_for_logged_in) && window.AB && typeof window.AB.newCheckout === 'number' && window.AB.newCheckout >= 0 && window.AB.newCheckout <= 1)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', true);

          case 2:
            return _context.abrupt('return', false);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function isEligibleForNewCheckoutTest() {
    return _ref.apply(this, arguments);
  };
}();

var _helpers = __webpack_require__(3);

var _test = __webpack_require__(0);

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUCKET_NAME = 'new-checkout-10-2019';
var TEST_NAME = 'New Checkout Test 10 2019';

var NewCheckoutTest = function (_StudyJsTestAbstract) {
  _inherits(NewCheckoutTest, _StudyJsTestAbstract);

  function NewCheckoutTest() {
    _classCallCheck(this, NewCheckoutTest);

    return _possibleConstructorReturn(this, (NewCheckoutTest.__proto__ || Object.getPrototypeOf(NewCheckoutTest)).call(this, {
      bucketName: BUCKET_NAME,
      buckets: {
        control: { weight: 1 - window.AB.newCheckout },
        newCheckout: { weight: window.AB.newCheckout }
      },
      testName: TEST_NAME
    }));
  }

  return NewCheckoutTest;
}(_test2.default);

exports.default = NewCheckoutTest;


window.runNewCheckoutTest = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(noRedirect) {
    var _isEligibleForNewCheckoutTest;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return isEligibleForNewCheckoutTest();

          case 2:
            _isEligibleForNewCheckoutTest = _context2.sent;


            if (_isEligibleForNewCheckoutTest && window.study.assignments()[BUCKET_NAME] === 'newCheckout') {
              if (!noRedirect) {
                window.location.href = (0, _helpers.getUrl)('/one-step-checkout');
              }
            } else {
              // if you were in B bucket but dont qualify, put you in A
              // if you're in control, this wont do anything
              study.assign(BUCKET_NAME, 'control');
              window.location.href = window.store.state.base.magento.urls.checkout;
            }

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _test = __webpack_require__(0);

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUCKET_NAME = 'smart-cart-messages-3-free';
var TEST_NAME = 'Smart Cart Messages - 3 Ship Free';

var SmartCartMessagesThreeShipsFree = function (_StudyJsTestAbstract) {
  _inherits(SmartCartMessagesThreeShipsFree, _StudyJsTestAbstract);

  function SmartCartMessagesThreeShipsFree() {
    _classCallCheck(this, SmartCartMessagesThreeShipsFree);

    var _this = _possibleConstructorReturn(this, (SmartCartMessagesThreeShipsFree.__proto__ || Object.getPrototypeOf(SmartCartMessagesThreeShipsFree)).call(this, {
      bucketName: BUCKET_NAME,
      buckets: {
        control: { weight: 1 - window.AB.smartcartmessages3free },
        smartCartMessages: { weight: window.AB.smartcartmessages3free }
      },
      testName: TEST_NAME
    }));

    _this.checkBucketSetVariable();
    return _this;
  }

  _createClass(SmartCartMessagesThreeShipsFree, [{
    key: 'checkBucketSetVariable',
    value: function checkBucketSetVariable() {
      if (study.assignments()[BUCKET_NAME] === 'smartCartMessages') {
        window.showSCMThreeShipsFree = true;
      }
    }
  }]);

  return SmartCartMessagesThreeShipsFree;
}(_test2.default);

if (Object.prototype.hasOwnProperty.call(study.previousAssignments, BUCKET_NAME)) {
  new SmartCartMessagesThreeShipsFree();
}

function runSmartCartMessages3FreeTest() {
  if (window.globalStore.magento.store.id === '1' && window.AB && typeof window.AB.smartcartmessages3free === 'number' && window.AB.smartcartmessages3free >= 0 && window.AB.smartcartmessages3free <= 1) {
    new SmartCartMessagesThreeShipsFree();
  }
}

if (!window.scmTests || _typeof(window.scmTests) !== 'object') {
  window.scmTests = {};
}

window.scmTests.threeShipsFree = function (messages) {
  for (var i = 0; i < messages.length; i += 1) {
    if (messages[i].code === 'scm_three_ships_free') {
      runSmartCartMessages3FreeTest();
    }
  }
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _test = __webpack_require__(0);

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUCKET_NAME = 'smart-cart-messages-5k';
var TEST_NAME = 'Smart Cart Messages - 5k Free Shipping';

var SmartCartMessages5k = function (_StudyJsTestAbstract) {
  _inherits(SmartCartMessages5k, _StudyJsTestAbstract);

  function SmartCartMessages5k() {
    _classCallCheck(this, SmartCartMessages5k);

    var _this = _possibleConstructorReturn(this, (SmartCartMessages5k.__proto__ || Object.getPrototypeOf(SmartCartMessages5k)).call(this, {
      bucketName: BUCKET_NAME,
      buckets: {
        control: { weight: 1 - window.AB.smartcartmessages5k },
        smartCartMessages: { weight: window.AB.smartcartmessages5k }
      },
      testName: TEST_NAME
    }));

    _this.checkBucketSetVariable();
    return _this;
  }

  _createClass(SmartCartMessages5k, [{
    key: 'checkBucketSetVariable',
    value: function checkBucketSetVariable() {
      if (study.assignments()[BUCKET_NAME] === 'smartCartMessages') {
        window.showSCMFiveK = true;
      }
    }
  }]);

  return SmartCartMessages5k;
}(_test2.default);

if (Object.prototype.hasOwnProperty.call(study.previousAssignments, BUCKET_NAME)) {
  new SmartCartMessages5k();
}

function runSmartCartMessages5KTest() {
  if (window.globalStore.magento.store.id === '1' && window.AB && typeof window.AB.smartcartmessages5k === 'number' && window.AB.smartcartmessages5k >= 0 && window.AB.smartcartmessages5k <= 1) {
    new SmartCartMessages5k();
  }
}

if (!window.scmTests || _typeof(window.scmTests) !== 'object') {
  window.scmTests = {};
}

window.scmTests.fiveKTest = function (messages) {
  for (var i = 0; i < messages.length; i += 1) {
    if (messages[i].code === 'scm_five_k') {
      runSmartCartMessages5KTest();
    }
  }
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

__webpack_require__(6);

__webpack_require__(5);

__webpack_require__(7);

/***/ })
/******/ ]);