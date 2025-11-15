#  Google Authentication Setup Guide

## Overview
This guide will help you set up Google Sign-In for your SwapIt application.

## Prerequisites
- Google Account
- SwapIt application running locally

---

## Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create New Project
1. Click on the project dropdown at the top
2. Click "New Project"
3. Enter project name: `SwapIt-Auth`
4. Click "Create"

---

## Step 2: Enable Google Sign-In API

### 2.1 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "People API"
3. Click on it and press **Enable**

---

## Step 3: Create OAuth 2.0 Credentials

### 3.1 Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Click **Create**
4. Fill in the required information:
   - **App name:** SwapIt
   - **User support email:** your-email@example.com
   - **Developer contact email:** your-email@example.com
5. Click **Save and Continue**
6. Skip "Scopes" (click **Save and Continue**)
7. Add test users (your email)
8. Click **Save and Continue**

### 3.2 Create OAuth Client ID
1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Fill in the details:
   - **Name:** SwapIt Web Client
   
5. **Authorized JavaScript origins:** Add these URLs:
   ```
   http://localhost:3000
   http://localhost:8000
   http://localhost
   ```

6. **Authorized redirect URIs:** Add these URLs:
   ```
   http://localhost:3000/pages/signup.html
   http://localhost:3000/pages/login.html
   http://localhost:3000/pages/dashboard.html
   ```

7. Click **Create**
8. **IMPORTANT:** Copy the **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

---

## Step 4: Configure SwapIt Application

### 4.1 Update Configuration File
1. Open `config/google-oauth.php`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:
   ```php
   define('GOOGLE_CLIENT_ID', '123456789-abcdefg.apps.googleusercontent.com');
   ```

### 4.2 Update Frontend Configuration
1. Open `public/pages/signup.html`
2. Find this line:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```
3. Replace it with your actual Client ID:
   ```javascript
   const GOOGLE_CLIENT_ID = '123456789-abcdefg.apps.googleusercontent.com';
   ```

### 4.3 Update Login Page (if exists)
Repeat the same process for `public/pages/login.html`

---

## Step 5: Test Google Sign-In

### 5.1 Start Your Server
```powershell
cd "C:\Users\Athanase\Downloads\swapit_version_1"
.\start-server.ps1
```

### 5.2 Access Signup Page
Open: http://localhost:3000/pages/signup.html

### 5.3 Click "Sign in with Google"
1. Click the Google button
2. Select your Google account
3. Grant permissions
4. You should be redirected to the dashboard

---

## How It Works

### Frontend Flow:
1. User clicks "Sign in with Google" button
2. Google Sign-In popup appears
3. User selects account and grants permissions
4. Google returns a JWT credential
5. Frontend sends credential to backend

### Backend Flow:
1. Receives Google JWT credential
2. Decodes and validates the token
3. Extracts user information (email, name, picture)
4. Checks if user exists in database:
   - **Exists:** Log them in
   - **New:** Create account with Google info
5. Creates PHP session
6. Returns success response

---

## Security Features

✅ **Email Verification:** Google-verified emails are marked as verified  
✅ **Secure Tokens:** JWT tokens are validated  
✅ **No Password Storage:** Google users don't need passwords  
✅ **Profile Pictures:** Automatically imported from Google  
✅ **Session Management:** Standard PHP sessions  

---

## Database Changes

### Users Table
- Google users have random generated passwords (never used)
- `is_verified` set to TRUE for Google accounts

### Profiles Table
- `avatar_url` stores Google profile picture
- Automatically created on first Google sign-in

---

## Troubleshooting

### Issue: "Google Sign-In not working"
**Solutions:**
1. Check Client ID is correct in both frontend and backend
2. Verify authorized origins include your localhost URL
3. Check browser console for errors
4. Clear browser cache and cookies

### Issue: "Redirect URI mismatch"
**Solution:**
- Add the exact URL shown in error to authorized redirect URIs
- URL must match exactly (including http/https, port, path)

### Issue: "Access blocked: This app's request is invalid"
**Solution:**
- Complete OAuth consent screen configuration
- Add test users (your email) in consent screen
- Wait a few minutes for changes to propagate

### Issue: "idpiframe_initialization_failed"
**Solution:**
- Enable cookies in browser
- Check if accessing via http://localhost (not file://)
- Disable ad blockers temporarily

---

## Testing Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Client ID created and copied
- [ ] Authorized origins added
- [ ] Redirect URIs added
- [ ] Client ID updated in `google-oauth.php`
- [ ] Client ID updated in `signup.html`
- [ ] Server running on correct port
- [ ] Can see Google button on signup page
- [ ] Clicking Google button opens popup
- [ ] Can select Google account
- [ ] Redirects to dashboard after sign-in
- [ ] User created in database
- [ ] Profile picture imported

---

## Production Deployment

When deploying to production:

1. **Update OAuth Credentials:**
   - Add production domain to authorized origins
   - Add production URLs to redirect URIs
   - Example: `https://yourdomain.com`

2. **Environment Variables:**
   Consider using environment variables:
   ```php
   define('GOOGLE_CLIENT_ID', getenv('GOOGLE_CLIENT_ID'));
   ```

3. **Token Verification:**
   For production, implement proper JWT signature verification
   - Use Google's token verification library
   - Verify token signature and expiry

4. **HTTPS Required:**
   - Google OAuth requires HTTPS in production
   - Use SSL certificate (Let's Encrypt)

---

## Additional Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google API Console](https://console.cloud.google.com/)

---

## Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Check PHP error logs
3. Verify database connection
4. Test with different Google accounts
5. Try incognito/private browsing mode

---

**Last Updated:** November 14, 2025  
**Status:** ✅ Google Authentication Configured
