# SwapIt Quick Start Guide

This guide will get your SwapIt application running in under 5 minutes.

## Prerequisites

- ? XAMPP installed (PHP 8.2.12, MySQL 8.2.12)
- ? MySQL service running in XAMPP Control Panel
- ? Database SI2025 created with schema

## Step 1: Start MySQL

Open XAMPP Control Panel and start MySQL service.

## Step 2: Start the Server

### Option A: From Project Root (Recommended)
```powershell
cd C:\Users\Athanase\Downloads\swapit_version_1
.\scripts\start-server.ps1
```

### Option B: From Scripts Directory
```powershell
cd C:\Users\Athanase\Downloads\swapit_version_1\scripts
.\start-server.ps1
```

The script automatically detects your location and adjusts paths accordingly.

## Step 3: Access the Application

### Local Access
- **Home:** http://localhost:3000/pages/home.html
- **Signup:** http://localhost:3000/pages/signup.html
- **Login:** http://localhost:3000/pages/login.html

### Network Access (from other devices)
- **Home:** http://172.16.8.49:3000/pages/home.html
- **Signup:** http://172.16.8.49:3000/pages/signup.html
- **Login:** http://172.16.8.49:3000/pages/login.html

## Step 4: Test with Demo Account

**Email:** demo@ashesi.edu.gh  
**Password:** demo123

## Google OAuth Setup (Optional)

If you want to enable Google Sign-In:

1. **Get Credentials:**
   - Visit: https://console.cloud.google.com/
   - Create OAuth 2.0 Client ID
   - Add authorized origins: `http://localhost:3000`, `http://172.16.8.49:3000`

2. **Update Client ID:**
   Your current Client ID is already configured:
   ```
   192017179678-h09621pfp20m4c68idini6j4nattsgqk.apps.googleusercontent.com
   ```

3. **Files Already Updated:**
   - ? `public/pages/signup.html`
   - ? `public/pages/login.html`
   - ? `config/google-oauth.php`

See `docs/GOOGLE_AUTH_SETUP.md` for detailed instructions.

## Network Access Setup

### Enable Firewall Access (One-time setup)

Run PowerShell as Administrator:
```powershell
cd C:\Users\Athanase\Downloads\swapit_version_1
.\scripts\add-firewall-rule.ps1
```

? **Already completed** - Port 3000 is accessible from network devices.

## Common URLs

| Page | Local URL | Network URL |
|------|-----------|-------------|
| Home | http://localhost:3000/pages/home.html | http://172.16.8.49:3000/pages/home.html |
| Signup | http://localhost:3000/pages/signup.html | http://172.16.8.49:3000/pages/signup.html |
| Login | http://localhost:3000/pages/login.html | http://172.16.8.49:3000/pages/login.html |
| Dashboard | http://localhost:3000/pages/dashboard.html | http://172.16.8.49:3000/pages/dashboard.html |
| Browse | http://localhost:3000/pages/browse.html | http://172.16.8.49:3000/pages/browse.html |
| API Test | http://localhost:3000/api/test.php | http://172.16.8.49:3000/api/test.php |

## Testing

### Test Server Connection
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

### Test Files (in tests/ directory)
- **test-signup.html**: Comprehensive signup testing interface
- **server-check.html**: Server diagnostics and connectivity check

## Troubleshooting

### Server won't start
- ? Check if MySQL is running in XAMPP
- ? Check if port 3000 is available: `netstat -ano | Select-String ":3000"`
- ? Make sure you're in the project root directory

### Can't access from other devices
- ? Check firewall: Run `.\scripts\add-firewall-rule.ps1` as Administrator
- ? Verify same network: Both devices must be on same Wi-Fi
- ? Check your IP: May change if using DHCP

### Database errors
- ? Verify MySQL is running
- ? Check database exists: `mysql -u root -e "SHOW DATABASES;"`
- ? Import schema: `mysql -u root SI2025 < db/schema.sql`

### More Help
See `TROUBLESHOOTING.md` for detailed troubleshooting steps.

## Project Structure

```
swapit_version_1/
+-- scripts/           # Server startup and utility scripts
+-- api/              # Backend API endpoints
+-- config/           # Configuration files
+-- db/               # Database schema and scripts
+-- public/           # Web-accessible files (HTML, CSS, JS)
+-- docs/             # Documentation
+-- tests/            # Testing files
```

See `PROJECT_STRUCTURE.md` for complete directory organization.

## Features Ready to Use

? **Authentication**
- Email/password signup and login
- Google OAuth Sign-In
- Session management with auto-refresh
- Password strength validation
- Modern UI with toast notifications

? **Security**
- Bcrypt password hashing
- Prepared SQL statements
- Session-based authentication
- CSRF protection ready

? **Network**
- Local and network access
- Firewall configured
- Mobile device support

## Next Steps

1. ? Server is running
2. ? Firewall configured
3. ? Google OAuth ready
4. ?? Test all features
5. ?? Add more functionality (browse, cart, listings)

## Support

- **Project Structure:** `PROJECT_STRUCTURE.md`
- **Network Setup:** `NETWORK_ACCESS.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`
- **Google OAuth:** `docs/GOOGLE_AUTH_SETUP.md`
- **Full Documentation:** `docs/` directory

---

**Ready to go!** ??

Start server: `.\scripts\start-server.ps1`  
Access app: http://localhost:3000/pages/home.html
