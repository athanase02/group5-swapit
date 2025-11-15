# 🔧 Troubleshooting Guide - "Failed to fetch" Error

## Problem
When trying to sign up, you receive an alert: **"Failed to fetch"**

## Root Cause
The browser cannot connect to the API server. This happens because:
1. The web server is not running properly
2. The API files are not accessible from the browser
3. You're accessing files directly (file://) instead of through HTTP

---

## ✅ SOLUTION - Follow These Steps:

### Step 1: Stop Any Running Server
```powershell
# Kill any process on port 8000
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess} | Stop-Process -Force
```

### Step 2: Start Server with Router Script

**Option A: Using PowerShell Script (RECOMMENDED)**
```powershell
cd "C:\Users\Athanase\Downloads\swapit_version_1"
.\start-server.ps1
```

**Option B: Using Batch File**
```cmd
cd "C:\Users\Athanase\Downloads\swapit_version_1"
start-server.bat
```

**Option C: Manual Command**
```powershell
cd "C:\Users\Athanase\Downloads\swapit_version_1"
php -S localhost:8000 -t public router.php
```

### Step 3: Verify Server is Running
Open your browser and go to:
```
http://localhost:8000/server-check.html
```

This page will test:
- ✅ API connection
- ✅ Database connection  
- ✅ Auth client loading

### Step 4: Test Signup
If all checks pass, navigate to:
```
http://localhost:8000/pages/signup.html
```

---

## 🔍 Why This Fix Works

### The Problem
When you run:
```powershell
php -S localhost:8000 -t public
```

The server serves files from the `public/` directory, but your API files are in:
```
swapit_version_1/api/
```

So when JavaScript tries to access `../../api/auth.php`, it fails because the server can't find it.

### The Solution
The `router.php` script intercepts requests and:
1. Detects API requests (anything with `/api/...`)
2. Serves those files from the parent directory
3. Serves everything else normally from `public/`

---

## 📋 Pre-Flight Checklist

Before testing signup, make sure:

- [ ] **MySQL is running**
  ```powershell
  mysql -u root SI2025 -e "SELECT COUNT(*) FROM users;"
  ```
  Should show user count without errors

- [ ] **Database has schema**
  ```powershell
  mysql -u root SI2025 -e "SHOW TABLES;"
  ```
  Should show: users, profiles, categories, items, etc.

- [ ] **Server is running with router**
  ```powershell
  # Should see: "PHP X.X.X Development Server started"
  # With "router.php" in the command
  ```

- [ ] **Accessing via HTTP (not file://)**
  ```
  ✓ http://localhost:8000/pages/signup.html
  ✗ file:///C:/Users/.../signup.html
  ```

---

## 🚨 Common Errors & Fixes

### Error: "php is not recognized"
**Fix:** Add PHP to your PATH
```powershell
# If using XAMPP:
$env:Path += ";C:\xampp\php"
```

Or start via XAMPP Control Panel

### Error: Port 8000 already in use
**Fix:** Use a different port
```powershell
php -S localhost:8001 -t public router.php
```
Then access: `http://localhost:8001`

### Error: Database connection failed
**Fix:** 
1. Start MySQL in XAMPP Control Panel
2. Verify credentials in `config/db.php`
3. Import schema if needed:
   ```powershell
   mysql -u root < db/schema.sql
   ```

### Error: "Cannot connect to server"
**Fix:** Check Windows Firewall
1. Allow PHP through firewall
2. Or temporarily disable firewall for testing

---

## 🎯 Quick Start Commands

**One-line setup and start:**
```powershell
cd "C:\Users\Athanase\Downloads\swapit_version_1"; .\start-server.ps1
```

**Test everything:**
```powershell
# In browser:
# 1. http://localhost:8000/server-check.html
# 2. http://localhost:8000/test-signup.html
# 3. http://localhost:8000/pages/signup.html
```

---

## 📞 Still Having Issues?

### Check Browser Console
1. Open browser (Chrome/Edge)
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Try signup again
5. Look for error messages

### Check PHP Errors
Look at the terminal where server is running for PHP errors

### Verify File Paths
```powershell
# Check files exist:
Test-Path api/auth.php          # Should be True
Test-Path config/db.php         # Should be True
Test-Path public/pages/signup.html  # Should be True
Test-Path router.php            # Should be True
```

---

## ✅ Success Indicators

You'll know it's working when:
1. Server starts without errors
2. http://localhost:8000/api/test.php returns JSON
3. Server check page shows all green ✅
4. Signup shows detailed error instead of "Failed to fetch"
5. You can create account and see success message

---

**Last Updated:** November 14, 2025
