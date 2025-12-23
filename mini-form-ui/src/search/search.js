var searchBar = (function () {
    return function(selector) {
        var block = document.querySelector(selector);
        var box = block.querySelector('.search-box');
        var input = block.querySelector('.search-input');
        var inputBox = block.querySelector('.search-input-box');
        var backBtn = block.querySelector('.search-back-button');
        var toggleBtn = block.querySelector('.search-toggle-button');
        var clearBtn = block.querySelector('.search-clear-button');
        var searchBtn = block.querySelector('.search-button');
        
        var ref = {
            init: init,
            onToggle : null,
            onSearch: null
        };

        var isOpen = false;
        function init(_text, _isOpen) {
            var text = _text ?? '';
            isOpen = _isOpen ?? false;

            input.value = text;
            onInput();
            box.classList.remove('show');
            if (isOpen) {
                box.classList.add('show');
            }
        }
        function toggle() {
            isOpen = !isOpen;
            if (isOpen) {
                box.classList.add('show');
                input.focus();
            }
            else {
                box.classList.remove('show');
            }
            if (ref.onToggle) {
                ref.onToggle(isOpen);
            }
        }
        function clear() {
            input.value = '';
            onInput();
            input.focus();
        }
        function search() {
            if (ref.onSearch) {
                ref.onSearch(input.value);
            }
        }

        var onInput = (function () {
            var _display  = clearBtn.style.display;
            return function () {
                if (input.value) {
                    clearBtn.style.display = _display;
                }
                else {
                    clearBtn.style.display = 'none';
                }
            };
        })();
        onInput();
        
        // input.addEventListener('focus', () => {
        //     inputBox.classList.add('focus');
        // });
        // input.addEventListener('blur', () => {
        //     inputBox.classList.remove('focus');
        // });

        clearBtn.addEventListener('click', () => {
            clear();
        });
        backBtn.addEventListener('click', () => {
            toggle();
        });
        toggleBtn.addEventListener('click', () => {
            toggle();
        });

        searchBtn.addEventListener('click', () => {
            search();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                search();
            }
        });

        input.addEventListener('input', (e) => {
            onInput();
        });
        return ref;
    };
})();