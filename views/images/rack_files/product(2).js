Product.OptionsPrice.prototype.observers = [];
Product.OptionsPrice.prototype.dispatchEvent = function (eventName) {
    if (this.observers.hasOwnProperty(eventName)) {
        for (var alias in this.observers[eventName]) if (this.observers[eventName].hasOwnProperty(alias)) {
            this.observers[eventName][alias].call(this, alias.replace(/_alias$/, ''));
        }
    }
};

Product.OptionsPrice.prototype.addObserver = function (eventName, fn, alias) {
    //this.removeObserver(eventName, alias);
    if (alias) {
        alias += '_alias';
    }

    if (!this.observers.hasOwnProperty(eventName)) {
        this.observers[eventName] = [];
    }

    alias = alias || this.observers[eventName].length;
    this.observers[eventName][alias] = fn;
};

Product.OptionsPrice.prototype.removeObserver = function (eventName, alias) {
    if (this.observers.hasOwnProperty(eventName)) {
        if (alias) {
            alias += '_alias';
            if (this.observers[eventName].hasOwnProperty(alias)) {
                delete this.observers[eventName][alias];
            }
        } else {
            for (var i in this.observers[eventName]) if (this.observers[eventName].hasOwnProperty(i)) {
                if (!isNaN(parseFloat(i))) {
                    delete this.observers[eventName][i];
                }
            }
        }
    }
};

Product.OptionsPrice.prototype.reload = Product.OptionsPrice.prototype.reload.wrap(function (parentMethod) {
    var self = this;
    if(this.productId) {
        self.setQtyToOneForValidSelection(this.productId);
    }
    $H(this.containers).each(function (pair, i) {
        self.insertPrice(pair, self.getCalculatedPrice(pair, i == Object.keys(self.containers).length - 1));
    }.bind(this));

    if (this.tierPrices) {
        for (var i = 0; i < this.tierPrices.length; i++) {
            $$('.price.tier-' + i).each(function (el) {
                var price = this.tierPrices[i] + parseFloat(optionPrices);
                el.innerHTML = this.formatPrice(price);
            }, this);
            $$('.price.tier-' + i + '-incl-tax').each(function (el) {
                var price = this.tierPricesInclTax[i] + parseFloat(optionPrices);
                el.innerHTML = this.formatPrice(price);
            }, this);
            $$('.benefit').each(function (el) {
                var parsePrice = function (html) {
                    return parseFloat(/\d+\.?\d*/.exec(html));
                };
                var container = $(this.containers[3]) ? this.containers[3] : this.containers[0];
                var price = parsePrice($(container).innerHTML);
                var tierPrice = $$('.tier-price.tier-' + i + ' .price');
                tierPrice = tierPrice.length ? parsePrice(tierPrice[0].innerHTML, 10) : 0;
                var $percent = Selector.findChildElements(el, ['.percent.tier-' + i]);
                $percent.each(function (el) {
                    el.innerHTML = Math.ceil(100 - ((100 / price) * tierPrice));
                });
            }, this);
        }
    }

    this.dispatchEvent('reload_price_' + this.productId);
});

Product.OptionsPrice.prototype.setQtyToOneForValidSelection = function (id) {
    var wrapper = $$('.product-purchase-wrapper-' + id)[0];
    if(wrapper) {
        var optionSelect = wrapper.down('select');
        var qtyField = wrapper.down('.item-qty input');

        if (optionSelect && optionSelect.value !== '' && qtyField && qtyField.value === '0') {
            qtyField.value = '1';
        } else if (optionSelect && optionSelect.value === '' && qtyField) {
            qtyField.value = '0';
        }
    }
};

Product.OptionsPrice.prototype.getCalculatedPrice = function (pair, cleanCache) {
    if (typeof cleanCache == 'undefined') {
        cleanCache = true;
    }

    if (pair && !$(pair.value)) {
        if (cleanCache) {
            this.cleanPriceCache();
        }
        return;
    }

    if (!pair && 0 in this.containers) {
        pair = null;
        $H(this.containers).each(function (container) {
            pair = container;
            throw $break;
        });
    }

    var price;
    var formattedPrice;
    if (!this.cachedOptionPrices) {
        this.cachedOptionPrices = this.getOptionPrices();
    }

    var nonTaxable = this.cachedOptionPrices[1];
    var optionOldPrice = this.cachedOptionPrices[2];
    var priceInclTax = this.cachedOptionPrices[3];
    var optionPrices = this.cachedOptionPrices[0];

    var _productPrice;
    var _plusDisposition;
    var _minusDisposition;
    var _priceInclTax;
    if (pair.value == 'old-price-' + this.productId && this.productOldPrice != this.productPrice) {
        _productPrice = this.productOldPrice;
        _plusDisposition = this.oldPlusDisposition;
        _minusDisposition = this.oldMinusDisposition;
    } else {
        _productPrice = this.productPrice;
        _plusDisposition = this.plusDisposition;
        _minusDisposition = this.minusDisposition;
    }
    _priceInclTax = priceInclTax;

    if (pair.value == 'old-price-' + this.productId && optionOldPrice !== undefined) {
        price = optionOldPrice + parseFloat(_productPrice);
    } else if (this.specialTaxPrice == 'true' && this.priceInclTax !== undefined && this.priceExclTax !== undefined) {
        price = optionPrices + parseFloat(this.priceExclTax);
        _priceInclTax += this.priceInclTax;
    } else {
        price = optionPrices + parseFloat(_productPrice);
        _priceInclTax += parseFloat(_productPrice) * (100 + this.currentTax) / 100;
    }

    if (this.specialTaxPrice == 'true') {
        var excl = price;
        var incl = _priceInclTax;
    } else if (this.includeTax == 'true') {
        // tax = tax included into product price by admin
        var tax = price / (100 + this.defaultTax) * this.defaultTax;
        var excl = price - tax;
        var incl = excl * (1 + (this.currentTax / 100));
    } else {
        var tax = price * (this.currentTax / 100);
        var excl = price;
        var incl = excl + tax;
    }

    var subPrice = 0;
    var subPriceincludeTax = 0;
    Object.values(this.customPrices).each(function (el) {
        if (el.excludeTax && el.includeTax) {
            subPrice += parseFloat(el.excludeTax);
            subPriceincludeTax += parseFloat(el.includeTax);
        } else {
            subPrice += parseFloat(el.price);
            subPriceincludeTax += parseFloat(el.price);
        }
    });
    excl += subPrice;
    incl += subPriceincludeTax;

    if (typeof this.exclDisposition == 'undefined') {
        excl += parseFloat(_plusDisposition);
    }

    incl += parseFloat(_plusDisposition) + parseFloat(this.plusDispositionTax);
    excl -= parseFloat(_minusDisposition);
    incl -= parseFloat(_minusDisposition);

    //adding nontaxlable part of options
    excl += parseFloat(nonTaxable);
    incl += parseFloat(nonTaxable);

    if (pair.value == 'price-including-tax-' + this.productId) {
        price = incl;
    } else if (pair.value == 'price-excluding-tax-' + this.productId) {
        price = excl;
    } else if (pair.value == 'old-price-' + this.productId) {
        price = excl;
    } else {
        if (this.showIncludeTax) {
            price = incl;
        } else {
            price = excl;
        }
    }

    if (price < 0) price = 0;

    if (price > 0 || this.displayZeroPrice) {
        formattedPrice = this.formatPrice(price);
    } else {
        formattedPrice = '';
    }

    if (cleanCache) {
        this.cleanPriceCache();
    }

    return formattedPrice;
};

Product.OptionsPrice.prototype.cleanPriceCache = function () {
    this.cachedOptionPrices = null;
};

Product.OptionsPrice.prototype.formatPrice = function (price) {
    return formatCurrency(Math.round(price*100)/100, this.priceFormat);
};

Product.OptionsPrice.prototype.insertPrice = function (pair, formattedPrice) {
    if (formattedPrice === undefined) {
        return;
    }

    if ($(pair.value).select('.price')[0]) {
        $(pair.value).select('.price')[0].innerHTML = formattedPrice;
        if ($(pair.value + this.duplicateIdSuffix) && $(pair.value + this.duplicateIdSuffix).select('.price')[0]) {
            $(pair.value + this.duplicateIdSuffix).select('.price')[0].innerHTML = formattedPrice;
        }
    } else {
        $(pair.value).innerHTML = formattedPrice;
        if ($(pair.value + this.duplicateIdSuffix)) {
            $(pair.value + this.duplicateIdSuffix).innerHTML = formattedPrice;
        }
    }
};

/**
 * Fix for "Uncaught TypeError: Cannot read property 'config' of undefined" on dependable options when opening QuickView
 * with configurable product.
 */
Product.Config.prototype.reloadOptionLabels = function (element) {
    var selectedPrice;
    if (element.selectedIndex
        && element.selectedIndex in element.options
        && element.options[element.selectedIndex].config
        && !this.config.stablePrices
    ) {
        selectedPrice = parseFloat(element.options[element.selectedIndex].config.price)
    }
    else {
        selectedPrice = 0;
    }
    for (var i = 0; i < element.options.length; i++) {
        if (element.options[i].config) {
            element.options[i].text = this.getOptionLabel(element.options[i].config, element.options[i].config.price - selectedPrice);
        }
    }
};

/**
 * Fix for "Uncaught TypeError: Cannot read property 'config' of undefined" on dependable options when opening QuickView
 * with configurable product.
 */
Product.Config.prototype.reloadPrice = function (element) {
    if (this.config.disablePriceReload) {
        return;
    }
    var price    = 0;
    var oldPrice = 0;
    for (var i = this.settings.length - 1; i >= 0; i--) {
        var selected = this.settings[i].options[this.settings[i].selectedIndex];
        if (selected && selected.config) {
            price += parseFloat(selected.config.price);
            oldPrice += parseFloat(selected.config.oldPrice);
        }
    }

    optionsPrice.changePrice('config', {'price': price, 'oldPrice': oldPrice});
    optionsPrice.reload();

    return price;
};

/**
 * Fix for "Uncaught TypeError: Cannot read property 'allowedProducts' of undefined" when clicking BIN signup button in
 * QuickView.
 */
Product.Config.prototype.fillSelect = function (element) {
    var attributeId = element.id.replace(/[a-z]*/, '');
    var options     = this.getAttributeOptions(attributeId);
    this.clearSelect(element);
    element.options[0]           = new Option('', '');
    element.options[0].innerHTML = this.config.chooseText;

    var prevConfig = false;
    if (element.prevSetting) {
        prevConfig = element.prevSetting.options[element.prevSetting.selectedIndex];
    }

    if (options) {
        var index = 1;
        for (var i = 0; i < options.length; i++) {
            var allowedProducts = [];
            if (prevConfig) {
                for (var j = 0; j < options[i].products.length; j++) {
                    if (prevConfig.config
                        && prevConfig.config.allowedProducts
                        && prevConfig.config.allowedProducts.indexOf(options[i].products[j]) > -1
                    ) {
                        allowedProducts.push(options[i].products[j]);
                    }
                }
            } else {
                allowedProducts = options[i].products.clone();
            }

            if (allowedProducts.size() > 0) {
                options[i].allowedProducts = allowedProducts;
                element.options[index]     = new Option(this.getOptionLabel(options[i], options[i].price), options[i].id);
                if (typeof options[i].price != 'undefined') {
                    element.options[index].setAttribute('price', options[i].price);
                }
                element.options[index].config = options[i];
                index++;
            }
        }
    }
};

var qtyValidator = {
    processErrorMessage : function (qtyInput, currentPurchaseTable, forceResult) {
        var cartInlineError,
            classToSelect,
            element            = qtyInput || currentPurchaseTable,
            purchaseArea       = element ? element.up('.product-shop-default, .product-purchase-group') : null,
            isProductToolboard = element ? element.up('.product-tool-board') : null

        if (typeof quickView != 'undefined' && quickView.windowIsOpen) {
            classToSelect = ".cart-in-line-error-quickview";
        } else {
            classToSelect = ".cart-in-line-error";
        }
        if (purchaseArea) {
            cartInlineError = purchaseArea.down(classToSelect);
        } else {
            cartInlineError = $$(classToSelect)[0];
        }
        var isValid = (forceResult != undefined && forceResult)
                || (forceResult == undefined && qtyInput != null && parseInt(qtyInput.value) > 0);

        if (!isProductToolboard) {
            if (cartInlineError) {
                if (isValid) {
                    cartInlineError.hide();
                } else {
                    cartInlineError.show();
                }
            } else if (!isValid) {
                alert('Please specify the product(s) quantity');
            }
        }
    },

    addHandlersToQtyFields : function () {
        var className        = ".product-cart-box-grouped",
            qtyClassName     = "input.input-text.qty:not(.qty-disabled)",
            productTypeElems = $$(className),
            i                = 0, productTypeElem;
        while (productTypeElem = productTypeElems[i++]) {
            if (productTypeElem != undefined) {
                productTypeElem.select(qtyClassName).each(function (qtyField) {
                    if (!qtyField.isAlreadyObservable) {
                        qtyField.isAlreadyObservable = true;

                        var fn = function (event) {
                            if (this.getAttribute('data-skip-qty-validation')) {
                                return;
                            }
                            var valid = false;
                            this.up(className).select(qtyClassName).each(function (el) {
                                if (parseInt(el.value) > 0) {
                                    valid = true;
                                    throw $break;
                                }
                            });

                            if (!valid && (typeof event.eventName != 'undefined' && !event.isTrusted)) {
                                valid = true;
                            }

                            qtyValidator.processErrorMessage(this, null, valid);
                        };
                        qtyField.observe('change', fn);
                        qtyField.observe('qty:change', fn);
                    }
                });
            }
        }
    }
};

//Fix for tier prices
Product.OptionsPrice.prototype.initialize = Product.OptionsPrice.prototype.initialize.wrap(function (parentMethod, options) {
    this.tierPricesQty        = options.tierPricesQty;
    this.tierPricesQtyInclTax = options.tierPricesQtyInclTax;
    parentMethod.call(this, options);
});


document.observe('dom:loaded', function () {
    // Fix for bundle change price - we have "optionsPrice" object per each child of the grouped product
    if (typeof Product.Bundle !== 'undefined') {
        document.observe('bundle:reload-price', function (event) {
            var bundleOptionsPrice = window['optionsPrice' + event.memo.bundle.config.bundleId]
                ? eval('optionsPrice' + event.memo.bundle.config.bundleId)
                : eval('optionsPrice_qv_' + event.memo.bundle.config.bundleId);
            // similar to Product.Bundle.reloadPrice
            if (!event.noReloadPrice && typeof(bundleOptionsPrice) !== 'undefined') {
                bundleOptionsPrice.specialTaxPrice = 'true';
                bundleOptionsPrice.changePrice('bundle', event.memo.price);
                bundleOptionsPrice.changePrice('nontaxable', event.memo.dispositionPrice);
                bundleOptionsPrice.changePrice('priceInclTax', event.memo.priceInclTax);
                bundleOptionsPrice.reload();
            }
        });
    }

    qtyValidator.addHandlersToQtyFields();
    if (typeof quickView != 'undefined') {
        quickView.addShowObserver(qtyValidator.addHandlersToQtyFields);
    }
});
