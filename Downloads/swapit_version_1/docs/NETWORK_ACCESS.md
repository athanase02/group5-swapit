# Network Access Setup Guide

This guide explains how to access your SwapIt application from other devices on the same network.

## Your Machine's IP Address

**Current IP Address:** `172.16.8.49`

## Quick Start

### 1. Start the Server
Run the startup script as usual:
```powershell
.\start-server.ps1
```

The server now binds to `0.0.0.0:3000` which means it accepts connections from any network interface.

### 2. Access from Other Devices

From any device on the same network (phone, tablet, another computer), use:

**Base URL:** `http://172.16.8.49:3000`

**Example URLs:**
- Home: `http://172.16.8.49:3000/home.html`
- Signup: `http://172.16.8.49:3000/pages/signup.html`
- Login: `http://172.16.8.49:3000/pages/login.html`
- Browse: `http://172.16.8.49:3000/pages/browse.html`
- Dashboard: `http://172.16.8.49:3000/pages/dashboard.html`
- API Test: `http://172.16.8.49:3000/api/test.php`

## Firewall Configuration

### Windows Firewall

If other devices cannot connect, you need to allow incoming connections on port 3000:

**Option 1: PowerShell (Run as Administrator)**
```powershell
New-NetFirewallRule -DisplayName "SwapIt Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

**Option 2: Windows Defender Firewall GUI**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `3000` → Next
6. Select "Allow the connection" → Next
7. Check all profiles (Domain, Private, Public) → Next
8. Name: "SwapIt Dev Server" → Finish

### Verify Firewall Rule
```powershell
Get-NetFirewallRule -DisplayName "SwapIt Dev Server" | Format-List
```

## Troubleshooting

### Check if Server is Running
```powershell
netstat -ano | Select-String ":3000"
```
You should see `0.0.0.0:3000` or `[::]:3000` in the output.

### Find Your Current IP Address
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (Wi-Fi or Ethernet).

Or use:
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}
```

### Test from Another Device

**Ping Test:**
From another device on the network:
```bash
ping 172.16.8.49
```

**Browser Test:**
Open a browser and visit:
```
http://172.16.8.49:3000/api/test.php
```

You should see a JSON response confirming database connection.

### Common Issues

**Issue:** "This site can't be reached"
- **Solution:** Check Windows Firewall settings above
- Ensure both devices are on the same network
- Verify the server is running

**Issue:** IP address has changed
- **Solution:** Your IP address may change if using DHCP. Run `ipconfig` to get the current IP.
- Consider setting a static IP in your router settings.

**Issue:** CORS errors in browser console
- **Solution:** This is expected for some cross-origin requests. The main pages should work fine.

## Network Types

### Same Wi-Fi Network
Both devices must be connected to the same Wi-Fi network. This is the most common setup.

### Ethernet Network
If your computer is connected via Ethernet and you're accessing from a wireless device, they must be on the same subnet.

### Mobile Hotspot
If using your phone as a hotspot:
- Connect your computer to the phone's hotspot
- Use the IP address shown in `ipconfig`
- Access from the phone at `http://192.168.x.x:3000`

## Security Considerations

⚠️ **Important:** This setup is for development only.

- The server accepts connections from any IP on your local network
- No HTTPS encryption (use HTTP only)
- Session cookies work over HTTP in development
- **Do not expose port 3000 to the internet**
- Only use on trusted networks (home, office)

## Testing with Mobile Devices

### iOS (iPhone/iPad)
1. Connect to same Wi-Fi as your computer
2. Open Safari
3. Navigate to `http://172.16.8.49:3000/pages/signup.html`

### Android
1. Connect to same Wi-Fi as your computer
2. Open Chrome or any browser
3. Navigate to `http://172.16.8.49:3000/pages/signup.html`

### Browser DevTools on Mobile
- iOS Safari: Settings → Safari → Advanced → Web Inspector
- Android Chrome: Enable USB debugging and use chrome://inspect

## Advanced Configuration

### Using Different Port
To use a different port (e.g., 8080):

Edit `start-server.ps1`:
```powershell
php -S 0.0.0.0:8080 -t public router.php
```

Update firewall rule accordingly.

### Static IP Address

To prevent IP changes, set a static IP in your router:
1. Access your router admin panel (usually 192.168.1.1)
2. Find DHCP/LAN settings
3. Reserve IP for your computer's MAC address
4. Or set static IP in Windows network settings

## Removing Firewall Rule

When done with development:
```powershell
Remove-NetFirewallRule -DisplayName "SwapIt Dev Server"
```

## Summary

✅ Server binds to `0.0.0.0:3000` (all network interfaces)
✅ Your IP: `172.16.8.49`
✅ Network URL: `http://172.16.8.49:3000`
✅ Firewall: Allow port 3000 TCP inbound
✅ Same network required for all devices
