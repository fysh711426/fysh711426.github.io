var onThemeChange = null;
function checkTheme() {
    var prev = null;
    function setTheme(theme) {
        if (prev) {
            document.body.classList.remove(prev);
        }
        document.body.setAttribute('theme', theme);
        document.body.classList.add(theme);
        prev = theme;
    }
    var theme = localStorage.getItem('THEME');
    if (!theme) {
        var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        theme = darkQuery.matches ? "dark" : "light";
    }
    setTheme(theme);
    onThemeChange = function(newTheme) {
        var theme = localStorage.getItem('THEME');
        if (newTheme !== theme) {
            localStorage.setItem('THEME', newTheme);
        }
        setTheme(newTheme);
    };
}

var onTextThemeChange = null;
function checkTextTheme() {
    var prev = null;
    function setTheme(theme) {
        if (prev) {
            document.body.classList.remove(prev);
        }
        document.body.setAttribute('text-theme', theme);
        document.body.classList.add(theme);
        prev = theme;
    }
    var theme = localStorage.getItem('TEXT_THEME');
    if (!theme) {
        theme = localStorage.getItem('THEME');
        if (!theme) {
            var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
            theme = darkQuery.matches ? "dark" : "light";
        }
        theme = 'text-' + theme;
    }
    setTheme(theme);
    onTextThemeChange = function(newTheme) {
        var theme = localStorage.getItem('TEXT_THEME');
        if (newTheme !== theme) {
            localStorage.setItem('TEXT_THEME', newTheme);
        }
        setTheme(newTheme);
    };
}