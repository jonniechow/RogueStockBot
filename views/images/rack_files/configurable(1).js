StockStatus = Class.create();
StockStatus.prototype =
{
    initObservers              : [],
    options                    : null,
    selectionStockStatus       : null,

    initialize : function (options) {
        this.options = options;
        //save current value of selectionStockStatus if StockStatus is overridden
        if (typeof stStatus != 'undefined') {
            this.selectionStockStatus = stStatus.selectionStockStatus;
        }
    },

    showStockAlert : function (code) {
        var optionWrapper = $('product-options-wrapper'),
            beforeNode    = optionWrapper.childElements()[0],
            span          = document.createElement('span');

        span.id = 'roguebin-stockalert';
        span.innerHTML = code;

        optionWrapper.insertBefore(span, beforeNode);
    },

    hideStockAlert : function () {
        this._hideElement('#roguebin-stockalert');
    },

    onConfigure : function (key, settings, cartItemId, parentProductId) {
        var oos = false;
        this.hideStockAlert();
        if (!cartItemId) {
            var purchaseArea = null;
            if (settings.length) {
                purchaseArea = settings[0].up('.product-purchase');
                var outOfStock = true;
                settings.each(function (item) {
                    for (var i = 0; i < item.config.options.length && outOfStock; i++) {
                        var options = item.config.options[i].additional_options;
                        for (var key in options) {
                            if (options[key].isInStock) {
                                outOfStock = false;
                                break;
                            }
                        }
                    }
                    if (!outOfStock) {
                        return;
                    }
                });
            }
            this.changeCartButtonStatus(outOfStock, purchaseArea);
        }
        var self     = this,
            keyParts = key.split(',');

        settings.each(function (item, k) {
            var mainOptions = null;
            for (var i = 0; i < item.config.options.length; i++) {
                if (item.config.options[i].id == item.value) {
                    mainOptions = item.config.options[i];
                    break;
                }
            }

            if (!mainOptions) {
                return;
            }

            var keyPartsLengthActual = keyParts.filter(function (item) {
                return item;
            }).length;

            var keyForLabel = key;
            if (keyPartsLengthActual == keyParts.length) {
                var newKeyPars                    = keyParts.slice(0);
                newKeyPars[newKeyPars.length - 1] = "";
                keyForLabel                       = newKeyPars.join(',');
            }

            var settingOptions,
                itemProductId = item.getAttribute('data-productId');
            for (i = 0; i < settings[keyParts.length - 1]['config']['options'].length; i++) {
                settingOptions = typeof settings[keyParts.length - 1].getOptions == 'function' ? settings[keyParts.length - 1].getOptions() : settings[keyParts.length - 1].options;
                if (settingOptions) {
                    for (var j = 0; j < settingOptions.length; j++) {
                        var opt          = settings[keyParts.length - 1]['config']['options'][i],
                            element      = settingOptions[j],
                            elementValue = element.value || element.optionValue;
                        if (opt['id'] == elementValue && opt['additional_options'] && opt['additional_options'][keyForLabel + elementValue]) {
                            var price         = opt.formatedPrice != undefined ? opt.formatedPrice : '',
                                currentConfig = opt['additional_options'][keyForLabel + elementValue],
                                text          = currentConfig.label;

                            if (element.tagName == 'OPTION') {
                                element.text = text + price;
                                opt.label    = text;
                            } else {
                                element.title = (currentConfig.stockTitle || text) + price;
                                opt.title     = text;
                            }
                        }
                    }
                }
            }

            self._removeStockStatus(itemProductId, cartItemId);

            if (k != keyParts.length - 1) {
                return;
            }
            var options                 = mainOptions['additional_options'][key],
                additionalOosContainers = [],
                useParentArea           = item.getAttribute('data-useParentArea'),
                parentArea              = useParentArea ? item.up('.product-purchase') : null;
            if (options) {
                parentProductId         = options.parent_id ? options.parent_id : parentProductId;
                var isQuickView         = typeof quickView != 'undefined' && quickView.windowIsOpen,
                    items               = $$(
                        '.cart-product-container .details-prefix-' + cartItemId,
                        (isQuickView ? '#qvWindow ' : '') + '#sliding_option_' + itemProductId
                    );

                if (isQuickView) {
                    parentArea = item.up('#qvContainer');
                }

                if (!items.length) {
                    var productId   = parentProductId ? parentProductId : itemProductId,
                        selector;

                    if (isQuickView) {
                        selector                = '.bottom-buttons' + (productId ? '-' + productId : '') + ' .add-to-cart';
                        if (!useParentArea) {
                            additionalOosContainers = additionalOosContainers.concat($$('#qvWindow .additional-oos-message-' + itemProductId));
                        }
                    } else {
                        selector                = '.product-options-bottom' + (productId ? '-' + productId : '') + ' .add-to-cart';
                        if (!useParentArea) {
                            additionalOosContainers = additionalOosContainers.concat($$('.additional-oos-message-' + itemProductId));
                        }
                    }

                    items = items.concat(parentArea ? parentArea.select(selector) : $$(selector));
                }

                items.each(function (pricebox) {
                    var span        = document.createElement('span'),
                        binTemplate = $('rogueBinTemplate');

                    if (!binTemplate) {
                        return;
                    }

                    span.id = 'roguebin-status'
                        + (itemProductId ? '-' + itemProductId : '')
                        + (cartItemId ? '-' + cartItemId : '');

                    span.innerHTML = binTemplate.innerHTML
                        .replace(/\{product_id\}/g, options.product_id)
                        .replace(/\{product_name}/g, options.product_name)
                        .replace(/\{custom_status}/g, options.custom_status)
                        .replace(/\{parent_id}/g, parentProductId);

                    var cart_element         = pricebox.getElementsByClassName("col-1")[0],
                        quick_view           = document.getElementById('qvContainer'),
                        parentContainer      = isQuickView ? quick_view : document,
                        cart_box             = parentContainer.getElementsByClassName("product-cart-box-configurable")[0],
                        color_swatch_wrapper = parentContainer.getElementsByClassName("color-swatch-wrapper")[0];

                    if (cart_element) { // if on cart page
                        cart_element.appendChild(span);
                    } else if (quick_view && cart_box) { // if on quick view
                        cart_box.appendChild(span);
                    } else if (quick_view && color_swatch_wrapper) {
                        color_swatch_wrapper.appendChild(span);
                    } else {
                        pricebox.appendChild(span);
                    }

                    // Make it work for both, quick view and product page
                    var item = (quick_view && cart_box) ? cart_box : (quick_view && color_swatch_wrapper) ? color_swatch_wrapper : pricebox;

                    $(item).select('.bin-out-of-stock-default').each(function (elem) {
                        elem.setStyle({display : 'none'});
                    });

                    $(item).select('.bin-out-of-stock-option').each(function (elem) {
                        $(elem).setStyle({
                            'display' : (options['hideStatus'] == 1 && options['binEnabled'] ? 'none' : 'block')
                        });
                    });

                    var availabilityTextElement = cart_box ? cart_box.select('p.availability span')[0] : undefined;
                    if (typeof availabilityTextElement === 'undefined' && typeof cart_element !== 'undefined') {
                        availabilityTextElement = cart_element.select('div.availability')[0];
                    }

                    var availabilityText = typeof availabilityTextElement !== 'undefined' ? availabilityTextElement.innerHTML : '';
                    if (!availabilityText || (availabilityText != options.custom_status && availabilityText !== options.stockTitle)) {
                        $(item).select('.bin-out-of-stock-status').each(function (elem) {
                            $(elem).setStyle({'display' : (options['hideStatus'] == 1 ? 'none' : 'block')});
                        });
                    }

                    $(item).select('.bin-out-of-stock-message').each(function (elem) {
                        $(elem).setStyle({
                            'display' : (options.isInStock || options['binEnabled'] == 1 ||
                            (options['custom_status'] && !options['show_default_status']) ? 'none' : 'block')
                        });
                    });

                    $(item).select('.bin-signup-dropper').each(function (elem) {
                        $(elem).setStyle({'display' : (options['binEnabled'] == 1 ? 'block' : 'none')});
                    });

                    $(item).select('.bin-default-status').each(function (elem) {
                        $(elem).setStyle({'display' : (options['show_default_status'] == 1 ? 'inline' : 'none')});
                    });
                }.bind(this));

                oos = !options.isInStock;
                if (self.selectionStockStatus && itemProductId) {
                    self.selectionStockStatus[itemProductId] = +!oos;
                }
            }

            var isOOS = options && !options.isInStock;
            if (typeof item.binHideQty == 'function') {
                if (isOOS) {
                    item.binHideQty.call(item);
                }
                additionalOosContainers.each(function (oosContainer) {
                    if (isOOS) {
                        Element.show(oosContainer);
                    } else {
                        Element.hide(oosContainer);
                    }
                });
            } else if (isOOS && options.stockAlert) {
                self.showStockAlert(options.stockAlert);
            }

            if (!cartItemId) {
                self.changeCartButtonStatus(self._getIsOOS(isOOS), parentArea);
            }
        });

        return oos;
    },

    changeCartButtonStatus : function (isOOS, parentContainer) {
        var buttons = parentContainer ? parentContainer.select('.add-to-cart') : $$('.add-to-cart');
        buttons.each(function (elem) {
            elem.select('button.btn-add-to-cart').each(function (btn) {
                if (isOOS) {
                    btn.hide();
                } else {
                    btn.show();
                }
            });
        });
    },

    /**
     * Set stock status of product options in grouped product.
     *
     * @param {Object} stockStatus
     *
     * @returns void
     */
    setStockStatus : function (stockStatus) {
        this.selectionStockStatus = stockStatus;
    },

    /**
     * Get stock status for current product configuration.
     *
     * @param   {boolean} isOOS
     *
     * @returns {boolean}
     */
    _getIsOOS : function (isOOS) {
        //selectionStockStatus is applicable only for grouped products
        if (this.selectionStockStatus) {
            //check that all selected options are OOS
            isOOS = true;
            for (var productId in this.selectionStockStatus) {
                if (this.selectionStockStatus.hasOwnProperty(productId) && this.selectionStockStatus[productId]) {
                    isOOS = false;
                    break;
                }
            }
        }

        return isOOS;
    },

    _removeStockStatus : function (productId, cartItemId) {
        var postfix = (productId ? '-' + productId : '') + (cartItemId ? '-' + cartItemId : '');
        this._hideElement('#roguebin-status' + postfix);
    },

    _hideElement : function (elementSelector) {
        var prefix = '';

        if (typeof quickView != 'undefined' && quickView.windowIsOpen) {
            prefix = '#qvWindow '
        }

        if ($$(prefix + elementSelector).length) {
            $$(prefix + elementSelector).each(function (el) {
                el.remove();
            })
        }
    }
};

if (typeof Product == 'undefined') {
    var Product = {};
    Product.Config = Class.create();
}

Product.Config.prototype.configure = function (event) {
    var element = Event.element(event);
    this.configureElement(element);
    var key = '';
    this.settings.each(function (element) {
        key += element.value + ',';
    });
    key = key.substr(0, key.length - 1);

    stStatus.onConfigure(key, this.settings);
};

Product.Config.prototype.loadStatus = function () {
    var key = '';
    stStatus.onConfigure(key, this.settings);
};
