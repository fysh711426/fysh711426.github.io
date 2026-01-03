var dropdownMenu = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(button, _settings) {
        var setting = {};
        _settings = _settings ?? {};
        setting.template = _settings.template ?? '.dropdown-menu-template';
        setting.placement = _settings.placement;
        setting.preventDefault = _settings.preventDefault;
        setting.stopPropagation = _settings.stopPropagation;
        setting.enableSelect = _settings.enableSelect ?? true;
        var options = _settings.options ?? [];

        var ref = {
            getValue,
            setValue,
            onChange: null
        };

        var selected = null;
        function getValue() {
            if (!selected)
                return null;
            return selected.value;
        }
        function setValue(val) {
            selected = null;
            if (setting.enableSelect) {
                for(var item of options) {
                    if (item.value === val) {
                        selected = item;
                        return;
                    }
                }
            }
        }
        var _popover = popover(button, setting);
        _popover.onOpen = function(ele) {
            var menu = ele.querySelector('.dropdown-menu');
            for (var item of options) {
                var text = item.text ?? '';
                var icon = item.icon ?? '';
                var className = item.className ?? '';
                var separator = item.separator ?? false;
                let value = item.value;
                
                var innerHtml = '';
                if (icon) {
                    innerHtml += `
                    <span class="dropdown-menu-item-icon">
                        <i class="${icon}"></i>
                    </span>`;
                }
                if (true) {
                    innerHtml += `
                    <span class="dropdown-menu-item-text">${text}</span>
                    <span class="dropdown-menu-item-trailing">
                        <i class="fa-solid fa-check fa-fw"></i>
                    </span>`;
                }
                var outerHtml = 
                `<div class="dropdown-menu-item ${className}">
                    ${innerHtml}
                </div>`;
                var itemElement = createElement(outerHtml);
                if (value === getValue()) {
                    itemElement.classList.add('selected');
                }
                if (itemElement) {
                    itemElement.addEventListener('click', function() {
                        if (setting.enableSelect) {
                            setValue(value);
                            itemElement.classList.add('selected');
                        }
                        _popover.close();
                        if (ref.onChange) {
                            ref.onChange(itemElement, value);
                        }
                    });
                }
                if (separator) {
                    menu.appendChild(
                        createElement('<div class="separator"></div>'));
                }
                menu.appendChild(itemElement);
            }
        }
        return ref;
    };
})();