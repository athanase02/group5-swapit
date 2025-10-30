<?php
session_start();
if(isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Login - Attendance System</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h2>Login to View Attendance</h2>
    <form method="POST" action="dashboard.php">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit" name="login">Login</button>
    </form>
  </div>
</body>
</html>