var scrollbar = (function () {
    return function(scrollable) {
        scrollable.classList.add('scrollbar');
        var isAnimating = false;
        var targetScrollLeft = 0;
        var prev = 0;
        function smoothScroll() {
            isAnimating = true;
            var current = scrollable.scrollLeft;
            var diff = targetScrollLeft - current;
            // 差距夠小就停止
            if (Math.abs(diff) <= 1 || current === prev) {
                scrollable.scrollLeft = targetScrollLeft;
                isAnimating = false;
                return;
            }
            // easing 數值越小越滑
            prev = current;
            scrollable.scrollLeft = current + diff * 0.15;
            requestAnimationFrame(smoothScroll);
        }
        scrollable.addEventListener('wheel', function (e) {
            e.preventDefault();
            // scrollable.scrollLeft += e.deltaY;
            // var maxDelta = 80;
            // var delta = Math.max(-maxDelta, Math.min(maxDelta, e.deltaY));
            // targetScrollLeft += delta * 0.9;
            targetScrollLeft += e.deltaY;
            targetScrollLeft = Math.max(0, Math.min(targetScrollLeft,
                scrollable.scrollWidth - scrollable.clientWidth));
            if (!isAnimating) {
                smoothScroll();
            }
        }, { passive: false });
    };
})();