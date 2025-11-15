# Database Connection Setup - Signup Integration

## Changes Made

### 1. Database Schema Updated (`db/schema.sql`)
- Added demo user with credentials:
  - Email: `demo@ashesi.edu.gh`
  - Password: `demo123`
  - Status: Verified
- Created complete profile for demo user

### 2. Backend API Updated (`api/auth.php`)
- ✅ Added JSON content-type header to all responses
- ✅ Enhanced signup endpoint to:
  - Return user data after successful registration
  - Auto-login user after signup (creates session)
  - Store user in both `users` and `profiles` tables
- ✅ Enhanced login endpoint to:
  - Return user data on successful authentication
- ✅ Added `check-session` endpoint for session validation
- ✅ Maintained backward compatibility with existing endpoints

### 3. Frontend Authentication Client (`public/assets/js/auth-client.js`)
- ✅ Changed from MongoDB to MySQL backend (`auth-mongodb.php` → `auth.php`)
- ✅ Automatic session checking every 5 minutes
- ✅ Proper user data handling from API responses

### 4. Signup Page Logic (`public/assets/js/signup.js`)
- ✅ Updated to redirect to dashboard after successful signup (auto-login feature)
- ✅ Proper error handling and validation
- ✅ Integration with SwapIt authentication client

### 5. Testing Tools Created
- ✅ `test-signup.html` - Comprehensive testing interface
- ✅ `api/test.php` - Database connection test endpoint
- ✅ `public/server-check.html` - Quick diagnostics page

### 6. Server Configuration
- ✅ `router.php` - Routing script for PHP built-in server
- ✅ `start-server.ps1` - PowerShell startup script
- ✅ `start-server.bat` - Windows batch startup script
- ✅ Fixed API file paths to use `dirname(__DIR__)`
- ✅ `TROUBLESHOOTING.md` - Complete troubleshooting guide

## Database Structure

### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- full_name
- is_verified
- created_at
```

### Profiles Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- full_name
- email
- phone
- bio
- avatar_url
- created_at
- updated_at
```

## API Endpoints

### POST `/api/auth.php`
**Action: signup**
- Parameters: `email`, `password`, `full_name`
- Creates user account + profile
- Auto-login after successful registration
- Returns: `{ success: true, data: { id, email, full_name } }`

**Action: login**
- Parameters: `email`, `password`
- Validates credentials
- Creates session
- Returns: `{ success: true, data: { id, email, full_name } }`

**Action: logout**
- Destroys session
- Returns: `{ success: true }`

### GET `/api/auth.php?action=check-session`
- Checks if user has active session
- Returns user data if authenticated
- Returns: `{ success: true/false, data: { id, email, full_name } | null }`

### GET `/api/test.php`
- Tests database connection
- Returns database info and user count
- Returns: `{ success: true/false, message, database, user_count }`

## How to Test

### Step 0: Start the Server
```powershell
cd "C:\Users\Athanase\Downloads\swapit_version_1"
.\start-server.ps1
```
Server will start on `http://localhost:3000`

### Option 1: Quick Diagnostics
1. Open `http://localhost:3000/server-check.html`
2. Automatically tests:
   - Current URL/protocol
   - API connectivity
   - Database connection
   - Auth client

### Option 2: Comprehensive Testing
1. Open `http://localhost:3000/test-signup.html`
2. Click through each test button:
   - Test DB Connection
   - Test Session Check
   - Test User Signup (with new credentials)
   - Test Demo Login
   - Test Logout

### Option 3: Use the Actual Signup Page
1. Navigate to `http://localhost:3000/pages/signup.html`
2. Fill in the form:
   - First Name: Your name
   - Email: your.email@example.com
   - Password: (minimum 6 characters)
   - Check "I agree to Terms & Conditions"
3. Click "Create account"
4. Should redirect to dashboard with active session

**Note:** If you see "Failed to fetch" error:
- Ensure server is running on port 3000
- Check you're using `http://` not `file://`
- See `TROUBLESHOOTING.md` for detailed fixes

### Option 4: Test Demo User Login
1. Navigate to `http://localhost:3000/pages/login.html`
2. Use demo credentials:
   - Email: `demo@ashesi.edu.gh`
   - Password: `demo123`
3. Click "Log in"

## Flow Diagram

```
User fills signup form
       ↓
signup.js validates input
       ↓
Calls swapitAuth.signUp()
       ↓
POST to api/auth.php (action=signup)
       ↓
Check if email exists in database
       ↓
Hash password with bcrypt
       ↓
Begin MySQL transaction
       ↓
Insert into users table
       ↓
Insert into profiles table
       ↓
Commit transaction
       ↓
Create PHP session
       ↓
Return user data
       ↓
Redirect to dashboard.html
```

## Security Features
- ✅ Password hashing using PHP's `password_hash()` with bcrypt
- ✅ Input sanitization and validation
- ✅ SQL injection prevention using prepared statements
- ✅ Database transactions for data integrity
- ✅ Session-based authentication
- ✅ CSRF protection through same-origin policy

## Next Steps
1. Test the signup functionality thoroughly
2. Implement email verification system
3. Add password reset functionality
4. Enhance profile management
5. Add profile picture upload
6. Implement social authentication (Google, Apple)

## Troubleshooting

### "Failed to fetch" Error
- Server not running or using wrong port
- Accessing via `file://` instead of `http://`
- Solution: Run `.\start-server.ps1` and use `http://localhost:3000`
- See `TROUBLESHOOTING.md` for complete guide

### Database Connection Issues
- Check `config/db.php` credentials
- Ensure MySQL service is running in XAMPP
- Verify database `SI2025` exists
- Test with: `mysql -u root SI2025 -e "SELECT COUNT(*) FROM users;"`

### Session Issues
- Check PHP session configuration
- Ensure cookies are enabled in browser
- Check `session.save_path` in php.ini

### API Not Responding
- Ensure using `router.php` script when starting server
- Check server is running: `netstat -ano | Select-String ":3000"`
- Test with: `http://localhost:3000/api/test.php`
- Check PHP error logs
- Verify file permissions

## Demo User Credentials
**Email:** demo@ashesi.edu.gh  
**Password:** demo123  
**Status:** Verified ✓
