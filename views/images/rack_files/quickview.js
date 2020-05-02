var QuickView = new Class.create();

QuickView.prototype = {
    observers          : {
        hide : [],
        show : []
    },
    loadedAjaxProducts : {},
    ajaxRequests       : {},

    initialize : function (element, url, preloading) {
        var self                       = this;
        this.url                       = url;
        this.fadeSpeed                 = 300;
        this.element                   = element;
        this.windowInProcess           = false;
        this.windowIsOpen              = false;
        this.currentQtyField           = null;
        this.currentOption             = null;
        this.lastQtyField              = null;
        this.containerId               = 'qvContainer';
        this.productWrapper            = '.product-image-cont';
        this.config                    = null;
        this.opConfig                  = undefined;
        this.mainConfigFields          = [];
        this.selectedOptions           = [];
        this.optionsPrice              = null;
        this.mainProductIsConfigurable = true;
        this.selectionStockStatus      = null;
        this.bvRatingStarsContainer    = null;
        this.loopUntilBVIsLoaded       = null;
        this.preloading                = typeof preloading !== 'undefined' ? preloading : true;
        this.mainBundle                = null;

        this.hideWindow                = this.hideWindow.bindAsEventListener(this);

        this.closeQuickview            = this.closeQuickview.bindAsEventListener(this);

        if (this._isAllowedBrowser()) {
            Event.observe(window, 'load', function () {
                if (self.preloading) {
                    self.initHoverAction();
                }
            });

            document.observe('click', function (e, el) {
                if (el = e.findElement(element)) {
                    self._showWindow(el.getAttribute('rel'));
                    el.removeClassName('qv-open');
                    Event.stop(e);
                }
            });
        }
        this.addValidation();
    },

    setBVHacks : function () {
        var self = this;
        var BVRSummaryContainer = $('BVRRSummaryContainer');
        if (BVRSummaryContainer) {
          self.bvRatingStarsContainer = BVRSummaryContainer.down('.bv-rating-stars-container');
        }
    },

    loopBVHacks : function () {
        var self = this;
        var iterator = 0;

        self.setBVHacks();
        self.loopUntilBVIsLoaded = setInterval(function () {
            if (++iterator > 10) {
                return clearInterval(self.loopUntilBVIsLoaded);
            } else if (self.bvRatingStarsContainer == null || typeof self.bvRatingStarsContainer === 'undefined') {
                self.setBVHacks();
            } else {
                clearInterval(self.loopUntilBVIsLoaded);
                var productLink = $('qvContainer').down('.bottom-buttons .btn-view-details').readAttribute('href');
                productLink += '#customer-reviews';

                var target = jQuery('span.bv-rating-ratio-count'),
                reviewCount = target.html(),
                reviewHtml = reviewCount ? reviewCount.replace('(', '').replace(')', ' Reviews') : null;

                //add product link to quickview BV as well
                if (!!reviewHtml) {
                  target.html('<a href="' + productLink + '">' + reviewHtml + '</a>');
                }

                // Change the link to current product page
                self.bvRatingStarsContainer.writeAttribute('href', productLink);
                // Prevents BV plugin to trigger the event that causes the error
                self.bvRatingStarsContainer.removeClassName('bv-rating-stars-container').addClassName('bv-rating-stars-container-link');
                self.checkDefaultBinStatus();
                findEmptyProductBV(this.innerContainer);
            }
        }, 200);
    },

    addHideObserver : function (fn) {
        this.observers.hide.push(fn);
    },

    addShowObserver : function (fn) {
        this.observers.show.push(fn);
    },

    callObservers : function (type) {
        var self = this;
        self.observers[type].each(function (fn) {
            fn(self);
        });

        Event.fire(document, 'quickview:' + type);
        if (Object.hasOwnProperty.call(window, 'eventHub')) {
          window.eventHub.$emit('quickview:' + type)
        }
    },

    initHoverAction : function () {
        var self = this;

        $$(this.productWrapper).each(function (el) {
            var qvLink = el.down('.qv-link');
            if (qvLink) {
                if (!el.addEventListener) {
                    el.attachEvent('onmouseover', function () {
                        qvLink.addClassName('qv-open');
                        self.preloadQV(qvLink.readAttribute("rel"));
                    });

                    el.attachEvent('onmouseleave', function () {
                        qvLink.removeClassName('qv-open');
                    });
                } else {
                    el.addEventListener('mouseover', function () {
                        qvLink.addClassName('qv-open');
                        self.preloadQV(qvLink.readAttribute("rel"));
                    });

                    el.addEventListener('mouseleave', function () {
                        qvLink.removeClassName('qv-open');
                    });
                }
            }
        });
    },

    registerAndInitBundleConfig : function (config, taxCalcMethod, calcUnitBase, calcRowBase, calcTotalBase) {
        window.taxCalcMethod   = taxCalcMethod;
        window.CACL_UNIT_BASE  = calcUnitBase;
        window.CACL_ROW_BASE   = calcRowBase;
        window.CACL_TOTAL_BASE = calcTotalBase;
        if (typeof bundle !== 'undefined') {
            // if we are on a bundle product page, save `bundle` object to restore it after QV close
            this.mainBundle = bundle;
        }
        bundle = new Product.Bundle(config);
    },

    registerAndInitConfig : function (config) {
        var isMainProduct = !this.config;
        if (isMainProduct && this.mainProductIsConfigurable) {
            this.config        = config;
            config.containerId = 'product_addtocart_form';
        } else {
            config.containerId = 'qvWindow';
        }

        var conf = new Product.Config(config);

        if (isMainProduct) {
            this.optionsPrice     = window.optionsPrice;
            this.mainConfigFields = conf.settings;
        }
    },

    registerAndInitOpConfig : function (config) {
        this.opConfig   = window.opConfig;
        window.opConfig = new Product.Options(config);
    },

    /**
     * Save original value of optionsPrice and init it for product in QV.
     */
    registerAndInitOptionsPrice : function (config) {
        this.optionsPrice = window.optionsPrice;
        window.optionsPrice = new Product.OptionsPrice(config);
    },

    ajaxQV : function (productId, shouldPush) {
        var self = this;
        var url  = self.url + ((self.url.slice(-1) !== '/') ? '/' : '') + 'id/' + productId;

        this.ajaxRequests[productId] = new Ajax.Request(url, {
            method     : 'get',
            dataType   : "json",
            onComplete : function (transport) {
                var resp = self._handleResponse(transport);
                if (resp) {
                    self.loadedAjaxProducts[productId] = resp;

                    if (shouldPush) {
                        self.pushToQV(productId);
                    }
                }
            }
        });
    },

    preloadQV : function (productId) {
        if (!this.loadedAjaxProducts[productId]) {
            this.loadedAjaxProducts[productId] = "loading";

            if (!this.ajaxRequests[productId]) {
                this.ajaxQV(productId, false);
            }
        }
    },

    pushToQV : function (productId) {
        var self = this;

        this.selectedOptions = [];
        this.mainConfigFields.each(function (field) {
            self.selectedOptions.push({
                id    : field.id,
                value : $(field).getValue()
            });
        });
        this.innerContainer.update(self.loadedAjaxProducts[productId].content);
        this.setObservers();
        this.addBreadcrumbsParams(productId);
        this.windowIsOpen = true;
        this.closeLink.setStyle({display : 'block'});
        this.callObservers('show');
        this.innerContainer.removeClassName("loading");
        this.windowInProcess = false;

        self.loopBVHacks();
    },

    /**
     * Add dynamic breadcrumbs params to product URLs.
     *
     * @param {string} productId
     *
     * @return void
     */
    addBreadcrumbsParams : function (productId) {
        var queryIndex = productId.indexOf('?');
        if (queryIndex !== -1) {
            var query = productId.substring(queryIndex);
            this.innerContainer
                .select('.btn-view-details, .qv-image-link, .product-reviews a, .product-name a')
                .each(function (a) {
                    var ahref = a.href, fragment = '';
                    if (!ahref) {
                        return;
                    }
                    if (ahref.indexOf('#') !== -1) {
                        fragment = ahref.substr(ahref.indexOf('#')); // contains "#"
                        ahref = ahref.substr(0, ahref.indexOf('#'));
                    }
                    if (ahref.indexOf('?') !== -1) {
                        ahref = ahref.substr(0, ahref.indexOf('?'));
                    }
                    a.href = ahref + query + fragment;
                });
        }
    },

    checkDefaultBinStatus : function () {
        $$('#' + this.containerId + ' .swatch-oos.active-swatch').each(function (el) {
           el.triggerEvent('click');
        });
    },

    open : function(productId) {
        this._showWindow(productId);
    },

    _showWindow : function (productId) {
        var self    = this;
        this.waiter = null;
        this._showMask();
        this.windowInProcess = true;
        this.window          = new Element("div", {id : "qvWindow"});
        // this.loader = new Element("div", {'class' : "qvLoader"});
        this.innerContainer = new Element("div", {id : this.containerId});
        this.closeLink      = new Element("div", {
            id    : "qvClose",
            style : 'display:none'
        });

        // this.window.insert(this.loader);
        this.window.insert(this.closeLink);
        this.window.insert(this.innerContainer);
        if (!this.config) {
            this.mainProductIsConfigurable = false;
        }

        if (typeof stStatus !== 'undefined') {
            this.selectionStockStatus = stStatus.selectionStockStatus;
        }

        jQuery(this.window).fadeIn(this.fadeSpeed);

        Event.observe(this.closeLink, 'click', this.hideWindow);
        $(document.body).insert({'top' : this.window});
        this.innerContainer.addClassName("loading");

        if (this.loadedAjaxProducts[productId] && this.loadedAjaxProducts[productId] != "loading") {
            this.pushToQV(productId);

        } else if (this.loadedAjaxProducts[productId] === "loading") {
            var iterator = 0;

            self.waiter = setInterval(function () {
                if (iterator > 25) {
                    self.ajaxRequests[productId].transport.abort();
                    self.ajaxQV(productId, true);
                    clearInterval(self.waiter);
                    return;
                }

                if (self.loadedAjaxProducts[productId] != "loading") {
                    self.pushToQV(productId);
                    clearInterval(self.waiter);
                } else {
                    iterator++;
                }
            }, 200);

        } else {
            this.ajaxQV(productId, true);
        }

        // attached to the window in roguefitness.com/frontend/src/base/services/data-layer/Product.js
        const dataLayerProduct = new window._DataLayerProduct()
        dataLayerProduct.pushProductDetailView(productId)
    },

    getSubmitButtons : function () {
        return this.window.select('button.btn-cart');
    },

    setObservers : function () {
        var self                   = this,
            productAddToCartFormQv = new VarienForm('qvproduct_addtocart_form');

        if (typeof LiveCalculation != 'undefined') {
            var qvLiveCalculation = new LiveCalculation();
            qvLiveCalculation.initQuickView();
        }

        var addToCartForm = $('qvproduct_addtocart_form');
        if (addToCartForm) {
            self.getSubmitButtons().each(function (addToCart) {
                addToCart.observe('click', function (e) {
                    e.preventDefault();
                    if (self.validateQty() && productAddToCartFormQv.validator.validate()) {
                        this.addClassName("btn-updating").disable();
                        self.addToCart(addToCartForm);
                    } else {
                        // enable all elements that have been disabled in rgDisableUntouchedItems (product.js)
                        self.window.select('input, select').each(function (el) {
                            el.disabled = "";
                        });
                    }
                });
            }.bind(self));
        }
        //Add item to cart and then stop the default form submit action.
        addToCartForm.observe('submit', function (event) {
            if (this.length > 0) {
                if (self.validateQty() && productAddToCartFormQv.validator.validate()) {
                    self.addToCart(addToCartForm);
                }
            }
            event.stop();
        });

        //add sliding effect to product options
        this.window.select('.qty').each(function (el) {
            el.observe('focus', function () {
                var itemId = parseInt(el.name.match(/\d+/)),
                    option = self.window.down('#super_group_' + itemId);

                if (option) {
                    option = option.down('.sliding-options');
                }

                // hide previously opened options
                if (this.currentOption && (!option || option.id != this.currentOption.id)) {
                    if (!this.currentQtyField || parseInt(this.currentQtyField.value) < 1)
                        jQuery(this.currentOption).slideUp('fast');
                } else if (!this.currentOption && !jQuery(el).is(':first-of-type')) {
                    jQuery('.sliding-options').slideUp('fast');
                }

                self.currentQtyField = el;
                if (option && !option.down(".hide-merged")) {
                    self.currentOption = option;
                    jQuery(this.currentOption).slideDown('fast', function () {
                        // if the last item has options scroll down to show them
                        if (self.currentQtyField.name == self.lastQtyField.name) {
                            jQuery('#qvContainer .grouped-items-table').scrollTop(5000);
                        }
                    });

                } else {
                    self.currentOption = null;
                }
            }.bindAsEventListener(self));
            self.lastQtyField = el;
        })

        // Add collapser effect to grouped products
        if(typeof RgCollapser === "function") {
          var qvCollapser = new RgCollapser();
        }

        // add shipping map toggle
        if(typeof RgGroupedShippingMap === "function") {
            var rgGroupedShippingMap = new RgGroupedShippingMap();
        }
    },

    validateQty : function () {
        var form       = $('qvproduct_addtocart_form');
        this.isGrouped = !!form.down('.merged-options');
        var toProcess = rgDisableUntouchedItems.call(this, form);
        // @TODO PUT cleaning here

        var qtys = $$("#qvproduct_addtocart_form #super-product-table .qty:not(.qty-disabled)");
        qtys     = qtys.concat($$("#qvproduct_addtocart_form #super-product-table-1 .qty:not(.qty-disabled)"));
        qtys     = qtys.concat($$("#qvproduct_addtocart_form #super-product-table-2 .qty:not(.qty-disabled)"));
        if (qtys.length > 0) {
            var qtySelected = false;
            qtys.each(function (el) {
                if (el.value.length = 0) {
                    el.value = 0;
                }
                qtySelected = qtySelected || parseInt(el.value);
            });
            if (!qtySelected) {
                qtyValidator.processErrorMessage();
                if (toProcess && toProcess.qtys) {
                    toProcess.qtys.each(function (el) {
                        el.disabled = '';
                    });
                    toProcess.globalMergedOptions.each(function (element) {
                        element.disabled = '';
                    });
                }

                return false;
            }

            qtys.each(function (el) {
                var elValue = parseInt(el.value);

                var elName  = el.name;
                var elMatch = elName.match(/\d+/);
                var elId    = parseInt(elMatch[0]);

                var productOptions = $$('#qvproduct_addtocart_form #super_group_' + elId + ' .product-custom-option');
                productOptions     = productOptions.concat($$('#qvproduct_addtocart_form #super_group_' + elId + ' input[type="hidden"]'));
                productOptions     = productOptions.concat($$('#qvproduct_addtocart_form #super_group_' + elId + ' .config-attribute-option'));

                if (elValue == 0) {
                    productOptions.each(function (option) {
                        $(option).disabled = 'disabled';
                    });
                }
                else {
                    productOptions.each(function (option) {
                        $(option).disabled = '';
                    });
                }
            });
        }
        return true;
    },

    addValidation : function () {
        Object.extend(Validation, {
            validate : function (elm, options) {
                options = Object.extend({
                    useTitle          : false,
                    onElementValidate : function (result, elm) {
                    }
                }, options || {});
                elm     = $(elm);

                var cn    = $w(elm.className);
                var vThis = this;

                return result = cn.all(function (value) {
                    if (elm.disabled) {
                        elm.removeClassName('validation-failed');
                        elm.addClassName('validation-passed');
                        var advice = Validation.getAdvice(value, elm);
                        vThis.hideAdvice(elm, advice);

                        var container = elm.up().up();
                        container.removeClassName('validation-failed');
                        container.addClassName('validation-passed');
                        return true;
                    }

                    var test = Validation.test(value, elm, options.useTitle);
                    options.onElementValidate(test, elm);
                    return test;
                });
            }
        });
    },

    hideWindow : function () {
        if (!this.windowInProcess) {
            var self = this;
            this.innerContainer.remove();
            this.window.remove();
            this.mask.remove();
            this.windowIsOpen = false;

            if (this.opConfig) {  //restore original opConfig if it was overridden in registerAndInitOpConfig
                window.opConfig = this.opConfig;
                this.opConfig = undefined;
            }

            if (this.config) {
                self.mainConfigFields.each(function (el) {
                    if (el.getValue() != '' && el.selectedIndex != 0) {
                        el.update();
                    }
                });

                var product = new Product.Config(this.config);

                self.mainConfigFields.each(function (field) {
                    self.selectedOptions.each(function (option) {
                        if (option.value != '' && option.id == field.id) {
                            $(field).setValue(option.value);
                            if (field.selectedIndex != -1) {
                                product.configureElement(field);
                            }
                        }
                    });
                });
            }

            window.optionsPrice = self.optionsPrice;

            self.callObservers('hide');
        }
    },

    closeQuickview : function () {
        if (this.mainBundle) {
            bundle = this.mainBundle;
            this.mainBundle = null;
        }
        if (typeof stStatus !== 'undefined') {
            stStatus.setStockStatus(this.selectionStockStatus);
            this.selectionStockStatus = null;
        }
        document.body.style.overflowY = '';
        this.hideWindow();
        return false;
    },

    _getScrollTop : function () {
        var doc = document.documentElement, body = document.body;

        return (doc && doc.scrollTop || body && body.scrollTop || 0);
    },

    _handleResponse : function (transport) {
        this.windowInProcess = false;
        if (transport.status == 200) {
            var response = this._parseResponse(transport);
            if (!response.error) {
                return response;
            } else {
                this._showMessages(response.error);
            }
        }

        return false;
    },

    _removeMessages : function () {
        var e = $('qv-messages');
        if (e) {
            e.remove();
        }
    },

    _showMessages : function (message, isSuccess) {
        var self = this;
        if (!message) {
            return;
        }
        var cssClass = isSuccess ? 'success-msg' : 'error-msg';

        this._removeMessages();
        var messageUl = new Element('ul', {
            'class' : 'messages',
            id      : 'qv-messages'
        });

        var messages = [];
        if (typeof message == 'object') {
            messages = message;
        } else {
            messages.push(message);
        }

        messages.each(function (m) {
            var errorMsgLi = new Element('li', {'class' : cssClass}).update(
                new Element('ul').update(
                    new Element('li').update(m)
                )
            );

            messageUl.insert(errorMsgLi);
        });

        if (!this.innerContainer || !$(this.innerContainer)) {
            this.innerContainer = new Element("div", {id : this.containerId});
            this.window.update(this.innerContainer);
        }

        //if ($(this.loader) && $(this.loader).length) {
        //    this.loader.remove();
        //}

        this.innerContainer.insert({top : messageUl});
    },

    _showMask : function () {
        this.mask = new Element("div", {
            id      : "qvMask",
            'class' : 'maskStyle'
        });
        $(document.body).insert({'top' : this.mask});
        jQuery(this.mask).fadeIn(this.fadeSpeed);
        Event.observe(this.mask, 'click', this.hideWindow);
    },

    ajaxFailure : function (transport) {
        var response = this._parseResponse(transport);
        if (response.error) {
            this._showMessages(response.error);
        } else {
            alert('Some error occurred');
        }
    },

    addToCart : function (form) {
        var self = this;
        if (self.windowInProcess) {
            return;
        }
        self._showInsideLoader();
        self._addEcommercePurchaseInfo(form);
        new Ajax.Request(
            form.action,
            {
                method     : 'post',
                onComplete : self._removeInsideLoader.bind(self),
                onSuccess  : function (transport) {
                    var response    = self._parseResponse(transport);
                    self.getSubmitButtons().each(function (el) {
                        el.enable();
                    });
                    if (response.error) {
                        self._showMessages(response.error);
                    } else {
                        self.innerContainer.update(response.message);
                        updateCartView(response);
                    }
                },
                onFailure  : self.ajaxFailure.bind(self),
                parameters : Form.serialize(form)
            }
        );
    },

    _addEcommercePurchaseInfo : function (form) {
        if (typeof insertEcommerceElementToForm == 'function') {
            insertEcommerceElementToForm($(form), 'quick_view')
        }
    },

    _showInsideLoader : function () {
        this.windowInProcess = true;
        // this code is no longer needed since we add loader to buttons
        //this.insideMask = new Element("div", {
        //    id      : "insideMask",
        //    'class' : 'maskStyle'
        //});
        //this.insideMask.insert(new Element("div", {'class' : "qvLoader"}));
        //this.window.insert(this.insideMask);
    },

    _removeInsideLoader : function () {
        this.windowInProcess = false;
        this.getSubmitButtons().each(function (btn) {
            btn.removeClassName("btn-updating").blur();
        });
        //if (this.insideMask) {
        //    this.insideMask.remove();
        //}
    },

    _parseResponse : function (transport) {
        var response;
        if (transport && transport.responseText) {
            try {
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
        }

        return response;
    },

    _isAllowedBrowser : function () {
        if (navigator.userAgent.toLowerCase().indexOf('ipad') > -1) {
            return false;
        }
        return true;
    }
};
