/**
 * Magento Enterprise Edition
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Magento Enterprise Edition License
 * that is bundled with this package in the file LICENSE_EE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.magentocommerce.com/license/enterprise-edition
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    design
 * @package     enterprise_default
 * @copyright   Copyright (c) 2013 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

// Add validation hints
Validation.defaultOptions.immediate = true;
Validation.defaultOptions.addClassNameToContainer = true;

Event.observe(document, 'dom:loaded', function() {
    var inputs = $$('ul.options-list input');
    for (var i = 0, l = inputs.length; i < l; i ++) {
        inputs[i].addClassName('change-container-classname');
    }
})

if (!window.Enterprise) {
    window.Enterprise = {};
}
Enterprise.templatesPattern =  /(^|.|\r|\n)(\{\{(.*?)\}\})/;

Enterprise.TopCart = {
    initialize: function(container) {
        this.container = $(container);
        this.element = this.container.up(0);
        this.elementHeader = this.container.previous(0);
        this.intervalDuration = 4000;
        this.interval = null;
        this.onElementMouseOut = this.handleMouseOut.bindAsEventListener(this);
        this.onElementMouseOver = this.handleMouseOver.bindAsEventListener(this);
        this.onElementMouseClick = this.handleMouseClick.bindAsEventListener(this);

        this.element.observe('mouseout', this.onElementMouseOut);
        this.element.observe('mouseover', this.onElementMouseOver);
        this.elementHeader.observe('click', this.onElementMouseClick);
    },

    handleMouseOut: function (evt) {
        if ($(this.elementHeader).hasClassName('expanded')) {
            this.interval = setTimeout(this.hideCart.bind(this), this.intervalDuration);
        }
    },

    handleMouseOver: function (evt) {
        if (this.interval !== null) {
             clearTimeout(this.interval);
             this.interval = null;
        }
    },

    handleMouseClick: function (evt) {
        if (!$(this.elementHeader).hasClassName('expanded') && !$(this.container.id).hasClassName('process'))  {
            this.showCart();
        }
        else {
            this.hideCart();
        }
    },

    showCart: function (timePeriod) {
        this.container.parentNode.style.zIndex=992;
        new Effect.SlideDown(this.container.id, { duration: 0.5,
            beforeStart: function(effect) {$( effect.element.id ).addClassName('process');},
            afterFinish: function(effect) {$( effect.element.id ).removeClassName('process'); }
            });
        $(this.elementHeader).addClassName('expanded');
        if(timePeriod) {
            this.timePeriod = timePeriod*1000;
            this.interval = setTimeout(this.hideCart.bind(this), this.timePeriod);
        }
    },

    hideCart: function () {

        if (!$(this.container.id).hasClassName('process') && $(this.elementHeader).hasClassName('expanded')) {
            new Effect.SlideUp(this.container.id, { duration: 0.5,
                beforeStart: function(effect) {$( effect.element.id ).addClassName('process');},
                afterFinish: function(effect) {
                    $( effect.element.id ).removeClassName('process');
                    effect.element.parentNode.style.zIndex=1;
                    }
                });
        }
        if (this.interval !== null) {
            clearTimeout(this.interval);
            this.interval = null;
        }
        $(this.elementHeader).removeClassName('expanded');
    }
};


Enterprise.Bundle = {
     oldReloadPrice: false,
     initialize: function () {
        this.slider = $('bundleProduct');
        this.xOffset = $('bundle-product-wrapper').getDimensions().width;
     },
     swapReloadPrice: function () {
         Enterprise.Bundle.oldReloadPrice = Product.Bundle.prototype.reloadPrice;
         Product.Bundle.prototype.reloadPrice = Enterprise.Bundle.reloadPrice;
         Product.Bundle.prototype.selection = Enterprise.Bundle.selection;
     },
     reloadPrice: function () {
         var result = Enterprise.Bundle.oldReloadPrice.bind(this)();
         var priceContainer, duplicateContainer = null
         if (priceContainer = $('bundle-product-wrapper').down('.price-box .price-as-configured')) {
            if (duplicateContainer = $('bundle-product-wrapper').down('.duplicate-price-box .price-as-configured')) {
                duplicateContainer.down('.price').update(
                    priceContainer.down('.price').innerHTML
                );
            }
         }
         if (!this.summaryTemplate && $('bundle-summary-template')) {
             this.summaryTemplate = new Template($('bundle-summary-template').innerHTML, Enterprise.templatesPattern);
             this.optionTemplate = new Template($('bundle-summary-option-template').innerHTML, Enterprise.templatesPattern);
             this.optionMultiTemplate = new Template($('bundle-summary-option-multi-template').innerHTML, Enterprise.templatesPattern);
         }

         if (this.summaryTemplate && $('bundle-summary')) {
             var summaryHTMLArray = [];
             for (var option in this.config.options) {
                if (typeof (this.config.selected[option]) !== 'undefined') {
                    var optionHTML = '';
                    for (var i = 0, l = this.config.selected[option].length; i < l; i ++) {
                        var selection = this.selection(option, this.config.selected[option][i]);
                        if (selection && this.config.options[option].isMulti) {
                            optionHTML += this.optionMultiTemplate.evaluate(selection);
                        } else if (selection) {
                            optionHTML += this.optionTemplate.evaluate(selection);
                        }
                    }

                    if (optionHTML.length > 0) {
                        var position = parseInt(this.config.options[option].position);
                        summaryHTMLArray[position] = this.summaryTemplate.evaluate({label:this.config.options[option].title.escapeHTML(), options: optionHTML});
                    }
                }
             }

             var summaryHTML = summaryHTMLArray.join('');
             if (typeof($('bundle-summary').update(summaryHTML).childElements().last()) != 'undefined') {
                 $('bundle-summary').update(summaryHTML).childElements().last().addClassName('last');
             }
         }
         return result;
     },
     selection: function(optionId, selectionId) {
        if (selectionId == '' || selectionId == 'none') {
            return false;
        }
        var qty = null;
        if (this.config.options[optionId].selections[selectionId].customQty == 1 && !this.config['options'][optionId].isMulti) {
            if ($('bundle-option-' + optionId + '-qty-input')) {
                qty = $('bundle-option-' + optionId + '-qty-input').value;
            } else {
                qty = 1;
            }
        } else {
            qty = this.config.options[optionId].selections[selectionId].qty;
        }

        return {qty: qty, name: this.config.options[optionId].selections[selectionId].name.escapeHTML()};
     },
     start: function () {
        if (!$('bundle-product-wrapper').hasClassName('moving-now')) {
            new Effect.Move(this.slider, {
                x: -this.xOffset, y: 0, mode: 'relative', duration: 1.5,
                beforeStart: function (effect) {
                    $('bundle-product-wrapper').setStyle({height: $('productView').getHeight() + 'px'});
                    $('options-container').show();
                    Enterprise.BundleSummary.initialize();
                    $('bundle-product-wrapper').addClassName('moving-now');
                },
                afterFinish: function (effect) {
                    $('bundle-product-wrapper').setStyle({height: 'auto'});
                    $('productView').hide();
                    $('bundle-product-wrapper').removeClassName('moving-now');
                }
            });
         }
     },
     end: function () {
        if (!$('bundle-product-wrapper').hasClassName('moving-now')) {
            new Effect.Move(this.slider, {
                    x: this.xOffset, y: 0, mode: 'relative', duration: 1.5,
                    beforeStart: function (effect) {
                        $('bundle-product-wrapper').setStyle({height: $('options-container').getHeight() + 'px'});
                        $('productView').show();
                        $('bundle-product-wrapper').addClassName('moving-now');
                    },
                    afterFinish: function (effect) {
                        $('bundle-product-wrapper').setStyle({height: 'auto'});
                        $('options-container').hide();
                        Enterprise.BundleSummary.exitSummary();
                        $('bundle-product-wrapper').removeClassName('moving-now');
                    }
                });
        }
     }
};

Enterprise.BundleSummary = {
    initialize: function () {
        this.summary = $('bundleSummary');
        this.summaryOffsetTop = $('customizeTitle').getDimensions().height;
        this.summary.setStyle({top:this.summaryOffsetTop + "px"});
        this.summaryContainer = this.summary.up(0);
        this.doNotCheck = false;
        this.summaryStartY = this.summary.positionedOffset().top;
        this.summaryStartY = this.summaryOffsetTop;
        this.summaryStartX = this.summary.positionedOffset().left;
        this.onDocScroll = this.handleDocScroll.bindAsEventListener(this);
        this.GetScroll = setInterval(this.onDocScroll, 50);
        this.onEffectEnds = this.effectEnds.bind(this);
    },

    handleDocScroll: function () {
        if (this.currentOffsetTop == document.viewport.getScrollOffsets().top
            && (this.checkOffset(null) == null)) {
            return;
        } else {
            if (this.currentOffsetTop == document.viewport.getScrollOffsets().top) {
                this.doNotCheck = true;
            }
            this.currentOffsetTop = document.viewport.getScrollOffsets().top;
        }

        if (this.currentEffect) {
            this.currentEffect.cancel();
            var topOffset = 0;
            if (this.summaryContainer.viewportOffset().top < -60) {
               topOffset =  -(this.summaryContainer.viewportOffset().top);
            } else {
               topOffset = this.summaryStartY;
            }

            topOffset = this.checkOffset(topOffset);
            if (topOffset === null) {
                this.currentEffect = false;
                return;
            }

            this.currentEffect.start({
                x: this.summaryStartX,
                y: topOffset,
                mode: 'absolute',
                duration: 0.3,
                afterFinish: this.onEffectEnds
            });



            return;
        }


        this.currentEffect = new Effect.Move(this.summary);
    },

    effectEnds: function () {
        if (this.doNotCheck == true) {
            this.doNotCheck = false;
        }
    },

    checkOffset: function (offset) {
        if (this.doNotCheck && offset === null) {
            return null;
        }
        var dimensions = this.summary.getDimensions();
        var parentDimensions = this.summary.up().getDimensions();
        if ((offset !== null ? offset : this.summary.offsetTop) + dimensions.height >= parentDimensions.height) {
            offset = parentDimensions.height - dimensions.height;
        } else if (offset === null &&
            this.currentOffsetTop > (this.summaryContainer.viewportOffset().top) &&
            (this.currentOffsetTop - this.summaryContainer.viewportOffset().top) > this.summary.offsetTop) {
            offset = this.currentOffsetTop - this.summaryContainer.viewportOffset().top;
        }

        return offset;
    },

    exitSummary: function () {
        clearInterval(this.GetScroll);
    }
};

Enterprise.Tabs = Class.create();
Object.extend(Enterprise.Tabs.prototype, {
    initialize: function (container) {
        this.container = $(container);
        this.container.addClassName('tab-list');
        this.tabs = this.container.select('dt.tab');
        this.activeTab = this.tabs.first();
        this.tabs.first().addClassName('first');
        this.tabs.last().addClassName('last');
        this.onTabClick = this.handleTabClick.bindAsEventListener(this);
        for (var i = 0, l = this.tabs.length; i < l; i ++) {
            this.tabs[i].observe('click', this.onTabClick);
        }
        this.select();
    },
    handleTabClick: function (evt) {
        this.activeTab = Event.findElement(evt, 'dt');
        this.select();
    },
    select: function () {
        for (var i = 0, l = this.tabs.length; i < l; i ++) {
            if (this.tabs[i] == this.activeTab) {
                this.tabs[i].addClassName('active');
                this.tabs[i].style.zIndex = this.tabs.length + 2;
                /*this.tabs[i].next('dd').show();*/
                new Effect.Appear (this.tabs[i].next('dd'), { duration:0.5 });
                this.tabs[i].parentNode.style.height=this.tabs[i].next('dd').getHeight() + 15 + 'px';
            } else {
                this.tabs[i].removeClassName('active');
                this.tabs[i].style.zIndex = this.tabs.length + 1 - i;
                this.tabs[i].next('dd').hide();
            }
        }
    }
});

Enterprise.Slider = Class.create();

Object.extend(Enterprise.Slider.prototype, {
    initialize: function (container, config) {
        this.container = $(container);
        this.config = {
            panelCss: 'slider-panel',
            sliderCss: 'slider',
            itemCss: 'slider-item',
            slideButtonCss: 'slide-button',
            slideButtonInactiveCss: 'inactive',
            forwardButtonCss: 'forward',
            backwardButtonCss: 'backward',
            pageSize: 6,
            scrollSize: 2,
            slideDuration: 1.0,
            slideDirection: 'horizontal',
            fadeEffect: true
        };

        Object.extend(this.config, config || {});

        this.items = this.container.select('.' + this.config.itemCss);
        this.isPlaying = false;
        this.isAbsolutized = false;
        this.offset = 0;
        this.onClick = this.handleClick.bindAsEventListener(this);
        this.sliderPanel = this.container.down('.' + this.config.panelCss);
        this.slider =  this.sliderPanel.down('.' + this.config.sliderCss);
        this.container.select('.' + this.config.slideButtonCss).each(
            this.initializeHandlers.bind(this)
        );
        this.updateButtons();

        Event.observe(window, 'load', this.initializeDimensions.bind(this));
    },
    initializeHandlers: function (element) {
        if (element.hasClassName(this.config.forwardButtonCss) ||
            element.hasClassName(this.config.backwardButtonCss)) {
            element.observe('click', this.onClick);
        }
    },
    handleClick: function (evt) {
        var element = Event.element(evt);
        if (!element.hasClassName(this.config.slideButtonCss)) {
            element = element.up('.' + this.config.slideButtonCss);
        }

        if (!element.hasClassName(this.config.slideButtonInactiveCss)) {
           element.hasClassName(this.config.forwardButtonCss) || this.backward();
           element.hasClassName(this.config.backwardButtonCss) || this.forward();
        }
        Event.stop(evt);
    },
    updateButtons: function () {
        var buttons = this.container.select('.' + this.config.slideButtonCss);
        for (var i = 0, l = buttons.length; i < l; i++) {
            if (buttons[i].hasClassName(this.config.backwardButtonCss)) {
                if (this.offset <= 0) {
                    buttons[i].addClassName(this.config.slideButtonInactiveCss);
                }
                else {
                    buttons[i].removeClassName(this.config.slideButtonInactiveCss);
                }
            } else if (buttons[i].hasClassName(this.config.forwardButtonCss)) {
                if (this.offset >= this.items.length - this.config.pageSize) {
                    buttons[i].addClassName(this.config.slideButtonInactiveCss);
                }
                else {
                    buttons[i].removeClassName(this.config.slideButtonInactiveCss);
                }
            }
        }
    },
    initializeDimensions: function () {
        if ((this.config.slideDirection == 'horizontal' && this.sliderPanel.style.width) ||
            (this.config.slideDirection != 'horizontal' && this.sliderPanel.style.height)) {
            return this;
        }
        var firstItem = this.items.first();
        var offset = 0;
        if (this.config.slideDirection == 'horizontal') {
            offset = (parseInt(firstItem.getStyle('margin-left')) + parseInt(firstItem.getStyle('margin-right'))) * (this.config.pageSize - 1);
            this.sliderPanel.setStyle({width: (firstItem.getDimensions().width * this.config.pageSize + offset) + 'px'});
        } else {
            offset = (parseInt(firstItem.getStyle('margin-bottom')) + parseInt(firstItem.getStyle('margin-top'))) * (this.config.pageSize - 1);
            this.sliderPanel.setStyle({height: (firstItem.getDimensions().height * this.config.pageSize + offset) + 'px'});
        }

        var dimensions = this.sliderPanel.getDimensions();

        var sliderParent = this.sliderPanel.up();
        /*
        dimensions.height += parseInt(sliderParent.getStyle('padding-top'));
        dimensions.height += parseInt(sliderParent.getStyle('padding-bottom'));
        dimensions.width += parseInt(sliderParent.getStyle('padding-left'));
        dimensions.width += parseInt(sliderParent.getStyle('padding-right'));

        if (sliderParent.down('.slide-button')) {
            var buttonDimensions = sliderParent.down('.slide-button').getDimensions();
            if (this.config.slideDirection == 'horizontal') {
                dimensions.width += 2 * buttonDimensions.width;
            } else {
                dimensions.height += 2 * buttonDimensions.height;
            }
        }
        */
        sliderParent.setStyle({
            width: dimensions.width + 'px',
            height: dimensions.height + 'px'
        });
        return this;
    },
    absolutize: function () {
        if (!this.isAbsolutized) {
            this.isAbsolutized = true;
            var dimensions = this.sliderPanel.getDimensions();
            this.sliderPanel.setStyle({
                height: dimensions.height + 'px',
                width: dimensions.width + 'px'
            });

            this.slider.absolutize();
        }
    },

    forward: function () {
        if (this.offset + this.config.pageSize <= this.items.length - 1) {
            this.slide(true);
        }
    },
    backward: function () {
        if (this.offset > 0) {
            this.slide(false);
        }
    },
    slide: function (isForward) {

        if (this.isPlaying) {
            return;
        }
        this.absolutize();
        this.effectConfig = {
            duration: this.config.slideDuration
        };
        if (this.config.slideDirection == 'horizontal') {
            this.effectConfig.x = this.getSlidePosition(isForward).left;
        } else {
            this.effectConfig.y = this.getSlidePosition(isForward).top;
        }
        this.start();

    },
    start: function ()
    {
        if (this.config.fadeEffect) {
            this.fadeIn();
        } else {
            this.move();
        }
    },
    fadeIn: function ()
    {
        new Effect.Fade(this.slider.up('div.slider-panel'), {
            from: 1.0,
            to:0.5,
            afterFinish: this.move.bind(this),
            beforeStart: this.effectStarts.bind(this),
            duration: 0.3
        });
    },
    fadeOut: function ()
    {
        new Effect.Fade(this.slider.up('div.slider-panel'), {
                from: 0.5,
                to:1.0,
                afterFinish: this.effectEnds.bind(this),
                duration: 0.3
        });
    },
    move: function ()
    {
        if (this.config.fadeEffect) {
            this.effectConfig.afterFinish = this.fadeOut.bind(this);
        } else {
            this.effectConfig.afterFinish = this.effectEnds.bind(this);
            this.effectConfig.beforeStart = this.effectStarts.bind(this);
        }

        new Effect.Move(this.slider, this.effectConfig);
    },
    effectStarts: function () {
        this.isPlaying = true;
    },
    effectEnds: function () {
        this.isPlaying = false;
        this.updateButtons();
    },
    getSlidePosition: function (isForward) {
        var targetOffset;
        if (isForward) {
            targetOffset = Math.min(this.items.length - this.config.pageSize, this.offset + this.config.scrollSize)
        }
        else {
            targetOffset = Math.max(this.offset - this.config.scrollSize, 0);
        }
        this.offset = targetOffset;
        var item = this.items[targetOffset];
        var itemOffset = {left:0, top:0};

        itemOffset.left = -(item.cumulativeOffset().left
                       -  this.slider.cumulativeOffset().left + this.slider.offsetLeft);
        itemOffset.top = -(item.cumulativeOffset().top
                       -  this.slider.cumulativeOffset().top + this.slider.offsetTop);
        return itemOffset;
    }
});

Enterprise.PopUpMenu = {
    currentPopUp: null,
    documentHandlerInitialized: false,
    popUpZIndex: 994,
    hideDelay: 2000,
    hideOnClick: true,
    hideInterval: null,
    initializeDocumentHandler: function () {
        if (!this.documentHandlerInitialized) {
            this.documentHandlerInitialized = true;
            Event.observe(
                document.body,
                'click',
                this.handleDocumentClick.bindAsEventListener(this)
            );
        }
    },
    handleDocumentClick: function (evt) {
        if (this.currentPopUp !== null) {
            var element = Event.element(evt);
            if (!this.currentPopUp.onlyShowed && this.hideOnClick) {
                this.hide();
            } else {
                this.currentPopUp.onlyShowed = false;
            }
        }
    },
    handlePopUpOver: function (evt) {
        if (this.currentPopUp !== null) {
            this.currentPopUp.removeClassName('faded');
            this.resetTimeout(0);
        }
    },
    handlePopUpOut: function (evt) {
        if (this.currentPopUp !== null) {
            this.currentPopUp.addClassName('faded');
            this.resetTimeout(1);
        }
    },
    show: function (trigger) {
        this.initializeDocumentHandler();

        var container = $(trigger).up('.switch-wrapper');
        if (!$('popId-' + container.id)) {
            return;
        }

        if (this.currentPopUp !== null && $('popId-' + container.id) !== this.currentPopUp) {
            this.hide(true);
        } else if (this.currentPopUp !== null && this.currentPopUp === $('popId-' + container.id)) {
            this.hide();
            return;
        }

        this.currentPopUp = $('popId-' + container.id);
        this.currentPopUp.container = container;
        this.currentPopUp.container.oldZIndex = this.currentPopUp.container.style.zIndex;
        this.currentPopUp.container.style.zIndex = this.popUpZIndex;
        new Effect.Appear(this.currentPopUp, { duration:0.3 });


        if (!this.currentPopUp.isHandled) {
            this.currentPopUp.observe('mouseover', this.handlePopUpOver.bindAsEventListener(this));
            this.currentPopUp.observe('mouseout', this.handlePopUpOut.bindAsEventListener(this));
            this.currentPopUp.isHandled = true;
        }
        this.currentPopUp.onlyShowed = true;
        this.currentPopUp.container.down('.switcher').addClassName('list-opened');
        this.resetTimeout(2);
    },
    hide: function () {
        if (this.currentPopUp !== null) {
            if (arguments.length == 0) {
                new Effect.Fade(this.currentPopUp, {duration: 0.3});
            } else {
                this.currentPopUp.hide();
            }
            this.currentPopUp.container.style.zIndex = this.currentPopUp.container.oldZIndex;
            this.resetTimeout(0);
            this.currentPopUp.container.down('.switcher').removeClassName('list-opened');
            this.currentPopUp = null;
        }
    },
    resetTimeout: function (delay) {
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        if (delay) {
            this.hideTimeout = setTimeout(
                this.hide.bind(this),
                this.hideDelay * delay
            );
        }
    }
};


function popUpMenu(element) {
   Enterprise.PopUpMenu.show(element);
}
/*
function popUpMenu(element,trigger) {
        var iDelay = 2000;
        var new_popup = 0;
        var sTempId = 'popUped';
        if (document.getElementById(sTempId)) {
            var eTemp = document.getElementById(sTempId);
            $(sTempId).previous(0).down('.switcher').removeClassName('list-opened');
            new Effect.Fade (eTemp, { duration:0.3 });
            eTemp.id = sNativeId;
            clearTimeout(tId);
            document.onclick = null;
        }

        sNativeId = 'popId-'+$(element).up(1).id;
        var el = $(sNativeId);
        el.id = sTempId;

        if (eTemp && el == eTemp) {
            hideElement();
        } else {
            $(element).addClassName('list-opened');
            $(sTempId).getOffsetParent().style.zIndex = 994;
            new Effect.Appear (el, { duration:0.3 });
            tId=setTimeout("hideElement()",2*iDelay);
        }
        new_popup = 1;
        document.onclick = function() {
            if (!new_popup) {
                hideElement();
                document.onclick = null;
            }
            new_popup = 0;
        }

        el.onmouseout = function() {
            if ($(sTempId)) {
                $(sTempId).addClassName('faded');
                tId=setTimeout("hideElement()",iDelay);
            }
        }

        el.onmouseover = function() {
            if ($(sTempId)) {
                $(sTempId).removeClassName('faded');
                clearTimeout(tId);
            }
        }

        hideElement = function() {
            //el.hide();
            new Effect.Fade (el, { duration:0.3 });
            $(element).removeClassName('list-opened');
            el.getOffsetParent().style.zIndex = 1;
            el.id = sNativeId;
            if (tId) {clearTimeout(tId);}
        }
} */

Enterprise.Widget = Class.create({
    _node: null,
    _children: [],

    initialize: function (node) {
        this._node = node;
    },

    getNode: function() {
        return this._node;
    },

    /**
     * @param {Enterprise.Widget} widget
     */
    addChild: function(widget) {
        this._children.push(widget);
        var children = $(this._node).immediateDescendants(),
            exists = false;
        $(this._node).immediateDescendants().each(function(child) {
            if (child == widget.getNode()) {
                exists = true;
            }
        });
        if (!exists) {
            widget.placeAt(this._node);
        }
    },

    placeAt: function(node) {
        $(node).insert(this._node);
    }
});

Enterprise.Widget.Dialog = Class.create(Enterprise.Widget, {

    _title: '',

    _titleNode: {},

    _contentNode: {},

    _backNode: {},

    _isPlaced: false,

    initialize: function ($super, title, content, additionalClass) {
        this._title = title;
        //this._node = new Element('div', {'class': 'popup-block block', 'style': {'display': 'none'}});
        this._node = new Element('div', {'class': 'popup-block block'});
        this._node.addClassName(additionalClass);
        //this._windowOverlay = new Element('div', {'class': 'window-overlay', 'style': {'display': 'none'}});
        this._windowOverlay = new Element('div', {'class': 'window-overlay'});
        var headerNode = new Element('div', {'class': 'block-title'});
        this._titleNode = new Element('strong').update(title);
        this._closeButton = new Element('div', {'class': 'btn-close'}).update('Close');
        $(this._closeButton).onclick = (function() {
            this.hide();
        }).bind(this);
        headerNode.insert(this._titleNode);
        headerNode.insert(this._closeButton);
        this._node.insert(headerNode);

        this._contentNode = new Element('div', {'class': 'block-content'});
        this._contentNode.insert(content);

        this._node.insert(this._contentNode);
    },

    place: function() {
        $(document.body).insert(this._windowOverlay);
        $(document.body).insert(this._node);
        this._isPlaced = true;
    },

    setTitle: function(title) {
        $(this._titleNode).update(title);
    },

    setContent: function(content) {
        $(this._contentNode).update(content);
    },

    getContent: function() {
        return this._contentNode;
    },

    show: function() {
        if (!this._isPlaced) {
            this.place();
        }
        //$(this._windowOverlay).setStyle({'display':'block'});
        $(this._windowOverlay).addClassName('active');
        this._windowOverlay.style.height=$$('body')[0].getHeight()+'px';
        //$(this._node).setStyle({'display': 'block'});
        $(this._node).addClassName('active');
    },

    hide: function() {
        //$(this._windowOverlay).setStyle({'display':'none'});
        $(this._windowOverlay).removeClassName('active');
        //$(this._node).setStyle({'display':'none'});
        $(this._node).removeClassName('active');
    },

    setBusy: function(state) {
        if (state) {
            $(this._node).addClassName('loading');
        } else {
            $(this._node).removeClassName('loading');
        }
    },

    destroy: function() {
        $(this._node).remove();
    }
});

Enterprise.Widget.SplitButton = Class.create(Enterprise.Widget, {
    _list: null,
    _templateString: '<strong><span></span></strong>' +
        '<a href="#" class="change"></a>' +
        '<div class="list-container">' +
            '<ul>' +
            '</ul>' +
        '</div>',

    initialize: function($super, title, alt, type) {
        if (typeof title != 'string') {
            $super(title);
        } else {
            $super(new Element('div', {'class': 'split-button split-button-created' + ((type)? ' ' + type: '')}));
            this._node.update(this._templateString);
            this._node.down('strong span').update(title);
            this._node.down('.change').update(alt);
        }
        Event.observe($(this._node).down('strong'), 'click', (function(event){this.onClick(event);}).bind(this));

        this._node.down('.change').setAttribute('tabindex', 20);
        this._list = $(this._node).down('ul');
        Event.observe($(this._node).down('.change'), 'click', this.onToggle.bind(this));
        Event.observe($(this._node).down('.change'), 'blur', this.close.bind(this));
    },

    onClick: function(event) {
    },

    onToggle: function(event) {
        Event.stop(event);
        if (this.isOpened()) {
            this.close();
        } else {
            this.open();
        }
    },

    isOpened: function() {
        return $(this._node).hasClassName('active');
    },

    open: function() {
        $(this._node).addClassName('active');
        this.onOpen();
    },

    onOpen: function() {
    },

    close: function() {
        $(this._node).removeClassName.bind($(this._node), 'active').delay(0.2);
        this.onClose();
    },

    onClose: function() {
    },

    /**
     * @param {Enterprise.Widget.SplitButton.Option} option
     */
    addOption: function(option) {
        option.placeAt(this._list);
        option.onClick = option.onClick.wrap((function(proceed) {
            proceed();
            this.close();
        }).bind(this));
    }
});

Enterprise.Widget.SplitButton.Option = Class.create(Enterprise.Widget, {

    initialize: function($super, title, type) {
        $super(new Element('li', {'class' : type ? type : null}));
        this._node.update('<span title="' + title + '">' + title + '</span>');
        Event.observe(this._node, 'click', (function(){this.onClick()}).bind(this));
    },

    getNode: function() {
        return this._node;
    },

    onClick: function() {

    }
})

Enterprise.loadSplitButtons = function() {
    if (typeof Enterprise.splitButtonsLoaded == 'undefined') {
        Enterprise.splitButtonsLoaded = true;
        $$('.split-button').each(function(node) {
            if (!$(node).hasClassName('split-button-created')) {
                new Enterprise.Widget.SplitButton(node);
            }
        });
    }
};

Enterprise.textOverflow = function(elem) {
    var container = $(elem);
    if (container.getStyle('overflow') == 'hidden') {
        var inner = container.down(0);
        var initialHeight = container.getHeight();
        if (inner.getHeight() > initialHeight) {
            var words = inner.innerHTML.split(' ');
            var test = new Element('span', {'style': 'visibility:hidden;'});
            test.style.width = container.getWidth();
            container.insert(test);
            var tempString = '';
            for (var i = 0; $(test).getHeight() <= initialHeight || i < words.legth; i++) {
                tempString = tempString + words[i] + ' ';
                test.update(tempString)
            };
            var finalstring = (words.slice(-words.length, i - 2)).join(' ');
            test.remove();
            inner.update(finalstring + '&hellip;');
        }
    }
};
Event.observe(document, 'dom:loaded', Enterprise.loadSplitButtons);
