var RoguePromoProductQty       = Class.create(),
    RoguePromoQty              = Class.create(),
    RoguePromoCategoryQty      = Class.create(),
    RoguePromoCategoryPage     = Class.create(),
    RoguePromoCategoryListItem = Class.create(),
    RoguePromoTimer            = Class.create();
/**
 * Time calculations
 */
var RoguePromoCalculation = {
    timeCorrection       : null,
    TIME_CORRECTION_DIFF : 3,
    requestSent          : false,
    promoControllerUrl   : '',
    startCalculation : function (object) {
        var self = this;
        self.clearTimeCalculationInterval(object);
        self.setTimeCorrection();

        delete object.secRemain;
        object.timeCalculationInterval = setInterval(self.calculateInterval.bind(self, object), 100);
        self.calculateInterval.call(this, object, 1)
    },

    /**
     * JS rely on timezone instead of real user time, so we need to correct it
     *
     * @param {number} timestamp
     */
    setTimeCorrection : function (timestamp) {
        var self = this;
        if (!this.requestSent && this.promoControllerUrl && !this.timeCorrection) {
            this.requestSent = true;
            new Ajax.Request(this.promoControllerUrl, {
                method     : 'post',
                dataType   : 'json',
                onComplete : function (transport) {
                    var resp = self._parseResponse(transport);
                    if (resp && resp.timestamp) {
                        self._setTimeCorrection(resp.timestamp);
                    } else {
                        self.requestSent = false;
                    }
                }
            });
        } else if (timestamp) {
            self._setTimeCorrection(timestamp);
        }
    },

    /**
     * @param {number} timestamp
     */
    _setTimeCorrection : function (timestamp) {
        var diff;
        this.timeCorrection = (diff = Math.round((Date.now() / 1000 - timestamp))) < this.TIME_CORRECTION_DIFF ? 0 : diff;
    },

    calculateInterval : function (object, doNotSetValue) {
        var remain = this.calculateSecRemain(object);
        if (object.secRemain === undefined || object.secRemain != remain) {
            object.secRemain = remain;
            if (object.secRemain <= 0) {
                this.clearIntervals(object);
                object.clearIntervalCallback();
            } else {
                this.setTimerHtml(object, object.promoCleared);
                if (object.promoCleared) {
                    this.clearTimeCalculationInterval(object);
                }
            }
            if (doNotSetValue) {
                delete object.secRemain;
            }
        }
    },

    clearTimeCalculationInterval : function(object) {
        if (object.timeCalculationInterval) {
            clearInterval(object.timeCalculationInterval);
        }
    },

    setTimerHtml : function (object, setToNUll) {
        var element = typeof object.getTimeElement === 'function' ? object.getTimeElement() : object.element;
        if (!element) {
            return;
        }

        setToNUll = !!setToNUll;

        var time = setToNUll ? 0 : object.secRemain,
            sec  = Math.floor(time) % 60,
            min  = Math.floor(time / 60) % 60,
            hour = Math.floor(time / (60 * 60)) % 24,
            days = Math.floor(time / (60 * 60 * 24));

        sec  = this.adjustLeadZero(sec);
        min  = this.adjustLeadZero(min);
        hour = this.adjustLeadZero(hour);
        days = this.adjustLeadZero(days);

        if (!object.disableFormatting) {
            var daysWord = 'day' + (days == 1 ? '' : 's');
            days         = days == '00' ? '' : '<span class="days">' + days + '<span class="indicator">' + daysWord + '</span></span> ';

            element.innerHTML = days + '<span class="hours">' + hour + ':<span class="indicator">hrs</span></span><span class="minutes">' + min + ':<span class="indicator">min</span></span><span class="seconds">' + sec + '<span class="indicator">sec</span></span>';
        } else {
            element.innerHTML = (days != '00' ? days + ':' : '') + hour + ':' + min + ':' + sec;
        }

        if (typeof object.afterTimeSet === 'function') {
            object.afterTimeSet();
        }
    },

    adjustLeadZero : function (val) {
        val = String(val);

        return val.length < 2 ? '0' + val : val;
    },

    clearIntervals : function (object) {
        object.secRemain = 0;
        object.time      = 0;
        RoguePromoCalculation.setTimerHtml(object);
        var intervals = [object.timeCalculationInterval, object.qtyUpdateInterval];
        intervals.forEach(function (item) {
            if (item) {
                clearInterval(item);
            }
        });
    },

    clearPromo : function (object) {
        object.promoCleared = true;
    },

    restorePromo : function (object) {
        object.promoCleared = false;
        RoguePromoCalculation.startCalculation(object);
    },

    calculateSecRemain : function (object) {
        var endTime     = object.time,
            gmtOffset   = object.gmtOffset,
            currentDate = new Date();

        //convert to system timezone
        currentDate.setTime(currentDate.getTime() + gmtOffset * 1000 - (this.timeCorrection * 1000));

        var secRemain = endTime - currentDate.getTime() / 1000;
        secRemain     = Math.ceil(secRemain);
        if (secRemain < 0) {
            secRemain = 0;
        } else {
            secRemain = Math.abs(secRemain);
        }

        return secRemain;
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
    }
};

/**
 * Promo timer on product page
 */
RoguePromoTimer.prototype = {
    hasProductsWithoutQty : false,
    initialize            : function (promoControllerUrl, timeFrom, productId, element, gmtOffset, updateUrl, wrappers, expired, mbfTopBanner) {
        RoguePromoCalculation.promoControllerUrl = promoControllerUrl;
        this.ROGUE_PROMO_STATE_ACTIVE   = 0;
        this.ROGUE_PROMO_STATE_UPCOMING = 1;
        this.ROGUE_PROMO_STATE_EXPIRED  = 2;
        this.DELAY_IF_STATES_NOT_SYNCED = 1000;
        this.productId                  = productId;
        this.updateUrl                  = updateUrl;
        this.element                    = $(element);
        this.wrappers                   = wrappers;
        this.mbfTopBanner               = mbfTopBanner;
        this.expired                    = expired;
        this.executed                   = false;
        this.fromActiveState            = false; // case when we need to transit from expired to active
        this.form                       = this.getWrappers()[0].up('form');
        this.isGrouped                  = this.getWrappers()[0].hasClassName('type-grouped');

        if (!expired) {
            this.time      = timeFrom;
            this.gmtOffset = gmtOffset;
            RoguePromoCalculation.startCalculation(this);
        }
    },

    clearIntervalCallback : function (triggerSingle, triggerOnResult) {
        var self = this;
        if (self.executed) {
            return;
        }

        self.executed = true;

        if (!triggerSingle && !triggerOnResult) {
            self.triggerPromoState();
        }

        if (self.expired && window.rPromoCountdown) {
            self.clearPromoMarkup();
            return;
        }

        new Ajax.Request(self.updateUrl, {
            method     : 'post',
            dataType   : 'json',
            parameters : {product_id : self.productId, expired : self.expired ? 1 : 0, trigger_single : triggerSingle},
            onComplete : function (transport) {
                if (!triggerSingle && triggerOnResult) {
                    self.triggerPromoState();
                }
                var resp                     = RoguePromoCalculation._parseResponse(transport),
                    incorrectStateRegistered = true,
                    evaluatedState           = {fromActiveState : self.fromActiveState, expired : self.expired};
                if (resp && !resp.error) {
                    var currentState         = self.ROGUE_PROMO_STATE_ACTIVE;
                    incorrectStateRegistered = false;
                    if (!self.fromActiveState && !self.expired) { // Upcoming
                        currentState = self.ROGUE_PROMO_STATE_UPCOMING;
                    }
                    if (incorrectStateRegistered = resp.blocks.state == currentState) {
                        switch (resp.blocks.state) {
                            case self.ROGUE_PROMO_STATE_UPCOMING: // Upcoming
                                incorrectStateRegistered = false;
                                // self.expired         = false;
                                // self.fromActiveState = false;
                                break;
                            case self.ROGUE_PROMO_STATE_ACTIVE: // Active
                                incorrectStateRegistered = false;
                                self.expired         = false;
                                self.fromActiveState = true;
                                break;
                            case self.ROGUE_PROMO_STATE_EXPIRED: // Expired
                                self.expired         = true;
                                self.fromActiveState = false;
                                break;
                        }
                    }

                    var wrapper = self.getWrappers()[0],
                        form    = self.getForm();
                    if (!self.fromActiveState && wrapper) {
                        Element.update(wrapper, resp.blocks.promo);
                    }

                    if (self.isGrouped && !self.expired) {
                        if (wrapper) {
                            wrapper.removeClassName('promo-counter-wrapper-upcoming')
                                .addClassName('promo-counter-wrapper-active');
                            wrapper[wrapper.hasClassName('no-promo-date') ? 'hide' : 'show']();
                        }

                        var mbfTopBanner;
                        if ((mbfTopBanner = $(self.mbfTopBanner)) && mbfTopBanner.hasClassName('mbf-banner-after-reload')) {
                            mbfTopBanner.show();
                        }
                    }

                    if (resp.blocks.grouped_table) {
                        Element.update(form.down('#super-product-table'), resp.blocks.grouped_table);
                    }

                    if (resp.blocks.price && wrapper) {
                        var container = wrapper.up('tbody') || wrapper.up(), priceBox;
                        while (!priceBox && container) {
                            if (priceBox = container.down('.price-box')) {
                                priceBox.replace(resp.blocks.price);
                            }
                            if (!container.up) {
                                break;
                            }
                            container = container.up();
                        }
                    }

                    if (!self.expired && resp.blocks.promo_param) {
                        var promoInputsContainer = form.down('.promo-params');
                        if (promoInputsContainer) {
                            Element.remove(promoInputsContainer);
                        }
                        form.insert(resp.blocks.promo_param);
                    } else {
                        self.disablePromoParamElement();
                    }

                    if (self.expired && resp.blocks.disable_purchase == 1) {
                        form.select('.disabled-purchase-el').each(function (el) {
                            el.hide();
                        });
                        form.select('.disabled-purchase-el-oos').each(function (el) {
                            el.show();
                        });
                        self.hideAddTo(form);
                    }

                    self.updateOptionPrices(resp.options_price, window.optionsPrice);
                    if (resp.options_price_by_product) {
                        for (var itemId in resp.options_price_by_product)
                            if (resp.options_price_by_product.hasOwnProperty(itemId)) {
                                ['optionsPrice' + itemId, 'optionsPrice_qv_' + itemId].each(function (key) {
                                    self.updateOptionPrices(resp.options_price_by_product[itemId], window[key]);
                                });
                            }
                    }

                    [
                        'colorSwatchesConfig' + self.productId,
                        'colorSwatchesConfig_qv_' + self.productId,
                        'relatedColorSwatches' + self.productId
                    ].each(function (colorSwatchKey) {
                        var colorSwatch;
                        if (resp.configurable_child_config && resp.configurable_child_config.simple_prices && (colorSwatch = window[colorSwatchKey])) {
                            if (colorSwatch.simplePrices = resp.configurable_child_config.simple_prices) {
                                colorSwatch.priceObject.productPrice = colorSwatch.priceObject.productOldPrice;
                            }
                            setTimeout(function () {
                                colorSwatch.reinitCurrentOption();
                                colorSwatch.reloadPrice();
                            }, 15); //prototype apply all js after 10 sec timeout. That should be executed after all js applied
                        }
                    });
                }

                if (incorrectStateRegistered) {
                    self.triggerPromoState(triggerSingle);
                    self.expired         = evaluatedState.expired;
                    self.fromActiveState = evaluatedState.fromActiveState;
                    self.executed        = false;
                    setTimeout(self.clearIntervalCallback.bind(self, triggerSingle, true), self.DELAY_IF_STATES_NOT_SYNCED);
                }
            }
        });
    },

    enablePromoParamElement : function (productId, parentId) {
        this.disablePromoParamElement(undefined, parentId); // disable all inputs for the parent
        this._changePromoParamState(productId, true, parentId); // enable needed input
    },

    disablePromoParamElement : function (productId, parentId) {
        this._changePromoParamState(productId, false, parentId);
    },

    _changePromoParamState : function(productId, activate, parentId) {
        var selector = (productId ? '#is_promo_' + productId : '')
            + '[name="is_promo[]"]' //Rogue_Promo_Block_Catalog_Product_PromoFormParam::FORM_PARAM_IS_PROMO
            + (parentId ? '[data-parentId="' + parentId + '"]' : ''),
            // `#is_promo[name="is_promo[]"]` for a specified product, e.g. simple child is selected on configurable page
            // `[name="is_promo[]"]` for all such hidden inputs, e.g. to be able to disable them with one call
            elements = this.getForm().select(selector);

        elements.each(function(element) {
            if (activate) {
                element.removeAttribute('disabled');
            } else {
                element.setAttribute('disabled', 'disabled');
            }
        });
    },

    triggerPromoState : function () {
        var mbfTopBanner = $(this.mbfTopBanner),
            wrappers     = this.getWrappers(),
            form         = this.getForm(),
            isExpired    = this.expired,
            upcomingTimer;

        //remove upcoming timer
        if (!(upcomingTimer = $('upcoming-' + this.wrappers[0]))
            && wrappers[0]
            && wrappers[0].hasClassName('.promo-counter-wrapper-upcoming')) {
            upcomingTimer = wrappers[0];
        }
        if (upcomingTimer) {
            upcomingTimer.hide();
        }
        // hide other elements
        $$('.promo-upcoming-wrapper-item' + this.productId).each(function (el) {
            el.hide();
        });

        var availabilityElement = this.getForm().down('p.availability');
        if (availabilityElement) {
            availabilityElement.remove();
        }

        if (this.fromActiveState) {
            if (wrappers[0]) {
                wrappers.invoke(isExpired ? 'hide' : 'show');
            }

            if (isExpired && mbfTopBanner) {
                mbfTopBanner.hide();
            }
        }

        // MBF top banner, counter wrapper
        if (isExpired) {
            form.select('.promo-counter-wrapper', '.top-mbf-banner').each(function (el) {
                el.hide();
            });
        } else {
            if (mbfTopBanner && (this.fromActiveState || !mbfTopBanner.hasClassName('mbf-banner-after-reload'))) {
                mbfTopBanner.show();
            }

            form.select('.disabled-purchase-el').each(function (el) {
                el.show();
            });

            form.select('.disabled-purchase-el-oos').each(function (el) {
                el.hide();
            });
        }
    },

    clearPromoMarkup : function () {
        // remove above-purchase-area banner
        document.querySelectorAll('.top-mbf-banner').forEach(function (e) {
            e.remove();
        });

        // remove configurable qty counter
        document.querySelectorAll('.promo-counter-wrapper').forEach(function (e) {
            e.remove();
        });

        // remove grouped product stuff
        document.querySelectorAll('.grouped-item-promo-default, .product-cart-box-simple, .product-cart-box-configurable').forEach(function (e) {
            e.classList.remove('grouped-item-promo-default');

            var id = (function (list) {
                for (var i = 0; i < list.length; i++) {
                    var match = /^product-purchase-wrapper-(\d+)$/.exec(list[i]);
                    if (match) {
                        return match[1];
                    }
                }

                return null;
            })(e.classList);

            var priceBox = e.querySelector('.price-box');
            var oldPriceEl = e.querySelector('.price-box .old-price .price');
            if (priceBox && oldPriceEl) {
                priceBox.innerHTML = '<span class="regular-price" id="product-price-{$ID}"><span class="price">{$PRICE}</span></span>'
                    .replace('{$ID}', id)
                    .replace('{$PRICE}', oldPriceEl.innerHTML);
            }
        });

        // revert configurable prices
        var csc = window['colorSwatchesConfig' + this.productId];
        if (csc) {
            Object.keys(csc.config.simple_prices).forEach(function (k) {
                csc.config.simple_prices[k].price = Number(csc.config.simple_prices[k].oldPrice);
            });
        }

        // reset promo prices
        window.rPromoCountdown.promoPrices = {};

        // revert configurable in grouped prices
        window.rPromoCountdown.productsToUpdate.forEach(function (pid) {
            var op = window['optionsPrice' + pid];
            if (op) {
                op.cleanPriceCache();
                op.optionPrices.config = {
                    oldPrice : 0,
                    price    : 0
                };

                op.productPrice = Number(op.productOldPrice);
            }
        });

        // stop calling the promo_controller.php
        RoguePromoCalculation.clearIntervals(window.rPromoCountdown);

        document.querySelectorAll('input[name="is_promo[]"]').forEach(function(e) {
            e.setAttribute('disabled', 'disabled');
        });
    },

    hideAddTo : function(form) {
        form.select('.add-to-box', '.add-to-links', '.qty-wrapper').each(function (el) {
            var parent = el.up('div.customcolors-product-purchase-add-ons');
            if (!parent) {
                el.hide();
                if (el.hasClassName('add-to-box')) {
                    el.insert({
                        after : '<p class="availability">Availability: <span>Coming Soon</span></p>'
                    });
                }
            }
        });

    },

    getWrappers : function () {
        var wrappers = [];
        this.wrappers.each(function (wrapper) {
            if (wrapper && (wrapper = $(wrapper))) {
                wrappers.push(wrapper);
            }
        });

        return wrappers;
    },

    getForm : function () {
        return this.form;
    },

    updateOptionPrices : function (source, target) {
        if (source && target) {
            [
                'priceExclTax',
                'priceInclTax',
                'productOldPrice',
                'productPrice'
            ].each(function (key) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            });
        }
    }
};

/**
 * Abstract class for products
 */
RoguePromoQty.prototype = {
    RELOAD_TYPE_SINGLE  : 1,
    RELOAD_TYPE_EXPIRED : 2,
    RELOAD_TYPE_ACTIVE  : 3,
    productIds          : [],
    productsWithQty     : [],
    qtyElements         : {},
    promoInitialQtys    : {},
    productQtys         : {},
    promoPrices         : {},
    productRemoved      : {},
    qtyPercentages      : {},
    stockStatuses       : {},
    countInitiated      : 0,
    init            : function (productId, qtyElement, updateUrl, productsToUpdate, refreshInterval, promoInitialQty, currentPromoQty, promoPrice, productCount, qtyPercentage, stockStatus) {
        var self              = this;
        self.updateUrl        = updateUrl;
        self.productsToUpdate = productsToUpdate;
        self.promoActive      = true;
        self.productCount     = productCount;

        if (!refreshInterval) {
            refreshInterval = 60;
        }

        refreshInterval      = refreshInterval * 1000;
        self.refreshInterval = refreshInterval;

        if (productId) {
            self.addProduct(productId, qtyElement, promoInitialQty, currentPromoQty, promoPrice, qtyPercentage, stockStatus);
        }
    },

    pingSwatches : function () {
        var self = this;
        setTimeout(function () {
                document.fire("promo-countdown:addProduct", {
                    productQtys : self.productQtys
                });
            },
            150);
    },

    addProduct : function (productId, qtyElement, promoInitialQty, currentPromoQty, promoPrice, qtyPercentage, stockStatus) {
        var self = this;

        if (productId) {
            self.countInitiated++;
            self.promoInitialQtys[productId] = promoInitialQty;
            self.productQtys[productId]      = currentPromoQty;
            self.promoPrices[productId]      = promoPrice;
            self.qtyPercentages[productId]   = qtyPercentage;
            self.stockStatuses[productId]    = stockStatus;
            if (currentPromoQty !== null && currentPromoQty === 0) {
                self.productRemoved[productId] = true;
            }
            productId = Number(productId);
            self.productIds.push(productId);
           // self.productsWithQty.push(productId);

            document.fire("promo-countdown:setQty", {
                productId  : productId,
                qty        : currentPromoQty,
                promoPrice : this.promoPrices[productId],
                expired    : self.timerObject ? self.timerObject.expired : false
            });
        }

        if (productId && typeof self.qtyElements[productId] === 'undefined' && $(qtyElement)) {
            self.qtyElements[productId] = [];
        }

        if (productId && $(qtyElement)) {
            self.qtyElements[productId].push(qtyElement);
        }

        if (self.productsToUpdate !== false
            && (!self.productCount || self.productCount <= 1 || self.countInitiated == self.productCount) //lazy load
            /*&& self.productsWithQty.length > 0 && self.productIds.length == self.productsWithQty.length*/
           // && self.productsToUpdate.length > 0 && self.productsToUpdate.length == self.productIds.length
            && Object.keys(self.qtyElements).length > 0) {
            self.initQtyUpdating();
        }
    },

    initQtyUpdating : function (callback, additionalIds) {
        var self = this;
        self.updateQty(callback, additionalIds);
        if (!self.qtyUpdateInterval) {
            self.qtyUpdateInterval = setInterval(function () {
                self.updateQty(callback);
            }, self.refreshInterval);
        }
    },

    updateQty : function (callback, additionalIds) {
        var self = this;
        new Ajax.Request(self.updateUrl, {
            method     : 'post',
            dataType   : 'json',
            parameters : {product_id : self.productIds.join(',') + ',' + (additionalIds || '')},
            onComplete : function (transport) {
                if (typeof callback == 'function') {
                    callback(transport)
                }
                var resp = RoguePromoCalculation._parseResponse(transport);
                if (typeof resp === 'object' && !resp.error) {
                    self.scheduleReload = false;
                    var data = resp.data || {};
                    for (var id in self.qtyElements) if (self.qtyElements.hasOwnProperty(id)) {
                        if (data.hasOwnProperty(id)) {
                            if (self.productIds.indexOf(Number(id)) !== -1) {
                                var qty = data[id];
                                if (typeof qty === 'object') {
                                    if (qty.hasOwnProperty('init_qty')) {
                                        self.promoInitialQtys[id] = qty.init_qty;
                                    }
                                    qty = qty.qty;
                                }
                                if (qty == 0) {
                                    self.removeProductId(id);
                                } else {
                                    self.updateQtyDiv(id, qty);
                                }
                            }
                        } else {
                            self.missingResponseItem(id);
                        }
                    }
                    self.triggerScheduledReload();
                    self.pingSwatches();
                    RoguePromoCalculation.setTimeCorrection(resp.timestamp);
                }
            }
        });
    },

    triggerScheduledReload : function() {
        if (this.scheduleReload) {
            switch (this.scheduleReload) {
                case this.RELOAD_TYPE_SINGLE :
                    this.timerObject.executed = false;
                    this.timerObject.clearIntervalCallback(true);
                    break;

                case this.RELOAD_TYPE_EXPIRED :
                    this.timerObject.executed = false;
                    this.promoActive          = false;
                    // if there are products without QTY we should not remove the timer
                    var expired               = false;
                    if (!this.hasProductsWithoutQty) {
                        if (this.hasTimer) {
                            RoguePromoCalculation.clearPromo(this);
                        }
                        expired = true;
                    }
                    this.timerObject.expired = expired;

                    this.timerObject.clearIntervalCallback();
                    break;
                case this.RELOAD_TYPE_ACTIVE :
                    this.timerObject.executed = false;
                    this.promoActive = true;
                    // restore timer
                    if (this.hasTimer) {
                        RoguePromoCalculation.restorePromo(this);
                    }
                    // restore view
                    this.timerObject.expired  = false;
                    this.timerObject.clearIntervalCallback();
                    break;
            }

        }
    },

    missingResponseItem : function () {

    },

    removeProductId : function (productId) {
        var self  = this;
        if (self.productRemoved[productId] /*&& self.useRemoveFlag*/) {
            return;
        }
        self.productRemoved[productId] = true;
        var index = self.productsWithQty.indexOf(Number(productId));
        if (index > -1) {
            self.productsWithQty.splice(index, 1);
        }

        self.updateQtyDiv(productId, 0);

        var isLastProduct = !self.getAvailableQtys().length;
        if ((isLastProduct || self.reloadOnSingleExpiration) && self.promoActive) {
            if (isLastProduct && (!self.reloadOnSingleExpiration || !self.hasProductsWithoutQty)) {
                self.scheduleReload = self.RELOAD_TYPE_EXPIRED;
            } else {
                self.scheduleReload = self.RELOAD_TYPE_SINGLE;
            }
        }
        self.afterRemoveProduct(productId);
    },

    getAvailableQtys : function () {
        var availableItems = [];
        for (var i in this.productQtys) if (this.productQtys.hasOwnProperty(i) && this.productQtys[i] > 0) {
            availableItems.push(Number(i));
        }

        return availableItems;
    },

    afterRemoveProduct : function (productId) {

    },

    updateQtyDiv : function (productId, value) {
        var self = this;
        document.fire("promo-countdown:setQty", {
            productId  : productId,
            qty        : value,
            promoPrice : this.promoPrices[productId],
            expired    : self.timerObject ? self.timerObject.expired : false
        });

        if (value > 0) {
            var productWasRemoved = self.productRemoved[productId];
            self.productRemoved[productId] = false;
            if (productWasRemoved) {
                var reloadSingle = self.reloadOnSingleExpiration/* && self.productRemoved[productId]*/,
                    promoExpired = /*!self.productsWithQty.length || */!self.promoActive;
                if (reloadSingle || promoExpired) {
                    if (promoExpired) {
                        self.scheduleReload = self.RELOAD_TYPE_ACTIVE;
                    } else {
                        self.scheduleReload = self.RELOAD_TYPE_SINGLE;
                    }
                }

                self.productsWithQty.push(Number(productId));
            }
        }

        if (value !== undefined) {
            if (productId in self.qtyElements) {
                self.qtyElements[productId].forEach(function (el) {
                    var e = $(el);
                    if (e) {
                        var span           = e.select('span'),
                            piePercent     = self.getPieChartPercent(productId, value),
                            isPercentage   = self.qtyPercentages[productId],
                            percentDefined = piePercent > 0;

                        // Apply this attributes on circular pie chart only
                        if (!e.classList.contains('promo-quantity-remaining')) {
                            e.setAttribute('data-content', (isPercentage && percentDefined) ? piePercent : value);
                            e.setAttribute('data-percent', piePercent);
                            e.setAttribute('data-sign', isPercentage ? '%' : '');
                        }

                        if (span.length > 0) {
                            var injectData          = value,
                                percentageClassName = 'qty-percentage';
                            e.removeClassName(percentageClassName);
                            if (self.qtyPercentages[productId] && percentDefined) {
                                injectData = piePercent + "%";
                                e.addClassName(percentageClassName);
                            }
                            span[0].innerHTML = injectData;
                        }
                        if (percentDefined) {
                            self.setTimedSpinnerAnimations(e, piePercent, productId, "update");
                        }
                    }
                });
            }
        }

        self.afterUpdateQty(productId, value);
    },

    afterUpdateQty : function (productId, value) {

    },

    getPieChartPercent : function (productId, qty) {
        var initialQty       = this.promoInitialQtys[productId],
            percentRemaining = 0;
        if (initialQty) {
            percentRemaining = Math.round((qty / initialQty) * 100);
        }

        return percentRemaining;
    },

    setTimedSpinnerAnimations : function(e, piePercentSold, curProductId, caller) {
        if (!e.up('.promo-count-left')) {
            return;
        }
        if(e.readAttribute('data-percent-saved') === null) {
            e.setAttribute('data-percent-saved', piePercentSold);
        }
        if(typeof window.mbfAnimation !== "object") {
            window.mbfAnimation = {};
            window.mbfAnimation[curProductId] = {};
        } else if (typeof window.mbfAnimation[e.up('.promo-count-left').readAttribute('data-productId')] !== "object") {
            window.mbfAnimation[curProductId] = {};
        }

        if(e.readAttribute('data-animating') === "true"){
          return;
        }

        if(caller === "update") {
            if(e.readAttribute('data-animated') === null) {
                window.clearTimeout(window.mbfAnimation[curProductId].toZero);
                window.mbfAnimation[curProductId].toZero = window.setTimeout(function(){e.setAttribute('data-percent', 0);},1000);
                e.setAttribute('data-animated', 'animated');
            }
            window.clearTimeout(window.mbfAnimation[curProductId].toValue);
            window.mbfAnimation[curProductId].toValue = window.setTimeout(function(){e.setAttribute('data-percent', e.readAttribute('data-percent-saved'));},2000);
            window.clearTimeout(window.mbfAnimation[curProductId].clearSaved);
            window.mbfAnimation[curProductId].clearSaved = window.setTimeout(function(){e.removeAttribute('data-percent-saved'); e.removeAttribute('data-animating');},2000);
            e.setAttribute('data-animating', 'true');
        }

        if(caller === "init" && e.readAttribute('data-animated') !== null) {
            e.setAttribute('data-percent', 100);
            window.clearTimeout(window.mbfAnimation[curProductId].toZero);
            window.mbfAnimation[curProductId].toZero = window.setTimeout(function(){e.setAttribute('data-percent', 0);},100);
            window.clearTimeout(window.mbfAnimation[curProductId].toValue);
            window.mbfAnimation[curProductId].toValue = window.setTimeout(function(){e.setAttribute('data-percent', e.readAttribute('data-percent-saved'));},1100);
            window.clearTimeout(window.mbfAnimation[curProductId].clearSaved);
            window.mbfAnimation[curProductId].clearSaved = window.setTimeout(function(){e.removeAttribute('data-percent-saved'); e.removeAttribute('data-animating');},2000);
            e.setAttribute('data-animating', 'true');
        }
    }

};

/**
 * Promo on product page
 */
RoguePromoProductQty.prototype = Object.extend(Object.clone(RoguePromoQty.prototype), {
    initialize  : function (element, qtyElement, productId, updateUrl, endTime, gmtOffset, productsToUpdate, refreshInterval, expiredUpdateUrl, wrappers, realProductId, mbfTopBanner, promoInitialQty, reloadOnSingleExpiration, currentPromoQty, promoPrice, productCount, qtyPercentage, stockStatus) {
        var self                      = this;
        self.promoCleared             = false;
        self.element                  = $(element);
        self.wrapper                  = $(wrappers[0]);
        self.mainProductId            = productId;
        self.activeProductId          = null;
        self.stockStatus              = stockStatus;
        self.soldOutElement           = self.wrapper.down('.promo-sold-out');
        self.activeElement            = self.wrapper.down('.promo-active');
        self.reloadOnSingleExpiration = reloadOnSingleExpiration;
        self.useRemoveFlag            = reloadOnSingleExpiration;
        self.hasTimer                 = !!self.element;
        self.init(productId, qtyElement, updateUrl, productsToUpdate, refreshInterval, promoInitialQty, currentPromoQty, promoPrice, productCount, qtyPercentage, stockStatus);

        self.time      = endTime;
        self.gmtOffset = gmtOffset;

        self.timerObject                 = new RoguePromoTimer(updateUrl, null, realProductId || productId, element, gmtOffset, expiredUpdateUrl, wrappers, true, mbfTopBanner);
        self.timerObject.expired         = false;
        self.timerObject.fromActiveState = true;
        if (self.timerObject.hasProductsWithoutQty) {
            self.hasProductsWithoutQty = true;
        }
        if (self.element) {
            RoguePromoCalculation.startCalculation(self);
        }
        self.setWrapperClass(productId);

        document.observe("color-swatches:setValue", function (event) {
            var table, title, parentProductId, spinnersWrapper, spinners,
                setting   = event.memo.element,
                productId = event.memo.productId,
                isOOS     = event.memo.isOOS;

            if (setting && (table = setting.up('.product-purchase'))) {
                parentProductId = setting.getAttribute('data-productId');
                spinnersWrapper = table.down('#promo-counter-wrapper' + parentProductId)
                    || table.down('#promo-counter-wrapper_qv_' + parentProductId);

                //hide wrapper if there is no active timer
                if (self.mainProductId === null) {
                    self.setWrapperClass(productId);
                }

                //hide wrapper if option is OOS
                if (isOOS) {
                    spinnersWrapper.hide();
                }

                if (self.mainProductId == parentProductId) {
                    self.activeProductId = productId;
                    // update qty spinners for options of this product only
                    if (spinnersWrapper && (spinners = spinnersWrapper.select('.promo-count-left'))) {
                        spinners.each(function (spinner) {
                            if (spinner.getAttribute('data-productId') == productId) {
                                spinner.show();
                                var e              = spinner.down('.circular-progress'),
                                    piePercentSold = e.readAttribute('data-percent'),
                                    curProductId   = [e.up('.promo-count-left').readAttribute('data-productId')];

                                self.setTimedSpinnerAnimations(e, piePercentSold, curProductId, "init");

                                if (event.memo.label && (title = spinner.down('.config-option'))) {
                                    title.show()
                                        .update(event.memo.label)
                                        .addClassName(event.memo.label.toLowerCase().sub(' ', '-'));
                                }
                            } else {
                                spinner.hide();
                                if (self.timerObject) {
                                    self.timerObject.disablePromoParamElement(productId, self.mainProductId);
                                }
                            }
                        });
                    }

                    self.checkQtyVisibility(productId, self.productQtys[productId]);
                }
            }
        });

        document.observe("promo-countdown:setQty", function (event) {
            var productId = event.memo.productId;
            self.productQtys[productId] = event.memo.qty;
            self.checkQtyVisibility(productId, event.memo.qty);
        });
    },

    setWrapperClass : function (productId) {
        var hasQtyClass   = 'promo-has-qty',
            hasTimerClass = 'promo-has-timer',
            hasQty        = this.productQtys.hasOwnProperty(productId),
            qtyPositive   = !!this.productQtys[productId],
            hasTimer      = !!this.hasTimer;
        this.wrapper
            .removeClassName(hasQtyClass)
            .removeClassName(hasTimerClass);

        if (!this.timerObject.expired && (!this.mainProductId || this.stockStatuses[productId])) {
            this.wrapper.show();
        }

        //hide wrapper if main product is OOS
        if (!this.stockStatus && !this.mainProductId) {
            this.wrapper.hide();
        }

        // do not add classes in case of Sold Out message
        if (!hasQty || qtyPositive) {
            if (!hasQty && !hasTimer) {
                this.wrapper.hide();
            } else if ( qtyPositive ^ hasTimer) {
                this.wrapper.addClassName(qtyPositive ? hasQtyClass : hasTimerClass)
            }
        }
    },

    checkQtyVisibility : function (productId, qty) {
        if (productId == this.activeProductId) {
            if (this.soldOutElement && this.activeElement) {
                if (this.stockStatuses[productId]) {
                    if (qty || qty === undefined) {
                        this.activeElement.show();
                        this.soldOutElement.hide();
                        if (this.timerObject && qty !== undefined) {
                            this.timerObject.enablePromoParamElement(this.activeProductId, this.mainProductId);
                        }
                    } else {
                        this.activeElement.hide();
                        this.soldOutElement.show();
                        if (this.timerObject) {
                            this.timerObject.disablePromoParamElement(this.activeProductId, this.mainProductId);
                        }
                    }
                    this.wrapper.show();
                } else {
                    this.activeElement.hide();
                    this.soldOutElement.hide();
                    this.wrapper.hide();
                }
            }
            this.setWrapperClass(productId);
        }
    },

    clearIntervalCallback : function () {
        var self = this;
        if (self.productsToUpdate) {
            self.productsToUpdate.forEach(function (id) {
                self.removeProductId(id);
            });
        }

        if (self.timerObject) {
            self.timerObject.expired = true;
            self.timerObject.clearIntervalCallback();
        }
    },

    destruct : function () {
        RoguePromoCalculation.clearIntervals(this);
    }

});

/**
 * Promo on category page
 */
RoguePromoCategoryQty.prototype = Object.extend(Object.clone(RoguePromoQty.prototype), {
    categoryProductObjects : {},
    initialize             : function (productId, qtyElement, updateUrl, refreshInterval, categoryProductObj, initQty, qtyPercentage) {
        var self                       = this;
        self.useRemoveFlag             = true;
        self.init(productId, qtyElement, updateUrl, false, refreshInterval, undefined, undefined, undefined, undefined, qtyPercentage);
        self.categoryProductObjects[productId] = categoryProductObj;
        self.promoInitialQtys[productId]       = initQty;
        categoryProductObj.setUseQtyBar();
    },

    afterRemoveProduct : function (productId) {
        if (this.categoryProductObjects[productId]) {
            this.categoryProductObjects[productId].setExpiredState();
        }
    },

    missingResponseItem : function (productId) {
        var listItem;
        if (listItem = this.categoryProductObjects[productId]) {
            listItem.checkProgressBarStatus(true);
        }
    },

    afterUpdateQty : function (productId, value) {
        var listItem = this.categoryProductObjects[productId];
        if (listItem && listItem.type != listItem.stateExpired) {
            if (listItem.useQtyBar) {
                listItem.showBar = true;
                listItem.checkProgressBarStatus();
                if (value === undefined) {
                    //this.categoryProductObjects[productId].checkProgressBarStatus(true);
                } else {
                    var initQty = this.promoInitialQtys[productId] || 100;

                    listItem.adjustProgressBar(Math.ceil(value / initQty * 100));
                }
            }

            listItem.showQtyContainer();
        }
    }
});

/**
 * Promo on category page
 */
RoguePromoCategoryPage.prototype = {
    requestExists : false,
    initialize    : function (gmtOffset, updateUrl, qtyUpdateFrequency) {
        RoguePromoCalculation.promoControllerUrl = updateUrl;

        var items = $$('.promo-time-remaining').concat($$('.promo-sale-starts')),
            self  = this;

        self.productsToUpdate = [];
        self.productsByKey    = {};
        self.updateUrl        = updateUrl;
        self.timersInitiated  = false;
        items.forEach(function (item) {
            var id;
            if (id = item.readAttribute('data-id')) {
                var obj = new RoguePromoCategoryListItem(
                    item.getAttribute('data-timeto'),
                    item.getAttribute('data-timefrom'),
                    gmtOffset,
                    item.down('span'),
                    item.getAttribute('data-time-type'),
                    id,
                    item.getAttribute('data-disabled-view'),
                    item.getAttribute('data-qty-bar')
                );
                self.productsToUpdate.push(id);
                self.productsByKey[id] = obj;
                obj.categoryObject     = self;
            }
        });

        var qtyProducts = $$('.promo-quantity-remaining'),
            lastObj     = false;
        qtyProducts.each(function (qtyItem) {
            var productId = qtyItem.getAttribute('data-id');
            if (self.productsByKey[productId]) {
                var qtyObj,
                    obj = self.productsByKey[productId].setQtyUpdaterInit(function () {
                        qtyObj = new RoguePromoCategoryQty(
                            productId,
                            qtyItem,
                            self.updateUrl,
                            qtyUpdateFrequency,
                            self.productsByKey[productId],
                            qtyItem.getAttribute('data-init-qty'),
                            qtyItem.getAttribute('data-qty-percentage')
                        );

                        return qtyObj;
                    });
                if (obj) {
                    self.productsByKey[productId].qtyObject = obj;
                    lastObj                                 = obj;
                }
            }
        });

        if (lastObj) {
            lastObj.initQtyUpdating(function (transport) {
                self.handleResponse(transport);
            }, self.productsToUpdate.join(','));
        } else {
            document.fire('promo:list:update');
        }
        self.forceUpdateData(!!lastObj);
    },

    clearInterval : function () {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    },

    forceUpdateData : function (doNotCallFn) {
        var self = this;
        self.clearInterval();

        if (self.productsToUpdate.length) {
            var f = self.updateData.bind(self);
            if (!doNotCallFn) {
                f();
            }
            self.updateInterval = setInterval(f, 60000);
        }
    },

    updateData : function () {
        var self = this;
        if (self.requestExists) {
            return;
        }

        self.requestExists = true;
        new Ajax.Request(self.updateUrl, {
            method     : 'post',
            dataType   : 'json',
            parameters : {product_id : self.productsToUpdate.join(',')},
            onComplete : function (transport) {
                self.handleResponse(transport);
                self.requestExists = false;
            }
        });
    },

    handleResponse : function (transport) {
        var self = this,
            resp = RoguePromoCalculation._parseResponse(transport);
        if (!self.timersInitiated) {
            self.timersInitiated = true;
            for (var objKey in self.productsByKey) if (self.productsByKey.hasOwnProperty(objKey)) {
                RoguePromoCalculation.startCalculation(self.productsByKey[objKey]);
            }
        }
        if (resp && !resp.error) {
            var data = resp.data;
            var syncedData = {};
            for (var id in data) {
                if (data.hasOwnProperty(id) && self.productsByKey.hasOwnProperty(id) && data[id].state !== null) {
                    var product = self.productsByKey[id];
                    if (product.isSynced
                        || RoguePromoCategoryListItem.prototype.stateUpcoming !== data[id].state.toString()
                    // do not allow to go back to upcoming (bug when server side has not been updated yet)
                    ) {
                        product.isSynced = true;
                        syncedData[id]   = data[id];
                        product.setProductState(data[id].state, data[id].price);
                    } else if (!product.isSynced && data[id].hasOwnProperty('active_price')) {
                        //if product status is still not actual in promo cache, use pre-generated price html
                        product.getPriceBox().innerHTML = data[id].active_price;
                    }
                }
            }
            document.fire('promo:list:update', syncedData);
        }
    },

    clearIntervalCallback : function () {

    }
};

/**
 * Class for each item in category list
 */
RoguePromoCategoryListItem.prototype = {
    disableFormatting : true,
    stateActive       : '0',
    stateUpcoming     : '1',
    stateExpired      : '2',
    initialize        : function (timeTo, timeFrom, gmtOffset, element, type, productId, disableView, forceUseQtyBar) {
        var time                     = type === this.stateUpcoming ? timeFrom : timeTo;
        forceUseQtyBar               = parseInt(forceUseQtyBar);
        this.hasTime                 = timeTo || timeFrom;
        this.time                    = time;
        this.gmtOffset               = gmtOffset;
        this.timeFrom                = timeFrom;
        this.timeTo                  = timeTo;
        this.productId               = productId;
        this.type                    = type;
        this.mainElement             = element;
        this.disableView             = disableView;
        this.forceProduct            = false;
        this.showBar                 = false;
        this.useTimeBar              = false;
        this.useQtyBar               = !!forceUseQtyBar;
        this.isSynced                = true;
        this.timerContainerInitiated = false;
        if (!forceUseQtyBar && timeTo && timeFrom && (timeTo - timeFrom) > 0) {
            this.timeTotal  = timeTo - timeFrom;
            this.useTimeBar = true;
            this.showBar    = true;
        }
        this.initElements();
        this.togglePriceBox();
        var self = this;
        Event.observe(window, 'load', function () {
            self.changeView();
        });
    },

    setQtyUpdaterInit : function (fn) {
        var obj;
        switch (this.type) {
            case this.stateActive:
                obj = fn();
                break;

            case this.stateUpcoming:
                this.qtyInit = fn;
                break;
        }

        return obj;
    },

    clearIntervalCallback : function () {
        if (this.hasTime) {
            switch (this.type) {
                case this.stateActive:
                    if (this.timeTo) {
                        this.setExpiredState();
                    }
                    break;

                case this.stateUpcoming:
                    this.type = this.stateActive;
                    this.setActiveState();
                    this.forceProduct = true;
                    var s             = this;
                    if (s.categoryObject) {
                        s.categoryObject.clearInterval();
                        //delay in order to let cache script make his work
                        setTimeout(function () {
                            s.categoryObject.forceUpdateData();
                        }, 30000);
                    }
                    break;
            }
        }
    },

    setProductState : function (state, price) {
        state = String(state);
        if (state !== this.type || this.forceProduct) {
            this.forceProduct = false;
            this.type         = state;
            if (price) {
                this.getPriceBox().innerHTML = price;
            }

            if (this.timeCalculationInterval) {
                clearInterval(this.timeCalculationInterval);
            }

            switch (this.type) {
                case this.stateActive:
                    this.setActiveState();
                    break;

                case this.stateUpcoming:
                    this.setUpcomingState();
                    break;

                case this.stateExpired:
                    this.expiredExecuted = false;
                    this.setExpiredState(true);
                    break;
            }
        }
    },

    setExpiredState : function (doNotSetType) {
        if (this.expiredExecuted) {
           return;
        }
        this.expiredExecuted = true;
        this.getPromoContainer().setStyle({display : 'none'});
        this.getPriceBox().setStyle({display : 'none'});
        this.getExpiredMask().setStyle({
            display       : 'block',
            pointerEvents : 'none'
        });
        this.getItemContainer().removeClassName('item-enabled');
        this.getItemContainer().addClassName('item-expired');
        this.getItemContainer().writeAttribute('data-promo-state', 3);
        if(typeof jQuery !== 'undefined') {
          jQuery(this.getItemContainer()).data('promoState', 3);
        }

        this.changeElementsVisibility();
        this.checkProgressBarStatus(true);
        if (!doNotSetType) {
            this.type = this.stateExpired;
        }
        this.changeView();
        //remove product from qty updating
        if (this.qtyObject) {
            this.qtyObject.removeProductId(this.productId);
        }
        document.fire('promo:item:update', {id: this.productId, state: 2});
    },

    setActiveState : function () {
        var itemContainer = this.getItemContainer();
        this.setStateWithTime(false);
        itemContainer.removeClassName('item-upcoming');
        itemContainer.removeClassName('purchase-disabled');
        itemContainer.removeClassName('purchase-enabled');
        this.getTimeOuterContainer().removeClassName('upcoming');
        itemContainer.addClassName('item-enabled');
        itemContainer.writeAttribute('data-promo-state', 0);
        if(typeof jQuery !== 'undefined') {
          jQuery(itemContainer).data('promoState', 0);
        }
        this.changeView();
        this.checkProgressBarStatus();
        document.fire('promo:item:update', {id: this.productId, state: 0});
    },

    setUpcomingState : function () {
        this.setStateWithTime(true);
        var itemContainer = this.getItemContainer();
        itemContainer.writeAttribute('data-promo-state', 1);
        if(typeof jQuery !== 'undefined') {
          jQuery(itemContainer).data('promoState', 1);
        }
        document.fire('promo:item:update', {id: this.productId, state: 1});
    },

    setStateWithTime : function (upcomming) {
        upcomming = !!upcomming;
        this.getExpiredMask().setStyle({display : 'none'});

        var time = upcomming ? this.timeFrom : this.timeTo;

        if (!upcomming) {
            this.isSynced = false;
            if (typeof this.qtyInit == 'function') {
                var qtyObj    = this.qtyInit();
                qtyObj.updateQty();

                this.qtyObject = qtyObj;
            }
            this.categoryObject.updateData(); //update prices
        }

        this.setPromoTemplate();
        this.time      = time;
        this.secRemain = RoguePromoCalculation.calculateSecRemain(this);
        if (this.secRemain > 0) {
            RoguePromoCalculation.startCalculation(this);
        } else {
            RoguePromoCalculation.setTimerHtml(this, true);
        }

        this.getPromoContainer().setStyle({display : 'table'});
        this.changeElementsVisibility(true);
        if (!time) {
            this.changeElementsVisibility(false, true);
        }
    },

    changeElementsVisibility : function (show, timeOnly) {
        var elements = '.promo-time-container' + (!timeOnly ? ', .qv-link-div' : '');
        this.getItemContainer().select(elements).each(function (el) {
            if (show) {
                el.show();
            } else {
                el.hide();
            }
        });
    },

    setPromoTemplate : function () {
        var templateName = this.type === this.stateActive ? 'promo-time-remain-template' : 'promo-time-upcoming-template';

        this.togglePriceBox();
        var oldElement = this.mainElement.up('div');
        var newElement = new Element('div').update($(templateName).innerHTML).down();
        Element.insert(oldElement, {after : newElement});
        Element.remove(oldElement);
        this.mainElement = newElement.down('span');
        this.initElements();
    },

    togglePriceBox : function () {
        if (this.type === this.stateActive || this.type === this.stateUpcoming) {
            this.getPriceBox().setStyle({display : 'block'});
        } else {
            this.getPriceBox().setStyle({display : 'none'});
        }
    },

    /**
     * Init elements of product item.
     */
    initElements : function () {
        var itemContainer  = this.mainElement.up('.item');
        var promoContainer = itemContainer.down('.promo-time-container');
        this.elements      = {
            itemContainer      : itemContainer,
            promoContainer     : promoContainer,
            time               : promoContainer.down('span'),
            qtyContainer       : itemContainer.down('.promo-quantity-remaining'),
            priceBox           : itemContainer.down('.price-update-container'),
            expiredMask        : itemContainer.down('.missed-deal'),
            progressBar        : itemContainer.down('.promo-status-bar'),
            timeOuterContainer : itemContainer.down('.promo-time-remaining-outer-container'),
        };
    },

    getItemContainer : function () {
        return this.elements.itemContainer;
    },

    getPromoContainer : function () {
        return this.elements.promoContainer;
    },

    getTimeElement : function () {
        return this.elements.time;
    },

    getPriceBox : function () {
        return this.elements.priceBox;
    },

    getExpiredMask : function () {
        return this.elements.expiredMask;
    },

    getProgressBar : function () {
        return this.elements.progressBar;
    },

    getQtyContainer : function () {
        return this.elements.qtyContainer;
    },

    getTimeOuterContainer : function () {
        return this.elements.timeOuterContainer;
    },

    setUseQtyBar : function () {
        if (!this.useTimeBar) {
            this.useQtyBar = true;
            this.showBar   = true;
        }
    },

    checkProgressBarStatus : function (forceHide) {
        var el;
        if (el = this.getProgressBar()) {
            if (!forceHide && this.showBar && this.type !== this.stateUpcoming) {
                el.show()
            } else {
                el.hide();
            }
        }
    },

    adjustProgressBar : function (value) {
        var el;
        if (el = this.getProgressBar()) {
            value          = value > 100 ? 100 : value;
            var barClasses = {80 : 'green', 50 : 'orange', 0 : 'red'}, barClass,
                innerEl    = el.down('.promo-status-bar-inner'),
                keys       = Object.keys(barClasses).reverse();
            for (var i = 0; i < keys.length; i++) {
                var itemValue = barClasses[keys[i]];
                if (!barClass && value > keys[i]) {
                    barClass = itemValue;
                }
                innerEl.removeClassName(itemValue);
            }
            innerEl.setStyle({width : value + '%'}).addClassName(barClass);
        }

        return this;
    },

    checkTimeContainerStatus : function () {
        var el;
        if (el = this.getPromoContainer()) {
            if (this.timeTo && this.type == this.stateActive || this.timeFrom && this.type == this.stateUpcoming) {
                el.show();
            } else {
                el.hide();
            }
        }
    },

    showQtyContainer : function () {
        var el;
        if (el = this.getQtyContainer()) {
            el.show();
        }
    },

    afterTimeSet : function () {
        if (!this.timerContainerInitiated) {
            this.timerContainerInitiated = true;
            this.checkTimeContainerStatus();
            this.checkProgressBarStatus();
        }
        if (this.useTimeBar) {
            this.adjustProgressBar(this.secRemain / this.timeTotal * 100);
        }
    },

    changeView : function () {
        if (this.disableView == 1) {
            var enable        = this.type != this.stateUpcoming,
                itemContainer = this.getItemContainer();
            if (enable) {
                itemContainer.removeClassName('item-upcoming');
                itemContainer.removeClassName('purchase-disabled');
                itemContainer.removeClassName('purchase-enabled');
                itemContainer.fire('hot-deal-item:enabled');
            }
            itemContainer.select('a').each(function (el) {
                var newOnclick, oldOnclick,
                    dataHref = el.getAttribute('data-href'),
                    href     = el.getAttribute('href');
                if (enable && dataHref) {
                    el.setAttribute('href', dataHref);
                } else if (!enable) {
                    el.setAttribute('data-href', href || dataHref);
                    el.removeAttribute('href');
                }
                if (oldOnclick = el.getAttribute('onclick')) {
                    if (enable) {
                        if (el.onclickBackup) {
                            newOnclick = el.onclickBackup;
                        }
                    } else {
                        el.onclickBackup = oldOnclick;
                        newOnclick       = 'return false;';
                    }
                    if (newOnclick) {
                        el.setAttribute('onclick', newOnclick)
                    }
                }
            });
        }
    }
};

// Shame block to fix upcoming price display
Event.observe(window, 'load', function () {
  var upcomingMessage = jQuery('.product-cart-box > .price-box').siblings('.promo-upcoming-wrapper-item').detach();
  jQuery('.product-cart-box > .price-box').append(upcomingMessage);
  jQuery('.product-cart-box > .price-box > .promo-upcoming-wrapper-item').css({'position': 'static'});
  jQuery('.promo-upcoming-wrapper-item').css({'display': 'block'});
});
