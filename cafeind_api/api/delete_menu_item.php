<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_log("delete_menu_item.php accessed at " . date('Y-m-d H:i:s'));

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

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception("Invalid JSON input");
    }

    $required_fields = ['id', 'cafe_id'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || (is_numeric($input[$field]) && (int)$input[$field] <= 0)) {
            throw new Exception("Missing or invalid $field");
        }
    }

    $id = (int)$input['id'];
    $cafe_id = (int)$input['cafe_id'];

    $stmt = $pdo->prepare("SELECT id FROM menu_items WHERE id = ? AND cafe_id = ?");
    $stmt->execute([$id, $cafe_id]);
    if (!$stmt->fetch()) {
        throw new Exception("Menu item not found or doesn't belong to this cafe");
    }

    $stmt = $pdo->prepare("DELETE FROM menu_items WHERE id = ? AND cafe_id = ?");
    $stmt->execute([$id, $cafe_id]);

    echo json_encode([
        "success" => true,
        "message" => "Menu item deleted successfully",
        "data" => []
    ]);
} catch (Exception $e) {
    error_log("Error in delete_menu_item: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "data" => []
    ]);
}