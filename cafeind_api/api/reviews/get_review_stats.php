<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

    // Get comprehensive review statistics
    $statsQuery = "
        SELECT 
            COUNT(*) as total_reviews,
            ROUND(AVG((wifi_quality + power_outlets + comfort_level) / 3), 1) as average_rating,
            COUNT(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 END) as reviews_this_month,
            COUNT(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK) THEN 1 END) as reviews_this_week,
            COUNT(CASE WHEN DATE(date) = CURDATE() THEN 1 END) as reviews_today,
            COUNT(CASE WHEN (wifi_quality + power_outlets + comfort_level) / 3 >= 4 THEN 1 END) as positive_reviews,
            COUNT(CASE WHEN (wifi_quality + power_outlets + comfort_level) / 3 < 3 THEN 1 END) as negative_reviews
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
        SELECT 
            c.name,
            c.id,
            COUNT(r.id) as review_count,
            ROUND(AVG((r.wifi_quality + r.power_outlets + r.comfort_level) / 3), 1) as avg_rating
        FROM cafes c
        LEFT JOIN reviews r ON c.id = r.cafe_id
        WHERE r.wifi_quality IS NOT NULL 
        AND r.power_outlets IS NOT NULL 
        AND r.comfort_level IS NOT NULL
        GROUP BY c.id, c.name
        HAVING review_count >= 1
        ORDER BY avg_rating DESC, review_count DESC
        LIMIT 1
    ";

    $topCafeStmt = $pdo->prepare($topCafeQuery);
    $topCafeStmt->execute();
    $topCafe = $topCafeStmt->fetch(PDO::FETCH_ASSOC);

    // Get rating distribution
    $ratingDistQuery = "
        SELECT 
            FLOOR((wifi_quality + power_outlets + comfort_level) / 3) as rating,
            COUNT(*) as count
        FROM reviews
        WHERE wifi_quality IS NOT NULL 
        AND power_outlets IS NOT NULL 
        AND comfort_level IS NOT NULL
        GROUP BY FLOOR((wifi_quality + power_outlets + comfort_level) / 3)
        ORDER BY rating DESC
    ";

    $ratingDistStmt = $pdo->prepare($ratingDistQuery);
    $ratingDistStmt->execute();
    $ratingDistribution = $ratingDistStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get recent activity (last 7 days)
    $activityQuery = "
        SELECT 
            DATE(date) as review_date,
            COUNT(*) as count
        FROM reviews
        WHERE DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(date)
        ORDER BY review_date DESC
    ";

    $activityStmt = $pdo->prepare($activityQuery);
    $activityStmt->execute();
    $recentActivity = $activityStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get cafes with most reviews
    $topReviewedQuery = "
        SELECT 
            c.name,
            c.id,
            COUNT(r.id) as review_count,
            ROUND(AVG((r.wifi_quality + r.power_outlets + r.comfort_level) / 3), 1) as avg_rating
        FROM cafes c
        LEFT JOIN reviews r ON c.id = r.cafe_id
        WHERE r.wifi_quality IS NOT NULL 
        AND r.power_outlets IS NOT NULL 
        AND r.comfort_level IS NOT NULL
        GROUP BY c.id, c.name
        HAVING review_count > 0
        ORDER BY review_count DESC
        LIMIT 5
    ";

    $topReviewedStmt = $pdo->prepare($topReviewedQuery);
    $topReviewedStmt->execute();
    $topReviewedCafes = $topReviewedStmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert numeric strings to proper numbers
    $stats['total_reviews'] = (int)$stats['total_reviews'];
    $stats['average_rating'] = (float)$stats['average_rating'];
    $stats['reviews_this_month'] = (int)$stats['reviews_this_month'];
    $stats['reviews_this_week'] = (int)$stats['reviews_this_week'];
    $stats['reviews_today'] = (int)$stats['reviews_today'];
    $stats['positive_reviews'] = (int)$stats['positive_reviews'];
    $stats['negative_reviews'] = (int)$stats['negative_reviews'];

    // Add top cafe info
    $stats['top_rated_cafe'] = $topCafe ? $topCafe['name'] : 'No data';
    $stats['top_rated_cafe_rating'] = $topCafe ? (float)$topCafe['avg_rating'] : 0;

    // Calculate percentages
    if ($stats['total_reviews'] > 0) {
        $stats['positive_percentage'] = round(($stats['positive_reviews'] / $stats['total_reviews']) * 100, 1);
        $stats['negative_percentage'] = round(($stats['negative_reviews'] / $stats['total_reviews']) * 100, 1);
    } else {
        $stats['positive_percentage'] = 0;
        $stats['negative_percentage'] = 0;
    }

    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'rating_distribution' => $ratingDistribution,
        'recent_activity' => $recentActivity,
        'top_reviewed_cafes' => $topReviewedCafes,
        'top_rated_cafe_details' => $topCafe,
        'message' => 'Review statistics retrieved successfully'
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
