<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$logFile = '/home/s21803rm/public_html/LostCat/start/error_log.txt';
ini_set('log_errors', 'On');
ini_set('error_log', $logFile);

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error, 3, $logFile);
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $imagePaths = $input['image_paths'] ?? null;

    error_log("Received image paths: " . json_encode($imagePaths, JSON_UNESCAPED_SLASHES), 3, $logFile);

    if (empty($imagePaths)) {
        error_log("No image paths provided", 3, $logFile);
        echo json_encode(["error" => "No image paths provided"]);
        exit;
    }

    $adjustedPaths = array_map(function($path) {
        return str_replace('../images', './images', $path);
    }, $imagePaths);

    error_log("Adjusted image paths: " . json_encode($adjustedPaths, JSON_UNESCAPED_SLASHES), 3, $logFile);

    chdir('/home/s21803rm/public_html/LostCat/start');
    $python = '/home/s21803rm/public_html/LostCat/start/env/bin/python3';
    $command = $python . ' predict.py ' . escapeshellarg(json_encode($adjustedPaths, JSON_UNESCAPED_SLASHES));
    error_log("Executing command: " . $command, 3, $logFile);
    $output = shell_exec($command . ' 2>&1');

    error_log("Python script output: " . $output, 3, $logFile);

    // Remove unnecessary lines and only process the JSON part
    $json_start_pos = strpos($output, '{');
    $json_end_pos = strrpos($output, '}') + 1;
    $json_output = substr($output, $json_start_pos, $json_end_pos - $json_start_pos);

    if ($json_output === false) {
        error_log("Failed to extract JSON from Python script output", 3, $logFile);
        echo json_encode(["error" => "Failed to extract JSON from Python script output"]);
    } else {
        $decodedOutput = json_decode($json_output, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            echo json_encode($decodedOutput);
        } else {
            error_log("Invalid JSON response from Python script: " . json_last_error_msg(), 3, $logFile);
            error_log("Raw output from Python script: " . $output, 3, $logFile);
            echo json_encode(["error" => "Invalid JSON response from Python script", "output" => $json_output]);
        }
    }
}
?>
