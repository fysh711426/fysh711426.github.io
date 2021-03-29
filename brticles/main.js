// document.addEventListener("DOMContentLoaded", function () {
//     var container = document.querySelector("body");
//     container.classList.add('loaded');
// });

// window.addEventListener("load", function (event) {
//     var innerHeader = document.querySelector("#inner-header");
//     innerHeader.classList.add('loaded');
//     var innerBlocks = document.querySelectorAll(".inner-block");
//     for (let i = 0; i < innerBlocks.length; i++) {
//         innerBlocks[i].classList.add('loaded');
//     }
// });

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