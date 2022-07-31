var $m = (function () {
    var _this = {
        onNav: function () {
            var leftMenu = document.querySelector('.left-menu');
            var main = document.querySelector('.main');
            if (leftMenu.className.indexOf('active') > -1) {
                leftMenu.className = leftMenu.className.replace(' active', '');
                main.className = main.className.replace(' active', '');
            } else {
                leftMenu.className = leftMenu.className + ' active';
                main.className = main.className + ' active';
            }
        },
        onNavOpen: function () {
            var leftMenu = document.querySelector('.left-menu');
            var leftMenuMask = document.querySelector('.left-menu-mask');
            if (leftMenu.className.indexOf('open') > -1) {
                leftMenu.className = leftMenu.className.replace(' open', '');
                leftMenuMask.className = leftMenuMask.className.replace(' open', '');
            } else {
                leftMenu.className = leftMenu.className + ' open';
                leftMenuMask.className = leftMenuMask.className + ' open';
            }
        },
        onNavClose: function () {
            _this.onNavOpen();
        },
        selectMenu: function (val) {
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
        },
        selectSubMenu: function (val) {
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
        },
        tooltip: function (selector) {
            var items = document.querySelectorAll(selector);
            var template = document.querySelector('.tooltip-template');
            for (var i = 0; i < items.length; i++) {
                (function () {
                    var item = items[i];
                    var element = null;
                    item.addEventListener("mouseenter", function () {
                        if (!element) {
                            var rect = item.getBoundingClientRect();
                            var html = template.innerHTML;
                            var content = item.getAttribute('content');
                            html = html.replace('__content__', content);
                            element = createElement(html);
                            document.body.appendChild(element);
                            var top = rect.top + rect.height + 3;
                            var left = rect.left + rect.width / 2 - element.offsetWidth / 2;
                            var scroll = document.documentElement.scrollTop || document.body.scrollTop;
                            element.style.transform = 'translate3d(' + left + 'px, ' + (top + scroll) + 'px, 0px)';
                        }
                    });
                    item.addEventListener("mouseleave", function () {
                        if (element) {
                            document.body.removeChild(element);
                            element = null;
                        }
                    });
                })();
            }
        },
        gotop: function (selector) {
            function getScroll() {
                return document.documentElement.scrollTop || document.body.scrollTop;
            }
            var gotop = document.querySelector(selector);
            gotop.addEventListener("click", function (e) {
                e.preventDefault();
                var scroll = getScroll();
                setTimeout(function () {
                    scroll = Math.floor(scroll * 0.85);
                    document.documentElement.scrollTop = document.body.scrollTop = scroll;
                    if (scroll > 0) {
                        setTimeout(arguments.callee, 25);
                    }
                }, 25);
            });
            document.addEventListener('scroll', function () {
                var scroll = getScroll();
                if (scroll < 200) {
                    gotop.className = gotop.className.replace(' show', '');
                } else {
                    if (gotop.className.indexOf('show') === -1) {
                        gotop.className = gotop.className + ' show';
                    }
                }
            });
        },
        imgerror: function (e, url) {
            e.target.onerror = null;
            e.target.src = url;
        }
    };
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return _this;
})();