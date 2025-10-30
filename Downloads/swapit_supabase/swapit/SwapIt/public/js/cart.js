// js/cart.js — lightweight cart stored in localStorage
document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('itemsGrid');
  // Add Add-to-cart buttons to browse cards
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.card'));
    cards.forEach((card, idx) => {
      if (!card.dataset.id) card.dataset.id = 'item-' + idx + '-' + (card.dataset.title||'').replace(/\s+/g,'-').toLowerCase();
      let footer = card.querySelector('.card__meta');
      if (!footer) {
        footer = document.createElement('div');
        footer.className = 'card__meta';
        card.appendChild(footer);
      }
      const btn = document.createElement('button');
      btn.textContent = 'Add to cart';
      btn.className = 'btn';
      btn.style.marginTop = '8px';
      btn.addEventListener('click', ()=>{
        const item = {
          id: card.dataset.id,
          title: card.dataset.title || card.querySelector('h3')?.textContent || 'Item',
          price: parseFloat(card.dataset.price) || 0,
          location: card.dataset.location || '',
          img: card.querySelector('img')?.src || ''
        };
        const cart = JSON.parse(localStorage.getItem('swapit_cart')||'[]');
        const exists = cart.find(c=>c.id === item.id);
        if (exists) {
          exists.qty = (exists.qty||1) + 1;
        } else {
          item.qty = 1;
          cart.push(item);
        }
        localStorage.setItem('swapit_cart', JSON.stringify(cart));
        alert(item.title + ' added to cart');
      });
      footer.appendChild(btn);
    });
  }

  // If on cart page, render items
  const cartList = document.getElementById('cartList');
  if (cartList) renderCart(cartList);

  function renderCart(container) {
    const cart = JSON.parse(localStorage.getItem('swapit_cart')||'[]');
    container.innerHTML = '';
    if (!cart.length) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
    cart.forEach((it, i)=>{
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '12px';
      row.style.marginBottom = '12px';
      row.innerHTML = `<img src="${it.img}" style="width:84px;height:64px;object-fit:cover;border-radius:6px" alt=""><div style="flex:1"><strong>${it.title}</strong><div>GHS ${it.price} / day</div></div>`;
      const qty = document.createElement('input');
      qty.type = 'number'; qty.min = 1; qty.value = it.qty || 1; qty.style.width = '64px';
      qty.addEventListener('change', ()=>{
        const cart = JSON.parse(localStorage.getItem('swapit_cart')||'[]');
        cart[i].qty = parseInt(qty.value) || 1;
        localStorage.setItem('swapit_cart', JSON.stringify(cart));
        renderCart(container);
      });
      const remove = document.createElement('button');
      remove.className = 'btn'; remove.textContent = 'Remove';
      remove.addEventListener('click', ()=>{
        const cart = JSON.parse(localStorage.getItem('swapit_cart')||'[]');
        cart.splice(i,1);
        localStorage.setItem('swapit_cart', JSON.stringify(cart));
        renderCart(container);
      });
      row.appendChild(qty);
      row.appendChild(remove);
      container.appendChild(row);
    });
  }
});
