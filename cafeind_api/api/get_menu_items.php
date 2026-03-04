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
        ORDER BY c.name ASC, mi.category ASC, mi.name ASC
    ");
    $stmt->execute();
    $menuItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($menuItems as &$item) {
        $item['specialty'] = (bool)$item['specialty'];
        $item['priceIDR'] = (int)$item['priceIDR'];
        $item['cafe_id'] = (int)$item['cafe_id'];
    }

    error_log("Fetched " . count($menuItems) . " menu items from all cafes");

    echo json_encode([
        "success" => true,
        "data" => $menuItems,
        "message" => "All menu items retrieved successfully"
    ]);
} catch (Exception $e) {
    error_log("Error in get_all_menu_items: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "data" => []
    ]);
}
?>