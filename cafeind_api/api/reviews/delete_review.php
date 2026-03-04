<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit();
}

// Database configuration
$host = 'localhost';
$dbname = 'cafeind_db';
$username = 'root';
$password = '';

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    if (!isset($input['review_id']) || empty($input['review_id'])) {
        throw new Exception('Review ID is required');
    }

    $reviewId = (int)$input['review_id'];

    if ($reviewId <= 0) {
        throw new Exception('Invalid review ID');
    }

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Start transaction
    $pdo->beginTransaction();

    try {
        // Check if review exists
        $checkQuery = "SELECT id, cafe_id FROM reviews WHERE id = ?";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([$reviewId]);
        $review = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$review) {
            throw new Exception('Review not found');
        }

        // Delete the review
        $deleteQuery = "DELETE FROM reviews WHERE id = ?";
        $deleteStmt = $pdo->prepare($deleteQuery);
        $deleteStmt->execute([$reviewId]);

        if ($deleteStmt->rowCount() === 0) {
            throw new Exception('Failed to delete review');
        }

        // Log the deletion (optional - you can create an audit log table)
        $logQuery = "INSERT INTO review_deletions (review_id, cafe_id, deleted_at, deleted_by) VALUES (?, ?, NOW(), 'admin')";
        try {
            $logStmt = $pdo->prepare($logQuery);
            $logStmt->execute([$reviewId, $review['cafe_id']]);
        } catch (PDOException $e) {
            // If logging fails, continue anyway (logging is optional)
            error_log("Failed to log review deletion: " . $e->getMessage());
        }

        // Commit transaction
        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Review deleted successfully',
            'deleted_review_id' => $reviewId
        ]);
    } catch (Exception $e) {
        // Rollback transaction on error
        $pdo->rollback();
        throw $e;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
