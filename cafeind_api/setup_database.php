<?php
$host = "localhost";
$dbname = "u902445296_db_cjDsnbtJ";
$username = "u902445296_usr_cjDsnbtJ";
$password = "Rr030604*";

try {
    // Hubungkan langsung ke database yang sudah ada
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Buat tabel 'users' jika belum ada
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'user') DEFAULT 'user',
        avatar VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    echo "Tabel 'users' berhasil dibuat atau sudah ada.<br>";

    // Cek apakah admin sudah ada
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = 'admin@cafeind_db.com'");
    $stmt->execute();
    $adminExists = (int)$stmt->fetchColumn();

    if ($adminExists === 0) {
        // Buat admin default jika belum ada
        $adminPassword = password_hash('admin123', PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) 
                               VALUES (:name, :email, :password, :role)");
        $stmt->execute([
            ':name'     => 'Admin User',
            ':email'    => 'admin@cafeind.com',
            ':password' => $adminPassword,
            ':role'     => 'admin'
        ]);

        echo "Admin default berhasil dibuat dengan email: admin@cafeind_db.com dan password: admin123<br>";
    } else {
        echo "Admin sudah ada dalam database.<br>";
    }

    echo "<p>Setup tabel users selesai.</p>";

} catch (PDOException $e) {
    echo "Kesalahan: " . $e->getMessage();
}
?>
