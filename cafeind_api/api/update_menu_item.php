<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_log("update_menu_item.php accessed at " . date('Y-m-d H:i:s'));

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

    $required_fields = ['id', 'cafe_id', 'name', 'category', 'priceIDR'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || (is_string($input[$field]) && empty(trim($input[$field])))) {
            throw new Exception("Missing or invalid $field");
        }
    }

    $id = (int)$input['id'];
    $cafe_id = (int)$input['cafe_id'];
    $name = trim($input['name']);
    $category = trim($input['category']);
    $priceIDR = (int)$input['priceIDR'];
    $specialty = isset($input['specialty']) ? (bool)$input['specialty'] : false;

    if ($id <= 0 || $cafe_id <= 0) {
        throw new Exception("Invalid id or cafe_id");
    }

    if ($priceIDR <= 0) {
        throw new Exception("Price must be greater than 0");
    }

    $stmt = $pdo->prepare("SELECT id FROM menu_items WHERE id = ? AND cafe_id = ?");
    $stmt->execute([$id, $cafe_id]);
    if (!$stmt->fetch()) {
        throw new Exception("Menu item not found or doesn't belong to this cafe");
    }

    $stmt = $pdo->prepare("
        UPDATE menu_items 
        SET name = ?, category = ?, priceIDR = ?, specialty = ?
        WHERE id = ? AND cafe_id = ?
    ");
    $stmt->execute([$name, $category, $priceIDR, $specialty ? 1 : 0, $id, $cafe_id]);

    $stmt = $pdo->prepare("
        SELECT id, cafe_id, name, category, priceIDR, specialty
        FROM menu_items WHERE id = ?
    ");
    $stmt->execute([$id]);
    $menuItem = $stmt->fetch(PDO::FETCH_ASSOC);

    $menuItem['specialty'] = (bool)$menuItem['specialty'];
    $menuItem['priceIDR'] = (int)$menuItem['priceIDR'];

    echo json_encode([
        "success" => true,
        "data" => $menuItem,
        "message" => "Menu item updated successfully"
    ]);
} catch (Exception $e) {
    error_log("Error in update_menu_item: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "data" => []
    ]);
}