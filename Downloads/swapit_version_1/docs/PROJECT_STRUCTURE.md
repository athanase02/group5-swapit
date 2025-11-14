# SwapIt Project Structure

## Directory Organization

```
swapit_version_1/
├── api/                    # Backend API endpoints
│   ├── auth.php           # Authentication API (signup, login, logout, Google OAuth)
│   └── test.php           # Database connection test endpoint
│
├── config/                 # Configuration files
│   ├── db.php             # MySQL database configuration
│   └── google-oauth.php   # Google OAuth credentials
│
├── db/                     # Database files
│   ├── schema.sql         # Complete database schema with demo data
│   └── cart.sql           # Cart-related database scripts
│
├── docs/                   # Documentation
│   ├── Architecture.md    # System architecture overview
│   ├── Auth.md            # Authentication system documentation
│   ├── Changelog.md       # Version history and changes
│   ├── DataModel.md       # Database schema and relationships
│   ├── README.md          # Project overview
│   ├── Setup.md           # Installation and setup guide
│   └── GOOGLE_AUTH_SETUP.md # Google OAuth configuration guide
│
├── public/                 # Web accessible files
│   ├── assets/            # Static resources
│   │   ├── css/          # Stylesheets
│   │   │   ├── auth.css             # Authentication pages styling
│   │   │   ├── featured-items.css   # Featured items section
│   │   │   ├── mobile-nav.css       # Mobile navigation
│   │   │   ├── nav-auth.css         # Navigation authentication
│   │   │   ├── stories.css          # Stories section
│   │   │   └── styles.css           # Global styles
│   │   ├── images/       # Image assets
│   │   └── js/           # JavaScript files
│   │       ├── auth-client.js       # Authentication API client
│   │       ├── signup.js            # Signup page logic
│   │       ├── login.js             # Login page logic
│   │       ├── dashboard.js         # Dashboard functionality
│   │       ├── profile.js           # User profile management
│   │       ├── nav-manager.js       # Navigation management
│   │       ├── browse.js            # Browse items page
│   │       ├── cart.js              # Shopping cart
│   │       ├── cart-checkout.js     # Checkout process
│   │       ├── add-listing.js       # Add new listings
│   │       ├── reset-password.js    # Password reset
│   │       ├── script.js            # General utilities
│   │       └── cript.js             # Additional scripts
│   │
│   ├── pages/             # Application pages
│   │   ├── signup.html           # User registration
│   │   ├── login.html            # User login
│   │   ├── dashboard.html        # User dashboard
│   │   ├── profile.html          # User profile
│   │   ├── browse.html           # Browse items
│   │   ├── add-listing.html      # Create new listing
│   │   ├── cart.html             # Shopping cart
│   │   ├── wishlist.html         # User wishlist
│   │   ├── requests.html         # Swap requests
│   │   ├── reset-password.html   # Password reset
│   │   ├── debug-session.html    # Session debugging
│   │   ├── test-db.html          # Database test
│   │   ├── test-session.html     # Session test
│   │   └── news-*.html           # News articles
│   │
│   └── home.html          # Landing page
│
├── scripts/                # Utility scripts
│   ├── start-server.ps1   # PowerShell server startup script
│   ├── start-server.bat   # Batch server startup script
│   └── add-firewall-rule.ps1 # Windows Firewall configuration
│
├── tests/                  # Testing files
│   ├── test-signup.html   # Signup functionality test
│   └── server-check.html  # Server diagnostics
│
├── router.php              # PHP built-in server router
├── QUICKSTART.md          # Quick start guide
├── NETWORK_ACCESS.md      # Network configuration guide
└── TROUBLESHOOTING.md     # Common issues and solutions
```

## File Purpose Guide

### Backend (API)
- **auth.php**: Main authentication endpoint handling all auth operations
  - Actions: signup, login, logout, check-session, google_signin
  - Uses prepared statements and transactions
  - Returns JSON responses

### Frontend Structure

#### Core Pages Flow
```
home.html → signup.html/login.html → dashboard.html → browse.html → cart.html
```

#### JavaScript Architecture
- **auth-client.js**: Core authentication class (SwapItAuth)
  - Handles all API communication
  - Manages user sessions
  - Auto-refresh sessions every 5 minutes
  
- **Page-specific scripts**: Handle UI logic for their respective pages
  - Import and use SwapItAuth instance
  - Manage form validation
  - Handle user interactions

#### CSS Architecture
- **styles.css**: Global styles, layout, typography
- **auth.css**: Authentication pages (signup, login)
  - Floating labels
  - Password strength indicator
  - Toast notifications
  - Modern form design
- **Component-specific CSS**: Isolated styles for specific features

## Starting the Server

### Quick Start
```powershell
# From project root
cd scripts
.\start-server.ps1
```

### What it does:
1. Detects your local IP address
2. Starts PHP server on `0.0.0.0:3000`
3. Shows URLs for local and network access
4. Loads `router.php` for API routing

## Key Features

### Authentication System
- ✅ Email/Password authentication (bcrypt hashing)
- ✅ Google OAuth Sign-In (JWT token-based)
- ✅ Session management with auto-refresh
- ✅ Profile picture import from Google
- ✅ Modern UI with floating labels
- ✅ Real-time validation
- ✅ Toast notifications

### Database
- **MySQL 8.2.12** via XAMPP
- **Database**: SI2025
- **Tables**: users, profiles, categories, items, swap_requests, saved_items, reviews, messages
- **Demo account**: demo@ashesi.edu.gh / demo123

### Network Access
- Server binds to all interfaces (0.0.0.0)
- Accessible from any device on same network
- Firewall rule: Port 3000 TCP Inbound
- Your IP: 172.16.8.49

## Development Workflow

### Adding New Features
1. Backend: Add endpoint to `api/auth.php` or create new API file
2. Frontend: Update `auth-client.js` with new method if needed
3. UI: Create page in `public/pages/` with corresponding JS file
4. Test: Add test file to `tests/` directory

### Code Organization Principles
- ✅ Separation of concerns (API, UI, Logic)
- ✅ Reusable authentication client
- ✅ Consistent error handling
- ✅ Modern ES6+ JavaScript
- ✅ Mobile-first responsive design

## Important Notes

### Paths in Backend
Always use `dirname(__DIR__)` for parent directory access:
```php
require_once dirname(__DIR__) . '/config/db.php';
```

### API Calls in Frontend
Always use relative paths from the page:
```javascript
fetch('../../api/auth.php', { ... })
```

### Router Requirement
The `router.php` is essential when using PHP built-in server with `-t public` flag. It handles API requests that reference parent directories.

## Quick Commands

```powershell
# Start server
.\scripts\start-server.ps1

# Add firewall rule (as Administrator)
.\scripts\add-firewall-rule.ps1

# Check MySQL connection
http://localhost:3000/api/test.php

# Test signup
.\tests\test-signup.html

# Check server status
.\tests\server-check.html
```

## Security Notes

⚠️ **Development Only**
- Server runs on HTTP (no HTTPS)
- Google OAuth in test mode
- No rate limiting
- Debug mode enabled
- Do not expose to internet

## Next Steps

1. Configure Google OAuth Client ID in:
   - `public/pages/signup.html`
   - `public/pages/login.html`
   - `config/google-oauth.php`

2. Test all authentication flows:
   - Email signup/login
   - Google Sign-In
   - Session persistence
   - Logout functionality

3. Implement additional features:
   - Browse items
   - Add listings
   - Cart functionality
   - Swap requests
