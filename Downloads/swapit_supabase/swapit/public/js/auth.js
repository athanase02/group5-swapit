// Toggle password visibility
document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            toggle.classList.toggle('active');
        });
    });
});

// Check authentication state
async function checkAuth() {
    try {
        // Wait for Supabase client to be ready if it's initializing
        if (typeof window.SUPABASE_READY !== 'undefined') {
            const r = await window.SUPABASE_READY;
            if (r?.error) throw r.error;
        }

        const { data } = await window.supabase.auth.getUser();
        const user = data?.user || null;
        const p = window.location.pathname;
        if (user && (p.endsWith('/login.html') || p.endsWith('/signup.html') || p.endsWith('/index.html') || p === '/')) {
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        console.warn('auth check failed', err?.message || err);
    }
}

// Run auth check when page loads
checkAuth();