webpackJsonp([3],{

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instantCart = __webpack_require__(21);

var _instantCart2 = _interopRequireDefault(_instantCart);

var _helpers = __webpack_require__(131);

var _formatPrice = __webpack_require__(42);

var _formatPrice2 = _interopRequireDefault(_formatPrice);

var _helpers2 = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADD_TO_CART_MESSAGE_LABEL = 'add-to-cart-messages';

exports.default = {
  /**
   * Disable all add to cart and rapid checkout buttons.
   * This is particularly useful for IAB
   * @param  {Boolean} disable
   * @return {void}
   */
  disableButtons: function disableButtons() {
    var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    document.querySelectorAll('.add-to-cart button').forEach(function (btn) {
      btn.disabled = disable;
    });
  },


  /**
   * Adds page animation for the app when Instant Cart is enabled
   * @param  {Object} ctx product page or quick view object from ../context.js
   * @param  {Boolean} isInProgress
   * @return {void}
   */
  instantCartPageAnimation: function instantCartPageAnimation(ctx) {
    var isInProgress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var body = document.body || document.getElementsByTagName('body')[0];
    var btn = ctx.target;

    if (btn === undefined) {
      return;
    }

    if (isInProgress) {
      // Set the progress bar animation duration
      if (ctx.instantCartTimeout && ctx.instantCartExtendTimeout) {
        btn.style.transitionDuration = ctx.instantCartTimeout + ctx.instantCartExtendTimeout + 'ms';
      } else {
        btn.style.transitionDuration = '1.5s';
      }

      // Finally animate the whole thing
      if (body && body.classList) {
        body.classList.add('instant-cart-in-progress');
        btn.classList.add('v-btn-loading-bar');
        setTimeout(function () {
          return btn.classList.add('v-btn-loading-bar-animate');
        }, 100);
      }
    } else {
      var _btn$classList;

      if (body && body.classList) {
        body.classList.remove('instant-cart-in-progress');
      }

      btn.style.transitionDuration = '';
      var cls = ['v-btn-loading-bar', 'v-btn-loading-bar-animate'];
      (_btn$classList = btn.classList).remove.apply(_btn$classList, cls);
    }
  },


  /**
   * On click call from "Add to Cart" in purchase area
   * @param  {Object} ctx product page or quick view object from ../context.js
   * @param  {Object} e Event
   * @return {void}
   */
  addToCartClick: function addToCartClick(ctx, e) {
    var formDataPassedIn = Boolean(Object.keys(ctx.formData).length > 0 && ctx.isVueForm);

    if (!formDataPassedIn) {
      ctx.target = e.target;
      this.$store.commit('setAddToCartButton', ctx.target);
      ctx.isToolboardProduct = this.setIsToolboardProduct(ctx);
    }

    ctx.isIAB = this.$store.state.base.isIAB;
    ctx.cb = this.addToCartCallback.bind(this, ctx);
    ctx.isInstantCartEnabled = _instantCart2.default.isEnabled();
    ctx.instantCartTimeout = this.$store.state.cart.instantCartTimeout || false;
    ctx.instantCartExtendTimeout = this.$store.state.cart.instantCartExtendTimeout || false;

    // Reset values
    if (ctx.isInstantCartEnabled) {
      this.$store.commit('setInstantCartActionStartedAt', Date.now());
      this.$store.commit('setInstantCartActionEndedAt', null);
    }

    this.handleEGiftCard();

    if (!formDataPassedIn) {
      this.setFormData(ctx);
      ctx.productInfo = this.getProductInfo(ctx);
    }

    this.showQtyError(ctx);
    this.$store.dispatch('removeMessage', { label: ADD_TO_CART_MESSAGE_LABEL });

    var isValid = formDataPassedIn ? true : this.isFormValid(ctx);

    if (ctx.formHasQty && isValid) {
      if (ctx.isRapidCheckout && !_helpers.determineEligibility.call(this)) {
        return;
      }

      if (ctx.isQuickview) {
        window.quickView.closeQuickview();
      }

      if (ctx.isIAB || ctx.isInstantCartEnabled) {
        this.disableButtons(ctx.isIAB);
      }

      if (ctx.isIAB && ctx.isInstantCartEnabled) {
        this.instantCartPageAnimation(ctx, true);
      } else if (!formDataPassedIn && (ctx.isIAB || ctx.isInstantCartEnabled)) {
        ctx.target.classList.add('v-btn-loading');
      }

      this.$store.dispatch(ctx.isRapidCheckout ? 'addToRapidCheckout' : 'addToCart', ctx);
    }
  },


  /**
   * After GQL request is finished, this function is called
   * @return {void}
   */
  addToCartCallback: function addToCartCallback(ctx, response) {
    var result = response.data.addToCart.result;
    var success = result && (!ctx.isRapidCheckout && result.messages.success.length > 0 || ctx.isRapidCheckout && result.success);

    if (success) {
      this.setQtysToZero();
    }

    if (ctx.isIAB) {
      this.disableButtons(false);
      if (ctx.isRapidCheckout) {
        if (!(window.globalStore.mobileApp && window.globalStore.mobileApp.isIframeSupported)) {
          window.location.href = this.$store.state.base.magento.urls.cart.concat('/__rapidPurchase');
        }

        if (!success) {
          this._showMessage(response, success);
        } else {
          window.mobileAppMessenger.postAppMessage(window.mobileAppMessenger.categories.GO_TO_CHECKOUT, {
            quote_id: response.data.addToCart.quote.quote.entity_id
          });
        }
      } else {
        if (!(ctx.isIAB && ctx.isInstantCartEnabled) || !success) {
          this._showMessage(response, success);
        }

        if (!(ctx.isIAB && ctx.isInstantCartEnabled) || success) {
          window.mobileAppMessenger.postAppMessage(window.mobileAppMessenger.categories.ADD_TO_CART, {
            products: ctx.formData && ctx.formData.product && [ctx.formData.product]
          });
        }
      }
    } else if (ctx.isRapidCheckout) {
      window.location.href = (0, _helpers2.getUrl)('one-step-checkout').concat('?', this.$store.state.rapidCheckout.param, '=', response.data.addToCart.quote.quote.entity_id);
    }

    // If we get the callback response before the timeout
    if (ctx.isInstantCartEnabled) {
      this.$store.commit('setSideCartTimeoutHandler', null);
      this.$store.dispatch('clearSideCartTimeoutHandler');
      this.$store.commit('setInstantCartActionEndedAt', Date.now());
    }

    if (ctx.isIAB && ctx.isInstantCartEnabled) {
      this.instantCartPageAnimation(ctx);
    } else if (ctx.target && (ctx.isIAB || ctx.isInstantCartEnabled)) {
      ctx.target.classList.remove('v-btn-loading');
    }
  },


  /**
   * Shows success message
   * @param response
   * @param success
   * @private
   */
  _showMessage: function _showMessage(response, success) {
    if (response.data.addToCart.result.messages) {
      var message = response.data.addToCart.result.messages[success ? 'success' : 'error'][0].message;

      this.$store.dispatch('message', {
        message: message,
        severity: success ? 'message' : 'error',
        position: 'afterend',
        el: document.querySelector('.js-product-page-btn-add-to-cart'),
        label: ADD_TO_CART_MESSAGE_LABEL,
        style: 'margin-bottom: 16px;',
        timer: 10000
      });
    }
  },


  /**
   * Find qty inputs and set them to zero
   * @return {void}
   */
  setQtysToZero: function setQtysToZero() {
    document.querySelectorAll('.product-purchase input.qty').forEach(function (qty) {
      qty.value = '0';
    });
  },


  /**
   * Gift cards are special pages, so they get a special function
   * @return {void}
   */
  handleEGiftCard: function handleEGiftCard() {
    if (typeof window.setRecipientEmail === 'function') {
      window.setRecipientEmail(false);
    }
  },


  /**
   * Loop through the purchase area form and process it
   * @param {Object} ctx
   */
  setFormData: function setFormData(ctx) {
    ctx.formData = {};
    ctx.formHasQty = false;
    if (ctx.formElements) {
      var length = ctx.formElements.length;
      for (var i = 0; i < length; i += 1) {
        var item = ctx.formElements.item(i);
        var name = item.getAttribute('name');
        var value = item.value;
        if (name && value != 0 && !item.disabled) {
          // eslint-disable-line eqeqeq
          this.setFormHasQty(ctx, name, value);
          this.vmSetFormData(ctx, name, value);
        }
      }
    }
  },


  /**
   * @param  {Object} ctx
   * @param  {String} name attribute name, ex: config_attributes[39439][287]
   * @param  {String} value value of name
   */
  setFormHasQty: function setFormHasQty(ctx, name, value) {
    if (!ctx.formHasQty && (name.indexOf('super_group') === 0 || name === 'qty') && value && value != 0 // eslint-disable-line eqeqeq
    ) {
        ctx.formHasQty = true;
      }
  },


  /**
   * If the formData contains super attributess, etc, parse them here
   * @param  {Object} ctx
   * @param  {String} name attribute name, ex: config_attributes[39439][287] => name[superId][superId2]
   * @param  {String} value value of name
   * @return {void}
   */
  vmSetFormData: function vmSetFormData(ctx, name, value) {
    value = encodeURIComponent(value);
    var numMatches = name.match(/\[/g);
    if (numMatches) {
      var s = name.split('[');
      var superId = s[1].replace(']', '');
      name = s[0];
      if (!Object.hasOwnProperty.call(ctx.formData, name)) {
        this.$set(ctx.formData, name, {});
      }
      if (numMatches.length === 2) {
        // name[superId][superId2] = value
        var superId2 = s[2].replace(']', '');
        if (!Object.hasOwnProperty.call(ctx.formData[name], superId)) {
          this.$set(ctx.formData[name], superId, {});
        }
        this.$set(ctx.formData[name][superId], superId2, value);
      } else {
        // name[superId] = value
        this.$set(ctx.formData[name], superId, value);
      }
    } else {
      this.$set(ctx.formData, name, value);
    }
  },


  /**
   * Set the name, image, and sku from html nodes
   * @param {Object} ctx
   */
  getProductInfo: function getProductInfo(ctx) {
    var productInfo = [];
    var addingToCartIds = ctx.formData.super_group ? Object.keys(ctx.formData.super_group) : [ctx.formData.product];
    var qvForm = document.getElementById('qvproduct_addtocart_form');

    addingToCartIds.forEach(function (id) {
      if (id && window.globalStore.product_info && window.globalStore.product_info[id]) {
        productInfo.push({
          name: window.globalStore.product_info[id].name,
          sku: window.globalStore.product_info[id].sku,
          image: window.globalStore.product_info[id].thumbnail,
          price: {
            subtotal: { excluding: (0, _formatPrice2.default)(window.globalStore.product_info[id].price) }
          }
        });
      }
    });

    if (qvForm) {
      productInfo.push({
        name: qvForm.querySelector('.product-name').textContent,
        sku: '',
        image: null,
        price: null
      });
    }

    return productInfo;
  },


  /**
   * @param  {Object}  ctx
   * @return {Boolean}
   */
  isFormValid: function isFormValid(ctx) {
    ctx.form.validator.reset();
    if (this.getProductType(ctx) === 'grouped') {
      return this.isGroupedItemValid();
    }

    return ctx.form.validator.validate();
  },


  /**
   * @param {Object} ctx
   * @return {String|null}
   */
  getFormId: function getFormId(ctx) {
    return ctx.isProductPage ? 'product_addtocart_form' : 'qvproduct_addtocart_form';
  },


  /**
   * @param  {Object} ctx
   * @return {String|null}
   */
  getProductType: function getProductType(ctx) {
    var baseClass = 'product-cart-box';
    var parentSelector = '#'.concat(this.getFormId(ctx));
    var shopContainer = document.getElementsByClassName('col1-wide-layout').length > 0 ? '' : '.product-shop';
    var productCartBox = document.querySelectorAll(parentSelector + ' ' + shopContainer + ' .' + baseClass);
    var classList = productCartBox.length > 0 ? productCartBox[0].classList : [];

    for (var i = 0; i < classList.length; i += 1) {
      if (classList[i] !== baseClass && classList[i].indexOf(baseClass) === 0) {
        return classList[i].replace(baseClass + '-', '');
      }
    }

    return null;
  },


  /**
   * Validate grouped items
   * @return {Boolean}
   */
  isGroupedItemValid: function isGroupedItemValid() {
    var groupedItems = document.querySelectorAll('.product-shop .grouped-item');
    if (groupedItems.length === 0) {
      groupedItems = document.querySelectorAll('.col1-wide-layout .product-view .grouped-item');
    }
    var isValid = true;
    for (var i = 0; i < groupedItems.length; i += 1) {
      if (groupedItems[i].getElementsByClassName('qty')[0].value > 0) {
        var selects = groupedItems[i].querySelectorAll('select, input:not(.qty)');
        for (var j = 0; j < selects.length; j += 1) {
          if (!Validation.validate(selects[j])) {
            // eslint-disable-line no-undef
            isValid = false;
          }
        }
      }
    }

    return isValid;
  },


  /**
   * @param {Object} ctx
   * @return {Boolean}
   */
  setIsToolboardProduct: function setIsToolboardProduct(ctx) {
    var baseClass = 'product-tool-board';
    var formSelector = this.getFormId(ctx);
    var form = document.getElementById(formSelector);
    var formParent = form.parentElement;

    return ctx.isProductPage && formParent.classList.contains(baseClass);
  },


  /**
   * Show the qty error above the Add to Cart button
   * @param  {Object} ctx
   * @return {void}
   */
  showQtyError: function showQtyError(ctx) {
    if (ctx.isToolboardProduct) {
      var button = ctx.target;
      var productId = button.getAttribute('data-product-id');
      var qty = document.getElementById('grouped-product-item-'.concat(productId));
      var element = document.getElementById('cart-in-line-error_'.concat(productId));
      element.style.display = qty && qty.value === 0 ? 'block' : 'none';
    } else {
      var elements = ctx.isProductPage ? document.getElementsByClassName('cart-in-line-error') : document.getElementsByClassName('cart-in-line-error-quickview');
      for (var i = 0; i < elements.length; i += 1) {
        elements[i].style.display = !ctx.formHasQty ? 'block' : 'none';
      }
    }
  }
};

/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.determineEligibility = determineEligibility;
/* eslint-disable import/prefer-default-export */

/**
 * Check where in the process of account eligibility a user is
 * @return {boolean}
 */
function determineEligibility() {
  var notEligibleReasons = this.$store.state.rapidCheckout.notEligibleReasons || '';

  if (notEligibleReasons.indexOf('not_logged_in') > -1) {
    this.$store.dispatch('openLogIn');

    return false;
  } else if (notEligibleReasons.indexOf('no_default_shipping_address') > -1) {
    this.$store.dispatch('openShippingAddress');

    return false;
  } else if (notEligibleReasons.indexOf('no_default_payment_method') > -1) {
    this.$store.dispatch('openPaymentMethod');

    return false;
  }

  return true;
}

/***/ }),

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(462)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(426),
  /* template */
  __webpack_require__(454),
  /* scopeId */
  "data-v-2397e098",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 426:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//

var _addToCart = __webpack_require__(130);

var _addToCart2 = _interopRequireDefault(_addToCart);

var _session = __webpack_require__(431);

var _session2 = _interopRequireDefault(_session);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  store: store,

  props: {
    type: String,
    wrapperClass: {
      type: String,
      default: 'apple-pay-button-wrapper'
    },
    ifConfig: String,
    showDisclaimer: {
      type: String,
      default: ''
    },
    requestId: String,
    forceShow: {
      type: Boolean,
      default: false
    }
  },

  data: function data() {
    return {
      config: window.globalStore.applepay,
      apiVersion: 2,
      isLoading: false,
      quoteId: window.globalStore.rapidCheckout && window.globalStore.rapidCheckout.quote_id || null,
      requestTotal: null,
      kill: false
    };
  },

  /**
   * Verifies everything required to display the ApplePay button.
   * Displays the button if all conditions are met.
   */
  mounted: function mounted() {
    var _this = this;

    if (undefined === this.config) {
      console.warn('ApplePay configuration not found'); // eslint-disable-line

      return;
    }

    if (this.ifConfig && !this.config[this.ifConfig]) {
      return;
    }

    if (!this.type || ['product', 'cart', 'additional-payment'].indexOf(this.type) === -1) {
      this.err('Type is not set or invalid:', this.type);

      return;
    }

    if (this.type === 'product') {
      this.form = new window.VarienForm('product_addtocart_form');
      if (!this.form) {
        this.err('product_addtocart_form not found', true);

        return;
      }
    }

    if (!window.ApplePaySession) {
      this.err('This browser does not support Apple Pay', true);

      return;
    }

    if (!ApplePaySession.supportsVersion(this.apiVersion)) {
      this.err('This browser does not support Apple Pay API version ' + this.ApiVersion, true);

      return;
    }

    if (!ApplePaySession.canMakePayments()) {
      this.err('This device does not support making payments with Apple Pay', true);

      return;
    }

    ApplePaySession.canMakePaymentsWithActiveCard(this.config.merchantId).then(function (result) {
      if (!result) {
        _this.err('This device supports Apple Pay but there are no active cards in Wallet', true);

        return;
      }

      // NOTE: The line below is commented out as it is ran inside runApplePayTest function
      // after A/B is over, we can remove window.runApplePayTest and uncomment it here
      if (_this.forceShow) {
        _this.$store.commit('setShowApplePay', true);
      } else if (typeof window.runApplePayTest === 'function') {
        window.runApplePayTest();
      }
    });
  },


  computed: {
    buttonClass: function buttonClass() {
      if (this.isLoading) {
        return ['v-btn', 'v-btn-loading', 'btn-wide'].join(' ');
      }

      return ['apple-pay-button', 'apple-pay-button-with-text', 'apple-pay-button-black-with-text', 'btn-wide'].join(' ');
    }
  },

  methods: _extends({
    /**
     * ApplePay button click handler.
     * Starts the payment session.
     */
    startPaymentSession: function startPaymentSession() {
      if (this.session) {
        return;
      }

      try {
        if (this.type === 'product' && !this._isProductFormValid()) {
          this.err('Product form validation failed');

          return;
        }

        this.log('Requesting payment details');
        var details = this.getPaymentDetails();
        if (!details) {
          this.err('Getting payment details failed');

          return;
        }

        this.quoteId = details.quoteId || null;

        if (this.type === 'additional-payment') {
          this.requestTotal = details.total;
        }

        this.log('Preparing payment request');
        var paymentRequest = this.getPaymentRequest(details);

        this.beginSession(paymentRequest);
      } catch (e) {
        this.err(e);
        this.displayError('Failed to start Apple Pay session');
      }
    },


    /**
     * Returns payment details from backend.
     * Returns null in case of error.
     * @returns {object|null}
     */
    getPaymentDetails: function getPaymentDetails() {
      var url = null;
      var data = null;

      if (this.type === 'product') {
        url = this.config.urls.initProduct;
        data = new FormData(this.form.form);
      } else if (this.type === 'additional-payment') {
        url = this.config.urls.initPayment;
        data = new FormData();
        data.append('request_id', this.requestId);
      } else {
        url = this.config.urls.initCart;
      }

      /**
       * @type {XMLHttpRequest}
       */
      var request = new XMLHttpRequest();

      /**
       * Due to strict requirement to have ApplePaySession
       * instantiation directly inside user gesture handler (the
       * onclick callback) there is no way to use asynchronous
       * XHR to get payment details.
       */
      var async = false;

      this.isLoading = true;
      request.open('POST', this._prepareUrl(url), async);
      request.send(data);
      this.isLoading = false;

      if (request.status !== 200) {
        this.err('Payment Details request failed:', request);
        this.displayError('Error requesting payment details');

        return null;
      }

      var response = JSON.parse(request.responseText);

      if (response.error) {
        this.err('Payment Details request contains error:', response);
        this.displayError('Error requesting payment details');

        return null;
      }

      return response;
    },


    /**
     * Returns payment request for ApplePaySession initialization.
     * @param {object} data
     * @returns {ApplePayPaymentRequest}
     */
    getPaymentRequest: function getPaymentRequest(data) {
      return {
        /**
         * Required. A line item representing the total for the payment.
         */
        total: this._prepareTotal(data.total),

        /**
         * A set of line items that explain recurring payments and additional charges and discounts.
         */
        lineItems: this.type === 'additional-payment' ? [] : this._prepareLineItems(data.lineItems),

        /**
         * Required. The merchant’s two-letter ISO 3166 country code.
         */
        countryCode: this.config.countryCode,

        /**
         * Required. The three-letter ISO 4217 currency code for the payment.
         */
        currencyCode: this.config.currencyCode,

        /**
         * Required. The payment capabilities supported by the merchant.
         */
        merchantCapabilities: this.config.merchantCapabilities,

        /**
         * A list of available methods for shipping physical goods.
         */
        shippingMethods: data.shippingMethods,

        /**
         * An optional value that indicates how purchased items are to be shipped.
         */
        // shippingType : '',

        /**
         * A list of two-character country codes you provide, used to limit payments to cards from specific
         * countries.
         */
        // supportedCountries : [],

        /**
         * Required. The payment networks supported by the merchant.
         */
        supportedNetworks: this.config.supportedNetworks,

        /**
         * The fields of billing information that you require from the user to process the transaction.
         */
        requiredBillingContactFields: ['email', 'name', 'phone', 'postalAddress'],

        /**
         * The fields of shipping information that you require from the user to fulfill the order.
         */
        requiredShippingContactFields: this.type === 'additional-payment' ? ['email', 'phone'] : ['email', 'name', 'phone', 'postalAddress']

        /**
         * Billing contact information for the user.
         *
         * If you supply a billing address, you must also request "postalAddress" in requiredBillingContactFields.
         */
        // billingContact : {},

        /**
         * Shipping contact information for the user.
         */
        // shippingContact : {},

        /**
         * A Base64-encoded string used to contain your application-specific data.
         */
        // applicationData : ''
      };
    },


    /**
     * Displays error message.
     * @param {string} message
     */
    displayError: function displayError(message) {
      this.err(message);
      this.$store.dispatch('message', {
        message: this.__('Sorry we were unable to complete your request. Please try again.'),
        severity: 'error'
      });
    },


    /**
     * Displays success message.
     * @param {string} message
     */
    displaySuccess: function displaySuccess(message) {
      this.$store.dispatch('message', {
        message: this.__(message),
        severity: 'success'
      });
    },


    /**
     * Returns a promise with XHR sent to url with data.
     * @param {string} url
     * @param {FormData} data
     * @param {function} onSuccess
     * @param {function} onError
     * @returns {Promise<any>}
     */
    request: function request(url, data, onSuccess, onError) {
      var _this2 = this;

      this.isLoading = true;

      return this.$http.post(this._prepareUrl(url), data).then(function (response) {
        return onSuccess(response.body);
      }, function (response) {
        return onError(response.body);
      }).finally(function () {
        _this2.isLoading = false;
      });
    },


    /**
     * Return true if product form is valid, false otherwise.
     * @returns {bool}
     */
    _isProductFormValid: function _isProductFormValid() {
      this.log('Validating product form');

      var ctx = {
        form: this.form,
        formElements: this.form ? this.form.form.elements : null,
        isProductPage: true
      };

      this.handleEGiftCard();
      this.setFormData(ctx);

      if (!ctx.formHasQty) {
        this.showQtyError(ctx);
      }

      return ctx.formHasQty && this.isFormValid(ctx);
    },


    /**
     * Returns given URL with required parameters appended.
     * @param {string} url
     * @returns {string}
     */
    _prepareUrl: function _prepareUrl(url) {
      url += '?' + this.config.urlParams;
      if (this.type === 'product' || this.quoteId) {
        url += '&' + this.config.productUrlParam + '=' + (this.quoteId ? this.quoteId : this.config.productUrlParamDefault);
      } else if (this.type === 'additional-payment' && this.quoteId) {
        url += '&request_quote_id=' + this.quoteId + '}';
      }

      return url;
    },


    /**
     * Returns formatted "total" line item.
     * @param {number} amount
     * @returns {{label: string, type: string, amount: number}}
     */
    _prepareTotal: function _prepareTotal(amount) {
      return {
        label: this.config.merchantName,
        type: 'final',
        amount: amount
      };
    },


    /**
     * Returns formatted line items.
     * @param {array} items
     * @returns {array}
     */
    _prepareLineItems: function _prepareLineItems(items) {
      return items.map(function (item) {
        item.type = item.type || 'final';
        item.detail = item.detail || '';

        return item;
      });
    },


    /**
     * console.error wrapper, outputs errors if debug mode enabled.
     */
    err: function err(_err) {
      var kill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this.config.debug) {
        console.error(_err);
      }

      if (kill) {
        this.kill = true;
      }
    },


    /**
     * console.log wrapper, outputs logs if debug mode enabled.
     */
    log: function log() {
      if (this.config.debug) {
        var _console;

        (_console = console).log.apply(_console, arguments); // eslint-disable-line
      }
    }
  }, _addToCart2.default, _session2.default)
};

/***/ }),

/***/ 431:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  /**
   * Initializes ApplePaySession and starts it.
   * @param {Object} paymentRequest
   */
  beginSession: function beginSession(paymentRequest) {
    this.log('Initializing ApplePaySession');
    this.session = new ApplePaySession(this.apiVersion, paymentRequest);

    this.initSession(this.session);

    this.log('Starting ApplePaySession');
    this.session.begin();
  },


  /**
   * Initializes ApplePaySession instance event handlers.
   * @param {ApplePaySession} session
   */
  initSession: function initSession(session) {
    var _this2 = this;

    var _this = this;

    /**
     * An event handler that is called when the payment sheet
     * is displayed.
     * @param {ApplePayValidateMerchantEvent} event
     */
    session.onvalidatemerchant = function (event) {
      _this.log('session.onvalidatemerchant', event);

      var data = new FormData();
      data.append('validationUrl', event.validationURL);

      _this.request(_this.config.urls.validate, data, function (response) {
        _this.log('session.completeMerchantValidation : success');
        session.completeMerchantValidation(response);
      }, function (response) {
        _this.displayError(response.message || _this.__('Failed to validate merchant'));
      });
    };

    /**
     * An event handler that is called when a new payment
     * method is selected.
     * @param {ApplePayPaymentMethodSelectedEvent} event
     */
    session.onpaymentmethodselected = function (event) {
      _this.log('session.onpaymentmethodselected', event);

      var data = new FormData();
      data.append('paymentMethod', event.paymentMethod.type);

      _this.request(_this.config.urls.billing, data, function (response) {
        _this.log('session.completePaymentMethodSelection : success');
        session.completePaymentMethodSelection(_this._prepareTotal(_this2.requestTotal || response.total), _this._prepareLineItems(response.lineItems));
      }, function (response) {
        _this.displayError(response.message || _this.__('Failed to complete payment method selection'));
      });
    };

    /**
     * An event handler that is called when a shipping contact
     * is selected in the payment sheet.
     * @param {ApplePayShippingContactSelectedEvent} event
     */
    session.onshippingcontactselected = function (event) {
      _this.log('session.onshippingcontactselected', event);

      var data = new FormData();
      data.append('shippingContact', JSON.stringify(event.shippingContact));

      _this.request(_this.config.urls.contact, data, function (response) {
        _this.log('session.completeShippingContactSelection : success');
        session.completeShippingContactSelection(ApplePaySession.STATUS_SUCCESS, response.shippingMethods, _this._prepareTotal(_this2.requestTotal || response.total), _this._prepareLineItems(response.lineItems));
      }, function (response) {
        session.completeShippingContactSelection(response.status || ApplePaySession.STATUS_FAILURE, null, null, null);

        _this.displayError(response.message || _this.__('Failed to complete shipping contact selection'));
      });
    };

    /**
     * An event handler that is called when a shipping method
     * is selected.
     * @param {ApplePayShippingMethodSelectedEvent} event
     */
    session.onshippingmethodselected = function (event) {
      _this.log('session.onshippingmethodselected', event);

      var data = new FormData();
      data.append('shippingMethod', event.shippingMethod.identifier);

      _this.request(_this.config.urls.shipping, data, function (response) {
        _this.log('session.completeShippingMethodSelection : success');
        session.completeShippingMethodSelection(ApplePaySession.STATUS_SUCCESS, _this._prepareTotal(_this2.requestTotal || response.total), _this._prepareLineItems(response.lineItems));
      }, function (response) {
        session.completeShippingMethodSelection(response.status || ApplePaySession.STATUS_FAILURE, null, null);

        _this.displayError(response.message || _this.__('Failed to complete shipping method selection'));
      });
    };

    /**
     * An event handler that is called when the user has
     * authorized the Apple Pay payment with Touch ID,
     * Face ID, or passcode.
     * @param {ApplePayPaymentAuthorizedEvent} event
     */
    session.onpaymentauthorized = function (event) {
      _this.log('session.onpaymentauthorized', event);

      var data = new FormData();
      Object.keys(event.payment).forEach(function (k) {
        data.append(k, JSON.stringify(event.payment[k]));
      });

      if (_this2.type === 'additional-payment') {
        data.append('request_id', _this2.requestId);
      }

      if (_this2.type !== 'additional-payment' && localStorage.getItem('studyjs-ab-tests')) {
        data.append('ab-test', localStorage.getItem('studyjs-ab-tests'));
      }

      _this.request(_this2.type === 'additional-payment' ? _this.config.urls.payRequest : _this.config.urls.pay, data, function (response) {
        _this.log('session.completePayment : success');
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        _this.displaySuccess(response.message || _this.__('Payment complete'));
        if (_this2.type === 'additional-payment') {
          window.location.reload();
        } else {
          window.location.href = _this.config.urls.success;
        }
      }, function (response) {
        session.completePayment(response.status || ApplePaySession.STATUS_FAILURE);
        _this.displayError(response.message || _this.__('Failed to complete payment'));
      });
    };

    /**
     * An event handler that is automatically called when the
     * payment UI is dismissed.
     * @param {object} event
     */
    session.oncancel = function (event) {
      _this.log('session.oncancel', event);
      _this.session = null;
    };
  }
};

/***/ }),

/***/ 445:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".apple-pay-disclaimer[data-v-2397e098]{margin:1em auto 1.5em;text-align:center;font-size:.8em}", ""]);

// exports


/***/ }),

/***/ 454:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (!_vm.kill) ? _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.$store.state.cart.showApplePay),
      expression: "$store.state.cart.showApplePay"
    }],
    class: _vm.wrapperClass
  }, [_c('button', {
    staticClass: "apple-pay-btn",
    class: _vm.buttonClass,
    attrs: {
      "disabled": _vm.isLoading
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        return _vm.startPaymentSession($event)
      }
    }
  }), _vm._v(" "), (_vm.showDisclaimer) ? _c('div', {
    staticClass: "apple-pay-disclaimer"
  }, [_vm._v("\n    " + _vm._s(_vm.__('Or continue with another payment method.')) + "\n  ")]) : _vm._e()]) : _vm._e()
},staticRenderFns: []}

/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(445);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(68)("5a851ff1", content, true);

/***/ })

});
//# sourceMappingURL=3.chunk.58970a012fd79b3301e8.js.map