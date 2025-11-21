<?php
// Database configuration
// Database name: SI2025 (SwapIt 2025)
$host = "localhost";
$username = "root"; // your MySQL username
$password = ""; // your MySQL password - try empty first
$database = "SI2025";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to ensure proper handling of special characters
$conn->set_charset("utf8mb4");
?>
