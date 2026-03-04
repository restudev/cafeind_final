<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Method Not Allowed");
    }

    // Validate required fields
    $required_fields = ['name', 'address', 'area', 'description'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate area
    $valid_areas = [
        'Semarang Tengah', 'Semarang Barat', 'Semarang Timur', 'Semarang Utara', 
        'Semarang Selatan', 'Gayamsari', 'Candisari', 'Banyumanik', 'Gunungpati', 
        'Pedurungan', 'Genuk', 'Tugu', 'Ngaliyan', 'Mijen', 'Tembalang', 'Gajahmungkur'
    ];
    if (!in_array($_POST['area'], $valid_areas)) {
        throw new Exception("Invalid area: {$_POST['area']}");
    }

    // Validate price range
    $price_range = (int)($_POST['price_range'] ?? 1);
    if ($price_range < 1 || $price_range > 3) {
        throw new Exception("Invalid price range: $price_range");
    }

    // Validate noise level
    $valid_noise_levels = ['Quiet', 'Moderate', 'Loud'];
    $noise_level = $_POST['noise_level'] ?? 'Moderate';
    if (!in_array($noise_level, $valid_noise_levels)) {
        throw new Exception("Invalid noise level: $noise_level");
    }

    // Parse JSON fields
    $opening_hours = $_POST['opening_hours'] ?? '{"Weekdays":"9:00 AM - 10:00 PM","Weekends":"10:00 AM - 8:00 PM"}';
    $amenities = $_POST['amenities'] ?? '[]';
    $tags = $_POST['tags'] ?? '[]';
    $images = $_POST['images'] ?? '[]';
    $promotions = $_POST['promotions'] ?? '[]';

    // Validate JSON
    $opening_hours_data = json_decode($opening_hours, true);
    $amenities_data = json_decode($amenities, true);
    $tags_data = json_decode($tags, true);
    $images_data = json_decode($images, true);
    $promotions_data = json_decode($promotions, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data provided");
    }

    // Start transaction
    $pdo->beginTransaction();

    try {
        // Insert cafe
        $stmt = $pdo->prepare("
            INSERT INTO cafes (
                name, address, area, description, image_url, price_range, 
                noise_level, avg_visit_length, opening_hours, featured, 
                menu_link, website, link_maps, instagram, amenities, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            trim($_POST['name']),
            trim($_POST['address']),
            trim($_POST['area']),
            trim($_POST['description']),
            $_POST['image_url'] ?? '',
            $price_range,
            $noise_level,
            $_POST['avg_visit_length'] ?? '1-2 hours',
            $opening_hours,
            isset($_POST['featured']) && $_POST['featured'] === '1' ? 1 : 0,
            $_POST['menu_link'] ?? null,
            $_POST['website'] ?? null,
            $_POST['link_maps'] ?? null,
            $_POST['instagram'] ?? null,
            $amenities,
            $tags
        ]);

        $cafe_id = $pdo->lastInsertId();

        // Insert images
        if (!empty($images_data) && is_array($images_data)) {
            $image_stmt = $pdo->prepare("
                INSERT INTO cafe_images (cafe_id, image_url, is_primary) 
                VALUES (?, ?, ?)
            ");
            
            foreach ($images_data as $image) {
                if (isset($image['image_url']) && !empty($image['image_url'])) {
                    $image_stmt->execute([
                        $cafe_id,
                        $image['image_url'],
                        isset($image['is_primary']) && $image['is_primary'] ? 1 : 0
                    ]);
                }
            }
        }

        // Insert promotions
        if (!empty($promotions_data) && is_array($promotions_data)) {
            $promo_stmt = $pdo->prepare("
                INSERT INTO promotions (cafe_id, title, description, valid_until, icon) 
                VALUES (?, ?, ?, ?, ?)
            ");
            
            foreach ($promotions_data as $promo) {
                if (isset($promo['title']) && !empty($promo['title'])) {
                    // Validate icon
                    $valid_icons = ['coffee', 'book', 'laptop'];
                    $icon = isset($promo['icon']) && in_array($promo['icon'], $valid_icons) 
                        ? $promo['icon'] 
                        : 'coffee';
                    
                    // Validate date
                    $valid_until = null;
                    if (isset($promo['valid_until']) && !empty($promo['valid_until'])) {
                        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $promo['valid_until'])) {
                            $valid_until = $promo['valid_until'];
                        }
                    }
                    
                    $promo_stmt->execute([
                        $cafe_id,
                        trim($promo['title']),
                        trim($promo['description'] ?? ''),
                        $valid_until,
                        $icon
                    ]);
                }
            }
        }

        // Commit transaction
        $pdo->commit();

        // Fetch the created cafe with all related data
        $cafe_stmt = $pdo->prepare("
            SELECT id, name, address, area, description, image_url, price_range, 
                   noise_level, avg_visit_length, opening_hours, featured, 
                   menu_link, website, link_maps, instagram, amenities, tags
            FROM cafes WHERE id = ?
        ");
        $cafe_stmt->execute([$cafe_id]);
        $cafe = $cafe_stmt->fetch(PDO::FETCH_ASSOC);

        // Fetch images
        $images_stmt = $pdo->prepare("
            SELECT id, image_url, is_primary 
            FROM cafe_images WHERE cafe_id = ? 
            ORDER BY is_primary DESC, id ASC
        ");
        $images_stmt->execute([$cafe_id]);
        $cafe_images = $images_stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch promotions
        $promos_stmt = $pdo->prepare("
            SELECT id, title, description, valid_until, icon, start_date 
            FROM promotions WHERE cafe_id = ? 
            ORDER BY start_date DESC
        ");
        $promos_stmt->execute([$cafe_id]);
        $cafe_promos = $promos_stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => [
                "cafe" => $cafe,
                "images" => $cafe_images,
                "promotions" => $cafe_promos
            ],
            "message" => "Cafe created successfully"
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Error in add_cafe: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>