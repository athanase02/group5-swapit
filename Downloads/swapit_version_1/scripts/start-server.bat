@echo off
REM SwapIt Development Server Startup Script
REM This script starts PHP's built-in server with proper routing

echo ========================================
echo Starting SwapIt Development Server
echo ========================================
echo.
echo Server will be available at:
echo   Local:   http://localhost:3000
echo   Network: http://YOUR_IP:3000
echo.
echo Note: Use ipconfig to find your IP address
echo Other devices can access via http://YOUR_IP:3000
echo.
echo Example pages:
echo   http://YOUR_IP:3000/server-check.html
echo   http://YOUR_IP:3000/pages/signup.html
echo   http://YOUR_IP:3000/pages/login.html
echo.
echo API endpoints:
echo   http://YOUR_IP:3000/api/test.php
echo   http://YOUR_IP:3000/api/auth.php
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

php -S 0.0.0.0:3000 -t public router.php
