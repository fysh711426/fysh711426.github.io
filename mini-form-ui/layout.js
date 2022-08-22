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

var changeTheme = null;
function checkTheme() {
    function setTheme(theme) {
        document.body.className = document.body.className
            .replace(' light', '').replace(' dark', '');
        document.body.className = document.body.className + ' ' + theme;
    }
    var theme = localStorage.getItem('THEME');
    if (!theme) {
        var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        theme = darkQuery.matches ? "dark" : "light";
    }
    setTheme(theme);
    changeTheme = function(newTheme) {
        var theme = localStorage.getItem('THEME');
        if (newTheme !== theme) {
            localStorage.setItem('THEME', newTheme);
        }
        setTheme(newTheme);
    };
}

function changeThemeButton(newTheme) {
    var light = document.querySelector('.theme-button-light');
    var dark = document.querySelector('.theme-button-dark');
    if (newTheme === 'light') {
        light.style.display = 'flex';
        dark.style.display = 'none';
    }
    else {
        light.style.display = 'none';
        dark.style.display = 'flex';
    }
}

var gotop = (function () {
    function getScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    }
    function getClientWidth() {
        return document.documentElement.clientWidth;
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
            // var speed = getClientWidth() >= 1025 ? 0.85 : 0.65;
            // var delay = getClientWidth() >= 1025 ? 25 : 100;
            var speed = 0.85;
            var delay = 25;
            setTimeout(function () {
                scroll = Math.floor(scroll * speed);
                document.documentElement.scrollTop = document.body.scrollTop = scroll;
                if (scroll > 0) {
                    setTimeout(arguments.callee, delay);
                }
            }, delay);
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