-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 11:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafeind_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cafes`
--

CREATE TABLE `cafes` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `area` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price_range` tinyint(3) UNSIGNED NOT NULL,
  `noise_level` enum('Quiet','Moderate','Loud') NOT NULL,
  `avg_visit_length` varchar(50) NOT NULL,
  `opening_hours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`opening_hours`)),
  `featured` tinyint(1) DEFAULT 0,
  `menu_link` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `link_maps` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `created_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cafes`
--

INSERT INTO `cafes` (`id`, `name`, `address`, `area`, `description`, `image_url`, `price_range`, `noise_level`, `avg_visit_length`, `opening_hours`, `featured`, `menu_link`, `website`, `link_maps`, `instagram`, `amenities`, `tags`, `created_date`) VALUES
('cafe-1', 'KOV Koffie', 'Jl. Sultan Agung No.135, Kaliwiru, Kec. Candisari', 'Candisari', 'A 24-hour cafe with a comfortable ambiance, private meeting rooms, and WiFi, ideal for remote work and business meetings.', NULL, 2, 'Quiet', '3-5 hours', '{\"Weekdays\": \"24 Hour\", \"Weekends\": \"24 Hour\"}', 1, 'https://online.fliphtml5.com/eapbd/sufd/#p=1', 'https://kofkoffie.com/', 'https://maps.app.goo.gl/hTMNSsio1qFkVmzKA', 'https://www.instagram.com/kovkoffie', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\"]', '[\"24 Hour\", \"Cozy\", \"WFC\", \"Instagrammable\"]', '2025-02-28 17:00:00'),
('cafe-10', 'Think Tank Coffee & Working', 'Jl. Puri Anjasmoro Blok F1 no.15A lt.1, Tawangsari, Kec. Semarang Barat', 'Semarang Barat', 'A cafe and coworking space with a comfortable ambiance, suitable for working, relaxing, or holding meetings.', NULL, 1, 'Moderate', '2-4 hours', '{\"Weekdays\": \"10:00 AM - 10:00 PM\", \"Weekends\": \"10:00 AM - 10:00 PM\"}', 1, 'https://online.fliphtml5.com/mnfbj/ffpe/#p=1', NULL, 'https://maps.app.goo.gl/oyL6in2PCq6m1FNYA', 'https://www.instagram.com/thinktankcoffeeworking', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\"]', '[\"Cozy\", \"Meeting Friendly\", \"Coworking Space\"]', '2025-02-28 17:00:00'),
('cafe-11', 'Makabana Coffee House', 'Jl. Diponegoro No.22, Tegalsari, Kec. Candisari', 'Candisari', 'A cafe and coworking space with an aesthetic design, offering a comfortable ambiance for working, relaxing, or holding meetings.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"08:00 AM - 09:00 PM\", \"Weekends\": \"08:00 AM - 09:00 PM\"}', 1, 'https://online.fliphtml5.com/ixeum/scbk/', NULL, 'https://maps.app.goo.gl/jb61RjPzAq86BPms5', 'https://www.instagram.com/makabanasemarang', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\", \"Printing Services\"]', '[\"Cozy\", \"Meeting Friendly\", \"Coworking Space\"]', '2025-02-28 17:00:00'),
('cafe-12', 'Moment coffee & Space', 'Jl. Rajabasa No.82-83, Karangrejo, Kec. Gajahmungkur', 'Gajahmungkur', 'A cafe and coworking space with an aesthetic design, offering a comfortable ambiance for working, relaxing, or holding meetings.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"09:00 AM - 11:00 PM\", \"Weekends\": \"09:00 AM - 11:00 PM\"}', 1, NULL, NULL, 'https://maps.app.goo.gl/vVNjijaxskHx5si5A', 'https://www.instagram.com/momentcoffee.smg', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\"]', '[\"Industrial\", \"Cozy\", \"Meeting Friendly\"]', '2025-02-28 17:00:00'),
('cafe-13', 'Anak Panah Kopi Plus Gajah Mada', 'Jl. Gajahmada No.91, Miroto, Kec. Semarang Tengah', 'Semarang Tengah', 'A 24-hour cafe with a comfortable ambiance, suitable for working, relaxing, or holding meetings. Equipped with facilities like a meeting room, green ground space, and fast WiFi.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"24 Hour\", \"Weekends\": \"24 Hour\"}', 1, 'https://drive.google.com/drive/folders/1Cczpf4aXmPcF1Xa8gHh_w3Oyx_r4BXEt', NULL, 'https://maps.app.goo.gl/KkjKNUPRQzvLZuGK8', 'https://www.instagram.com/anakpanahplus', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Prayer Room\"]', '[\"24 Hour\", \"Cozy\", \"Meeting Friendly\"]', '2025-02-28 17:00:00'),
('cafe-14', 'Kayo Coffee and Eatery', 'Jl. Melati Selatan No.8A, Brumbungan, Kec. Semarang Tengah', 'Semarang Tengah', 'A trendy cafe with a cozy and aesthetic interior, offering Indonesian and Western menus. No explicit information about a private meeting room, but suitable for hanging out, working, or WFC.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"09:00 AM - 12:00 AM\", \"Weekends\": \"09:00 AM - 12:00 AM\"}', 1, 'https://anyflip.com/diaev/rphb/', NULL, 'https://maps.app.goo.gl/Zq67mFb9TnN23YMW6', 'https://www.instagram.com/kayo.eatery', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Smoking Area\", \"Non-Smoking Area\"]', '[\"Cozy\", \"Aesthetic\", \"WFC\"]', '2025-04-30 17:00:00'),
('cafe-2', 'Kopitagram Dr. Cipto', 'Jl. Dr. Cipto No.111, Sarirejo, Kec. Semarang Timur', 'Semarang Timur', 'Offers a modern minimalist design with a cozy ambiance, suitable for working or relaxing. Features indoor, semi-outdoor, and outdoor areas with greenery.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"08:00 AM - 12:00 PM\", \"Weekends\": \"08:00 AM - 12:00 PM\"}', 1, 'https://drive.google.com/file/d/1xcDiWCgSIWj5-hdd_3FOjiYKRBgdsdwl/view?usp=sharing', 'https://kopitagram.com/', 'https://maps.app.goo.gl/vbffSq6npXnh154B7', 'https://www.instagram.com/kopitagram', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\"]', '[\"Modern\", \"Cozy\", \"Instagrammable\", \"WFC\"]', '2025-02-28 17:00:00'),
('cafe-3', 'Kopi Tetangga Panjangan', 'Jalan Raya Panjangan, Manyaran, Kec. Semarang Barat', 'Semarang Barat', 'A simple cozy coffee shop ideal for working or relaxing. Features a rooftop, non-smoking area, air-conditioned smoking area, meeting room, and prayer room, making it Muslim-friendly.', NULL, 1, 'Moderate', '2-4 hours', '{\"Weekdays\": \"09:00 AM - 10:00 PM\", \"Weekends\": \"09:00 AM - 10:00 PM\"}', 1, 'https://tr.ee/i98Wm6Tr4E', NULL, 'https://maps.app.goo.gl/dbyDcVP5tsHJKpqp6', 'https://www.instagram.com/kopitetangga_smg', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\", \"Non-Smoking Area\", \"Smoking Area\"]', '[\"Cozy\", \"Muslim Friendly\", \"Rooftop\"]', '2025-02-28 17:00:00'),
('cafe-4', 'Folkafe at Alva', 'Jl. Gajahmada No.184, Pekunden, Kec. Semarang Tengah', 'Semarang Tengah', 'Cafe yang berada dalam area Alva Hotel, menyediakan ruang luas, ambience tenang, dan cocok untuk kerja atau pertemuan kecil.', NULL, 2, 'Quiet', '2-4 hours', '{\"Weekdays\": \"07:00 AM - 10:00 PM\", \"Weekends\": \"07:00 AM - 10:00 PM\"}', 1, 'https://online.fliphtml5.com/yhhkh/fkuo/#p=1', NULL, 'https://maps.app.goo.gl/dhXsDYAu2rDi4TDs9', 'https://www.instagram.com/folcafe.id', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\"]', '[\"Spacious\", \"Quiet\"]', '2025-02-28 17:00:00'),
('cafe-5', 'WWW Creative Space', 'Jl. Depok No.38e, Kembangsari, Kec. Semarang Tengah', 'Semarang Tengah', 'A creative workspace and cafe with an open-space concept and art gallery, ideal for work and creative activities.', NULL, 2, 'Quiet', '3-5 hours', '{\"Weekdays\": \"09:00 AM - 10:00 PM\", \"Weekends\": \"09:00 AM - 10:00 PM\"}', 1, 'https://drive.google.com/file/d/1YPK_5QsVfIBC8gpIPBaXOaDC9a2vrbBZ/view', NULL, 'https://maps.app.goo.gl/YJrbu8tfmmnEMGoSA', 'https://www.instagram.com/creativespacesmg', '[\"High-Speed WiFi\", \"Power Outlets\", \"Prayer Room\", \"Coffee\", \"Art Space\"]', '[\"Creative\", \"Art Gallery\", \"Comfortable\"]', '2025-02-28 17:00:00'),
('cafe-6', 'Kurogi Cafe', 'Jl. Ahmad Yani No.167 A lantai 2, Pleburan, Kec. Semarang Selatan', 'Semarang Selatan', 'Kurogi Cafe is a Japanese-themed coffee shop offering a cozy and aesthetic ambiance, perfect for relaxing or holding business meetings.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"11:00 AM - 10:00 PM\", \"Weekends\": \"11:00 AM - 10:00 PM\"}', 1, 'https://drive.google.com/file/d/1rGWfCK3F46tIvYwJMfZVlNNELwrwFlis/view', NULL, 'https://maps.app.goo.gl/W8jg35RXA4Y9Nvp8A', 'https://www.instagram.com/kurogi.smg', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\"]', '[\"Cozy\", \"Meeting Friendly\", \"Japanese Theme\"]', '2025-02-28 17:00:00'),
('cafe-7', 'Cold \'N Brew D.I. Panjaitan', 'Jl. Mayor Jend. D.I. Panjaitan No.9A, Miroto, Kec. Semarang Tengah', 'Semarang Tengah', 'A 24-hour coffee shop with comprehensive facilities like meeting rooms, a rooftop, and fast WiFi, suitable for work, team discussions, or relaxing.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"24 Hour\", \"Weekends\": \"24 Hour\"}', 1, 'https://drive.google.com/drive/folders/18q1cIGsF8ahtYt3IDuPUWM_jeEBbCjKs', NULL, 'https://maps.app.goo.gl/xjjJdhKcKi2VrR2r7', 'https://www.instagram.com/coldnbrew', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\"]', '[\"24 Hour\", \"Cozy\", \"Meeting Friendly\"]', '2025-02-28 17:00:00'),
('cafe-8', 'Domestik Coffee', 'Jl. Menteri Supeno No.38, Mugassari, Kec. Semarang Selatan', 'Semarang Selatan', 'Domestik Coffee is a cozy café offering a spacious and quiet environment, making it ideal for meetings, work, or study sessions. The café features indoor seating and ample indoor parking.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"06:00 AM - 11:00 PM\", \"Weekends\": \"06:00 AM - 11:00 PM\"}', 1, 'https://drive.google.com/file/d/1cAj89oamX8elRAGhuYqH835hrXLDHZkd/view', NULL, 'https://maps.app.goo.gl/mEYwDDXReudQ4SVP9', 'https://www.instagram.com/coffeeeatdomestik', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Indoor Seating\", \"Indoor Parking\", \"Prayer Room\"]', '[\"Cozy\", \"Work Friendly\", \"Instagrammable\"]', '2025-02-28 17:00:00'),
('cafe-9', 'Nirwana Stable', 'Kedongjangan, Purwosari, Kec.Mijen', 'Mijen', 'A unique resto and cafe with a natural atmosphere, offering horseback riding, a garden, and playground. Suitable for families, meetings, or relaxing.', NULL, 2, 'Moderate', '2-4 hours', '{\"Weekdays\": \"10:00 AM - 06:30 PM\", \"Weekends\": \"08:00 AM - 07:30 PM\"}', 1, 'https://drive.google.com/drive/folders/1QE18K5K6hLDa5quQG1F3QWQTpGdmzLUu', NULL, 'https://maps.app.goo.gl/4THrEfhAbHiu4T3n6', 'https://www.instagram.com/nirwanarestocafe', '[\"High-Speed WiFi\", \"Power Outlets\", \"Air Conditioning\", \"Coffee\", \"Snacks\", \"Meeting Room\", \"Outdoor Seating\", \"Prayer Room\"]', '[\"Cozy\", \"Meeting Friendly\", \"Family Friendly\", \"Nature\"]', '2025-02-28 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `cafe_images`
--

CREATE TABLE `cafe_images` (
  `id` int(11) NOT NULL,
  `cafe_id` varchar(50) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cafe_images`
--

INSERT INTO `cafe_images` (`id`, `cafe_id`, `image_url`, `is_primary`) VALUES
(1, 'cafe-1', 'https://via.placeholder.com/300x200?text=KOV+Koffie+1', 1),
(2, 'cafe-1', 'https://via.placeholder.com/300x200?text=KOV+Koffie+2', 0);

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `cafe_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `priceIDR` int(11) NOT NULL,
  `specialty` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `cafe_id`, `name`, `category`, `priceIDR`, `specialty`) VALUES
(1, 'cafe-7', 'Cold Brew Coffee', 'Drinks', 35000, 1),
(2, 'cafe-7', 'Snack Platter', 'Food', 45000, 0),
(3, 'cafe-7', 'Chocolate Cake', 'Dessert', 40000, 0),
(4, 'cafe-1', 'Espresso', 'Drinks', 30000, 1),
(5, 'cafe-1', 'Croissant', 'Food', 25000, 0),
(6, 'cafe-12', 'Latte', 'Drinks', 32000, 0),
(7, 'cafe-12', 'Pasta Alfredo', 'Food', 50000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` varchar(50) NOT NULL,
  `cafe_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `valid_until` date NOT NULL,
  `icon` enum('coffee','book','laptop') NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `cafe_id`, `title`, `description`, `valid_until`, `icon`, `start_date`) VALUES
('promo-1', 'cafe-1', 'Work From KOV', 'Get 20% off on coffee and snacks when you work at KOV Koffie for 4+ hours!', '2025-05-25', 'laptop', '2025-04-24 17:00:00'),
('promo-2', 'cafe-1', 'Midnight Brew', 'Free refill on selected coffee drinks after 10 PM for night owls!', '2025-05-20', 'coffee', '2025-04-19 17:00:00'),
('promo-3', 'cafe-7', 'Brew & Meet', 'Book a meeting room and get a free cold brew for each participant (min. 4 people).', '2025-05-15', 'laptop', '2025-04-14 17:00:00'),
('promo-4', 'cafe-7', 'Rooftop Reads', 'Buy any book-themed drink and get a 15% discount on snacks.', '2025-06-01', 'book', '2025-05-01 17:00:00'),
('promo-5', 'cafe-12', 'Pasta & Latte Combo', 'Order any pasta dish and get a latte for only Rp 20,000!', '2025-05-22', 'coffee', '2025-04-21 17:00:00'),
('promo-6', 'cafe-2', 'Morning Boost', 'Get a free croissant with any coffee order before 10 AM.', '2025-05-10', 'coffee', '2025-04-09 17:00:00'),
('promo-7', 'cafe-8', 'Study Session Deal', 'Free WiFi upgrade and 10% off snacks for students with valid ID.', '2025-05-30', 'laptop', '2025-04-29 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `cafe_id` varchar(50) NOT NULL,
  `wifi_quality` int(11) DEFAULT NULL,
  `power_outlets` int(11) DEFAULT NULL,
  `comfort_level` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `user` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `cafe_id`, `wifi_quality`, `power_outlets`, `comfort_level`, `comment`, `date`, `user`) VALUES
(1, 'cafe-1', 4, 3, 5, 'Great place to work, very cozy!', '2025-05-19T02:00:00Z', 'anon123');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','manager','user') DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@cafeind.com', '$2y$10$Rv3Lj50fFHn3pGPvIN9bgOW7EEmXjiEW2v5xCDs8ZBXlMvSQSNrH.', 'admin', NULL, '2025-05-18 22:55:23', '2025-05-18 22:55:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cafes`
--
ALTER TABLE `cafes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cafe_images`
--
ALTER TABLE `cafe_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cafe_id` (`cafe_id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cafe_id` (`cafe_id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cafe_id` (`cafe_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cafe_id` (`cafe_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cafe_images`
--
ALTER TABLE `cafe_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cafe_images`
--
ALTER TABLE `cafe_images`
  ADD CONSTRAINT `cafe_images_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `promotions`
--
ALTER TABLE `promotions`
  ADD CONSTRAINT `promotions_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
