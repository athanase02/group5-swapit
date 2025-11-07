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

// Show error message
function showError(message, formId) {
    const form = document.getElementById(formId);
    let errorDiv = form.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Clear error message
function clearError(formId) {
    const form = document.getElementById(formId);
    const errorDiv = form.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Check authentication state
async function checkAuth() {
    try {
        const response = await fetch('../api/auth.php?action=check_auth');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Auth check failed');
        }

        const p = window.location.pathname;
        if (data.authenticated) {
            if (p.endsWith('/login.html') || p.endsWith('/signup.html') || p.endsWith('/index.html') || p === '/') {
                window.location.href = 'dashboard.html';
            }
        } else {
            if (!p.endsWith('/login.html') && !p.endsWith('/signup.html') && !p.endsWith('/index.html') && p !== '/') {
                window.location.href = 'login.html';
            }
        }
    } catch (err) {
        console.warn('Auth check failed:', err?.message || err);
    }
}

// Handle logout
async function logout() {
    try {
        const formData = new FormData();
        formData.append('action', 'logout');
        
        const response = await fetch('../api/auth.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            window.location.href = 'login.html';
        } else {
            throw new Error('Logout failed');
        }
    } catch (err) {
        console.error('Logout error:', err?.message || err);
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);