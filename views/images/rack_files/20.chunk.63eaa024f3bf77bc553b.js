webpackJsonp([20],{

/***/ 138:
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

exports.default = {
  data: function data() {
    return {
      id: 'bA4o2wUC67NI',
      messengerId: '109bzfxfn8h5a177og4j1y4dwp',
      online: false,
      title: 'Live Chat Offline',
      enabled: false
    };
  },
  created: function created() {
    this.enabled = window.globalStore.magento.store.id === '1';
  },
  beforeMount: function beforeMount() {
    this.checkLiveChatStatus();
  },


  methods: {
    /**
     * Check and set if Live Chat is online
     * @return {void}
     */
    checkLiveChatStatus: function checkLiveChatStatus() {
      var _this = this;

      var img = new Image();
      img.onload = function () {
        if (img.width >= 2) {
          _this.online = true;
          _this.title = 'Live Chat Online';
        }
      };
      img.src = 'https://image.providesupport.com/cmd/' + this.messengerId + '?ps_t=' + new Date().getTime() + '&ps_l=' + escape(document.location) + '&ps_s=' + this.id;
    },


    /**
     * Open live chat window if it's online
     * @return {void}
     */
    openLiveChat: function openLiveChat() {
      window.open('https://messenger.providesupport.com/messenger/' + this.messengerId + '.html?ps_l=' + escape(document.location), 'liveChat', 'menubar=0,location=0,scrollbars=auto,resizable=1,status=0,width=650,height=680');
    }
  }
};

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".live-chat{font-weight:700;text-transform:uppercase;color:#000;font-size:12px;display:inline-block;vertical-align:middle;line-height:30px;border-left:1px solid #d2d2d2;border-right:1px solid #d2d2d2;padding-left:12px;padding-right:12px;margin-left:12px;cursor:pointer}.live-chat:after{display:inline-block;width:22px;height:16px;margin-left:4px;content:\"\";vertical-align:text-top;background-image:url(" + __webpack_require__(160) + ");background-repeat:no-repeat;background-size:contain}.live-chat-online:after{background-image:url(" + __webpack_require__(161) + ")}", ""]);

// exports


/***/ }),

/***/ 160:
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9Ii00NTMgMjU5LjcgNTEuNiA0Mi4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IC00NTMgMjU5LjcgNTEuNiA0Mi4zOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojQ0NDQ0NDO30NCgkuc3Qxe2ZpbGw6Izk5OTk5OTt9DQo8L3N0eWxlPg0KPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iLTQxMC40IiBjeT0iMjY4LjciIHI9IjkiLz4NCjxnPg0KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0tNDM1LjgsMjkyLjhsLTAuNC0wLjFjLTkuNi0xLjktMTYuMy03LjUtMTYuMy0xMy44YzAtOCwxMC40LTE0LjUsMjMuMS0xNC41YzAuOCwwLDEuNywwLDIuNSwwLjENCgkJYy0wLjQsMS40LTAuNSwyLjgtMC41LDQuMmMwLDkuNCw3LjYsMTcsMTcsMTdjMC41LDAsMSwwLDEuNS0wLjFjLTMuMiwzLjgtOSw2LjYtMTUuOCw3LjVoLTAuMWwtMTIuMyw3LjlMLTQzNS44LDI5Mi44eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0tNDI5LjQsMjY0LjljMC42LDAsMS4yLDAsMS45LDBjLTAuMywxLjItMC40LDIuNS0wLjQsMy43YzAsOS42LDcuOCwxNy41LDE3LjUsMTcuNWMwLjEsMCwwLjIsMCwwLjMsMA0KCQljLTMuMywzLjMtOC42LDUuNi0xNC43LDYuNGgtMC4ybC0wLjIsMC4ybC0xMS4zLDcuMmwxLjEtNi42bDAuMi0xbC0xLTAuMmMtOS4zLTEuNy0xNS44LTcuMi0xNS44LTEzLjINCgkJQy00NTIsMjcxLjItNDQxLjksMjY0LjktNDI5LjQsMjY0LjkgTS00MjkuNCwyNjMuOWMtMTMsMC0yMy42LDYuNy0yMy42LDE1YzAsNi43LDcsMTIuNCwxNi43LDE0LjNsLTEuNSw4LjhsMTMuMi04LjUNCgkJYzcuNi0xLDEzLjktNC4zLDE2LjktOC42Yy0wLjksMC4xLTEuOCwwLjItMi43LDAuMmMtOS4xLDAtMTYuNS03LjQtMTYuNS0xNi41YzAtMS42LDAuMi0zLjIsMC43LTQuNg0KCQlDLTQyNy4zLDI2NC00MjguMywyNjMuOS00MjkuNCwyNjMuOUwtNDI5LjQsMjYzLjl6Ii8+DQo8L2c+DQo8L3N2Zz4NCg=="

/***/ }),

/***/ 161:
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA1MS42IDQyLjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxLjYgNDIuMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzFBQjE0Qjt9DQoJLnN0MXtmaWxsOiNDQ0NDQ0M7fQ0KCS5zdDJ7ZmlsbDojOTk5OTk5O30NCjwvc3R5bGU+DQo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSI0Mi42IiBjeT0iOSIgcj0iOSIvPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3LjIsMzMuMUwxNi44LDMzQzcuMiwzMS4xLDAuNSwyNS41LDAuNSwxOS4yYzAtOCwxMC40LTE0LjUsMjMuMS0xNC41YzAuOCwwLDEuNywwLDIuNSwwLjENCgkJYy0wLjQsMS40LTAuNSwyLjgtMC41LDQuMmMwLDkuNCw3LjYsMTcsMTcsMTdjMC41LDAsMSwwLDEuNS0wLjFjLTMuMiwzLjgtOSw2LjYtMTUuOCw3LjVsLTAuMSwwbC0xMi4zLDcuOUwxNy4yLDMzLjF6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTIzLjYsNS4yYzAuNiwwLDEuMiwwLDEuOSwwYy0wLjMsMS4yLTAuNCwyLjUtMC40LDMuN2MwLDkuNiw3LjgsMTcuNSwxNy41LDE3LjVjMC4xLDAsMC4yLDAsMC4zLDANCgkJYy0zLjMsMy4zLTguNiw1LjYtMTQuNyw2LjRsLTAuMiwwTDI3LjgsMzNsLTExLjMsNy4ybDEuMS02LjZsMC4yLTFsLTEtMC4yQzcuNSwzMC43LDEsMjUuMiwxLDE5LjJDMSwxMS41LDExLjEsNS4yLDIzLjYsNS4yDQoJCSBNMjMuNiw0LjJjLTEzLDAtMjMuNiw2LjctMjMuNiwxNWMwLDYuNyw3LDEyLjQsMTYuNywxNC4zbC0xLjUsOC44bDEzLjItOC41YzcuNi0xLDEzLjktNC4zLDE2LjktOC42Yy0wLjksMC4xLTEuOCwwLjItMi43LDAuMg0KCQljLTkuMSwwLTE2LjUtNy40LTE2LjUtMTYuNWMwLTEuNiwwLjItMy4yLDAuNy00LjZDMjUuNyw0LjMsMjQuNyw0LjIsMjMuNiw0LjJMMjMuNiw0LjJ6Ii8+DQo8L2c+DQo8L3N2Zz4NCg=="

/***/ }),

/***/ 172:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.enabled) ? _c('span', {
    staticClass: "live-chat",
    class: {
      'live-chat-online': _vm.online
    },
    attrs: {
      "title": _vm.title
    },
    on: {
      "click": _vm.openLiveChat
    }
  }, [_vm._v("\n      " + _vm._s('Live Chat') + "\n")]) : _vm._e()
},staticRenderFns: []}

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(159);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(68)("544fde4a", content, true);

/***/ }),

/***/ 72:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(182)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(138),
  /* template */
  __webpack_require__(172),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ })

});
//# sourceMappingURL=20.chunk.63eaa024f3bf77bc553b.js.map