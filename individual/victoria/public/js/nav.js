// Navigation scroll behavior
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('nav--hidden');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('nav--hidden')) {
        // Scrolling down
        nav.classList.add('nav--hidden');
    } else if (currentScroll < lastScroll && nav.classList.contains('nav--hidden')) {
        // Scrolling up
        nav.classList.remove('nav--hidden');
    }
    
    lastScroll = currentScroll;
});