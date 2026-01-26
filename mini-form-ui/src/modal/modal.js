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
    return function(template, settings) {
        var _setting = {};
        settings = settings ?? {};
        _setting.singleton = settings.singleton ?? true;
        _setting.attrs = [];
        var data = settings.data ?? {};
        for (var [key, value] of Object.entries(data)) {
            _setting.attrs.push({
                name: key,
                value: value
            });
        }

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null,
            onClick: null,
            onReady: null,
            onCreate: null,
            onRemove: null
        };

        var _ = null;
        var isAnimating = false;
        function openAnim(block, backdrop, callback) {
            isAnimating = true;
            block.classList.add('opening');
            backdrop.classList.add('opening');
            // 觸發瀏覽器重繪
            _ = block.offsetHeight;
            block.style.marginTop = '0px';
            block.style.marginBottom = '0px';
            backdrop.style.opacity = '1';
            var handler = function (e) {
                if (e.target === e.currentTarget) {
                    block.classList.remove('opening');
                    block.classList.add('open');
                    block.style.marginTop = '';
                    block.style.marginBottom = '';
                    backdrop.classList.remove('opening');
                    backdrop.classList.add('open');
                    backdrop.style.opacity = '';
                    block.removeEventListener('transitionend', handler);
                    isAnimating = false;
                    callback();
                }
            }
            block.addEventListener('transitionend', handler);
        }
        function closeAnim(block, backdrop, callback) {
            isAnimating = true;
            // 觸發瀏覽器重繪
            _ = block.offsetHeight;
            block.classList.remove('open');
            block.classList.add('closing');
            backdrop.classList.remove('open');
            backdrop.classList.add('opening');
            var handler = function (e) {
                if (e.target === e.currentTarget) {
                    block.classList.remove('closing');
                    backdrop.classList.remove('opening');
                    block.removeEventListener('transitionend', handler);
                    isAnimating = false;
                    callback();
                }
            }
            block.addEventListener('transitionend', handler);
        }
        
        var element = null;
        function open() {
            if (isAnimating) 
                return;
            if (!element) {
                var html = template.innerHTML;
                for(var attr of _setting.attrs) {
                    html = html.replace('__data-' + attr.name + '__', attr.value);
                }
                if (ref.onCreate) {
                    element = ref.onCreate(html);
                } else {
                    element = createElement(html);
                }
                document.body.appendChild(element);
                if (_setting.singleton) {
                    template.innerHTML = '';
                }
                bodyScroll.lock();
                bindClose();
                bindClick();
                focusLastButton(element);
                if (ref.onOpened) {
                    ref.onOpened(element);
                }
                var block = element.querySelector('.modal-block');
                openAnim(block, element, function() {
                    requestAnimationFrame(function() {
                        if (ref.onReady) {
                            ref.onReady(element);
                        }
                    });
                });
            }
        }
        function close(action = '') {
            if (isAnimating) 
                return;
            if (element) {
                var block = element.querySelector('.modal-block');
                closeAnim(block, element, function() {
                    var html = element.outerHTML;
                    if (ref.onRemove) {
                        ref.onRemove(element);
                    } else {
                        remove(element);
                    }
                    element = null;
                    if (_setting.singleton) {
                        template.innerHTML = html;
                    }
                    bodyScroll.unlock();
                    if (ref.onClosed) {
                        ref.onClosed(element, action);
                    }
                });
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
        function focusLastButton(ele) {
            var buttons = ele.querySelectorAll('button');
            if (buttons && buttons.length > 0) {
                buttons[buttons.length - 1].focus();
            }
        }
        return ref;
    };
})();