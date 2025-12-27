var collapse = (function () {
    return function(element, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.initHeight = _settings.initHeight ?? '0px';

        var isAnimating = false;
        var isShow = element.classList.contains('show');
        element.classList.add('collapse');
        function getIsShow() {
            return isShow;
        }
        function getIsAnimating() {
            return isAnimating;
        }
        function toggle() {
            if (isAnimating) 
                return;
            if (isShow) {
                hide();
            } else {
                show();
            }
        }
        function show() {
            if (isAnimating) 
                return;
            if (!isShow) {
                isAnimating = true;
                element.classList.remove('collapse');
                element.classList.add('collapsing');
                // element.style.height = '0px';
                element.style.height = setting.initHeight;
                var scrollHeight = element.scrollHeight;
                // 觸發瀏覽器重繪
                element.offsetHeight;
                element.style.height = scrollHeight + 'px';
                var handler = function () {
                    element.classList.remove('collapsing');
                    element.classList.add('collapse', 'show');
                    element.style.height = '';
                    element.removeEventListener('transitionend', handler);
                    isAnimating = false;
                }
                element.addEventListener('transitionend', handler);
            }
            isShow = true;
        }
        function hide() {
            if (isAnimating) 
                return;
            if (isShow) {
                isAnimating = true;
                element.style.height = element.scrollHeight + 'px';
                // 觸發瀏覽器重繪
                element.offsetHeight;
                element.classList.remove('collapse', 'show');
                element.classList.add('collapsing');
                // element.style.height = '0px';
                element.style.height = setting.initHeight;
                var handler = function () {
                    element.classList.remove('collapsing');
                    element.classList.add('collapse');
                    element.style.height = '';
                    element.removeEventListener('transitionend', handler);
                    isAnimating = false;
                }
                element.addEventListener('transitionend', handler);
            }
            isShow = false;
        }
        return {
            toggle: toggle,
            show: show,
            hide: hide,
            getIsShow: getIsShow,
            getIsAnimating: getIsAnimating
        };
    };
})();