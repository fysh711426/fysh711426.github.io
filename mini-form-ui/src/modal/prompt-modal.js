var promptModal = (function () {
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
        _setting.cancelText = settings.cancelText ?? 'Cancel';
        _setting.confirmText = settings.confirmText ?? 'Confirm';
        _setting.cancelClass = settings.cancelText ?? 'light';
        _setting.confirmClass = settings.confirmClass ?? 'dark';
        _setting.showSeparator  = settings.showSeparator ?? false;
        _setting.showCloseButton  = settings.showCloseButton ?? false;
        _setting.className = settings.className ?? '';
        _setting.size = settings.size ?? '';
        _setting.btnSize = settings.btnSize ?? '';
        _setting.input = {};
        var input = settings.input ?? {};
        _setting.input.textarea = input.textarea ?? false;
        _setting.input.value = input.value ?? '';
        _setting.input.placeholder = input.placeholder ?? '';
        _setting.input.required = input.required ?? false;

        var titleTemplate = _setting.title ? `
        <div class="modal-header-title">
            <span>${_setting.title}</span>
        </div>
        ` : '';

        var bodyFirst = !_setting.title ? 'first' : '';
        var contentTemplate = _setting.content ? `
        <div class="modal-body ${bodyFirst}">
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

        var formLast = !settings.showSeparator ? 'last' : '';
        var formFirst = !_setting.title && !_setting.content ? 'first' : '';
        var inputTemplate = `
        <input type="text" value="${_setting.input.value}" placeholder="${_setting.input.placeholder}" name="input" />`;
        if (_setting.input.textarea) {
            inputTemplate = `
            <textarea placeholder="${_setting.input.placeholder}" name="input">${_setting.input.value}</textarea>`;
        }

        var template = createElement(`
        <div class="modal-template">
            <div class="modal-backdrop">
                <div class="modal ${_setting.size} ${_setting.className}">
                    <div class="modal-block">
                        ${headerTemplate}
                        <div class="modal-scrollable">
                            ${contentTemplate}
                            <div class="modal-form ${formFirst} ${formLast}">
                                <div class="modal-form-field first">
                                    ${inputTemplate}
                                </div>
                            </div>
                            ${separatorTemplate}
                            <div class="modal-footer">
                                <button type="button" data-close="cancel" class="modal-button ${_setting.btnSize} ${_setting.cancelClass}">
                                    <span>${_setting.cancelText}</span>
                                </button>
                                <button type="button" data-close="confirm" class="modal-button ${_setting.btnSize} ${_setting.confirmClass}">
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
        
        var _value = '';
        var _modal = modal(template, _setting);
        _modal.onOpened = function (ele) {
            var input = ele.querySelector('[name=input]');
            var button = ele.querySelector('[data-close=confirm]');
            function onInput() {
                if (_setting.input.required) {
                    button.removeAttribute('disabled');
                    if (!input.value) {
                        button.setAttribute('disabled', '');
                    }
                }
                _value = input.value;
            }
            onInput();
            input.addEventListener('input', onInput);
            if (!_setting.input.textarea) {
                input.addEventListener('keydown', (e) => {
                    if (e.isComposing)
                        return;
                    if (e.key === 'Enter' && !e.shiftKey) {
                        button.click();
                    }
                });
            }
            input.focus();
            if (ref.onOpened) {
                ref.onOpened(ele);
            }
        }
        _modal.onClosed = function (ele, action) {
            if (ref.onClosed) {
                var val = _value;
                if (action !== 'confirm') {
                    val = '';
                }
                ref.onClosed(ele, action, val);
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