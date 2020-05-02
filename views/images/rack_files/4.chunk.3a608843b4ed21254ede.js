webpackJsonp([4],{

/***/ 1163:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(1482)
__webpack_require__(1483)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(1187),
  /* template */
  __webpack_require__(1413),
  /* scopeId */
  "data-v-4b51e5fc",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),

/***/ 1187:
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
//
//
//
//

var _vuex = __webpack_require__(3);

exports.default = {
  props: ['subtitle', 'title', 'close', 'back', 'loading', 'rightText', 'titleHref', 'titleIcon'],

  computed: _extends({}, (0, _vuex.mapGetters)(['instantAddToCartInProgress'])),

  methods: {
    backClick: function backClick() {
      if (typeof this.back === 'function') {
        this.back();
      } else if (typeof this.back === 'string') {
        window.eventHub.$emit(this.back);
      }
    },
    closeClick: function closeClick() {
      if (typeof this.close === 'function') {
        this.close();
      } else if (typeof this.close === 'string') {
        window.eventHub.$emit(this.close);
      }
    }
  }
};

/***/ }),

/***/ 1289:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n.off-canvas {\n  position: fixed;\n  z-index: 10;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100vw;\n  max-width: 420px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-align: stretch;\n      align-items: stretch;\n  -ms-flex-wrap: nowrap;\n      flex-wrap: nowrap;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  background-color: #fff;\n}\n", ""]);

// exports


/***/ }),

/***/ 1290:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * @color Red Light\n * @section Reds\n */\n/**\n * @color Rogue Red\n * @section Reds\n */\n/**\n * @color Pure Red\n * @section Reds\n */\n/**\n * @color Red Dark\n * @section Reds\n */\n/**\n * @color Green Light\n * @section Greens\n */\n/**\n * @color Green\n * @section Greens\n */\n/**\n * @color Green Dark\n * @section Greens\n */\n/**\n * @color Light Blue\n * @section Blues\n */\n/**\n * @color Light Grayish Blue\n * @section Blues\n */\n/**\n * @color Blue\n * @section Blues\n */\n/**\n * @color Dark Blue\n * @section Blues\n */\n/**\n * @color Yellow Orange\n * @section Tints\n */\n/**\n * @color Yellow\n * @section Yellows\n */\n/**\n * @color Pure Yellow\n * @section Yellows\n */\n/**\n * @color Yellow Light\n * @section Yellows\n */\n/**\n * @color White\n * @section Tints\n */\n/**\n * @color Gray X Light\n * @section Tints\n */\n/**\n * @color Gray Light\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Super Light Grey\n * @section Tints\n */\n/**\n * @color Very Light Grey\n * @section Tints\n */\n/**\n * @color Light Grey\n * @section Tints\n */\n/**\n * @color Gray\n * @section Tints\n */\n/**\n * @color Gray Dark\n * @section Tints\n */\n/**\n * @color Gary X Dark\n * @section Tints\n */\n/**\n * @color Gray XX Dark\n * @section Tints\n */\n/**\n * @color Very Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Dark Gray\n * @section Tints\n */\n/**\n * @color Black X Light\n * @section Tints\n */\n/**\n * @color Black Light\n * @section Tints\n */\n/**\n * @color Black\n * @section Tints\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Base Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Headings Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Buttons Font Family\n * @section Variables > Typography\n */\n/**\n * @nuclide Note Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Small Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Medium Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Double Large Font Size\n * @section Variables > Font Sizes\n */\n/**\n * @nuclide Base Line Height\n * @section Variables > Line Heights\n */\n.off-canvas-header[data-v-4b51e5fc] {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-preferred-size: 50px;\n      flex-basis: 50px;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  padding-right: 16px;\n  padding-left: 16px;\n  background-color: #f1f1f1;\n}\n.off-canvas-header-loading[data-v-4b51e5fc] {\n  background-color: #5bbd15;\n}\n.off-canvas-header-loading .off-canvas-title[data-v-4b51e5fc] {\n    color: #fff;\n}\n.off-canvas-title[data-v-4b51e5fc] {\n  overflow: hidden;\n  -ms-flex-positive: 1;\n      flex-grow: 1;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  margin-bottom: 0;\n}\n.off-canvas-title.align-left[data-v-4b51e5fc] {\n    margin-left: 10px;\n}\n.off-canvas-title .icon[data-v-4b51e5fc] {\n    display: inline-block;\n    font-size: 21px;\n    width: 1em;\n    margin-right: 3px;\n    vertical-align: bottom;\n    cursor: pointer;\n}\n.off-canvas-icon[data-v-4b51e5fc] {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  margin: -20px -13px;\n  padding: 20px;\n  cursor: pointer;\n}\n.off-canvas-icon.icon-x[data-v-4b51e5fc] {\n    font-size: 14px;\n}\n.off-canvas-sub-title[data-v-4b51e5fc] {\n  font-size: 15px;\n  font-weight: normal;\n  font-family: \"Helvetica\", Arial, sans-serif;\n  text-transform: none;\n  position: relative;\n  bottom: 3px;\n  left: 2px;\n  vertical-align: middle;\n}\n.off-canvas-right-text[data-v-4b51e5fc] {\n  font-size: 13px;\n  font-weight: normal;\n  font-family: \"Helvetica\", Arial, sans-serif;\n  color: #d2d2d2;\n}\n", ""]);

// exports


/***/ }),

/***/ 1413:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "off-canvas-header",
    class: {
      'off-canvas-header-loading': _vm.loading
    }
  }, [_c('i', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.back),
      expression: "back"
    }],
    staticClass: "icon icon-arrow-left off-canvas-icon ga-off-canvas-header-icon-back",
    on: {
      "click": _vm.backClick
    }
  }), _vm._v(" "), _c('h4', {
    staticClass: "off-canvas-title",
    class: {
      'align-left': _vm.close,
      'align-left': _vm.back,
      'align-center': _vm.close && _vm.back
    }
  }, [(_vm.titleHref) ? _c('a', {
    attrs: {
      "href": _vm.titleHref
    }
  }, [(_vm.titleIcon) ? _c('span', {
    staticClass: "icon",
    class: _vm.titleIcon
  }) : _vm._e(), _vm._v(" " + _vm._s(_vm.title) + "\n    ")]) : _c('span', [(_vm.titleIcon) ? _c('span', {
    staticClass: "icon",
    class: _vm.titleIcon
  }) : _vm._e(), _vm._v(" " + _vm._s(_vm.title) + "\n    ")]), _vm._v(" "), (_vm.subtitle) ? _c('span', {
    staticClass: "off-canvas-sub-title",
    class: {
      'animated-placeholder': _vm.instantAddToCartInProgress
    }
  }, [_vm._v("\n          " + _vm._s(_vm.subtitle) + "\n    ")]) : _vm._e()]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.rightText && !_vm.close && !_vm.loading),
      expression: "rightText && !close && !loading"
    }],
    staticClass: "off-canvas-right-text"
  }, [_vm._v("\n      " + _vm._s(_vm.rightText) + "\n  ")]), _vm._v(" "), _c('i', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.close),
      expression: "close"
    }],
    staticClass: "icon icon-x off-canvas-icon ga-off-canvas-header-icon-close",
    on: {
      "click": _vm.closeClick
    }
  }), _vm._v(" "), (_vm.loading) ? _c('i', {
    staticClass: "icon icon-loading"
  }) : _vm._e()])
},staticRenderFns: []}

/***/ }),

/***/ 1482:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1289);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("7664754c", content, true, {});

/***/ }),

/***/ 1483:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1290);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("4a30b8a6", content, true, {});

/***/ })

});
//# sourceMappingURL=4.chunk.3a608843b4ed21254ede.js.map