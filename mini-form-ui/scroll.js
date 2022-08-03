// check-if-a-user-has-scrolled-to-the-bottom-not-just-the-window-but-any-element
// https://stackoverflow.com/questions/3898130

var onScrollEnd = (function () {
    function getScrollTop() {
        return Math.max(window.pageYOffset || 0,
            document.documentElement.scrollTop || document.body.scrollTop);
    }
    // function getScrollHeight() {
    //     return document.documentElement.scrollHeight || document.body.scrollHeight;
    // }
    function getClientHeight() {
        return document.documentElement.clientHeight || document.body.clientHeight;
    }
    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }
    return function (callback, distance) {
        distance = distance || 0;
        document.addEventListener('scroll', function () {
            if (getScrollTop() + getClientHeight() + distance >= getDocHeight()) {
                callback.call(this);
            }
        });
    }
})();
