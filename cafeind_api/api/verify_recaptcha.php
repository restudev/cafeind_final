<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['token']) || empty($input['token'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'reCAPTCHA token is required'
    ]);
    exit();
}

$token = $input['token'];

// Verify reCAPTCHA token with Google
$verify_url = 'https://www.google.com/recaptcha/api/siteverify';
$data = [
    'secret' => $recaptcha_secret,
    'response' => $token,
    'remoteip' => $_SERVER['REMOTE_ADDR']
];

$options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($verify_url, false, $context);

if ($result === FALSE) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to verify reCAPTCHA'
    ]);
    exit();
}

$response = json_decode($result, true);

if ($response['success'] === true) {
    echo json_encode([
        'success' => true,
        'message' => 'reCAPTCHA verified successfully'
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'reCAPTCHA verification failed',
        'errors' => $response['error-codes'] ?? []
    ]);
}
?>