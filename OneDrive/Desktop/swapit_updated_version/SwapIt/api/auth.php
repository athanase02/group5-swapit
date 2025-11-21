<?php
// Configure session to persist across page navigation
ini_set('session.cookie_lifetime', 86400); // 24 hours
ini_set('session.cookie_path', '/');
ini_set('session.cookie_httponly', 1);
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
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
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT id, email, password_hash, full_name, avatar_url FROM users WHERE email = ?");
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
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'full_name' => $user['full_name'],
                    'avatar_url' => $user['avatar_url']
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
    
    // Validate inputs
    if (empty($email) || empty($password) || empty($fullName)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
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
    // Clear all session variables
    $_SESSION = array();
    
    // Delete the session cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time()-3600, '/');
    }
    
    // Destroy the session
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit;
}

// Handle profile update
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'update_profile') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }
    
    $userId = $_SESSION['user_id'];
    $updates = [];
    $types = "";
    $params = [];
    
    // Handle avatar_url update
    if (isset($_POST['avatar_url'])) {
        $avatarUrl = $_POST['avatar_url'];
        $updates[] = "avatar_url = ?";
        $types .= "s";
        $params[] = $avatarUrl;
    }
    
    // Handle full_name update
    if (isset($_POST['full_name'])) {
        $fullName = sanitize_input($_POST['full_name']);
        $updates[] = "full_name = ?";
        $types .= "s";
        $params[] = $fullName;
        $_SESSION['full_name'] = $fullName;
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No updates provided']);
        exit;
    }
    
    try {
        // Update users table
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $types .= "i";
        $params[] = $userId;
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception('Database prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception('Database execute failed: ' . $stmt->error);
        }
        
        // Get updated user data
        $stmt = $conn->prepare("SELECT id, email, full_name, avatar_url FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    } catch (Exception $e) {
        error_log('Profile update error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to update profile: ' . $e->getMessage()]);
    }
    exit;
}

// Handle listing creation
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'create_listing') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
        exit;
    }

    try {
        $user_id = $_SESSION['user_id'];
        $title = sanitize_input($_POST['title']);
        $description = sanitize_input($_POST['description']);
        $category = sanitize_input($_POST['category']);
        $price = floatval($_POST['price']);
        $location = sanitize_input($_POST['location']);
        $image_url = isset($_POST['image_url']) ? $_POST['image_url'] : null;
        
        // Validate required fields
        if (empty($title)) {
            echo json_encode(['success' => false, 'message' => 'Title is required']);
            exit;
        }
        
        if (empty($category)) {
            echo json_encode(['success' => false, 'message' => 'Category is required']);
            exit;
        }

        // Get category_id from category name
        $category_stmt = $conn->prepare("SELECT id FROM categories WHERE name = ?");
        $category_stmt->bind_param("s", $category);
        $category_stmt->execute();
        $category_result = $category_stmt->get_result();
        
        if ($category_result->num_rows === 0) {
            // Default to "Other" category if not found
            $category_stmt = $conn->prepare("SELECT id FROM categories WHERE name = 'Other'");
            $category_stmt->execute();
            $category_result = $category_stmt->get_result();
        }
        
        $category_data = $category_result->fetch_assoc();
        $category_id = $category_data['id'];

        // Prepare image URLs as JSON (single image for now)
        $image_urls_json = $image_url ? json_encode([$image_url]) : json_encode([]);

        // Insert the listing
        $stmt = $conn->prepare("INSERT INTO items (title, description, category_id, condition_status, price, location, image_urls, owner_id, status, created_at) VALUES (?, ?, ?, 'Good', ?, ?, ?, ?, 'available', NOW())");
        $stmt->bind_param("ssidssi", $title, $description, $category_id, $price, $location, $image_urls_json, $user_id);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to create listing: ' . $stmt->error);
        }
        
        $listing_id = $conn->insert_id;

        echo json_encode([
            'success' => true,
            'message' => 'Listing created successfully',
            'listing_id' => $listing_id
        ]);
    } catch (Exception $e) {
        error_log('Create listing error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to create listing: ' . $e->getMessage()]);
    }
    exit;
}

// Handle order creation
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'create_order') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
        exit;
    }

    try {
        $user_id = $_SESSION['user_id'];
        $items = json_decode($_POST['items'], true);
        $pickup_at = sanitize_input($_POST['pickup_at']);
        
        if (empty($items)) {
            echo json_encode(['success' => false, 'message' => 'No items in order']);
            exit;
        }
        
        if (empty($pickup_at)) {
            echo json_encode(['success' => false, 'message' => 'Pickup date/time is required']);
            exit;
        }

        // Begin transaction
        $conn->begin_transaction();

        $created_requests = [];

        // Create a swap request for each item in the cart
        foreach ($items as $item) {
            $item_id = $item['id'];
            
            // Get item owner
            $owner_stmt = $conn->prepare("SELECT owner_id FROM items WHERE id = ?");
            $owner_stmt->bind_param("i", $item_id);
            $owner_stmt->execute();
            $owner_result = $owner_stmt->get_result();
            
            if ($owner_result->num_rows === 0) {
                throw new Exception('Item not found: ' . $item_id);
            }
            
            $owner_data = $owner_result->fetch_assoc();
            $owner_id = $owner_data['owner_id'];

            // Create swap request
            $stmt = $conn->prepare("INSERT INTO swap_requests (item_id, requester_id, owner_id, pickup_datetime, status, created_at) VALUES (?, ?, ?, ?, 'pending', NOW())");
            $stmt->bind_param("iiis", $item_id, $user_id, $owner_id, $pickup_at);
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to create swap request for item: ' . $item_id);
            }
            
            $created_requests[] = $conn->insert_id;
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'request_ids' => $created_requests,
            'total_items' => count($created_requests)
        ]);
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()]);
    }
    exit;
}

// Check auth status
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['action']) && $_GET['action'] == 'check_auth') {
    // Get user data including avatar_url
    if (isset($_SESSION['user_id'])) {
        $stmt = $conn->prepare("SELECT id, email, full_name, avatar_url FROM users WHERE id = ?");
        $stmt->bind_param("i", $_SESSION['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'authenticated' => true,
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'authenticated' => false,
            'user' => null
        ]);
    }
    exit;
}
?>