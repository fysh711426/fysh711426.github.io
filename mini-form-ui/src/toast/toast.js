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
        show: function(text) {
            text = text || '';
            var templateHTML = `
                <div class="toast-block">
                    <div class="toast-inner">__data-content__</div>
                </div>
            `;
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
                    element.className = element.className + ' show';
                    setTimeout(function() {
                        if (element === global) {
                            remove(global);
                            element = null;
                        }
                    }, 3000);
                }, 1);
            })(element);
        }
    };
})();