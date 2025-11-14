/**
 * Cart Checkout Handler
 * Processes cart orders with authentication and server/local storage fallback
 */
document.getElementById('checkoutBtn').addEventListener('click', async () => {
    const pickup = document.getElementById('pickupAt').value;
    const cart = JSON.parse(localStorage.getItem('swapit_cart') || '[]');
    
    if (!cart.length) {
        alert('Your cart is empty');
        return;
    }
    
    if (!pickup) {
        alert('Please choose a pickup date/time');
        return;
    }

    try {
        // Verify user authentication before checkout
        if (!window.swapitAuth.isAuthenticated()) {
            alert('Please log in to checkout');
            window.location.href = 'login.html';
            return;
        }

        const user = window.swapitAuth.getUser();
        if (!user) {
            throw new Error('Not authenticated');
        }

        // Prepare order data for server submission
        const formData = new FormData();
        formData.append('action', 'create_order');
        formData.append('items', JSON.stringify(cart));
        formData.append('pickup_at', pickup);

        const response = await fetch('../api/auth.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to create order');
        }

        // Order successfully created on server
        alert('Order created successfully!');
        localStorage.removeItem('swapit_cart');
        window.location.href = 'dashboard.html';
    } catch (err) {
        console.error('Order creation failed', err);
        
        // Fallback: save order to localStorage if server fails
        const orders = JSON.parse(localStorage.getItem('swapit_orders') || '[]');
        orders.push({ 
            id: 'local-' + Date.now(), 
            items: cart, 
            pickup_at: pickup,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('swapit_orders', JSON.stringify(orders));
        localStorage.removeItem('swapit_cart');
        
        alert('Could not save order to server. Saved locally in your browser.');
        window.location.href = 'dashboard.html';
    }
});
