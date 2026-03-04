<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins for debugging; revert to http://localhost:5173 in production
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

    // Get all cafe requests
    $stmt = $pdo->prepare("
        SELECT id, name, address, area, description, submitter_name, submitter_email, submitter_phone,
               image_urls, price_range, noise_level, avg_visit_length, opening_hours,
               website, instagram, amenities, tags, additional_notes, status, admin_notes,
               submitted_at, reviewed_at, reviewed_by
        FROM cafe_requests 
        ORDER BY submitted_at DESC
    ");
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process the data
    foreach ($requests as &$request) {
        // Parse JSON fields with fallback
        $request['image_urls'] = json_decode($request['image_urls'] ?? '[]', true) ?: [];
        $request['opening_hours'] = json_decode($request['opening_hours'] ?? '{}', true) ?: ['Weekdays' => '', 'Weekends' => ''];
        $request['amenities'] = json_decode($request['amenities'] ?? '[]', true) ?: [];
        $request['tags'] = json_decode($request['tags'] ?? '[]', true) ?: [];

        // Convert price_range to integer
        $request['price_range'] = (int)$request['price_range'];
    }
    unset($request);

    echo json_encode([
        "success" => true,
        "data" => $requests,
        "message" => "Cafe requests retrieved successfully"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    echo json_encode([
        "success" => false,
        "message" => "Database error: Unable to connect or query database",
        "data" => []
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("General error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    echo json_encode([
        "success" => false,
        "message" => "An error occurred: " . $e->getMessage(),
        "data" => []
    ]);
}
