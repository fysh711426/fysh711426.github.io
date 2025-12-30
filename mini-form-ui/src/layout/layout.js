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