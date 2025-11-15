# Authentication (Brief)

Overview:
- Client JS uses a `SwapItAuth` helper to call PHP API endpoints.
- Backend session management happens in `api/auth.php` (MySQL-backed).
- Sessions persist for 7 days with automatic keep-alive mechanism.

Flows:
- Sign up: `signup.js` validates → `SwapItAuth.signUp()` → `api/auth.php` creates user in MySQL → session created → auto-login → redirect to `dashboard.html`.
- Login: `login.js` submits → `SwapItAuth.signIn()` → MongoDB user verified → session created → redirect to `dashboard.html`.
- Protected pages: load `auth-client.js`/page JS → check `isAuthenticated()` → redirect to `login.html` if not.
- Logout: `SwapItAuth.signOut()` → `api/auth-mongodb.php` destroys session → clear storage → redirect to `home.html`.

Session Persistence:
- Sessions last 7 days (604800 seconds) unless explicitly logged out
- Automatic session refresh every 5 minutes keeps active users logged in
- Profile edits and other operations do not terminate sessions
- `last_activity` timestamp updated on all authenticated requests

Key files:
- API: `api/auth-mongodb.php` (main authentication endpoint)
- Client helpers: `public/assets/js/auth-client.js`, `public/assets/js/login.js`, `public/assets/js/signup.js`
- Navigation: `public/assets/js/nav-manager.js` (auth-aware navigation)

Testing:
- Use `public/pages/test-session.html` to verify session persistence