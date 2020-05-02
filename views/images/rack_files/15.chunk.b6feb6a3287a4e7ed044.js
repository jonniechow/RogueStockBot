webpackJsonp([15],{

/***/ 1235:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vue = __webpack_require__(4);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BvCurrations = function () {
  /**
   * @param  {(Object)} [settings] Object of options
   * @param  {Function} [resolve]
   * @param  {Function} [reject]
   * @return {void}
   */
  function BvCurrations() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var resolve = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    var reject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    _classCallCheck(this, BvCurrations);

    var defaultSettings = {
      order: null,
      write: true
    };

    this.settings = _extends({}, defaultSettings, settings);
    this._resolve = resolve;
    this._reject = reject;
    this._initializeBvCurrations();
  }

  /**
   * @return {integer|null}
   */


  _createClass(BvCurrations, [{
    key: '_initializeBvCurrations',
    value: function _initializeBvCurrations() {
      this._apiUrl = '/app_light/product/curration.php';
      this._errors = [];

      if (this._checkSettings()) {
        this._http();
      } else {
        this._errors.push('Invalid settings');
        this._reject(this);
      }
    }

    /**
     * Validate settings for reflektion recommendations
     * @private
     * @return {bool}
     */

  }, {
    key: '_checkSettings',
    value: function _checkSettings() {
      var errorMessage = null;
      if (!this.settings) {
        errorMessage = 'No settings sent';
      }

      if (errorMessage) {
        this._errors.push(errorMessage);
        this._reject(this);

        return false;
      }

      if (typeof this._resolve !== 'function') {
        this._resolve = function () {};
      }

      if (typeof this._reject !== 'function') {
        this._reject = function () {};
      }

      return true;
    }

    /**
     * Request the endpoint with VueResource
     * @private
     * @return {void}
     */

  }, {
    key: '_http',
    value: function _http() {
      if (this._apiUrl) {
        _vue2.default.http.get('' + this._apiUrl, {
          params: {
            id: this.settings.sku
          }
        }).then(this._httpResolve.bind(this), this._httpReject.bind(this)).catch(this._reject.bind(this));
      } else {
        this._errors.push('API URL not configured');
        this._httpReject();
      }
    }

    /**
     * Resolved promise from _http()
     * @private
     * @param  {Object} response
     * @return {void}
     */

  }, {
    key: '_httpResolve',
    value: function _httpResolve(response) {
      this.httpResponse = response;
      if (response.ok) {
        this._resolve(this);
      } else {
        this._errors.push('No Response Content');
        this._httpReject();
      }
    }

    /**
     * Rejected promise from _http()
     * @private
     * @param  {Array<Object>} args
     * @return {void}
     */

  }, {
    key: '_httpReject',
    value: function _httpReject() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length) {
        this._errors.push(args);
      }
      this._reject(this);
    }
  }]);

  return BvCurrations;
}();

exports.default = {
  /**
   * Create BvCurrations Instance
   * @param  {(Object)} settings Settings object
   * @param  {string} settings.mbox
   * @param  {string} settings.mboxParameters
   * @return {Promise}
   */
  get: function get(settings) {
    return new Promise(function (resolve, reject) {
      new BvCurrations(settings, resolve, reject);
    });
  }
};

/***/ }),

/***/ 1251:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _flickity = __webpack_require__(92);

var _flickity2 = _interopRequireDefault(_flickity);

var _helpers = __webpack_require__(6);

var _bvcurrations = __webpack_require__(1235);

var _bvcurrations2 = _interopRequireDefault(_bvcurrations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_FLICKITY_OPTIONS = {
  prevNextButtons: true,
  pageDots: false,
  watchCSS: true,
  draggable: true,
  contain: true,
  setGallerySize: true,
  adaptiveHeight: true,
  percentPosition: true,
  cellSelector: '.currations',
  containerSelector: '.currations-container',
  groupCells: 2
};

exports.default = {
  store: store,

  props: ['settings', 'settingsString'],

  data: function data() {
    return {
      currations: [],
      showCurrations: true,
      destroyed: false,
      imagesLazyLoaded: false,
      showCurrationContent: false,
      currationContent: null,
      currentIndex: 0,
      containerClass: '',
      lazyLoadScrollElement: window,
      sku: null,
      flickity: null,
      flickityOptions: {}
    };
  },
  beforeMount: function beforeMount() {
    var _this = this;

    if (this.getProductSKUFromProductPage()) {
      this.initCurrations();
    } else {
      window.addEventListener('load', function () {
        _this.initCurrations();
      });
    }
  },


  methods: {
    /**
    * @param date
    * @returns {string}
    */
    formatDate: function formatDate(date) {
      var abbreviatedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      var d = new Date(date * 1000);

      return abbreviatedMonths[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    },


    /**
     * Init
     * @return {void}
     */
    initCurrations: function initCurrations() {
      this.destroyed = false;
      this.setData();
    },


    /**
    * Set Data and run load method
    */
    setData: function setData() {
      this.flickityOptions = _extends({}, DEFAULT_FLICKITY_OPTIONS, this.flickityOptions);
      this.getCurrationsContent();
    },


    /**
     * Set up the flickity carousel
     * @return {void}
     */
    setUpCarousel: function setUpCarousel() {
      var _this2 = this;

      if (!this.flickityOptions.disable) {
        this.$nextTick(function () {
          _this2.flickity = new _flickity2.default(_this2.flickityOptions.containerSelector, _this2.flickityOptions);
          _this2.$nextTick(function () {
            _this2.flickity.resize();
            window.flickity = _this2.flickity;
          });
        });
      }
    },


    /**
    * XHR recommendations from Reflektion.
    * @return {void}
    */
    getCurrationsContent: function getCurrationsContent() {
      var promises = [];
      promises.push(_bvcurrations2.default.get({
        sku: this.getProductSKUFromProductPage()
      }));

      Promise.all(promises).then(this.getCurrationsContentSuccess.bind(this)).catch(this.destroy.bind(this));
    },


    /**
     * On successful XHR request in getRecommendationsFromReflektion
     * @param  {object} response
     * @return {void}
     */
    getCurrationsContentSuccess: function getCurrationsContentSuccess(responses) {
      var recs = [];
      responses.forEach(function (response) {
        if (response.httpResponse.body.product) {
          response.httpResponse.body.product.forEach(function (product) {
            if (product.data.photos.length) {
              product.data.contentType = 'photo';
            } else if (product.data.videos.length) {
              product.data.contentType = 'video';
            }
            recs.push(product.data);
          });
        }
      });

      if (recs.length) {
        this.currations = recs;
        this.setUpCarousel();
      } else {
        this.destroy();
      }
    },


    /**
    * Click event
    * @param curration
    * @param index
    */
    openCurrationContent: function openCurrationContent(curration, index) {
      this.currationContent = curration;
      this.currentIndex = index;
      this.showCurrationContent = true;
    },


    /**
    * Logic for prev/next button in view window
    * @param showNext
    */
    showNextCurration: function showNextCurration(showNext) {
      if (showNext) {
        if (this.currentIndex < this.currations.length - 1) {
          this.currentIndex += 1;
        } else {
          this.currentIndex = 0;
        }
      } else if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      } else {
        this.currentIndex = this.currations.length - 1;
      }

      this.openCurrationContent(this.currations[this.currentIndex], this.currentIndex);
    },


    /**
    * Get product SKU from product page
    * @return {String}
    */
    getProductSKUFromProductPage: function getProductSKUFromProductPage() {
      var el = document.querySelector('[id="product-sku"]');

      return el ? el.getAttribute('content') : null;
    },


    /**
    * Close content window
    */
    contentHide: function contentHide() {
      this.showCurrationContent = false;
    },


    /**
    * Destroy method
    */
    destroy: function destroy() {
      this.destroyed = true;
    }
  }
};

/***/ }),

/***/ 1322:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n#product-page-bvcurrations {\n  clear: both;\n  /* no circle */\n  /* big previous & next buttons */\n  /* icon color */\n}\n#product-page-bvcurrations .flickity-button {\n    background: transparent;\n}\n#product-page-bvcurrations .flickity-button:hover {\n      background: transparent;\n}\n#product-page-bvcurrations .flickity-button:disabled {\n      display: none;\n}\n#product-page-bvcurrations .flickity-prev-next-button {\n    width: 75px;\n    height: 75px;\n}\n#product-page-bvcurrations .flickity-button-icon {\n    fill: white;\n}\n#product-page-bvcurrations + .add-this > .container {\n  border-top: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 1323:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n#product-page-bvcurrations[data-v-fcaf3cd2] {\n  clear: both;\n}\n#product-page-bvcurrations .outer-container[data-v-fcaf3cd2] {\n    margin-bottom: 0;\n    border: none;\n}\n@media (min-width: 1280px) {\n#product-page-bvcurrations .outer-container[data-v-fcaf3cd2] {\n        position: relative;\n        left: calc((100vw - 1280px) / -2);\n        width: 100vw;\n}\n.col1-wide-layout #product-page-bvcurrations .outer-container[data-v-fcaf3cd2] {\n          left: 0;\n}\n}\n#product-page-bvcurrations .currations-top[data-v-fcaf3cd2] {\n    background-color: #000;\n}\n#product-page-bvcurrations .currations-top .currations-header[data-v-fcaf3cd2] {\n      position: static;\n      display: -ms-flexbox;\n      display: flex;\n      -ms-flex-align: center;\n          align-items: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n      -ms-flex-line-pack: center;\n          align-content: center;\n      width: 100%;\n      margin: 0 auto 0;\n      padding: 10px;\n      text-align: left;\n      color: #fff;\n      -ms-flex-flow: column wrap;\n          flex-flow: column wrap;\n      webkit-flex-flow: column wrap;\n}\n#product-page-bvcurrations .currations-top .currations-header a[data-v-fcaf3cd2] {\n        text-decoration: none;\n        color: #fff;\n}\n#product-page-bvcurrations .currations-top .currations-header .item[data-v-fcaf3cd2] {\n        font-family: \"Roboto Condensed\", \"Helvetica\", Arial, sans-serif;\n        margin: 5px;\n        text-align: center;\n}\n#product-page-bvcurrations .currations-top .currations-header .tag[data-v-fcaf3cd2] {\n        font-size: 35px;\n        font-weight: bold;\n        line-height: 25px;\n}\n#product-page-bvcurrations .currations-top .currations-header .middle-text[data-v-fcaf3cd2] {\n        font-family: \"Helvetica\", Arial, sans-serif;\n        font-size: 13px;\n        line-height: 16px;\n}\n#product-page-bvcurrations .currations-top .currations-header .gallery[data-v-fcaf3cd2] {\n        font-size: 15px;\n        font-weight: bold;\n        padding: 8px 15px;\n        border: 3px solid #fff;\n}\n@media (min-width: 1024px) {\n#product-page-bvcurrations .currations-top .currations-header[data-v-fcaf3cd2] {\n          -ms-flex-flow: nowrap;\n              flex-flow: nowrap;\n}\n#product-page-bvcurrations .currations-top .currations-header .middle-text[data-v-fcaf3cd2] {\n            width: 360px;\n            text-align: left;\n}\n}\n#product-page-bvcurrations .currations-container[data-v-fcaf3cd2] {\n    overflow: hidden;\n    width: 100%;\n    max-width: 1280px;\n    margin-right: auto;\n    margin-left: auto;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    background-color: #fff;\n}\n#product-page-bvcurrations .currations-container[data-v-fcaf3cd2]:after {\n      display: none;\n      content: 'flickity';\n}\n@media (min-width: 1025px) {\n#product-page-bvcurrations .currations-container[data-v-fcaf3cd2] {\n        -ms-flex-pack: center;\n            justify-content: center;\n        -webkit-user-select: auto;\n           -moz-user-select: auto;\n            -ms-user-select: auto;\n                user-select: auto;\n}\n}\n#product-page-bvcurrations .currations[data-v-fcaf3cd2] {\n    position: relative;\n    display: inline-block;\n    width: 50%;\n    text-decoration: none;\n}\n#product-page-bvcurrations .currations .media-container[data-v-fcaf3cd2] {\n      display: block;\n      overflow: hidden;\n      width: 100%;\n      height: 0;\n      padding-bottom: 100%;\n      background-size: cover;\n}\n#product-page-bvcurrations .currations .play-btn[data-v-fcaf3cd2] {\n      position: absolute;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      left: 0;\n      width: 3.775em;\n      height: 3.375em;\n      margin: auto;\n      background: none, url(/skin/frontend/rg/2015/images/sprite.svg);\n      background-repeat: no-repeat;\n      background-position: -44.5em 0;\n      background-size: 70.375em auto;\n}\n#product-page-bvcurrations .currations[data-v-fcaf3cd2]:hover {\n      text-decoration: none;\n      opacity: .8;\n      color: #000;\n}\n#product-page-bvcurrations .currations.placeholder[data-v-fcaf3cd2] {\n      -ms-flex-preferred-size: 4px;\n          flex-basis: 4px;\n      width: 4px;\n}\n@media (min-width: 1024px) {\n#product-page-bvcurrations .currations[data-v-fcaf3cd2] {\n        -ms-flex-positive: 0;\n            flex-grow: 0;\n        -ms-flex-negative: 0;\n            flex-shrink: 0;\n        width: 320px;\n}\n}\n#product-page-bvcurrations .curration-view[data-v-fcaf3cd2] {\n    position: fixed;\n    z-index: 999;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-align: center;\n        align-items: center;\n    -ms-flex-pack: center;\n        justify-content: center;\n    -ms-flex-line-pack: center;\n        align-content: center;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, 0.75);\n}\n#product-page-bvcurrations .curration-view .curration-content[data-v-fcaf3cd2] {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      display: block;\n      overflow: hidden;\n      -ms-flex-align: center;\n          align-items: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n      -ms-flex-line-pack: center;\n          align-content: center;\n      width: 100%;\n      height: inherit;\n      max-height: 1200px;\n      transition: max-width 1s, max-height 1s;\n      transform: translate(-50%, -50%);\n}\n#product-page-bvcurrations .curration-view .curration-content .button-container[data-v-fcaf3cd2] {\n        display: none;\n        margin: 1em;\n        cursor: pointer;\n}\n#product-page-bvcurrations .curration-view .curration-content .btn-next[data-v-fcaf3cd2] {\n        width: 2.375em;\n        height: 2.375em;\n        background: none, url(/skin/frontend/rg/2015/images/sprite.svg);\n        background-repeat: no-repeat;\n        background-position: -49.25em 0;\n        background-size: 55.375em auto;\n}\n#product-page-bvcurrations .curration-view .curration-content .btn-prev[data-v-fcaf3cd2] {\n        width: 2.375em;\n        height: 3.375em;\n        background: none, url(/skin/frontend/rg/2015/images/sprite.svg);\n        background-repeat: no-repeat;\n        background-position: -3.875em -2.875em;\n        background-size: 55.375em auto;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration[data-v-fcaf3cd2] {\n        position: relative;\n        top: 10px;\n        display: block;\n        overflow: scroll;\n        -ms-flex-align: left;\n            align-items: left;\n        width: 100%;\n        height: 100%;\n        padding-bottom: 3em;\n        background-color: #fff;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .cn-close[data-v-fcaf3cd2] {\n          position: fixed;\n          z-index: 9999;\n          top: 2%;\n          right: 15px;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .image-media-container[data-v-fcaf3cd2] {\n          display: block;\n          overflow: hidden;\n          width: 100%;\n          height: 0;\n          padding-bottom: 100%;\n          background-size: cover;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .content-video[data-v-fcaf3cd2] {\n          display: block;\n          width: 100%;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .post[data-v-fcaf3cd2] {\n          -ms-flex-positive: 1;\n              flex-grow: 1;\n          -ms-flex-item-align: start;\n              align-self: flex-start;\n          padding: 15px;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .post .head[data-v-fcaf3cd2] {\n            display: -ms-flexbox;\n            display: flex;\n            -ms-flex-align: center;\n                align-items: center;\n            -ms-flex-pack: left;\n                justify-content: left;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .post .head .avatar[data-v-fcaf3cd2] {\n              width: 50px;\n              height: 50px;\n              border: white;\n              border-radius: 25px;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .post .head .post-details[data-v-fcaf3cd2] {\n              -ms-flex-positive: 1;\n                  flex-grow: 1;\n              padding-left: 5px;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .post .head .post-details a[data-v-fcaf3cd2] {\n                text-decoration: none;\n                color: #000;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .post .head .post-details .date[data-v-fcaf3cd2] {\n                font-size: 12px;\n                color: #a2a2a2;\n}\n@media (min-width: 1024px) {\n#product-page-bvcurrations .curration-view[data-v-fcaf3cd2] {\n        -ms-flex-positive: 0;\n            flex-grow: 0;\n        -ms-flex-negative: 0;\n            flex-shrink: 0;\n}\n#product-page-bvcurrations .curration-view .curration-content[data-v-fcaf3cd2] {\n          display: -ms-flexbox;\n          display: flex;\n          height: auto;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration[data-v-fcaf3cd2] {\n            display: -ms-flexbox;\n            display: flex;\n            overflow: hidden;\n            width: 900px;\n            height: auto;\n            padding-bottom: 0;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .cn-close[data-v-fcaf3cd2] {\n              position: absolute;\n}\n#product-page-bvcurrations .curration-view .curration-content .curration .media-container[data-v-fcaf3cd2] {\n              min-width: 450px;\n              max-width: 70%;\n}\n#product-page-bvcurrations .curration-view .curration-content .button-container[data-v-fcaf3cd2] {\n            display: block;\n}\n#product-page-bvcurrations .curration-view .curration-content .content-video[data-v-fcaf3cd2] {\n            max-width: 500px;\n            max-height: 500px;\n}\n}\n", ""]);

// exports


/***/ }),

/***/ 1446:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.showCurrations) ? _c('div', {
    staticClass: "outer-container",
    class: _vm.containerClass
  }, [_c('div', {
    staticClass: "currations-top"
  }, [_c('div', {
    staticClass: "currations-header"
  }, [_c('div', {
    staticClass: "tag item"
  }, [_vm._v(_vm._s(_vm.__('#RYOUROGUE')))]), _c('div', {
    staticClass: "middle-text item"
  }, [_vm._v(_vm._s(_vm.__('Tag your photos on Instagram and Twitter with #RYOUROGUE for a chance to be featured in our gallery')))]), _c('a', {
    staticClass: "gallery item",
    attrs: {
      "href": "https://www.roguefitness.com/theindex/ryourogue",
      "target": "_blank"
    }
  }, [_vm._v(_vm._s(_vm.__('VIEW GALLERY')))])])]), _c('div', {
    staticClass: "currations-container"
  }, _vm._l((_vm.currations), function(curration, i) {
    return _c('a', {
      staticClass: "currations",
      attrs: {
        "data-id": curration.id
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.openCurrationContent(curration, i, true)
        }
      }
    }, [(curration.contentType === 'photo') ? _c('span', {
      staticClass: "media-container",
      style: (( _obj = {}, _obj['background-image'] = ("url(" + (curration.photos[0].display_url) + ")"), _obj ))
    }) : _c('span', {
      staticClass: "media-container",
      style: ({
        'background-image': ("url(" + (curration.videos[0].image_service_url) + ")")
      })
    }, [_c('span', {
      staticClass: "play-btn"
    })])])
    var _obj;
  })), (_vm.showCurrationContent) ? _c('div', {
    staticClass: "curration-view"
  }, [_c('div', {
    staticClass: "curration-content"
  }, [_c('div', {
    staticClass: "button-container btn-prev",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showNextCurration(false)
      }
    }
  }), _c('div', {
    staticClass: "curration"
  }, [_c('div', {
    staticClass: "cn-close",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.contentHide()
      }
    }
  }, [_c('i', {
    staticClass: "icon icon-x off-canvas-icon ga-off-canvas-header-icon-close"
  })]), (_vm.currationContent.contentType === 'photo') ? _c('div', {
    staticClass: "media-container"
  }, [_c('span', {
    staticClass: "image-media-container",
    style: ({
      'background-image': ("url(" + (_vm.currationContent.photos[0].image_service_url) + ")")
    })
  })]) : _c('div', {
    staticClass: "media-container"
  }, [_c('video', {
    staticClass: "content-video",
    attrs: {
      "controls": "controls",
      "muted": "muted"
    },
    domProps: {
      "muted": true
    }
  }, [_c('source', {
    attrs: {
      "src": _vm.currationContent.videos[0].url,
      "type": "video/mp4"
    }
  })])]), _c('div', {
    staticClass: "post"
  }, [_c('div', {
    staticClass: "head"
  }, [_c('div', [_c('img', {
    staticClass: "avatar",
    attrs: {
      "src": _vm.currationContent.author.avatar
    }
  })]), _c('div', {
    staticClass: "post-details"
  }, [_c('a', {
    staticClass: "profile-url",
    attrs: {
      "href": _vm.currationContent.author.profile,
      "target": "_blank"
    }
  }, [_c('span', [_vm._v(_vm._s(_vm.__(_vm.currationContent.author.alias)))])]), _c('br'), _c('span', {
    staticClass: "date"
  }, [_vm._v(_vm._s(_vm.__(_vm.formatDate(_vm.currationContent.timestamp))))])])]), _c('br'), _c('br'), _c('p', [_vm._v(_vm._s(_vm.__(_vm.currationContent.text)))])])]), _c('div', {
    staticClass: "button-container btn-next",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showNextCurration(true)
      }
    }
  })])]) : _vm._e()]) : _vm._e()
},staticRenderFns: []}

/***/ }),

/***/ 1515:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1322);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("26bd6f70", content, true, {});

/***/ }),

/***/ 1516:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1323);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("364171a8", content, true, {});

/***/ }),

/***/ 974:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1516)
__webpack_require__(1515)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(1251),
  /* template */
  __webpack_require__(1446),
  /* scopeId */
  "data-v-fcaf3cd2",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ })

});
//# sourceMappingURL=15.chunk.b6feb6a3287a4e7ed044.js.map