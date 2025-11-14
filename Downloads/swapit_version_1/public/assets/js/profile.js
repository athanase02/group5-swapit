/**
 * Profile Page Functionality
 * User profile display and edit capabilities
 */
async function initProfile() {
    try {
        console.log('[Profile] Initializing profile page...');
        
        // Wait for auth client to be ready
        await window.swapitAuth.waitForReady();
        console.log('[Profile] Auth client ready');

        // Double-check session with backend
        const sessionData = await window.swapitAuth.checkSession();
        console.log('[Profile] Session check result:', sessionData);

        // Check authentication
        if (!window.swapitAuth.isAuthenticated() || !sessionData) {
            console.error('[Profile] Not authenticated, redirecting to login');
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to see logs
            window.location.href = 'login.html';
            return;
        }

        const user = window.swapitAuth.getUser();
        console.log('[Profile] User data:', user);
        
        if (!user) {
            console.error('[Profile] No user data, redirecting to login');
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to see logs
            window.location.href = 'login.html';
            return;
        }

        // Populate form with user data
        const displayName = user.full_name || user.email.split('@')[0];
        
        document.getElementById('profileName').textContent = displayName;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('fullName').value = user.full_name || '';
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('location').value = user.location || '';

        // Display avatar
        const avatarUrl = user.avatar_url || '../assets/images/default-avatar.svg';
        document.getElementById('avatar').src = avatarUrl;
        document.getElementById('avatar').onerror = function() {
            this.src = '../assets/images/default-avatar.svg';
        };

        let selectedAvatarFile = null;

        // Handle avatar file selection
        document.getElementById('avatarInput').addEventListener('change', (ev) => {
            const file = ev.target.files && ev.target.files[0];
            if (!file) return;
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select an image file', 'error');
                ev.target.value = '';
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image must be less than 5MB', 'error');
                ev.target.value = '';
                return;
            }
            
            selectedAvatarFile = file;
            
            // Show local preview
            const url = URL.createObjectURL(file);
            document.getElementById('avatar').src = url;
        });

        // Handle save profile button
        document.getElementById('saveProfile').addEventListener('click', async () => {
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const location = document.getElementById('location').value.trim();

            if (!fullName) {
                showNotification('Please enter your full name', 'error');
                return;
            }

            const saveBtn = document.getElementById('saveProfile');
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            try {
                const updates = {
                    full_name: fullName,
                    phone: phone,
                    location: location
                };

                // If avatar was changed, convert to base64
                if (selectedAvatarFile) {
                    const reader = new FileReader();
                    
                    const avatarDataUrl = await new Promise((resolve, reject) => {
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(selectedAvatarFile);
                    });
                    
                    updates.avatar_url = avatarDataUrl;
                }

                // Update profile
                const result = await window.swapitAuth.updateProfile(updates);

                if (result.success) {
                    showNotification('Profile updated successfully!', 'success');
                    selectedAvatarFile = null;
                    
                    // Update display name
                    document.getElementById('profileName').textContent = fullName;
                    
                    // Refresh navigation to update avatar
                    if (window.navManager) {
                        await window.navManager.init();
                    }
                } else {
                    throw new Error(result.message || 'Failed to update profile');
                }
            } catch (err) {
                console.error('Profile update error:', err);
                showNotification('Could not update profile: ' + (err.message || 'Unknown error'), 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            }
        });
    } catch (err) {
        console.error('Profile initialization error:', err);
        window.location.href = 'login.html';
    }
}

// Notification helper available globally
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4cff7e, #7ef9ff)' : type === 'error' ? 'linear-gradient(135deg, #ff4c60, #ff8c42)' : 'linear-gradient(135deg, #7ef9ff, #5b7cfe)'};
        color: #000;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfile);
} else {
    initProfile();
}
