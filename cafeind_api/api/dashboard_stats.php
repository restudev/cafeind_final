<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'cafeind_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Hitung tanggal awal dan akhir bulan ini
    $startOfThisMonth = date("Y-m-01 00:00:00");
    $endOfThisMonth = date("Y-m-t 23:59:59");

    // Hitung tanggal awal dan akhir bulan lalu
    $startOfLastMonth = date("Y-m-01 00:00:00", strtotime("first day of last month"));
    $endOfLastMonth = date("Y-m-t 23:59:59", strtotime("last day of last month"));

    // --- TOTAL CAFES ---
    // Total semua cafes tanpa filter waktu
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM cafes");
    $stmt->execute();
    $totalCafes = (int)$stmt->fetchColumn();

    // Cafes bulan ini
    $stmtThisMonth = $pdo->prepare("SELECT COUNT(*) FROM cafes WHERE created_date BETWEEN :start AND :end");
    $stmtThisMonth->execute(['start' => $startOfThisMonth, 'end' => $endOfThisMonth]);
    $cafesThisMonth = (int)$stmtThisMonth->fetchColumn();

    // Cafes bulan lalu
    $stmtLastMonth = $pdo->prepare("SELECT COUNT(*) FROM cafes WHERE created_date BETWEEN :start AND :end");
    $stmtLastMonth->execute(['start' => $startOfLastMonth, 'end' => $endOfLastMonth]);
    $cafesLastMonth = (int)$stmtLastMonth->fetchColumn();

    // --- TOTAL REVIEWS ---
    $stmtReviews = $pdo->prepare("SELECT COUNT(*) FROM reviews WHERE date BETWEEN :start AND :end");
    $stmtReviews->execute(['start' => $startOfThisMonth, 'end' => $endOfThisMonth]);
    $reviewsThisMonth = (int)$stmtReviews->fetchColumn();

    $stmtReviews->execute(['start' => $startOfLastMonth, 'end' => $endOfLastMonth]);
    $reviewsLastMonth = (int)$stmtReviews->fetchColumn();

    // --- ACTIVE PROMOTIONS ---
    $stmtPromos = $pdo->prepare("SELECT COUNT(*) FROM promotions WHERE valid_until BETWEEN :start AND :end");
    $stmtPromos->execute(['start' => $startOfThisMonth, 'end' => $endOfThisMonth]);
    $promosThisMonth = (int)$stmtPromos->fetchColumn();

    $stmtPromos->execute(['start' => $startOfLastMonth, 'end' => $endOfLastMonth]);
    $promosLastMonth = (int)$stmtPromos->fetchColumn();

    // Output JSON dengan statistik
    echo json_encode([
        'success' => true,
        'stats' => [
            'totalCafes' => $totalCafes,
            'cafesThisMonth' => $cafesThisMonth,
            'cafesLastMonth' => $cafesLastMonth,
            'reviewsThisMonth' => $reviewsThisMonth,
            'reviewsLastMonth' => $reviewsLastMonth,
            'promotionsThisMonth' => $promosThisMonth,
            'promotionsLastMonth' => $promosLastMonth,
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
