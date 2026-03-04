<?php
// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database configuration
$host = "127.0.0.1";
$dbname = "cafeind_db";
$username = "root";
$password = "";

// Get request data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// Check if request is valid
if (!$input) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request data"
    ]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Start transaction
    $pdo->beginTransaction();
    
    $id = isset($_GET['id']) ? trim($_GET['id']) : $input['id'];
    $isUpdate = $_SERVER['REQUEST_METHOD'] === 'PUT';
    
    // Prepare cafe data
    $cafeData = [
        'name' => $input['name'],
        'address' => $input['address'],
        'area' => $input['area'],
        'description' => $input['description'],
        'image_url' => $input['imageUrl'] ?? null,
        'price_range' => $input['priceRange'],
        'noise_level' => $input['noiseLevel'],
        'avg_visit_length' => $input['avgVisitLength'],
        'opening_hours' => json_encode($input['openingHours']),
        'featured' => $input['featured'] ? 1 : 0,
        'menu_link' => $input['menuLink'] ?? null,
        'website' => $input['website'] ?? null,
        'link_maps' => $input['linkMaps'] ?? null,
        'instagram' => $input['instagram'] ?? null,
        'amenities' => json_encode($input['amenities']),
        'tags' => json_encode($input['tags'])
    ];
    
    // Update or insert cafe
    if ($isUpdate) {
        // Check if cafe exists
        $checkStmt = $pdo->prepare("SELECT id FROM cafes WHERE id = ?");
        $checkStmt->execute([$id]);
        if (!$checkStmt->fetch()) {
            throw new Exception("Cafe with ID $id not found");
        }
        
        // Update cafe
        $sql = "UPDATE cafes SET 
                name = :name, 
                address = :address, 
                area = :area, 
                description = :description, 
                image_url = :image_url,
                price_range = :price_range, 
                noise_level = :noise_level, 
                avg_visit_length = :avg_visit_length, 
                opening_hours = :opening_hours, 
                featured = :featured, 
                menu_link = :menu_link, 
                website = :website, 
                link_maps = :link_maps, 
                instagram = :instagram, 
                amenities = :amenities, 
                tags = :tags 
                WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $cafeData['id'] = $id;
        $stmt->execute($cafeData);
        
        // Delete existing images (except primary)
        // In a real app, you'd handle this more carefully and possibly keep track of which images were actually removed
        if (isset($input['imageUrl'])) {
            $deleteImagesStmt = $pdo->prepare("DELETE FROM cafe_images WHERE cafe_id = ? AND image_url != ?");
            $deleteImagesStmt->execute([$id, $input['imageUrl']]);
        }
        
        // Delete existing menu items
        $deleteMenuStmt = $pdo->prepare("DELETE FROM menu_items WHERE cafe_id = ?");
        $deleteMenuStmt->execute([$id]);
        
        // Delete existing promotions
        $deletePromosStmt = $pdo->prepare("DELETE FROM promotions WHERE cafe_id = ?");
        $deletePromosStmt->execute([$id]);
        
    } else {
        // Insert new cafe
        $sql = "INSERT INTO cafes (
                id, name, address, area, description, image_url, 
                price_range, noise_level, avg_visit_length, opening_hours, 
                featured, menu_link, website, link_maps, instagram, 
                amenities, tags, created_date) 
                VALUES (
                :id, :name, :address, :area, :description, :image_url, 
                :price_range, :noise_level, :avg_visit_length, :opening_hours, 
                :featured, :menu_link, :website, :link_maps, :instagram, 
                :amenities, :tags, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $cafeData['id'] = $id;
        $stmt->execute($cafeData);
    }
    
    // Add images
    if (!empty($input['images'])) {
        foreach ($input['images'] as $index => $imageUrl) {
            // Skip if it's the primary image (already saved in cafe table)
            if ($imageUrl === $input['imageUrl']) {
                continue;
            }
            
            $imageStmt = $pdo->prepare("INSERT INTO cafe_images (cafe_id, image_url, is_primary) VALUES (?, ?, ?)");
            $imageStmt->execute([$id, $imageUrl, 0]);
        }
        
        // Add primary image if not already in the images array
        if (!in_array($input['imageUrl'], $input['images']) && !empty($input['imageUrl'])) {
            $primaryImageStmt = $pdo->prepare("INSERT INTO cafe_images (cafe_id, image_url, is_primary) VALUES (?, ?, ?)");
            $primaryImageStmt->execute([$id, $input['imageUrl'], 1]);
        }
    }
    
    // Add menu items
    if (!empty($input['menu'])) {
        $menuStmt = $pdo->prepare("INSERT INTO menu_items (cafe_id, name, category, priceIDR, specialty) VALUES (?, ?, ?, ?, ?)");
        foreach ($input['menu'] as $item) {
            $menuStmt->execute([
                $id, 
                $item['name'], 
                $item['category'], 
                $item['priceIDR'], 
                $item['specialty'] ? 1 : 0
            ]);
        }
    }
    
    // Add promotions
    if (!empty($input['promo'])) {
        $promoStmt = $pdo->prepare("INSERT INTO promotions (id, cafe_id, title, description, valid_until, icon, start_date) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        foreach ($input['promo'] as $promo) {
            $promoStmt->execute([
                $promo['id'] ?? 'promo-' . uniqid(), 
                $id, 
                $promo['title'], 
                $promo['description'], 
                $promo['validUntil'], 
                $promo['icon']
            ]);
        }
    }
    
    // Commit transaction
    $pdo->commit();
    
    echo json_encode([
        "success" => true,
        "message" => $isUpdate ? "Cafe updated successfully" : "Cafe created successfully",
        "id" => $id
    ], JSON_UNESCAPED_SLASHES);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ], JSON_UNESCAPED_SLASHES);
} catch (Exception $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    error_log("Error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ], JSON_UNESCAPED_SLASHES);
}
?>