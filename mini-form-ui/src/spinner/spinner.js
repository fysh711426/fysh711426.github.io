var spinner = (function() {
    var innerHTML = `
        <div class="spinner-inner">
            <div class="spinner-layer layer-1">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
            <div class="spinner-layer layer-2">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
            <div class="spinner-layer layer-3">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
            <div class="spinner-layer layer-4">
                <div class="spinner-circle left">
                    <div class="spinner-circle-inner"></div>
                </div>
                <div class="spinner-circle right">
                    <div class="spinner-circle-inner"></div>
                </div>
            </div>
        </div>
    `;

    return function(selector) {
        var items = document.querySelectorAll(selector);
        for (var item of items) {
            item.innerHTML = innerHTML;
            item.classList.add('spinner');
        }
    };
})();