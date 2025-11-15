/**
 * Signup Page Script
 * Handles user registration with validation and authentication
 */
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('signupPassword');
    const emailInput = document.getElementById('signupEmail');

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.classList.remove('show', 'hide');
            }, 300);
        }, 4000);
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        const bars = document.querySelectorAll('.strength-bar');
        const text = document.querySelector('.strength-text');
        
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        
        // Reset bars
        bars.forEach(bar => {
            bar.classList.remove('active', 'weak', 'fair', 'good', 'strong');
        });
        
        // Update bars based on strength
        let strengthClass = '';
        let strengthText = 'Password strength';
        
        if (strength === 0) {
            strengthText = 'Too weak';
            strengthClass = 'weak';
        } else if (strength <= 2) {
            for (let i = 0; i < 2; i++) {
                bars[i].classList.add('active', 'weak');
            }
            strengthText = 'Weak';
            strengthClass = 'weak';
        } else if (strength === 3) {
            for (let i = 0; i < 3; i++) {
                bars[i].classList.add('active', 'fair');
            }
            strengthText = 'Fair';
            strengthClass = 'fair';
        } else if (strength === 4) {
            for (let i = 0; i < 4; i++) {
                bars[i].classList.add('active', 'good');
            }
            strengthText = 'Good';
            strengthClass = 'good';
        } else {
            bars.forEach(bar => {
                bar.classList.add('active', 'strong');
            });
            strengthText = 'Strong';
            strengthClass = 'strong';
        }
        
        text.textContent = strengthText;
        text.className = `strength-text ${strengthClass}`;
        
        return strength;
    }

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Real-time password strength
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }

    // Real-time email validation
    if (emailInput) {
        emailInput.addEventListener('blur', (e) => {
            const value = e.target.value.trim();
            const group = e.target.closest('.input-group');
            const validationMsg = group.querySelector('.validation-message');
            
            if (value && !validateEmail(value)) {
                group.classList.add('error');
                group.classList.remove('success');
                if (validationMsg) {
                    validationMsg.textContent = 'Please enter a valid email address';
                    validationMsg.classList.add('show');
                }
            } else if (value) {
                group.classList.remove('error');
                group.classList.add('success');
                if (validationMsg) {
                    validationMsg.classList.remove('show');
                }
            }
        });
    }

    // Password toggle functionality
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                if (eyeOpen) eyeOpen.style.display = 'none';
                if (eyeClosed) eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                if (eyeOpen) eyeOpen.style.display = 'block';
                if (eyeClosed) eyeClosed.style.display = 'none';
            }
        });
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';

        try {
            const firstName = document.getElementById('signupFullName').value.trim();
            const lastName = document.getElementById('signupLastName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const fullName = lastName ? `${firstName} ${lastName}` : firstName;

            // Validate inputs
            if (!firstName) {
                throw new Error('Please enter your first name');
            }

            if (!email) {
                throw new Error('Please enter your email address');
            }

            if (!validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            const strength = checkPasswordStrength(password);
            if (strength < 2) {
                throw new Error('Please choose a stronger password');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const agreeCheckbox = document.getElementById('agree');
            if (!agreeCheckbox.checked) {
                throw new Error('Please agree to the Terms & Conditions');
            }

            // Use our custom auth client
            console.log('Attempting signup for:', email);
            showNotification('Creating your account...', 'info');
            
            const result = await window.swapitAuth.signUp(email, password, fullName);
            console.log('Signup result:', result);

            if (!result.success) {
                throw new Error(result.message || 'Failed to create account');
            }

            showNotification('Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = error.message || 'Failed to create account. Please try again.';
            
            // Provide more helpful error messages
            if (errorMessage === 'Failed to fetch') {
                errorMessage = 'Cannot connect to server. Please ensure the development server is running.';
            }
            
            showNotification(errorMessage, 'error');
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    });

    // Add input animations on focus
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.input-group').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.closest('.input-group').classList.remove('focused');
            }
        });
    });
});
