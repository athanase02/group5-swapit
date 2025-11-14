/**
 * SwapIt Authentication Client
 * Handles user authentication, session management, and API communication with MySQL backend
 */
class SwapItAuth {
    constructor() {
        this.apiBase = '../../api';
        this.apiEndpoint = 'auth.php'; // MySQL API endpoint
        this.user = null;
        this.ready = false;
        this.initPromise = this.init();
        this.sessionCheckInterval = null;
    }

    async init() {
        // Verify user session on page load
        await this.checkSession();
        this.ready = true;
        
        // Start automatic session refresh every 5 minutes to keep session alive
        this.startSessionRefresh();
    }

    async waitForReady() {
        if (!this.ready) {
            await this.initPromise;
        }
    }

    startSessionRefresh() {
        // Clear any existing interval
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
        }
        
        // Check session every 5 minutes to keep it alive
        this.sessionCheckInterval = setInterval(async () => {
            if (this.isAuthenticated()) {
                await this.checkSession();
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    stopSessionRefresh() {
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
            this.sessionCheckInterval = null;
        }
    }

    async checkSession() {
        try {
            console.log('[Auth] Checking session...');
            const response = await fetch(`${this.apiBase}/${this.apiEndpoint}?action=check-session&t=${Date.now()}`, {
                credentials: 'include',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('[Auth] Session check response status:', response.status);
            
            if (!response.ok) {
                console.error('[Auth] Session check failed with status:', response.status);
                this.user = null;
                return null;
            }
            
            const data = await response.json();
            console.log('[Auth] Session check data:', data);
            
            if (data.success && data.data) {
                this.user = data.data;
                console.log('[Auth] Session active, user:', data.data.email);
                return data.data;
            }
            
            console.warn('[Auth] Session check returned no data');
            this.user = null;
            return null;
        } catch (error) {
            console.error('[Auth] Session check exception:', error);
            this.user = null;
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

            const response = await fetch(`${this.apiBase}/${this.apiEndpoint}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                this.user = data.data;
                // Restart session refresh after signup
                this.startSessionRefresh();
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

            const response = await fetch(`${this.apiBase}/${this.apiEndpoint}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                this.user = data.data;
                // Restart session refresh after login
                this.startSessionRefresh();
            }
            return data;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async signOut() {
        try {
            // Stop session refresh interval
            this.stopSessionRefresh();
            
            const formData = new FormData();
            formData.append('action', 'logout');

            const response = await fetch(`${this.apiBase}/${this.apiEndpoint}`, {
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
            this.user = null;
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

            const response = await fetch(`${this.apiBase}/${this.apiEndpoint}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success && data.data) {
                this.user = data.data;
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
