<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Match your frontend port
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

    // Get cafe_id from query string
    $cafe_id = isset($_GET['cafe_id']) ? (int)$_GET['cafe_id'] : null;

    if ($cafe_id) {
        // Fetch specific cafe by cafe_id
        $stmt = $pdo->prepare("SELECT id, name, address, area, description, image_url, price_range, noise_level, 
            avg_visit_length, opening_hours, featured, menu_link, website, link_maps, instagram, amenities, tags
            FROM cafes WHERE id = ?");
        $stmt->execute([$cafe_id]);
        $cafe = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$cafe) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Kafe dengan ID $cafe_id tidak ditemukan",
                "data" => [],
                "metadata" => [
                    'areas' => ['All Areas'],
                    'amenities' => [],
                    'total_cafes' => 0,
                    'total_areas' => 0,
                    'total_amenities' => 0
                ]
            ]);
            exit;
        }
        $cafes = [$cafe];
    } else {
        // Fetch all cafes
        $stmt = $pdo->prepare("SELECT id, name, address, area, description, image_url, price_range, noise_level, 
            avg_visit_length, opening_hours, featured, menu_link, website, link_maps, instagram, amenities, tags
            FROM cafes ORDER BY name ASC");
        $stmt->execute();
        $cafes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Process data and metadata
    $areas = ['All Areas'];
    $amenitiesSet = [];

    foreach ($cafes as &$cafe) {
        // Fetch reviews for this cafe
        $reviewStmt = $pdo->prepare("SELECT wifi_quality AS wifiQuality, power_outlets AS powerOutlets, 
            comfort_level AS comfortLevel, comment, date, user FROM reviews WHERE cafe_id = ?");
        $reviewStmt->execute([$cafe['id']]);
        $reviews = $reviewStmt->fetchAll(PDO::FETCH_ASSOC);
        $cafe['reviews'] = $reviews ?: [];

        // Calculate average rating
        if (!empty($reviews)) {
            $totalQuality = 0;
            $totalOutlets = 0;
            $totalComfort = 0;
            $reviewCount = count($reviews);

            foreach ($reviews as $review) {
                $totalQuality += $review['wifiQuality'] ?? 0;
                $totalOutlets += $review['powerOutlets'] ?? 0;
                $totalComfort += $review['comfortLevel'] ?? 0;
            }

            $cafe['rating'] = ($totalQuality + $totalOutlets + $totalComfort) / (3 * $reviewCount);
        } else {
            $cafe['rating'] = 0.0;
        }

        // Fetch images from cafe_images table
        $imageStmt = $pdo->prepare("SELECT id, image_url, is_primary FROM cafe_images WHERE cafe_id = ? ORDER BY is_primary DESC, id ASC");
        $imageStmt->execute([$cafe['id']]);
        $cafe['images'] = $imageStmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch promotions from promotions table
        $promoStmt = $pdo->prepare("SELECT id, title, description, valid_until, icon, start_date FROM promotions WHERE cafe_id = ? ORDER BY valid_until ASC");
        $promoStmt->execute([$cafe['id']]);
        $cafe['promotions'] = $promoStmt->fetchAll(PDO::FETCH_ASSOC);

        // Transform fields to camelCase and process JSON
        $cafe['openingHours'] = !empty($cafe['opening_hours']) ? json_decode($cafe['opening_hours'], true) : ['Weekdays' => '', 'Weekends' => ''];
        $cafe['imageUrl'] = $cafe['image_url'] ?? ($cafe['images'] && count($cafe['images']) > 0 ? $cafe['images'][0]['image_url'] : 'https://via.placeholder.com/300x200');
        $cafe['amenities'] = !empty($cafe['amenities']) ? json_decode($cafe['amenities'], true) : [];
        $cafe['tags'] = !empty($cafe['tags']) ? json_decode($cafe['tags'], true) : [];
        $cafe['priceRange'] = (int)$cafe['price_range'];
        $cafe['noiseLevel'] = $cafe['noise_level'];
        $cafe['avgVisitLength'] = $cafe['avg_visit_length'];
        $cafe['featured'] = (bool)$cafe['featured'];
        $cafe['menuLink'] = $cafe['menu_link'] ?? null;
        $cafe['linkMaps'] = $cafe['link_maps'] ?? null;
        $cafe['website'] = $cafe['website'] ?? null;
        $cafe['instagram'] = $cafe['instagram'] ?? null;

        // Collect unique areas and amenities
        if (!empty($cafe['area']) && !in_array($cafe['area'], $areas)) {
            $areas[] = $cafe['area'];
        }
        if (is_array($cafe['amenities'])) {
            foreach ($cafe['amenities'] as $amenity) {
                if (!in_array($amenity, $amenitiesSet)) {
                    $amenitiesSet[] = $amenity;
                }
            }
        }

        // Remove snake_case fields
        unset($cafe['opening_hours'], $cafe['noise_level'], $cafe['avg_visit_length'], 
              $cafe['menu_link'], $cafe['link_maps'], $cafe['image_url'], $cafe['price_range']);

        // Log fetched URL values for debugging
        error_log("Fetched URL values for cafe ID {$cafe['id']} - Website: " . ($cafe['website'] ?? 'null') .
            ", LinkMaps: " . ($cafe['linkMaps'] ?? 'null') .
            ", MenuLink: " . ($cafe['menuLink'] ?? 'null') .
            ", Instagram: " . ($cafe['instagram'] ?? 'null'));
    }
    unset($cafe);

    // Sort areas (except "All Areas")
    $areas = array_unique($areas);
    sort($areas);
    $areas = array_merge(['All Areas'], array_diff($areas, ['All Areas']));

    // Sort amenities
    sort($amenitiesSet);

    // Prepare metadata
    $metadata = [
        'areas' => $areas,
        'amenities' => $amenitiesSet,
        'total_cafes' => count($cafes),
        'total_areas' => count($areas) - 1,
        'total_amenities' => count($amenitiesSet)
    ];

    echo json_encode([
        "success" => true,
        "data" => $cafes,
        "metadata" => $metadata,
        "message" => $cafe_id ? "Kafe berhasil diambil" : "Semua kafe berhasil diambil"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Kesalahan database: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Kesalahan database: " . $e->getMessage(),
        "data" => [],
        "metadata" => [
            'areas' => ['All Areas'],
            'amenities' => [],
            'total_cafes' => 0,
            'total_areas' => 0,
            'total_amenities' => 0
        ]
    ]);
} catch (Exception $e) {
    http_response_code(response_code: 500);
    error_log("Kesalahan umum: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan: " . $e->getMessage(),
        "data" => [],
        "metadata" => [
            'areas' => ['All Areas'],
            'amenities' => [],
            'total_cafes' => 0,
            'total_areas' => 0,
            'total_amenities' => 0
        ]
    ]);
}
?>