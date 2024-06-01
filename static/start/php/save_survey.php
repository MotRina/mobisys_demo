<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Log received data for debugging
file_put_contents('log.txt', file_get_contents('php://input'), FILE_APPEND);

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'];
$responses = $data['responses'];

$stmt = $conn->prepare("INSERT INTO survey_responses (user_id, image_path, features) VALUES (?, ?, ?)");

if ($stmt === false) {
    die("Prepare failed: " . $conn->error);
}

foreach ($responses as $response) {
    $image_path = $response['image'];
    $features = $response['features'];
    $stmt->bind_param("iss", $user_id, $image_path, $features);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to save survey response: " . $stmt->error]);
        exit();
    }
}

$stmt->close();
$conn->close();

echo json_encode(["status" => "success"]);
?>
