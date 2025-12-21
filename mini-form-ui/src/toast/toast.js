var toast = (function () {
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
    var global = null;
    return {
        show: function(text, _settings) {
            var setting = {};
            _settings = _settings ?? {};
            setting.template = _settings.template ?? '.toast-template';
            setting.delay = _settings.delay ?? 3000;
            
            text = text ?? '';
            var templateHTML = document.querySelector(setting.template).innerHTML;
            var html = templateHTML;
            html = html.replace('__data-content__', text);
            if (global) {
                remove(global);
            }
            var element = createElement(html);

            document.body.appendChild(element);
            global = element;
            (function(element) {
                setTimeout(function() {
                    element.classList.add('show');
                    setTimeout(function() {
                        if (element === global) {
                            remove(global);
                            element = null;
                        }
                    }, setting.delay);
                }, 1);
            })(element);
        }
    };
})();