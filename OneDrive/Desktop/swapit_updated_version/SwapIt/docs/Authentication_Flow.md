# Custom Authentication Flow Documentation

## Authentication Architecture

### Overview
The SwapIt authentication system uses a client-side JavaScript class (`SwapItAuth`) that communicates with a PHP backend (`auth.php`) for secure session management.

## Authentication Flow Diagrams

### 1. User Registration Flow
```
User fills signup form
        ↓
signup.js validates input
        ↓
SwapItAuth.signUp() called
        ↓
POST request to auth.php
        ↓
auth.php creates user in database
        ↓
Session created in PHP
        ↓
User data stored in sessionStorage
        ↓
Redirect to login.html
```

### 2. User Login Flow
```
User fills login form
        ↓
login.js handles submission
        ↓
SwapItAuth.signIn() called
        ↓
POST request to auth.php
        ↓
auth.php verifies credentials
        ↓
Session created in PHP
        ↓
User data stored in sessionStorage
        ↓
Redirect to dashboard.html
```

### 3. Protected Page Access
```
User visits protected page (dashboard, profile, etc.)
        ↓
Page loads auth-client.js
        ↓
Page-specific JS checks isAuthenticated()
        ↓
If not authenticated → redirect to login.html
        ↓
If authenticated → load user data and display page
```

### 4. Logout Flow
```
User clicks logout button
        ↓
SwapItAuth.signOut() called
        ↓
POST request to auth.php
        ↓
auth.php destroys session
        ↓
sessionStorage cleared
        ↓
Redirect to index.html
```

## Code Examples

### Using SwapItAuth in Your Pages

#### Example 1: Login Page
```javascript
// login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const result = await window.swapitAuth.signIn(email, password);
        
        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});
```

#### Example 2: Protected Page
```javascript
// dashboard.js
async function init() {
    // Check authentication
    if (!window.swapitAuth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Get user data
    const user = window.swapitAuth.getUser();
    console.log('Logged in as:', user.email);
    
    // Display user info
    document.getElementById('welcomeText').textContent = `Hello, ${user.email}`;
}

init();
```

#### Example 3: Profile Update
```javascript
// profile.js
try {
    const result = await window.swapitAuth.updateProfile({
        avatar_url: dataUrl,
        full_name: 'John Doe'
    });
    
    if (result.success) {
        alert('Profile updated!');
    }
} catch (error) {
    alert('Update failed: ' + error.message);
}
```

## API Reference

### SwapItAuth Class Methods

#### signUp(email, password, fullName)
Registers a new user account.

**Parameters:**
- `email` (string) - User's email address
- `password` (string) - User's password
- `fullName` (string) - User's full name

**Returns:**
```javascript
{
    success: true/false,
    message: "Success/error message",
    user: { id, email, full_name } // if success
}
```

**Example:**
```javascript
const result = await window.swapitAuth.signUp(
    'user@example.com',
    'password123',
    'John Doe'
);
```

---

#### signIn(email, password)
Authenticates a user and creates a session.

**Parameters:**
- `email` (string) - User's email address
- `password` (string) - User's password

**Returns:**
```javascript
{
    success: true/false,
    message: "Success/error message",
    user: { id, email, full_name, avatar_url } // if success
}
```

**Example:**
```javascript
const result = await window.swapitAuth.signIn(
    'user@example.com',
    'password123'
);
```

---

#### signOut()
Logs out the current user and destroys the session.

**Returns:**
```javascript
{
    success: true/false,
    message: "Success/error message"
}
```

**Example:**
```javascript
await window.swapitAuth.signOut();
window.location.href = '../index.html';
```

---

#### resetPassword(email)
Sends a password reset link to the user's email.

**Parameters:**
- `email` (string) - User's email address

**Returns:**
```javascript
{
    success: true/false,
    message: "Success/error message"
}
```

**Example:**
```javascript
const result = await window.swapitAuth.resetPassword('user@example.com');
```

---

#### updateProfile(updates)
Updates the current user's profile information.

**Parameters:**
- `updates` (object) - Object containing fields to update
  - `full_name` (string, optional)
  - `avatar_url` (string, optional)
  - Other profile fields as needed

**Returns:**
```javascript
{
    success: true/false,
    message: "Success/error message",
    user: { /* updated user data */ } // if success
}
```

**Example:**
```javascript
const result = await window.swapitAuth.updateProfile({
    full_name: 'Jane Doe',
    avatar_url: 'data:image/png;base64,...'
});
```

---

#### checkSession()
Validates the current session with the server.

**Returns:**
```javascript
{
    success: true/false,
    authenticated: true/false,
    user: { /* user data */ } // if authenticated
}
```

**Example:**
```javascript
const result = await window.swapitAuth.checkSession();
if (result.authenticated) {
    console.log('User is logged in');
}
```

---

#### getUser()
Gets the current user data from sessionStorage.

**Returns:**
- User object if logged in
- `null` if not logged in

**Example:**
```javascript
const user = window.swapitAuth.getUser();
if (user) {
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
}
```

---

#### isAuthenticated()
Checks if a user is currently logged in.

**Returns:**
- `true` if logged in
- `false` if not logged in

**Example:**
```javascript
if (window.swapitAuth.isAuthenticated()) {
    // User is logged in
    loadDashboard();
} else {
    // User is not logged in
    window.location.href = 'login.html';
}
```

## Session Storage

The authentication system uses `sessionStorage` to maintain user state across pages:

**Stored Data:**
```javascript
sessionStorage.setItem('swapit_user', JSON.stringify({
    id: 123,
    email: 'user@example.com',
    full_name: 'John Doe',
    avatar_url: 'data:image/...'
}));
```

**Note:** Session data is automatically cleared when:
- User logs out
- Browser tab/window is closed
- User's session expires on the server

## Backend Requirements (auth.php)

The PHP backend must handle these actions:

### signup
```php
// Expected POST data:
{
    action: 'signup',
    email: 'user@example.com',
    password: 'password123',
    full_name: 'John Doe'
}

// Response:
{
    success: true,
    message: 'Account created successfully',
    user: { id: 123, email: '...', full_name: '...' }
}
```

### signin
```php
// Expected POST data:
{
    action: 'signin',
    email: 'user@example.com',
    password: 'password123'
}

// Response:
{
    success: true,
    message: 'Login successful',
    user: { id: 123, email: '...', full_name: '...', avatar_url: '...' }
}
```

### signout
```php
// Expected POST data:
{
    action: 'signout'
}

// Response:
{
    success: true,
    message: 'Logged out successfully'
}
```

### reset_password
```php
// Expected POST data:
{
    action: 'reset_password',
    email: 'user@example.com'
}

// Response:
{
    success: true,
    message: 'Password reset email sent'
}
```

### update_profile
```php
// Expected POST data:
{
    action: 'update_profile',
    full_name: 'John Doe',
    avatar_url: 'data:image/...'
}

// Response:
{
    success: true,
    message: 'Profile updated',
    user: { /* updated user data */ }
}
```

### check_session
```php
// Expected GET data:
?action=check_session

// Response:
{
    success: true,
    authenticated: true,
    user: { /* user data */ }
}
```

## Security Considerations

1. **Password Hashing:**
   - Use `password_hash()` in PHP for storing passwords
   - Use `password_verify()` for checking passwords

2. **Session Security:**
   - Use `session_start()` with secure settings
   - Regenerate session ID after login
   - Set session timeout

3. **Input Validation:**
   - Validate email format
   - Enforce password requirements (min 6 characters)
   - Sanitize all user inputs

4. **CSRF Protection:**
   - Consider adding CSRF tokens to forms
   - Validate request origin

5. **HTTPS:**
   - Always use HTTPS in production
   - Secure session cookies

## Error Handling

All methods use try-catch blocks and return standardized responses:

```javascript
try {
    const result = await window.swapitAuth.signIn(email, password);
    if (result.success) {
        // Handle success
    } else {
        // Handle error with result.message
    }
} catch (error) {
    // Handle network/unexpected errors
    console.error(error);
    alert('An error occurred: ' + error.message);
}
```

## Page Integration Checklist

For any new protected page:

1. ✅ Include `auth-client.js` script
2. ✅ Create page-specific JS file
3. ✅ Check authentication on page load
4. ✅ Redirect to login if not authenticated
5. ✅ Load and display user data
6. ✅ Handle logout functionality

## Example: Complete Protected Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page - SwapIt</title>
    <link rel="stylesheet" href="../assets/css/styles.css">
    <script src="../assets/js/auth-client.js"></script>
</head>
<body>
    <div id="content">
        <h1 id="welcomeMessage"></h1>
        <button id="logoutBtn">Logout</button>
    </div>

    <script>
        // Check authentication
        if (!window.swapitAuth.isAuthenticated()) {
            window.location.href = 'login.html';
        } else {
            // Display user info
            const user = window.swapitAuth.getUser();
            document.getElementById('welcomeMessage').textContent = 
                `Welcome, ${user.full_name || user.email}!`;
            
            // Setup logout
            document.getElementById('logoutBtn').addEventListener('click', async () => {
                await window.swapitAuth.signOut();
                window.location.href = '../index.html';
            });
        }
    </script>
</body>
</html>
```

## Troubleshooting

### User Not Staying Logged In
- Check if `sessionStorage` is being cleared
- Verify backend session is active
- Check session timeout settings

### Login Not Working
- Verify auth.php is accessible
- Check database credentials
- Verify password hashing matches

### Redirect Loops
- Ensure login.html doesn't check auth on load
- Verify isAuthenticated() returns correct values
- Check session data in sessionStorage

### CORS Errors
- Verify API endpoint is on same domain
- If different domain, configure CORS headers in auth.php

---

**Last Updated:** After Supabase removal
**Status:** Production Ready ✅
