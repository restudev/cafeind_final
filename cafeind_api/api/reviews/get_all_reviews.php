<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'localhost';
$dbname = 'cafeind_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all reviews with cafe information
    $query = "
        SELECT 
            r.id,
            r.cafe_id,
            c.name as cafe_name,
            r.wifi_quality,
            r.power_outlets,
            r.comfort_level,
            r.comment,
            r.date,
            r.user,
            r.phone_number,
            ROUND((r.wifi_quality + r.power_outlets + r.comfort_level) / 3, 1) as overall_rating
        FROM reviews r
        LEFT JOIN cafes c ON r.cafe_id = c.id
        ORDER BY r.date DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get statistics
    $statsQuery = "
        SELECT 
            COUNT(*) as total_reviews,
            ROUND(AVG((wifi_quality + power_outlets + comfort_level) / 3), 1) as average_rating,
            COUNT(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 END) as reviews_this_month
        FROM reviews
        WHERE wifi_quality IS NOT NULL 
        AND power_outlets IS NOT NULL 
        AND comfort_level IS NOT NULL
    ";

    $statsStmt = $pdo->prepare($statsQuery);
    $statsStmt->execute();
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    // Get top rated cafe
    $topCafeQuery = "
        SELECT c.name
        FROM cafes c
        LEFT JOIN reviews r ON c.id = r.cafe_id
        WHERE r.wifi_quality IS NOT NULL 
        AND r.power_outlets IS NOT NULL 
        AND r.comfort_level IS NOT NULL
        GROUP BY c.id, c.name
        ORDER BY AVG((r.wifi_quality + r.power_outlets + r.comfort_level) / 3) DESC
        LIMIT 1
    ";

    $topCafeStmt = $pdo->prepare($topCafeQuery);
    $topCafeStmt->execute();
    $topCafe = $topCafeStmt->fetch(PDO::FETCH_ASSOC);

    $stats['top_rated_cafe'] = $topCafe ? $topCafe['name'] : 'No data';

    // Convert numeric strings to proper numbers
    foreach ($reviews as &$review) {
        $review['id'] = (int)$review['id'];
        $review['cafe_id'] = (int)$review['cafe_id'];
        $review['wifi_quality'] = (int)$review['wifi_quality'];
        $review['power_outlets'] = (int)$review['power_outlets'];
        $review['comfort_level'] = (int)$review['comfort_level'];
        $review['overall_rating'] = (float)$review['overall_rating'];
    }

    // Convert stats to proper numbers
    $stats['total_reviews'] = (int)$stats['total_reviews'];
    $stats['average_rating'] = (float)$stats['average_rating'];
    $stats['reviews_this_month'] = (int)$stats['reviews_this_month'];

    echo json_encode([
        'success' => true,
        'data' => $reviews,
        'stats' => $stats,
        'message' => 'Reviews retrieved successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
