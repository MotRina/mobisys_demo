<?php
$servername = "webdb.sfc.keio.ac.jp";
$username = "s21803rm";
$password = "bvKvGTf1";
$dbname = "s21803rm";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $password = $_POST['password'];
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Check if the username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        // Username already exists
        header("Location: signup.html?error=" . urlencode("Username already exists"));
    } else {
        // Username does not exist, proceed with registration
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $hashed_password);
        if ($stmt->execute()) {
            header("Location: ../login/login.html");
        } else {
            header("Location: signup.html?error=" . urlencode("Unable to create account"));
        }
    }
    $stmt->close();
}

$conn->close();
?>
