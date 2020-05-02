var EditableCart             = new Class.create(),
    EditableCartElement      = new Class.create(),
    EditableCartDefaultField = new Class.create(),
    EditableCartQtyField     = new Class.create(),
    EditableUpdateState      = new Class.create();



EditableCart.prototype = {
    inProgress: [],
    initialize: function (parentContainer, fieldGroups, removeLink, formSelector, translations, urls, updateCartCountOnly, isResponsive) {
        var self = this;
        self.mobileWidth = 800;
        self.isMobile = typeof IS_MOBILE != 'undefined' && IS_MOBILE == 1;
        self.removeLinks = $$(parentContainer + ' ' + removeLink);
        self.translator = new Translate(translations);
        self.urls = urls;
        self.form = null;
        self.updateCartCountOnly = updateCartCountOnly;
        self.isResponsive = isResponsive;
        self.setMobile();

        var allFields = [],
            forms = $$(formSelector);
        for (var group in fieldGroups) if (fieldGroups.hasOwnProperty(group)) {
            allFields = allFields.concat($$(parentContainer + ' ' + fieldGroups[group]));
        }
        self.allFields = allFields;
        if (forms.length) {
            self.form = forms[0];
        } else {
            return;
        }

        for (group in fieldGroups) if (fieldGroups.hasOwnProperty(group)) {
            var items = $$(parentContainer + ' ' + fieldGroups[group]);
            switch (group) {
                case 'qty' :
                    self.initQtyFields(items);
                    break;

                case 'custom_option' :
                case 'bundle_select' :
                case 'config_select' :
                    self.initDefaultFields(items);
                    break;
            }
        }

        self.initRemoveLink();

        if (isResponsive) {
            Event.observe(window, "resize", function () {
                self.setMobile();
            });
        }
    },

    setMobile               : function () {
        if (!this.isResponsive) {
            return;
        }
        this.isMobile = document.viewport.getWidth() <= this.mobileWidth;
        if (this.isMobile) {
            $$('.qty-expanded-options').each(function (element) {
                Element.hide(element);
            })
        }
    },

    //init shipping options update
    initShippingOptions     : function (shippingOptionFormSelector) {
        if (!this.form) {
            return;
        }
        shippingOptionFormSelector = shippingOptionFormSelector ? shippingOptionFormSelector : this.shippingOptionFormSelector;
        if (!shippingOptionFormSelector) {
            return;
        }

        this.shippingOptionFormSelector = shippingOptionFormSelector;
        var shippingOptionForm = $(shippingOptionFormSelector),
            self = this;

        if (!shippingOptionForm) {
            return;
        }

        //var selectedElement = shippingOptionForm.down('input[type="radio"]:checked');
        //if (selectedElement) {
        //    selectedElement.up('label').addClassName('active');
        //}

        //remove from allFields
        self.allFields.each(function (item, i) {
            if ($(shippingOptionFormSelector).contains(item)) {
                delete self.allFields[i];
            }
        });

        shippingOptionForm.select('input').each(function (item) {
            self.allFields.push(item);
            item.editCartObject = new EditableCartDefaultField(item, self);
            item.editCartObject.urlKey = 'setShipping';
            item.editCartObject.parentElement = '.shipping-methods';
            item.editCartObject.formElement = null;
            item.editCartObject.blockingElement = item.up('.shipping');
            item.editCartObject.addEventListeners();
            Event.observe(item, 'change', function () {
                var label = item.up('label');
                shippingOptionForm.select('label').each(function (label) {
                    //label.removeClassName('active');
                });

                if (item.checked) {
                    //label.addClassName('active');
                }
            });
        });
    },

    //init estimate shipping form
    initEstimateShippingForm: function (shippingFormSelector) {
        if (!this.form) {
            return;
        }

        var form = $$(shippingFormSelector),
            self = this;
        if (!form.length) {
            return;
        }
        form = form[0];

        var btn = $('shipping-get-quote-button');
        form.submitEvent = function () {
            //shipping-get-quote-button
            var onComplete = function () {
                    //if (btn && btn.getAttribute('data-defaulttext')) {
                    //    btn.innerHTML = btn.getAttribute('data-defaulttext');
                    //}
                    btn.removeClassName("btn-updating");
                },
                onCreate = function () {
                    btn.addClassName("btn-updating");

                    //if (btn) {
                    //    if (!self.shippingGetQuoteButtonAdded) {
                    //        self.allFields.push(btn.up('button'));
                    //        self.shippingGetQuoteButtonAdded = true;
                    //    }
                    //
                    //    self.shippingGetQuoteButtonAdded = true;
                    //    btn.setAttribute('data-defaulttext', btn.innerHTML.stripTags());
                    //    btn.innerHTML = self.translator.translate('Getting a Quote...');
                    //}

                    var vatError = $('vat-error');
                    if (vatError) {
                        Element.remove(vatError);
                    }
                },
                onSuccess = function (response) {
                    var vatId = form.down('#vat_id');
                    if (vatId) {
                        if (response.vat_error) {
                            //vatId.addClassName('validation-failed');
                            //Element.insert(vatId, {after: '<div class="clearfix" id="vat-error"><div class="form-error-message">' + response.vat_error + '</div></div>'});
                            holla(response.vat_error, 'error');
                        }
                    }

                    var shippingFileds = {}, key = '';
                    for (var i = 0; i < form.elements.length; i++) {
                        if (form.elements[i].value) {
                            key = form.elements[i].name !== 'estimate_postcode' ? form.elements[i].name : 'postcode';
                            shippingFileds['billing[' + key + ']'] = form.elements[i].value;
                        }
                    }
                    localStorage.setItem('checkoutFieldsItems', JSON.stringify(shippingFileds));
                },
                bindObject = {
                    updateId       : 'gettingQuote',
                    blockingElement: form.up('.shipping')
                };

            self.doRequest(self.urls.getQuote, Form.serialize(this), bindObject, onSuccess, onCreate, onComplete);
        };
    },

    //Init Qty
    initQtyFields           : function (fields) {
        var self = this;
        fields.each(function (item) {
            item.editCartObject = new EditableCartQtyField(item, self);
            item.editCartObject.addEventListeners();
            item.editCartObject.initQtyDropDown();
        });
    },

    // Init config options
    initDefaultFields       : function (fields) {
        var self = this;
        fields.each(function (item) {
            item.editCartObject = new EditableCartDefaultField(item, self);
            item.editCartObject.blockingElement = item.up('.cart-product-container');
            item.editCartObject.addEventListeners();
        });
    },

    // Init removing link
    initRemoveLink : function () {
        var self = this;
        self.removeLinks.each(function (element) {
            Event.observe(element, 'click', function (e) {
                Event.stop(e);
                var id = self.getCartItemIdByElement(element),
                    onCreate = function () {
                        Element.addClassName(element, "btn-updating");
                    },
                    onSuccess = function (response) {
                        Element.removeClassName(element, "btn-updating");
                        Element.up(element, '.cart-product-container').remove();
                        if (Element.hasClassName(element, 'remove-and-move-to-cart') && response.save_for_later_count) {
                            $$('.save-for-later-h span')[0].innerHTML = response.save_for_later_count;
                        }

                        if (!Object.keys(response.cart_info.items).length) {
                            $$('.save-for-later-container').each(function(e) {
                                e.hide();
                            });
                        }

                        // Reflektion Cart Remove Push
                        if (window.rogueRfk) {
                            window.rogueRfk.rfkCartAnalyticsPush(response.cart_info, 'editItemInCart');
                        }
                    };

                self.doRequest(self.urls.deleteItem, {id: id}, self, onSuccess, onCreate);
            });
        });
    },

    // ajax call
    doRequest : function (url, data, bindObject, onSuccess, onCreate, onComplete) {
        var self = this;

        if (self.inProgress[bindObject.updateId]) {
            return;
        }

        self.inProgress[bindObject.updateId] = true;

        data = data || {};
        if (typeof data == 'object') {
            data.updateCartCountOnly = self.updateCartCountOnly;
        } else {
            data += (data.length > 0 ? '&' : '') + 'updateCartCountOnly=' + self.updateCartCountOnly;
        }

        if (typeof window.userTiming === 'object') {
          var editablecartUserTimingId = window.userTiming.start({
            timingCategory : 'Ajax Cart Pro',
            timingVar      : 'AJAX Response',
            timingLabel    : url.replace(/\/$/, '').split('/').pop(),
          })
        }

        new Ajax.Request(url, {
            parameters: data,
            onSuccess : function (response) {
                if (typeof window.userTiming === 'object') {
                  window.userTiming.stop(editablecartUserTimingId)
                }
                response = self._parseResponse(response);

                self.hideMessages();
                if (response.messages
                    && 'object' == typeof response.messages
                    && Object.keys(response.messages).length
                ) {
                    Object.keys(response.messages).forEach(function (type) {
                        holla(response.messages[type], type);
                    });
                }

                if (response.cart_info && typeof response.cart_info.items == 'object') {
                    if (Object.keys(response.cart_info.items).length) {
                        self.updateCartInfo(response.cart_info);
                        if (response.save_for_later_count) {
                            closeOffCanvasCart();
                        }
                    } else {
                        if ('save_for_later' != response.cart_info.type) {
                            window.location.reload();
                            return;
                        }
                    }

                    // Reflektion Cart Change Push
                    if (window.rogueRfk) {
                        window.rogueRfk.rfkCartAnalyticsPush(response.cart_info, 'editItemInCart');
                    }
                }

                if (response.cart_info && !response.cart_info.show_shipperhq_message) {
                    $$('.shipperhq-cart-message').invoke('remove');
                }

                // Smart Cart Message
                $$('.smart-cart-message').invoke('remove');
                if (response.hasOwnProperty('smart_cart_message') && Object.keys(response.smart_cart_message).length) {
                    var scmMessageKeys = Object.keys(response.smart_cart_message)
                    for (var j = 0; j < scmMessageKeys.length; j += 1) {
                        if (response.smart_cart_message[scmMessageKeys[j]].length) {
                            var messageWrapper = document.createElement('div');
                            messageWrapper.addClassName('smart-cart-message');
                            messageWrapper.addClassName(scmMessageKeys[j]);
                            $('cart-messages-wrapper').append(messageWrapper);
                            messageWrapper.update(response.smart_cart_message[scmMessageKeys[j]]);
                        }
                    }
                }

                // Update other blocks.
                self.updateTotals(response.totals, 'shopping-cart-totals-table');
                self.updateTotals(response.cart_subtotal, 'cart-subtotal-block');

                if (response.rewards_info && response.rewards_info.rewards) {
                    window.eventHub.$emit('updateRewardsBlock', response.rewards_info.rewards);
                }

                if (response.hasOwnProperty('shipping_options')) {
                    self.updateShippingOptions(response.shipping_options);
                }

                if (response.hasOwnProperty('quote_virtual')) {
                    var shippingContainer = $('shipping-container');
                    if (shippingContainer) {
                        if (response.quote_virtual) {
                            Element.hide(shippingContainer);
                        } else {
                            Element.show(shippingContainer);
                        }
                    }
                }

                if (typeof onSuccess == 'function') {
                    onSuccess.call(bindObject, response);
                }

                //invoice printing allowance
                if (response.hasOwnProperty('invoice_printing_allowed') && typeof bindInvoicePrinting == 'function') {
                    bindInvoicePrinting(response.invoice_printing_allowed);
                }

                //toggle checkout button visibility
                var checkoutButtonContainer = $('checkout-container-bottom');
                if (checkoutButtonContainer) {
                    if (response.quote_has_error) {
                        Element.hide(checkoutButtonContainer);
                    } else {
                        Element.show(checkoutButtonContainer);
                    }
                }

                //update mini cart
                if (response.mini_cart) {
                    if (typeof AW_ACP != 'undefined') {
                        var awcpValue = AW_ACP.isCartPage;
                        AW_ACP.isCartPage = false;
                    }
                    var cdCart = $('cd-cart'),
                        hasSpeedInClass = false;
                    if (cdCart) {
                        hasSpeedInClass = cdCart.hasClassName('speed-in');
                    }
                    updateCartView(response.mini_cart);

                    cdCart = $('cd-cart');
                    if (cdCart && hasSpeedInClass) {
                        cdCart.addClassName('speed-in');
                    }
                    if (typeof AW_ACP != 'undefined') {
                        AW_ACP.isCartPage = awcpValue;
                    }
                }

                //update save for later count label
                var saveForLaterWrapper = $('saveforlater-wrapper');
                if (response.save_for_later_count && saveForLaterWrapper) {
                    saveForLaterWrapper.down('.page-title h1 span').update(response.save_for_later_count);
                }

                // update cart icon
                updateTopLinks(response.mini_cart);
            },
            onCreate  : function () {
                if (typeof onCreate === 'function') {
                    onCreate();
                }

                self.allFields.each(function (item, i) {
                    if (item) {
                        item.setAttribute('disabled', 'disabled');
                    } else {
                        delete self.allFields[i];
                    }
                });

                $$(".cart .btn, .remove-and-save, .remove-and-move-to-cart, .remove_all_saved_button, .tocart_all_saved_button").each(function(item) {
                    item.setStyle({pointerEvents: 'none'});
                });

            },

            onComplete: function () {
                self.inProgress[bindObject.updateId] = false;
                self.allFields.each(function (item) {
                    if (!item.hasClassName('qty') || !item.readAttribute('data-fluid')) {
                        item.removeAttribute('disabled');
                    }
                    if (item.nodeName === 'SELECT' && typeof onSelectChange !== 'undefined') {
                        onSelectChange.call(item);
                    }
                });

                if (typeof onComplete == 'function') {
                    onComplete.apply(bindObject);
                }

                $$(".cart .btn, .remove-and-save, .remove-and-move-to-cart, .remove_all_saved_button, .tocart_all_saved_button").each(function(item){
                    item.setStyle({pointerEvents: ''});
                });
            }
        });
    },

    updateShippingOptions: function (shippingOptionsHtml) {
        var shippingContainer = $('shipping-methods');
        if (shippingContainer) {
            //Element.update(shippingContainer, shippingOptionsHtml);
            shippingContainer.update(shippingOptionsHtml);
            this.initShippingOptions();
        }
    },

    hideMessages: function () {
        var messages = this.form.up().down('ul.messages');
        if (messages) {
            messages.remove();
        }
    },

    showMessages: function (html) {
        Element.insert(this.form, {before: html});
    },

    updateCartInfo: function (cartInfo) {
        if (!cartInfo) {
            return;
        }

        var self = this;
        self.updateNames(cartInfo.ids_mapping, cartInfo.items_to_remove);

        if (typeof cartInfo.items == 'object') {
            var items = cartInfo.items;
            for (var itemId in items) if (items.hasOwnProperty(itemId)) {
                var idEl = self.form.down('.cart-product-details[data-itemid="' + itemId + '"]'), elToUpdate;
                if (idEl) {
                    //update prices
                    for (var blockType in items[itemId]['price']) if (items[itemId]['price'].hasOwnProperty(blockType)) {
                        for (var type in items[itemId]['price'][blockType]) if (items[itemId]['price'][blockType].hasOwnProperty(type)) {
                            elToUpdate = idEl.down('.' + blockType + '-price-' + type);
                            if (elToUpdate) {
                                Element.update(elToUpdate, items[itemId]['price'][blockType][type]);
                            }
                        }
                    }

                    //update links
                    if (typeof items[itemId].links == 'object') {
                        for (var linkId in items[itemId].links) if (items[itemId].links.hasOwnProperty(linkId)) {
                            idEl.select('.'+linkId).each(function (elToUpdate) {
                                elToUpdate.href = items[itemId].links[linkId];
                            });
                        }
                    }

                    if (items[itemId].image && (elToUpdate = idEl.up().down('img.product-image'))) {
                        elToUpdate.setAttribute('src', items[itemId].image);
                    }

                    var messageContainer = idEl.up('.cart-product-container').down('.item-message-container');
                    if (messageContainer) {
                        //add error messages
                        var text = '';
                        if (items[itemId].error) {
                            text = items[itemId].error;
                        }

                        Element.update(messageContainer, text);
                    }

                    //update qty
                    var qtyEl = self.form.select('input[name="cart[' + itemId + '][qty]"]');
                    if (qtyEl.length && items[itemId].hasOwnProperty('qty')) {
                        qtyEl[0].setValue(items[itemId]['qty']);
                        qtyEl[0].setAttribute('data-default', items[itemId]['qty']);
                        qtyEl[0].setAttribute('data-init', items[itemId]['qty']);
                    }

                    //update sku
                    var sku = idEl.down('.product-sku');
                    if (sku && items[itemId].hasOwnProperty('sku')) {
                        sku.update(items[itemId].sku);
                    }

                    //update options
                    if (items[itemId].hasOwnProperty('options') && Object.keys(items[itemId]['options']).length) {
                        for (var optionType in items[itemId].options) if (items[itemId].options.hasOwnProperty(optionType) && [
                                'config',
                                'custom'
                            ].indexOf(optionType) > -1) {
                            var optionTypeCollection = items[itemId].options[optionType];
                            for (var attributeId in optionTypeCollection) if (optionTypeCollection.hasOwnProperty(attributeId)) {
                                var optionsEl,
                                    optionVal    = optionTypeCollection[attributeId],
                                    optionElName = optionType == 'config' ? 'cart[' + itemId + '][super_attribute][' + attributeId + ']' : 'cart[' + itemId + '][cart_options][' + attributeId + ']';
                                if (optionsEl = self.form.down('[name="' + optionElName + '"]')) {
                                    optionsEl.setValue(optionVal).setAttribute('data-init', optionVal);
                                }
                            }

                            if (optionType == 'config'
                                && window['spConfig' + itemId]
                                && typeof window['spConfig' + itemId].reinitCurrentOption == 'function') {
                                window['spConfig' + itemId].reinitCurrentOption();
                            }
                        }
                    }
                }
            }
        }
    },

    updateTotals          : function (totalHtml, elementId) {
        if (totalHtml) {
            var totals = $(elementId);
            if (totals) {
                Element.insert(totals, {after: totalHtml});
                totals.remove();
            }
        }
    },

    // update names for elements with new quote item id
    updateNames           : function (names, items_to_remove) {
        var self = this;
        if (Object.prototype.toString.call(names) === '[object Object]') {
            for (var oldId in names) if (names.hasOwnProperty(oldId)) {
                var idEl = self.form.down('.cart-product-details[data-itemid="' + oldId + '"]');
                if (idEl) {
                    idEl.setAttribute('data-itemid', names[oldId]);
                }

                self.form.select('*[name^="cart[' + oldId + ']["]').each(function (element) {
                    element.setAttribute('name', element.getAttribute('name').replace('cart[' + oldId + '][', 'cart[' + names[oldId] + ']['));
                });

                //handle file inputs
                self.form.select('input[type="file"]').each(function (element) {
                    var elName = element.getAttribute('name'),
                        elAction = $$('input[name="' + elName + '[action]"]'),
                        elementsToReplace = [element];

                    if (elAction.length) {
                        elementsToReplace.push(elAction[0]);
                    }

                    elementsToReplace.each(function (fileInput) {
                        fileInput.setAttribute('name', elName.replace('cart_' + oldId + '_options', 'cart_' + names[oldId] + '_options'));
                    })
                });

                //handle date time elements
                self.form.select('input[name^="validate_datetime_"]').each(function (element) {
                    element.setAttribute('name', element.getAttribute('name').replace(/^validate_datetime_(\d+)_\d+/, 'validate_datetime_$1_' + names[oldId]));
                });

                if (window['spConfig' + oldId]) {
                    window['spConfig' + names[oldId]] = window['spConfig' + oldId];
                }
            }
        } else if (Object.prototype.toString.call(items_to_remove) === '[object Array]') {
            for (var i = 0; i < items_to_remove.length; i ++) {
                self.form.select('*[name^="cart[' + items_to_remove[i] + ']["]').each(function (element) {
                    var elToRemove = element.up('.cart-product-container');
                    if (elToRemove.parentNode) {
                        elToRemove.remove();
                    }
                });
            }
        }
    },

    //parse response
    _parseResponse        : function (transport) {
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

    //get row id
    getCartItemIdByElement: function (element) {
        var detailEl = element.up('.cart-product-container').down('.cart-product-details'),
            result = null,
            itemId = detailEl.getAttribute('data-itemid');

        if (itemId) {
            return itemId;
        }

        $w(detailEl.className).each(function (className) {
            var match = /details-(\d+)/.exec(className);
            if (match && match.length == 2) {
                result = match[1];
                return false;
            }
        });

        return result;
    }
};

/**
 * Update links
 */
EditableUpdateState.prototype = {
    //states: 1 - update, 2 - updating, 3 - updated
    initialize: function (element, initState, editableCard, requestData, getTargetFn, blockingElement) {
        this.element = element;
        this.editableCart = editableCard;
        this.requestData = requestData;
        this.state = initState;
        this.initalState = this.state;
        this.hideResultTimeout = 3000;
        this.timeoutId = false;
        this.updateId = element.name;
        this.blockingElement = this.blockingElement || blockingElement;

        this.addStateContainer(getTargetFn);
    },

    addStateContainer: function (getTargetFn) {
        this.indicatorElement = new Element('span', {
            className: 'state-updated',
            style    : 'display:none'
        });

        var container = new Element('div', {className: 'state-update', style: 'display:none'}),
            elements = [new Element('a', {
                style    : 'display:none',
                className: 'state-update-link'
            }).update(this.editableCart.translator.translate('Update')),
                new Element('span', {
                    className: 'state-updating',
                    style    : 'display:none'
                }),
                this.indicatorElement
            ],
            self = this;

        //element handlers
        if (self.state == 1) {
            Event.observe(elements[0], 'click', self.setState.bind(self, 2, false));
        }

        //container.appendChild(elements[1]);
        //container.appendChild(elements[2]);

        this.elements = elements;
        var target = this.element;
        if (typeof getTargetFn == 'function') {
            target = getTargetFn(target);
        }
        //target.insert({after: container});
        //container.insert({after: elements[0]});

        this.container = container;
    },

    doRequest: function () {
        var self = this,
            $inputContainer = self.element.up('.input-radio-group, .input-checkbox-group, .input-text, .input-select, .input-radio'),
            container       = self.element.up(self.element.cartParentElement),
            errorElements   = container ? container.select('.input-error') : [];
            onSuccess = function (response) {
                $inputContainer.removeClassName('input-updating');
                errorElements.each(function (errorElement) {
                    errorElement.removeClassName('input-error');
                });
                if (response.error) {
                    $inputContainer.addClassName('input-error');
                    setTimeout(function(){
                        $inputContainer.removeClassName('input-error');
                    },6000);
                } else {
                    $inputContainer.removeClassName('input-error');
                    $inputContainer.addClassName('input-updated');
                    setTimeout(function(){$inputContainer.removeClassName('input-updated');},3001);
                }

                this.setState(3);
                if (typeof this.requestData.onSuccess == 'function') {
                    this.requestData.onSuccess(response);
                }

                // update cart icon
                updateTopLinks(response.mini_cart);
            },
            onCreate = function() {
                self.setState.bind(self, 2, false);
                $inputContainer.removeClassName('input-updated').removeClassName("input-error").addClassName('input-updating');
            };

        self.editableCart.doRequest(self.requestData.url, self.requestData.getParameters(), self, onSuccess, onCreate);
    },

    reinit: function () {
        this.setState(this.initalState, true);
    },

    setState: function (state, initState) {
        var self = this;

        var doRequest = state == 2 && !initState;
        if (doRequest && self.editableCart.inProgress[self.updateId]) {
            return;
        }

        if (state) {
            self.state = state;
        }

        if (self.timeoutId) {
            clearTimeout(self.timeoutId);
        }

        initState = !!initState;

        self.elements.each(function (item, i) {
            if (!initState && self.state - 1 == i) {
                item.show();
            } else {
                item.hide();
            }
        });

        if (self.state == 3) {
            self.timeoutId = setTimeout(self.reinit.bind(self), self.hideResultTimeout);
        } else if (doRequest) {
            self.doRequest();
        }

        if (self.state < 2) {
            self.container.hide();
        } else {
            self.container.show();
        }
    }
};

/**
 * Abstract class for elements
 */
EditableCartElement.prototype = {
    urlKey          : '',
    onSuccess       : '',
    stateController : null,
    timeoutRequest  : 0,
    parentElement   : '.cart-product-container',
    formElement     : 'form',
    initialize     : function (input, editableCart) {
        if (input && editableCart) {
            this.input                     = input;
            this.input.editableCartElement = this;
            this.editableCart              = editableCart;
            this.input.cartParentElement   = this.parentElement;
            this.init();
            this.setInitValue();
        }
    },

    getInitState: function () {
        return 2;
    },

    getRequestDelay: function () {
        return 0;
    },

    onChange: function (state, requestDelay) {
        clearTimeout(this.timeoutRequest);
        requestDelay = typeof requestDelay == 'undefined' ? this.getRequestDelay() : requestDelay;
        this.timeoutRequest = setTimeout(this.onChangeAction.bind(this, state), requestDelay);
    },

    onChangeAction: function (state) {
        var input = this.input;
        if (input.getAttribute('data-notvalid') == 'true') {
            if (input.nextSetting && input.nextSetting.editableCartElement) {
                input.nextSetting.editableCartElement.onChangeAction(state);
            }
            return;
        }

        var self     = this,
            isSelect = input.type == "select-one",
            isValid  = this.isValueValid();

        if (isSelect && self.blockingElement) {
            $$('.btn-proceed-to-checkout').each(function (btn) {
                if (!isValid) {
                    btn.setAttribute('disabled', 'disabled');
                } else {
                    btn.removeAttribute('disabled');
                }
            });

            self.editableCart.allFields.each(function (item) {
                if (item && item !== self.input) {
                    if (!isValid) {
                        item.setAttribute('disabled', 'disabled');
                    } else {
                        item.removeAttribute('disabled');
                    }
                }
            });
        }

        if (this.input.getAttribute('data-oos') != 'true') {
            if (isValid && input.getValue() != input.getAttribute('data-init')) {
                state = typeof state == 'number' ? state : this.getInitState();
                this.getStateController().setState(state);
            } else {
                this.getStateController().reinit();
            }
        }
    },

    getStateController: function () {
        var self = this;
        if (!self.stateConstroller) {
            var onSuccess = function () {
                if (typeof self.onSuccess == 'function') {
                    this.onSuccess();
                }
                this.setInitValue();
            };
            self.stateConstroller = new EditableUpdateState(self.input, self.getInitState(), self.editableCart,
                {
                    url          : self.editableCart.urls[self.urlKey],
                    onSuccess    : onSuccess.bind(self),
                    getParameters: function () {
                        var formKey = self.editableCart.form.down('input[name="form_key"]'),
                            element = self.input.up(self.formElement || self.parentElement),
                            data = Form.serialize(element);

                        if (formKey) {
                            data += data ? '&' : '';
                            data += 'form_key=' + formKey.getValue();
                        }

                        return data;
                    }
                },
                self.getTargetFn,
                self.blockingElement
            );
        }

        return self.stateConstroller;
    },

    isValueValid: function () {
        if (this.input.type == 'checkbox' || this.input.type == 'radio') {
            return true;
        }

        var isSelect = this.input.type == 'select-one',
            value = this.input.getValue();

        return isSelect ? Validation.validate(this.input) : value.replace(/\s+/, '') != '';
    },

    setInitValue: function () {
        var value;
        switch (this.input.type) {
            case 'checkbox' :
            case 'radio' :
                this.input.setAttribute('data-init', -1);
                break;

            default:
                value = this.input.getValue();
                this.input.setAttribute('data-init', value);
        }
    }
}
;

/**
 * Qty Field
 */
EditableCartQtyField.prototype = new EditableCartElement();
EditableCartQtyField.prototype.init = function () {
    this.getTargetFn = function (element) {
        return element.up('.qty-and-price').down('.price-container'); // rg/2015
    };
    this.urlKey = 'updateItem';
    this.maxValue = 10;
    this.blockingElement = this.input.up('.cart-product-container');

    //should be uncommented if we need to show "Update" link for Qty input on desktop
    /*this.getInitState = function () {
     return this.editableCart.isMobile ? 2 : EditableCartElement.prototype.getInitState();
     };*/

    this.getRequestDelay = function () {
        //should be uncommented if we need to show "Update" link for Qty input on desktop
        //return this.editableCart.isMobile ? 400 : EditableCartElement.prototype.getRequestDelay();
        return 400;
    };

    this.isValueValid = function () {
        var value = this.input.getValue().replace(/\s+/g, '');

        return !Validation.get('IsEmpty').test(value) &&  !/[^\d]/.test(value);
    }
};

EditableCartQtyField.prototype.addEventListeners = function () {
    var input = this.input,
        self = this;

    //add event listener on focus/blur
    Event.observe(input, 'focus', function () {
        input.setAttribute('data-default', input.getValue());
        if (self.editableCart.isMobile) {
            input.setValue('');
        }
    });

    Event.observe(input, 'blur', function () {
        if (!self.isValueValid()) {
            self.input.setValue(self.input.getAttribute('data-default'));
            self.onChange();
        }
    });

    if (!self.editableCart.isMobile) {
        Event.observe(input, 'keyup', self.onChange.bind(self));
    } else {
        Event.observe(input, 'keyup', function (event) {
            var key = event.which || event.keyCode;
            if (key == 13) {
                self.onChange();
                input.blur();
            }
        });

        Event.observe(input, 'blur', function (event) {
            self.onChange();
        });
    }

};
EditableCartQtyField.prototype.initQtyDropDown = function () {
    var self = this,
        item = self.input,
        timeout = 0;

    //wrap element
    item.wrap('div', {className: 'expanded-wrapper'});

    var newDiv = new Element('div', {className: 'qty-expanded-options', style: 'display:none'});
    item.insert({after: newDiv});
    item.addClassName('expanded-qty');

    var newDivHtml = '<ul>';
    for (var i = 1; i <= self.maxValue; i++) {
        newDivHtml += '<li class="expanded-li" data-value="' + i + '">' + i + (i == self.maxValue ? '+' : '') + '</li>';
    }

    newDivHtml += '</ul>';
    newDiv.update(newDivHtml);

    /* EVENT LISTENERS */
    Event.observe(item, 'click', function () {
        if (!isMobile) {
            newDiv.show();
        }
    });

    if (!self.editableCart.isMobile) {
        Event.observe(item, 'keydown', function () {
            newDiv.hide();
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                item.blur();
            }, 500);
        });
    }

    //hide
    var fnHide = function (e) {
        if (!e || (!e.toElement && !$$('.qty-expanded-options:hover').length) || (e.toElement && !e.toElement.hasClassName('expanded-li') && !e.toElement.hasClassName('qty-hover'))) {
            newDiv.hide();
        }
    };
    Event.observe(newDiv, 'mouseleave', fnHide);
    Event.observe(item, 'blur', fnHide);

    //click on number option
    newDiv.select('li').each(function (option) {
        Event.observe(option, 'click', function () {
            fnHide();
            if (item.getAttribute('disabled')) {
                return;
            }
            var value = option.readAttribute('data-value');
            if (value == self.maxValue) {
                item.focus();
                item.setValue('');
            } else {
                item.setValue(value);
                item.editCartObject.onChange(2, 0);
            }
        });
    });
};

/**
 * Default fields
 */
EditableCartDefaultField.prototype = new EditableCartElement();
EditableCartDefaultField.prototype.init = function () {
    this.urlKey = 'updateItem';

    this.getInitState = function () {
        return 2;
    }
};

EditableCartDefaultField.prototype.addEventListeners = function () {
    var input = this.input,
        self = this;

    Event.observe(input, 'change', self.onChange.bind(self));
};

/**
 *  Other functionallity
 */
Event.observe(document, 'dom:loaded', function () {
    var table = $('shopping-cart-table');
    if (table) {
        var cartForm = table.up('form');

        //set enctype
        cartForm.setAttribute('enctype', 'multipart/form-data');

        //set validator
        cartForm.observe('submit', function (e) {
            var validator = new Validation(cartForm);
            if (validator.validate()) {
                cartForm.submit();
                return;
            }

            Event.stop(e);
        })//set validator
    }

    $$(".remove-and-save, .remove-and-move-to-cart").each(function(item) {
        item.observe('click', disableAllInCart);
    });

});

function emptyCartAction(element) {
    var form = element.up('form');
    if (form) {
        var input = new Element('input', {name: 'update_cart_action', value: 'empty_cart', type: 'hidden'});
        form.insert(input);
        form.submit();
    }
}

function validateOptionsCallback(elmId, result) {
    var container = $(elmId).up('ul.options-list');
    if (result == 'failed') {
        container.removeClassName('validation-passed');
        container.addClassName('validation-failed');
    } else {
        container.removeClassName('validation-failed');
        container.addClassName('validation-passed');
    }
}

function disableLinkBySelector(mainElement, selector) {
    if (!mainElement.isDisabled) {
        window.location.href = mainElement.getAttribute('href');
    }

    $$(selector).each(function (element) {
        element.isDisabled = true;
        element.setAttribute('href', 'javascript:void(0)');
    });

    disableAllInCart();
}

function disableAllInCart() {
    $$('.expanded-qty, .super-attribute-select, .bundle-option-select').each(function (item) {
        if (item) {
            item.setAttribute('disabled', 'disabled');
        }
    });

    $$(".cart .button, .remove-and-save, .remove-and-move-to-cart, .remove_all_saved_button, .tocart_all_saved_button").each(function (item) {
        item.setStyle({pointerEvents : 'none'});
    });
}
