# SwapIt Changelog

## Recent Updates

### Session Management Improvements
**Date:** Current Release

#### Problem Fixed
Sessions were terminating unexpectedly during normal operations like profile editing, causing users to lose their logged-in state.

#### Root Causes Identified
1. **Premature Session Closure**: `session_write_close()` was being called in the API response helper, closing sessions after every request
2. **Short Session Lifetime**: Cookie lifetime was set to 0 (browser session only) instead of persistent
3. **No Session Refresh**: No mechanism to keep sessions alive during user activity

#### Solutions Implemented

**Backend (auth-mongodb.php)**
- Extended session cookie lifetime from 0 to 604800 seconds (7 days)
- Extended garbage collection lifetime to 7 days
- Removed `session_write_close()` from `send_response()` function
- Added `last_activity` timestamp tracking on all authenticated requests
- Added `session_regenerate_id(true)` on login/signup for security
- Added `Access-Control-Allow-Credentials: true` header
- Updated `check-session` to refresh `last_activity` on every call
- Updated `update_profile` to refresh `last_activity` during profile edits

**Frontend (auth-client.js)**
- Added automatic session refresh mechanism (checks every 5 minutes)
- Added `startSessionRefresh()` method to maintain session activity
- Added `stopSessionRefresh()` method called on logout
- Session refresh restarts automatically after login/signup
- Added cache busting to session checks with timestamp parameter
- All fetch requests include `credentials: 'include'` for cookie transmission

**Other Files**
- Added `credentials: 'include'` to cart-checkout.js fetch call
- Added `credentials: 'include'` to add-listing.js fetch call

#### Expected Behavior
- Sessions now persist for 7 days unless user explicitly logs out
- Sessions remain active during profile edits and other operations
- Automatic session refresh keeps active users logged in
- Sessions properly transmit cookies across all API requests

#### Testing Checklist
- [ ] Login persists across page refreshes
- [ ] Profile editing does not terminate session
- [ ] Dashboard shows correct user name after profile update
- [ ] Session survives 5+ minutes of inactivity
- [ ] Logout properly destroys session and redirects to home
- [ ] Multiple tabs maintain same session

---

### Navigation System
- Dynamic authentication-aware navigation
- Authenticated users see: Dashboard, Browse, Requests, Add Listing, Wishlist
- Public users see: Home, How it works, Stories, About Us, FAQ, Contact
- Logout redirects to home.html

### Profile Management
- Each user has unique profile name (MongoDB-backed)
- Profile editing with avatar upload (max 5MB)
- Real-time profile updates without page reload
- Dashboard welcome messages show actual user names

### Listing Management
- Added `create_listing` endpoint in auth-mongodb.php
- Listings stored in MongoDB TS2027.items collection
- Includes title, description, category, price, location, images
- Owner information automatically attached from session
- Image upload with base64 encoding (max 5MB)
- Add-listing page submits to MongoDB backend

### UI/UX Improvements
- Custom notification system (no browser alerts)
- Add-listing page redesigned with dark theme
- Modern gradient buttons and inputs
- Smooth animations and transitions
- Image preview before upload
- Form validation with clear error messages

### Documentation
- Consolidated to 6 brief guides
- Removed 15 redundant/verbose documents
- Clear setup instructions and architecture docs
