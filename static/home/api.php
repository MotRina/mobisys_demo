<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];

    if ($action == 'save_selections') {
        $user_id = $_SESSION['user_id'];
        $selections = $_POST['selections'];

        foreach ($selections as $selection) {
            $image_path = $selection['image_path'];
            $classification = $selection['classification'];

            $stmt = $conn->prepare("INSERT INTO selections (user_id, image_path, classification) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $user_id, $image_path, $classification);
            $stmt->execute();
            $stmt->close();
        }

        echo json_encode(["status" => "success"]);
    }
}

$conn->close();
?>
