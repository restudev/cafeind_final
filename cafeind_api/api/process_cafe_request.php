<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins for debugging
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = "127.0.0.1";
$dbname = "cafeind_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Set timezone to WIB (UTC+7)
    date_default_timezone_set('Asia/Jakarta');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST method is allowed");
    }

    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception("Invalid JSON data");
    }

    // Validate required fields
    if (empty($data['request_id']) || empty($data['action'])) {
        throw new Exception("Request ID and action are required");
    }

    $requestId = (int)$data['request_id'];
    $action = $data['action'];
    $adminNotes = $data['admin_notes'] ?? null;
    $reviewedBy = $data['reviewed_by'] ?? 'Admin';

    if (!in_array($action, ['approve', 'reject'])) {
        throw new Exception("Invalid action. Must be 'approve' or 'reject'");
    }

    // Start transaction
    $pdo->beginTransaction();

    try {
        // Get the cafe request
        $stmt = $pdo->prepare("SELECT * FROM cafe_requests WHERE id = ? AND status = 'pending'");
        $stmt->execute([$requestId]);
        $request = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$request) {
            throw new Exception("Cafe request not found or already processed");
        }

        // Update the request status
        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        $updateStmt = $pdo->prepare("
            UPDATE cafe_requests 
            SET status = ?, admin_notes = ?, reviewed_at = ?, reviewed_by = ?
            WHERE id = ?
        ");
        $updateStmt->execute([
            $newStatus,
            $adminNotes,
            date('Y-m-d H:i:s'),
            $reviewedBy,
            $requestId
        ]);

        // If approved, create the cafe entry
        if ($action === 'approve') {
            // Insert into cafes table
            $cafeStmt = $pdo->prepare("
                INSERT INTO cafes (
                    name, address, area, description, price_range, noise_level,
                    avg_visit_length, opening_hours, website, instagram, amenities, tags
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $cafeStmt->execute([
                $request['name'],
                $request['address'],
                $request['area'],
                $request['description'],
                $request['price_range'],
                $request['noise_level'],
                $request['avg_visit_length'],
                $request['opening_hours'],
                $request['website'],
                $request['instagram'],
                $request['amenities'],
                $request['tags']
            ]);

            $cafeId = $pdo->lastInsertId();

            // Insert images if any
            $imageUrls = json_decode($request['image_urls'], true);
            if (!empty($imageUrls)) {
                $imageStmt = $pdo->prepare("
                    INSERT INTO cafe_images (cafe_id, image_url, is_primary) VALUES (?, ?, ?)
                ");

                foreach ($imageUrls as $index => $imageUrl) {
                    $isPrimary = $index === 0 ? 1 : 0;
                    $imageStmt->execute([$cafeId, $imageUrl, $isPrimary]);
                }
            }
        }

        // Commit transaction
        $pdo->commit();

        echo json_encode([
            "success" => true,
            "message" => "Cafe request " . $action . "d successfully",
            "data" => [
                "request_id" => $requestId,
                "status" => $newStatus,
                "cafe_id" => isset($cafeId) ? $cafeId : null
            ]
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    error_log("General error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
