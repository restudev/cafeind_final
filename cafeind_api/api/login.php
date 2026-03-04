<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Periksa apakah request adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Metode tidak diizinkan"]);
    exit();
}

// Koneksi ke database
require_once '../config/db_connect.php';

// Ambil data dari request
$input = json_decode(file_get_contents("php://input"), true);

// Tambahkan debugging untuk melihat data input
error_log("Login data received: " . json_encode($input));

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

// Tambahkan debug log untuk melihat nilai email dan password
error_log("Email: $email, Password: $password");

// Validasi input
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email dan password diperlukan"]);
    exit();
}

// Sementara untuk debugging - cek apakah email dan password sesuai dengan hardcoded values
if ($email === 'admin@cafeind_db.com' && $password === 'admin123') {
    error_log("Hardcoded login successful");
    $mockUser = [
        "id" => "1",
        "name" => "Admin User",
        "email" => "admin@cafeind_db.com",
        "role" => "admin",
        "avatar" => "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ];
    $mockToken = "mock-jwt-token-12345"; // Simulate a token
    echo json_encode([
        "success" => true,
        "message" => "Login berhasil dengan credentials hardcoded",
        "user" => $mockUser,
        "token" => $mockToken
    ]);
    exit();
}

try {
    // Cari user berdasarkan email
    $stmt = $conn->prepare("SELECT id, name, email, password, role, avatar FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    error_log("User query result: " . json_encode($user));

    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Email tidak ditemukan"]);
        exit();
    }

    // Verifikasi password
    if (password_verify($password, $user['password'])) {
        // Remove password from the user data before sending
        unset($user['password']);
        $token = bin2hex(random_bytes(16)); // Generate a simple token (in production, use JWT)
        echo json_encode([
            "success" => true,
            "message" => "Login berhasil",
            "user" => $user,
            "token" => $token
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Password tidak valid"]);
    }
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Kesalahan server", "error" => $e->getMessage()]);
}

$conn = null;