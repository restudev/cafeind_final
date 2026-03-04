<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Method Not Allowed");
    }

    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    // Validate required fields
    $required_fields = ['cafe_id', 'title', 'description', 'icon'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate icon
    $valid_icons = ['coffee', 'book', 'laptop'];
    if (!in_array($input['icon'], $valid_icons)) {
        throw new Exception("Invalid icon: {$input['icon']}");
    }

    // Validate valid_until date (if provided)
    if (isset($input['valid_until']) && !empty($input['valid_until'])) {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $input['valid_until'])) {
            throw new Exception("Invalid date format for valid_until: {$input['valid_until']}");
        }
        if (strtotime($input['valid_until']) < strtotime('today')) {
            throw new Exception("Valid until date cannot be in the past: {$input['valid_until']}");
        }
    }

    // Verify cafe_id exists
    $stmt = $pdo->prepare("SELECT id FROM cafes WHERE id = ?");
    $stmt->execute([(int)$input['cafe_id']]);
    if (!$stmt->fetch()) {
        throw new Exception("Invalid cafe ID: {$input['cafe_id']}");
    }

    // Insert promotion
    $stmt = $pdo->prepare("
        INSERT INTO promotions (cafe_id, title, description, valid_until, icon, start_date)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        (int)$input['cafe_id'],
        trim($input['title']),
        trim($input['description']),
        $input['valid_until'] ?? null,
        $input['icon']
    ]);

    $promotion_id = $pdo->lastInsertId();

    // Fetch created promotion
    $stmt = $pdo->prepare("SELECT id, cafe_id, title, description, valid_until, icon, start_date FROM promotions WHERE id = ?");
    $stmt->execute([$promotion_id]);
    $new_promo = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $new_promo,
        "message" => "Promotion created successfully"
    ]);
} catch (Exception $e) {
    error_log("Error in add_promotion: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
