window.addEventListener('scroll', function(){
    var scrollPositionY = window.pageYOffset;
    var header = document.querySelector('.header');
    header.style.transform = 'translateY(' + scrollPositionY * 0.25 + 'px)';
});