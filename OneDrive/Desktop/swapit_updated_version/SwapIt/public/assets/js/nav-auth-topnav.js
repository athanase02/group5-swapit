/**
 * Navigation Authentication State Manager for Topnav Pages
 * Dynamically updates navigation menu based on user authentication status
 * Used by: wishlist.html, cart.html, dashboard.html
 */

/**
 * Update Topnav Navigation Based on Authentication State
 */
async function updateTopnavAuthState() {
  try {
    // Wait for auth client to be ready
    if (!window.swapitAuth) {
      console.log('Auth client not ready yet');
      return;
    }

    const user = await window.swapitAuth.checkSession();
    const mainNavMenu = document.getElementById('mainNavMenu');
    
    if (!mainNavMenu) {
      console.log('Main nav menu not found');
      return;
    }

    if (user) {
      // User is LOGGED IN - show authenticated menu
      mainNavMenu.innerHTML = `
        <li><a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li><a href="browse.html"><i class="fas fa-search"></i> Browse Items</a></li>
        <li><a href="add-listing.html"><i class="fas fa-plus-circle"></i> Add Listing</a></li>
        <li><a href="wishlist.html"><i class="fas fa-heart"></i> Wishlist</a></li>
        <li><a href="cart.html"><i class="fas fa-shopping-cart"></i> Cart</a></li>
      `;
    } else {
      // User is LOGGED OUT - redirect to home page
      // These pages are for authenticated users only
      console.log('User not authenticated, redirecting to home...');
      window.location.href = '/public/home.html';
    }
  } catch (error) {
    console.error('Failed to update topnav auth state:', error);
    // On error, redirect to home page for safety
    window.location.href = '/public/home.html';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateTopnavAuthState);
} else {
  updateTopnavAuthState();
}
