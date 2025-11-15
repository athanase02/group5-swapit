# Add Windows Firewall Rule for SwapIt Server
# Run this script as Administrator

Write-Host "Adding firewall rule for SwapIt Dev Server..." -ForegroundColor Cyan

try {
    New-NetFirewallRule -DisplayName "SwapIt Dev Server" `
                        -Direction Inbound `
                        -LocalPort 3000 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any `
                        -ErrorAction Stop
    
    Write-Host "Firewall rule added successfully!" -ForegroundColor Green
    Write-Host "Port 3000 is now accessible from other devices on your network." -ForegroundColor Green
} catch {
    Write-Host "Failed to add firewall rule." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run this script as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "3. Run: .\add-firewall-rule.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
