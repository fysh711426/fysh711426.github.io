var fontFace = new FontFace(
    'huninn',
    'url(jf-openhuninn-1.0.ttf) format("woff2")');
fontFace.display = 'auto';
document.fonts.add(fontFace);
fontFace.load();
fontFace.load().then(function () {
    document.body.classList.add('loaded');
});

function toggle(e) {
    var children = e.nextElementSibling;
    var icon = e.previousElementSibling;
    if (children.classList.contains('show')) {
        children.classList.remove("show");
        icon.classList.remove("show");
    }
    else {
        children.classList.add("show");
        icon.classList.add("show");
    }
}