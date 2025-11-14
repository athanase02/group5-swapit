/**
 * Cart Management System
 * Handles shopping cart and wishlist functionality using localStorage
 */

/**
 * Updates the cart badge counter in the navigation
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('swapit_cart')||'[]');
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    countEl.textContent = total;
    countEl.style.display = total > 0 ? 'flex' : 'none';
  }
}

/**
 * Updates the wishlist badge counter in the navigation
 */
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem('swapit_wishlist')||'[]');
  const countEl = document.getElementById('wishlistCount');
  if (countEl) {
    countEl.textContent = wishlist.length;
    countEl.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }
}

/**
 * Displays a toast notification message to the user
 * @param {string} message - The message to display
 */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#7ef9ff;color:#0a0b10;padding:12px 24px;border-radius:8px;font-weight:600;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);animation:slideIn 0.3s ease';
  document.body.appendChild(notification);
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
  document.head.appendChild(style);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Export cart and wishlist functions for cross-page access
 */
window.updateCartCount = updateCartCount;
window.updateWishlistCount = updateWishlistCount;
window.showNotification = showNotification;

document.addEventListener('DOMContentLoaded', ()=>{
  /**
   * Initialize badge counters on page load
   */
  updateCartCount();
  updateWishlistCount();
  
  const grid = document.getElementById('itemsGrid');
  /**
   * Dynamically add cart and wishlist buttons to item cards
   */
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
      
      /**
       * Create container for action buttons
       */
      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '8px';
      btnContainer.style.marginTop = '8px';
      
      /**
       * Create "Add to Cart" button
       */
      const cartBtn = document.createElement('button');
      cartBtn.textContent = 'Add to cart';
      cartBtn.className = 'btn';
      cartBtn.style.flex = '1';
      cartBtn.addEventListener('click', ()=>{
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
        if (window.showNotification) {
          window.showNotification(item.title + ' added to cart!');
        }
        // Update cart badge counter
        if (window.updateCartCount) window.updateCartCount();
        window.dispatchEvent(new Event('storage'));
      });
      
      /**
       * Create "Wishlist" button with heart icon
       */
      const likeBtn = document.createElement('button');
      likeBtn.innerHTML = '♡';
      likeBtn.className = 'btn btn--icon';
      likeBtn.style.padding = '8px 12px';
      likeBtn.style.fontSize = '1.2rem';
      likeBtn.dataset.itemId = card.dataset.id;
      
      /**
       * Check if item is already in wishlist and update button state
       */
      const wishlist = JSON.parse(localStorage.getItem('swapit_wishlist')||'[]');
      if (wishlist.find(w => w.id === card.dataset.id)) {
        likeBtn.innerHTML = '♥';
        likeBtn.style.color = '#ff7df2';
      }
      
      likeBtn.addEventListener('click', ()=>{
        const item = {
          id: card.dataset.id,
          title: card.dataset.title || card.querySelector('h3')?.textContent || 'Item',
          price: parseFloat(card.dataset.price) || 0,
          location: card.dataset.location || '',
          img: card.querySelector('img')?.src || ''
        };
        let wishlist = JSON.parse(localStorage.getItem('swapit_wishlist')||'[]');
        const exists = wishlist.find(w=>w.id === item.id);
        
        if (exists) {
          /**
           * Item exists - remove from wishlist
           */
          wishlist = wishlist.filter(w => w.id !== item.id);
          likeBtn.innerHTML = '♡';
          likeBtn.style.color = '';
          if (window.showNotification) {
            window.showNotification(item.title + ' removed from wishlist');
          }
        } else {
          /**
           * Item doesn't exist - add to wishlist
           */
          wishlist.push(item);
          likeBtn.innerHTML = '♥';
          likeBtn.style.color = '#ff7df2';
          if (window.showNotification) {
            window.showNotification(item.title + ' added to wishlist!');
          }
        }
        
        localStorage.setItem('swapit_wishlist', JSON.stringify(wishlist));
        if (window.updateWishlistCount) window.updateWishlistCount();
        window.dispatchEvent(new Event('storage'));
      });
      
      btnContainer.appendChild(cartBtn);
      btnContainer.appendChild(likeBtn);
      footer.appendChild(btnContainer);
    });
  }

  // Render cart items if on cart page
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
        const removedItem = cart[i];
        cart.splice(i,1);
        localStorage.setItem('swapit_cart', JSON.stringify(cart));
        if (window.showNotification) {
          window.showNotification(removedItem.title + ' removed from cart');
        }
        if (window.updateCartCount) window.updateCartCount();
        window.dispatchEvent(new Event('storage'));
        renderCart(container);
        updateCartSummary();
      });
      row.appendChild(qty);
      row.appendChild(remove);
      container.appendChild(row);
    });
    updateCartSummary();
  }

  /**
   * Calculates and displays the cart summary with individual item totals
   */
  function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('swapit_cart')||'[]');
    const summaryEl = document.getElementById('cartSummary');
    if (!summaryEl) return;
    
    let html = '<h3 style="margin-bottom:1rem">Order Summary</h3>';
    let total = 0;
    
    cart.forEach(item => {
      const qty = item.qty || 1;
      const itemTotal = item.price * qty;
      total += itemTotal;
      html += `
        <div class="summary-row">
          <span>${item.title} (${qty} day${qty > 1 ? 's' : ''})</span>
          <span>GHS ${itemTotal.toFixed(2)}</span>
        </div>
      `;
    });
    
    html += `
      <div class="summary-row summary-total">
        <span>Total</span>
        <span>GHS ${total.toFixed(2)}</span>
      </div>
    `;
    
    summaryEl.innerHTML = html;
  }

  // Initialize cart summary on page load
  if (document.getElementById('cartSummary')) {
    updateCartSummary();
  }
});
