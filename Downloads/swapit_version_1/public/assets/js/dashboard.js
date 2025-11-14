/**
 * Dashboard Page Functionality
 * User dashboard with orders and listings management
 */
async function init() {
    try {
        // Wait for auth client to be ready
        await window.swapitAuth.waitForReady();

        // Force a fresh session check
        const sessionData = await window.swapitAuth.checkSession();
        
        console.log('Dashboard session check:', sessionData);

        // Check if user is authenticated
        if (!window.swapitAuth.isAuthenticated() || !sessionData) {
            console.log('Not authenticated, redirecting to login');
            window.location.href = 'login.html';
            return;
        }

        const user = window.swapitAuth.getUser();
        if (!user) {
            console.log('No user data, redirecting to login');
            window.location.href = 'login.html';
            return;
        }

        // Display welcome message with user's actual name
        const displayName = user.full_name || user.email.split('@')[0];
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeText = document.getElementById('welcomeText');
        
        if (welcomeTitle) {
            welcomeTitle.textContent = `Welcome back, ${displayName}!`;
        }
        if (welcomeText) {
            welcomeText.textContent = `Here's what's happening with your account today.`;
        }

        // Setup logout button
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await window.swapitAuth.signOut();
                window.location.href = 'home.html';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Failed to logout. Please try again.');
            }
        });
    } catch (err) {
        console.error('Dashboard initialization error:', err);
        window.location.href = 'login.html';
    }
}

/**
 * Initialize dashboard when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
