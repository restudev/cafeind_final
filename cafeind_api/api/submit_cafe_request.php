<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Match frontend origin
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Database configuration
$host = 'localhost';
$dbname = 'cafeind_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    date_default_timezone_set('Asia/Jakarta');
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    error_log("Received data: " . print_r($input, true)); // Debug
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit;
    }
    
    // Validate isFinal flag
    if (!isset($input['isFinal']) || $input['isFinal'] !== true) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Submission is not final. Complete all steps before submitting.']);
        exit;
    }
    
    // Validate required fields
    $requiredFields = ['name', 'address', 'area', 'description', 'submitter_name', 'submitter_email', 'noise_level', 'avg_visit_length', 'opening_hours'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field]) && !is_array($input[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
            exit;
        }
    }
    
    // Validate email
    if (!filter_var($input['submitter_email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    // Validate noise_level
    if (!in_array($input['noise_level'], ['Quiet', 'Moderate', 'Loud'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Invalid noise level. Must be 'Quiet', 'Moderate', or 'Loud'"]);
        exit;
    }
    
    // Validate opening_hours
    if (!isset($input['opening_hours']['weekdays']) || !isset($input['opening_hours']['weekends'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Opening hours for weekdays and weekends are required']);
        exit;
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Prepare opening hours
    $openingHours = json_encode([
        'weekdays' => $input['opening_hours']['weekdays'] ?? '9:00 AM - 10:00 PM',
        'weekends' => $input['opening_hours']['weekends'] ?? '10:00 AM - 8:00 PM'
    ]);
    
    // Prepare amenities and tags
    $amenities = json_encode($input['amenities'] ?? []);
    $tags = json_encode($input['tags'] ?? []);
    $imageUrls = json_encode($input['image_urls'] ?? []);
    
    // Insert cafe request
    $sql = "INSERT INTO cafe_requests (
        name, address, area, description, submitter_name, submitter_email, 
        submitter_phone, image_urls, price_range, noise_level, avg_visit_length,
        opening_hours, website, instagram, amenities, tags, additional_notes,
        status, submitted_at, created_at, updated_at
    ) VALUES (
        :name, :address, :area, :description, :submitter_name, :submitter_email,
        :submitter_phone, :image_urls, :price_range, :noise_level, :avg_visit_length,
        :opening_hours, :website, :instagram, :amenities, :tags, :additional_notes,
        'pending', :submitted_at, NOW(), NOW()
    )";
    
    $stmt = $pdo->prepare($sql);
    
    $params = [
        ':name' => $input['name'],
        ':address' => $input['address'],
        ':area' => $input['area'],
        ':description' => $input['description'],
        ':submitter_name' => $input['submitter_name'],
        ':submitter_email' => $input['submitter_email'],
        ':submitter_phone' => $input['submitter_phone'] ?? '',
        ':image_urls' => $imageUrls,
        ':price_range' => intval($input['price_range'] ?? 1),
        ':noise_level' => $input['noise_level'] ?? 'Moderate',
        ':avg_visit_length' => $input['avg_visit_length'] ?? '1-2 hours',
        ':opening_hours' => $openingHours,
        ':website' => $input['website'] ?? '',
        ':instagram' => $input['instagram'] ?? '',
        ':amenities' => $amenities,
        ':tags' => $tags,
        ':additional_notes' => $input['additional_notes'] ?? '',
        ':submitted_at' => date('Y-m-d H:i:s', strtotime($input['submitted_at'] ?? 'now'))
    ];
    
    $stmt->execute($params);
    $requestId = $pdo->lastInsertId();
    
    // Update cafe_request_images with request_id
    if (!empty($input['image_urls']) && is_array($input['image_urls'])) {
        $placeholders = implode(',', array_fill(0, count($input['image_urls']), '?'));
        $sql = "UPDATE cafe_request_images 
                SET request_id = ?
                WHERE image_url IN ($placeholders)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_merge([$requestId], $input['image_urls']));
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Cafe recommendation submitted successfully!',
        'request_id' => $requestId,
        'images_uploaded' => count($input['image_urls'] ?? [])
    ]);
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>