var RogueGiftRegistry = new Class.create();
RogueGiftRegistry.prototype = {
    initialize : function (url, formId)
    {
        this.url = url;
        this.form = $(formId);
        this.formId = formId;
        this.popup = 'adjgiftreg-popup';
        this.ajaxInProccess = false;
    },

    addToRegistry : function (registryId)
    {
        if(this.ajaxInProccess) {
            return;
        }

        if (!this.validate()) {
            var errorElement = $$('.product-purchase .cart-in-line-error:visible', '.product-purchase .validation-error').findAll(function (el) {
                    return el.visible();
                }),
                scrollElement;
            if (errorElement.length) {
                scrollElement = errorElement[0].up('.product-purchase');
            } else {
                scrollElement = $('super-product-table') || $$('.product-essential')[0] || $$('body')[0];
            }
            window.scrollTo(0, scrollElement.cumulativeOffset().top);
            this.unDisableItems();
            return;
        }

        var self = this,
            registryIdString = registryId ? '&registry_id=' + registryId : '';

        self.hideWindow();
        //showProgressAnimation();
        self.ajaxInProccess=true;
        new Ajax.Request(this.url, {
            method     : 'post',
            dataType   : 'json',
            parameters : Form.serialize(this.form) + registryIdString,
            onComplete : function (transport)
            {
                self.unDisableItems();
                self.ajaxInProccess=false;
                var data = transport.responseJSON;
                if (data.error_message) {
                    self.showWindow([], data.error_message);
                } else if (!data.registry_items.length) {
                    if (window.store && window.store.dispatch) {
                        window.store.dispatch('message', data.success_message);
                    } else {
                        holla(data.success_message, 'message');
                    }
                } else {
                    self.showWindow(data.registry_items);
                }
              }
        });
    },

    unDisableItems: function () {
        var qtys = $$("#super-product-table .qty");
        qtys = qtys.concat($$("#super-product-table-1 .qty"));
        qtys = qtys.concat($$("#super-product-table-2 .qty"));

        qtys.each(function (qty) {
            $(qty).disabled = '';
        });
    },

    showWindow : function (items, errorMessage)
    {
        var content = $('adjgiftreg-popup-content');

        content.update('');
        items.each(function (item)
        {
            var element = new Element('a', {'class' : 'btn-green btn', 'onclick' : 'rogueGiftRegistry.addToRegistry(' + item.id + ')'});
            element.innerHTML = item.title;
            content.insert(element);
        });

        if (errorMessage) {
            content.update(errorMessage);
        }

        $(this.popup).addClassName('open').setStyle({display : 'block'})
        document.body.style.overflowY = 'hidden';
    },

    validate : function ()
    {
        var varienFormInstance = new VarienForm(this.formId),
            qtys = $$("#super-product-table .qty"),
            qtySelected = false,
            disabledOptions = [];

        qtys.concat($$("#super-product-table-1 .qty"));
        qtys.concat($$("#super-product-table-2 .qty"));

        qtys.each(function (el)
        {
            if (! el.value.length) {
                el.value = 0;
            }

            var elValue = parseInt(el.value),
                elName = el.name,
                elMatch = elName.match(/\d+/),
                elId = parseInt(elMatch[0]);

            qtySelected = qtySelected || elValue;

            var productOptions = $$('#super_group_' + elId + ' .product-custom-option');
            productOptions = productOptions.concat($$('#super_group_' + elId + ' input[type="hidden"]'));
            productOptions = productOptions.concat($$('#super_group_' + elId + ' .config-attribute-option'));

            if (elValue == 0) {
                productOptions.each(function (option) {
                    $(option).disabled = 'disabled';
                    disabledOptions.push(option);
                });
                $(el).disabled = 'disabled';
            }
            else {
                productOptions.each(function (option) {
                    $(option).disabled = '';
                });
            }
        });

        if (qtys.length && ! qtySelected) {
            qtyValidator.processErrorMessage();

            disabledOptions.each(function (option) {
                $(option).disabled = '';
            });

            return false;
        }

        var result = ! varienFormInstance.validator || varienFormInstance.validator.validate();

        disabledOptions.each(function (option) {
            $(option).disabled = '';
        });

        return result;
    },

    hideWindow : function ()
    {
        $(this.popup).setStyle({display : 'none'});
        document.body.style.overflowY = '';
    }
};
