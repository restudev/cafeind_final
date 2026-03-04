<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "127.0.0.1";
$dbname = "cafeind_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['cafe_id'])) {
        $cafe_id = (int)$_GET['cafe_id'];
        $stmt = $pdo->prepare("SELECT id, name, address, area, description, image_url, price_range, noise_level, 
            avg_visit_length, opening_hours, featured, menu_link, website, link_maps, instagram, amenities, tags
            FROM cafes WHERE id = ?");
        $stmt->execute([$cafe_id]);
        $cafe = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$cafe) {
            throw new Exception("Cafe not found");
        }

        // Pastikan nilai yang sesuai dengan database (TIDAK ada default override)
        $price_range = $cafe['price_range'] ?? 1;
        $noise_level = $cafe['noise_level'] ?? 'Moderate';
        $avg_visit_length = $cafe['avg_visit_length'] ?? '1-2 hours';

        $cafe_transformed = [
            'id' => $cafe['id'],
            'name' => $cafe['name'] ?? '',
            'address' => $cafe['address'] ?? '',
            'area' => $cafe['area'] ?? '',
            'description' => $cafe['description'] ?? '',
            'imageUrl' => $cafe['image_url'] ?? '',
            'priceRange' => $price_range,
            'priceRangeDisplay' => ['Budget ($)', 'Moderate ($$)', 'Expensive ($$$)'][$price_range - 1],
            'noiseLevel' => $noise_level,
            'avgVisitLength' => $avg_visit_length,
            'openingHours' => json_decode($cafe['opening_hours'], true) ?? ['Weekdays' => '', 'Weekends' => ''],
            'featured' => (bool)($cafe['featured'] ?? false),
            'menuLink' => $cafe['menu_link'] ?? '',
            'website' => $cafe['website'] ?? '',
            'linkMaps' => $cafe['link_maps'] ?? '',
            'instagram' => $cafe['instagram'] ?? '',
            'amenities' => json_decode($cafe['amenities'], true) ?? [],
            'tags' => json_decode($cafe['tags'], true) ?? [],
        ];

        $stmt = $pdo->prepare("SELECT id, image_url, is_primary FROM cafe_images WHERE cafe_id = ? ORDER BY is_primary DESC, id ASC");
        $stmt->execute([$cafe_id]);
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $pdo->prepare("SELECT id, title, description, valid_until, icon FROM promotions WHERE cafe_id = ? ORDER BY valid_until ASC");
        $stmt->execute([$cafe_id]);
        $promotions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        error_log("GET Response - Price Range: " . $price_range . ", Noise Level: " . $noise_level . ", Avg Visit Length: " . $avg_visit_length);

        echo json_encode([
            "success" => true,
            "data" => [
                "cafe" => $cafe_transformed,
                "images" => $images,
                "promotions" => $promotions,
            ],
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $pdo->beginTransaction();

        // Log raw POST data for debugging
        error_log("Raw POST data: " . json_encode($_POST));

        // Validate required fields
        $required_fields = ['cafe_id', 'name', 'address', 'area', 'description'];
        foreach ($required_fields as $field) {
            if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
                throw new Exception("Missing required field: $field");
            }
        }

        $cafe_id = (int)$_POST['cafe_id'];

        // Validate JSON fields - PERBAIKAN UNTUK AMENITIES
        $amenities = [];
        if (isset($_POST['amenities'])) {
            if (is_string($_POST['amenities'])) {
                $amenities = json_decode($_POST['amenities'], true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("Invalid JSON in amenities: " . json_last_error_msg());
                }
            } elseif (is_array($_POST['amenities'])) {
                $amenities = $_POST['amenities'];
            }
        }
        
        $tags = [];
        if (isset($_POST['tags'])) {
            if (is_string($_POST['tags'])) {
                $tags = json_decode($_POST['tags'], true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("Invalid JSON in tags: " . json_last_error_msg());
                }
            } elseif (is_array($_POST['tags'])) {
                $tags = $_POST['tags'];
            }
        }
        
        $opening_hours = [];
        if (isset($_POST['opening_hours'])) {
            if (is_string($_POST['opening_hours'])) {
                $opening_hours = json_decode($_POST['opening_hours'], true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception("Invalid JSON in opening_hours: " . json_last_error_msg());
                }
            } elseif (is_array($_POST['opening_hours'])) {
                $opening_hours = $_POST['opening_hours'];
            }
        }

        // Ensure arrays
        if (!is_array($amenities)) $amenities = [];
        if (!is_array($tags)) $tags = [];
        if (!is_array($opening_hours)) $opening_hours = [];

        // Clean amenities array - remove empty values
        $amenities = array_values(array_filter(array_map('trim', $amenities), function($item) {
            return !empty($item);
        }));
        
        error_log("Processed amenities: " . json_encode($amenities));

        // Validate price_range
        $price_range = isset($_POST['price_range']) ? (int)$_POST['price_range'] : null;
        $valid_price_ranges = [1, 2, 3];
        if (!in_array($price_range, $valid_price_ranges, true)) {
            throw new Exception("Invalid price range. Must be 1 (Budget), 2 (Moderate), or 3 (Expensive)");
        }

        $price_range_display = [
            1 => 'Budget ($)',
            2 => 'Moderate ($$)',
            3 => 'Expensive ($$$)'
        ];

        // Validate noise_level
        $noise_level = isset($_POST['noise_level']) ? trim($_POST['noise_level']) : null;
        $valid_noise_levels = ['Quiet', 'Moderate', 'Loud'];
        if (!$noise_level || !in_array($noise_level, $valid_noise_levels, true)) {
            throw new Exception("Invalid or missing noise level. Must be one of: " . implode(', ', $valid_noise_levels));
        }

        // Validate avg_visit_length
        $avg_visit_length = isset($_POST['avg_visit_length']) ? trim($_POST['avg_visit_length']) : null;
        $valid_visit_lengths = ['1-2 hours', '2-3 hours', '3-4 hours', '4-6 hours', '6+ hours'];
        if (!$avg_visit_length || !in_array($avg_visit_length, $valid_visit_lengths, true)) {
            throw new Exception("Invalid or missing average visit length. Must be one of: " . implode(', ', $valid_visit_lengths));
        }
        
        error_log("Received price_range: $price_range, noise_level: $noise_level, avg_visit_length: $avg_visit_length");

        // Handle URL fields with proper validation and normalization
        $url_fields = ['website', 'linkMaps', 'menuLink', 'instagram'];
        $urls = [];
        foreach ($url_fields as $field) {
            $post_field = $field === 'linkMaps' ? 'link_maps' : ($field === 'menuLink' ? 'menu_link' : $field);
            $value = isset($_POST[$field]) && trim($_POST[$field]) !== '' ? trim($_POST[$field]) : (isset($_POST[$post_field]) && trim($_POST[$post_field]) !== '' ? trim($_POST[$post_field]) : null);

            if ($value) {
                if (!preg_match('/^https?:\/\//i', $value)) {
                    $value = 'https://' . ltrim($value, '/');
                }
                if (!filter_var($value, FILTER_VALIDATE_URL)) {
                    throw new Exception("Invalid URL for $field: $value");
                }
                if ($field === 'linkMaps') {
                    $google_maps_patterns = ['maps\.google\.com', 'maps\.app\.goo\.gl', 'goo\.gl\/maps', 'google\.com\/maps', 'maps\.googleapis\.com'];
                    $is_valid_google_maps = false;
                    foreach ($google_maps_patterns as $pattern) {
                        if (preg_match("/$pattern/i", $value)) {
                            $is_valid_google_maps = true;
                            break;
                        }
                    }
                    if (!$is_valid_google_maps) {
                        throw new Exception("Google Maps link must be a valid Google Maps URL");
                    }
                }
                if ($field === 'instagram') {
                    if (preg_match('/^@?([a-zA-Z0-9._]{1,30})$/', $value, $matches)) {
                        $value = "https://www.instagram.com/" . ltrim($matches[1], '@');
                    } elseif (!preg_match('/^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}/i', $value)) {
                        throw new Exception("Invalid Instagram handle or URL: $value");
                    }
                }
            }
            $urls[$field] = $value;
        }

        // Handle deleted images
        $deleted_image_ids = isset($_POST['deleted_image_ids']) ? json_decode($_POST['deleted_image_ids'], true) : [];
        $deleted_image_ids = array_map('intval', array_filter((array)$deleted_image_ids));

        if (!empty($deleted_image_ids)) {
            $placeholders = implode(',', array_fill(0, count($deleted_image_ids), '?'));
            $stmt = $pdo->prepare("SELECT id, image_url FROM cafe_images WHERE id IN ($placeholders) AND cafe_id = ?");
            $stmt->execute(array_merge($deleted_image_ids, [$cafe_id]));
            $images_to_delete = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($images_to_delete) !== count($deleted_image_ids)) {
                throw new Exception("Some image IDs are invalid or do not belong to this cafe");
            }

            $stmt = $pdo->prepare("DELETE FROM cafe_images WHERE id IN ($placeholders) AND cafe_id = ?");
            $stmt->execute(array_merge($deleted_image_ids, [$cafe_id]));
            error_log("Deleted " . $stmt->rowCount() . " images from database");
        }

        // Handle new images
        $new_images = isset($_POST['images']) ? json_decode($_POST['images'], true) : [];
        $new_image_urls = [];

        if (!empty($new_images) && is_array($new_images)) {
            $stmt = $pdo->prepare("SELECT image_url FROM cafe_images WHERE cafe_id = ?");
            $stmt->execute([$cafe_id]);
            $existing_urls = $stmt->fetchAll(PDO::FETCH_COLUMN);

            foreach ($new_images as $image) {
                if (!isset($image['image_url']) || empty(trim($image['image_url']))) {
                    continue;
                }

                $image_url = trim($image['image_url']);
                $is_primary = isset($image['is_primary']) ? (bool)$image['is_primary'] : false;

                if (in_array($image_url, $existing_urls)) {
                    continue;
                }

                if (!filter_var($image_url, FILTER_VALIDATE_URL)) {
                    throw new Exception("Invalid image URL: $image_url");
                }

                $stmt = $pdo->prepare("INSERT INTO cafe_images (cafe_id, image_url, is_primary) VALUES (?, ?, ?)");
                $stmt->execute([$cafe_id, $image_url, $is_primary ? 1 : 0]);
                $new_image_urls[] = $image_url;
                error_log("Added new image URL: " . $image_url);
            }
        }

        // Update main image
        $main_image_url = trim($_POST['image_url'] ?? '');
        if (!empty($main_image_url)) {
            if (!filter_var($main_image_url, FILTER_VALIDATE_URL)) {
                throw new Exception("Invalid main image URL: $main_image_url");
            }
            $stmt = $pdo->prepare("UPDATE cafe_images SET is_primary = 0 WHERE cafe_id = ?");
            $stmt->execute([$cafe_id]);

            $stmt = $pdo->prepare("UPDATE cafe_images SET is_primary = 1 WHERE cafe_id = ? AND image_url = ?");
            $stmt->execute([$cafe_id, $main_image_url]);

            if ($stmt->rowCount() === 0) {
                $stmt = $pdo->prepare("INSERT INTO cafe_images (cafe_id, image_url, is_primary) VALUES (?, ?, ?)");
                $stmt->execute([$cafe_id, $main_image_url, 1]);
            }
            error_log("Set main image: " . $main_image_url);
        }

        // Update cafe basic info
        $stmt = $pdo->prepare("UPDATE cafes SET 
            name = ?, 
            address = ?, 
            area = ?, 
            description = ?, 
            image_url = ?,
            price_range = ?, 
            noise_level = ?, 
            avg_visit_length = ?, 
            opening_hours = ?,
            featured = ?, 
            menu_link = ?, 
            website = ?, 
            link_maps = ?, 
            instagram = ?,
            amenities = ?, 
            tags = ?
            WHERE id = ?");

        $result = $stmt->execute([
            trim($_POST['name']),
            trim($_POST['address']),
            trim($_POST['area']),
            trim($_POST['description']),
            $main_image_url,
            $price_range,
            $noise_level,
            $avg_visit_length,
            json_encode($opening_hours),
            isset($_POST['featured']) ? (int)$_POST['featured'] : 0,
            $urls['menuLink'],
            $urls['website'],
            $urls['linkMaps'],
            $urls['instagram'],
            json_encode($amenities),
            json_encode($tags),
            $cafe_id
        ]);

        if (!$result) {
            throw new Exception("Failed to update cafe basic information");
        }

        error_log("Cafe updated successfully. Affected rows: " . $stmt->rowCount());

        // Handle promotions
        $promos = isset($_POST['promo']) ? json_decode($_POST['promo'], true) : [];
        if (is_array($promos)) {
            $stmt = $pdo->prepare("SELECT id FROM promotions WHERE cafe_id = ?");
            $stmt->execute([$cafe_id]);
            $existing_promo_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

            $valid_icons = ['coffee', 'book', 'laptop'];

            foreach ($promos as $promo) {
                if (empty($promo['title']) || empty($promo['description']) || empty($promo['valid_until'])) {
                    continue;
                }

                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $promo['valid_until'])) {
                    throw new Exception("Invalid date format for promotion: " . $promo['valid_until']);
                }

                if (strtotime($promo['valid_until']) < strtotime('today')) {
                    throw new Exception("Promotion end date cannot be in the past: " . $promo['valid_until']);
                }

                $icon = $promo['icon'] ?? 'coffee';
                if (!in_array($icon, $valid_icons)) {
                    throw new Exception("Invalid promotion icon: $icon");
                }

                $promo_id = isset($promo['id']) && !is_string($promo['id']) ? (int)$promo['id'] : null;

                if ($promo_id && in_array($promo_id, $existing_promo_ids)) {
                    $stmt = $pdo->prepare("UPDATE promotions SET 
                        title = ?, 
                        description = ?, 
                        valid_until = ?, 
                        icon = ? 
                        WHERE id = ? AND cafe_id = ?");
                    $stmt->execute([
                        trim($promo['title']),
                        trim($promo['description']),
                        $promo['valid_until'],
                        $icon,
                        $promo_id,
                        $cafe_id
                    ]);
                    $existing_promo_ids = array_diff($existing_promo_ids, [$promo_id]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO promotions (cafe_id, title, description, valid_until, icon) 
                        VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([
                        $cafe_id,
                        trim($promo['title']),
                        trim($promo['description']),
                        $promo['valid_until'],
                        $icon
                    ]);
                }
            }

            if (!empty($existing_promo_ids)) {
                $placeholders = implode(',', array_fill(0, count($existing_promo_ids), '?'));
                $stmt = $pdo->prepare("DELETE FROM promotions WHERE id IN ($placeholders) AND cafe_id = ?");
                $stmt->execute(array_merge($existing_promo_ids, [$cafe_id]));
            }
        }

        // Fetch updated cafe data
        $stmt = $pdo->prepare("SELECT id, name, address, area, description, image_url, price_range, noise_level, 
            avg_visit_length, opening_hours, featured, menu_link, website, link_maps, instagram, amenities, tags
            FROM cafes WHERE id = ?");
        $stmt->execute([$cafe_id]);
        $updated_cafe = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$updated_cafe) {
            throw new Exception("Failed to retrieve updated cafe data");
        }

        $updated_cafe_transformed = [
            'id' => $updated_cafe['id'],
            'name' => $updated_cafe['name'],
            'address' => $updated_cafe['address'],
            'area' => $updated_cafe['area'],
            'description' => $updated_cafe['description'],
            'imageUrl' => $updated_cafe['image_url'],
            'priceRange' => $updated_cafe['price_range'],
            'priceRangeDisplay' => $price_range_display[$updated_cafe['price_range']],
            'noiseLevel' => $updated_cafe['noise_level'],
            'avgVisitLength' => $updated_cafe['avg_visit_length'],
            'openingHours' => json_decode($updated_cafe['opening_hours'], true),
            'featured' => (bool)$updated_cafe['featured'],
            'menuLink' => $updated_cafe['menu_link'],
            'website' => $updated_cafe['website'],
            'linkMaps' => $updated_cafe['link_maps'],
            'instagram' => $updated_cafe['instagram'],
            'amenities' => json_decode($updated_cafe['amenities'], true),
            'tags' => json_decode($updated_cafe['tags'], true),
        ];

        $stmt = $pdo->prepare("SELECT id, image_url, is_primary FROM cafe_images WHERE cafe_id = ? ORDER BY is_primary DESC, id ASC");
        $stmt->execute([$cafe_id]);
        $updated_images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $pdo->prepare("SELECT id, title, description, valid_until, icon FROM promotions WHERE cafe_id = ? ORDER BY valid_until ASC");
        $stmt->execute([$cafe_id]);
        $updated_promos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo->commit();

        echo json_encode([
            "success" => true,
            "message" => "Cafe updated successfully",
            "data" => [
                "cafe" => $updated_cafe_transformed,
                "images" => $updated_images,
                "promotions" => $updated_promos,
            ],
            "new_images" => $new_image_urls,
            "main_image" => $main_image_url,
            "cafe_id" => $cafe_id,
            "debug" => [
                "website_saved" => $updated_cafe_transformed['website'],
                "linkMaps_saved" => $updated_cafe_transformed['linkMaps'],
                "menuLink_saved" => $updated_cafe_transformed['menuLink'],
                "instagram_saved" => $updated_cafe_transformed['instagram'],
                "price_range_saved" => $updated_cafe_transformed['priceRange'],
                "price_range_display" => $updated_cafe_transformed['priceRangeDisplay'],
                "noise_level_saved" => $updated_cafe_transformed['noiseLevel'],
                "avg_visit_length_saved" => $updated_cafe_transformed['avgVisitLength'],
                "amenities_processed" => $amenities,
                "amenities_saved" => $updated_cafe_transformed['amenities']
            ]
        ]);
    }
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Error in update_cafe: " . $e->getMessage() . "\nTrace: " . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage(),
    ]);
}