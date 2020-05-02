webpackJsonp([14],{

/***/ 1252:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _context = __webpack_require__(91);

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {String}
 */
function getProductSKUFromProductPage() {
  var el = document.querySelector('[id="product-sku"]');
  var sku = el ? el.getAttribute('content') : null;

  return rogueRfk.returnArrayOfValues(sku);
}

/**
 * @return {String}
 */
function getCurrentPagePath() {
  var urlPath = window.location.pathName;

  return urlPath || null;
}

exports.default = {
  extends: _context2.default,

  data: function data() {
    return {
      internalPromotionList: 'Product Page Recommendations',
      minRecommendations: 3,
      maxRecommendations: 18,
      skus: getProductSKUFromProductPage(),
      url: getCurrentPagePath()
    };
  },
  mounted: function mounted() {
    if (this.recommendationType !== 'reflektion') {
      this.title = this.__('Other Customers Also Viewed');
    }
  }
};

/***/ }),

/***/ 1304:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n#product-page-recommendations {\n  clear: both;\n}\n#product-page-recommendations .outer-container + .outer-container {\n    padding-top: 0;\n}\n#product-page-recommendations .outer-container + .outer-container:before {\n      content: '';\n      display: block;\n      margin: 0 auto;\n      width: 100%;\n      max-width: 1025px;\n      border-top: 1px solid #d2d2d2;\n}\n#product-page-recommendations + .add-this > .container {\n  border-top: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 1305:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n.recommendations-container .flickity-button {\n  display: none;\n  background: transparent;\n}\n.recommendations-container .flickity-button .flickity-button-icon {\n    fill: #d2d2d2;\n}\n.recommendations-container .flickity-button:hover {\n    background: transparent;\n}\n.recommendations-container .flickity-button:hover .flickity-button-icon {\n      fill: #000;\n}\n.recommendations-container .flickity-button:disabled {\n    display: none;\n}\n.recommendations-container .flickity-button.flickity-prev-next-button {\n    top: 30%;\n}\n@media (min-width: 737px) {\n.recommendations-container .flickity-button {\n      display: block;\n}\n}\n.recommendations-container .flickity-page-dots {\n  position: static;\n}\n.recommendations-container .flickity-page-dots .dot {\n    width: 12px;\n    height: 12px;\n    margin: 0 2px;\n    opacity: 1;\n    border: 1px solid #d2d2d2;\n    background: transparent;\n}\n.recommendations-container .flickity-page-dots .dot.is-selected {\n      background: #d2d2d2;\n}\n", ""]);

// exports


/***/ }),

/***/ 1306:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n.outer-container[data-v-6928101d] {\n  min-height: 280px;\n  margin-bottom: 20px;\n  padding: 20px 15px;\n  border-top: 1px solid #d2d2d2;\n  border-bottom: 1px solid #d2d2d2;\n}\n@media (min-width: 1280px) {\n.outer-container[data-v-6928101d] {\n      min-height: 296px;\n}\n}\n.title[data-v-6928101d] {\n  margin: 20px 0;\n  text-align: center;\n}\n.recommendations-container[data-v-6928101d] {\n  width: 100%;\n  max-width: 1025px;\n  height: 216px;\n  margin-right: auto;\n  margin-bottom: 16px;\n  margin-left: auto;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.recommendations-container[data-v-6928101d]:after {\n    display: none;\n    content: 'flickity';\n}\n@media (min-width: 737px) {\n.recommendations-container[data-v-6928101d] {\n      padding: 0 45px;\n}\n}\n@media (min-width: 1025px) {\n.recommendations-container[data-v-6928101d] {\n      height: 235px;\n      -webkit-user-select: auto;\n         -moz-user-select: auto;\n          -ms-user-select: auto;\n              user-select: auto;\n}\n}\n.recommendation[data-v-6928101d] {\n  position: relative;\n  display: inline-block;\n  width: 120px;\n  margin: 0 6px;\n  text-decoration: none;\n  color: #000;\n}\n.recommendation[data-v-6928101d]:hover {\n    text-decoration: none;\n    color: #000;\n}\n@media (min-width: 1024px) {\n.recommendation[data-v-6928101d] {\n      -ms-flex-preferred-size: 145px;\n          flex-basis: 145px;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n}\n}\n@media (min-width: 1025px) {\n.recommendation[data-v-6928101d] {\n      width: calc((100% / 6) - 12px);\n}\n.recommendation:hover .v-btn-recommendation-qv[data-v-6928101d] {\n        display: block;\n}\n}\n.recommendation.placeholder[data-v-6928101d] {\n    -ms-flex-preferred-size: 4px;\n        flex-basis: 4px;\n    width: 4px;\n}\n.image[data-v-6928101d] {\n  width: 120px;\n  height: 120px;\n}\n@media (min-width: 1025px) {\n.image[data-v-6928101d] {\n      width: 145px;\n      max-width: 100%;\n      height: auto;\n}\n}\n.product-name[data-v-6928101d] {\n  overflow: hidden;\n  height: 32px;\n  text-overflow: ellipsis;\n  -webkit-line-clamp: 2;\n}\n.product-name[data-v-6928101d], .price[data-v-6928101d] {\n  font-size: 13px;\n  margin-bottom: 0;\n}\n.price[data-v-6928101d] {\n  font-weight: bold;\n  margin-top: 8px;\n}\n.v-btn-recommendation-qv[data-v-6928101d] {\n  position: absolute;\n  top: 73px;\n  left: 50%;\n  display: none;\n  transform: translate(-50%, -50%);\n  white-space: nowrap;\n}\n.special-price-container[data-v-6928101d] {\n  margin-top: 8px;\n}\n.special-price-container .special-price[data-v-6928101d], .special-price-container .regular-price[data-v-6928101d] {\n    font-size: 13px;\n    font-weight: bold;\n    margin-bottom: 1px;\n}\n.special-price-container .regular-price[data-v-6928101d] {\n    font-weight: normal;\n    text-decoration: line-through;\n    color: #a2a2a2;\n}\n.price-incl-tax[data-v-6928101d] {\n  font-size: 11px;\n  margin-top: 2px;\n  color: #666;\n}\n.price-incl-tax strong[data-v-6928101d] {\n    font-size: 12px;\n}\n#product-page-recommendations .outer-container[data-v-6928101d] {\n  margin-bottom: 0;\n  border: none;\n  background-color: #f1f1f1;\n}\n@media (min-width: 1280px) {\n#product-page-recommendations .outer-container[data-v-6928101d] {\n      position: relative;\n      left: calc((100vw - 1280px) / -2);\n      width: 100vw;\n}\n.col1-wide-layout #product-page-recommendations .outer-container[data-v-6928101d] {\n        left: 0;\n}\n}\n", ""]);

// exports


/***/ }),

/***/ 132:
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

var ReflektionRecommendation = function () {
  /**
   * @param  {(Object)} [settings] Object of options
   * @param  {Function} [resolve]
   * @param  {Function} [reject]
   * @return {void}
   */
  function ReflektionRecommendation() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var resolve = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    var reject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    _classCallCheck(this, ReflektionRecommendation);

    var defaultSettings = {
      order: null,
      write: true,
      storeId: this._getStoreId()
    };

    this.settings = _extends({}, defaultSettings, settings);
    this._resolve = resolve;
    this._reject = reject;

    if (window.store.state.base.fpc.ready && window.rfk && typeof window.rfk.uid === 'function') {
      this._initializeRecommendation();
    } else if (this.settings.widgetId === 'rfkid_8' || this.settings.isCartPage) {
      window.addEventListener('load', this._initializeRecommendation.bind(this));
    } else {
      window.eventHub.$on('fpc:response', this._initializeRecommendation.bind(this));
    }
  }

  /**
   * Return Magento store id
   * @return {integer|null}
   */


  _createClass(ReflektionRecommendation, [{
    key: '_initializeRecommendation',
    value: function _initializeRecommendation() {
      this._apiUrl = window.store.state.rfk.api_url;
      this._errors = [];

      if (this._checkSettings()) {
        this._http();
      } else {
        this._errors.push('Invalid settings');
        this._reject(this);
      }
    }

    /**
     * Return Magento store id
     * @return {integer|null}
     */

  }, {
    key: '_getStoreId',
    value: function _getStoreId() {
      if (Object.prototype.hasOwnProperty.call(window.globalStore, 'magento')) {
        return window.globalStore.magento.store.id;
      }

      return null;
    }

    /**
     * Validate settings for reflektion recommendations
     * @private
     * @return {bool}
     */

  }, {
    key: '_checkSettings',
    value: function _checkSettings() {
      var _this = this;

      var errorMessage = null;
      if (!this.settings) {
        errorMessage = 'No settings sent';
      } else if (!this.settings.storeId) {
        errorMessage = 'No store id';
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

      if (this.settings.order && Object.keys(this.settings.order).indexOf('purchasedProductIds') !== -1) {
        this.settings.order.purchasedProductIds = this.settings.order.purchasedProductIds.map(function (sku) {
          return _this.settings.storeId + '_' + sku;
        });
      }

      return true;
    }

    /**
     * Create payload for requesting Reflektion recommendations REFLEKTION_WIDGET_IDS
     * @private
     * @return {object}
     */

  }, {
    key: '_getPayload',
    value: function _getPayload() {
      var payload = {
        context: {
          page: {
            uri: this.settings.url,
            sku: this.settings.sku
          },
          user: {
            uuid: window.rfk.uid(),
            groups: this.settings.rogueIdData || []
          }
        },
        widget: {
          rfkid: this.settings.widgetId
        },
        n_item: 20,
        content: {
          product: {
            field: {
              value: ['url', 'sku', 'image_url', 'entity_id', 'price', 'final_price', 'name', 'category_names', 'rogue_promo_price', 'special_price', 'promoPrice', 'specialPrice', 'minimal_price', 'is_salable', 'rogue_rfk_custom_data']
            }
          }
        },
        sort: {
          value: [{
            type: 'featured',
            order: 'asc'
          }]
        }
      };

      if (this.settings.order) {
        payload.order = this.settings.order;
      }

      if (window.store.state.customer && window.store.state.customer.logged_in && window.store.state.customer.id) {
        payload.thirdPartyId = window.store.state.customer.id;
      }

      return payload;
    }

    /**
     * Request the endpoint with VueResource
     * @private
     * @return {void}
     */

  }, {
    key: '_http',
    value: function _http() {
      if (this._apiUrl && this._apiUrl !== null && this._apiUrl !== 'undefined') {
        _vue2.default.http.get('' + this._apiUrl, {
          params: {
            data: JSON.stringify(this._getPayload())
          },
          headers: {
            Authorization: 'Bearer ' + window.store.state.rfk.access_token
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

  return ReflektionRecommendation;
}();

exports.default = {
  /**
   * Create Reflektion Recommendation Instance
   * @param  {(Object)} settings Settings object
   * @param  {string} settings.mbox
   * @param  {string} settings.mboxParameters
   * @return {Promise}
   */
  get: function get(settings) {
    return new Promise(function (resolve, reject) {
      new ReflektionRecommendation(settings, resolve, reject);
    });
  }
};

/***/ }),

/***/ 1426:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.showRecommendations) ? _c('div', {
    staticClass: "outer-container",
    class: _vm.containerClass
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.__(_vm.title)))]), (_vm.recommendationType === 'reflektion' && _vm.reflektionFieldsAreNotUpdated) ? _c('div', {
    staticClass: "recommendations-container",
    class: _vm.flickityContainerClass
  }, _vm._l((_vm.recommendations), function(recommendation, i) {
    return _c('a', {
      staticClass: "recommendation ga-recommendation",
      attrs: {
        "href": _vm.$getUrl(recommendation.url),
        "data-id": recommendation.entity_id
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.productClick(recommendation, i, true)
        }
      }
    }, [(_vm.lazyLoadScrollElement && !_vm.imagesLazyLoaded) ? _c('img', {
      directives: [{
        name: "lazy-load",
        rawName: "v-lazy-load:-200",
        value: (recommendation.image_url),
        expression: "recommendation.image_url",
        arg: "-200"
      }],
      staticClass: "image ga-recommendation-image",
      attrs: {
        "data-on-scroll-element": _vm.lazyLoadScrollElement,
        "alt": recommendation.name
      }
    }) : _c('img', {
      staticClass: "image ga-recommendation-image",
      attrs: {
        "src": recommendation.image_url,
        "alt": recommendation.name
      }
    }), _c('p', {
      staticClass: "product-name ga-recommendation-product-name",
      domProps: {
        "innerHTML": _vm._s(recommendation.name)
      }
    }), (recommendation.special_price || recommendation.rogue_promo_price) ? _c('div', {
      staticClass: "special-price-container"
    }, [_c('p', {
      staticClass: "special-price ga-recommendation-special-price"
    }, [_vm._v(_vm._s(_vm._f("formatPrice")(recommendation.rogue_promo_price || recommendation.special_price)))]), _c('p', {
      staticClass: "regular-price ga-recommendation-regular-price"
    }, [_vm._v(_vm._s(_vm._f("formatPrice")(recommendation.price)))])]) : _c('div', [_c('p', {
      staticClass: "price ga-recommendation-price"
    }, [_vm._v(_vm._s(_vm._f("formatPrice")(recommendation.price)))]), (_vm.euroTax) ? _c('p', {
      staticClass: "price-incl-tax ga-recommendation-price-incl-tax",
      domProps: {
        "innerHTML": _vm._s(_vm.FormatIncludingTaxPrice(_vm.GetPriceInclEuroTax(recommendation.price)))
      }
    }) : _vm._e()]), (!_vm.disableQuickview) ? _c('button', {
      staticClass: "v-btn v-btn-red v-btn-recommendation-qv ga-recommendation-qv",
      attrs: {
        "rel": recommendation.entity_id
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          _vm.openQuickview(recommendation, i)
        }
      }
    }, [_vm._v(_vm._s(_vm.__('Quick View')))]) : _vm._e()])
  })) : _c('div', {
    staticClass: "recommendations-container",
    class: _vm.flickityContainerClass
  }, [_c('span', {
    staticClass: "recommendation placeholder"
  }), _vm._l((_vm.recommendations), function(recommendation, i) {
    return _c('a', {
      staticClass: "recommendation ga-recommendation",
      attrs: {
        "href": recommendation.href,
        "data-id": recommendation.id
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.productClick(recommendation, i, true)
        }
      }
    }, [(_vm.lazyLoadScrollElement) ? _c('img', {
      directives: [{
        name: "lazy-load",
        rawName: "v-lazy-load:-200",
        value: (recommendation.image),
        expression: "recommendation.image",
        arg: "-200"
      }],
      staticClass: "image ga-recommendation-image",
      attrs: {
        "data-on-scroll-element": _vm.lazyLoadScrollElement,
        "alt": recommendation.name
      }
    }) : _c('img', {
      staticClass: "image ga-recommendation-image",
      attrs: {
        "src": recommendation.image,
        "alt": recommendation.name
      }
    }), _c('p', {
      staticClass: "product-name ga-recommendation-product-name",
      domProps: {
        "innerHTML": _vm._s(recommendation.name)
      }
    }), (recommendation.specialPrice || recommendation.promoPrice) ? _c('div', {
      staticClass: "special-price-container"
    }, [_c('p', {
      staticClass: "special-price ga-recommendation-special-price"
    }, [_vm._v(_vm._s(_vm._f("formatPrice")(recommendation.promoPrice || recommendation.specialPrice)))]), _c('p', {
      staticClass: "regular-price ga-recommendation-regular-price"
    }, [_vm._v(_vm._s(_vm._f("formatPrice")(recommendation.price)))])]) : _c('div', [_c('p', {
      staticClass: "price ga-recommendation-price"
    }, [_vm._v(_vm._s(_vm._f("FormatStartingAtPriceFilter")(_vm._f("formatPrice")(recommendation.price), recommendation)))]), (_vm.euroTax) ? _c('p', {
      staticClass: "price-incl-tax ga-recommendation-price-incl-tax",
      domProps: {
        "innerHTML": _vm._s(_vm.FormatIncludingTaxPrice(_vm.GetPriceInclEuroTax(recommendation.price)))
      }
    }) : _vm._e()]), (!_vm.disableQuickview) ? _c('button', {
      staticClass: "v-btn v-btn-red v-btn-recommendation-qv ga-recommendation-qv",
      attrs: {
        "rel": recommendation.parentMagentoID
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          _vm.openQuickview(recommendation, i)
        }
      }
    }, [_vm._v(_vm._s(_vm.__('Quick View')))]) : _vm._e()])
  }), _c('span', {
    staticClass: "recommendation placeholder"
  })], 2)]) : _vm._e()
},staticRenderFns: []}

/***/ }),

/***/ 1497:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1304);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("b05ac0b0", content, true, {});

/***/ }),

/***/ 1498:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1305);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("e681078a", content, true, {});

/***/ }),

/***/ 1499:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1306);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("fa87e4e6", content, true, {});

/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _flickity = __webpack_require__(92);

var _flickity2 = _interopRequireDefault(_flickity);

var _recommendations = __webpack_require__(132);

var _recommendations2 = _interopRequireDefault(_recommendations);

var _formatStartingAtPrice = __webpack_require__(93);

var _formatStartingAtPrice2 = _interopRequireDefault(_formatStartingAtPrice);

var _formatIncludingTaxPrice = __webpack_require__(133);

var _formatIncludingTaxPrice2 = _interopRequireDefault(_formatIncludingTaxPrice);

var _getPriceInclEuroTax = __webpack_require__(94);

var _getPriceInclEuroTax2 = _interopRequireDefault(_getPriceInclEuroTax);

var _Product = __webpack_require__(52);

var _Product2 = _interopRequireDefault(_Product);

var _helpers = __webpack_require__(29);

var rogueRfk = _interopRequireWildcard(_helpers);

var _gtm = __webpack_require__(95);

var _helpers2 = __webpack_require__(6);

var _vuex = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_FLICKITY_OPTIONS = {
  prevNextButtons: true,
  pageDots: true,
  watchCSS: true,
  contain: true,
  setGallerySize: false,
  percentPosition: false,
  groupCells: true,
  adaptiveHeight: true,
  cellAlign: 'left',
  cellSelector: '.recommendation',
  containerSelector: '.recommendations-container'
};

var REFLEKTION_WIDGET_IDS = {
  similar: 'rfkid_31',
  forYou: 'rfkid_32',
  alsoLike: 'rfkid_8',
  alsoBought: 'rfkid_4'
};

var dataLayerProduct = new _Product2.default();

exports.default = {
  store: store,

  props: ['settings', 'settingsString'],

  data: function data() {
    return {
      recommendations: [],
      quickview: null,
      storeId: null,
      euroTax: window.globalStore.magento.store.websiteId === '4' ? 0.21 : 0,
      mouseDownTime: null,
      flickity: null,
      flickityOptions: {},
      title: null,
      quickviewButtonClass: '.v-btn-recommendation-qv',
      internalPromotionList: 'Internal Promotion List Not Set',
      internalPromotionListSuffix: '',
      minRecommendations: 4,
      maxRecommendations: 18,
      skus: null,
      containerClass: '',
      lazyLoadScrollElement: window,
      imagesLazyLoaded: false,
      disableQuickview: false,
      reflektionRecommendations: true,
      recommendationType: null,
      widgetType: null,
      reflektionOnly: false,
      destroyed: true,
      promotionViewSent: false,
      throttledAnalyticsSend: null
    };
  },


  computed: _extends({
    /**
     * return if recommendation widget should be shown
     * @return {[type]}
     */
    showRecommendations: function showRecommendations() {
      if (this.destroyed) {
        return false;
      }

      if (!this.isReflektionRecommendations && this.reflektionOnly) {
        return false;
      }

      return true;
    },
    flickityContainerClass: function flickityContainerClass() {
      var addedTitle = this.title ? this.title.replace(/ /g, '-').toLowerCase() : 'recommendations';

      if (this.flickityOptions.containerSelector) {
        if (this.flickityOptions.containerSelector.indexOf(addedTitle) !== -1) {
          return this.flickityOptions.containerSelector.replace(/\./g, '');
        }

        return (this.flickityOptions.containerSelector + '-' + addedTitle).replace(/\./g, '');
      }

      return '';
    }
  }, (0, _vuex.mapGetters)(['getShowSideCart']), (0, _vuex.mapState)({
    rogueIdData: function rogueIdData(state) {
      return state.rfk.rogueIdData;
    },
    isCartPage: function isCartPage(state) {
      return state.base.isCartPage;
    },
    baseUrl: function baseUrl(state) {
      return state.base.magento.baseUrl;
    }
  }), {
    isReflektionRecommendations: function isReflektionRecommendations() {
      return this.recommendationType === 'reflektion';
    },
    reflektionFieldsAreNotUpdated: function reflektionFieldsAreNotUpdated() {
      if (this.recommendations.length) {
        return Object.prototype.hasOwnProperty.call(this.recommendations[0], 'entity_id');
      }

      return false;
    }
  }),

  watch: {
    getShowSideCart: function getShowSideCart(val) {
      if (this.isReflektionRecommendations && val && this.widgetType === 'alsoBought') {
        this.sendAnalyticsPromotionViews();
      }
    }
  },

  beforeMount: function beforeMount() {
    var _this = this;

    if (window.dontDoRecommendations === true) {
      this.destroy();
    } else if ('RogueOtherCustomersAlsoViewed' in window.globalStore && window.globalStore.RogueOtherCustomersAlsoViewed.length > 0 && study.assignments()['magento-recommendations'] === 'magento') {
      this.initRecs('magento');
    } else if (window.rfk && Object.hasOwnProperty.call(window.rfk, 'uid')) {
      this.initRecs('reflektion');
    } else {
      window.addEventListener('load', function () {
        if (window.rfk && Object.hasOwnProperty.call(window.rfk, 'uid')) {
          _this.initRecs('reflektion');
        }
      });
    }
  },


  filters: {
    FormatStartingAtPriceFilter: _formatStartingAtPrice2.default
  },

  methods: {
    GetPriceInclEuroTax: _getPriceInclEuroTax2.default,
    FormatIncludingTaxPrice: _formatIncludingTaxPrice2.default,

    /**
     * Update the data object
     * @return {void}
     */
    setData: function setData() {
      var _this2 = this;

      this.$set(this, 'flickityOptions', _extends({}, DEFAULT_FLICKITY_OPTIONS, this.flickityOptions));
      if (this.settingsString && typeof this.settingsString === 'string') {
        var newSettings = JSON.parse(this.settingsString);
        Object.keys(newSettings).forEach(function (key) {
          return _this2.$set(_this2, key, newSettings[key]);
        });
      }
      if (this.settings && _typeof(this.settings) === 'object') {
        Object.keys(this.settings).forEach(function (key) {
          return _this2.$set(_this2, key, _this2.settings[key]);
        });
      }
      if (this.widgetType) {
        if (Object.hasOwnProperty.call(REFLEKTION_WIDGET_IDS, this.widgetType)) {
          this.widgetId = REFLEKTION_WIDGET_IDS[this.widgetType];
        }

        if (this.widgetType === 'alsoBought') {
          this.url = this.baseUrl + '/cart';
        } else if (this.widgetType === 'alsoLike') {
          this.url = this.baseUrl + '/shippingtracker';
        } else {
          this.url = '' + this.baseUrl + window.location.pathname;
        }

        if (this.recommendationType === 'magento') {
          this.getRecommendationsFromMagento();
          this.useMagento = true;
        } else if (this.widgetType === 'alsoLike') {
          this.updateRssRecs();
        } else {
          this.getRecommendationsFromReflektion();
        }
      }
    },


    /**
     * Init Recommendations
     * @return {void}
     */
    initRecs: function initRecs(type) {
      this.destroyed = false;
      this.recommendationType = type;
      this.setData();
      this.internalPromotionListSuffix = ' [' + type + ']';
    },


    /**
    * Toggle Magento/Reflektion Recommendations
    * @return {void}
    */
    recommendationToggle: function recommendationToggle() {
      var _this3 = this;

      this.recommendations = [];

      this.$nextTick(function () {
        if (_this3.useMagento) {
          _this3.getRecommendationsFromReflektion();
          _this3.useMagento = false;
        } else {
          _this3.getRecommendationsFromMagento();
          _this3.useMagento = true;
        }
      });
    },


    /**
     * Recommendations from Magento.
     * @return {void}
     */
    getRecommendationsFromMagento: function getRecommendationsFromMagento() {
      var _this4 = this;

      var mappedMagentoRecommendations = window.globalStore.RogueOtherCustomersAlsoViewed.map(function (product) {
        return {
          href: product.url,
          id: product.entity_id,
          image: product.thumbnail,
          name: product.name,
          price: product.price,
          productType: product.type_id,
          sku: product.sku,
          specialPrice: product.promo_price || product.special_price
        };
      });

      this.recommendations = mappedMagentoRecommendations;
      this.sendAnalyticsPromotionViews();

      this.$nextTick(function () {
        _this4.setUpCarousel();
        _this4.initQuickview();
      });
    },


    /**
     * XHR recommendations from Reflektion.
     * @return {void}
     */
    getRecommendationsFromReflektion: function getRecommendationsFromReflektion() {
      var promises = [];

      promises.push(_recommendations2.default.get({
        sku: this.skus,
        url: this.url,
        widgetId: this.widgetId,
        isCartPage: this.isCartPage,
        rogueIdData: this.rogueIdData
      }));

      Promise.all(promises).then(this.getRecommendationsFromReflektionSuccess.bind(this)).catch(this.destroy.bind(this));
    },


    /**
     * On successful XHR request in getRecommendationsFromReflektion
     * @param  {object} response
     * @return {void}
     */
    getRecommendationsFromReflektionSuccess: function getRecommendationsFromReflektionSuccess(responses) {
      var recs = [];
      var overflowRecs = [];
      var portion = Math.ceil(this.maxRecommendations / responses.length);
      responses.forEach(function (response) {
        var responseContent = response.httpResponse.body.content.product;

        if (responseContent && responseContent.value) {
          recs = recs.concat(responseContent.value.splice(0, portion));
          overflowRecs = overflowRecs.concat(responseContent.value);
        }
      });

      if (recs.length) {
        this.processRecommendations(recs.concat(overflowRecs));
      } else {
        this.destroy();
      }
    },


    /**
     * [processRecommendations description]
     * @param  {Array<Object>} recommendations
     * @return {void}
     */
    processRecommendations: function processRecommendations(recommendations) {
      var _this5 = this;

      this.recommendations = this.filterRecommendations(recommendations);
      if (this.recommendations.length >= this.minRecommendations) {
        if (this.isReflektionRecommendations) {
          if (this.widgetType === 'similar' || this.widgetType === 'forYou' || this.widgetType === 'alsoLike') {
            if ((0, _helpers2.isInViewport)(this.$el, 0, window)) {
              this.sendAnalyticsPromotionViews();
            } else {
              this.throttledAnalyticsSend = (0, _helpers2.throttle)(this.sendAnalyticsPromotionViews.bind(this), 300);
              window.addEventListener('scroll', this.throttledAnalyticsSend);
            }
          }
        } else {
          this.sendAnalyticsPromotionViews();
        }

        this.$nextTick(function () {
          _this5.setUpCarousel();
          _this5.initQuickview();
        });
      } else {
        this.destroy();
      }
    },


    /**
     * Check if the recommendation is for the customer's store
     * @param  {Object}  rec
     * @return {Boolean}
     */
    isCorrectStore: function isCorrectStore(rec) {
      return rec.id.indexOf(this.storeId + '_') === 0;
    },


    /**
     * remove recommendations with the same parent SKU and products that are out of stock
     * @param  {Array<Object>} recommendations
     * @return {Array<Object>}
     */
    filterRecommendations: function filterRecommendations(recs) {
      var _this6 = this;

      var parentSkus = [];
      var recommendations = [];
      recs.forEach(function (rec) {
        if (recommendations.length < _this6.maxRecommendations && rec.name.length) {
          if (_this6.isReflektionRecommendations) {
            if (rec.is_salable > 0) {
              recommendations.push(rec);
            }
          } else if (!(parentSkus.indexOf(rec.parentSku) !== -1) && _this6.isCorrectStore(rec)) {
            parentSkus.push(rec.parentSku);
            recommendations.push(rec);
          }
        }
      });

      return recommendations;
    },


    /**
     * Set up the flickity carousel
     * @return {void}
     */
    setUpCarousel: function setUpCarousel() {
      var _this7 = this;

      if (!this.flickityOptions.disable && this.flickityContainerClass.length) {
        if (this.flickity) {
          this.flickity.destroy();
        }
        this.flickityOptions.containerSelector = '.' + this.flickityContainerClass;
        this.$set(this, 'flickity', new _flickity2.default(this.flickityOptions.containerSelector, this.flickityOptions));
        this.$nextTick(function () {
          _this7.flickity.resize();
          _this7.flickity.once('change', _this7.setLazyImagesLoaded);
        });
      }
    },


    /**
     * Set value to load all carousel images on interaction with the carousel
     */
    setLazyImagesLoaded: function setLazyImagesLoaded() {
      this.imagesLazyLoaded = true;
    },


    /**
     * Send internal promotion view and product view to analytics
     * @return {void}
     */
    sendAnalyticsPromotionViews: function sendAnalyticsPromotionViews() {
      if (this.promotionViewSent) {
        window.removeEventListener('scroll', this.throttledAnalyticsSend);
      }

      if (!this.isReflektionRecommendations || !this.promotionViewSent && this.widgetType !== 'alsoBought' && (0, _helpers2.isInViewport)(this.$el, 0, window) || !this.promotionViewSent && this.widgetType === 'alsoBought') {
        this.imagesLazyLoaded = true;
        this.promotionViewSent = true;

        // @TODO migrate to dataLayerProduct class
        _gtm.ecommerce.promotionView('' + this.internalPromotionList + this.internalPromotionListSuffix);

        if (this.isReflektionRecommendations) {
          rogueRfk.rfkWidgetAnalyticsPush('appear', this.widgetId);
        }

        dataLayerProduct.pushProductImpression(this.recommendations.map(function (rec) {
          return rec.parentMagentoID || rec.entity_id;
        }), '' + this.internalPromotionList + this.internalPromotionListSuffix);
      }
    },


    /**
     * handle clicks on a recommendation
     * @param  {Object}  rec
     * @param  {integer} i
     * @param  {bool}    goToProductPage
     * @return {void}
     */
    productClick: function productClick(rec, i, goToProductPage) {
      // @TODO migrate to dataLayerProduct class
      _gtm.ecommerce.promotionClick(this.internalPromotionList);
      dataLayerProduct.pushProductClick(rec.parentMagentoID || rec.entity_id, this.internalPromotionList);

      if (this.isReflektionRecommendations) {
        rogueRfk.rfkWidgetAnalyticsPush('click', this.widgetId, {
          sku: rec.sku
        }, i);
      }

      if (goToProductPage) {
        var productLocation = this.$getUrl(rec.url);
        if (!this.isReflektionRecommendations) {
          productLocation = rec.href;
        }

        window.location.href = productLocation;
      }
    },


    /**
     * Set up quickview
     * @TODO abstract this
     * Set "global" this.quickview.id = sku and it automatically opens
     * @return {void}
     */
    initQuickview: function initQuickview() {
      if (!this.disableQuickview) {
        this.quickview = new QuickView(this.quickviewButtonClass, this.$getUrl('/rquickview/index/view/')); // eslint-disable-line no-undef

        this.$store.dispatch('enableButtons');
        if (!window.quickView) {
          window.quickView = this.quickview;
        }
      }
    },


    /**
     * Open quickview window
     * @TODO Abstract this with initQuickview
     * @param  {Object} rec
     * @return {void}
     */
    openQuickview: function openQuickview(rec, i) {
      var openQuickviewId = rec.entity_id;
      if (!this.isReflektionRecommendations) {
        openQuickviewId = rec.parentMagentoID;
      }

      this.productClick(rec, i);
      window.quickView.open(openQuickviewId);
    },


    /**
    -     * On XHR error, or any other error: destroy
    -     * @return {void}
    -     */
    destroy: function destroy() {
      this.reflektionRecommendations = false;
      this.destroyed = true;
    }
  },

  beforeDestroy: function beforeDestroy() {
    if (this.flickity) {
      this.flickity.off('scroll', this.carouselLazyImages);
      this.flickity.off('dragMove', this.carouselLazyImages);
    }
  }
};

/***/ }),

/***/ 977:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1499)
__webpack_require__(1498)
__webpack_require__(1497)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(1252),
  /* template */
  __webpack_require__(1426),
  /* scopeId */
  "data-v-6928101d",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ })

});
//# sourceMappingURL=14.chunk.4d9ac38c9a45d4e28258.js.map