<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception("Method Not Allowed");
    }

    // Get promotion ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $promotion_id = end($url_parts);
    if (!is_numeric($promotion_id)) {
        throw new Exception("Invalid promotion ID");
    }

    // Check if promotion exists
    $stmt = $pdo->prepare("SELECT id, title FROM promotions WHERE id = ?");
    $stmt->execute([(int)$promotion_id]);
    $promotion = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$promotion) {
        throw new Exception("Promotion not found");
    }

    // Delete promotion
    $stmt = $pdo->prepare("DELETE FROM promotions WHERE id = ?");
    $stmt->execute([(int)$promotion_id]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("Failed to delete promotion");
    }

    echo json_encode([
        "success" => true,
        "message" => "Promotion '{$promotion['title']}' deleted successfully"
    ]);

} catch (Exception $e) {
    error_log("Error in delete_promotion: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>