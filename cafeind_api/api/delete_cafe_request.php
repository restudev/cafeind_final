<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins for debugging
header("Access-Control-Allow-Methods: DELETE, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = "127.0.0.1";
$dbname = "cafeind_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Set timezone to WIB (UTC+7)
    date_default_timezone_set('Asia/Jakarta');

    if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'])) {
        throw new Exception("Only DELETE or POST method is allowed");
    }

    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception("Invalid JSON data");
    }

    // Validate required fields
    if (empty($data['request_id'])) {
        throw new Exception("Request ID is required");
    }

    $requestId = (int)$data['request_id'];

    // Check if the request exists
    $stmt = $pdo->prepare("SELECT id, name FROM cafe_requests WHERE id = ?");
    $stmt->execute([$requestId]);
    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$request) {
        throw new Exception("Cafe request not found");
    }

    // Delete the request
    $deleteStmt = $pdo->prepare("DELETE FROM cafe_requests WHERE id = ?");
    $deleteStmt->execute([$requestId]);

    echo json_encode([
        "success" => true,
        "message" => "Cafe request deleted successfully",
        "data" => [
            "request_id" => $requestId,
            "name" => $request['name']
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    echo json_encode([
        "success" => false,
        "message" => "Database error: Unable to connect or query database"
    ]);
} catch (Exception $e) {
    http_response_code(400);
    error_log("General error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
