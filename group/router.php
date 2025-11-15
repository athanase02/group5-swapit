<?php
/**
 * Router script for PHP built-in web server
 * This allows serving from public/ directory while accessing api/ files
 * 
 * Usage: php -S localhost:8000 -t public router.php
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Check if request is for API files
if (preg_match('#^/(\.\./)?api/(.+)\.php$#', $uri, $matches)) {
    // API request - serve from parent directory
    $apiFile = __DIR__ . '/api/' . $matches[2] . '.php';
    
    if (file_exists($apiFile)) {
        // Set current directory to project root for includes to work
        chdir(__DIR__);
        // Set the working directory so relative paths work correctly
        $_SERVER['DOCUMENT_ROOT'] = __DIR__;
        require $apiFile;
        return true;
    }
    
    // API file not found
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'API endpoint not found']);
    return true;
}

// For static files in public directory, return false to let PHP serve them
if (file_exists(__DIR__ . '/public' . $uri)) {
    return false;
}

// Check if file exists in public directory with .html extension
if (file_exists(__DIR__ . '/public' . $uri . '.html')) {
    return false;
}

// 404 for everything else
http_response_code(404);
echo '<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #e74c3c; }
    </style>
</head>
<body>
    <h1>404 - Not Found</h1>
    <p>The requested URL was not found on this server.</p>
    <p><a href="/">Go to home page</a></p>
</body>
</html>';
return true;
