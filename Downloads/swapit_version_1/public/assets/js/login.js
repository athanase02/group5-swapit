/**
 * Login Page Script
 * Handles user authentication and session management
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Password toggle functionality
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email) {
                throw new Error('Please enter your email address');
            }

            if (!password) {
                throw new Error('Please enter your password');
            }

            // Use our custom auth client
            const result = await window.swapitAuth.signIn(email, password);

            if (!result.success) {
                throw new Error(result.message || 'Failed to log in');
            }

            // Verify session was established
            await new Promise(resolve => setTimeout(resolve, 100));
            const sessionCheck = await window.swapitAuth.checkSession();
            
            if (!sessionCheck) {
                throw new Error('Session not established. Please try again.');
            }

            // Show success notification and redirect
            showNotification('✓ Login successful! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            showNotification(error.message || 'Failed to log in. Please check your credentials.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
