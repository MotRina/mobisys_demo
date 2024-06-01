<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'];
$selections = $data['selections'];

// Delete previous selections for the user
$stmt_delete = $conn->prepare("DELETE FROM selections WHERE user_id = ?");
$stmt_delete->bind_param("i", $user_id);
$stmt_delete->execute();
$stmt_delete->close();

$stmt = $conn->prepare("INSERT INTO selections (user_id, image_path, classification, correct_class) VALUES (?, ?, ?, ?)");

if ($stmt === false) {
    die("Prepare failed: " . $conn->error);
}

foreach ($selections as $selection) {
    // Ensure the image path is relative
    $image_path = str_replace('/home/s21803rm/public_html/LostCat/start/', '', $selection['image_path']);
    $classification = $selection['classification'];
    // Correct class determination
    $correct_class = (strpos($image_path, 'pet') !== false) ? 'Pet Cat' : 'Stray Cat';
    $stmt->bind_param("isss", $user_id, $image_path, $classification, $correct_class);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to save image selection: " . $stmt->error]);
        exit();
    }
}

$stmt->close();
$conn->close();

echo json_encode(["status" => "success"]);
?>
