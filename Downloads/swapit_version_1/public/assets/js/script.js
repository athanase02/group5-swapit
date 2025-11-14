/**
 * Mobile Navigation Drawer Controller
 */
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');
if (navToggle && navDrawer) {
  const setOpen = (open) => {
    navDrawer.setAttribute('data-open', open ? 'true' : 'false');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  setOpen(false);
  navToggle.addEventListener('click', () => {
    const open = navDrawer.getAttribute('data-open') === 'true';
    setOpen(!open);
  });
  navDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setOpen(false); });
}

/**
 * Smooth Scroll for Anchor Links
 * Handles smooth scrolling to page sections with header offset
 */
(function smoothAnchor(){
  const header = document.getElementById('siteHeader');
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function topOf(el){
    const rect = el.getBoundingClientRect(), st = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + st - (header?.offsetHeight||0) - 12;
  }
  links.forEach(link=>{
    link.addEventListener('click', e=>{
      const id = link.getAttribute('href'), target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      window.scrollTo({ top: topOf(target), behavior: reduced ? 'auto' : 'smooth' });
      target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); setTimeout(()=>target.removeAttribute('tabindex'), 1000);
    });
  });
})();

/**
 * FAQ Accordion - Only one item open at a time
 */
document.querySelectorAll('.faq details').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) document.querySelectorAll('.faq details').forEach(o => { if (o !== d) o.open = false; });
  });
});

/**
 * Form Submission Handler
 * Simulates form submission with status feedback
 */
function fakeSubmit(form, statusEl, ok="Thanks! We'll be in touch."){
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    statusEl.textContent = 'Sending…';
    setTimeout(()=>{ statusEl.textContent = ok; form.reset(); }, 600);
  });
}
fakeSubmit(document.getElementById('supportForm'), document.getElementById('formStatus'));

/**
 * Account Dropdown Menu Toggle
 * @param {Event} event - Click event object
 */
function toggleAccountDropdown(event) {
  if (event) {
    event.stopPropagation();
  }
  const dropdown = document.querySelector('.account-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

/**
 * Close account dropdown when clicking outside of it
 */
document.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.account-dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.remove('active');
  }
});

fakeSubmit(document.getElementById('newsletterForm'), document.getElementById('newsStatus'), 'Subscribed 🎉');

// Update copyright year dynamically
document.getElementById('year').textContent = new Date().getFullYear();
