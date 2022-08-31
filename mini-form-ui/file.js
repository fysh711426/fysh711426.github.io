function fileNavbar(setting) {
    setting = setting || {};

    // expand
    var toggle = document.querySelector('.file-navbar-toggle');
    var expand = document.querySelector('.file-navbar-expand');
    if (toggle && expand) {
        toggle.addEventListener('click', function () {
            if (toggle.className.indexOf('open') === -1) {
                toggle.className = toggle.className + ' open';
                expand.className = expand.className + ' open';
            }
            else {
                toggle.className = toggle.className.replace(' open', '');
                expand.className = expand.className.replace(' open', '');
            }
        });
    }

    // gotop
    function getScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    }
    function showHide(element, isShow) {
        if (element) {
            if (isShow) {
                if (element.className.indexOf('show') === -1) {
                    element.className = element.className + ' show';
                }
            }
            else {
                element.className = element.className.replace(' show', '');
            }
        }
    }
    var gotop = document.querySelector('.file-navbar-gotop');
    if (gotop) {
        var scrollTop = setting.scrollTop || 75;
        onScroll(function () {
            if (getScrollTop() > scrollTop) {
                showHide(gotop, true);
                showHide(toggle, false);
            }
            else {
                showHide(gotop, false);
                showHide(toggle, true);
            }
        }, 50);
        gotop.addEventListener('click', function () {
            var _gotop = document.querySelector('.gotop');
            if (_gotop) {
                _gotop.click();
            }
        });
    }

    // hover
    var enableHover = setting.enableHover || false;
    if (enableHover) {
        var warp = document.querySelector('.file-navbar-title-warp');
        var navbarTitle = document.querySelector('.file-navbar-title');
        var navbarTitleOver = document.querySelector('.file-navbar-title-over');
        navbarTitle.addEventListener('mouseover', function () {
            if (warp.className.indexOf('hover') === -1) {
                warp.className = warp.className + ' hover';
            }
        });
        navbarTitleOver.addEventListener('mouseleave', function () {
            warp.className = warp.className.replace(' hover', '');
        });
    }

    // image over
    function onToggle() {
        if (navbar.className.indexOf('over') === -1) {
            navbar.className = navbar.className + ' over';
        }
        else {
            navbar.className = navbar.className.replace(' over', '');
        }
    }
    var enableImageOver = setting.enableImageOver || false;
    if (enableImageOver) {
        var navbar = document.querySelector('.file-navbar');
        var images = document.querySelectorAll('.file-image-block');
        for (var i = 0; i < images.length; i++) {
            var item = images[i];
            item.className = item.className + ' over';
            onToggle();
            item.addEventListener('click', onToggle);
        }
    }

    // text over
    var enableTextOver = setting.enableTextOver || false;
    if (enableTextOver) {
        var navbar = document.querySelector('.file-navbar');
        var text = document.querySelector('.file-text-content');
        text.className = text.className + ' over';
        onToggle();
        text.addEventListener('click', onToggle);
    }
}

var onTextThemeButtonChange = (function() {
    var prev = null;
    return function(newTheme) {
        var themeButton = document.querySelector('.text-theme-button');
        if (prev) {
            themeButton.className = themeButton.className.replace(' ' + prev, '');
        }
        themeButton.className = themeButton.className + ' ' + newTheme;
        prev = newTheme;
    };
})();