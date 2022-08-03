// check-if-a-user-has-scrolled-to-the-bottom-not-just-the-window-but-any-element
// https://stackoverflow.com/questions/3898130

var onScrollEnd = (function () {
    function getScrollTop() {
        return Math.max(window.pageYOffset || 0,
            document.documentElement.scrollTop || document.body.scrollTop);
    }
    function getScrollHeight() {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    }
    function getClientHeight() {
        return Math.max(window.innerHeight || 0,
            document.documentElement.clientHeight || document.body.clientHeight);
    }
    return function (callback, distance, delay) {
        distance = distance || 0;
        onScroll(function () {
            if (getScrollTop() + getClientHeight() + distance >= getScrollHeight()) {
                callback.call(this);
            }
        }, delay);
    }
})();

var onScroll = function (callback, delay) {
    var scheduled = false;
    delay = delay || 100;
    document.addEventListener('scroll', function () {
        if (!scheduled) {
            scheduled = true;
            setTimeout(function () {
                callback.call(this);
                scheduled = false;
            }, delay);
        }
    });
}
