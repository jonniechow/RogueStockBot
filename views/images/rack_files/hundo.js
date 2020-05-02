if (typeof Product == 'undefined') {
    var Product = {};
}
Product.Hundo = Class.create();
Product.Hundo.prototype = {
    initialize: function (config) {
        this.config = config;
        this.priceTemplate = new Template(this.config.template);
        this.tiers = $H(this.config.tiers).sortBy(function(pair){
            return parseFloat(pair.key);
        });
        this.products = $H(this.config.products);
        this.quantities = new Hash();
        this.currentWeight = 0;
        this.currentPrice = 0;
        this.originalPrice = 0;
        this.discount = 0;
        this.currentTier = null;
        this.nextTier = null;
        if (this.config.autoLoad) {
            this.configureInputElements();
            this.listenProductOptions();
        } else {
            document.observe("dom:loaded", this.configureInputElements.bind(this));
            document.observe("dom:loaded", this.listenProductOptions.bind(this));
        }
    },

    /**
     * @return {Array<Element>}
     */
    getProductElements : function () {
        return this.products.map(function (product) {
            return $('grouped-product-item-' + product.key);
        });
    },

    /**
     * @return {Element|undefined}
     */
    getContainer : function () {
        var container, element = this.config.first_product
            ? $('grouped-product-item-' + this.config.first_product)
            : this.getProductElements().find(function (element) {
            return element;
        });
        if (element) {
            container = element.up('.grouped-items-table').next('.hundo-container');
        }

        return container;
    },

    optionOnChange : function (element) {
        if (element.target.id) {
            var matches = (element.target.id).match(/(\d+)+_(\d+)+/);
            if (matches.length > 2) {
                fireEvent($('grouped-product-item-' + matches[2]), 'keyup');
            }
        }
    },

    listenProductOptions : function () {
        $$('.product-custom-option').each(function (element) {
            Element.observe(element, 'change', this.optionOnChange);
        }.bind(this))
    },

    configureInputElements: function () {
        this.getProductElements().each(function (element) {
            var self = this;
            if (element) {
                this.addProductQty(element);
                var updateFn = function (event) {
                    var e = (window.event) ? event.srcElement : event.currentTarget;
                    self.addProductQty(e);
                    self.calculateCurrentWeightAndPrice();
                    self.updateElements();
                };

                Element.observe(element, 'keyup', updateFn);
                Element.observe(element, 'qty:change', updateFn);
                Element.observe(element, 'qty:reload', updateFn);

                element.observe('focus', function (event) {
                    var e = (window.event) ? event.srcElement : event.currentTarget;
                    var value = parseInt(e.value,10);
                    if (0 >= value) {
                        e.value = '';
                    }
                }.bind(this));
                element.observe('blur', function (event) {
                    var e = (window.event) ? event.srcElement : event.currentTarget;
                    var value = parseInt(e.value,10);
                    e.value = isNaN(value) ? 0: value;
                }.bind(this));
            }
        }.bind(this));
        this.calculateCurrentWeightAndPrice();
        this.updateElements();
    },

    addProductQty: function(e) {
        var arr = e.id.split("-");
        var productId = parseInt(arr[arr.length - 1],10);
        var int = parseInt(e.value,10);
        var qty = 0;
        if (int == e.value) {
            qty = int;
        }
        var newValue = $H();
        newValue.set(productId, qty);
        this.quantities = this.quantities.merge(newValue);
    },

    calculateCurrentWeightAndPrice: function() {
        var weight      = 0,
            price       = 0,
            optionPrice = 0,
            discount    = 0;

        this.quantities.each(function(pair){
            var productId = pair.key;
            var qty = pair.value;
            var productData = this.products.get(productId);
            var productWeight = 0;
            var productPrice = 0;

            if (productData) {
                productWeight = productData.weight;
                productPrice = parseFloat(productData.price);
            }

            weight += productWeight * qty;
            price += productPrice * qty;

        }.bind(this));

        this.currentWeight = weight;

        this.determineTier();
        if (this.currentTier) {
            discount = this.currentTier.value.discount * weight;
        }
        optionPrice = this.checkOptionsPrice();
        var finalPrice = parseFloat(price + optionPrice) - parseFloat(discount);
        this.originalPrice = price + optionPrice;
        this.currentPrice = finalPrice;
        this.discount = discount;
    },

    checkOptionsPrice : function () {
        if (typeof opConfig === 'undefined' || !opConfig.config) {
            return 0;
        }

        var price      = 0,
            quantities = this.quantities._object,
            config     = opConfig.config;

        $$('.product-custom-option').each(function (element) {
                var optionId = 0,
                    matches  = 0;

                element.name.sub(/[0-9]+_[0-9]+/, function (match) {
                    optionId = match[0];
                    matches  = optionId.match(/(\d+)+_(\d+)+/);
                });

                if (
                    matches
                    && matches.length > 2
                    && quantities[matches[2]]
                    && config[optionId]
                    && (element.type === 'select-one' || element.type === 'select-multiple')
                    && element.options
                ) {
                    $A(element.options).each(function (selectOption) {
                        if (selectOption.selected && config[optionId][selectOption.value]) {
                            price += parseFloat(config[optionId][selectOption.value]) * quantities[matches[2]];
                        }
                    });
                }
            }
        );

        return price;
    },

    updateElements: function() {
        var untilNextTier          = 0;
        var formattedPrice         = this.formatPrice(this.currentPrice);
        var formattedOriginalPrice = this.formatPrice(this.originalPrice);

        if (this.currentTier && this.nextTier) { // On a tier, but can upgrade
            untilNextTier = parseInt(this.nextTier.key - this.currentWeight, 10);
        } else if (this.nextTier) { // Not on a tier yet, but close
            untilNextTier = parseInt(this.nextTier.key - this.currentWeight, 10);
        }

        var container;
        if (!(container = this.getContainer())) {
            return;
        }

        var currentWeightElement = container.down(".hundo-current-weight");
        if (currentWeightElement) {
            currentWeightElement.innerHTML = parseInt(this.currentWeight, 10);
        }

        var alertContainerNoTier  = container.down(".hundo-pricing-alert-container-no-tier");
        var alertContainerTier    = container.down(".hundo-pricing-alert-container-tier");
        var alertContainerTopTier = container.down(".hundo-pricing-alert-container-top-tier");
        if (alertContainerNoTier && alertContainerTier && alertContainerTopTier) {
            if (0 < untilNextTier) {
                alertContainerTopTier.hide();
                container.select('.hundo-next-tier-delta').each(function (element) {
                    element.innerHTML = untilNextTier;
                });

                if (this.currentTier) {
                    alertContainerNoTier.hide();
                    alertContainerTier.setStyle({display: "block"});
                } else {
                    alertContainerNoTier.setStyle({display: "block"});
                    alertContainerTier.hide();
                }

            } else {
                alertContainerNoTier.hide();
                alertContainerTier.hide();
                alertContainerTopTier.setStyle({display: "block"});
            }
        }

        var hundoPriceContainer = container.down('.hundo-price-container');
        if (hundoPriceContainer) {
            var originalPriceElement = container.down('.hundo-original-price');
            var hundoPriceElement    = container.down('.hundo-price');
            if (0 < this.currentPrice && this.currentPrice != this.originalPrice) {
                var priceElement = container.down('.hundo-price');
                if (priceElement) {
                    priceElement.innerHTML = formattedPrice;
                }

                if (originalPriceElement) {
                    originalPriceElement.addClassName('hundo-old');
                    hundoPriceElement.addClassName('hundo-new');
                }
                hundoPriceContainer.show();
            } else {
                if (originalPriceElement) {
                    originalPriceElement.removeClassName('hundo-old');
                    hundoPriceElement.removeClassName('hundo-new');
                }
                hundoPriceContainer.hide();
            }
        }

        var originalPriceElement = container.down('.hundo-original-price');
        if (originalPriceElement) {
            originalPriceElement.innerHTML = formattedOriginalPrice;
        }
    },

    determineTier: function() {
        var tier = null;
        var nextTier = null;

        this.tiers.each(function(pair){
            if (pair.key <= this.currentWeight) {
                tier = pair;
            } else {
                nextTier = pair;
                throw $break;
            }
        }.bind(this));

        this.currentTier = tier;
        this.nextTier = nextTier;
    },

    formatPrice: function(price, showSign){
        var str = '';
        price = parseFloat(price);
        if(showSign){
            if(price<0){
                str+= '-';
                price = -price;
            }
            else{
                str+= '+';
            }
        }

        var roundedPrice = (Math.round(price*100)/100).toString();

        if (this.prices && this.prices[roundedPrice]) {
            str+= this.prices[roundedPrice];
        }
        else {
            str+= this.priceTemplate.evaluate({price:price.toFixed(2)});
        }
        return str;
    }
}
