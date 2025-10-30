<?php
include('database.php');
session_start();

if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = md5($_POST['password']);

    $query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
    } else {
        echo "<p style='color:red;'>Invalid login details!</p>";
    }
}

if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$query = "SELECT s.session_date, s.course_name, s.session_type, s.comment, a.status
          FROM attendance a
          JOIN sessions s ON a.session_id = s.session_id
          WHERE a.user_id = '$user_id'
          ORDER BY s.session_date DESC";
$result = $conn->query($query);
?>

<!DOCTYPE html>
<html>
<head>
<title>Dashboard</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h2>Welcome, <?php echo $_SESSION['username']; ?></h2>
<table>
  <tr>
    <th>Date</th>
    <th>Course</th>
    <th>Session Type</th>
    <th>Status</th>
    <th>Comments</th>
  </tr>
  <?php while($row = $result->fetch_assoc()) { ?>
  <tr>
    <td><?php echo $row['session_date']; ?></td>
    <td><?php echo $row['course_name']; ?></td>
    <td><?php echo ucfirst($row['session_type']); ?></td>
    <td><?php echo $row['status']; ?></td>
    <td><?php echo $row['comment']; ?></td>
  </tr>
  <?php } ?>
</table>
</body>
</html>
