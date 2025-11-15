<?php
/**
 * Google OAuth Configuration
 * 
 * To set up Google Sign-In:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing one
 * 3. Enable Google+ API
 * 4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
 * 5. Add authorized JavaScript origins:
 *    - http://localhost:3000
 *    - http://localhost:8000
 * 6. Add authorized redirect URIs:
 *    - http://localhost:3000/pages/signup.html
 *    - http://localhost:3000/pages/login.html
 * 7. Copy the Client ID and paste below
 */

// Replace with your actual Google OAuth Client ID
define('GOOGLE_CLIENT_ID', '192017179678-h09621pfp20m4c68idini6j4nattsgqk.apps.googleusercontent.com');

// Optional: Add Client Secret if needed for server-side verification
define('GOOGLE_CLIENT_SECRET', 'YOUR_GOOGLE_CLIENT_SECRET');

return [
    'client_id' => GOOGLE_CLIENT_ID,
    'client_secret' => GOOGLE_CLIENT_SECRET,
];
?>
