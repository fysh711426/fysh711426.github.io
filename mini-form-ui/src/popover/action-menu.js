var actionMenu = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    var itemTemplate = `
        <div class="action-menu-item"></div>`;
    var iconTemplate = `
        <span class="action-menu-item-icon">
            <i class="__data-icon__"></i>
        </span>`;
    var nameTemplate = `
        <span class="action-menu-item-text">__data-name__</span>`;
    // var trailingTemplate = `
    //     <span class="action-menu-item-trailing">
    //         <i class="fa-solid fa-check fa-fw"></i>
    //     </span>`;
    var separatorTemplate = `
        <div class="separator"></div>`;
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
                // var selected = item.selected ?? false;
                var _class = item.class ?? '';
                var onClick = item.onClick ?? null;
                
                if (type === 'separator') {
                    var separatorElement = createElement(separatorTemplate);
                    menu.appendChild(separatorElement);
                    continue;
                }
                var itemElement = createElement(itemTemplate);
                if (icon) {
                    var iconElement = createElement(
                        iconTemplate.replace('__data-icon__', icon));
                    itemElement.appendChild(iconElement);
                }
                if (true) {
                    var nameElement = createElement(
                        nameTemplate.replace('__data-name__', name));
                    itemElement.appendChild(nameElement);
                }
                // if (selected) {
                //     var trailingElement = createElement(trailingTemplate);
                //     itemElement.appendChild(trailingElement);
                //     itemElement.classList.add('selected');
                // }
                if (_class) {
                    itemElement.classList.add(
                        ..._class.trim().split(' '));
                }
                if (onClick) {
                    (function () {
                        var _onClick = onClick;
                        itemElement.addEventListener('click', function() {
                            _popover.close();
                            _onClick(itemElement);
                        });
                    })();
                }
                menu.appendChild(itemElement);
            }
        }
    };
})();