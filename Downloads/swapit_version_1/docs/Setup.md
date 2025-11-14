# Setup (Quick)

Prerequisites:
- PHP 7.4+ (XAMPP on Windows is fine)
- MySQL (included with XAMPP)

Steps:
- MySQL database:
- Start MySQL service in XAMPP
- Import database schema: `mysql -u root < db/schema.sql`
- Or use phpMyAdmin to import `db/schema.sql`
- Update credentials in `config/db.php` if needed (host/user/password/DB name)
- Database `SI2025` will be created with demo user

Run locally:
- **Recommended:** Use the startup script:
	- ``start-server.ps1`` or ``start-server.bat``
	- Server runs on ``http://localhost:3000``
- **Manual:** Use PHP's built-in server with router:
	- ``C:\xampp\php\php.exe -S localhost:3000 -t public router.php``
- **XAMPP:** Serve via Apache (document root pointing to ``public/``)

**Important:** The ``router.php`` script is required for API endpoints to work when using PHP's built-in server.

Test the setup:
- Open ``http://localhost:3000/server-check.html`` for quick diagnostics
- Open ``http://localhost:3000/test-signup.html`` to test all endpoints
- Or navigate to ``http://localhost:3000/pages/signup.html`` to create an account
- Demo user: demo@ashesi.edu.gh / demo123

**Troubleshooting:**
- If you get "Failed to fetch", see ``TROUBLESHOOTING.md``
- Ensure you're accessing via ``http://`` not ``file://``

Notes:
- API endpoints live in `api/` (e.g., `auth.php`)
- Static pages and JS live in `public/`
- If DB name differs, align `db/schema.sql` and `config/db.php` accordingly
