// Client-side filtering for public/browse.html
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('itemsGrid');
  if (!grid) return;

  function escapeHtml(str){
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]);
  }

  const cards = Array.from(grid.querySelectorAll('.card'));
  // Load any locally-saved pending listings (from add-listing fallback)
  try {
    const pending = JSON.parse(localStorage.getItem('swapit_pending_items')||'[]');
    if (pending && pending.length) {
      pending.forEach(p => {
        const art = document.createElement('article');
        art.className = 'card';
        art.dataset.category = p.category || '';
        art.dataset.price = String(p.price || 0);
        art.dataset.location = p.location || '';
        art.dataset.title = p.title || '';
        art.innerHTML = `<img class="card__thumb" src="${p.image_url || 'https://placehold.co/400x300?text=Listing'}" alt=""><h3>${escapeHtml(p.title || 'Listing')}</h3><p>${escapeHtml(p.description || '')}</p><div class="card__meta">GHS ${p.price || 0} — ${p.location || ''}</div>`;
        grid.appendChild(art);
        cards.push(art);
      });
    }
  } catch(e) {
    console.warn('Could not load pending items', e);
  }
  const filterCategory = document.getElementById('filterCategory');
  const filterLocation = document.getElementById('filterLocation');
  const filterMin = document.getElementById('filterMin');
  const filterMax = document.getElementById('filterMax');
  const sortBy = document.getElementById('sortBy');
  const pageSearch = document.getElementById('pageSearch');

  function parsePrice(card) {
    const v = card.dataset.price;
    return v ? parseFloat(v) : NaN;
  }

  function matches(card) {
    const cat = filterCategory.value;
    const loc = filterLocation.value;
    const min = parseFloat(filterMin.value);
    const max = parseFloat(filterMax.value);
    const q = pageSearch.value.trim().toLowerCase();

    if (cat && card.dataset.category !== cat) return false;
    if (loc && card.dataset.location !== loc) return false;

    const price = parsePrice(card);
    if (!isNaN(min) && price < min) return false;
    if (!isNaN(max) && price > max) return false;

    if (q) {
      const title = (card.dataset.title || '').toLowerCase();
      const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
      if (!title.includes(q) && !desc.includes(q)) return false;
    }

    return true;
  }

  function render() {
    // Sort cards copy
    let visible = cards.slice().filter(matches);

    const sortVal = sortBy.value;
    if (sortVal === 'price-low') visible.sort((a,b)=> parsePrice(a) - parsePrice(b));
    if (sortVal === 'price-high') visible.sort((a,b)=> parsePrice(b) - parsePrice(a));

    // Clear grid and append visible
    grid.innerHTML = '';
    if (visible.length === 0) {
      grid.innerHTML = '<div style="padding:24px;color:#cbd6ff">No items found — try changing filters.</div>';
      return;
    }
    visible.forEach(c => grid.appendChild(c));
  }

  // Wire events
  [filterCategory, filterLocation, filterMin, filterMax, sortBy].forEach(el => {
    if (!el) return;
    el.addEventListener('change', render);
    el.addEventListener('input', render);
  });

  pageSearch.addEventListener('input', debounce(render, 250));

  // Also wire header search (nav) if present
  const navSearch = document.querySelector('.nav__search input');
  if (navSearch) {
    navSearch.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter') {
        pageSearch.value = navSearch.value;
        render();
      }
    });
  }

  // initial render
  render();

  // debounce helper
  function debounce(fn, wait){
    let t;
    return (...args)=>{
      clearTimeout(t);
      t = setTimeout(()=>fn(...args), wait);
    };
  }
});
