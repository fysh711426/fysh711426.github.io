var popover = (function () {
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
    function getPosition(placement, item, element) {
        var spacing = 5;
        var rect = item.getBoundingClientRect();
        if (placement === 'top') {
            var top = rect.top - element.offsetHeight - spacing;
            var left = rect.left + rect.width / 2 - element.offsetWidth / 2 - 1;
            return [left, top];
        }
        if (placement === 'bottom') {
            var top = rect.bottom + spacing;
            var left = rect.left + rect.width / 2 - element.offsetWidth / 2 - 1;
            return [left, top];
        }
        if (placement === 'left') {
            var top = rect.top - (element.offsetHeight - rect.height) / 2 - 1;
            var left = rect.left - element.offsetWidth - spacing;
            return [left, top];
        }
        if (placement === 'right') {
            var top = rect.top - (element.offsetHeight - rect.height) / 2 - 1;
            var left = rect.right + spacing;
            return [left, top];
        }
        if (placement === 'topLeft') {
            var top = rect.top - element.offsetHeight - spacing;
            var left = rect.left;
            return [left, top];
        }
        if (placement === 'topRight') {
            var top = rect.top - element.offsetHeight - spacing;
            var left = rect.right - element.offsetWidth;
            return [left, top];
        }
        if (placement === 'bottomLeft') {
            var top = rect.bottom + spacing;
            var left = rect.left;
            return [left, top];
        }
        if (placement === 'bottomRight') {
            var top = rect.bottom + spacing;
            var left = rect.right - element.offsetWidth;
            return [left, top];
        }
        if (placement === 'leftTop') {
            var top = rect.top;
            var left = rect.left - element.offsetWidth - spacing;
            return [left, top];
        }
        if (placement === 'leftBottom') {
            var top = rect.bottom - element.offsetHeight;
            var left = rect.left - element.offsetWidth - spacing;
            return [left, top];
        }
        if (placement === 'rightTop') {
            var top = rect.top;
            var left = rect.right + spacing;
            return [left, top];
        }
        if (placement === 'rightBottom') {
            var top = rect.bottom - element.offsetHeight;
            var left = rect.right + spacing;
            return [left, top];
        }
    }
    var global = null;
    document.addEventListener('click', function(e) {
        if (!global) 
            return;
        if (global.button.contains(e.target)) 
            return;
        if (global.element.contains(e.target)) 
            return;
        // if (document.body.style.position === 'fixed')
        //     return;
        global.close();
    }, true);
    return function(button, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.template = _settings.template ?? '.popover-template';
        setting.placement = _settings.placement ?? 'bottom';
        setting.preventDefault = _settings.preventDefault ?? false;
        setting.stopPropagation = _settings.stopPropagation ?? false;
        var templateHTML = document.querySelector(setting.template).innerHTML;

        var ref = {
            close,
            onInit: null
        };

        var element = null;
        function open() {
            if (!element) {
                var html = templateHTML;
                var attrs = button.attributes;
                for (var i = 0; i < attrs.length; i++) {
                    var attr = attrs[i];
                    if (attr.name.startsWith('data-')) {
                        html = html.replace('__' + attr.name + '__', attr.value);
                    }
                }
                element = createElement(html);
                global = {
                    button: button,
                    element: element,
                    close: close
                };
                if (ref.onInit) {
                    ref.onInit(element);
                }
                document.body.appendChild(element);
                var position = getPosition(setting.placement, button, element);
                
                var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                var scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
                element.style.transform = 'translate3d(' + (position[0] + scrollLeft) + 'px, ' + (position[1] + scrollTop) + 'px, 0px)';
            }
        }
        function close() {
            if (element) {
                remove(element);
                element = null;
                global = null;
            }
        }
        button.addEventListener('click', function (e) {
            if (setting.preventDefault)
                e.preventDefault();
            if (setting.stopPropagation)
                e.stopPropagation();
            if (!element) {
                open();
                return;
            }
            close();
        });
        return ref;
    };
})();