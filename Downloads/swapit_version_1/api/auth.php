<?php
session_start();
header('Content-Type: application/json');
require_once dirname(__DIR__) . '/config/db.php';

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Handle login
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'login') {
    $email = sanitize_input($_POST['email']);
    $password = $_POST['password'];
    
    $stmt = $conn->prepare("SELECT id, email, password_hash, full_name FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['full_name'] = $user['full_name'];
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'full_name' => $user['full_name']
                ]
            ]);
            exit;
        }
    }
    
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

// Handle signup
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'signup') {
    $email = sanitize_input($_POST['email']);
    $password = $_POST['password'];
    $fullName = sanitize_input($_POST['full_name']);
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }
    
    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Begin transaction
    $conn->begin_transaction();
    
    try {
        // Insert into users table
        $stmt = $conn->prepare("INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $email, $passwordHash, $fullName);
        $stmt->execute();
        $userId = $conn->insert_id;
        
        // Create profile
        $stmt = $conn->prepare("INSERT INTO profiles (user_id, full_name, email) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $userId, $fullName, $email);
        $stmt->execute();
        
        $conn->commit();
        
        // Auto-login after successful signup
        $_SESSION['user_id'] = $userId;
        $_SESSION['email'] = $email;
        $_SESSION['full_name'] = $fullName;
        
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => $userId,
                'email' => $email,
                'full_name' => $fullName
            ]
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
    }
    exit;
}

// Handle Google Sign-In
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'google_signin') {
    $credential = $_POST['credential'] ?? '';
    
    if (empty($credential)) {
        echo json_encode(['success' => false, 'message' => 'No credential provided']);
        exit;
    }
    
    try {
        // Decode the JWT token (Google ID Token)
        // Note: In production, you should verify the token signature
        $parts = explode('.', $credential);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        // Decode the payload (second part of JWT)
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        
        if (!$payload || !isset($payload['email'])) {
            throw new Exception('Invalid token payload');
        }
        
        $email = sanitize_input($payload['email']);
        $fullName = sanitize_input($payload['name'] ?? 'Google User');
        $googleId = sanitize_input($payload['sub'] ?? '');
        $picture = $payload['picture'] ?? null;
        $emailVerified = $payload['email_verified'] ?? false;
        
        // Check if user already exists
        $stmt = $conn->prepare("SELECT id, email, full_name FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // User exists, log them in
            $user = $result->fetch_assoc();
            $userId = $user['id'];
            
            // Update profile picture if provided
            if ($picture) {
                $stmt = $conn->prepare("UPDATE profiles SET avatar_url = ? WHERE user_id = ?");
                $stmt->bind_param("si", $picture, $userId);
                $stmt->execute();
            }
        } else {
            // Create new user
            $conn->begin_transaction();
            
            try {
                // For Google sign-in, we don't have a password, so generate a random one
                $randomPassword = bin2hex(random_bytes(32));
                $passwordHash = password_hash($randomPassword, PASSWORD_DEFAULT);
                
                // Insert into users table
                $stmt = $conn->prepare("INSERT INTO users (email, password_hash, full_name, is_verified) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("sssi", $email, $passwordHash, $fullName, $emailVerified);
                $stmt->execute();
                $userId = $conn->insert_id;
                
                // Create profile with Google picture
                $stmt = $conn->prepare("INSERT INTO profiles (user_id, full_name, email, avatar_url) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("isss", $userId, $fullName, $email, $picture);
                $stmt->execute();
                
                $conn->commit();
            } catch (Exception $e) {
                $conn->rollback();
                throw new Exception('Failed to create user account');
            }
        }
        
        // Create session
        $_SESSION['user_id'] = $userId;
        $_SESSION['email'] = $email;
        $_SESSION['full_name'] = $fullName;
        $_SESSION['google_user'] = true;
        
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => $userId,
                'email' => $email,
                'full_name' => $fullName
            ]
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Google authentication failed: ' . $e->getMessage()
        ]);
    }
    
    exit;
}

// Handle logout
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

// Check session status
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['action']) && $_GET['action'] == 'check-session') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => $_SESSION['user_id'],
                'email' => $_SESSION['email'],
                'full_name' => $_SESSION['full_name']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'data' => null
        ]);
    }
    exit;
}

// Check auth status
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['action']) && $_GET['action'] == 'check_auth') {
    echo json_encode([
        'success' => true,
        'authenticated' => isset($_SESSION['user_id']),
        'user' => isset($_SESSION['user_id']) ? [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['email'],
            'full_name' => $_SESSION['full_name']
        ] : null
    ]);
    exit;
}
?>