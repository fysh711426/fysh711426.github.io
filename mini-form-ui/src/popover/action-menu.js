var actionMenu = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(button, _settings, items) {
        var setting = {};
        _settings = _settings ?? {};
        setting.template = _settings.template ?? '.action-menu-template';
        setting.placement = _settings.placement;
        setting.preventDefault = _settings.preventDefault;
        setting.stopPropagation = _settings.stopPropagation;

        var _popover = popover(button, setting);
        _popover.onInit = function(ele) {
            if (!items || items.length === 0) {
                return;
            }
            var menu = ele.querySelector('.action-menu');
            for (var item of items) {
                var type = item.type ?? ''
                var name = item.name ?? '';
                var icon = item.icon ?? '';
                var className = item.className ?? '';
                let onClick = item.onClick ?? null;
                
                if (type === 'separator') {
                    menu.appendChild(
                        createElement('<div class="separator"></div>'));
                    continue;
                }
                var innerHtml = '';
                if (icon) {
                    innerHtml += `
                    <span class="action-menu-item-icon">
                        <i class="${icon}"></i>
                    </span>`;
                }
                if (true) {
                    innerHtml += `
                    <span class="action-menu-item-text">${name}</span>`;
                }
                var outerHtml = 
                `<div class="action-menu-item ${className}">
                    ${innerHtml}
                </div>`;
                var itemElement = createElement(outerHtml);
                if (onClick) {
                    itemElement.addEventListener('click', function() {
                        _popover.close();
                        onClick(itemElement);
                    });
                }
                menu.appendChild(itemElement);
            }
        }
    };
})();