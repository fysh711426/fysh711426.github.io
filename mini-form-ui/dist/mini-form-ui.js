var onThemeChange = null;
function checkTheme() {
    var prev = null;
    function setTheme(theme) {
        if (prev) {
            document.body.classList.remove(prev);
        }
        document.body.setAttribute('theme', theme);
        document.body.classList.add(theme);
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
            document.body.classList.remove(prev);
        }
        document.body.setAttribute('text-theme', theme);
        document.body.classList.add(theme);
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
        return Math.max(window.scrollY || 0,
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
    return function(callback, distance, delay) {
        distance = distance ?? 0;
        onScroll(function () {
            if (getScrollTop() + getClientHeight() + distance >= getScrollHeight()) {
                callback.call(this);
            }
        }, delay);
    }
})();

var onScroll = function (callback, delay) {
    var scheduled = false;
    delay = delay ?? 100;
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
        _settings = _settings ?? {};
        setting.template = _settings.template ?? '.tooltip-template';
        setting.placement = _settings.placement ?? 'bottom';
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
                        var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                        var scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
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
        _settings =  _settings ?? {};
        settings.minimum = _settings.minimum ?? 0.08;
        settings.speed = _settings.speed ?? 200;
        settings.easing = _settings.easing ?? 'linear';
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
        for (var item of items) {
            item.innerHTML = innerHTML;
            item.classList.add('spinner');
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
        show: function(text, _settings) {
            var setting = {};
            _settings = _settings ?? {};
            setting.template = _settings.template ?? '.toast-template';
            setting.delay = _settings.delay ?? 3000;
            
            text = text ?? '';
            var templateHTML = document.querySelector(setting.template).innerHTML;
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
                    element.classList.add('show');
                    setTimeout(function() {
                        if (element === global) {
                            remove(global);
                            element = null;
                        }
                    }, setting.delay);
                }, 1);
            })(element);
        }
    };
})();
var popover = (function () {
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
        var spacing = 5;
        var rect = item.getBoundingClientRect();
        if (placement === 'top') {
            var top = rect.top - element.offsetHeight - spacing;
            var left = rect.left + rect.width / 2 - element.offsetWidth / 2 - 1;
            return [left, top];
        }
        if (placement === 'bottom') {
            var top = rect.bottom + spacing;
            var left = rect.left + rect.width / 2 - element.offsetWidth / 2 - 1;
            return [left, top];
        }
        if (placement === 'left') {
            var top = rect.top - (element.offsetHeight - rect.height) / 2 - 1;
            var left = rect.left - element.offsetWidth - spacing;
            return [left, top];
        }
        if (placement === 'right') {
            var top = rect.top - (element.offsetHeight - rect.height) / 2 - 1;
            var left = rect.right + spacing;
            return [left, top];
        }
        if (placement === 'topLeft') {
            var top = rect.top - element.offsetHeight - spacing;
            var left = rect.left;
            return [left, top];
        }
        if (placement === 'topRight') {
            var top = rect.top - element.offsetHeight - spacing;
            var left = rect.right - element.offsetWidth;
            return [left, top];
        }
        if (placement === 'bottomLeft') {
            var top = rect.bottom + spacing;
            var left = rect.left;
            return [left, top];
        }
        if (placement === 'bottomRight') {
            var top = rect.bottom + spacing;
            var left = rect.right - element.offsetWidth;
            return [left, top];
        }
        if (placement === 'leftTop') {
            var top = rect.top;
            var left = rect.left - element.offsetWidth - spacing;
            return [left, top];
        }
        if (placement === 'leftBottom') {
            var top = rect.bottom - element.offsetHeight;
            var left = rect.left - element.offsetWidth - spacing;
            return [left, top];
        }
        if (placement === 'rightTop') {
            var top = rect.top;
            var left = rect.right + spacing;
            return [left, top];
        }
        if (placement === 'rightBottom') {
            var top = rect.bottom - element.offsetHeight;
            var left = rect.right + spacing;
            return [left, top];
        }
    }
    var global = null;
    document.addEventListener('click', function(e) {
        if (!global) 
            return;
        if (global.button.contains(e.target)) 
            return;
        if (global.element.contains(e.target)) 
            return;
        // if (document.body.style.position === 'fixed')
        //     return;
        global.close();
    }, true);
    return function(button, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.template = _settings.template ?? '.popover-template';
        setting.placement = _settings.placement ?? 'bottom';
        setting.preventDefault = _settings.preventDefault ?? false;
        setting.stopPropagation = _settings.stopPropagation ?? false;
        var templateHTML = document.querySelector(setting.template).innerHTML;

        var element = null;
        function open() {
            if (!element) {
                var html = templateHTML;
                var attrs = button.attributes;
                for (var i = 0; i < attrs.length; i++) {
                    var attr = attrs[i];
                    if (attr.name.startsWith('data-')) {
                        html = html.replace('__' + attr.name + '__', attr.value);
                    }
                }
                element = createElement(html);
                global = {
                    button: button,
                    element: element,
                    close: close
                };
                document.body.appendChild(element);
                var position = getPosition(setting.placement, button, element);
                
                var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                var scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
                element.style.transform = 'translate3d(' + (position[0] + scrollLeft) + 'px, ' + (position[1] + scrollTop) + 'px, 0px)';
            }
        }
        function close() {
            if (element) {
                remove(element);
                element = null;
                global = null;
            }
        }
        button.addEventListener('click', function (e) {
            if (setting.preventDefault)
                e.preventDefault();
            if (setting.stopPropagation)
                e.stopPropagation();
            if (!element) {
                open();
                return;
            }
            close();
        });
        return {
            close: close
        };
    }
})();
var modal = (function () {
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
    var scrollY = 0;
    function lock() {
        scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.minWidth  = `calc(100% - ${scrollbarWidth}px)`;
    }
    function unlock() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.minWidth = '';
        document.body.style.paddingRight = '';
        window.scrollTo({ top: scrollY });
    }
    return function(template, _settings) {
        var setting = {};
        _settings = _settings ?? {};

        var ref = {
            open: open,
            close: close,
            onOpened: null,
            onClosed: null
        };

        var element = null;
        function open() {
            if (!element) {
                var html = template.innerHTML;
                element = createElement(html);
                document.body.appendChild(element);
                template.innerHTML = '';
                lock();
                bindDismiss();
                if (ref.onOpened) {
                    ref.onOpened(element);
                }
            }
        }
        function close() {
            if (element) {
                var html = element.outerHTML;
                remove(element);
                element = null;
                template.innerHTML = html;
                unlock();
                if (ref.onClosed) {
                    ref.onClosed(element);
                }
            }
        }
        function bindDismiss() {
            var dismiss = element.querySelectorAll('[data-dismiss]');
            for(var item of dismiss) {
                item.addEventListener('click', function (e) {
                    close();
                });
            }
        }
        return ref;
    }
})();
var gotop = (function () {
    function getScrollTop() {
        return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    }
    return function (selector, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.scrollTop = _settings.scrollTop ?? 75;
        setting.delay = _settings.delay;

        var gotop = document.querySelector(selector);
        gotop.addEventListener("click", function (e) {
            e.preventDefault();
            // var scrollY = getScrollTop();
            // // var speed = getClientWidth() >= 1025 ? 0.85 : 0.65;
            // // var delay = getClientWidth() >= 1025 ? 25 : 100;
            // var speed = 0.85;
            // var delay = 25;
            // setTimeout(function () {
            //     scroll = Math.floor(scroll * speed);
            //     document.documentElement.scrollTop = document.body.scrollTop = scroll;
            //     if (scroll > 0) {
            //         setTimeout(arguments.callee, delay);
            //     }
            // }, delay);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        onScroll(function () {
            if (getScrollTop() > setting.scrollTop) {
                gotop.classList.add('show');
            } else {
                gotop.classList.remove('show');
            }
        }, setting.delay);
    }
})();
var onNav = (function() {
    return function() {
        var leftMenu = document.querySelector('.left-menu');
        var main = document.querySelector('.main');
        if (leftMenu.classList.contains('active')) {
            leftMenu.classList.remove('active');
            main.classList.remove('active');
        } else {
            leftMenu.classList.add('active');
            main.classList.add('active');
        }
    };
})();

var onNavOpen = (function() {
    return function() {
        var leftMenu = document.querySelector('.left-menu');
        var leftMenuMask = document.querySelector('.left-menu-mask');
        if (leftMenu.classList.contains('open')) {
            leftMenu.classList.remove('open');
            leftMenuMask.classList.remove('open');
        } else {
            leftMenu.classList.add('open');
            leftMenuMask.classList.add('open');
        }
    };
})();

var onNavClose = (function() {
    return function() {
        onNavOpen();
    };
})();

var selectMenu = (function() {
    return function(val, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.openGroup = _settings.openGroup ?? true;

        var items = document.querySelectorAll('.left-menu-item');
        for (var item of items) {
            if (item.getAttribute('select-val') === val) {
                if (!item.classList.contains('active')) {
                    item.classList.add('active');
                    if (setting.openGroup) {
                        var group = item.closest('.left-menu-group');
                        if (group) {
                            group.classList.add('open');
                        }
                    }
                }
            } else {
                item.classList.remove('active');
            }
        }
    };
})();

var selectSubMenu = (function() {
    return function(val) {
        var items = document.querySelectorAll('.sub-menu-item');
        for (var item of items) {
            if (item.getAttribute('select-val') === val) {
                if (!item.classList.contains('active')) {
                    item.classList.add('active');
                }
            } else {
                item.classList.remove('active');
            }
        }
    };
})();

var enableMenuGroup = (function() {
    return function() {
        var groups = document.querySelectorAll('.left-menu-group');
        for (let item of groups) {
            var title = item.querySelector('.left-menu-group-title');
            title.addEventListener('click', function() {
                item.classList.toggle('open');
            });
        }
    };
})();

var onThemeButtonChange = (function() {
    return function(newTheme) {
        var dark = document.querySelector('.theme-button-dark');
        var light = document.querySelector('.theme-button-light');
        if (newTheme === 'dark') {
            light.classList.remove('show');
            dark.classList.add('show');
        }
        else {
            light.classList.add('show');
            dark.classList.remove('show');
        }
    };
})();