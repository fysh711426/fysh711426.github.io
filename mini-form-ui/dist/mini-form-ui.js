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
    };
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

var bodyScroll = (function () {
    var scrollY = 0;
    var isLocked = false;
    function lock() {
        if (!isLocked) {
            scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
            var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.minWidth  = `calc(100% - ${scrollbarWidth}px)`;
        }
        isLocked = true;
    }
    function unlock() {
        if (isLocked) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.minWidth = '';
            document.body.style.paddingRight = '';
            window.scrollTo({ top: scrollY });
        }
        isLocked = false;
    }
    return {
        lock: lock,
        unlock: unlock
    };
})();
var onResize = function (callback, delay = 200) {
    var timer = null;
    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.call(this);
        }, delay);
    });
}
var scrollbar = (function () {
    return function(scrollable) {
        scrollable.classList.add('scrollbar');
        var isAnimating = false;
        var targetScrollLeft = 0;
        var prev = 0;
        function smoothScroll() {
            isAnimating = true;
            var current = scrollable.scrollLeft;
            var diff = targetScrollLeft - current;
            // 差距夠小就停止
            if (Math.abs(diff) <= 1 || current === prev) {
                scrollable.scrollLeft = targetScrollLeft;
                isAnimating = false;
                return;
            }
            // easing 數值越小越滑
            prev = current;
            scrollable.scrollLeft = current + diff * 0.15;
            requestAnimationFrame(smoothScroll);
        }
        scrollable.addEventListener('wheel', function (e) {
            e.preventDefault();
            // scrollable.scrollLeft += e.deltaY;
            // var maxDelta = 80;
            // var delta = Math.max(-maxDelta, Math.min(maxDelta, e.deltaY));
            // targetScrollLeft += delta * 0.9;
            targetScrollLeft += e.deltaY;
            targetScrollLeft = Math.max(0, Math.min(targetScrollLeft,
                scrollable.scrollWidth - scrollable.clientWidth));
            if (!isAnimating) {
                smoothScroll();
            }
        }, { passive: false });
    };
})();
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
                        element.style.transform = 'translate(' + (position[0] + scrollLeft) + 'px, ' + (position[1] + scrollTop) + 'px)';
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
    };
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
            function loop() {
                if (started) {
                    inc();
                    setTimeout(loop, settings.speed);
                }
            }
            inc();
            setTimeout(loop, settings.speed);
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
            requestAnimationFrame(function() {
            // setTimeout(function() {
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
            // }, 1);
            });
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
    };
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
    };
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
    var _ = null;
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

            // 觸發瀏覽器重繪
            _ = element.offsetHeight;
            element.classList.add('show');
            setTimeout(function() {
                if (element === global) {
                    remove(global);
                    global = null;
                }
            }, setting.delay);
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

        var ref = {
            close,
            onOpen: null
        };

        var element = null;
        function open() {
            if (!element) {
                var html = templateHTML;
                var attrs = button.attributes;
                for(var attr of attrs) {
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
                if (ref.onOpen) {
                    ref.onOpen(element);
                }
                document.body.appendChild(element);
                var position = getPosition(setting.placement, button, element);
                
                var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                var scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
                element.style.transform = 'translate(' + (position[0] + scrollLeft) + 'px, ' + (position[1] + scrollTop) + 'px)';
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
        return ref;
    };
})();
var dropdownMenu = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(button, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.template = _settings.template ?? '.dropdown-menu-template';
        setting.placement = _settings.placement;
        setting.preventDefault = _settings.preventDefault;
        setting.stopPropagation = _settings.stopPropagation;
        setting.enableSelect = _settings.enableSelect ?? true;
        var options = _settings.options ?? [];

        var ref = {
            getValue,
            setValue,
            onChange: null
        };

        var selected = null;
        function getValue() {
            if (!selected)
                return null;
            return selected.value;
        }
        function setValue(val) {
            selected = null;
            if (setting.enableSelect) {
                for(var item of options) {
                    if (item.value === val) {
                        selected = item;
                        return;
                    }
                }
            }
        }
        var _popover = popover(button, setting);
        _popover.onOpen = function(ele) {
            var menu = ele.querySelector('.dropdown-menu');
            for (var item of options) {
                var text = item.text ?? '';
                var icon = item.icon ?? '';
                var className = item.className ?? '';
                var separator = item.separator ?? false;
                let value = item.value;
                
                var innerHtml = '';
                if (icon) {
                    innerHtml += `
                    <span class="dropdown-menu-item-icon">
                        <i class="${icon}"></i>
                    </span>`;
                }
                if (true) {
                    innerHtml += `
                    <span class="dropdown-menu-item-text">${text}</span>
                    <span class="dropdown-menu-item-trailing">
                        <i class="fa-solid fa-check fa-fw"></i>
                    </span>`;
                }
                var outerHtml = 
                `<div class="dropdown-menu-item ${className}">
                    ${innerHtml}
                </div>`;
                var itemElement = createElement(outerHtml);
                if (value === getValue()) {
                    itemElement.classList.add('selected');
                }
                if (itemElement) {
                    itemElement.addEventListener('click', function() {
                        if (setting.enableSelect) {
                            setValue(value);
                            itemElement.classList.add('selected');
                        }
                        _popover.close();
                        if (ref.onChange) {
                            ref.onChange(itemElement, value);
                        }
                    });
                }
                if (separator) {
                    menu.appendChild(
                        createElement('<div class="separator"></div>'));
                }
                menu.appendChild(itemElement);
            }
        }
        return ref;
    };
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
    return function(template, settings) {
        var _setting = {};
        settings = settings ?? {};
        _setting.singleton = settings.singleton ?? true;
        _setting.attrs = [];
        var data = settings.data ?? {};
        for (var [key, value] of Object.entries(data)) {
            _setting.attrs.push({
                name: key,
                value: value
            });
        }

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null,
            onClick: null
        };

        var element = null;
        function open() {
            if (!element) {
                var html = template.innerHTML;
                for(var attr of _setting.attrs) {
                    html = html.replace('__data-' + attr.name + '__', attr.value);
                }
                element = createElement(html);
                document.body.appendChild(element);
                if (_setting.singleton) {
                    template.innerHTML = '';
                }
                bodyScroll.lock();
                bindClose();
                bindClick();
                if (ref.onOpened) {
                    ref.onOpened(element);
                }
            }
        }
        function close(action = '') {
            if (element) {
                var html = element.outerHTML;
                remove(element);
                element = null;
                if (_setting.singleton) {
                    template.innerHTML = html;
                }
                bodyScroll.unlock();
                if (ref.onClosed) {
                    ref.onClosed(element, action);
                }
            }
        }
        function click(action = '') {
            if (element) {
                if (ref.onClick) {
                    ref.onClick(element, action);
                }
            }
        }
        function bindClose() {
            var items = element.querySelectorAll('[data-close]');
            for(var item of items) {
                let action = item.getAttribute('data-close');
                item.addEventListener('click', function (e) {
                    close(action);
                });
            }
        }
        function bindClick() {
            var items = element.querySelectorAll('[data-click]');
            for(var item of items) {
                let action = item.getAttribute('data-click');
                item.addEventListener('click', function (e) {
                    click(action);
                });
            }
        }
        return ref;
    };
})();
var alertModal = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(settings) {
        var _setting = {};
        settings = settings ?? {};
        _setting.singleton = false;
        _setting.title = settings.title ?? '';
        _setting.content = settings.content ?? '';
        _setting.confirmText = settings.confirmText ?? 'Confirm';
        _setting.confirmClass = settings.confirmClass ?? 'dark';
        _setting.showSeparator  = settings.showSeparator ?? false;
        _setting.showCloseButton  = settings.showCloseButton ?? false;
        _setting.className = settings.className ?? '';
        _setting.size = settings.size ?? 'modal-sm';
        _setting.btnSize = settings.btnSize ?? 'btn-sm';

        var titleTemplate = _setting.title ? `
        <div class="modal-header-title">
            <span>${_setting.title}</span>
        </div>
        ` : '';
        
        var bodyFirst = !_setting.title ? 'first' : '';
        var contentTemplate = _setting.content ? `
        <div class="modal-body ${bodyFirst}">
            <span>${_setting.content}</span>
        </div>` : '';

        var separatorTemplate = _setting.showSeparator ? `
        <div class="separator"></div>` : '';

        var closeButtonTemplate = _setting.showCloseButton ? `
        <button type="button" data-close="cancel" class="modal-icon-button square">
            <i class="fa-solid fa-xmark fa-fw"></i>
        </button>` : '';

        var headerTemplate = _setting.title ? `
        <div class="modal-header">
            <div class="start">
                ${titleTemplate}
            </div>
            <div class="end">
                ${closeButtonTemplate}
            </div>
        </div>` : '';

        var template = createElement(`
        <div class="modal-template">
            <div class="modal-backdrop">
                <div class="modal ${_setting.size} ${_setting.className}">
                    <div class="modal-block">
                        ${headerTemplate}
                        <div class="modal-scrollable">
                            ${contentTemplate}
                            ${separatorTemplate}
                            <div class="modal-footer">
                                <div class="modal-footer-scrollable">
                                    <div class="start"></div>
                                    <div class="end">
                                        <button type="button" data-close="confirm" class="modal-button ${_setting.btnSize} ${_setting.confirmClass}">
                                            <span>${_setting.confirmText}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null
        };
        
        var _modal = modal(template, _setting);
        _modal.onOpened = function (ele) {
            if (ref.onOpened) {
                ref.onOpened(ele);
            }
        }
        _modal.onClosed = function (ele, action) {
            if (ref.onClosed) {
                ref.onClosed(ele, action);
            }
        }
        function open() {
            _modal.open();
        }
        function close(action = '') {
            _modal.close(action);
        }
        return ref;
    };
})();
var confirmModal = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(settings) {
        var _setting = {};
        settings = settings ?? {};
        _setting.singleton = false;
        _setting.title = settings.title ?? '';
        _setting.content = settings.content ?? '';
        _setting.cancelText = settings.cancelText ?? 'Cancel';
        _setting.confirmText = settings.confirmText ?? 'Confirm';
        _setting.cancelClass = settings.cancelClass ?? 'light';
        _setting.confirmClass = settings.confirmClass ?? 'dark';
        _setting.showSeparator  = settings.showSeparator ?? false;
        _setting.showCloseButton  = settings.showCloseButton ?? false;
        _setting.className = settings.className ?? '';
        _setting.size = settings.size ?? '';
        _setting.btnSize = settings.btnSize ?? '';

        var titleTemplate = _setting.title ? `
        <div class="modal-header-title">
            <span>${_setting.title}</span>
        </div>
        ` : '';

        var bodyFirst = !_setting.title ? 'first' : '';
        var contentTemplate = _setting.content ? `
        <div class="modal-body ${bodyFirst}">
            <span>${_setting.content}</span>
        </div>` : '';

        var separatorTemplate = _setting.showSeparator ? `
        <div class="separator"></div>` : '';

        var closeButtonTemplate = _setting.showCloseButton ? `
        <button type="button" data-close="cancel" class="modal-icon-button square">
            <i class="fa-solid fa-xmark fa-fw"></i>
        </button>` : '';

        var headerTemplate = _setting.title ? `
        <div class="modal-header">
            <div class="start">
                ${titleTemplate}
            </div>
            <div class="end">
                ${closeButtonTemplate}
            </div>
        </div>` : '';

        var template = createElement(`
        <div class="modal-template">
            <div class="modal-backdrop">
                <div class="modal ${_setting.size} ${_setting.className}">
                    <div class="modal-block">
                        ${headerTemplate}
                        <div class="modal-scrollable">
                            ${contentTemplate}
                            ${separatorTemplate}
                            <div class="modal-footer">
                                <div class="modal-footer-scrollable">
                                    <div class="start"></div>
                                    <div class="end">
                                        <button type="button" data-close="cancel" class="modal-button ${_setting.btnSize} ${_setting.cancelClass}">
                                            <span>${_setting.cancelText}</span>
                                        </button>
                                        <button type="button" data-close="confirm" class="modal-button ${_setting.btnSize} ${_setting.confirmClass}">
                                            <span>${_setting.confirmText}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null
        };
        
        var _modal = modal(template, _setting);
        _modal.onOpened = function (ele) {
            if (ref.onOpened) {
                ref.onOpened(ele);
            }
        }
        _modal.onClosed = function (ele, action) {
            if (ref.onClosed) {
                ref.onClosed(ele, action);
            }
        }
        function open() {
            _modal.open();
        }
        function close(action = '') {
            _modal.close(action);
        }
        return ref;
    };
})();
var promptModal = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(settings) {
        var _setting = {};
        settings = settings ?? {};
        _setting.singleton = false;
        _setting.title = settings.title ?? '';
        _setting.content = settings.content ?? '';
        _setting.cancelText = settings.cancelText ?? 'Cancel';
        _setting.confirmText = settings.confirmText ?? 'Confirm';
        _setting.cancelClass = settings.cancelClass ?? 'light';
        _setting.confirmClass = settings.confirmClass ?? 'dark';
        _setting.showSeparator  = settings.showSeparator ?? false;
        _setting.showCloseButton  = settings.showCloseButton ?? false;
        _setting.className = settings.className ?? '';
        _setting.size = settings.size ?? '';
        _setting.btnSize = settings.btnSize ?? '';
        _setting.input = {};
        var input = settings.input ?? {};
        _setting.input.textarea = input.textarea ?? false;
        _setting.input.value = input.value ?? '';
        _setting.input.placeholder = input.placeholder ?? '';
        _setting.input.required = input.required ?? false;

        var titleTemplate = _setting.title ? `
        <div class="modal-header-title">
            <span>${_setting.title}</span>
        </div>
        ` : '';

        var bodyFirst = !_setting.title ? 'first' : '';
        var contentTemplate = _setting.content ? `
        <div class="modal-body ${bodyFirst}">
            <span>${_setting.content}</span>
        </div>` : '';

        var separatorTemplate = _setting.showSeparator ? `
        <div class="separator"></div>` : '';

        var closeButtonTemplate = _setting.showCloseButton ? `
        <button type="button" data-close="cancel" class="modal-icon-button square">
            <i class="fa-solid fa-xmark fa-fw"></i>
        </button>` : '';

        var headerTemplate = _setting.title ? `
        <div class="modal-header">
            <div class="start">
                ${titleTemplate}
            </div>
            <div class="end">
                ${closeButtonTemplate}
            </div>
        </div>` : '';

        var formLast = !settings.showSeparator ? 'last' : '';
        var formFirst = !_setting.title && !_setting.content ? 'first' : '';
        var inputTemplate = `
        <input type="text" value="${_setting.input.value}" placeholder="${_setting.input.placeholder}" name="input" />`;
        if (_setting.input.textarea) {
            inputTemplate = `
            <textarea placeholder="${_setting.input.placeholder}" name="input">${_setting.input.value}</textarea>`;
        }

        var template = createElement(`
        <div class="modal-template">
            <div class="modal-backdrop">
                <div class="modal ${_setting.size} ${_setting.className}">
                    <div class="modal-block">
                        ${headerTemplate}
                        <div class="modal-scrollable">
                            ${contentTemplate}
                            <div class="modal-form ${formFirst} ${formLast}">
                                <div class="form-field-input-only-wrap">
                                    ${inputTemplate}
                                </div>
                            </div>
                            ${separatorTemplate}
                            <div class="modal-footer">
                                <div class="modal-footer-scrollable">
                                    <div class="start"></div>
                                    <div class="end">
                                        <button type="button" data-close="cancel" class="modal-button ${_setting.btnSize} ${_setting.cancelClass}">
                                            <span>${_setting.cancelText}</span>
                                        </button>
                                        <button type="button" data-close="confirm" class="modal-button ${_setting.btnSize} ${_setting.confirmClass}">
                                            <span>${_setting.confirmText}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null
        };
        
        var _value = '';
        var _modal = modal(template, _setting);
        _modal.onOpened = function (ele) {
            var input = ele.querySelector('[name=input]');
            var button = ele.querySelector('[data-close=confirm]');
            function onInput() {
                if (_setting.input.required) {
                    button.removeAttribute('disabled');
                    if (!input.value) {
                        button.setAttribute('disabled', '');
                    }
                }
                _value = input.value;
            }
            onInput();
            input.addEventListener('input', onInput);
            if (!_setting.input.textarea) {
                input.addEventListener('keydown', (e) => {
                    if (e.isComposing)
                        return;
                    if (e.key === 'Enter' && !e.shiftKey) {
                        button.click();
                    }
                });
            }
            input.focus();
            var length = input.value.length;
            input.setSelectionRange(length, length);
            if (ref.onOpened) {
                ref.onOpened(ele);
            }
        }
        _modal.onClosed = function (ele, action) {
            if (ref.onClosed) {
                var val = _value;
                if (action !== 'confirm') {
                    val = '';
                }
                ref.onClosed(ele, action, val);
            }
        }
        function open() {
            _modal.open();
        }
        function close(action = '') {
            _modal.close(action);
        }
        return ref;
    };
})();
var loadingModal = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(settings) {
        var _setting = {};
        settings = settings ?? {};
        _setting.singleton = false;
        _setting.content = settings.content ?? '';
        _setting.className = settings.className ?? '';
        _setting.size = settings.size ?? 'modal-xs';
        _setting.showSpinner = settings.showSpinner ?? true;

        var spinnerTemplate = _setting.showSpinner ? `
            <span class="modal-loading-spinner">
                <i class="fa-solid fa-spinner fa-spin-pulse"></i>
            </span>` : '';
        
        var template = createElement(`
        <div class="modal-template">
            <div class="modal-backdrop">
                <div class="modal modal-loading ${_setting.size} ${_setting.className}">
                    <div class="modal-block">
                        <div class="modal-body">
                            ${_setting.content} ${spinnerTemplate}
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null
        };
        
        var _modal = modal(template, _setting);
        _modal.onOpened = function (ele) {
            if (ref.onOpened) {
                ref.onOpened(ele);
            }
        }
        _modal.onClosed = function (ele, action) {
            if (ref.onClosed) {
                ref.onClosed(ele, action);
            }
        }
        function open() {
            _modal.open();
        }
        function close(action = '') {
            _modal.close(action);
        }
        return ref;
    };
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
    };
})();
var collapse = (function () {
    return function(element, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.initHeight = _settings.initHeight ?? '0px';

        var _ = null;
        var isAnimating = false;
        var isShow = element.classList.contains('show');
        element.classList.add('collapse');
        function getIsShow() {
            return isShow;
        }
        function getIsAnimating() {
            return isAnimating;
        }
        function toggle() {
            if (isAnimating) 
                return;
            if (isShow) {
                hide();
            } else {
                show();
            }
        }
        function show() {
            if (isAnimating) 
                return;
            if (!isShow) {
                isAnimating = true;
                element.classList.remove('collapse');
                element.classList.add('collapsing');
                // element.style.height = '0px';
                element.style.height = setting.initHeight;
                var scrollHeight = element.scrollHeight;
                // 觸發瀏覽器重繪
                _ = element.offsetHeight;
                element.style.height = scrollHeight + 'px';
                var handler = function () {
                    element.classList.remove('collapsing');
                    element.classList.add('collapse', 'show');
                    element.style.height = '';
                    element.removeEventListener('transitionend', handler);
                    isAnimating = false;
                }
                element.addEventListener('transitionend', handler);
            }
            isShow = true;
        }
        function hide() {
            if (isAnimating) 
                return;
            if (isShow) {
                isAnimating = true;
                element.style.height = element.scrollHeight + 'px';
                // 觸發瀏覽器重繪
                _ = element.offsetHeight;
                element.classList.remove('collapse', 'show');
                element.classList.add('collapsing');
                // element.style.height = '0px';
                element.style.height = setting.initHeight;
                var handler = function () {
                    element.classList.remove('collapsing');
                    element.classList.add('collapse');
                    element.style.height = '';
                    element.removeEventListener('transitionend', handler);
                    isAnimating = false;
                }
                element.addEventListener('transitionend', handler);
            }
            isShow = false;
        }
        return {
            toggle: toggle,
            show: show,
            hide: hide,
            getIsShow: getIsShow,
            getIsAnimating: getIsAnimating,
            _: _
        };
    };
})();
var searchBar = (function () {
    return function(selector) {
        var block = document.querySelector(selector);
        var box = block.querySelector('.search-box');
        var input = block.querySelector('.search-input');
        var inputBox = block.querySelector('.search-input-box');
        var backBtn = block.querySelector('.search-back-button');
        var toggleBtn = block.querySelector('.search-toggle-button');
        var clearBtn = block.querySelector('.search-clear-button');
        var searchBtn = block.querySelector('.search-button');
        
        var ref = {
            init: init,
            onToggle : null,
            onSearch: null
        };

        var isOpen = false;
        function init(_text, _isOpen) {
            var text = _text ?? '';
            isOpen = _isOpen ?? false;

            input.value = text;
            onInput();
            box.classList.remove('show');
            if (isOpen) {
                box.classList.add('show');
            }
        }
        function toggle() {
            isOpen = !isOpen;
            if (isOpen) {
                box.classList.add('show');
                input.focus();
            }
            else {
                box.classList.remove('show');
            }
            if (ref.onToggle) {
                ref.onToggle(isOpen);
            }
        }
        function clear() {
            input.value = '';
            onInput();
            input.focus();
        }
        function search() {
            if (ref.onSearch) {
                ref.onSearch(input.value);
            }
        }

        var onInput = (function () {
            var _display  = clearBtn.style.display;
            return function () {
                if (input.value) {
                    clearBtn.style.display = _display;
                }
                else {
                    clearBtn.style.display = 'none';
                }
            };
        })();
        onInput();
        
        // input.addEventListener('focus', () => {
        //     inputBox.classList.add('focus');
        // });
        // input.addEventListener('blur', () => {
        //     inputBox.classList.remove('focus');
        // });

        clearBtn.addEventListener('click', () => {
            clear();
        });
        backBtn.addEventListener('click', () => {
            toggle();
        });
        toggleBtn.addEventListener('click', () => {
            toggle();
        });

        searchBtn.addEventListener('click', () => {
            search();
        });
        input.addEventListener('keydown', (e) => {
            if (e.isComposing)
                return;
            if (e.key === 'Enter' && !e.shiftKey) {
                search();
            }
        });

        input.addEventListener('input', (e) => {
            onInput();
        });
        return ref;
    };
})();
var nav = null;
var onNav = null;
var onNavOpen = null;
var onNavClose = null;
(function() {
    var _ = null;
    var isAnimating = false;
    function show(element, mask, type) {
        if (isAnimating) 
            return;
        isAnimating = true;
        var ingClass = type === 'open' ? 'opening' : 'activing';
        element.classList.add(ingClass);
        // element.classList.add('collapsing');
        element.style.height = '0px';
        element.style.width = '0px';
        element.style.opacity = '0';
        var scrollHeight = element.scrollHeight;
        var scrollWidth = element.scrollWidth;
        if (type === 'open') {
            mask.classList.add('opening');
            mask.style.opacity = '0';
        }
        // 觸發瀏覽器重繪
        _ = element.offsetHeight;
        element.style.height = scrollHeight + 'px';
        element.style.width = scrollWidth + 'px';
        element.style.opacity = '1';
        if (type === 'open') {
            mask.style.opacity = '1';
            // mask.classList.add('open');
            bodyScroll.lock();
        }
        else {
            var main = document.querySelector('.main');
            main.classList.add('active');
        }
        var handler = function () {
            element.classList.remove(ingClass);
            element.classList.add(type);
            // element.classList.remove('collapsing');
            // element.classList.add('show');
            element.style.height = '';
            element.style.width = '';
            element.style.opacity = '';
            if (type === 'open') {
                mask.classList.remove('opening');
                mask.classList.add('open');
                mask.style.opacity = '';
            }
            element.removeEventListener('transitionend', handler);
            isAnimating = false;
        }
        element.addEventListener('transitionend', handler);
    }
    function hide(element, mask, type) {
        if (isAnimating) 
            return;
        isAnimating = true;
        var ingClass = type === 'open' ? 'opening' : 'activing';
        element.style.height = element.scrollHeight + 'px';
        element.style.width = element.scrollWidth + 'px';
        element.style.opacity = '1';
        if (type === 'open') {
            mask.style.opacity = '1';
        }
        // 觸發瀏覽器重繪
        _ = element.offsetHeight;
        element.classList.remove(type);
        element.classList.add(ingClass);
        // element.classList.remove('show');
        // element.classList.add('collapsing');
        element.style.height = '0px';
        element.style.width = '0px';
        element.style.opacity = '0';
        if (type === 'open') {
            mask.classList.remove('open');
            mask.classList.add('opening');
            mask.style.opacity = '0';
            // mask.classList.remove('open');
            bodyScroll.unlock();
        }
        else {
            var main = document.querySelector('.main');
            main.classList.remove('active');
        }
        var handler = function () {
            element.classList.remove(ingClass);
            // element.classList.remove('collapsing');
            element.style.height = '';
            element.style.width = '';
            element.style.opacity = '';
            if (type === 'open') {
                mask.classList.remove('opening');
                mask.style.opacity = '';
            }
            element.removeEventListener('transitionend', handler);
            isAnimating = false;
            // if (type === 'open') {
            //     var mask = document.querySelector('.left-menu-mask');
            //     mask.classList.remove('open');
            // }
        }
        element.addEventListener('transitionend', handler);
    }
    function _onNav() {
        if (isAnimating)
            return;
        var element = document.querySelector('.left-menu');
        var isActive = element.classList.contains('active');
        if (isActive) {
            hide(element, null, 'active');
        } else {
            show(element, null, 'active');
        }
    }
    function _onNavOpen() {
        if (isAnimating)
            return;
        var element = document.querySelector('.left-menu');
        var mask = document.querySelector('.left-menu-mask');
        var isOpen = element.classList.contains('open');
        if (isOpen) {
            hide(element, mask, 'open');
        } else {
            show(element, mask, 'open');
        }
    }
    function _onNavClose() {
        _onNavOpen();
    }
    onNav = _onNav;
    onNavOpen = _onNavOpen;
    onNavClose = _onNavClose;
    nav = {
        _: _
    }
})();

var enableMenuResizeListener = (function() {
    return function() {
        onResize(function() {
            var leftMenu = document.querySelector('.left-menu');
            if (leftMenu.classList.contains('open')) {
                if (window.innerWidth <= 1330) {
                    bodyScroll.lock();
                }
                else {
                    bodyScroll.unlock();
                }
            }
        });
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

var enableSubMenuScrollbar = (function() {
    return function() {
        var scrollable = document.querySelector('.sub-menu-scrollable');
        scrollbar(scrollable);
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