var onResize = function (callback, delay = 200) {
    var timer = null;
    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.call(this);
        }, delay);
    });
}