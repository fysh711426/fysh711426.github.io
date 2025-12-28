var fileNavbar = (function() {
    // hover
    var enableHover = function() {
        var wrap = document.querySelector('.file-navbar-title-wrap');
        var navbarTitle = document.querySelector('.file-navbar-title');
        var navbarTitleOver = document.querySelector('.file-navbar-title-over');
        navbarTitle.addEventListener('mouseover', function () {
            wrap.classList.add('hover');
        });
        navbarTitleOver.addEventListener('mouseleave', function () {
            wrap.classList.remove('hover');
        });
    }

    // expand
    var enableExpand = function() {
        var toggle = document.querySelector('.file-navbar-toggle');
        var scrollable = document.querySelector('.file-navbar-expand-scrollable');
        if (toggle && scrollable) {
            var _collapse = collapse(scrollable, {
                initHeight: '15px'
            });
            toggle.addEventListener('click', function (e) {
                e.stopPropagation();
                _collapse.toggle();
                if (_collapse.getIsShow()) {
                    toggle.classList.add('open');
                }
                else {
                    toggle.classList.remove('open');
                }
            });
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
        }
    }
    
    // image over
    var enableImageOver = function() {
        var navbar = document.querySelector('.file-navbar');
        var images = document.querySelectorAll('.file-image-block');
        function onToggle() {
            navbar.classList.toggle('over');
        }
        for (var item of images) {
            item.classList.add('over');
            item.addEventListener('click', onToggle);
        }
    }

    // text over
    var enableTextOver = function() {
        var navbar = document.querySelector('.file-navbar');
        var text = document.querySelector('.file-text-content');
        text.classList.add('over');
        text.addEventListener('click', function() {
            navbar.classList.toggle('over');
        });
    }

    return {
        enableHover: enableHover,
        enableExpand: enableExpand,
        enableImageOver: enableImageOver,
        enableTextOver: enableTextOver
    };
})();

var onTextThemeButtonChange = (function() {
    var prev = null;
    return function(newTheme) {
        var themeButton = document.querySelector('.text-theme-button');
        if (prev) {
            themeButton.classList.remove(prev);
        }
        themeButton.classList.add(newTheme);
        prev = newTheme;
    };
})();