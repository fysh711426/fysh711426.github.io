function onNav() {
    var leftMenu = document.querySelector('.left-menu');
    var main = document.querySelector('.main');
    if (leftMenu.className.indexOf('active') > -1) {
        leftMenu.className = leftMenu.className.replace(' active', '');
        main.className = main.className.replace(' active', '');
    } else {
        leftMenu.className = leftMenu.className + ' active';
        main.className = main.className + ' active';
    }
}

function onNavOpen() {
    var leftMenu = document.querySelector('.left-menu');
    var leftMenuMask = document.querySelector('.left-menu-mask');
    if (leftMenu.className.indexOf('open') > -1) {
        leftMenu.className = leftMenu.className.replace(' open', '');
        leftMenuMask.className = leftMenuMask.className.replace(' open', '');
    } else {
        leftMenu.className = leftMenu.className + ' open';
        leftMenuMask.className = leftMenuMask.className + ' open';
    }
}

function onNavClose() {
    onNavOpen();
}

function selectMenu(val) {
    var items = document.querySelectorAll('.left-menu-item');
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.getAttribute('select-val') === val) {
            if (item.className.indexOf('active') === -1) {
                item.className = item.className + ' active';
            }
        } else {
            item.className = item.className.replace(' active', '');
        }
    }
}

function selectSubMenu(val) {
    var items = document.querySelectorAll('.sub-menu-item');
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.getAttribute('select-val') === val) {
            if (item.className.indexOf('active') === -1) {
                item.className = item.className + ' active';
            }
        } else {
            item.className = item.className.replace(' active', '');
        }
    }
}

var gotop = (function () {
    function getScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    }
    var onScroll = function (callback, delay) {
        var scheduled = false;
        delay = delay || 100;
        document.addEventListener('scroll', function () {
            if (!scheduled) {
                scheduled = true;
                setTimeout(function () {
                    callback.call(this);
                    scheduled = false;
                }, delay);
            }
        });
    }
    return function (selector) {
        var gotop = document.querySelector(selector);
        gotop.addEventListener("click", function (e) {
            e.preventDefault();
            var scroll = getScrollTop();
            setTimeout(function () {
                scroll = Math.floor(scroll * 0.85);
                document.documentElement.scrollTop = document.body.scrollTop = scroll;
                if (scroll > 0) {
                    setTimeout(arguments.callee, 25);
                }
            }, 25);
        });
        onScroll(function () {
            var scroll = getScrollTop();
            if (scroll < 200) {
                gotop.className = gotop.className.replace(' show', '');
            } else {
                if (gotop.className.indexOf('show') === -1) {
                    gotop.className = gotop.className + ' show';
                }
            }
        });
    }
})();