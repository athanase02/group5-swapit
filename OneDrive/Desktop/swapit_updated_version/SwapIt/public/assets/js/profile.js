/**
 * Profile Page Functionality
 * User profile display and edit capabilities
 */
document.addEventListener('DOMContentLoaded', async () => {
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

        // Check session with server
        const user = await window.swapitAuth.checkSession();
        
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Display user email
        document.getElementById('profileEmail').textContent = user.email;

        // Display user name if available
        if (user.full_name) {
            document.getElementById('profileName').textContent = user.full_name;
        }

        // Display avatar if available, otherwise show initials
        const avatarImg = document.getElementById('avatar');
        if (user.avatar_url) {
            avatarImg.src = user.avatar_url;
            avatarImg.style.display = 'block';
        } else {
            // Show initials instead of default logo
            const userName = user.full_name || user.email.split('@')[0];
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            avatarImg.style.display = 'none';
            const avatarContainer = avatarImg.parentElement;
            const existingInitials = avatarContainer.querySelector('.avatar-initials');
            if (!existingInitials) {
                const initialsDiv = document.createElement('div');
                initialsDiv.className = 'avatar-initials';
                initialsDiv.style.cssText = 'width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #7ef9ff, #5b7cfe); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #0a0b10; font-size: 2.5rem; margin: 0 auto;';
                initialsDiv.textContent = initials;
                avatarContainer.appendChild(initialsDiv);
            }
        }

        let lastFile = null;

        // Handle avatar file selection
        document.getElementById('avatarInput').addEventListener('change', (ev) => {
            const f = ev.target.files && ev.target.files[0];
            if (!f) return;
            
            // Validate file size (max 500KB)
            if (f.size > 500 * 1024) {
                window.showToast('Image is too large. Please choose an image under 500KB.', 'error', 'Upload Failed');
                ev.target.value = '';
                return;
            }
            
            // Validate file type
            if (!f.type.startsWith('image/')) {
                window.showToast('Please choose an image file (JPG, PNG, etc.)', 'error', 'Invalid File Type');
                ev.target.value = '';
                return;
            }
            
            lastFile = f;
            
            // Show local preview immediately
            const url = URL.createObjectURL(f);
            document.getElementById('avatar').src = url;
        });

        // Handle save profile button
        document.getElementById('saveProfile').addEventListener('click', async () => {
            if (!lastFile) {
                window.showToast('Please select an image to upload.', 'warning', 'No Image Selected');
                return;
            }

            try {
                // Create a compressed version of the image
                const img = new Image();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                img.onload = async () => {
                    try {
                        // Set max dimensions (300x300)
                        const maxSize = 300;
                        let width = img.width;
                        let height = img.height;
                        
                        // Calculate new dimensions maintaining aspect ratio
                        if (width > height) {
                            if (width > maxSize) {
                                height *= maxSize / width;
                                width = maxSize;
                            }
                        } else {
                            if (height > maxSize) {
                                width *= maxSize / height;
                                height = maxSize;
                            }
                        }
                        
                        // Resize the image
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Convert to JPEG with compression (0.7 quality)
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        
                        console.log('Original size:', lastFile.size, 'bytes');
                        console.log('Compressed data URL length:', compressedDataUrl.length, 'chars');
                        
                        // Update profile with compressed avatar
                        const result = await window.swapitAuth.updateProfile({
                            avatar_url: compressedDataUrl
                        });

                        console.log('Update result:', result);

                        if (result.success) {
                            window.showToast('Your profile picture has been updated!', 'success', 'Profile Updated');
                            lastFile = null;
                            setTimeout(() => location.reload(), 1500);
                        } else {
                            throw new Error(result.message || 'Failed to update profile');
                        }
                    } catch (err) {
                        console.error('Profile update error:', err);
                        window.showToast(err.message || 'Could not update profile', 'error', 'Update Failed');
                    }
                };
                
                img.onerror = () => {
                    window.showToast('Failed to load image file. Please try another image.', 'error', 'Load Failed');
                };
                
                // Load the image
                img.src = URL.createObjectURL(lastFile);
            } catch (err) {
                console.error('File processing error:', err);
                window.showToast(err.message || 'Could not process image', 'error', 'Processing Failed');
            }
        });
    } catch (err) {
        console.error('Profile initialization error:', err);
        window.location.href = 'login.html';
    }
});
