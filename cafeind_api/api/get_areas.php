<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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

    // Get distinct areas from cafes table
    $stmt = $pdo->prepare("SELECT DISTINCT area FROM cafes WHERE area IS NOT NULL AND area != '' ORDER BY area ASC");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Only add "All Areas" if not already in the result
    $areas = $result;
    if (!in_array("All Areas", $areas)) {
        array_unshift($areas, "All Areas");
    }

    echo json_encode([
        "success" => true,
        "data" => array_values($areas),
        "message" => "Areas fetched successfully"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage(),
        "data" => []
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "An error occurred: " . $e->getMessage(),
        "data" => []
    ]);
}
?>