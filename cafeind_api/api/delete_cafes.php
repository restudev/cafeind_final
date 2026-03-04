<?php
header("Access-Control-Allow-Origin: *");
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

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['ids']) || !is_array($input['ids'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid input. Expected array of cafe IDs."
        ]);
        exit;
    }

    $ids = array_filter($input['ids'], function($id) {
        return !empty(trim($id));
    });

    if (empty($ids)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No valid cafe IDs provided"
        ]);
        exit;
    }

    // Create placeholders for prepared statement
    $placeholders = str_repeat('?,', count($ids) - 1) . '?';
    
    $stmt = $pdo->prepare("DELETE FROM cafes WHERE id IN ($placeholders)");
    $stmt->execute($ids);

    $deletedCount = $stmt->rowCount();

    if ($deletedCount > 0) {
        echo json_encode([
            "success" => true,
            "message" => "$deletedCount cafe(s) deleted successfully",
            "deleted_count" => $deletedCount
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No cafes found with the provided IDs or already deleted"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete cafes: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while processing the request"
    ]);
}
?>