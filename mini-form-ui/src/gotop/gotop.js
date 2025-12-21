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