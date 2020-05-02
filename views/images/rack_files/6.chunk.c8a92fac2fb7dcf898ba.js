webpackJsonp([6],{

/***/ 1195:
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

var _vuex = __webpack_require__(3);

exports.default = {
  props: ['isVeteransDay', 'exclusivesLink', 'textVerified', 'textUnverified'],

  computed: _extends({}, (0, _vuex.mapGetters)('customer', ['isMilitaryVerified']))
};

/***/ }),

/***/ 1196:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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
//
//
//
//
//
//
//

exports.default = {
  mounted: function mounted() {
    var _this = this;

    // to make the video resize properly, we hide it until this mounts
    document.getElementById('yt-video-container').style.display = 'block';

    setTimeout(function () {
      if (window.vdProducts) {
        // segment out "load more" products into 8-product chunks
        var chunk = 8;

        for (var i = 0; i < window.vdProducts.length; i += chunk) {
          _this.productStore.push(window.vdProducts.slice(i, i + chunk));
        }

        _this.products = _this.products.concat(_this.productStore[_this.storeIndex]);
        _this.storeIndex += 1;
      } else {
        // if we arent provided any products from CMS page, default to these 6
        _this.products.push({
          name: 'Rogue Never Forgotten Shirt',
          price: 25,
          rating: 4.6,
          image: 'https://www.roguefitness.com/media/catalog/product/r/o/rogue_back_nf.jpg',
          link: 'https://www.roguefitness.com/rogue-never-forgotten-shirt'
        }, {
          name: "Rogue Women's Never Forgotten Shirt",
          price: 25,
          rating: 4,
          image: 'https://www.roguefitness.com/media/catalog/product/r/o/rogue_thumb_nf_2.jpg',
          link: 'https://www.roguefitness.com/rogue-women-s-never-forgotten-shirt'
        }, {
          name: 'Rogue Never Forgotten Hoodie',
          price: 50,
          rating: 5,
          image: 'https://www.roguefitness.com/media/catalog/product/r/o/rogue-never-forgotten-hoodie-th.jpg',
          link: 'https://www.roguefitness.com/rogue-never-forgotten-zip-up-hoodie-black'
        }, {
          name: 'Rogue Dog Collar MIL Edition',
          price: 27.5,
          rating: 4.8,
          image: 'https://www.roguefitness.com/media/catalog/product/r/o/rogue-iava-dog-collar-th.jpg',
          link: 'https://www.roguefitness.com/rogue-dog-collar-mil-edition'
        }, {
          name: 'Rogue Operator Bar 3.0',
          price: 325,
          rating: 4.9,
          image: 'https://www.roguefitness.com/media/catalog/product/o/p/operator-th.jpg',
          link: 'https://www.roguefitness.com/rogue-operator-bar-cerakote'
        }, {
          name: 'Military Gym Flags',
          price: 32.5,
          rating: 4,
          image: 'https://www.roguefitness.com/media/catalog/product/m/i/military-flags-th.jpg',
          link: 'https://www.roguefitness.com/gym-flags'
        });

        _this.allProductsLoaded = true;
      }

      _this.loading = false;
    }, 1000);
  },
  data: function data() {
    return {
      loading: true,
      loadingProducts: false,
      allProductsLoaded: false,
      maxRating: 5,
      products: [],
      productStore: [],
      storeIndex: 0
    };
  },


  methods: {
    loadMoreProducts: function loadMoreProducts() {
      var _this2 = this;

      this.loadingProducts = true;

      setTimeout(function () {
        _this2.products = _this2.products.concat(_this2.productStore[_this2.storeIndex]);
        _this2.storeIndex += 1;

        if (_this2.storeIndex === _this2.productStore.length) {
          _this2.allProductsLoaded = true;
        }

        _this2.loadingProducts = false;
      }, 1000);
    },
    floorRating: function floorRating(rating) {
      return Math.floor(rating);
    },
    remainingRating: function remainingRating(rating) {
      return Math.floor(this.maxRating - rating);
    },
    remainingDecimal: function remainingDecimal(rating) {
      return parseFloat('.' + rating.toString().split('.')[1]) || null;
    },
    calculatePercentageStarWidth: function calculatePercentageStarWidth(rating) {
      return this.remainingDecimal(rating) * 100 + '%';
    }
  }
};

/***/ }),

/***/ 1197:
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

var _vuex = __webpack_require__(3);

exports.default = {
  props: ['exclusivesLink', 'militaryLink', 'textVerified'],

  computed: _extends({}, (0, _vuex.mapGetters)('customer', ['isMilitaryVerified']))
};

/***/ }),

/***/ 1198:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dashboardSnipe = __webpack_require__(1370);

var _dashboardSnipe2 = _interopRequireDefault(_dashboardSnipe);

var _textSnipe = __webpack_require__(1372);

var _textSnipe2 = _interopRequireDefault(_textSnipe);

var _landingPage = __webpack_require__(1371);

var _landingPage2 = _interopRequireDefault(_landingPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  store: store,

  props: ['isDashboard', 'isSnipe', 'isLandingPage'],

  components: {
    'dashboard-snipe': _dashboardSnipe2.default,
    'text-snipe': _textSnipe2.default,
    'landing-page': _landingPage2.default
  },

  mounted: function mounted() {
    if (this.veteransDayState == 1) {
      // eslint-disable-line eqeqeq
      this.isEnabled = true;
    } else if (this.veteransDayState == 2) {
      // eslint-disable-line eqeqeq
      this.isEnabled = true;
      this.isVeteransDay = true;
    }
  },
  data: function data() {
    return {
      isEnabled: false,
      isVeteransDay: false,
      exclusivesLink: window.globalStore.sheerid.banner_settings.url_category || 'veterans-day',
      militaryLink: window.globalStore.sheerid.banner_settings.url_landing || 'military',
      textVerified: window.globalStore.sheerid.banner_settings.text_verified || false,
      textUnverified: window.globalStore.sheerid.banner_settings.text_unverified || false,
      veteransDayState: window.globalStore.sheerid.veterans_day.state || 0
    };
  },


  methods: {
    dontShowHere: function dontShowHere() {
      if (window.location.href.indexOf(this.exclusivesLink) > -1 || window.location.href.indexOf(this.militaryLink) > -1 || window.location.href.indexOf('onestepcheckout') > -1) {
        return true;
      }

      return false;
    }
  }
}; //
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
//
//
//
//
//
//
//
//
//

/***/ }),

/***/ 1288:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n.vd-text-snipe {\n  padding: 16px;\n  background: #e9e9e9;\n  text-align: center;\n  font-family: \"Roboto Condensed\", \"Roboto\", Helvetica, sans-serif;\n}\n.vd-text-snipe a,\n  .vd-text-snipe a:visited {\n    white-space: nowrap;\n    font-weight: bold;\n    color: #ea0000;\n}\n.vd-text-snipe a:hover,\n    .vd-text-snipe a:visited:hover {\n      color: #9e0000;\n}\n.vd-text-snipe p {\n    font-size: 13px;\n    margin-bottom: 0;\n}\n@media (min-width: 1025px) {\n.cms-index-index .vd-text-snipe {\n    padding-left: 250px;\n}\n}\n", ""]);

// exports


/***/ }),

/***/ 1296:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n.vd-container {\n  display: block !important;\n}\n.vd-landing-header div {\n  margin: 0 auto;\n  max-width: 1280px;\n}\n.vd-landing-header div p {\n    max-width: none;\n}\n.vd-landing-header:before {\n  background: url(\"/media/wysiwyg/vd-landing.jpg\");\n  background-position: 99%;\n  background-size: cover;\n}\n.vd-video-block {\n  margin: 0 auto;\n  text-align: center;\n  padding: 16px 32px 32px;\n}\n.vd-video-block .big-p {\n    font-size: 18px;\n    max-width: 825px;\n    margin: 0 auto;\n    padding: 16px 16px 32px;\n}\n@media (max-width: 737px) {\n.vd-video-block {\n      padding: 16px;\n}\n.vd-video-block .big-p {\n        font-size: 15px;\n        padding: 0 16px 16px;\n}\n}\n.vd-video-block .yt-video-container {\n    max-width: 850px;\n    margin: 0 auto;\n}\n.vd-video-block .yt-video-container .yt-video {\n      position: relative;\n      padding-bottom: 56.25%;\n      height: 0;\n      overflow: hidden;\n}\n.vd-video-block .yt-video-container .yt-video iframe {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n}\n.vd-products-container {\n  padding: 40px 18px 0;\n  background: #e9e9e9;\n}\n@media (max-width: 1024px) {\n.vd-products-container {\n      padding: 28px 16px 0;\n}\n}\n@media (max-width: 737px) {\n.vd-products-container {\n      padding: 24px 16px 0;\n}\n}\n@keyframes spinner {\nfrom {\n    transform: rotate(0deg);\n}\nto {\n    transform: rotate(359deg);\n}\n}\n.vd-products-container .loading {\n    width: 36px;\n    height: 36px;\n    margin: 0 auto 32px;\n    transform: rotate(0deg);\n    animation: spinner 0.6s infinite linear;\n    border: 4px solid #a2a2a2;\n    border-top: 4px solid #666;\n    border-radius: 50%;\n    stroke: white;\n}\n.vd-products-container .vd-products {\n    max-width: 1280px;\n    margin: 0 auto;\n}\n.vd-products-container .vd-products .products {\n      display: -ms-flexbox;\n      display: flex;\n      -ms-flex-wrap: wrap;\n          flex-wrap: wrap;\n      margin: -8px -8px 0;\n}\n.vd-products-container .vd-products .products .product {\n        position: relative;\n        margin: 0 10px 32px;\n        padding: 16px;\n        background: #fff;\n        text-align: center;\n        -ms-flex-preferred-size: calc(25% - 1.25em);\n            flex-basis: calc(25% - 1.25em);\n}\n.vd-products-container .vd-products .products .product img {\n          width: 100%;\n          padding: 8px;\n}\n@media (max-width: 1024px) {\n.vd-products-container .vd-products .products .product {\n            -ms-flex-preferred-size: calc(33% - 1.1em);\n                flex-basis: calc(33% - 1.1em);\n            margin: 0 10px 20px;\n}\n}\n@media (max-width: 737px) {\n.vd-products-container .vd-products .products .product {\n            -ms-flex-preferred-size: calc(50% - 1em);\n                flex-basis: calc(50% - 1em);\n            padding: 10px;\n            margin: 0 8px 16px;\n}\n.vd-products-container .vd-products .products .product img {\n              padding: 0;\n}\n}\n.vd-products-container .vd-products .products .product .p-name,\n        .vd-products-container .vd-products .products .product .p-price {\n          margin-bottom: 8px;\n}\n.vd-products-container .vd-products .products .product .p-stars {\n          display: inline-block;\n          width: 75px;\n          height: 18px;\n          vertical-align: middle;\n          margin-bottom: 48px;\n}\n.vd-products-container .vd-products .products .product .p-stars .star {\n            position: relative;\n            margin: 0;\n            padding: 0;\n            float: left;\n}\n.vd-products-container .vd-products .products .product .p-stars .star .percent-star {\n              overflow: hidden;\n              position: absolute;\n              left: 0;\n              top: 0;\n}\n.vd-products-container .vd-products .products .product .p-stars .star i.fa-star-gray {\n              color: #cbcbcb;\n}\n.vd-products-container .vd-products .products .product .p-stars .star i.fa-star-yellow {\n              color: #fcb040;\n}\n.vd-products-container .vd-products .products .product .p-shop {\n          position: absolute;\n          bottom: 0;\n          left: 0;\n          width: 100%;\n          margin-bottom: 0;\n          border-radius: 0;\n          background: linear-gradient(180deg, #000, #000);\n          font-family: \"Roboto Condensed\", \"Helvetica\", Arial, sans-serif;\n          transition: all 0.1s;\n}\n.vd-products-container .vd-products .products .product .p-shop:hover {\n            background: linear-gradient(180deg, #ea0000, #bc0000);\n}\n.vd-products-container .btn-white {\n    width: 100%;\n    font-family: \"Roboto Condensed\", \"Helvetica\", Arial, sans-serif;\n    font-size: 15px;\n    font-weight: bold;\n    color: #000;\n    background: #fff;\n    border-radius: 0;\n    border: 1px solid #a2a2a2;\n    margin-bottom: 32px;\n}\n@media (max-width: 1024px) {\n.vd-products-container .btn-white {\n        margin-bottom: 18px;\n}\n}\n@media (max-width: 737px) {\n.vd-products-container .btn-white {\n        margin-bottom: 16px;\n}\n}\n.vd-products-container .btn-white:hover {\n      background: #f1f1f1;\n}\n.vd-products-container .btn-white.v-btn-loading:before {\n      border-color: #a2a2a2;\n      border-top-color: #666;\n}\n.vd-support {\n  text-align: center;\n  padding: 32px 16px;\n  margin: 0 auto;\n}\n.vd-support h2 {\n    margin-bottom: 32px;\n}\n.vd-support .vd-orgs {\n    display: -ms-flexbox;\n    display: flex;\n    max-width: 1280px;\n    margin: 0 auto;\n}\n.vd-support .vd-orgs .vd-iava,\n    .vd-support .vd-orgs .vd-k9 {\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n      -ms-flex-preferred-size: 50%;\n          flex-basis: 50%;\n      border: 1px solid #a2a2a2;\n      padding: 32px;\n}\n.vd-support .vd-orgs .vd-iava img,\n      .vd-support .vd-orgs .vd-iava p,\n      .vd-support .vd-orgs .vd-k9 img,\n      .vd-support .vd-orgs .vd-k9 p {\n        margin-bottom: 32px;\n}\n.vd-support .vd-orgs .vd-iava h3,\n      .vd-support .vd-orgs .vd-k9 h3 {\n        margin-bottom: 0;\n}\n.vd-support .vd-orgs .vd-iava {\n      margin-right: 10px;\n}\n.vd-support .vd-orgs .vd-k9 {\n      margin-left: 10px;\n}\n@media (max-width: 1024px) {\n.vd-support {\n      padding: 16px;\n}\n.vd-support h2 {\n        margin-bottom: 16px;\n}\n.vd-support .vd-orgs {\n        display: block;\n}\n.vd-support .vd-orgs .vd-iava,\n        .vd-support .vd-orgs .vd-k9 {\n          padding: 16px;\n          margin: 0;\n}\n.vd-support .vd-orgs .vd-iava img,\n          .vd-support .vd-orgs .vd-k9 img {\n            width: auto;\n            max-width: 100%;\n            margin-bottom: 16px;\n}\n.vd-support .vd-orgs .vd-iava {\n          margin-bottom: 18px;\n}\n}\n.vd-uniform {\n  display: -ms-flexbox;\n  display: flex;\n  margin: 0 auto;\n  background: #e9e9e9;\n}\n.vd-uniform .uniform-image,\n  .vd-uniform .uniform-text {\n    -ms-flex-preferred-size: 50%;\n        flex-basis: 50%;\n}\n.vd-uniform .uniform-image {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n}\n.vd-uniform .uniform-image img {\n      display: block;\n      width: 100%;\n}\n.vd-uniform .uniform-text {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    padding: 48px;\n}\n.vd-uniform .uniform-text p {\n      max-width: 800px;\n}\n.vd-uniform .uniform-text .v-btn {\n      margin-bottom: 0;\n}\n@media (max-width: 1024px) {\n.vd-uniform {\n      display: block;\n}\n.vd-uniform .uniform-text {\n        padding: 16px;\n}\n.vd-uniform .uniform-text p {\n          margin-bottom: 16px;\n}\n.vd-uniform .uniform-text .v-btn {\n          width: 100%;\n}\n}\n", ""]);

// exports


/***/ }),

/***/ 1370:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(1195),
  /* template */
  __webpack_require__(1440),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 1371:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1489)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(1196),
  /* template */
  __webpack_require__(1419),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 1372:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1481)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(1197),
  /* template */
  __webpack_require__(1411),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 1411:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vd-text-snipe"
  }, [_c('p', [_c('strong', [_vm._v(_vm._s(_vm.__('HAPPY VETERANS DAY!')))]), _vm._v(" " + _vm._s(_vm.__(_vm.textVerified)) + "\n    "), (_vm.isMilitaryVerified) ? _c('a', {
    attrs: {
      "href": _vm.$getUrl(_vm.exclusivesLink)
    }
  }, [_vm._v(_vm._s(_vm.__('SHOP EXCLUSIVES')))]) : _c('a', {
    attrs: {
      "href": _vm.$getUrl(_vm.militaryLink)
    }
  }, [_vm._v(_vm._s(_vm.__('SHOP MILITARY')))])])])
},staticRenderFns: []}

/***/ }),

/***/ 1412:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.isEnabled && _vm.isDashboard) ? _c('dashboard-snipe', {
    attrs: {
      "is-veterans-day": _vm.isVeteransDay,
      "exclusives-link": _vm.exclusivesLink,
      "text-verified": _vm.textVerified,
      "text-unverified": _vm.textUnverified
    }
  }) : (_vm.isEnabled && _vm.isSnipe && _vm.isVeteransDay && !_vm.dontShowHere()) ? _c('text-snipe', {
    attrs: {
      "is-veterans-day": _vm.isVeteransDay,
      "exclusives-link": _vm.exclusivesLink,
      "military-link": _vm.militaryLink,
      "text-verified": _vm.textVerified
    }
  }) : (_vm.isLandingPage) ? _c('landing-page') : _vm._e()], 1)
},staticRenderFns: []}

/***/ }),

/***/ 1419:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vd-container",
    attrs: {
      "id": "vd-container"
    }
  }, [_c('div', {
    staticClass: "vd-products-container"
  }, [_c('div', {
    staticClass: "vd-products"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.loading),
      expression: "loading"
    }],
    staticClass: "loading"
  }), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.loading),
      expression: "!loading"
    }],
    staticClass: "products"
  }, _vm._l((_vm.products), function(product) {
    return _c('div', {
      staticClass: "product"
    }, [_c('img', {
      attrs: {
        "src": product.image
      }
    }), _vm._v(" "), _c('p', {
      staticClass: "p-name"
    }, [_c('strong', [_vm._v(_vm._s(_vm.__(product.name)))])]), _vm._v(" "), _c('p', {
      staticClass: "p-price"
    }, [_vm._v(_vm._s(product.price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })))]), _vm._v(" "), _c('div', {
      staticClass: "p-stars"
    }, [_vm._l((_vm.floorRating(product.rating)), function(n) {
      return _c('span', {
        staticClass: "star"
      }, [_c('i', {
        staticClass: "fa fa-star fa-star-yellow"
      })])
    }), _vm._v(" "), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.remainingDecimal(product.rating)),
        expression: "remainingDecimal(product.rating)"
      }],
      staticClass: "star star-percentage"
    }, [_c('i', {
      staticClass: "fa fa-star fa-star-gray"
    }), _vm._v(" "), _c('i', {
      staticClass: "fa fa-star fa-star-yellow percent-star",
      style: ({
        width: _vm.calculatePercentageStarWidth(product.rating)
      })
    })]), _vm._v(" "), _vm._l((_vm.remainingRating(product.rating)), function(n) {
      return _c('span', {
        staticClass: "star"
      }, [_c('i', {
        staticClass: "fa fa-star fa-star-gray"
      })])
    })], 2), _vm._v(" "), _c('a', {
      staticClass: "p-shop v-btn",
      attrs: {
        "href": product.link
      }
    }, [_c('strong', [_vm._v(_vm._s(_vm.__('SHOP')))])])])
  })), _vm._v(" "), _c('button', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.allProductsLoaded),
      expression: "!allProductsLoaded"
    }],
    staticClass: "v-btn btn-white",
    class: {
      'v-btn-loading': _vm.loadingProducts
    },
    on: {
      "click": function($event) {
        _vm.loadMoreProducts()
      }
    }
  }, [_vm._v(_vm._s(_vm.__('LOAD MORE')))])])])])
},staticRenderFns: []}

/***/ }),

/***/ 1440:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.isMilitaryVerified && _vm.isVeteransDay) ? _c('div', {
    staticClass: "logged-in vd-box vd-account"
  }, [_c('h3', [_vm._v(_vm._s(_vm.__('HAPPY VETERANS DAY!')))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.__(_vm.textVerified)))]), _vm._v(" "), _c('a', {
    staticClass: "v-btn v-btn-red",
    attrs: {
      "href": _vm.$getUrl(_vm.exclusivesLink)
    }
  }, [_vm._v(_vm._s(_vm.__('Shop Exclusives')))])]) : (!_vm.isMilitaryVerified) ? _c('div', {
    staticClass: "vd-box vd-account"
  }, [_c('p', {
    staticClass: "big-p"
  }, [_vm._v(_vm._s(_vm.__(_vm.textUnverified)))]), _vm._v(" "), _c('a', {
    staticClass: "v-btn v-btn-red",
    attrs: {
      "href": _vm.$getUrl('/rogueid/segments')
    }
  }, [_vm._v(_vm._s(_vm.__('Verify Your Status')))])]) : _vm._e()
},staticRenderFns: []}

/***/ }),

/***/ 1481:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1288);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("3421437a", content, true, {});

/***/ }),

/***/ 1489:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1296);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("fa05cb62", content, true, {});

/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(1198),
  /* template */
  __webpack_require__(1412),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ })

});
//# sourceMappingURL=6.chunk.c8a92fac2fb7dcf898ba.js.map