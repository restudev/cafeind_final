<?php
header("Access-Control-Allow-Origin: *"); // Temporary for debugging
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_log("Request received for upload_image_for_request.php"); // Confirm request reaches script

try {
    if (!extension_loaded('curl')) {
        throw new Exception("cURL extension is not loaded");
    }
    if (!extension_loaded('gd')) {
        throw new Exception("GD extension is not loaded");
    }

    $host = "127.0.0.1";
    $dbname = "cafeind_db";
    $username = "root";
    $password = "";

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $cloudinary_cloud_name = 'db6aqirrl';
    $cloudinary_api_key = '563779388843331';
    $cloudinary_api_secret = 'rgf2AwIcO2wzCa7BY--Nqe33Zgk';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST method allowed");
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds server size limit',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds form size limit',
            UPLOAD_ERR_PARTIAL => 'File only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary directory',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];
        $error = $_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE;
        throw new Exception($upload_errors[$error] ?? "No image file uploaded or upload error occurred");
    }

    $file = $_FILES['image'];
    $request_id = isset($_POST['request_id']) && is_numeric($_POST['request_id']) ? (int)$_POST['request_id'] : null;

    error_log("Received file: " . json_encode([
        'name' => $file['name'],
        'type' => $file['type'],
        'size' => $file['size'],
        'tmp_name' => $file['tmp_name']
    ]));

    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $file_type = mime_content_type($file['tmp_name']);
    if (!in_array($file_type, $allowed_types)) {
        throw new Exception("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed");
    }

    $max_size = 10 * 1024 * 1024;
    if ($file['size'] > $max_size) {
        throw new Exception("File size too large. Maximum size is 10MB");
    }

    $upload_url = "https://api.cloudinary.com/v1_1/{$cloudinary_cloud_name}/image/upload";
    $timestamp = time();
    $signature_params = [
        'folder' => 'cafe_requests',
        'timestamp' => $timestamp
    ];
    ksort($signature_params);

    $signature_string = http_build_query($signature_params) . $cloudinary_api_secret;
    $signature = sha1($signature_string);

    error_log("Cloudinary signature params: " . json_encode($signature_params));
    error_log("Cloudinary signature: " . $signature);

    $upload_data = [
        'file' => new CURLFile($file['tmp_name'], $file_type, $file['name']),
        'api_key' => $cloudinary_api_key,
        'timestamp' => $timestamp,
        'signature' => $signature,
        'folder' => 'cafe_requests',
        'resource_type' => 'image',
        'quality' => 'auto',
        'fetch_format' => 'auto'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $upload_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $upload_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    $verbose_log = fopen('php://temp', 'w+');
    curl_setopt($ch, CURLOPT_STDERR, $verbose_log);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);

    rewind($verbose_log);
    $verbose_output = stream_get_contents($verbose_log);
    error_log("Cloudinary verbose output: " . $verbose_output);
    fclose($verbose_log);
    curl_close($ch);

    if ($curl_error) {
        throw new Exception("Upload failed: " . $curl_error);
    }

    if ($http_code !== 200) {
        error_log("Cloudinary response: " . $response);
        throw new Exception("Upload failed with HTTP code: " . $http_code . ". Response: " . $response);
    }

    $cloudinary_response = json_decode($response, true);
    if (!$cloudinary_response || !isset($cloudinary_response['secure_url'])) {
        throw new Exception("Invalid response from Cloudinary: " . $response);
    }

    $image_url = $cloudinary_response['secure_url'];
    $cloudinary_public_id = $cloudinary_response['public_id'];

    $stmt = $pdo->prepare("
        INSERT INTO cafe_request_images (
            request_id, image_url, cloudinary_public_id, width, height, format, bytes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    $stmt->execute([
        $request_id,
        $image_url,
        $cloudinary_public_id,
        $cloudinary_response['width'] ?? null,
        $cloudinary_response['height'] ?? null,
        $cloudinary_response['format'] ?? null,
        $cloudinary_response['bytes'] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Image uploaded successfully to Cloudinary",
        "data" => [
            "image_url" => $image_url,
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
    error_log("Error in upload_image_for_request: " . $e->getMessage() . "\nTrace: " . $e->getTraceAsString());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Upload failed: " . $e->getMessage()
    ]);
}
?>