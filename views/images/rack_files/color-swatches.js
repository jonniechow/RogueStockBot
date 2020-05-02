if (typeof Product === 'undefined') {
    var Product = {};
}
if (typeof RogueConfigurableOptionPrices === 'undefined') {
    var RogueConfigurableOptionPrices = {};
}
/**
 * Hides old price and special price label when both prices are equal.
 *
 * @see customcolors-swatches.scss
 */
document.observe("color-swatches:reloadPrice", function (event) {
    var el, table, wrapper, priceContainer, className = 'force-special-price-regular';
    if ((el = event.memo.jsObject.settings[0])
        && (table = el.up('.product-purchase'))
        && (wrapper = table.down('.product-purchase-wrapper-' + event.memo.jsObject.productId))
        && (priceContainer = wrapper.down('.force-special-price'))
    ) {
        if (event.memo.price != event.memo.oldPrice) {
            priceContainer.removeClassName(className);
        } else {
            priceContainer.addClassName(className);
        }
    }
});

var configPrototype                  = Object.clone(Product.Config.prototype);
Product.RogueColorSwatches           = Class.create();
Product.RogueColorSwatches.prototype = Object.extend(configPrototype, {
    instances       : {},
    elementConfigs  : {},
    configElements  : {},
    elementSettings : {},
    settingOptions  : {},
    useSelects      : true,
    currentDataSet  : null,
    oosClass        : 'swatch-oos',
    noSignUpClass   : 'swatch-nosignup',
    selectionCache  : {},
    initialize      : function (config, productPostfix, productId, isRelated, isDefaultSwatches, openedSectionIndex, customAttributeCode) {
        if (!config) {
            return;
        }
        this.translator           = typeof colorSwatchTranslations !== 'undefined' ? colorSwatchTranslations : new Translate();
        this.productId            = productId;
        this.config               = config;
        this.taxConfig            = this.config.taxConfig;
        this.isRelated            = !!isRelated;
        this.isDefaultSwatches    = !!isDefaultSwatches;
        this.customAttributeCode  = customAttributeCode;
        this.settingsWithOptions  = $$('.color-swatch-container-' + productPostfix + '-' + this.getRelatedIndex());
        this.settings             = this.settingsWithOptions.filter(function (element) {
            return !element.hasClassName('color-swatch-container-' + this.customAttributeCode);
        }.bind(this));
        this.hiddenOptionElements = {};
        this.state                = {};
        this.customOptionState    = {};
        this.priceTemplate        = new Template(this.config.template);
        this.productPostfix       = productPostfix;
        this.ieVersion            = ieVersion;
        this.containerClass       = 'color-swatch-wrapper';
        this.optionItemClass      = 'swatch-item';
        this.priceObject          = window['optionsPrice' + this.productPostfix] || optionsPrice;
        this.fullPriceAttributes  = [];
        this.simplePrices         = config.simple_prices;
        if (this.simplePrices) {
            this.priceObject.salePrice    = this.priceObject.productPrice;
            this.priceObject.productPrice = this.priceObject.productOldPrice;
        }
        this.configPrototype     = configPrototype;
        this.showOOSNotification = false;
        this.isPromoShow         = false;
        this.openedSectionIndex  = openedSectionIndex === undefined ? this.settings.length - 1 : openedSectionIndex;
        this.currentStateCode    = '';
        this.customOptionLabels  = [];
        this._initCustomOptionLabels();

        var mainImageDataSrc, mainImage;
        if ((mainImage = $('main-image')) && (mainImageDataSrc = mainImage.getAttribute('data-src'))) {
            this.mainImage               = mainImage;
            var split                    = mainImageDataSrc.split('?');
            this.mainImageUrl            = this.mainImage ? split[0] : '';
            var mainImageQueryParams     = this.mainImage ? split[1] : '';
            this.mainImageUrlQueryParams = mainImageQueryParams ? $H(mainImageQueryParams.toQueryParams()) : $H({});
            this.mainImageUrlQueryParams.unset('$color');
        }

        if (config.options_prices) {
            Object.extend(window.RogueConfigurableOptionPrices, config.options_prices);
        }

        this.init();

        if (!this.instances.hasOwnProperty(productId)) {
            this.instances[productId] = {};
        }

        this.instances[productId][this.getRelatedIndex()] = this;

        // Set default values from config
        if (config.defaultValues) {
            this.values = config.defaultValues;
        }

        // Overwrite defaults by url
        var separatorIndex = window.location.href.indexOf('?'); // GET parameters are priority
        if (separatorIndex === -1) {
            separatorIndex = window.location.href.indexOf('#');
        }
        if (separatorIndex !== -1) {
            var paramsStr = window.location.href.substr(separatorIndex + 1);
            var urlValues = paramsStr.toQueryParams();
            if (!this.values) {
                this.values = {};
            }
            for (var i in urlValues) if (urlValues.hasOwnProperty(i)) {
                //implementation for: ?287=2895 - there is unexpected result for multiple configurables inside grouped!
                if (this.isNumeric(i) && this.isNumeric(urlValues[i])) {
                    this.values[i] = urlValues[i];
                } else {
                    //implementation for: #product[1773][shirt_color]=black
                    param = i.match(/^product\[(\d+)\]\[(.+)\]$/);
                    if (param && param.length == 3 && param[1] == productId) {
                        this.values[param[2]] = urlValues[i];
                    }
                }
                //implementation for: #shirt_color=black
                //this.values[i] = urlValues[i];
            }
        }

        //set settings to each element
        this.settingsWithOptions.each(function (element) {
            var split       = element.id.split('-'),
                attributeId = split[split.length - 1];
            if (attributeId && this.config.attributes[attributeId]) {
                element.config      = this.config.attributes[attributeId];
                element.attributeId = attributeId;
                if (!this.isRelated) {
                    element.binHideQty = this.binHideQty.bind(this, element);
                }
            }
        }.bind(this));

        this.generateSwatchArea(isRelated);

        if (!this.isRelated) {
            // Set values to inputs
            this.configureForValues();
            document.observe("dom:loaded", this.configureForValues.bind(this));

            //show placeholder image and init scene7
            if (this.mainImage) {
                if (!this.mainImage.getAttribute('data-configured')) {
                    this.configureImageSrc(false);
                    this.mainImage.show();
                }
                if (window.s7_zoomviewer) {
                    window.s7_zoomviewer.init();
                }
            }

            if (typeof LiveCalculation != 'undefined') {
                var liveCalc = new LiveCalculation();
                liveCalc.addObserverByProduct(productId);
            }
        }

        this.setPromoQtyObserver();
        this.setAutoSelectObserver();
    },

    isNumeric : function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    setAutoSelectObserver : function () {
        document.observe("promo-countdown:addProduct", function (event) {
            var self = this;
            if (!self.isPromoShow) {
                self.isPromoShow = true;
                var productsQtys = event.memo.productQtys;
                var productIds   = [];
                for (var i in productsQtys) {
                    if (productsQtys[i] > 0) {
                        productIds.push(i);
                    }
                }
                if (!self.values) {
                    self.values = {};
                }
                var intersected = null, intersectedTemp;
                for (var i = 0; i < self.settings.length; i++) {
                    var dropdown = self.settings[i];
                    var options  = self.getAttributeOptions(dropdown.attributeId);
                    for (var j = 0; j < options.length; j++) {
                        var option         = options[j];
                        var optionProducts = option.products;
                        if (intersected === null) {
                            intersected = productIds;
                        }
                        intersectedTemp = optionProducts.intersect(intersected);
                        if (intersectedTemp.length) {
                            self.values[dropdown.attributeId] = option.id;
                            intersected                       = intersectedTemp;
                            break;
                        }
                    }
                }

                if (Object.keys(self.values).length) {
                    self.configureForValues();
                }
            }
        }.bind(this));
    },

    init : function () {
    },

    configureForValues : function () {
        if (this.values && Object.keys(this.values).length) {
            this.settings.each(function (element, j) {
                var attributeCode = element.config.code,
                    attributeId   = element.attributeId,
                    value;
                [attributeCode, attributeId].each(function (code, i) {
                    value = (typeof(this.values[code]) == 'undefined') ? '' : this.values[code];
                    if (!i && this.getOptionsBySetting(element).length && value) {
                        var valueIsFound = false;
                        this.getOptionsBySetting(element).each(function (item) {
                            if (this.getConfigByElement(item) && this.parseLabel(this.getConfigByElement(item).realLabel) == this.parseLabel(value)) {
                                value        = this.getConfigByElement(item).id;
                                valueIsFound = true;
                                throw $break;
                            }
                        }.bind(this));

                        if (!valueIsFound) {
                            value = false;
                        } else {
                            throw $break;
                        }
                    }
                }.bind(this));

                if (value) {
                    this.setValue(element, value, true);
                    var el = this.getElementByConfig(this.getSelectedOptionConfig(element));
                    if (el) {
                        this.configure(el, true, false, j == this.settings.length - 1 && !this.isRelated, true);
                    }
                }
            }.bind(this));

            // Set default custom options
            if (!this.isRelated) {
                var customOptionElement;
                if (customOptionElement = this.getSettingById(this.customAttributeCode)) {
                    var options = customOptionElement.select('.' + this.customAttributeCode + '-option');
                    if (options.length) {
                        options.each(function (element, i) {
                            var isTheLast = i === options.length - 1;
                            this.configure(element, true, false, isTheLast, isTheLast, true);
                        }.bind(this));
                        this.toggleElementWrapper(customOptionElement, false);
                    }
                }
            }
        }
    },

    generateSwatchArea : function (isRelated) {
        var childSettings = [];
        for (var i = this.settingsWithOptions.length - 1; i >= 0; i--) {
            var prevSetting        = this.settingsWithOptions[i - 1] ? this.settingsWithOptions[i - 1] : false,
                nextSetting        = this.settingsWithOptions[i + 1] ? this.settingsWithOptions[i + 1] : false;
            this.settingsWithOptions[i].index = i;
            if (i === 0) {
                this.fillSwatchArea(this.settingsWithOptions[i], isRelated)
            } else {
                this.settingsWithOptions[i].disabled = true;
            }
            this.settingsWithOptions[i].childSettings = childSettings.clone();
            this.settingsWithOptions[i].prevSetting   = prevSetting;
            this.settingsWithOptions[i].nextSetting   = nextSetting;
            childSettings.push(this.settingsWithOptions[i]);
        }
    },

    fillSwatchArea : function (element, isRelated) {
        //ability to use dropdowns
        if (this.useSelects && this.isSelect(element)) {
            return this.fillSelect(element);
        }
        var self        = this,
            attributeId = element.attributeId,
            options     = this.getAttributeOptions(attributeId);

        this.clearArea(element);
        element.getOptions              = function () {
            return self.getOptionsBySetting(this);
        };
        this.settingOptions[element.id] = [{value : 0}];
        if (this.state[element.config.id]) {
            this.setState(element.config.id, false);
        }

        if (!this.collapsible) {
            this.toggleElementWrapper(element, true);
        }

        if (!this.isRelated) {
            var label = this.getAttributeLabel(element);
            if (label && typeof label.defaultContent === 'undefined') {
                label.defaultContent = label.innerHTML;
            }
        }

        //create hidden input
        var elementName,
            mainWrapper = this.getElementMainWrapper(element);
        if (this.isDefaultSwatches) {
            elementName = 'super_attribute[' + attributeId + ']';
        } else if (element.config.id === this.customAttributeCode) {
            elementName = 'additional_attributes[' + this.productId + '][' + attributeId + ']'; // not related to server
        } else {
            elementName = 'config_attributes[' + this.productId + '][' + attributeId + ']';
        }
        element.hiddenInput = mainWrapper
            ? mainWrapper.down('[name="' + elementName + '"]')
            : this.getElementWrapper(element).down('[name="' + elementName + '"]');
        if (!isRelated) {
            if (element.hiddenInput) {
                Element.remove(element.hiddenInput);
            }
            element.hiddenInput = new Element('input', {
                type      : 'hidden',
                className : 'required-entry',
                name      : elementName
            });

            Element.insert(mainWrapper, element.hiddenInput);
        }

        if (!element.hiddenInput) {
            element.hiddenInput = elementName;
        }

        var prevConfig = false;
        if (element.prevSetting) {
            prevConfig = this.getSelectedOptionConfig(element.prevSetting);
        }

        if (options) {
            var index = 1;
            for (var i = 0; i < options.length; i++) {
                options[i].index    = element.index;
                var allowedProducts = [];
                if (prevConfig) {
                    for (var j = 0; j < options[i].products.length; j++) {
                        if (prevConfig.allowedProducts
                            && prevConfig.allowedProducts.indexOf(options[i].products[j]) > -1) {
                            allowedProducts.push(options[i].products[j]);
                        }
                    }
                } else {
                    allowedProducts = options[i].products.clone();
                }

                if (allowedProducts.length) {
                    var el                                 = this.createSwatchElement(element, options[i], index);
                    options[i].allowedProducts             = allowedProducts;
                    options[i].elementId                   = el.id;
                    this.elementConfigs[el.id]             = options[i];
                    this.configElements[options[i].id]     = el;
                    this.elementSettings[el.id]            = element;
                    this.settingOptions[element.id][index] = el;

                    Element.insert(element, el);
                    index++;
                }
            }

            var swatchOptionContainer;
            if (!this.isRelated && (swatchOptionContainer = element.up('.swatch-option-container'))) {
                if (index === 1) {
                    if (element.hiddenInput) {
                        Element.remove(element.hiddenInput);
                    }
                    swatchOptionContainer.hide();
                } else {
                    swatchOptionContainer.show();
                }
            }
        }
    },

    setState : function (key, value) {
        this.selectionCache = {};
        if (value !== undefined) {
            this.state[key] = value;
        } else {
            this.state = key;
        }
    },

    fillSelect : function (element) {
        var self        = this,
            options     = self.getAttributeOptions(element.attributeId),
            originValue = this.state[element.config.id];
        self.clearSelect(element);
        if (this.state[element.config.id]) {
            this.setValue(element, false);
        }
        var option                      = new Option('', '');
        element.options[0]              = option;
        option.innerHTML                = self.config.chooseText;
        self.settingOptions[element.id] = [{value : 0}];
        option.id                       = element.id + '_empty';
        self.elementSettings[option.id] = element;

        var prevConfig = false;
        if (element.prevSetting) {
            prevConfig = self.getSelectedOptionConfig(element.prevSetting);
        }

        if (options) {
            var index = 1;
            for (var i = 0; i < options.length; i++) {
                var allowedProducts = [];
                if (prevConfig) {
                    for (var j = 0; j < options[i].products.length; j++) {
                        if (prevConfig.allowedProducts
                            && prevConfig.allowedProducts.indexOf(options[i].products[j]) > -1) {
                            allowedProducts.push(options[i].products[j]);
                        }
                    }
                } else {
                    allowedProducts = options[i].products.clone();
                }

                if (allowedProducts.size() > 0) {
                    options[i].allowedProducts = allowedProducts;
                    var el                     = new Option(self.getOptionLabel(options[i], options[i].price), options[i].id);
                    element.options[index]     = el;
                    if (typeof options[i].price != 'undefined') {
                        el.setAttribute('price', options[i].price);
                    }
                    el.config = options[i];

                    el.id                              = element.id + '-' + options[i].id;
                    el.optionValue                     = options[i].id;
                    self.elementConfigs[el.id]         = options[i]; ///
                    self.configElements[options[i].id] = el;
                    options[i].elementId               = el.id;
                    self.elementSettings[el.id]        = element;

                    if (originValue && el.optionValue == originValue) {
                        this.setValue(element, originValue);
                    }

                    index++;
                }
            }
        }

        Event.observe(element, 'change', function (e) {
            self.configure(element.options[element.selectedIndex], true, false, true)
        });
    },

    getConfigByElement : function (element) {
        return this._getValueFromObject(element, 'elementConfigs');
    },

    getElementByConfig : function (config) {
        return this._getValueFromObject(config, 'configElements');
    },

    _getValueFromObject : function (obj, sourceKey) {
        return obj && typeof this[sourceKey] != "undefined" ? this[sourceKey][obj.id] : null;
    },

    getSettingByElement : function (element) {
        var id = element.elementId || element.id;
        return typeof this.elementSettings[id] != 'undefined' ? this.elementSettings[id] : null;
    },

    getOptionsBySetting : function (setting) {
        var options = [];
        if (this.isSelect(setting)) {
            for (var i = 0; i < setting.options.length; i++) {
                options.push(setting.options[i]);
            }
        } else if (this.settingOptions[setting.id] != undefined) {
            options = this.settingOptions[setting.id];
        }
        return options;
    },

    createSwatchElement : function (element, option) {
        var classLabel = this.parseLabel(option.realLabel || option.label),
            self       = this,
            key        = '',
            className  = this.optionItemClass + ' swatch-entity swatch-' + classLabel + ' swatch-' + option.id;

        //get additional option key and assigning OOS class name
        this.settings.each(function (itemSetting) {
            var selectedElement = this.getSelectedOptionConfig(itemSetting);
            if (selectedElement) {
                key += selectedElement.id + ',';
            }
            if (itemSetting.config && itemSetting.config.id == element.config.id) {
                throw $break;
            }
        }.bind(this));
        key += option.id;

        var hasNoSale, hasNoSignup, lastLevelOption = option;
        if (option.additional_options && option.additional_options.hasOwnProperty(key)) {
            lastLevelOption = option.additional_options[key];
            var classArray  = [];
            if (!lastLevelOption.isInStock) {
                classArray.push(this.oosClass);
                hasNoSale = true;
            }

            if (!lastLevelOption.binEnabled) {
                classArray.push(this.noSignUpClass);
                hasNoSignup = true;
            }

            className += ' ' + classArray.join(' ');
        }

        var el       = document.createElement("div");
        el.className = className;
        el.id        = 'swatch-' + this.getRelatedIndex() + '-' + this.productId + '-' + option.id;
        el.title     = this.getStockLabel(lastLevelOption);

        var optionHtml = this.getOptionHtml(option);
        this.updateHtml(el, optionHtml);

        el.optionValue = option.id;
        Event.observe(el, option.is_dropdown ? 'change' : 'click', function (e) {
            self.configure(e, false, false, true, undefined, option.is_dropdown)
        });

        if (hasNoSale && !hasNoSignup && !this.showOOSNotification) {
            this.showOOSNotification = true;
        }
        this.addStockNotificationObserver(el);

        return el;
    },

    /**
     * Return old price instead of promo
     */
    setPromoQtyObserver : function () {
        document.observe("promo-countdown:setQty", function (event) {
            var productId  = event.memo.productId,
                qty        = event.memo.qty,
                promoPrice = event.memo.promoPrice,
                expired    = event.memo.expired,
                option;

            if (qty !== undefined && this.simplePrices && (option = this.getOptionByProductId(productId))) {
                var simplePriceItem = this.simplePrices[option.id],
                    backupProperty  = 'backupPrice',
                    specialProperty = 'special',
                    oldValue        = simplePriceItem.price,
                    reload          = false;

                if (!qty || expired) {
                    if (!simplePriceItem.hasOwnProperty(backupProperty)) {
                        simplePriceItem[backupProperty] = simplePriceItem.price;
                    }
                    if (simplePriceItem.hasOwnProperty(specialProperty)) {
                        simplePriceItem.price = simplePriceItem[specialProperty];
                    } else {
                        simplePriceItem.price = simplePriceItem.oldPrice;
                    }

                    reload = true;
                } else if (simplePriceItem.hasOwnProperty(backupProperty) || promoPrice) {
                    // Stock returned back
                    simplePriceItem.price = promoPrice || simplePriceItem[backupProperty];

                    reload = true;
                }

                if (reload && oldValue !== simplePriceItem.price) {
                    this.reloadPrice();
                }
            }

        }.bind(this));
    },

    getOptionByProductId : function (productId) {
        var self = this, resultOption;
        self.settings.each(function (setting) {
            var options = self.getOptionsBySetting(setting);
            for (var i in options) if (options.hasOwnProperty(i)) {
                var config;
                var temp = options[i].id;
                if ((config = self.getConfigByElement(options[i])) ///
                    && config.products.length === 1
                    && config.products.indexOf(String(productId)) > -1) {
                    resultOption = config;
                    throw $break;
                }
            }
        });

        return resultOption;
    },

    getOptionHtml : function (option) {
        return '<span>' + option.realLabel + '</span>';
    },

    getOptionLabel : function (option, price, onlyFormatPrice) {
        return this._getOptionTitle(option, price, onlyFormatPrice);
    },

    getStockLabel : function (option, price, onlyFormatPrice) {
        return this._getOptionTitle(option, price, onlyFormatPrice, true);
    },

    _getOptionTitle : function (option, price, onlyFormatPrice, isStockStatus) {
        option.formatedPrice = !onlyFormatPrice ? this.parsePrice(option, price) : this.formatPrice(price);

        return (isStockStatus && option.stockTitle ? option.stockTitle : option.label) + ' ' + option.formatedPrice;
    },

    parsePrice : function (option, price) {
        if (typeof price === 'undefined') {
            price = option.price;
        }

        if (this.fullPriceAttributes.indexOf(option.index) > -1) {
            var currentPrices = this.priceObject.getOptionPrices(),
                oldPrice      = parseFloat(option.oldPrice);
            price             = parseFloat(option.price);
            this.priceObject.changePrice('config', {
                price    : price,
                oldPrice : oldPrice
            });
            price = this.priceObject.getCalculatedPrice();
            this.priceObject.changePrice('config', {
                price    : currentPrices[0],
                oldPrice : currentPrices[2]
            });

            return price;
        }

        if (option.hide_additional_price) {
            price = 0;
        }
        price = parseFloat(price);

        var tax, excl, incl, str = '';
        if (this.taxConfig.includeTax) {
            tax  = price / (100 + this.taxConfig.defaultTax) * this.taxConfig.defaultTax;
            excl = price - tax;
            incl = excl * (1 + (this.taxConfig.currentTax / 100));
        } else {
            tax  = price * (this.taxConfig.currentTax / 100);
            excl = price;
            incl = excl + tax;
        }

        if (this.taxConfig.showIncludeTax || this.taxConfig.showBothPrices) {
            price = incl;
        } else {
            price = excl;
        }

        if (price) {
            if (this.taxConfig.showBothPrices) {
                str = this.formatPrice(excl, true) + ' (' + this.formatPrice(price, true) + ' ' + this.taxConfig.inclTaxTitle + ')';
            } else {
                str = this.formatPrice(price, true);
            }
        }

        return str;
    },

    parseLabel : function (label) {
        return label.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\W+/g, '-');
    },

    formatPrice : function (price, showSign) {
        var str = '';
        price   = parseFloat(price);
        if (showSign) {
            if (price < 0) {
                str += '-';
                price = -price;
            }
            else {
                str += '+';
            }
        }

        var roundedPrice = (Math.round(price * 100) / 100).toString();

        if (this.prices && this.prices[roundedPrice]) {
            str += this.prices[roundedPrice];
        }
        else {
            str += this.priceTemplate.evaluate({price : price.toFixed(2)});
        }
        return str;
    },

    configureElement : function (element, fromInit) {
        var value           = element.optionValue,
            swatchContainer = this.getSettingByElement(element),
            stateBefore     = Object.clone(this.state);

        this.showOOSNotification = false;
        this.setValue(swatchContainer, value, fromInit);
        if (value) {
            var nextSetting = swatchContainer.nextSetting;
            while (nextSetting) {
                nextSetting.disabled = false;
                var isItemSelect     = this.isSelect(nextSetting);
                this.fillSwatchArea(nextSetting);
                if (isItemSelect) {
                    nextSetting.selectedIndex = 0;
                    this.resetChildren(nextSetting);
                } else if (nextSetting.config.id in stateBefore && stateBefore[nextSetting.config.id]) {
                    this.setValue(nextSetting, stateBefore[nextSetting.config.id]);
                }
                this.reloadOptionLabels(nextSetting, true);

                if (nextSetting.config.id === this.customAttributeCode) {
                    this.restoreCustomOptionState();
                    this.toggleElementWrapper(nextSetting, false);
                }

                if (!nextSetting.optionValue && !this.getSelectedOptionConfig(nextSetting)) {
                    break;
                }

                nextSetting = nextSetting.nextSetting;
            }
            this.reloadOptionLabels(swatchContainer, true);
        } else if (this.isSelect(swatchContainer)) {
            this.resetChildren(swatchContainer);
        }
    },

    isSelect : function (element) {
        return element.tagName === 'SELECT';
    },

    reloadRelatedPrice : function () {
        var relatedInstance = this.isRelated ? this : this.getOppositeInstance(),
            mainInstance    = this.isRelated ? this.getOppositeInstance() : this,
            self            = this;

        if (!relatedInstance) {
            relatedInstance = mainInstance;
        }

        if (mainInstance
            && relatedInstance
            && mainInstance.settings.length > 1
            && relatedInstance.settings.length
        ) {
            var initialState        = Object.clone(mainInstance.state),
                lastSetting         = mainInstance.settings[mainInstance.settings.length - 1],
                firstSetting        = relatedInstance.settings[0],
                firstRelatedOptions = relatedInstance.getOptionsBySetting(firstSetting),
                firstMainOptions    = mainInstance.getOptionsBySetting(mainInstance.settings[0]),
                selectedSimple;

            if ((selectedSimple = mainInstance.getSelectedOptionConfig(lastSetting))) {
                for (var i in firstRelatedOptions) {
                    if (firstRelatedOptions.hasOwnProperty(i)
                        && firstRelatedOptions[i].optionValue
                        && firstMainOptions.hasOwnProperty(i)) {

                        mainInstance.setState(firstSetting.config.id, firstRelatedOptions[i].optionValue);
                        var priceObject = mainInstance.getOptionPriceDiff(selectedSimple, false, true);
                        if (priceObject !== null) {
                            [firstRelatedOptions[i], firstMainOptions[i]].each(function (option) {
                                if (option) {
                                    var priceContainer;
                                    option.title = self.getStockLabel(self.getConfigByElement(option), priceObject.price, true);
                                    if (priceContainer = option.down('.swatch-price')) {
                                        priceContainer.update(self.formatPrice(priceObject.price));
                                    }
                                }
                            });
                        }
                    }
                }
                mainInstance.setState(initialState);
            }
        }
    },

    getSelectedParams : function (asObject, useDefaultColor) {
        useDefaultColor = useDefaultColor === undefined ? true : useDefaultColor;
        if (this.isRelated && this.getOppositeInstance()) {
            return this.getOppositeInstance().getSelectedParams(asArray, useDefaultColor);
        }

        var self           = this,
            params         = asObject ? {} : [],
            attributeCodes = [];

        self.settingsWithOptions.each(function (setting) {
            if (setting.config.id !== self.customAttributeCode) {
                var option = self.getSelectedOptionConfig(setting);
                if (option) {
                    attributeCodes.push(self._prepareOptionForScene7(setting.config.code, option, asObject, params));
                }
            } else {
                var currentValues = {};
                setting.select('.' + self.customAttributeCode + '-option').each(function (element) {
                    currentValues[this.parseLabel(element.config.realLabel)] = element.options[element.selectedIndex].config;
                }.bind(self));

                self.customOptionLabels.each(function (label) {
                    attributeCodes.push(
                        self._prepareOptionForScene7(
                            label,
                            label in currentValues
                                ? currentValues[label]
                                : 'na'
                            ,
                            asObject,
                            params
                        )
                    );
                }.bind(self));
            }
        });
        //hardcoded color param
        if (attributeCodes.indexOf('color') === -1 && useDefaultColor) {
            if (asObject) {
                params['$color'] = 'black';
            } else {
                params.push('$color=black');
            }
        }

        return asObject ? params : params.join('&');
    },

    _prepareOptionForScene7: function(code, option, asObject, params) {
        var label = option;
        if (option instanceof Object) {
            label = this.parseLabel(
                option.sku
                || option.realLabel
                || option.label
                || option.title
            );
        }
        label = label.replace(/^-+|-+$/gm, '');

        code      = this.parseLabel(code);

        if(code === 'wheels' && label === 'na'){
          label = 'nw';
        }

        var key   = '$' + (asObject ? code : encodeURIComponent(code)),
            value = asObject ? label : encodeURIComponent(label);

        if (key === '$rig_color') {
            key = '$color';
        }

        if (code.indexOf('color') !== -1) {
            code = 'color';
        }

        if (asObject) {
            params[key] = value;
        } else {
            params.push(key + '=' + value);
        }

        return code;
    },

    reloadOptionLabels : function (element, updateHTML) {
        var selectedPrice = 0,
            currentOption = this.getSelectedOptionConfig(element),
            selectedDiffObject,
            options       = this.getOptionsBySetting(element);

        if (currentOption && !this.config.stablePrices) {
            selectedPrice = parseFloat(currentOption.price);
            if (selectedDiffObject = this.getOptionPriceDiff(currentOption)) {
                selectedPrice = selectedDiffObject.price;
            }
        }

        for (var i in options) if (options.hasOwnProperty(i)) {
            var config, option = options[i];
            if (config = this.getConfigByElement(option)) {
                var priceDiff = this.getOptionPriceDiff(config);
                if (priceDiff === null) {
                    priceDiff = config.price - selectedPrice;
                } else {
                    priceDiff = priceDiff.price;
                    if (!selectedDiffObject && this.hasSalePrice()) {
                        priceDiff -= this.priceObject.salePrice - this.priceObject.productPrice;
                    }
                }

                if (selectedDiffObject !== undefined && selectedDiffObject !== null) {
                    priceDiff -= selectedDiffObject.price;
                }

                option.title = this.getStockLabel(config, priceDiff);
                if (this.isSelect(element)) {
                    option.text = this.getOptionLabel(config, priceDiff);
                } else if (updateHTML) {
                    this.updateHtml(option, this.getOptionHtml(config, priceDiff));
                }
            }
        }
    },

    /**
     * Check if final price less than regular price.
     *
     * @returns {boolean}
     */
    hasSalePrice : function () {
          return this.priceObject.hasOwnProperty('salePrice')
              && this.priceObject.salePrice < this.priceObject.productPrice;
    },

    updateHtml : function (element, html) {
        Element.update(element, html);
    },

    getOptionPriceDiff : function (option, subtractPrevious, returnSimple) {
        if (subtractPrevious === undefined) {
            subtractPrevious = true;
        }
        var optionPriceKey;

        if (this.simplePrices
            && (optionPriceKey = this.getOptionsKeyByOption(option))
            && this.simplePrices.hasOwnProperty(optionPriceKey)
        ) {
            var previousPrice    = 0,
                previousOldPrice = 0,
                productPrice     = returnSimple ? 0 : this.priceObject.productPrice,
                productOldPrice  = returnSimple ? 0 : this.priceObject.productOldPrice;

            if (subtractPrevious) {
                var prevSetting = this.getSettingByElement(option).prevSetting;

                while (prevSetting) {
                    var selected;
                    if (selected = this.getSelectedOptionConfig(prevSetting)) {
                        previousPrice += parseFloat(selected.price);
                        previousOldPrice += parseFloat(selected.oldPrice);
                    }

                    prevSetting = prevSetting.prevSetting;
                }
            }

            // add price from custom options
            // @todo: might be a bug if price for custom option is different for different configurable products
            var currentOptionState = this.customOptionState;
            if (currentOptionState) {
                for (var key in currentOptionState) if (currentOptionState.hasOwnProperty(key)) {
                    productPrice -= parseFloat(currentOptionState[key].price);
                    productOldPrice -= parseFloat(currentOptionState[key].price);
                }
            }

            var subtract         = previousPrice + productPrice,
                oldPriceSubtract = previousOldPrice + productOldPrice;

            return {
                price    : this.simplePrices[optionPriceKey]['price'] - subtract,
                oldPrice : this.simplePrices[optionPriceKey]['oldPrice'] - oldPriceSubtract
            };
        }

        return null;
    },

    getElementWrapper : function (element) {
        return element.up('.' + this.containerClass + '-in');
    },

    getElementMainWrapper : function (element) {
        return element.up('.' + this.containerClass);
    },

    toggleElementWrapper : function (element, show) {
        if (show) {
            Element.show(this.getElementWrapper(element));
        } else {
            Element.hide(this.getElementWrapper(element));
        }
    },

    getAttributeLabel : function (element) {
        return this.getElementWrapper(element).down('label');
    },

    resetChildren : function (element) {
        if (element.childSettings) {
            for (var i = 0; i < element.childSettings.length; i++) {
                element.childSettings[i].selectedIndex = 0;
                element.childSettings[i].disabled      = true;
                this.setState(element.childSettings[i].config.id, false);
                if (element.config) {
                    this.setValue(element);
                }
            }
        }
    },

    configure : function (event, isElement, triggered, setScene7, fromInit, isCustomOption) {
        var element       = isElement ? event : Event.element(event),
            actualElement = element;
        if (element.tagName !== 'OPTION' && !element.hasClassName('swatch-entity')) {
            element = element.up('.swatch-entity');
        }

        // Automatically set quantity of configs with options selected to 1
        var qty = this.getQtyElement(element);
        if(qty && element.value === '') {
            qty.setValue(0);
        } else if(qty && parseInt(qty.getValue()) === 0) {
            qty.setValue(1);
        }

        if (!isCustomOption) {
            this.configureElement(element, fromInit);
        }
        var hiddenInput;
        if (!triggered && (hiddenInput = this.getSettingByElement(element).hiddenInput)) {
            if (isCustomOption) {
                this.setCustomOptionState(actualElement);
                Validation.validate(actualElement);
            } else {
                Validation.validate(hiddenInput);
            }

            // validate custom option
            var customElement;
            if (customElement = this.getSettingById(this.customAttributeCode)) {
                var customOptions        = customElement.select('.' + this.customAttributeCode + '-option'),
                    requiredOptionsCount = 0;

                customOptions.each(function (option) {
                    if (option.config.is_require) {
                        requiredOptionsCount++;
                    }
                });

                if ((requiredOptionsCount <= Object.keys(this.customOptionState).length)) {
                    var customHiddenInput = customElement.hiddenInput;
                    if (!customHiddenInput && customOptions[0]) {
                        customHiddenInput = customOptions[0].hiddenInput;
                    }
                    if (customHiddenInput) {
                        customHiddenInput.setValue('1');
                        Validation.validate(customHiddenInput);
                    }
                }
            }
        }

        if (!this.isRelated) {
            //bin and stock status
            if (typeof stStatus !== 'undefined') {
                stStatus.onConfigure(this.getSelectedOptionConfigsKey(), this.settings);
            }

            this.reloadPrice();
        }

        if (!triggered) {
            var oppositeInstance = this.getOppositeInstance();
            if (oppositeInstance) {
                var oppositeElement = oppositeInstance.getItemByOppositeItem(element);
                if (oppositeElement) {
                    oppositeInstance.configure(oppositeElement, true, true, undefined, undefined, isCustomOption);
                }
            }
            this.reloadRelatedPrice();
        }

        if (setScene7) {
            this.configureScene7(element, fromInit);
        }
    },

    addStockNotificationObserver : function (element) {
        if (this.isDefaultSwatches) {
            var isTouchDevice = window.isTouchDevice,
                oosClass      = this.oosClass,
                noSignUpClass = this.noSignUpClass,
                hiddenClass   = 'hidden';
            var elements      = $$('.rogue_relatedproducts_selector_notice' + (isTouchDevice ? '_mobile' : '')),
                fn            = function (e) {
                    var showNotification;

                    if (e instanceof Event) {
                        var target  = e.target,
                            ptarget = e.target.up();

                        showNotification = (e.type !== "mouseleave" && (
                            (target.hasClassName(oosClass) && !target.hasClassName(noSignUpClass))
                            || (ptarget.hasClassName(oosClass) && !ptarget.hasClassName(noSignUpClass))
                        ));
                    } else {
                        showNotification = e;
                    }

                    elements.each(function (el) {
                        if (showNotification) {
                            el.removeClassName(hiddenClass);
                        } else {
                            el.addClassName(hiddenClass);
                        }
                    });
                };

            if (!isTouchDevice) {
                ['mouseenter', 'mouseleave'].each(function (eventName) {
                    element.observe(eventName, fn);
                });
            } else {
                fn(this.showOOSNotification);
            }
        }
    },

    getSelectedOptionConfigsKey : function () {
        var key = '';
        this.settings.each(function (element) {
            var selectedElement, value = '';
            if (selectedElement = this.getSelectedOptionConfig(element)) {
                value = selectedElement.id;
            }
            key += value + ',';
        }.bind(this));

        return key.substr(0, key.length - 1);
    },

    configureScene7 : function (element, fromInit) {
        var oppositeInstance;
        if (this.isRelated && (oppositeInstance = this.getOppositeInstance())) {
            return oppositeInstance.configureScene7(element, fromInit);
        }
        var value             = element.optionValue,
            configSet,
            updateCurrentData = true,
            checkMassStorage = new RegExp(/^\$mass/);
        if (value) {
            configSet = this.getSelectedParams();

            if (configSet !== Product.RogueColorSwatches.prototype.currentDataSet) {
                if (typeof(this.ieVersion) !== 'undefined' && this.ieVersion < 9) {
                    this.configureImageSrc();
                } else if (window.s7_zoomviewer && typeof window.s7_zoomviewer.setAsset === 'function') {
                    updateCurrentData = !fromInit;
                    window.s7_zoomviewer.setAsset(window.scene7asset + '?' + configSet);
                }
                if (updateCurrentData) {
                    Product.RogueColorSwatches.prototype.currentDataSet = configSet;
                }
            }
        }
        else if (typeof configureScene7 !== "undefined" && window.s7_zoomviewer) {
            window.s7_zoomviewer.setAsset(window.scene7asset);
        }
    },

    configureImageSrc : function (useDefaultColor) {
        useDefaultColor    = useDefaultColor === undefined ? true : useDefaultColor;
        var params         = this.mainImageUrlQueryParams.clone(),
            configSetArray = this.getSelectedParams(true, useDefaultColor);

        if (this.getOppositeInstance()) {
            if (!params.toQueryString()) {
                params = this.getOppositeInstance().mainImageUrlQueryParams.clone();
            }

            if (!this.mainImageUrl) {
                this.mainImageUrl = this.getOppositeInstance().mainImageUrl;
            }

            if (!this.mainImage) {
                this.mainImage = this.getOppositeInstance().mainImage;
            }
        }
        this.mainImage.setAttribute('data-configured', true);

        for (var key in configSetArray) if (configSetArray.hasOwnProperty(key)) {
            params.set(key, configSetArray[key]);
        }

        if (this.mainImage) {
            this.mainImage.setAttribute('src', this.mainImageUrl + '?' + decodeURIComponent(params.toQueryString()));
        }
    },

    getItemByOppositeItem : function (element) {
        var oppositeSetting = this.getSettingByElement(element),
            value           = element.optionValue,
            resultElement   = null;
        this.settings.each(function (setting) {
            if (setting.attributeId === oppositeSetting.attributeId) {
                var options = this.getOptionsBySetting(setting);
                options.each(function (option) {
                    if (this.getConfigByElement(option) && option.optionValue == value) {
                        resultElement = option;
                        throw $break;
                    }
                }.bind(this));

                if (resultElement) {
                    throw $break;
                }
            }
        }.bind(this));

        return resultElement;
    },

    clearArea : function (element) {
        element.innerHTML = '';
    },

    getAttributeOptions : function (attributeId) {
        if (this.config.attributes[attributeId]) {
            return this.config.attributes[attributeId].options;
        }
    },

    reloadPrice : function () {
        if (this.config.disablePriceReload) {
            return;
        }

        var lastOption  = this.getSelectedOptionConfig(this.settings[this.settings.length - 1]),
            priceObject = lastOption ? this.getOptionPriceDiff(lastOption, false) : undefined,
            price = 0, oldPrice = 0;

        if (!lastOption || priceObject === null) {
            price = 0;
            var resetPrice = true;
            for (var i = this.settings.length - 1; i >= 0; i--) {
                var selectedOption = this.getSelectedOptionConfig(this.settings[i]);

                if (selectedOption) {
                    price += parseFloat(selectedOption.price);
                    oldPrice += parseFloat(selectedOption.oldPrice);
                    resetPrice = false;
                } else if (this.hasSalePrice()) {
                    price += this.priceObject.salePrice - this.priceObject.productPrice;
                }
            }

            if (resetPrice && this.hasSalePrice()) {
                price = this.priceObject.salePrice - this.priceObject.productPrice;
            }
        }

        if (typeof priceObject !== 'object' || priceObject === null) {
            priceObject = {
                price    : price,
                oldPrice : oldPrice
            };
        }

        if (this.simplePrices) {
            document.fire("color-swatches:reloadPrice", {
                price    : priceObject.price,
                oldPrice : priceObject.oldPrice,
                jsObject : this
            });
        }
        this.priceObject.changePrice('config', priceObject);
        this.priceObject.reload();

        return price;
    },

    getSelectedOptionConfig : function (element, getFirst, value) {
        var useCache = !getFirst && !value,
            cached   = useCache ? this.selectionCache[element.id] : undefined;

        if (cached) {
            return cached;
        }

        var options       = element.config.options,
            resultOption  = null,
            checkForFirst = !value;

        if (!value) {
            value = this.state[element.config.id];
        }

        if (getFirst) {
            value = null;
        }

        // Retrieve allowed products by the first setting - do not pass a parameter into getAllowedProducts()
        var allowedProducts = checkForFirst ? this.getAllowedProducts() : [];
        if (value || getFirst) {
            options.each(function (option) {
                if (option.id
                    && (!allowedProducts.length || allowedProducts.intersect(option.products).length)
                    && (getFirst || option.id == value)
                ) {
                    resultOption = option;
                    throw $break;
                }
            }.bind(this));
        }

        if (useCache) {
            this.selectionCache[element.id] = resultOption;
        }

        return resultOption;
    },

    /**
     * Retrieve allowed products by the element
     */
    getAllowedProducts : function (element) {
        var setting        = element || this.settings[0],
            firstAttrValue = this.state[setting.config.id],
            firstOption    = firstAttrValue ? this.getSelectedOptionConfig(setting, null, firstAttrValue) : undefined;

        return firstOption ? firstOption.allowedProducts : undefined;
    },

    getOptionsKeyByOption : function (option) {
        if (!option) {
            return '';
        }

        var options      = [],
            mainSetting  = this.getSettingByElement(option),
            prevSetting  = mainSetting.prevSetting,
            nextSetting  = mainSetting.nextSetting,
            selected;

        if (mainSetting.config.id === this.customAttributeCode) {
            return '';
        }
        while (nextSetting) {
            if (nextSetting.config.id !== this.customAttributeCode
                && (selected = this.getSelectedOptionConfig(nextSetting))
            ) {
                options.push(selected.id);
            }

            nextSetting = nextSetting.nextSetting;
        }
        options = options.reverse();

        options.push(option.id);
        while (prevSetting) {
            if (prevSetting.config.id !== this.customAttributeCode
                && (selected = this.getSelectedOptionConfig(prevSetting))
            ) {
                options.push(selected.id);
            }

            prevSetting = prevSetting.prevSetting;
        }

        options = options.reverse();

        //check if simple price exists for current selection
        if (this.simplePrices
            && (!(nextSetting = this.getSettingByElement(option).nextSetting)
                || nextSetting.config.id === this.customAttributeCode)
            && !this.simplePrices.hasOwnProperty(options.join(','))
            && (selected = this.getSelectedOptionConfig(this.getSettingByElement(option), true))
        ) {
            options[options.length - 1] = selected.id;
        }

        return options.join(',');
    },

    setValue : function (element, value) {
        if (!this.isRelated) {
            this.showQty(element);
        }
        var currentOption, selectedOption, self = this;

        if (!value) {
            value = 0;
            this.setState(element.config.id, false);
            selectedOption = {products : []};
        } else {
            this.setState(element.config.id, value);
            if (!(selectedOption = this.getSelectedOptionConfig(element))) {
                selectedOption = this.getSelectedOptionConfig(element, true);
            }
            if (selectedOption) {
                value = selectedOption.id;
                this.setState(element.config.id, value);
            }
        }

        this.getOptionsBySetting(element).each(function (option) {
            var optionConfig = self.getConfigByElement(option);
            if (optionConfig) {
                if (optionConfig.id == value) {
                    currentOption = option;
                    option.addClassName('active-swatch');
                } else {
                    option.removeClassName('active-swatch');
                }
            }
        });

        if (selectedOption) {
            var selectedProduct = [];
            for (var i = 0; i < self.settings.length; i++) {
                var selectedOptionTemp = this.getSelectedOptionConfig(this.settings[i]);
                if (selectedOptionTemp) {
                    if (i === 0) {
                        selectedProduct = selectedOptionTemp.products;
                    } else {
                        selectedProduct = selectedProduct.intersect(selectedOptionTemp.products);
                    }
                } else {
                    selectedProduct = [0];
                    break;
                }
            }

            var optionKey = selectedOption.id ? this.getOptionsKeyByOption(selectedOption) : null,
                isInStock = optionKey
                    && selectedOption.hasOwnProperty('additional_options')
                    && selectedOption.additional_options.hasOwnProperty(optionKey)
                    && selectedOption.additional_options[optionKey].hasOwnProperty('isInStock')
                    ? selectedOption.additional_options[optionKey].isInStock : null;
            document.fire("color-swatches:setValue", {
                productId : selectedProduct[0],
                element   : element,
                label     : selectedOption.realLabel,
                isOOS     : !isInStock
            });
        }

        if (!this.isSelect(element)) {
            element.value = value;
        } else if (value) {
            element.setValue(value);
        }

        if (typeof element.hiddenInput === 'string') {
            element.hiddenInput = $$('[name="' + element.hiddenInput + '"]').first();
        }

        if (element.hiddenInput) {
            element.hiddenInput.setValue(value);
        }

        if (!this.isRelated && !this.isSelect(element) && !this.isDefaultSwatches) {
            var label = this.getAttributeLabel(element);
            if (label) {
                var text = '';
                if (currentOption && this.getConfigByElement(currentOption).realLabel) {
                    text += ' - ' + this.getConfigByElement(currentOption).realLabel;
                }
                label.update(label.defaultContent + ' ' + text);
            }
        }
    },

    setCustomOptionState : function (element) {
        this.customOptionState[this.parseLabel(element.config.label)] = element.options[element.selectedIndex].config;
    },

    resetCustomOptionState : function () {
        if (this.currentStateCode !== Object.toQueryString(this.state)) {
            this.currentStateCode  = Object.toQueryString(this.state);
            this.customOptionState = {};
        }
    },

    restoreCustomOptionState : function () {
        var currentValues   = this.customOptionState,
            valuesToRestore = {},
            customOptionElement;

        if (customOptionElement = this.getSettingById(this.customAttributeCode)) {
            var options = customOptionElement.select('.' + this.customAttributeCode + '-option');
            if (Object.keys(currentValues).length) {
                options.each(function (element) {
                    var label      = this.parseLabel(element.config.label);
                    if (currentValues.hasOwnProperty(label)) {
                        element.config.options.each(function (option) {
                            if (currentValues[label].sku === option.sku) {
                                valuesToRestore[label] = option.option_type_id;
                            }
                        });
                    }
                }.bind(this));
            }

            this.resetCustomOptionState();
            var optionsLength = options.length;
            options.each(function (element, i) {
                var label = this.parseLabel(element.config.label);
                if (label in valuesToRestore) {
                    element.setValue(valuesToRestore[label]);
                }
                Element.fire(element, 'custom:change');
                this.configure(element, true, false, i === optionsLength - 1, false, true);
            }.bind(this));
        }
    },

    binHideQty : function (element) {
        var qty = this.getQtyElement(element);
        if (!qty || this.isDefaultSwatches) {
            return;
        }
        qty.defaultVal = qty.getValue();
        qty.setValue(0);
        qty.disabled = true;
        Element.hide(qty);
        var label = this.getQtyLabel(qty);
        if (label) {
            Element.hide(label);
        }

        var cartError = this.getCartInlineError();
        if (cartError) {
            Element.hide(cartError);
        }
    },

    showQty : function (element) {
        var qty = this.getQtyElement(element);
        if (!qty || this.isDefaultSwatches) {
            return;
        }
        if (qty.defaultVal !== null) {
            qty.setValue(qty.defaultVal);
            qty.defaultVal = null;
        }

        qty.disabled = false;
        Element.show(qty);
        var label = this.getQtyLabel(qty);
        if (label) {
            Element.show(label);
        }
    },

    getCartInlineError : function () {
        var selector = '.product-purchase .product-options-bottom .add-to-box .cart-in-line-error';
        if (typeof quickView != 'undefined' && quickView.windowIsOpen) {
            selector = '#qvContainer .bottom-buttons .add-to-cart .cart-in-line-error-quickview';
        }

        return document.querySelector(selector);
    },

    getQtyElement : function (element) {
        var parent = element.up('.grouped-item');
        if (!parent) {
            parent = element.up('.product-cart-box');
        }

        return parent ? parent.down('input.qty') : null;
    },

    getQtyLabel : function (qty) {
        var td = qty.up('.qty-td');

        return td ? td.down('label') : null;
    },

    getRelatedIndex : function (isRelated) {
        isRelated = typeof isRelated === 'undefined' ? this.isRelated : isRelated;

        return isRelated ? 'related' : 'main';
    },

    getOppositeInstance : function () {
        return this.instances[this.productId][this.getRelatedIndex(!this.isRelated)];
    },

    getSettingById : function (id) {
        var setting;
        this.settingsWithOptions.each(function (item) {
            if (item.attributeId == id) {
                setting = item;
                throw $break;
            }
        });

        return setting;
    },

    reinitCurrentOption: function () {
        var lastOption;
        if (lastOption = this.getSelectedOptionConfig(this.settings[this.settings.length - 1])) {
            this.configureElement(this.getElementByConfig(lastOption));
        }
    },

    _initCustomOptionLabels : function () {
        var options = this.getAttributeOptions(this.customAttributeCode);
        if (options) {
            options.each(function(option) {
                var label = this.parseLabel(option.realLabel);
                if (this.customOptionLabels.indexOf(label) === -1) {
                    this.customOptionLabels.push(label);
                }
            }.bind(this));
        }
    }
});

Product.RogueColorSwatchesNumerable           = Class.create();
Product.RogueColorSwatchesNumerable.prototype = Object.extend(Object.clone(Product.RogueColorSwatches.prototype), {
    collapsible : true,
    useSelects  : false,
    init        : function () {
        this.optionItemClass     = 'swatch-item-numerable';
        this.containerClass      = 'numerable-option-wrapper';
        this.fullPriceAttributes = [0];
        this.initToggle();
    },

    getOptionHtml : function (option, price) {
        if (option.is_dropdown) {
            return this._getOptionHtmlDropdown(option)
        }

        price = this.parsePrice(option, price);
        return '<div class="swatch-name">' + option.realLabel + '</div>' +
            (this.isRelated ? '<div class="swatch-price-comment">' + this.translator.translate('<em>AS CONFIGURED</em>') + '</div>' : '') +
            (price ? '<div class="swatch-price">' + price + '</div>' : '') +
            '<div class="active-mark"></div>';
    },

    _getOptionHtmlDropdown : function (option) {
        var container    = new Element('div', {className : 'input-select'}),
            exchangeFlag = new Element('input', {
                type  : 'hidden',
                name  : 'exchange_products[' + this.productId + ']',
                value : option.product_id
            }),
            label        = new Element('label'),
            select       = new Element('select', {
                className : this.customAttributeCode + '-option',
                name      : 'options[' + option.entity_id + '_' + option.product_id + ']'
            });
        if (option.is_require) {
            label.classList.add('required');
            select.classList.add('validate-select');
        }
        label.innerHTML = option.label;
        select.config   = option;
        option.options.each(function (opt) {
            var selectOption    = new Option('', '');
            selectOption.text   = opt.title + (opt.price && opt.price != 0 ? ' ' + this.formatPrice(opt.price, true) : '');
            selectOption.value  = opt.option_type_id;
            selectOption.config = opt;
            select.add(selectOption);
        }.bind(this));

        container.insert(label);
        container.insert(select);
        container.insert(exchangeFlag);

        return container;
    },

    initToggle : function () {
        var self = this, header;
        //getElementMainWrapper
        if (self.settings[0] && (header = self.getElementMainWrapper(self.settings[0]))) {
            header.select('.numerable-option-header').each(function (el) {
                var attributeId = el.getAttribute('data-id');
                el.observe('click', function () {
                    self.togglePanel(attributeId);
                });
                self.activateHeader(attributeId);
            });
        }
    },

    togglePanel : function (attributeId) {
        var self        = this,
            mainSetting = this.getSettingById(attributeId);
        if (!mainSetting.prevSetting || mainSetting.prevSetting.value) {
            this.settingsWithOptions.each(function (setting) {
                if (setting.attributeId != attributeId) {
                    self.getElementWrapper(setting).hide();
                    self.activateHeader(setting.attributeId);
                } else {
                    self.getElementWrapper(setting).toggle();
                }
            });

            $$('body')[0].toggleClassName('ie8-height-fix');
            this.activateHeader(attributeId);
        }
    },

    activateHeader : function (attributeId, hide) {
        var header, setting;
        if (!attributeId
            || !(header = this.getHeader(attributeId))
            || !(setting = this.getSettingById(attributeId))
            || !this.getOptionsBySetting(setting).length) {
            return;
        }

        var activeClassName = 'numerable-option-header-active',
            wrapper         = $('numerable-option-wrapper-in-' + header.getAttribute('data-id'));
        header.removeClassName(activeClassName);
        if (hide === undefined) {
            hide = wrapper.visible();
        }

        if (setting.prevSetting && !setting.prevSetting.value || hide || setting.disabled) {
            this.hideCurrentLabel(attributeId);
        } else {
            this.updateCurrentLabel(attributeId, true);
        }
        if (wrapper.visible()) {
            header.addClassName(activeClassName);
        }
    },

    hideCurrentLabel : function (attributeId) {
        var header, textArea;
        if (!(header = this.getHeader(attributeId))
            || !(textArea = header.down('.selected-option'))) {
            return;
        }
        textArea.hide();
    },

    updateCurrentLabel : function (attributeId, show) {
        var header, setting, textArea;
        if (!(header = this.getHeader(attributeId))
            || !(setting = this.getSettingById(attributeId))
            || !setting.config
            || !(textArea = header.down('.selected-option'))) {
            return;
        }
        if (show) {
            textArea.show();
        }
        this.updateHtml(textArea, this._getOptionDisplayText(setting));
    },

    _getOptionDisplayText : function (setting) {
        if (setting.config.id !== this.customAttributeCode) {
            var selectedOption = this.getSelectedOptionConfig(setting);
            return selectedOption ? ('<div class="mark">' + selectedOption.realLabel + '</div>') : '';
        }

        var text = '';
        setting.select('.' + this.customAttributeCode + '-option').each(function (element, i) {
            text += '<div class="mark">' + (i + 1) + '. ' + element.options[element.selectedIndex].config.title + '</div>';
        });

        return text;
    },

    getHeader : function (attributeId) {
        return $$('.numerable-option-header[data-id="' + attributeId + '"]')[0];
    },

    toggleElementWrapper : function (element, show) {
        if (!this.isRelated) {
            Product.RogueColorSwatches.prototype.toggleElementWrapper.call(this, element, show);
        }
        this.activateHeader(element.attributeId, show);
    },

    setValue : function (element, value, fromInit) {
        Product.RogueColorSwatches.prototype.setValue.call(this, element, value);
        if (fromInit) {
            this.toggleElementWrapper(element, element.index === this.openedSectionIndex);
        } else {
            this.updateCurrentLabel(element.attributeId, false);
        }
    },

    fillSwatchArea : function (element, isRelated) {
        Product.RogueColorSwatches.prototype.fillSwatchArea.call(this, element, isRelated);
        this.updateCurrentLabel(element.attributeId);
    }
});
