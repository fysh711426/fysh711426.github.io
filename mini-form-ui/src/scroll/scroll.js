// check-if-a-user-has-scrolled-to-the-bottom-not-just-the-window-but-any-element
// https://stackoverflow.com/questions/3898130

var onScrollEnd = (function () {
    function getScrollTop() {
        return Math.max(window.scrollY || 0,
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
    return function(callback, distance, delay) {
        distance = distance ?? 0;
        onScroll(function () {
            if (getScrollTop() + getClientHeight() + distance >= getScrollHeight()) {
                callback.call(this);
            }
        }, delay);
    };
})();

var onScroll = function (callback, delay) {
    var scheduled = false;
    delay = delay ?? 100;
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

var bodyScroll = (function () {
    var scrollY = 0;
    var isLocked = false;
    function lock() {
        if (!isLocked) {
            scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
            var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.minWidth  = `calc(100% - ${scrollbarWidth}px)`;
            document.body.style.maxWidth  = `calc(100% - ${scrollbarWidth}px)`;
        }
        isLocked = true;
    }
    function unlock() {
        if (isLocked) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.minWidth = '';
            document.body.style.maxWidth = '';
            document.body.style.paddingRight = '';
            window.scrollTo({ top: scrollY });
        }
        isLocked = false;
    }
    return {
        lock: lock,
        unlock: unlock
    };
})();