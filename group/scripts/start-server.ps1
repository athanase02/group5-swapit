# SwapIt Development Server Startup Script
# This script starts PHP's built-in server with proper routing

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting SwapIt Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at:" -ForegroundColor Green
Write-Host "  Local:   http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Network: http://${localIP}:3000" -ForegroundColor Magenta
Write-Host ""
Write-Host "Example pages:" -ForegroundColor Green
Write-Host "  http://${localIP}:3000/server-check.html" -ForegroundColor White
Write-Host "  http://${localIP}:3000/pages/signup.html" -ForegroundColor White
Write-Host "  http://${localIP}:3000/pages/login.html" -ForegroundColor White
Write-Host ""
Write-Host "API endpoints:" -ForegroundColor Green
Write-Host "  http://${localIP}:3000/api/test.php" -ForegroundColor White
Write-Host "  http://${localIP}:3000/api/auth.php" -ForegroundColor White
Write-Host ""
Write-Host "NOTE: Run this script from the project root directory" -ForegroundColor Cyan
Write-Host "      cd C:\Users\Athanase\Downloads\swapit_version_1" -ForegroundColor Cyan
Write-Host "      .\scripts\start-server.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project root if we're in scripts directory
if ((Get-Location).Path -like "*\scripts") {
    Set-Location ..
    Write-Host "Changed to project root: $(Get-Location)" -ForegroundColor Green
    Write-Host ""
}

# Check if PHP is available
if (!(Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: PHP is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install XAMPP or PHP and try again" -ForegroundColor Red
    Write-Host ""
    Write-Host "If using XAMPP, add this to PATH:" -ForegroundColor Yellow
    Write-Host "  C:\xampp\php" -ForegroundColor White
    pause
    exit 1
}

# Check if MySQL is running
Write-Host "Checking MySQL connection..." -ForegroundColor Cyan
try {
    $mysqlCheck = & mysql -u root -e "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL is running" -ForegroundColor Green
    } else {
        Write-Host "✗ MySQL may not be running. Start it in XAMPP Control Panel" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ MySQL check failed. Make sure it's running" -ForegroundColor Yellow
}

Write-Host ""

# Start the server on all network interfaces (0.0.0.0)
php -S 0.0.0.0:3000 -t public router.php
