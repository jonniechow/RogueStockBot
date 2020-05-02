var LiveCalculation = Class.create();

LiveCalculation.prototype = {
    initialize: function () {
        this.initDefaultPage();
    },

    calculate         : function (productId, qty) {
        var priceContainer = $('calculated-price-value_' + productId),
            priceWrapper = $('calculated-price_' + productId);

        if (!priceContainer || !priceWrapper) {
            return;
        }

        var postfix = typeof quickView != 'undefined' && quickView.windowIsOpen ? '_qv_' : '',
            priceInstance = window['optionsPrice' + postfix + productId];

        qty = Number(qty);
        if (qty < 0) {
            qty = 1;
        } else if (isNaN(qty)) {
            qty = 0;
        }

        if (typeof priceInstance == 'undefined') {
            return;
        }

        var price, formattedPrice,
            optionPrices   = priceInstance.getOptionPrices(),
            optionOldPrice = optionPrices[2],
            nonTaxable     = optionPrices[1],
            applyTierPrice = function (price, qty, inclTax) {
                var key = !inclTax ? 'tierPricesQty' : 'tierPricesQtyInclTax';
                if (priceInstance.hasOwnProperty(key)) {
                    for (var tierQty in priceInstance[key]) if (priceInstance[key].hasOwnProperty(tierQty)) {
                        if (qty >= tierQty) {
                            price = priceInstance[key][tierQty];
                        } else {
                            break;
                        }
                    }
                }

                return price;
            };

        optionPrices = optionPrices[0];

        $H(priceInstance.containers).each(function (pair) {
            var _productPrice;
            var _plusDisposition;
            var _minusDisposition;
            if ($(pair.value)) {

                //****
                if (pair.value == 'old-price-' + priceInstance.productId && priceInstance.productOldPrice != priceInstance.productPrice) {
                    _productPrice = priceInstance.productOldPrice;
                    _plusDisposition = priceInstance.oldPlusDisposition;
                    _minusDisposition = priceInstance.oldMinusDisposition;
                } else {
                    _productPrice = priceInstance.productPrice;
                    _plusDisposition = priceInstance.plusDisposition;
                    _minusDisposition = priceInstance.minusDisposition;
                }
                _productPrice = applyTierPrice(_productPrice, qty);

                if (pair.value == 'old-price-' + priceInstance.productId && optionOldPrice !== undefined) {
                    price = optionOldPrice + parseFloat(_productPrice);
                } else if (priceInstance.specialTaxPrice == 'true' && priceInstance.priceInclTax !== undefined && priceInstance.priceExclTax !== undefined) {
                    price = optionPrices + applyTierPrice(parseFloat(priceInstance.priceExclTax), qty, true);
                } else {
                    price = optionPrices + parseFloat(_productPrice);
                }

                var tax, excl, incl;
                if (priceInstance.includeTax == 'true') {
                    // tax = tax included into product price by admin
                    tax = price / (100 + priceInstance.defaultTax) * priceInstance.defaultTax;
                    excl = price - tax;
                    incl = excl * (1 + (priceInstance.currentTax / 100));
                } else {
                    tax = price * (priceInstance.currentTax / 100);
                    excl = price;
                    incl = excl + tax;
                }

                excl += parseFloat(_plusDisposition);
                incl += parseFloat(_plusDisposition);
                excl -= parseFloat(_minusDisposition);
                incl -= parseFloat(_minusDisposition);

                //adding nontaxlable part of options
                excl += parseFloat(nonTaxable);
                incl += parseFloat(nonTaxable);

                if (pair.value == 'price-including-tax-' + priceInstance.productId) {
                    price = incl;
                } else if (pair.value == 'old-price-' + priceInstance.productId) {
                    if (priceInstance.showIncludeTax || priceInstance.showBothPrices) {
                        price = incl;
                    } else {
                        price = excl;
                    }
                } else {
                    if (priceInstance.showIncludeTax) {
                        price = incl;
                    } else {
                        if (!priceInstance.skipCalculate || _productPrice == 0) {
                            price = excl;
                        } else {
                            price = optionPrices + parseFloat(_productPrice);
                        }
                    }
                }

                if (price < 0) price = 0;

                price *= qty;

                if (price > 0) {
                    formattedPrice = priceInstance.formatPrice(price);
                    priceContainer.innerHTML = formattedPrice;
                    priceWrapper.removeAttribute('style');
                } else {
                    priceWrapper.setStyle({display: 'none'});
                }

                throw $break;
            }
        });
    },
    calculateByElement: function (element, idInCenter) {
        var res = (!idInCenter ? /^.+_(\d+)$/ : /^\D+(\d+)[_|-]\d+$/).exec(element.readAttribute('id'));
        if (res && res.length >= 2 && res[1]) {
            this.calculateByProductId(res[1]);
        }
    },

    calculateByProductId: function (productId) {
        var qtyElements = $$('input[name="super_group[' + productId + ']"]');
        if (qtyElements.length) {
            this.calculate(productId, $(qtyElements[0]).getValue());
        }
    },

    observeQtyInput: function (input, isQuickView) {
        var self = this;
        if (!input.liveCalculationAdded) {
            input.liveCalculationAdded = true;
            ['keyup', 'qty:change'].each(function (event) {
                input.observe(event, function () {
                    var productId = parseInt($(input).readAttribute('name').replace(/\D+/, ''));
                    if ($(input).getValue() < 0) {
                        $(input).setValue(1);
                    }
                    self.calculate(productId, $(input).getValue(), isQuickView);
                });
            });
        }
    },

    initQuickView  : function () {
        var self = this;
        $$('#qvWindow .grouped-items-table').each(function (container) {
            //handle qty changes
            container.select('input.qty').each(function (input) {
                self.observeQtyInput(input);
            });

            //handle option changes
            container.select('.product-custom-option').each(function (element) {
                if (!element.liveCalculationAdded) {
                    element.liveCalculationAdded = true;
                    element.observe('change', function () {
                        self.calculateByElement(element);
                    });
                }
            });

            self.addObserverToConfigurableElements(container.select('.config-attribute-option'), 'qv');
        })
    },

    addObserverToConfigurableElements: function (options, alias) {
        options.each(function (element) {
            var res = /^\D+(\d+)[_|-]\d+$/.exec(element.readAttribute('id'));
            if (res && res.length > 1) {
                this.addObserverByProduct(res[1], alias);
            }
        }.bind(this));
    },

    addObserverByProduct: function (productId, alias) {
        var observerName = 'reload_price_' + productId;
        Product.OptionsPrice.prototype.removeObserver(observerName);
        Product.OptionsPrice.prototype.addObserver(observerName,
            function () {
                this.calculateByProductId(productId);
            }.bind(this), alias);

        if (typeof quickView != 'undefined' && alias == 'qv') {
            quickView.addHideObserver(function () {
                Product.OptionsPrice.prototype.removeObserver(observerName, alias);
            });
        }
    },

    initDefaultPage: function () {
        var self = this;
        //recalculating on page load
        $$('.calculated-price-value').each(function (element) {
            self.calculateByElement(element);
        });

        //handle qty changes
        var productTables = $$('.grouped-items-table');
        if (!productTables.length) {
            productTables.push($('super-product-table'));
        }
        productTables.each(function (productTable) {
            if (productTable) {
                productTable.select('input.qty').each(function (input) {
                    self.observeQtyInput(input);
                });
            }
        });

        //handle option changes
        $$('.product-custom-option').each(function (element) {
            if (!element.liveCalculationAdded) {
                element.liveCalculationAdded = true;
                element.observe('change', function () {
                    self.calculateByElement(element);
                });
            }
        });

        self.addObserverToConfigurableElements($$('.config-attribute-option'));
    }
};

Event.observe(window, 'load', function () {
    var globalLiveCalculation = new LiveCalculation();
});