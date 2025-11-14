/**
 * Reset Password Page Script
 * Handles password reset token validation and new password submission
 */
document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = resetForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const email = document.getElementById('resetEmail').value.trim();

            if (!email) {
                throw new Error('Please enter your email address');
            }

            // Use our custom auth client
            const result = await window.swapitAuth.resetPassword(email);

            if (!result.success) {
                throw new Error(result.message || 'Failed to send reset email');
            }

            alert('If that email exists, a password reset link was sent. Check your inbox.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(error.message || 'Could not send reset email. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
