<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_log("add_menu_item.php accessed at " . date('Y-m-d H:i:s'));

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

    $required_fields = ['cafe_id', 'name', 'category', 'priceIDR'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || (is_string($input[$field]) && empty(trim($input[$field])))) {
            throw new Exception("Missing or invalid $field");
        }
    }

    $cafe_id = (int)$input['cafe_id'];
    $name = trim($input['name']);
    $category = trim($input['category']);
    $priceIDR = (int)$input['priceIDR'];
    $specialty = isset($input['specialty']) ? (bool)$input['specialty'] : false;

    if ($cafe_id <= 0) {
        throw new Exception("Invalid cafe_id");
    }

    if ($priceIDR <= 0) {
        throw new Exception("Price must be greater than 0");
    }

    $stmt = $pdo->prepare("SELECT id FROM cafes WHERE id = ?");
    $stmt->execute([$cafe_id]);
    if (!$stmt->fetch()) {
        throw new Exception("Cafe not found");
    }

    $stmt = $pdo->prepare("
        INSERT INTO menu_items (cafe_id, name, category, priceIDR, specialty) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$cafe_id, $name, $category, $priceIDR, $specialty ? 1 : 0]);

    $menu_item_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("
        SELECT id, cafe_id, name, category, priceIDR, specialty
        FROM menu_items WHERE id = ?
    ");
    $stmt->execute([$menu_item_id]);
    $menuItem = $stmt->fetch(PDO::FETCH_ASSOC);

    $menuItem['specialty'] = (bool)$menuItem['specialty'];
    $menuItem['priceIDR'] = (int)$menuItem['priceIDR'];

    echo json_encode([
        "success" => true,
        "data" => $menuItem,
        "message" => "Menu item created successfully"
    ]);
} catch (Exception $e) {
    error_log("Error in add_menu_item: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "data" => []
    ]);
}