/**
 * Navigation Manager
 * Dynamically updates navigation based on authentication state
 */
class NavigationManager {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
    }

    async init() {
        // Wait for auth to be ready
        if (window.swapitAuth) {
            await window.swapitAuth.waitForReady();
            this.user = window.swapitAuth.getUser();
            this.isAuthenticated = window.swapitAuth.isAuthenticated();
        }
        this.updateNavigation();
    }

    updateNavigation() {
        const header = document.getElementById('siteHeader');
        if (!header) return;

        const navMenu = header.querySelector('.nav__menu');
        const navAuth = header.querySelector('.nav__auth');
        const navDrawer = document.getElementById('navDrawer');

        if (this.isAuthenticated && this.user) {
            // Authenticated navigation
            this.renderAuthenticatedNav(navMenu, navAuth, navDrawer);
        } else {
            // Public navigation
            this.renderPublicNav(navMenu, navAuth, navDrawer);
        }
    }

    renderAuthenticatedNav(navMenu, navAuth, navDrawer) {
        // Update desktop menu
        if (navMenu) {
            navMenu.innerHTML = `
                <a href="${this.getBasePath()}pages/dashboard.html">Dashboard</a>
                <a href="${this.getBasePath()}pages/browse.html">Browse</a>
                <a href="${this.getBasePath()}pages/requests.html">Requests</a>
                <a href="${this.getBasePath()}pages/add-listing.html">Add Listing</a>
                <a href="${this.getBasePath()}pages/wishlist.html">Wishlist</a>
                <a href="${this.getBasePath()}#news">News</a>
                <a href="${this.getBasePath()}#pricing">Plans</a>
            `;
        }

        // Update auth section with user profile dropdown
        if (navAuth) {
            const avatarUrl = this.user.avatar_url || '../assets/images/default-avatar.svg';
            const displayName = this.user.full_name || this.user.email.split('@')[0];
            
            navAuth.innerHTML = `
                <div class="nav__search">
                    <i class="fas fa-search"></i>
                    <input type="search" placeholder="Search items..." aria-label="Search items">
                </div>
                <div class="account-dropdown">
                    <button class="btn btn--primary account-dropdown-btn" onclick="toggleAccountDropdown(event)">
                        <img src="${avatarUrl}" alt="${displayName}" 
                             style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; margin-right: 8px;"
                             onerror="this.src='../assets/images/default-avatar.svg'">
                        ${displayName}
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="account-dropdown-menu">
                        <a href="${this.getBasePath()}pages/profile.html"><i class="fas fa-user"></i> Profile</a>
                        <a href="${this.getBasePath()}pages/dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="${this.getBasePath()}pages/cart.html"><i class="fas fa-shopping-cart"></i> Cart</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" id="navLogoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;

            // Setup logout handler
            setTimeout(() => {
                const logoutBtn = document.getElementById('navLogoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await this.handleLogout();
                    });
                }
            }, 100);
        }

        // Update mobile drawer
        if (navDrawer) {
            const avatarUrl = this.user.avatar_url || '../assets/images/default-avatar.png';
            const displayName = this.user.full_name || this.user.email.split('@')[0];
            
            navDrawer.innerHTML = `
                <div style="padding: 20px; border-bottom: 1px solid #1e2434; display: flex; align-items: center; gap: 12px;">
                    <img src="${avatarUrl}" alt="${displayName}" 
                         style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;"
                         onerror="this.src='../assets/images/default-avatar.svg'">
                    <div>
                        <div style="font-weight: 600;">${displayName}</div>
                        <div style="font-size: 0.875rem; color: #9aa5c3;">${this.user.email}</div>
                    </div>
                </div>
                <a href="${this.getBasePath()}pages/dashboard.html">Dashboard</a>
                <a href="${this.getBasePath()}pages/browse.html">Browse</a>
                <a href="${this.getBasePath()}pages/requests.html">Requests</a>
                <a href="${this.getBasePath()}pages/add-listing.html">Add Listing</a>
                <a href="${this.getBasePath()}pages/wishlist.html">Wishlist</a>
                <a href="${this.getBasePath()}pages/profile.html">Profile</a>
                <a href="${this.getBasePath()}pages/cart.html">Cart</a>
                <a href="${this.getBasePath()}#news">News</a>
                <a href="${this.getBasePath()}#pricing">Plans</a>
                <div class="nav__search">
                    <i class="fas fa-search"></i>
                    <input type="search" placeholder="Search items..." aria-label="Search items">
                </div>
                <div class="nav__auth" style="padding: 20px;">
                    <button id="mobileLogoutBtn" class="btn btn--outline w-100">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;

            // Setup mobile logout handler
            setTimeout(() => {
                const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
                if (mobileLogoutBtn) {
                    mobileLogoutBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        await this.handleLogout();
                    });
                }
            }, 100);
        }
    }

    renderPublicNav(navMenu, navAuth, navDrawer) {
        // Update desktop menu
        if (navMenu) {
            navMenu.innerHTML = `
                <a href="${this.getBasePath()}#home">Home</a>
                <a href="${this.getBasePath()}#how">How it works</a>
                <a href="${this.getBasePath()}#stories">Stories</a>
                <a href="${this.getBasePath()}#about-us">About Us</a>
                <a href="${this.getBasePath()}#pricing">Plans</a>
                <a href="${this.getBasePath()}#news">News</a>
                <a href="${this.getBasePath()}#faq">FAQ</a>
                <a href="${this.getBasePath()}#contact">Contact</a>
            `;
        }

        // Update auth section
        if (navAuth) {
            navAuth.innerHTML = `
                <div class="nav__search">
                    <i class="fas fa-search"></i>
                    <input type="search" placeholder="Search items..." aria-label="Search items">
                </div>
                <div class="nav__auth">
                    <div class="account-dropdown">
                        <button class="btn btn--primary account-dropdown-btn" onclick="toggleAccountDropdown(event)">
                            <i class="fas fa-user"></i>
                            Account
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="account-dropdown-menu">
                            <a href="${this.getBasePath()}pages/login.html"><i class="fas fa-sign-in-alt"></i> Login</a>
                            <a href="${this.getBasePath()}pages/signup.html"><i class="fas fa-user-plus"></i> Sign Up</a>
                        </div>
                    </div>
                </div>
            `;
        }

        // Update mobile drawer
        if (navDrawer) {
            navDrawer.innerHTML = `
                <a href="${this.getBasePath()}#home">Home</a>
                <a href="${this.getBasePath()}#how">How it works</a>
                <a href="${this.getBasePath()}#stories">Stories</a>
                <a href="${this.getBasePath()}#about-us">About Us</a>
                <a href="${this.getBasePath()}#pricing">Pricing</a>
                <a href="${this.getBasePath()}#news">News</a>
                <a href="${this.getBasePath()}#faq">FAQ</a>
                <a href="${this.getBasePath()}#contact">Contact</a>
                <div class="nav__search">
                    <i class="fas fa-search"></i>
                    <input type="search" placeholder="Search items..." aria-label="Search items">
                </div>
                <div class="nav__auth">
                    <a class="btn btn--outline w-100 mb-2" href="${this.getBasePath()}pages/login.html">Log in</a>
                    <a class="btn btn--primary w-100" href="${this.getBasePath()}pages/signup.html">Sign up</a>
                </div>
            `;
        }
    }

    async handleLogout() {
        try {
            await window.swapitAuth.signOut();
            // Redirect to home page (now in pages folder)
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    getBasePath() {
        // Determine if we're in a subdirectory
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return '../';
        }
        return '';
    }
}

// Initialize navigation manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        window.navManager = new NavigationManager();
        await window.navManager.init();
    });
} else {
    (async () => {
        window.navManager = new NavigationManager();
        await window.navManager.init();
    })();
}
