<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cloudinary configuration
$cloudinary_cloud_name = 'db6aqirrl';
$cloudinary_api_key = '563779388843331';
$cloudinary_api_secret = 'rgf2AwIcO2wzCa7BY--Nqe33Zgk';

// Database configuration
$host = "127.0.0.1";
$dbname = "cafeind_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST method allowed");
    }

    // Validate required fields
    if (!isset($_POST['cafe_id']) || empty($_POST['cafe_id'])) {
        throw new Exception("Cafe ID is required");
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("No image file uploaded or upload error occurred");
    }

    $cafe_id = (int)$_POST['cafe_id'];
    $file = $_FILES['image'];

    // Validate file type
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $file_type = mime_content_type($file['tmp_name']);
    
    if (!in_array($file_type, $allowed_types)) {
        throw new Exception("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed");
    }

    // Validate file size (10MB max for Cloudinary)
    $max_size = 10 * 1024 * 1024; // 10MB
    if ($file['size'] > $max_size) {
        throw new Exception("File size too large. Maximum size is 10MB");
    }

    // Verify cafe exists
    $stmt = $pdo->prepare("SELECT id FROM cafes WHERE id = ?");
    $stmt->execute([$cafe_id]);
    if (!$stmt->fetch()) {
        throw new Exception("Cafe not found");
    }

    // Check if this is the first image for this cafe
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM cafe_images WHERE cafe_id = ?");
    $stmt->execute([$cafe_id]);
    $image_count = $stmt->fetchColumn();
    $is_primary = $image_count == 0 ? 1 : 0;

    // Upload to Cloudinary
    $upload_url = "https://api.cloudinary.com/v1_1/{$cloudinary_cloud_name}/image/upload";
    
    // Generate unique public_id for the image
    $public_id = "cafe_images/cafe_{$cafe_id}_" . uniqid();
    
    // Create timestamp for signature
    $timestamp = time();
    
    // Create signature for secure upload
    $params_to_sign = [
        'public_id' => $public_id,
        'timestamp' => $timestamp,
        'folder' => 'cafe_images'
    ];
    
    // Sort parameters alphabetically
    ksort($params_to_sign);
    
    // Create signature string
    $signature_string = '';
    foreach ($params_to_sign as $key => $value) {
        $signature_string .= $key . '=' . $value . '&';
    }
    $signature_string = rtrim($signature_string, '&') . $cloudinary_api_secret;
    
    // Generate signature
    $signature = sha1($signature_string);

    // Prepare upload data
    $upload_data = [
        'file' => new CURLFile($file['tmp_name'], $file_type, $file['name']),
        'api_key' => $cloudinary_api_key,
        'timestamp' => $timestamp,
        'signature' => $signature,
        'public_id' => $public_id,
        'folder' => 'cafe_images',
        'resource_type' => 'image',
        'quality' => 'auto',
        'fetch_format' => 'auto'
    ];

    // Upload to Cloudinary using cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $upload_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $upload_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($curl_error) {
        throw new Exception("Upload failed: " . $curl_error);
    }

    if ($http_code !== 200) {
        throw new Exception("Upload failed with HTTP code: " . $http_code);
    }

    $cloudinary_response = json_decode($response, true);
    
    if (!$cloudinary_response || !isset($cloudinary_response['secure_url'])) {
        throw new Exception("Invalid response from Cloudinary: " . $response);
    }

    $image_url = $cloudinary_response['secure_url'];
    $cloudinary_public_id = $cloudinary_response['public_id'];

    // Insert image record into database
    $stmt = $pdo->prepare("INSERT INTO cafe_images (cafe_id, image_url, is_primary, cloudinary_public_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$cafe_id, $image_url, $is_primary, $cloudinary_public_id]);
    $image_id = $pdo->lastInsertId();

    // If this is the primary image, update the cafe's main image_url
    if ($is_primary) {
        $stmt = $pdo->prepare("UPDATE cafes SET image_url = ? WHERE id = ?");
        $stmt->execute([$image_url, $cafe_id]);
    }

    echo json_encode([
        "success" => true,
        "message" => "Image uploaded successfully to Cloudinary",
        "data" => [
            "id" => $image_id,
            "image_url" => $image_url,
            "is_primary" => (bool)$is_primary,
            "cloudinary_public_id" => $cloudinary_public_id,
            "cloudinary_data" => [
                "width" => $cloudinary_response['width'] ?? null,
                "height" => $cloudinary_response['height'] ?? null,
                "format" => $cloudinary_response['format'] ?? null,
                "bytes" => $cloudinary_response['bytes'] ?? null
            ]
        ]
    ]);

} catch (Exception $e) {
    error_log("Error in upload_image: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Upload failed: " . $e->getMessage()
    ]);
}
?>