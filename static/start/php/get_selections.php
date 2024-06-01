<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', '/home/s21803rm/public_html/LostCat/start/php_error_log.txt');

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

session_start();
$user_id = $_SESSION['user_id'];

if (!$user_id) {
    error_log("No user ID found in session.");
    die("No user ID found in session.");
}

$stmt = $conn->prepare("SELECT image_path, classification, correct_class FROM selections WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$selections = [];
while ($row = $result->fetch_assoc()) {
    $original_path = $row['image_path'];
    $relative_path = str_replace('/home/s21803rm/public_html/LostCat/start', '.', $original_path);
    error_log("Original path: $original_path, Adjusted path: $relative_path");
    $row['image_path'] = $relative_path;
    $selections[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($selections);
?>
