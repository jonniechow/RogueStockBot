var RogueCache = Class.create({
    observers: [],

    initialize: function () {
        this.l = null;
    },

    addObserver: function (f) {
        this.observers.push(f);
    },

    callObservers: function () {
        this.observers.each(function (f) {
            if (typeof f == 'function') {
                f();
            }
        })
    }
});

window.rogueCache = new RogueCache();

function checkIfCustomerHasNewSideCart() {
    var element = document.getElementById('offCanvasCartUpdate');
    if (element && (localStorage.getItem('studyjs-ab-tests') || '').indexOf('sideCart') > -1) {
        element.removeAttribute('data-cache');
        element.classList.remove('rogue-cache');
    }
}

var rogueCacheId = null;
window.initRogueCache = function(url, ref, product_id, _blocks) {
    checkIfCustomerHasNewSideCart();
    var blocks = [];
    if (_blocks) {
        if (Array.isArray(_blocks)) {
            blocks = _blocks
        } else {
            blocks.push(_blocks)
        }
    } else {
        $$('.rogue-cache').each(function (e) {
            var value = e.getAttribute('data-cache') || e.id;
            if (blocks.indexOf(value) == -1) {
                blocks.push(value);
            }
        });
    }

    if (window.globalStore &&
        window.globalStore.fpc &&
        window.globalStore.fpc.roguecache_enabled &&
        window.globalStore.fpc.cacheId &&
        blocks.indexOf(window.globalStore.fpc.cacheId) === -1
    ) {
        blocks.push(window.globalStore.fpc.cacheId);
    }

    if (!blocks.length) {
        return;
    }

    new Ajax.Request(url, {
        parameters: {
            'blocks[]' : blocks,
            id         : rogueCacheId,
            'referer'  : ref,
            'r'        : getRandom(),
            product_id : product_id
        },
        onSuccess: function (response) {
            if (200 == response.status) {
                var result = response.responseText.evalJSON();
                if (result.blocks != undefined) {
                    blocks.each(function (key) {
                        if (result.blocks.hasOwnProperty(key)) {
                            var elements = [$(key)].concat($$('.rogue-cache[data-cache="' + key + '"]'));
                            elements.each(function (el) {
                                if (el) {
                                    el.replace(result.blocks[key]);
                                }
                            });

                            if (key == 'cache-cart') {
                                if (typeof truncateOptions == 'function') {
                                    truncateOptions();
                                }
                            }
                        }
                    });

                    document.fire('fpc:response', result.blocks);
                    if (result.blocks.hasOwnProperty('debug')) {
                        domAfterLoadCallback(function () {
                            if ($('rogue-cache-debug')) {
                                $('rogue-cache-debug').innerHTML += '<br />' + result.blocks.debug;
                            }
                        }, true);
                    }
                }

                if (result.l !== undefined) {
                    rogueCache.l = result.l;
                }

                if (result.report) {
                    reporting.reportUser(result.report);
                }

                rogueCache.callObservers();
            }
        }
    });
};

function getRandom() {
    return Math.random();
}
