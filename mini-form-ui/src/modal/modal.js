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
            open: open,
            close: close,
            onOpened: null,
            onClosed: null
        };

        var element = null;
        function open() {
            if (!element) {
                var html = template.innerHTML;
                element = createElement(html);
                document.body.appendChild(element);
                template.innerHTML = '';
                bodyScroll.lock();
                bindDismiss();
                if (ref.onOpened) {
                    ref.onOpened(element);
                }
            }
        }
        function close() {
            if (element) {
                var html = element.outerHTML;
                remove(element);
                element = null;
                template.innerHTML = html;
                bodyScroll.unlock();
                if (ref.onClosed) {
                    ref.onClosed(element);
                }
            }
        }
        function bindDismiss() {
            var dismiss = element.querySelectorAll('[data-dismiss]');
            for(var item of dismiss) {
                item.addEventListener('click', function (e) {
                    close();
                });
            }
        }
        return ref;
    };
})();