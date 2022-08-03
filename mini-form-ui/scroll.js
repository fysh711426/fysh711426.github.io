var onScrollEnd = (function () {
    function getScrollTop() {
        return Math.max(window.pageYOffset || 0,
            document.documentElement.scrollTop || document.body.scrollTop);
    }
    function getScrollHeight() {
        return document.documentElement.scrollHeight || document.body.scrollHeight;
    }
    function getClientHeight() {
        return document.documentElement.clientHeight || document.body.clientHeight;
    }
    return function (callback, distance) {
        distance = distance || 0;
        document.addEventListener('scroll', function () {
            if (getScrollTop() + getClientHeight() + offset >= getScrollHeight()) {
                callback.call(this);
            }
        });
    }
})();
