# SwapIt - Student Marketplace Platform

A modern, secure web application for Ashesi University students to swap, buy, and sell items within the campus community.

## ?? Quick Start

```powershell
# 1. Start MySQL in XAMPP Control Panel
# 2. Start the server
.\scripts\start-server.ps1

# 3. Access the app
# Local: http://localhost:3000/pages/home.html
# Network: http://172.16.8.49:3000/pages/home.html
```

**Demo Account:**  
Email: `demo@ashesi.edu.gh`  
Password: `demo123`

## ?? Project Structure

```
swapit_version_1/
+-- api/                    # Backend API endpoints
¦   +-- auth.php           # Authentication (signup, login, Google OAuth)
¦   +-- test.php           # Database test endpoint
¦
+-- config/                 # Configuration files
¦   +-- db.php             # MySQL configuration
¦   +-- google-oauth.php   # Google OAuth credentials
¦
+-- db/                     # Database files
¦   +-- schema.sql         # Complete database schema
¦   +-- cart.sql           # Cart-related scripts
¦
+-- public/                 # Web-accessible files
¦   +-- assets/            # CSS, JS, images
¦   +-- pages/             # Application pages
¦   +-- home.html          # Landing page
¦
+-- scripts/                # Utility scripts
¦   +-- start-server.ps1   # Server startup (PowerShell)
¦   +-- start-server.bat   # Server startup (Batch)
¦   +-- add-firewall-rule.ps1  # Network access setup
¦
+-- tests/                  # Testing files
¦   +-- test-signup.html   # Signup test interface
¦   +-- server-check.html  # Server diagnostics
¦
+-- docs/                   # Documentation
+-- router.php              # PHP server router
+-- README.md              # This file
```

See `PROJECT_STRUCTURE.md` for detailed organization.

## ? Features

### Authentication System
- ? **Email/Password Authentication**
  - Bcrypt password hashing
  - Session-based authentication
  - Auto-refresh sessions (5 min intervals)
  
- ? **Google OAuth Sign-In**
  - One-click authentication
  - Profile picture import
  - JWT token verification

- ? **Modern UI/UX**
  - Floating label inputs
  - Real-time form validation
  - Password strength indicator
  - Toast notifications (no alerts!)
  - Responsive mobile design

### Database
- **MySQL 8.2.12** via XAMPP
- **Database:** SI2025
- **Tables:** users, profiles, categories, items, swap_requests, saved_items, reviews, messages
- **Features:** Foreign keys, indexes, transactions

### Network Access
- Server binds to all network interfaces (0.0.0.0:3000)
- Accessible from phones, tablets, other computers
- Windows Firewall configured
- Same-network access enabled

## ??? Technology Stack

**Backend:**
- PHP 8.2.12
- MySQL 8.2.12
- Session-based authentication
- Prepared statements (SQL injection protection)

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Modern CSS animations
- Mobile-first responsive design
- Google Sign-In API

**Server:**
- PHP built-in server
- Custom router for API requests
- XAMPP for database

## ?? Requirements

- XAMPP (PHP 8.2.12, MySQL 8.2.12)
- Windows 10/11
- PowerShell 5.1+
- Modern web browser
- Google OAuth Client ID (optional)

## ?? Installation & Setup

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE SI2025;

-- Import schema
mysql -u root SI2025 < db/schema.sql
```

### 2. Start Server
```powershell
# From project root
.\scripts\start-server.ps1
```

### 3. Configure Network Access (Optional)
```powershell
# Run as Administrator
.\scripts\add-firewall-rule.ps1
```

### 4. Google OAuth Setup (Optional)
1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 Client ID
3. Add authorized origins:
   - `http://localhost:3000`
   - `http://172.16.8.49:3000`
4. Client ID already configured:
   ```
   192017179678-h09621pfp20m4c68idini6j4nattsgqk.apps.googleusercontent.com
   ```

See `docs/GOOGLE_AUTH_SETUP.md` for detailed steps.

## ?? Access URLs

### Local Access
| Page | URL |
|------|-----|
| Home | http://localhost:3000/pages/home.html |
| Signup | http://localhost:3000/pages/signup.html |
| Login | http://localhost:3000/pages/login.html |
| Dashboard | http://localhost:3000/pages/dashboard.html |
| API Test | http://localhost:3000/api/test.php |

### Network Access (Other Devices)
Replace `localhost` with `172.16.8.49`

Example: `http://172.16.8.49:3000/pages/signup.html`

## ?? Testing

### Test Database Connection
```
http://localhost:3000/api/test.php
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful",
  "database": "si2025",
  "user_count": "1"
}
```

### Test Files
- `tests/test-signup.html` - Comprehensive signup testing
- `tests/server-check.html` - Server diagnostics

## ?? Troubleshooting

### Server Won't Start
```powershell
# Check if MySQL is running
mysql -u root -e "SELECT 1"

# Check if port 3000 is available
netstat -ano | Select-String ":3000"
```

### Can't Access from Other Devices
```powershell
# Add firewall rule (as Administrator)
.\scripts\add-firewall-rule.ps1

# Check your IP address
ipconfig
```

### Database Errors
```sql
-- Verify database exists
SHOW DATABASES;

-- Check tables
USE SI2025;
SHOW TABLES;
```

See `docs/TROUBLESHOOTING.md` for more solutions.

## ?? Documentation

- **docs/QUICKSTART.md** - Get started in 5 minutes
- **docs/PROJECT_STRUCTURE.md** - Complete directory guide
- **docs/NETWORK_ACCESS.md** - Network configuration
- **docs/TROUBLESHOOTING.md** - Common issues
- **docs/GOOGLE_AUTH_SETUP.md** - Google OAuth guide
- **docs/Setup.md** - Detailed setup instructions
- **docs/Architecture.md** - System architecture
- **docs/Auth.md** - Authentication system
- **docs/DataModel.md** - Database schema

## ?? Security Features

- ? Bcrypt password hashing (cost: 12)
- ? Prepared SQL statements (injection protection)
- ? Session-based authentication
- ? HTTPS-ready (for production)
- ? Input validation (frontend & backend)
- ? XSS protection
- ? CSRF protection ready

## ?? UI/UX Features

- ? Modern, clean design
- ? Floating label animations
- ? Password strength indicator (5 levels)
- ? Real-time email validation
- ? Toast notifications
- ? Loading states
- ? Responsive mobile design
- ? Smooth transitions
- ? Icon support

## ?? Work in Progress

- ?? Browse items page
- ?? Add listing functionality
- ?? Shopping cart
- ?? Swap requests
- ?? User messaging
- ?? Reviews system

## ?? Development Notes

### Code Organization
- Backend: API endpoints in `api/`
- Frontend: Pages in `public/pages/`, scripts in `public/assets/js/`
- Config: Centralized in `config/`
- Database: Schema in `db/`
- Scripts: Utilities in `scripts/`
- Tests: Testing files in `tests/`

### Path Conventions
**Backend (PHP):**
```php
require_once dirname(__DIR__) . '/config/db.php';
```

**Frontend (JavaScript):**
```javascript
fetch('../../api/auth.php', { ... })
```

### Session Management
- Auto-refresh every 5 minutes
- Session expires after 30 minutes of inactivity
- Logout redirects to home page

## ?? Team

**Project:** SwapIt Student Marketplace  
**Course:** Web Technologies 2025  
**Institution:** Ashesi University  
**Repository:** ashesi-webtech-2025-peercoding-athanase-abayo

## ?? License

Educational project for Ashesi University Web Technologies course.

## ?? Contributing

This is an educational project. For contributions or suggestions, please contact the development team.

---

## Quick Commands Reference

```powershell
# Start server
.\scripts\start-server.ps1

# Add firewall rule (as Admin)
.\scripts\add-firewall-rule.ps1

# Test database
mysql -u root SI2025 -e "SELECT COUNT(*) FROM users"

# Check IP address
ipconfig

# Test API
curl http://localhost:3000/api/test.php
```

---

**?? Ready to start?**

```powershell
cd C:\Users\Athanase\Downloads\swapit_version_1
.\scripts\start-server.ps1
```

Then visit: http://localhost:3000/pages/home.html

---

**Questions?** Check the documentation in the `docs/` folder or see `docs/TROUBLESHOOTING.md`.
