<?php
$servername = "webdb.sfc.keio.ac.jp";
$username = "s21803rm";
$password = "bvKvGTf1";
$dbname = "s21803rm";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();
session_destroy();
header('Location: ../index.html');
exit();
?>
