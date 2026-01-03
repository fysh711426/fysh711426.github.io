var modal = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    function remove(element) {
        try {
            document.body.removeChild(element);
        } catch { }
    }
    return function(template, _settings) {
        var setting = {};
        _settings = _settings ?? {};

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null,
            onClick: null
        };

        var element = null;
        function open() {
            if (!element) {
                var html = template.innerHTML;
                element = createElement(html);
                document.body.appendChild(element);
                template.innerHTML = '';
                bodyScroll.lock();
                bindClose();
                bindClick();
                if (ref.onOpened) {
                    ref.onOpened(element);
                }
            }
        }
        function close(action = '') {
            if (element) {
                var html = element.outerHTML;
                remove(element);
                element = null;
                template.innerHTML = html;
                bodyScroll.unlock();
                if (ref.onClosed) {
                    ref.onClosed(element, action);
                }
            }
        }
        function click(action = '') {
            if (element) {
                if (ref.onClick) {
                    ref.onClick(element, action);
                }
            }
        }
        function bindClose() {
            var items = element.querySelectorAll('[data-close]');
            for(var item of items) {
                let action = item.getAttribute('data-close');
                item.addEventListener('click', function (e) {
                    close(action);
                });
            }
        }
        function bindClick() {
            var items = element.querySelectorAll('[data-click]');
            for(var item of items) {
                let action = item.getAttribute('data-click');
                item.addEventListener('click', function (e) {
                    click(action);
                });
            }
        }
        return ref;
    };
})();