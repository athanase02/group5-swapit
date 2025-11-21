/**
 * Dashboard Page Functionality
 * User dashboard with orders and listings management - PERSONALIZED FOR LOGGED-IN USERS ONLY
 */
async function init() {
    try {
        // Wait for auth to be fully initialized
        await new Promise(resolve => {
            if (window.SWAPIT_AUTH_READY && window.swapitAuth) {
                resolve();
            } else {
                const checkAuth = setInterval(() => {
                    if (window.SWAPIT_AUTH_READY && window.swapitAuth) {
                        clearInterval(checkAuth);
                        resolve();
                    }
                }, 50);
            }
        });

        // Check session with server - REQUIRED FOR DASHBOARD ACCESS
        const user = await window.swapitAuth.checkSession();
        
        if (!user) {
            // Redirect to login if not authenticated - Dashboard is PRIVATE
            if (window.showToast) {
                window.showToast('Please login to access your dashboard', 'warning', 'Authentication Required');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                alert('Please login to access your dashboard');
                window.location.href = 'login.html';
            }
            return;
        }

        // Personalize dashboard with user data
        const userName = user.full_name || user.email.split('@')[0];
        document.getElementById('welcomeTitle').textContent = `Welcome back, ${userName}!`;
        document.getElementById('welcomeText').textContent = `Here's what's happening with your account today`;

        // Update user avatar if available
        const userAvatar = document.getElementById('userAvatar');
        if (user.avatar_url) {
            userAvatar.src = user.avatar_url;
        } else {
            // Show default initials avatar if no profile picture
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            userAvatar.style.display = 'none';
            const avatarContainer = userAvatar.parentElement;
            avatarContainer.innerHTML = `
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #7ef9ff, #5b7cfe); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #0a0b10; font-size: 0.9rem;">
                    ${initials}
                </div>
            `;
        }

        // Load user's personal data
        loadUserListings();
        loadUserStats();

        // Setup logout button
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await window.swapitAuth.signOut();
                if (window.showToast) {
                    window.showToast('You have been logged out successfully', 'success', 'Logged Out');
                    setTimeout(() => window.location.href = '../home.html', 1500);
                } else {
                    alert('Logged out successfully');
                    window.location.href = '../home.html';
                }
            } catch (error) {
                console.error('Logout error:', error);
                if (window.showToast) {
                    window.showToast('Failed to logout. Please try again.', 'error', 'Logout Failed');
                } else {
                    alert('Failed to logout. Please try again.');
                }
            }
        });
    } catch (err) {
        console.error('Dashboard initialization error:', err);
        window.location.href = 'login.html';
    }
}

/**
 * Load user's listings (personalized content)
 */
function loadUserListings() {
    const pendingItems = JSON.parse(localStorage.getItem('swapit_pending_items') || '[]');
    const container = document.getElementById('listingsContainer');
    
    if (pendingItems.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-box-open"></i>
            <p>You don't have any listings yet</p>
            <a href="add-listing.html" class="btn btn--primary" style="margin-top: 1rem;">
              <i class="fas fa-plus"></i>
              Create Your First Listing
            </a>
          </div>
        `;
        return;
    }

    container.innerHTML = '';
    pendingItems.forEach((item, index) => {
        const listingCard = document.createElement('div');
        listingCard.className = 'listing-card';
        listingCard.innerHTML = `
          <div class="listing-card-image">
            <img src="${item.image_url || 'https://placehold.co/400x300?text=No+Image'}" alt="${item.title}">
          </div>
          <div class="listing-card-content">
            <div class="listing-card-title">${item.title}</div>
            <div class="listing-card-meta">
              ${item.price > 0 ? 'GHS ' + item.price + '/day' : 'Free'} • ${item.location || 'No location'}
            </div>
            <span class="listing-status active">Active</span>
          </div>
          <div class="listing-card-actions">
            <button class="btn btn--secondary btn--sm" onclick="editListing(${index})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn--danger btn--sm" onclick="deleteListing(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        container.appendChild(listingCard);
    });
}

/**
 * Load user stats (personalized metrics)
 */
function loadUserStats() {
    const pendingItems = JSON.parse(localStorage.getItem('swapit_pending_items') || '[]');
    const cart = JSON.parse(localStorage.getItem('swapit_cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('swapit_wishlist') || '[]');
    
    document.getElementById('activeListings').textContent = pendingItems.length;
    document.getElementById('totalBorrows').textContent = cart.length;
    document.getElementById('itemsLent').textContent = wishlist.length;
    document.getElementById('userRating').textContent = '5.0';
}

/**
 * Edit listing
 */
window.editListing = function(index) {
    if (window.showToast) {
        window.showToast('Edit functionality coming soon!', 'info', 'Coming Soon');
    } else {
        alert('Edit functionality coming soon!');
    }
};

/**
 * Delete listing
 */
window.deleteListing = function(index) {
    if (confirm('Are you sure you want to delete this listing?')) {
        const items = JSON.parse(localStorage.getItem('swapit_pending_items') || '[]');
        const deletedItem = items[index];
        items.splice(index, 1);
        localStorage.setItem('swapit_pending_items', JSON.stringify(items));
        
        if (window.showToast) {
            window.showToast(deletedItem.title + ' deleted successfully', 'success', 'Listing Deleted');
        } else {
            alert('Listing deleted');
        }
        
        loadUserListings();
        loadUserStats();
    }
};

/**
 * Initialize dashboard when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
