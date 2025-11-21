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
        
        const errorMessage = document.getElementById('errorMessage');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Hide any previous errors
        errorMessage.style.display = 'none';
        
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

            // Redirect to dashboard on success
            window.location.href = 'dashboard.html';
        } catch (error) {
            errorMessage.textContent = error.message || 'Failed to log in. Please check your credentials.';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
