var tooltip = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function (selector) {
        var items = document.querySelectorAll(selector);
        var template = document.querySelector('.tooltip-template');
        for (var i = 0; i < items.length; i++) {
            (function () {
                var item = items[i];
                var element = null;
                item.addEventListener("mouseenter", function () {
                    if (!element) {
                        var rect = item.getBoundingClientRect();
                        var html = template.innerHTML;
                        var content = item.getAttribute('content');
                        html = html.replace('__content__', content);
                        element = createElement(html);
                        document.body.appendChild(element);
                        var top = rect.top + rect.height + 3;
                        var left = rect.left + rect.width / 2 - element.offsetWidth / 2;
                        var scroll = document.documentElement.scrollTop || document.body.scrollTop;
                        element.style.transform = 'translate3d(' + left + 'px, ' + (top + scroll) + 'px, 0px)';
                    }
                });
                item.addEventListener("mouseleave", function () {
                    if (element) {
                        document.body.removeChild(element);
                        element = null;
                    }
                });
            })();
        }
    }
})();