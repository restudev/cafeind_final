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

// reCAPTCHA secret key
$recaptcha_secret = "6LfStDwrAAAAAFX67PvD69bHA7eXgzKNXe7yMUvx";

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
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['cafeId']) || !isset($input['review']) || !isset($input['recaptchaToken'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit();
}

$cafeId = $input['cafeId'];
$review = $input['review'];
$recaptchaToken = $input['recaptchaToken'];

// Validate review data
if (!isset($review['wifiQuality']) || !isset($review['powerOutlets']) || 
    !isset($review['comfortLevel']) || !isset($review['comment']) || 
    !isset($review['user'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid review data'
    ]);
    exit();
}

// Verify reCAPTCHA token
$verify_url = 'https://www.google.com/recaptcha/api/siteverify';
$data = [
    'secret' => $recaptcha_secret,
    'response' => $recaptchaToken,
    'remoteip' => $_SERVER['REMOTE_ADDR']
];

$options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($data),
        'timeout' => 10
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($verify_url, false, $context);

if ($result === FALSE) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to verify reCAPTCHA - network error'
    ]);
    exit();
}

$recaptcha_response = json_decode($result, true);

if (!$recaptcha_response || $recaptcha_response['success'] !== true) {
    $error_codes = $recaptcha_response['error-codes'] ?? ['unknown-error'];
    $error_message = 'reCAPTCHA verification failed';
    
    // Provide more specific error messages with instructions
    if (in_array('timeout-or-duplicate', $error_codes)) {
        $error_message = 'reCAPTCHA token has expired or been used already. Please complete the verification again.';
    } elseif (in_array('invalid-input-response', $error_codes)) {
        $error_message = 'Invalid reCAPTCHA token. Please complete the verification again.';
    } elseif (in_array('missing-input-response', $error_codes)) {
        $error_message = 'reCAPTCHA token is missing. Please complete the verification.';
    }
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $error_message,
        'error_codes' => $error_codes,
        'recaptcha_expired' => true // Flag untuk frontend
    ]);
    exit();
}

// Validate rating values (1-5)
$wifiQuality = intval($review['wifiQuality']);
$powerOutlets = intval($review['powerOutlets']);
$comfortLevel = intval($review['comfortLevel']);

if ($wifiQuality < 1 || $wifiQuality > 5 || 
    $powerOutlets < 1 || $powerOutlets > 5 || 
    $comfortLevel < 1 || $comfortLevel > 5) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Rating values must be between 1 and 5'
    ]);
    exit();
}

// Sanitize comment
$comment = trim($review['comment']);
if (empty($comment)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Comment cannot be empty'
    ]);
    exit();
}

// Validate comment length
if (strlen($comment) > 1000) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Comment is too long (max 1000 characters)'
    ]);
    exit();
}

// Sanitize user ID
$user = trim($review['user']);
if (empty($user)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'User ID cannot be empty'
    ]);
    exit();
}

try {
    // Check if cafe exists
    $stmt = $pdo->prepare("SELECT id FROM cafes WHERE id = ?");
    $stmt->execute([$cafeId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Cafe not found'
        ]);
        exit();
    }

    // Check for duplicate reviews from same user in last 24 hours
    $stmt = $pdo->prepare("
        SELECT id FROM reviews 
        WHERE cafe_id = ? AND user = ? AND date >= ?
    ");
    $twentyFourHoursAgo = date('Y-m-d H:i:s', strtotime('-24 hours'));
    $stmt->execute([$cafeId, $user, $twentyFourHoursAgo]);
    
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'You can only submit one review per cafe every 24 hours'
        ]);
        exit();
    }

    // Insert review into database
    $stmt = $pdo->prepare("
        INSERT INTO reviews (cafe_id, wifi_quality, power_outlets, comfort_level, comment, date, user) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $date = date('Y-m-d H:i:s');
    $stmt->execute([
        $cafeId,
        $wifiQuality,
        $powerOutlets,
        $comfortLevel,
        $comment,
        $date,
        $user
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Review submitted successfully',
        'review_id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
