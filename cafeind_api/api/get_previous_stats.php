<?php
header('Content-Type: application/json');

// DB connection
$host = 'localhost';
$dbname = 'cafeind_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Tanggal bulan lalu
    $startOfLastMonth = date("Y-m-01 00:00:00", strtotime("first day of last month"));
    $endOfLastMonth = date("Y-m-t 23:59:59", strtotime("last day of last month"));

    // CAFE
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM cafes WHERE created_date BETWEEN :start AND :end");
    $stmt->execute(['start' => $startOfLastMonth, 'end' => $endOfLastMonth]);
    $previousCafes = (int) $stmt->fetchColumn();

    // REVIEWS
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM reviews 
        WHERE STR_TO_DATE(date, '%Y-%m-%d') BETWEEN :start AND :end
    ");
    $stmt->execute(['start' => $startOfLastMonth, 'end' => $endOfLastMonth]);
    $previousReviews = (int) $stmt->fetchColumn();

    // PROMOTIONS
    $stmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM promotions 
        WHERE valid_until BETWEEN :start AND :end
    ");
    $stmt->execute(['start' => $startOfLastMonth, 'end' => $endOfLastMonth]);
    $previousPromotions = (int) $stmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'previousCafes' => $previousCafes,
        'previousReviews' => $previousReviews,
        'previousPromotions' => $previousPromotions,
        'period' => [
            'start' => $startOfLastMonth,
            'end' => $endOfLastMonth
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
