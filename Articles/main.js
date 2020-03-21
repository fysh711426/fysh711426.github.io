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