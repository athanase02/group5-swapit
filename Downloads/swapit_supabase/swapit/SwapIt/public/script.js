// Mobile drawer
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

document.querySelectorAll('.faq details').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) document.querySelectorAll('.faq details').forEach(o => { if (o !== d) o.open = false; });
  });
});

function fakeSubmit(form, statusEl, ok='Thanks! We’ll be in touch.'){
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    statusEl.textContent = 'Sending…';
    setTimeout(()=>{ statusEl.textContent = ok; form.reset(); }, 600);
  });
}
fakeSubmit(document.getElementById('supportForm'), document.getElementById('formStatus'));
fakeSubmit(document.getElementById('newsletterForm'), document.getElementById('newsStatus'), 'Subscribed 🎉');

document.getElementById('year').textContent = new Date().getFullYear();
