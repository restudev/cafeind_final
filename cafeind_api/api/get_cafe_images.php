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

    $cafe_id = isset($_GET['cafe_id']) ? $_GET['cafe_id'] : '';
    if (!$cafe_id) {
        throw new Exception("Cafe ID is required");
    }

    $stmt = $pdo->prepare("SELECT image_url, is_primary FROM cafe_images WHERE cafe_id = ?");
    $stmt->execute([$cafe_id]);
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $images
    ]);
} catch (Exception $e) {
    error_log("Error in get_cafe_images: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>