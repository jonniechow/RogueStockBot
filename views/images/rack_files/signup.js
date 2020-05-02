var roguebinurl,
    roguebinunsubscribeurl,
    binAdditionalData = null;

function IsEmail(email) {
    return /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
}

function binsignupAction(id, parent) {
    var validemail  = true,
        binresponse = jQuery('#roguebin-response-' + id),
        emailField  = jQuery("#binemail-" + id);

    if (emailField.length && emailField.parent().is(':visible')) {
        var email  = emailField.val();
        validemail = IsEmail(email);
    }

    if (validemail) {
        var additionalData = '';
        if (binAdditionalData) {
            additionalData = binAdditionalData;
        }
        binresponse.closest('.bin-signup-container').find('div.bin-signup-fields, p.bin-message').hide();
        binresponse.show().html('Submitting...');
        binresponse.removeClass('error inline');
        jQuery.ajax({
            url      : roguebinurl,
            type     : "POST",
            dataType : 'json',
            data     : {
                id        : id,
                parent    : parent,
                email     : email,
                form_data : additionalData
            },
            async    : true,
            success  : function (response) {
                binAdditionalData = null;
                if (response.success == true) {
                    binresponse.html('Signup Successful');
                    jQuery('#binemail-' + id).val('');
                    binresponse.removeClass('error inline');
                    binresponse.addClass('success');
                    binresponse.prev().hide();
                }
                else {
                    binresponse.html('Signup Failed: ' + response.message);
                    binresponse.addClass('error');
                }
            }
        });
    } else if (email != '') {
        binresponse.html('Please enter a valid e-mail address');
        binresponse.addClass('error inline');
        binresponse.show();

    } else if (email == "") {
        binresponse.html('Please enter an e-mail address');
        binresponse.addClass('error inline');
        binresponse.show();
    }
}

function changeBinEmailFieldState() {
    if (typeof rogueCache != 'undefined') {
        var email   = jQuery('.bin-email-field'),
            message = jQuery('.bin-email-message');
        if (rogueCache.l || isMobileAppWithAuthParams()) {
            email.hide();
            message.show();
        } else {
            email.show();
            message.hide();
        }
    }
}

function signupToggle(_this) {
    jQuery("div.bin-signup-container").addClass("open");
    binAdditionalData         = null;
    var availabilityContainer = jQuery(_this).closest('.bin-stock-availability');
    var popup                 = availabilityContainer.next('.bin-signup-container');

    //if called from quick view
    if (typeof quickView != 'undefined' && quickView.windowIsOpen) {
        popup = popup.clone();
        popup.addClass('qvbinpopup');
        quickView.hideWindow();
    } else {
        popup.addClass('moved-bin-popup');
        if (popup[0]) {
            popup[0].availabilityContainer = availabilityContainer;
        }
    }
    popup.appendTo('body');

    changeBinEmailFieldState();

    popup.show();
    popup.find('.bin-response').html('').hide();
    popup.find('div.bin-signup-fields, .bin-message').show();

    //gathering of buyRequest options to send
    var gatherElement = jQuery(_this).closest('.bin-additional-data');
    if (gatherElement) {
        var form   = jQuery('<form />');
        var select = jQuery(_this).closest('.item-detail').find("select[class*='super-attribute-select-']");
        if (select.length) {
            select.each(function () {
                var hiddenInput = jQuery(this).next();
                hiddenInput.find('input').val(jQuery(this).val());
                form.html(form.html() + hiddenInput.html());
            });
        }
        else {
            form.html(gatherElement.html());
        }
        binAdditionalData = form.serialize();
        form.remove();
    }

    popup.on('click', function (e) {
        var className = jQuery(e.target).attr('class'),
            n         = className.search("bin-signup-container");

        if (!n) {
            signupClose();
        }
        else {
            return false;
        }
    })
}

function signupClose(_this) {
    jQuery("div.bin-signup-container").hide().removeClass('open');
    jQuery('div.bin-signup-container.qvbinpopup').remove();

    var moveClassName = 'moved-bin-popup',
        movedPopups   = jQuery('.' + moveClassName);
    if (movedPopups.length) {
        movedPopups.each(function () {
            var el = jQuery(this);
            el.removeClass(moveClassName);
            if (this.availabilityContainer) {
                this.availabilityContainer.after(el);
            } else {
                el.remove();
            }
        });
    }

    // Returns page scroll back
    document.body.style.overflowY = '';
}

function roguebinunsubscribe(id, prodname, elm, isMobileContext) {
    if (confirm('Are you sure you do not want to be notified when ' + prodname + ' is back in stock?')) {
        jQuery(elm).after('<div class="rgbin-preloader-wrapper"><div class="rgbin-preloader"></div></div>');

        jQuery.ajax({
            url      : roguebinunsubscribeurl,
            type     : "POST",
            dataType : 'json',
            data     : {
                id : id
            },
            async    : true,
            success  : function (response) {
                if (response) {
                    jQuery('#spin' + id).remove();
                    var td = jQuery(elm).parent(),
                        tr = td.parent();
                    if (!tr.siblings().length) {
                        if (!isMobileContext) {
                            tr.parents('.bin-table-wrapper').fadeOut(400, function () {
                                jQuery(this).remove();
                                jQuery('.rgbin-acc-placeholder').show();
                            });
                        } else {
                            window.location.reload();
                        }
                    }
                    else {
                        tr.css("background-color", "#FF3700");
                        tr.fadeOut(400, function () {
                            tr.remove();
                        });
                    }
                }
                else {
                    alert('Error during the process');
                }
            }
        });
    }
}

function rogueBinEmailKeydown(event, productId) {
    if (event.keyCode !== 13) {
        return;
    }

    var button = document.getElementById('bin-button-' + productId);
    if (!button) {
        return;
    }

    event.keyCode = 0;
    if (event.preventDefault) {
        event.preventDefault();
    }

    button.click();

    return false;
}

function isMobileAppWithAuthParams() {
    return window.isInMobileAppContext
        && Mage.Cookies.get('oauth_token')
        && Mage.Cookies.get('oauth_token_secret');
}
