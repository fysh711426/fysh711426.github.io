var tooltip = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    function getPosition(placement, item, element) {
        var rect = item.getBoundingClientRect();
        if (placement === 'bottom') {
            var top = rect.top + rect.height + 5;
            var left = rect.left + rect.width / 2 - element.offsetWidth / 2 - 1;
            return [left, top];
        }
        if (placement === 'left') {
            var top = rect.top - (element.offsetHeight - rect.height) / 2 - 1;
            var left = rect.left - element.offsetWidth - 5;
            return [left, top];
        }
    }
    return function (selector, _settings) {
        var setting = {};
        _settings = _settings || {};
        setting.template = _settings.template || '.tooltip-template';
        setting.placement = _settings.placement || 'bottom';
        setting.container = _settings.container || 'body';
        var templateHTML = document.querySelector(setting.template).innerHTML;
        var items = document.querySelectorAll(selector);
        for (var i = 0; i < items.length; i++) {
            (function () {
                var item = items[i];
                var element = null;
                var itemHover = false;
                var elementHover = false;
                function mouseenter() {
                    if (!element) {
                        var html = templateHTML;
                        var attrs = item.attributes;
                        for (var i = 0; i < attrs.length; i++) {
                            var attr = attrs[i];
                            if (attr.name.startsWith('data-')) {
                                html = html.replace('__' + attr.name + '__', attr.value);
                            }
                        }
                        element = createElement(html);
                        if (setting.container === 'self') {
                            item.appendChild(element);
                        } else {
                            document.querySelector(setting.container)
                                .appendChild(element);
                        }
                        element.addEventListener('mouseenter', function() {
                            elementHover = true;
                        });
                        element.addEventListener('mouseleave', function() {
                            elementHover = false;
                            mouseleave();
                        });
                        var position = getPosition(setting.placement, item, element);
                        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                        element.style.transform = 'translate3d(' + (position[0] + scrollLeft) + 'px, ' + (position[1] + scrollTop) + 'px, 0px)';
                    }
                }
                function mouseleave() {
                    if (element) {
                        setTimeout(function() {
                            if (element) {
                                if (!itemHover && !elementHover) {
                                    if (setting.container === 'self') {
                                        item.removeChild(element);
                                    } else {
                                        document.querySelector(setting.container)
                                            .removeChild(element);
                                    }
                                    element = null;
                                }
                            }
                        }, 80);
                    }
                }
                item.addEventListener('mouseenter', function() {
                    itemHover = true;
                    mouseenter();
                });
                item.addEventListener('mouseleave', function() {
                    itemHover = false;
                    mouseleave();
                });
            })();
        }
    }
})();