<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method allowed'
    ]);
    exit();
}

// Cloudinary configuration
$cloudinary_cloud_name = 'db6aqirrl';
$cloudinary_api_key = '563779388843331';
$cloudinary_api_secret = 'rgf2AwIcO2wzCa7BY--Nqe33Zgk';

// Database configuration
$host = 'localhost';
$dbname = 'cafeind_db';
$username = 'root';
$password = '';

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

// Get input data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate input
if (!$data || !isset($data['image_id']) || !isset($data['cafe_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: image_id and cafe_id',
        'received_data' => $data
    ]);
    exit();
}

$imageId = filter_var($data['image_id'], FILTER_VALIDATE_INT);
$cafeId = filter_var($data['cafe_id'], FILTER_VALIDATE_INT);

if ($imageId === false || $cafeId === false || $imageId <= 0 || $cafeId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid image_id or cafe_id format',
        'image_id' => $data['image_id'],
        'cafe_id' => $data['cafe_id']
    ]);
    exit();
}

try {
    // Start transaction
    $pdo->beginTransaction();

    // First, get the image information before deleting
    $stmt = $pdo->prepare("SELECT image_url, is_primary, cloudinary_public_id FROM cafe_images WHERE id = ? AND cafe_id = ?");
    $stmt->execute([$imageId, $cafeId]);
    $imageInfo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$imageInfo) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Image not found or does not belong to this cafe',
            'image_id' => $imageId,
            'cafe_id' => $cafeId
        ]);
        exit();
    }

    $imageUrl = $imageInfo['image_url'];
    $wasPrimary = (bool)$imageInfo['is_primary'];
    $cloudinaryPublicId = $imageInfo['cloudinary_public_id'];

    // Delete the image from database first
    $stmt = $pdo->prepare("DELETE FROM cafe_images WHERE id = ? AND cafe_id = ?");
    $result = $stmt->execute([$imageId, $cafeId]);

    if (!$result || $stmt->rowCount() === 0) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Image not found or already deleted'
        ]);
        exit();
    }

    $newPrimaryImageUrl = null;

    // If this was the primary image, we need to set another image as primary
    if ($wasPrimary) {
        // Get the first remaining image for this cafe
        $stmt = $pdo->prepare("SELECT id, image_url FROM cafe_images WHERE cafe_id = ? ORDER BY id ASC LIMIT 1");
        $stmt->execute([$cafeId]);
        $firstImage = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($firstImage) {
            // Set the first remaining image as primary
            $stmt = $pdo->prepare("UPDATE cafe_images SET is_primary = 1 WHERE id = ?");
            $stmt->execute([$firstImage['id']]);

            $newPrimaryImageUrl = $firstImage['image_url'];

            // Update the cafe's main image_url
            $stmt = $pdo->prepare("UPDATE cafes SET image_url = ? WHERE id = ?");
            $stmt->execute([$newPrimaryImageUrl, $cafeId]);
        } else {
            // No more images left, clear the cafe's main image_url
            $stmt = $pdo->prepare("UPDATE cafes SET image_url = NULL WHERE id = ?");
            $stmt->execute([$cafeId]);
        }
    }

    // Delete from Cloudinary if we have a public_id
    $cloudinaryDeleted = false;
    $cloudinaryError = null;

    if (!empty($cloudinaryPublicId)) {
        try {
            // Create timestamp for signature
            $timestamp = time();
            
            // Create signature for deletion
            $params_to_sign = [
                'public_id' => $cloudinaryPublicId,
                'timestamp' => $timestamp
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

            // Prepare deletion data
            $delete_data = [
                'public_id' => $cloudinaryPublicId,
                'api_key' => $cloudinary_api_key,
                'timestamp' => $timestamp,
                'signature' => $signature
            ];

            // Delete from Cloudinary using cURL
            $delete_url = "https://api.cloudinary.com/v1_1/{$cloudinary_cloud_name}/image/destroy";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $delete_url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($delete_data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);

            $response = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curl_error = curl_error($ch);
            curl_close($ch);

            if ($curl_error) {
                $cloudinaryError = "Cloudinary deletion failed: " . $curl_error;
                error_log($cloudinaryError);
            } elseif ($http_code === 200) {
                $cloudinary_response = json_decode($response, true);
                if ($cloudinary_response && isset($cloudinary_response['result']) && $cloudinary_response['result'] === 'ok') {
                    $cloudinaryDeleted = true;
                } else {
                    $cloudinaryError = "Cloudinary deletion failed: " . $response;
                    error_log($cloudinaryError);
                }
            } else {
                $cloudinaryError = "Cloudinary deletion failed with HTTP code: " . $http_code;
                error_log($cloudinaryError);
            }
        } catch (Exception $e) {
            $cloudinaryError = "Cloudinary deletion error: " . $e->getMessage();
            error_log($cloudinaryError);
        }
    }

    // Commit transaction (even if Cloudinary deletion failed, we still want to remove from DB)
    $pdo->commit();

    // Get updated image count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM cafe_images WHERE cafe_id = ?");
    $stmt->execute([$cafeId]);
    $countResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $remainingCount = (int)$countResult['count'];

    echo json_encode([
        'success' => true,
        'message' => 'Image deleted successfully',
        'data' => [
            'deleted_image_id' => $imageId,
            'deleted_image_url' => $imageUrl,
            'was_primary' => $wasPrimary,
            'cloudinary_deleted' => $cloudinaryDeleted,
            'cloudinary_public_id' => $cloudinaryPublicId,
            'cloudinary_delete_error' => $cloudinaryError,
            'remaining_images_count' => $remainingCount,
            'new_primary_image_url' => $newPrimaryImageUrl
        ]
    ]);

} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>