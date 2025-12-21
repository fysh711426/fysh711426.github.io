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
    var scrollY = 0;
    function lock() {
        scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.minWidth  = `calc(100% - ${scrollbarWidth}px)`;
    }
    function unlock() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.minWidth = '';
        document.body.style.paddingRight = '';
        window.scrollTo({ top: scrollY });
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
                lock();
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
                unlock();
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
    }
})();