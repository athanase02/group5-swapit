/**
 * SwapIt Authentication Client
 * Handles user authentication, session management, and API communication
 */
class SwapItAuth {
    constructor() {
        // API is at root level - use absolute path from domain root
        this.apiBase = '/api';
        this.user = null;
        this.init();
    }

    async init() {
        // Verify user session on page load
        await this.checkSession();
    }

    async checkSession() {
        try {
            const response = await fetch(`${this.apiBase}/auth.php?action=check_auth`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success && data.user) {
                this.user = data.user;
                return data.user;
            }
            return null;
        } catch (error) {
            console.error('Session check failed:', error);
            return null;
        }
    }

    async signUp(email, password, fullName) {
        try {
            const formData = new FormData();
            formData.append('action', 'signup');
            formData.append('email', email);
            formData.append('password', password);
            formData.append('full_name', fullName);

            const response = await fetch(`${this.apiBase}/auth.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                this.user = data.user;
            }
            return data;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const formData = new FormData();
            formData.append('action', 'login');
            formData.append('email', email);
            formData.append('password', password);

            const response = await fetch(`${this.apiBase}/auth.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                this.user = data.user;
            }
            return data;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async signOut() {
        try {
            const formData = new FormData();
            formData.append('action', 'logout');

            const response = await fetch(`${this.apiBase}/auth.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                this.user = null;
            }
            return data;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async resetPassword(email) {
        try {
            const formData = new FormData();
            formData.append('action', 'reset_password');
            formData.append('email', email);

            const response = await fetch(`${this.apiBase}/auth.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async updateProfile(updates) {
        try {
            const formData = new FormData();
            formData.append('action', 'update_profile');
            Object.keys(updates).forEach(key => {
                formData.append(key, updates[key]);
            });

            const response = await fetch(`${this.apiBase}/auth.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success && data.user) {
                this.user = data.user;
            }
            return data;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return this.user !== null;
    }
}

/**
 * Initialize global authentication client instance
 */
window.swapitAuth = new SwapItAuth();
window.SWAPIT_AUTH_READY = true;
