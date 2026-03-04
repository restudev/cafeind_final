<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_log("get_menu_items.php accessed at " . date('Y-m-d H:i:s'));

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

    error_log("Database connection successful");

    // Get cafe_id from query parameter
    $cafe_id = isset($_GET['cafe_id']) ? (int)$_GET['cafe_id'] : null;
    
    if (!$cafe_id) {
        throw new Exception("Cafe ID is required");
    }

    // First, verify that the cafe exists
    $stmt = $pdo->prepare("SELECT id, name FROM cafes WHERE id = ?");
    $stmt->execute([$cafe_id]);
    $cafe = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$cafe) {
        throw new Exception("Cafe not found");
    }

    // Get menu items for specific cafe
    $stmt = $pdo->prepare("
        SELECT 
            mi.id, 
            mi.cafe_id, 
            mi.name, 
            mi.category, 
            mi.priceIDR, 
            mi.specialty,
            c.name as cafe_name
        FROM menu_items mi
        LEFT JOIN cafes c ON mi.cafe_id = c.id
        WHERE mi.cafe_id = ?
        ORDER BY mi.category ASC, mi.name ASC
    ");
    $stmt->execute([$cafe_id]);
    $menuItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert data types
    foreach ($menuItems as &$item) {
        $item['specialty'] = (bool)$item['specialty'];
        $item['priceIDR'] = (int)$item['priceIDR'];
        $item['cafe_id'] = (int)$item['cafe_id'];
        $item['id'] = (int)$item['id'];
    }

    error_log("Fetched " . count($menuItems) . " menu items for cafe ID: " . $cafe_id);

    echo json_encode([
        "success" => true,
        "data" => $menuItems,
        "cafe_info" => $cafe,
        "message" => "Menu items for cafe '{$cafe['name']}' retrieved successfully"
    ]);
    
} catch (Exception $e) {
    error_log("Error in get_menu_items: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "data" => [],
        "cafe_info" => null
    ]);
}
?>