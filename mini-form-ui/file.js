function fileNavbar(setting) {
    setting = setting || {};

    // expand
    var toggle = document.querySelector('.file-navbar-toggle');
    var expand = document.querySelector('.file-navbar-expand');
    if (toggle && expand) {
        toggle.addEventListener('click', function() {
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
        if(element) {
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
        gotop.addEventListener('click', function() {
            var _gotop = document.querySelector('.gotop');
            if (_gotop) {
                _gotop.click();
            }
        });
    }
}