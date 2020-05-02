var ieVersion = (function () {
    if (document.documentMode) {
        return document.documentMode;
    } else {
        for (var i = 7; i > 0; i--) {
            var div = document.createElement("div");

            div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

            if (div.getElementsByTagName("span").length) {
                return i;
            }
        }
    }

    return undefined;
})();



if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (fun /*, initial*/) {
        var len = this.length;

        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        }
        else {
            do
            {
                if (i in this) {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len)
                    throw new TypeError();
            }
            while (true);
        }
        for (; i < len; i++) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }
        return rv;
    };
}

//Posted by Greg http://stackoverflow.com/questions/460644/trigger-an-event-with-prototype
Element.prototype.triggerEvent = function (eventName) {
    if (document.createEvent) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, true);
        return this.dispatchEvent(evt);
    }

    if (this.fireEvent)
        return this.fireEvent('on' + eventName);
};

var domAfterLoadCallback = function (fn, lowerState) {
    if (typeof fn == 'function') {
        // IE10 and lower don't handle "interactive" properly... use a weak inference to detect it
        var ie10           = ieVersion <= 10,
            lowerStateName = ie10 ? "complete" : "interactive";
        if(document.readyState === "complete" || (lowerState && document.readyState === lowerStateName)) {
            fn();
        } else {
            document.observe("dom:loaded", fn);
        }
    }
};

window.isTouchDevice = false;
try {
    document.createEvent("TouchEvent");
    window.isTouchDevice = true;
} catch (e) {
}

var spaceInField = /\s/g;

var validationEmailCallback = function (v) {
    v = v.replace(spaceInField, '');
    return Validation.get('IsEmpty').test(v) || (/^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@[a-z0-9]+([a-z0-9-]{0,})+(\.[a-z0-9-]+)*\.([a-z]{2,})$/i.test(v) && !(/(-\.)/g.test(v)))
};

Validation.add('validate-email', 'Please enter a valid email address. For example johndoe@domain.com.', validationEmailCallback);

//fix for input focus bug on iOS (window is not getting scrolled to input if button is placed below the input)
Validation.prototype.validate = function () {
    var result    = false;
    var useTitles = this.options.useTitles;
    var callback  = this.options.onElementValidate;
    try {
        if (this.options.stopOnFirst) {
            result = Form.getElements(this.form).all(function (elm) {
                if (elm.hasClassName('local-validation') && !this.isElementInForm(elm, this.form)) {
                    return true;
                }
                return Validation.validate(elm, {useTitle : useTitles, onElementValidate : callback});
            }, this);
        } else {
            result = Form.getElements(this.form).collect(function (elm) {
                if (elm.hasClassName('local-validation') && !this.isElementInForm(elm, this.form)) {
                    return true;
                }
                return Validation.validate(elm, {useTitle : useTitles, onElementValidate : callback});
            }, this).all();
        }
    } catch (e) {
    }
    if (!result && this.options.focusOnError) {
        try {
            var firstEl = Form.getElements(this.form).findAll(function (elm) {
                return $(elm).hasClassName('validation-failed')
            }).first();
            //actual fix for iPhone
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                var firstEloffsetTop = firstEl.cumulativeOffset().top;
                if (firstEloffsetTop > 0) {
                  window.scrollTo(0, firstEloffsetTop - 30);
                }
            }
            firstEl.focus();
        }
        catch (e) {
        }
    }
    this.options.onFormValidate(result, this.form);
    return result;
};

Validation.createAdvice = Validation.createAdvice.wrap(function (callOriginal, name, elm, useTitle, customError) {
    if (!customError && 'validate-length' == name) {
        var v     = Validation.get(name),
            reMax = new RegExp(/^maximum-length-[0-9]+$/),
            reMin = new RegExp(/^minimum-length-[0-9]+$/),
            range = {};
        $w(elm.className).each(function (name) {
            if (name.match(reMax)) {
                range.max = name.split('-')[2];
            }
            if (name.match(reMin) && !Validation.get('IsEmpty').test(v)) {
                range.min = name.split('-')[2];
            }
        });

        if (Object.keys(range).length) {
            if (range.min && range.max) {
                customError = 'Text length does not satisfy specified text range (' + range.min + ' - ' + range.max + ' characters).';
            } else if (range.min) {
                customError = 'You have not input minimum required characters [' + range.min + '] for this field.';
            } else {
                customError = 'You have exceeded the maximum allowed characters [' + range.max + '] for this field.';
            }
        }
    }

    return callOriginal(name, elm, useTitle, customError);
});

document.observe("dom:loaded", function () {
    $$('.validate-email').each(function (item) {
        item.observe('change', function () {
            if (spaceInField.test(item.value)) {
                item.value = item.value.replace(spaceInField, '');
            }
        });
    });

    $$('.validate-zip-international').each(function (item) {
        item.observe('change', function () {
            item.value = item.value.trim();
        });
    });
});

var validatorAlphanum = Validation.methods['validate-alphanum'];
Validation.add(
    'validate-alphanum-trim',
    validatorAlphanum.error,
    function (value, element) {
        element.value = element.value.replace(/\s/g, '');

        return validatorAlphanum._test(element.value);
    }
);
