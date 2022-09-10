var onThemeChange = null;
function checkTheme() {
    var prev = null;
    function setTheme(theme) {
        if (prev) {
            document.body.className = document.body.className.replace(' ' + prev, '');
        }
        document.body.setAttribute('theme', theme);
        document.body.className = document.body.className + ' ' + theme;
        prev = theme;
    }
    var theme = localStorage.getItem('THEME');
    if (!theme) {
        var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        theme = darkQuery.matches ? "dark" : "light";
    }
    setTheme(theme);
    onThemeChange = function(newTheme) {
        var theme = localStorage.getItem('THEME');
        if (newTheme !== theme) {
            localStorage.setItem('THEME', newTheme);
        }
        setTheme(newTheme);
    };
}

var onTextThemeChange = null;
function checkTextTheme() {
    var prev = null;
    function setTheme(theme) {
        if (prev) {
            document.body.className = document.body.className.replace(' ' + prev, '');
        }
        document.body.setAttribute('text-theme', theme);
        document.body.className = document.body.className + ' ' + theme;
        prev = theme;
    }
    var theme = localStorage.getItem('TEXT_THEME');
    if (!theme) {
        theme = localStorage.getItem('THEME');
        if (!theme) {
            var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
            theme = darkQuery.matches ? "dark" : "light";
        }
        theme = 'text-' + theme;
    }
    setTheme(theme);
    onTextThemeChange = function(newTheme) {
        var theme = localStorage.getItem('TEXT_THEME');
        if (newTheme !== theme) {
            localStorage.setItem('TEXT_THEME', newTheme);
        }
        setTheme(newTheme);
    };
}
// check-if-a-user-has-scrolled-to-the-bottom-not-just-the-window-but-any-element
// https://stackoverflow.com/questions/3898130

var onScrollEnd = (function () {
    function getScrollTop() {
        return Math.max(window.pageYOffset || 0,
            document.documentElement.scrollTop || document.body.scrollTop);
    }
    function getScrollHeight() {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    }
    function getClientHeight() {
        return Math.max(window.innerHeight || 0,
            document.documentElement.clientHeight || document.body.clientHeight);
    }
    return function (callback, distance, delay) {
        distance = distance || 0;
        onScroll(function () {
            if (getScrollTop() + getClientHeight() + distance >= getScrollHeight()) {
                callback.call(this);
            }
        }, delay);
    }
})();

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
var tooltip = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    function remove(element) {
        try {
            document.body.removeChild(element);
        } catch { }
    }
    function getPosition(placement, item, element) {
        var rect = item.getBoundingClientRect();
        if (placement === 'top') {
            var top = rect.top - element.offsetHeight - 5;
            var left = rect.left + rect.width / 2 - element.offsetWidth / 2 - 1;
            return [left, top];
        }
        if (placement === 'bottom') {
            var top = rect.top + rect.height + 5;
            var left = rect.left + rect.width / 2 - element.offsetWidth / 2 - 1;
            return [left, top];
        }
        if (placement === 'left') {
            var top = rect.top - (element.offsetHeight - rect.height) / 2 - 1;
            var left = rect.left - element.offsetWidth - 5;
            return [left, top];
        }
        if (placement === 'right') {
            var top = rect.top - (element.offsetHeight - rect.height) / 2 - 1;
            var left = rect.right + 5;
            return [left, top];
        }
    }
    var global = null;
    return function (selector, _settings) {
        var setting = {};
        _settings = _settings || {};
        setting.template = _settings.template || '.tooltip-template';
        setting.placement = _settings.placement || 'bottom';
        var templateHTML = document.querySelector(setting.template).innerHTML;
        var items = document.querySelectorAll(selector);
        for (var i = 0; i < items.length; i++) {
            (function () {
                var item = items[i];
                var element = null;
                var itemHover = false;
                var elementHover = false;
                function mouseenter() {
                    if (!element) {
                        var html = templateHTML;
                        var attrs = item.attributes;
                        for (var i = 0; i < attrs.length; i++) {
                            var attr = attrs[i];
                            if (attr.name.startsWith('data-')) {
                                html = html.replace('__' + attr.name + '__', attr.value);
                            }
                        }
                        element = createElement(html);
                        document.body.appendChild(element);
                        element.addEventListener('mouseenter', function () {
                            elementHover = true;
                        });
                        element.addEventListener('mouseleave', function () {
                            elementHover = false;
                            mouseleave();
                        });
                        var position = getPosition(setting.placement, item, element);
                        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                        element.style.transform = 'translate3d(' + (position[0] + scrollLeft) + 'px, ' + (position[1] + scrollTop) + 'px, 0px)';
                    }
                    if (global != null && global != element)
                        remove(global);
                    global = element;
                }
                function mouseleave() {
                    if (element) {
                        setTimeout(function () {
                            if (element) {
                                if (!itemHover && !elementHover) {
                                    remove(element);
                                    element = null;
                                }
                            }
                        }, 80);
                    }
                }
                
                item.addEventListener('mouseenter', function () {
                    itemHover = true;
                    mouseenter();
                });
                item.addEventListener('mouseleave', function () {
                    itemHover = false;
                    mouseleave();
                });
            })();
        }
    }
})();
var progress = (function () {
    var settings = {};
    function config(_settings) {
        _settings =  _settings || {};
        settings.minimum = _settings.minimum || 0.08;
        settings.speed = _settings.speed || 200;
        settings.easing = _settings.easing || 'linear';
    }
    config();
    var ele = null;
    function init() {
        if (!ele) {
            ele = document.createElement('div');
            ele.className = 'progress';
            ele.style.transition = 'all ' + settings.speed + 'ms ' + settings.easing;
            ele.style.opacity = 1;
            ele.style.width = '0px';
            document.body.appendChild(ele);
        }
    }
    var percent = 0;
    var started = false;
    function start() {
        if (!started) {
            started = true;
            inc();
            setTimeout(function () {
                if (started) {
                    inc();
                    setTimeout(arguments.callee, settings.speed);
                }
            }, settings.speed);
        }
    }
    function done() {
        inc(0.3 + 0.5 * Math.random());
        set(1);
    }
    function inc(num) {
        if (percent >= 1) {
            return;
        }
        if (typeof num !== 'number') {
            if (percent >= 0 && percent < 0.2)
                num = 0.1;
            else if (percent >= 0.2 && percent < 0.5)
                num = 0.04;
            else if (percent >= 0.5 && percent < 0.8)
                num = 0.02;
            else if (percent >= 0.8 && percent < 0.99)
                num = 0.005;
        }
        return set(minmax(percent + num, 0, 0.994));
    }
    function set(num) {
        init();
        if (num === 1) {
            started = false;
        }
        queue.push(function(next) {
            setTimeout(function() {
                num = minmax(num, settings.minimum, 1);
                ele.style.opacity = 1;
                ele.style.width = num * 100 + '%';
                percent = num;
                if (num === 1) {
                    setTimeout(function() {
                        ele.style.opacity = 0;
                        setTimeout(function() {
                            ele.style.width = '0px';
                            percent = 0;
                            next();
                        }, settings.speed);
                    }, settings.speed);
                    return;
                }
                next();
            }, 1);
        });
    }
    var queue = (function() {
        var tasks = [];
        var working = false;
        function next() {
            var task = tasks.shift();
            if (!task) {
                working = false;
                return;
            }
            task(next);
        }
        function push(func) {
            tasks.push(func);
            if (!working) {
                working = true;
                next();
            }
        }
        return {
            push: push
        }
    })();
    function minmax(n, min, max) {
        if (n < min) return min;
        if (n > max) return max;
        return n;
    }
    return {
        start: start,
        inc: inc,
        set: set,
        done: done,
        config: config
    }
})();
var spinner = (function() {
    var innerHTML = `
        <div class="spinner-inner">
            <div class="spinner-layer layer-1">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
            <div class="spinner-layer layer-2">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
            <div class="spinner-layer layer-3">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
            <div class="spinner-layer layer-4">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
        </div>
    `;

    return function(selector) {
        var items = document.querySelectorAll(selector);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.innerHTML = innerHTML;
            if (item.className.indexOf('spinner') === -1) {
                item.className = item.className + ' spinner';
            }
        }
    }
})();
var toast = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    function remove(element) {
        try {
            document.body.removeChild(element);
        } catch { }
    }
    var global = null;
    return {
        show: function(text) {
            text = text || '';
            var templateHTML = `
                <div class="toast-block">
                    <div class="toast-inner">__data-content__</div>
                </div>
            `;
            var html = templateHTML;
            html = html.replace('__data-content__', text);
            if (global) {
                remove(global);
            }
            var element = createElement(html);
            document.body.appendChild(element);
            global = element;
            (function(element) {
                setTimeout(function() {
                    element.className = element.className + ' show';
                    setTimeout(function() {
                        if (element === global) {
                            remove(global);
                            element = null;
                        }
                    }, 3000);
                }, 1);
            })(element);
        }
    };
})();
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

function onThemeButtonChange(newTheme) {
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