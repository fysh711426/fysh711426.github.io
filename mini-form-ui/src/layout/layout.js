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