var $m = (function() {
    var _this = {
        onNav: function() {
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
        onNavOpen: function() {
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
        onNavClose: function() {
            _this.onNavOpen();
        },
        selectMenu: function(val) {
            var items = document.querySelectorAll('.left-menu-item');
            for(var i=0; i<items.length; i++) {
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
        selectSubMenu: function(val) {
            var items = document.querySelectorAll('.sub-menu-item');
            for(var i=0; i<items.length; i++) {
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
    };
    return _this;
})();