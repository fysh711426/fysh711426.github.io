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
    // var enableExpand = function() {
    //     var toggle = document.querySelector('.file-navbar-toggle');
    //     var expand = document.querySelector('.file-navbar-expand');
    //     if (toggle && expand) {
    //         toggle.addEventListener('click', function (e) {
    //             e.stopPropagation();
    //             if (!toggle.classList.contains('open')) {
    //                 toggle.classList.add('open');
    //                 expand.classList.add('open');
    //             }
    //             else {
    //                 toggle.classList.remove('open');
    //                 expand.classList.remove('open');
    //             }
    //         });
    //     }
    // }
    var enableExpand = function() {
        var toggle = document.querySelector('.file-navbar-toggle');
        var expand = document.querySelector('.file-navbar-expand');
        var scrollable = document.querySelector('.file-navbar-expand-scrollable');
        if (toggle && expand) {
            if (scrollable) {
                var _collapse = collapse(scrollable);
                expand.classList.add('open');
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
                scrollable.addEventListener('wheel', function (e) {
                    e.preventDefault();
                    // scrollable.scrollLeft += e.deltaY;
                    // scrollable.scrollBy({
                    //     left: e.deltaY,
                    //     behavior: 'smooth'
                    // });
                // }, { passive: false });
                });
            }
            else {
                toggle.addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (!toggle.classList.contains('open')) {
                        toggle.classList.add('open');
                        expand.classList.add('open');
                    }
                    else {
                        toggle.classList.remove('open');
                        expand.classList.remove('open');
                    }
                });
            }
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