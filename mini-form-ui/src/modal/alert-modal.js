var alertModal = (function () {
    function createElement(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        if (div.children.length > 0) {
            return div.children[0];
        }
    }
    return function(settings) {
        var _setting = {};
        settings = settings ?? {};
        _setting.singleton = false;
        _setting.title = settings.title ?? '';
        _setting.content = settings.content ?? '';
        _setting.confirmText = settings.confirmText ?? 'Confirm';
        _setting.confirmClass = settings.confirmClass ?? 'dark';
        _setting.showSeparator  = settings.showSeparator ?? true;
        _setting.showCloseButton  = settings.showCloseButton ?? true;
        _setting.className = settings.className ?? 'modal-sm';

        var titleTemplate = _setting.title ? `
        <div class="modal-header-title">
            <span>${_setting.title}</span>
        </div>
        ` : '';
        
        var top = !_setting.title ? 'top' : '';
        var contentTemplate = _setting.content ? `
        <div class="modal-body ${top}">
            <span>${_setting.content}</span>
        </div>` : '';

        var separatorTemplate = _setting.showSeparator ? `
        <div class="separator"></div>` : '';

        var closeButtonTemplate = _setting.showCloseButton ? `
        <button type="button" data-close="cancel" class="modal-icon-button square">
            <i class="fa-solid fa-xmark fa-fw"></i>
        </button>` : '';

        var headerTemplate = _setting.title ? `
        <div class="modal-header">
            <div class="start">
                ${titleTemplate}
            </div>
            <div class="end">
                ${closeButtonTemplate}
            </div>
        </div>` : '';

        var template = createElement(`
        <div class="modal-template">
            <div class="modal-backdrop">
                <div class="modal ${_setting.className}">
                    <div class="modal-block">
                        ${headerTemplate}
                        <div class="modal-scrollable">
                            ${contentTemplate}
                            ${separatorTemplate}
                            <div class="modal-footer">
                                <button type="button" data-close="confirm" class="modal-button ${_setting.confirmClass}">
                                    <span>${_setting.confirmText}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

        var ref = {
            open,
            close,
            onOpened: null,
            onClosed: null
        };
        
        var _modal = modal(template, _setting);
        _modal.onOpened = function (ele) {
            if (ref.onOpened) {
                ref.onOpened(ele);
            }
        }
        _modal.onClosed = function (ele, action) {
            if (ref.onClosed) {
                ref.onClosed(ele, action);
            }
        }
        function open() {
            _modal.open();
        }
        function close(action = '') {
            _modal.close(action);
        }
        return ref;
    };
})();