<?php
session_start();
require_once '../config/db.php';

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
            
            echo json_encode(['success' => true]);
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
        echo json_encode(['success' => true]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
    }
    exit;
}

// Handle logout
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
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