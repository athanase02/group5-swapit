/**
 * Add Listing Form Handler
 * Creates new item listings with image upload and server/local storage fallback
 */
document.getElementById('listingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value) || 0;
    const location = document.getElementById('location').value.trim() || 'Unknown';

    // Retrieve selected image file
    const f = document.getElementById('imageInput').files[0];
    let imageUrl = null;

    // Convert image file to base64 data URL
    if (f) {
        try {
            imageUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(f);
            });
        } catch (err) {
            console.error('Failed to read image file', err);
            imageUrl = null;
        }
    }

    try {
        // Verify user authentication before creating listing
        if (!window.swapitAuth.isAuthenticated()) {
            alert('You must be logged in to create a listing.');
            window.location.href = 'login.html';
            return;
        }

        const user = window.swapitAuth.getUser();
        if (!user) {
            throw new Error('Not authenticated');
        }

        // Prepare listing data for server submission
        const formData = new FormData();
        formData.append('action', 'create_listing');
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('location', location);
        if (imageUrl) {
            formData.append('image_url', imageUrl);
        }

        const response = await fetch('../api/auth.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to create listing');
        }

        alert('Listing created successfully!');
        window.location.href = 'browse.html';
    } catch (err) {
        console.error('Create listing error', err);
        
        // Fallback: save to localStorage if server fails
        const pending = JSON.parse(localStorage.getItem('swapit_pending_items') || '[]');
        pending.push({ 
            id: 'local-' + Date.now(), 
            title, 
            description, 
            category, 
            price, 
            location, 
            image_url: imageUrl,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('swapit_pending_items', JSON.stringify(pending));
        
        alert('Could not save to the server. Saved locally. You can still view it in the browse page for this browser session.');
        window.location.href = 'browse.html';
    }
});
