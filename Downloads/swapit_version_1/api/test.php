<?php
// Test database connection
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once dirname(__DIR__) . '/config/db.php';

$response = [
    'success' => false,
    'message' => '',
    'php_version' => phpversion(),
    'time' => date('Y-m-d H:i:s')
];

try {
    // Test database connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Test query to check database
    $result = $conn->query("SELECT DATABASE() as db_name");
    if ($result) {
        $row = $result->fetch_assoc();
        $response['success'] = true;
        $response['message'] = 'Database connection successful';
        $response['database'] = $row['db_name'];
        
        // Count users
        $userCount = $conn->query("SELECT COUNT(*) as count FROM users");
        if ($userCount) {
            $count = $userCount->fetch_assoc();
            $response['user_count'] = $count['count'];
        }
    }
} catch (Exception $e) {
    $response['message'] = 'Database connection failed: ' . $e->getMessage();
}

echo json_encode($response);
?>
