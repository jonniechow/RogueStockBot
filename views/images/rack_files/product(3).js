webpackJsonp([38],{

/***/ 398:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 731:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(4);

var _vue2 = _interopRequireDefault(_vue);

__webpack_require__(398);

var _Product = __webpack_require__(52);

var _Product2 = _interopRequireDefault(_Product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _vue2.default({
  el: '#product-page-recommendations',
  components: {
    'product-page-recommendations': function productPageRecommendations() {
      return new Promise(function (resolve) {
        __webpack_require__.e/* require.ensure */(14).then((function (require) {
          resolve(__webpack_require__(977));
        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
      });
    }
  }
});

new _vue2.default({
  el: '#product-page-bvcurrations',
  components: {
    'product-page-bvcurrations': function productPageBvcurrations() {
      return new Promise(function (resolve) {
        __webpack_require__.e/* require.ensure */(15).then((function (require) {
          resolve(__webpack_require__(974));
        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
      });
    }
  }
});

new _vue2.default({
  el: '#invitational-product-view',
  components: {
    'invitational-product': function invitationalProduct() {
      return new Promise(function (resolve) {
        __webpack_require__.e/* require.ensure */(10).then((function (require) {
          resolve(__webpack_require__(975));
        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
      });
    }
  }
});

if (window.globalStore.crossSellProducts) {
  new _vue2.default({
    el: '#micro-packages',
    components: {
      'micro-packages': function microPackages() {
        return new Promise(function (resolve) {
          __webpack_require__.e/* require.ensure */(17).then((function (require) {
            resolve(__webpack_require__(976));
          }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
        });
      }
    }
  });
}

/**
 * Google Analytics product detail view
 */
{
  var dataLayerProduct = new _Product2.default();
  var el = document.querySelector('input[name="product"]');
  var sku = el ? el.getAttribute('value') : null;
  dataLayerProduct.pushProductDetailView(sku);
}

/***/ })

},[731]);
//# sourceMappingURL=product.js.map