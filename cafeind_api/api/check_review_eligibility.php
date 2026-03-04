<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'localhost';
$dbname = 'cafeind_db';
$username = 'root';
$password = '';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['cafeId']) || !isset($input['userIdentifier'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit();
}

$cafeId = $input['cafeId'];
$userIdentifier = $input['userIdentifier'];
$userName = $input['userName'] ?? '';

try {
    // Check for any review from this user identifier in the last 24 hours
    $stmt = $pdo->prepare("
        SELECT date, user FROM reviews 
        WHERE cafe_id = ? AND user = ? 
        ORDER BY date DESC 
        LIMIT 1
    ");
    $stmt->execute([$cafeId, $userIdentifier]);
    $lastReview = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($lastReview) {
        $lastReviewTime = new DateTime($lastReview['date']);
        $now = new DateTime();
        $interval = $now->diff($lastReviewTime);
        
        // Calculate total hours difference
        $hoursDiff = ($interval->days * 24) + $interval->h + ($interval->i / 60);
        
        if ($hoursDiff < 24) {
            // User cannot review yet
            $nextAllowedTime = clone $lastReviewTime;
            $nextAllowedTime->add(new DateInterval('P1D')); // Add 1 day
            
            $timeDiff = $nextAllowedTime->getTimestamp() - $now->getTimestamp();
            
            $hours = floor($timeDiff / 3600);
            $minutes = floor(($timeDiff % 3600) / 60);
            $seconds = $timeDiff % 60;
            
            echo json_encode([
                'success' => true,
                'canReview' => false,
                'lastReviewDate' => $lastReview['date'],
                'timeRemaining' => [
                    'hours' => $hours,
                    'minutes' => $minutes,
                    'seconds' => $seconds
                ],
                'message' => 'You can only submit one review per cafe every 24 hours'
            ]);
            exit();
        }
    }

    // User can review
    echo json_encode([
        'success' => true,
        'canReview' => true,
        'lastReviewDate' => $lastReview ? $lastReview['date'] : null,
        'timeRemaining' => null,
        'message' => 'You can submit a review'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
}
?>