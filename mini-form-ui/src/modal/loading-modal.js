var loadingModal = (function () {
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
        _setting.content = settings.content ?? '';
        _setting.className = settings.className ?? '';
        _setting.size = settings.size ?? 'modal-xs';
        _setting.contentSize = settings.contentSize ?? 'text-base';
        _setting.showSpinner = settings.showSpinner ?? true;

        var spinnerTemplate = _setting.showSpinner ? `
            <span class="modal-loading-spinner">
                <i class="fa-solid fa-spinner fa-spin-pulse"></i>
            </span>` : '';
        
        var template = createElement(`
        <div class="modal-template">
            <div class="modal-backdrop">
                <div class="modal modal-loading ${_setting.size} ${_setting.className}">
                    <div class="modal-block">
                        <div class="modal-body ${_setting.contentSize}">
                            ${_setting.content} ${spinnerTemplate}
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