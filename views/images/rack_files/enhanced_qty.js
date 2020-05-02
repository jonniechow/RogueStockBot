document.observe("dom:loaded", function () {
    (function ($) {
        var EnhancedQty = function () {
            this.init.apply(this, arguments);
        };
        EnhancedQty.prototype = {
            init: function (input, config) {
                this.input = input;
                this.config = config;
                this.setEventListeners();
                this.initDropDown();
            },


            setEventListeners: function () {
                var self  = this,
                    input = self.input;
                input.on('focus', function () {
                    input.data('default-val', input.val());
                    if (window.isMobile) {
                        input.val('');
                    }
                });

                input.on('blur', function () {
                    var isEmpty = Validation.get('IsEmpty').test(this.value);
                    if ((!isEmpty || window.isMobile) && (isEmpty || !self.isValueValid())) {
                        input.val(input.data('default-val'))
                    } else if (isEmpty) {
                        this.value = 0;
                    }

                    if (typeof qtyValidator !== 'undefined') {
                        qtyValidator.processErrorMessage(this, null, true);
                    }
                });
            },

            isValueValid: function () {
                var value = this.input.val().replace(/\s+/g, '');

                return !Validation.get('IsEmpty').test(value) && !/[^\d]/.test(value);
            },

            initDropDown: function () {
                var self  = this,
                    input = self.input;

                //wrap element
                input.wrap('<div class="expanded-wrapper"></div>');
                input.attr('autocomplete', 'off');
                var newDivHtml = '<ul>';
                for (var i = 1; i <= self.config.max; i++) {
                    newDivHtml += '<li class="expanded-li" data-value="' + i + '">' + i + (i == self.config.max ? '+' : '') + '</li>';
                }

                newDivHtml += '</ul>';

                var newDiv = $('<div />',
                    {
                        'class': 'expanded-options',
                        style  : 'display:none',
                        html   : newDivHtml
                    }
                );
                input.addClass('expanded-qty');
                input.after(newDiv);

                //click
                input.on('click', function () {
                    if (!window.isMobile && window.$html.data('useragent').indexOf('iPad') == -1) {
                        newDiv.show();
                    }
                });

                //keydown
                input.on('keydown', function () {
                    newDiv.hide();
                });

                //hide
                var fnHide = function (e) {
                    if (!e || (!e.toElement && !$$('.expanded-options:hover').length) || (e.toElement && !e.toElement.hasClassName('expanded-li') && !e.toElement.hasClassName('qty-hover'))) {
                        newDiv.hide();
                    }
                };
                newDiv.on('mouseleave', fnHide);
                input.on('blur', fnHide);

                //click on number option
                newDiv.find('li').on('click', function () {
                    fnHide();
                    if (input.attr('disabled')) {
                        return;
                    }
                    var value = $(this).data('value'), eventToFire;
                    input.focus();
                    if (value == self.config.max) {
                        input.val('');
                        eventToFire = 'blur';
                    } else {
                        input.val(value);
                        eventToFire = 'change';
                    }
                    input[0].fire('qty:' + eventToFire);
                });
            }
        };

        $.fn.enhancedQty = function (options) {
            var config = $.extend({
                max        : 10,
                actionDelay: 400
            }, options);

            return this.each(function () {
                var el       = $(this),
                    property = 'enhancedQty';
                if (!el.data(property)) {
                    el.data(property, new EnhancedQty(el, config));
                }
            });
        };

        var selector = '.product-purchase input.qty';
        $(selector).enhancedQty();
        /*if (typeof quickView != 'undefined') {
            quickView.addShowObserver(function () {
                $(selector).enhancedQty();
            });
        }*/
    })(jQuery);
});