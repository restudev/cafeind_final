-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 02:45 AM
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
  `id` int(11) NOT NULL,
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
(1, 'KOV Koffie', 'Jl. Sultan Agung No.135, Kaliwiru, Kec. Candisari', 'Candisari', 'A 24-hour cafe with a comfortable ambiance, private meeting rooms, and WiFi, ideal for remote work and business meetings.', 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750000637/cafe_images/cafe_images/cafe_1_684ee3f892b08.webp', 1, 'Moderate', '3-4 hours', '{\"Weekdays\":\"24 Hour\",\"Weekends\":\"24 Hour\"}', 1, 'https://online.fliphtml5.com/eapbd/sufd/#p=1', 'https://kofkoffie.com/', 'https://maps.app.goo.gl/96HVA5963YqJ2HYh6', 'https://www.instagram.com/kovkoffie/', '[\"High-Speed WiFi\",\"Power Outlets\",\"Air Conditioning\",\"Coffee\",\"Snacks\",\"Outdoor Seating\",\"Meeting Room\"]', '[\"Cozy\",\"WFC\",\"24 Hours\"]', '2025-02-28 17:00:01'),
(23, 'Cold \'N Brew D.I. Panjaitan', 'Jl. Mayor Jend. D.I. Panjaitan No.9A, Miroto, Kec. Semarang Tengah', 'Semarang Tengah', 'A 24-hour coffee shop with comprehensive facilities like meeting rooms, a rooftop, and fast WiFi, suitable for work, team discussions, or relaxing.', 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749940883/cafe_images/cafe_images/cafe_23_684dfa8d29ba7.png', 2, 'Moderate', '2-3 hours', '{\"Weekdays\":\"24 Hour\",\"Weekends\":\"24 Hour\"}', 1, 'https://drive.google.com/drive/folders/18q1cIGsF8ahtYt3IDuPUWM_jeEBbCjKs', NULL, 'https://maps.app.goo.gl/xjjJdhKcKi2VrR2r7', NULL, '[\"High-Speed WiFi\",\"Power Outlets\",\"Coffee\",\"Prayer Room\",\"Air Conditioning\",\"Meeting Room\"]', '[\"Cozy\",\"24 Hours\",\"Meeting Friendly\",\"WFC\"]', '2025-06-14 22:41:12'),
(27, 'Anak Panah Kopi Plus Gajah Mada', 'Jl. Gajahmada No.91, Miroto, Kec. Semarang Tengah', 'Semarang Tengah', 'A 24-hour cafe with a comfortable ambiance, suitable for working, relaxing, or holding meetings. Equipped with facilities like a meeting room, green ground space, and fast WiFi.', 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749996126/cafe_images/cafe_images/cafe_27_684ed250ef381.png', 2, 'Moderate', '3-4 hours', '{\"Weekdays\":\"24 Hour\",\"Weekends\":\"24 Hour\"}', 1, 'https://drive.google.com/drive/folders/1Cczpf4aXmPcF1Xa8gHh_w3Oyx_r4BXEt', NULL, 'https://maps.app.goo.gl/KkjKNUPRQzvLZuGK8', 'https://www.instagram.com/anakpanahplus/', '[\"High-Speed WiFi\",\"Air Conditioning\",\"Power Outlets\",\"Snacks\",\"Coffee\",\"Meeting Room\",\"Prayer Room\"]', '[\"Meeting Friendly\",\"24 Hours\"]', '2025-06-15 13:49:14'),
(28, 'Kopitagram Dr. Cipto', 'Jl. Dr. Cipto No.111, Sarirejo, Kec. Semarang Timur', 'Semarang Timur', 'Offers a modern minimalist design with a cozy ambiance, suitable for working or relaxing. Features indoor, semi-outdoor, and outdoor areas with greenery.', 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749997799/cafe_images/cafe_images/cafe_28_684ed8de1b7e8.png', 2, 'Moderate', '3-4 hours', '{\"Weekdays\":\"08.00 AM - 12:00 PM\",\"Weekends\":\"08.00 AM - 12:00 PM\"}', 0, NULL, 'https://kopitagram.com/', 'https://maps.app.goo.gl/vbffSq6npXnh154B7', 'https://www.instagram.com/kopitagram/', '[\"High-Speed WiFi\",\"Coffee\",\"Snacks\",\"Outdoor Seating\",\"Air Conditioning\",\"Meeting Room\"]', '[\"Modern\",\"WFC\",\"Cozy\"]', '2025-06-15 14:29:27'),
(29, 'Strada Coffee', 'Jl. Letnan Jenderal S. Parman No.47A, Gajahmungkur, Kec. Gajahmungkur', 'Gajahmungkur', 'Cozy and productive Work From Cafe experience. Enjoy freshly roasted Indonesian coffee beans, unique drinks.', 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999324/cafe_images/cafe_images/cafe_29_684eded47f4d0.png', 2, 'Moderate', '2-3 hours', '{\"Weekdays\":\"7:00 AM - 10:00 PM\",\"Weekends\":\"7:00 AM - 8:00 PM\"}', 0, 'https://online.anyflip.com/pzzln/noam/mobile/index.html', NULL, 'https://maps.app.goo.gl/ECFZfQC2HWpppB46A', 'https://www.instagram.com/stradacoffee.id/', '[\"Meeting Room\",\"High-Speed WiFi\",\"Power Outlets\",\"Coffee\",\"Snacks\",\"Indoor Smoking\",\"Outdoor Seating\"]', '[]', '2025-06-15 14:55:16'),
(30, 'Creative Space', 'Jl. Depok No.38e, Kembangsari, Kec. Semarang Tengah', 'Semarang Tengah', 'A creative workspace and cafe with an open-space concept and art gallery, ideal for work and creative activities.', 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750002084/cafe_images/cafe_images/cafe_30_684ee99b9a49b.png', 1, 'Quiet', '3-4 hours', '{\"Weekdays\":\"9:00 AM - 10:00 PM\",\"Weekends\":\"09:00 AM - 10:00 PM\"}', 0, 'https://drive.google.com/file/d/1YPK_5QsVfIBC8gpIPBaXOaDC9a2vrbBZ/view', '', 'https://maps.app.goo.gl/YJrbu8tfmmnEMGoSA', 'https://www.instagram.com/creativespacesmg.id/', '[\"High-Speed WiFi\",\"Power Outlets\",\"Prayer Room\",\"Meeting Room\",\"Snacks\"]', '[\"Comfortable\",\"WFC\",\"Working Space\"]', '2025-06-15 15:41:15');

-- --------------------------------------------------------

--
-- Table structure for table `cafe_images`
--

CREATE TABLE `cafe_images` (
  `id` int(11) NOT NULL,
  `cafe_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cafe_images`
--

INSERT INTO `cafe_images` (`id`, `cafe_id`, `image_url`, `cloudinary_public_id`, `is_primary`) VALUES
(47, 23, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749940879/cafe_images/cafe_images/cafe_23_684dfa89193fb.png', 'cafe_images/cafe_images/cafe_23_684dfa89193fb', 0),
(48, 23, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749940883/cafe_images/cafe_images/cafe_23_684dfa8d29ba7.png', 'cafe_images/cafe_images/cafe_23_684dfa8d29ba7', 1),
(49, 23, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749940887/cafe_images/cafe_images/cafe_23_684dfa91459fc.png', 'cafe_images/cafe_images/cafe_23_684dfa91459fc', 0),
(57, 27, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749995441/cafe_images/cafe_images/cafe_27_684ecfa9a8366.png', 'cafe_images/cafe_images/cafe_27_684ecfa9a8366', 0),
(58, 27, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749995492/cafe_images/cafe_images/cafe_27_684ecfd66f8b1.png', 'cafe_images/cafe_images/cafe_27_684ecfd66f8b1', 0),
(59, 27, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749995545/cafe_images/cafe_images/cafe_27_684ed00ad747a.png', 'cafe_images/cafe_images/cafe_27_684ed00ad747a', 0),
(60, 27, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749995771/cafe_images/cafe_images/cafe_27_684ed0f4b7f53.png', 'cafe_images/cafe_images/cafe_27_684ed0f4b7f53', 0),
(61, 27, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749996126/cafe_images/cafe_images/cafe_27_684ed250ef381.png', 'cafe_images/cafe_images/cafe_27_684ed250ef381', 1),
(62, 27, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749996160/cafe_images/cafe_images/cafe_27_684ed274146d7.png', 'cafe_images/cafe_images/cafe_27_684ed274146d7', 0),
(64, 28, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749997799/cafe_images/cafe_images/cafe_28_684ed8de1b7e8.png', 'cafe_images/cafe_images/cafe_28_684ed8de1b7e8', 1),
(66, 29, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999324/cafe_images/cafe_images/cafe_29_684eded47f4d0.png', 'cafe_images/cafe_images/cafe_29_684eded47f4d0', 1),
(67, 29, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999330/cafe_images/cafe_images/cafe_29_684eded9eafc5.png', 'cafe_images/cafe_images/cafe_29_684eded9eafc5', 0),
(68, 29, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999345/cafe_images/cafe_images/cafe_29_684ededfdf525.png', 'cafe_images/cafe_images/cafe_29_684ededfdf525', 0),
(69, 28, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999569/cafe_images/cafe_images/cafe_28_684edfc6b1fee.png', 'cafe_images/cafe_images/cafe_28_684edfc6b1fee', 0),
(70, 28, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999589/cafe_images/cafe_images/cafe_28_684edfdbde869.png', 'cafe_images/cafe_images/cafe_28_684edfdbde869', 0),
(71, 28, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999602/cafe_images/cafe_images/cafe_28_684edfec41913.png', 'cafe_images/cafe_images/cafe_28_684edfec41913', 0),
(72, 28, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999615/cafe_images/cafe_images/cafe_28_684edff97f2f6.png', 'cafe_images/cafe_images/cafe_28_684edff97f2f6', 0),
(73, 28, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999630/cafe_images/cafe_images/cafe_28_684ee0067f908.png', 'cafe_images/cafe_images/cafe_28_684ee0067f908', 0),
(74, 28, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749999642/cafe_images/cafe_images/cafe_28_684ee0142b218.png', 'cafe_images/cafe_images/cafe_28_684ee0142b218', 0),
(75, 1, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750000637/cafe_images/cafe_images/cafe_1_684ee3f892b08.webp', 'cafe_images/cafe_images/cafe_1_684ee3f892b08', 1),
(76, 1, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750000697/cafe_images/cafe_images/cafe_1_684ee43035412.png', 'cafe_images/cafe_images/cafe_1_684ee43035412', 0),
(77, 1, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750000879/cafe_images/cafe_images/cafe_1_684ee4e397262.png', 'cafe_images/cafe_images/cafe_1_684ee4e397262', 0),
(78, 1, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750000895/cafe_images/cafe_images/cafe_1_684ee4f928001.png', 'cafe_images/cafe_images/cafe_1_684ee4f928001', 0),
(79, 1, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750000934/cafe_images/cafe_images/cafe_1_684ee51a89948.png', 'cafe_images/cafe_images/cafe_1_684ee51a89948', 0),
(80, 30, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750002084/cafe_images/cafe_images/cafe_30_684ee99b9a49b.png', 'cafe_images/cafe_images/cafe_30_684ee99b9a49b', 1),
(81, 30, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750002088/cafe_images/cafe_images/cafe_30_684ee9a2b1f6a.png', 'cafe_images/cafe_images/cafe_30_684ee9a2b1f6a', 0),
(82, 30, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750002092/cafe_images/cafe_images/cafe_30_684ee9a5e435d.png', 'cafe_images/cafe_images/cafe_30_684ee9a5e435d', 0),
(83, 30, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750002095/cafe_images/cafe_images/cafe_30_684ee9a9de704.png', 'cafe_images/cafe_images/cafe_30_684ee9a9de704', 0),
(84, 30, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750002099/cafe_images/cafe_images/cafe_30_684ee9ad46b47.png', 'cafe_images/cafe_images/cafe_30_684ee9ad46b47', 0),
(85, 30, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750002104/cafe_images/cafe_images/cafe_30_684ee9b0b32b4.png', 'cafe_images/cafe_images/cafe_30_684ee9b0b32b4', 0);

-- --------------------------------------------------------

--
-- Table structure for table `cafe_requests`
--

CREATE TABLE `cafe_requests` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `area` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `submitter_name` varchar(255) NOT NULL,
  `submitter_email` varchar(255) NOT NULL,
  `submitter_phone` varchar(20) DEFAULT NULL,
  `image_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image_urls`)),
  `price_range` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `noise_level` enum('Quiet','Moderate','Loud') NOT NULL DEFAULT 'Moderate',
  `avg_visit_length` varchar(50) NOT NULL DEFAULT '1-2 hours',
  `opening_hours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`opening_hours`)),
  `website` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `additional_notes` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cafe_requests`
--

INSERT INTO `cafe_requests` (`id`, `name`, `address`, `area`, `description`, `submitter_name`, `submitter_email`, `submitter_phone`, `image_urls`, `price_range`, `noise_level`, `avg_visit_length`, `opening_hours`, `website`, `instagram`, `amenities`, `tags`, `additional_notes`, `status`, `admin_notes`, `submitted_at`, `reviewed_at`, `reviewed_by`, `created_at`, `updated_at`) VALUES
(28, 'Klü Cafe', 'Jl. Bukit Putri No.26, Ngesrep, Kec. Banyumanik', 'Banyumanik', 'Cool and natural vibe, perfect for WFC under the trees.', 'Restu', 'restu@gmail.com', '08998032900', '[]', 1, 'Quiet', '3-4 hours', '{\"weekdays\":\"11:00 AM - 10:00 PM\",\"weekends\":\"11:00 AM - 10:00 PM\"}', '', 'https://www.instagram.com/klu.smg/', '[\"Coffee\",\"High-Speed WiFi\",\"Meeting Room\"]', '[\"WFC\"]', '', 'pending', NULL, '2025-06-16 00:35:43', NULL, NULL, '2025-06-16 00:35:43', '2025-06-16 00:35:43');

-- --------------------------------------------------------

--
-- Table structure for table `cafe_request_images`
--

CREATE TABLE `cafe_request_images` (
  `id` int(11) NOT NULL,
  `request_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `cloudinary_public_id` varchar(100) NOT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `format` varchar(50) DEFAULT NULL,
  `bytes` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cafe_request_images`
--

INSERT INTO `cafe_request_images` (`id`, `request_id`, `image_url`, `cloudinary_public_id`, `width`, `height`, `format`, `bytes`, `created_at`, `updated_at`) VALUES
(1, NULL, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749841103/cafe_requests/jgb3tzmqgh1yhmwigpbd.png', 'cafe_requests/jgb3tzmqgh1yhmwigpbd', 1024, 1024, 'png', 1453296, '2025-06-13 18:58:23', '2025-06-13 18:58:27'),
(2, NULL, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749841184/cafe_requests/u9ypixqg9y5ftn7dj6q7.png', 'cafe_requests/u9ypixqg9y5ftn7dj6q7', 1024, 1024, 'png', 1453296, '2025-06-13 18:59:44', '2025-06-13 18:59:46'),
(3, NULL, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1749934275/cafe_requests/d4hba9bw1d8b7dyarkg9.jpg', 'cafe_requests/d4hba9bw1d8b7dyarkg9', 600, 399, 'jpg', 53166, '2025-06-14 20:51:13', '2025-06-14 20:51:16'),
(4, NULL, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750009377/cafe_requests/f1kyltqyisyxvtnrhjnr.png', 'cafe_requests/f1kyltqyisyxvtnrhjnr', 1008, 533, 'png', 632130, '2025-06-15 17:42:54', '2025-06-15 17:43:00'),
(5, NULL, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750032917/cafe_requests/zp1foa8vvg8gbwv1jhrv.png', 'cafe_requests/zp1foa8vvg8gbwv1jhrv', 916, 515, 'png', 858456, '2025-06-16 00:15:18', '2025-06-16 00:15:18'),
(6, NULL, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750033157/cafe_requests/l0l62h7zwhiyenpqfoo3.png', 'cafe_requests/l0l62h7zwhiyenpqfoo3', 923, 535, 'png', 604147, '2025-06-16 00:19:17', '2025-06-16 00:19:36'),
(7, NULL, 'https://res.cloudinary.com/db6aqirrl/image/upload/v1750033712/cafe_requests/bgs4sbxfzuu7scov7yml.png', 'cafe_requests/bgs4sbxfzuu7scov7yml', 1025, 641, 'png', 1131384, '2025-06-16 00:28:32', '2025-06-16 00:28:34');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `cafe_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `priceIDR` int(11) NOT NULL,
  `specialty` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `cafe_id`, `name`, `category`, `priceIDR`, `specialty`) VALUES
(14, 1, 'Butterscotch Sea Salt Coffee', 'Coffee & Beverage', 26000, 0),
(15, 1, 'Cheesy Tiramisu Cofee', 'Coffee & Beverage', 26000, 1),
(16, 1, 'Spaghetti Aglio Olio', 'Brunch & Meal', 24000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `cafe_id` int(11) NOT NULL,
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
(27, 1, 'Promo Up to 20%', 'Upgrade your experience with our membership promo get up to 20% off and enjoy more for less!', '2025-07-07', 'book', '2025-06-14 17:00:00'),
(30, 27, 'Flash Deal!', 'Maling Milk Coffee only 15K per cup with a minimum order of 3 cups and available for a limited time only.', '2025-07-20', 'coffee', '2025-06-15 14:10:04');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `cafe_id` int(11) NOT NULL,
  `wifi_quality` int(11) DEFAULT NULL,
  `power_outlets` int(11) DEFAULT NULL,
  `comfort_level` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `user` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `cafe_id`, `wifi_quality`, `power_outlets`, `comfort_level`, `comment`, `date`, `user`, `phone_number`) VALUES
(1, 1, 4, 3, 5, 'Great place to work, very cozy!', '2025-05-19T02:00:00Z', 'anon123', NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `review_monitoring`
-- (See below for the actual view)
--
CREATE TABLE `review_monitoring` (
);

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
(4, 'Admin User', 'admin@cafeind.com', '$2y$10$6cwIxhw2fTuLCn5PerRDUemj.7Hkj/f93teBfQ2WxkYbnP51/1WPq', 'admin', NULL, '2025-06-02 13:48:05', '2025-06-02 13:48:05');

-- --------------------------------------------------------

--
-- Structure for view `review_monitoring`
--
DROP TABLE IF EXISTS `review_monitoring`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `review_monitoring`  AS SELECT `r`.`id` AS `review_id`, `r`.`cafe_id` AS `cafe_id`, `c`.`name` AS `cafe_name`, `ral`.`original_user_name` AS `original_user_name`, `ral`.`user_identifier` AS `user_identifier`, `ral`.`ip_address` AS `ip_address`, `r`.`date` AS `review_date`, `r`.`wifi_quality` AS `wifi_quality`, `r`.`power_outlets` AS `power_outlets`, `r`.`comfort_level` AS `comfort_level`, substr(`r`.`comment`,1,100) AS `comment_preview`, `ral`.`submitted_at` AS `submitted_at` FROM ((`reviews` `r` join `review_audit_log` `ral` on(`r`.`id` = `ral`.`review_id`)) join `cafes` `c` on(`r`.`cafe_id` = `c`.`id`)) ORDER BY `r`.`date` DESC ;

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
  ADD KEY `cafe_id` (`cafe_id`),
  ADD KEY `idx_cloudinary_public_id` (`cloudinary_public_id`);

--
-- Indexes for table `cafe_requests`
--
ALTER TABLE `cafe_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cafe_requests_status` (`status`),
  ADD KEY `idx_cafe_requests_submitted_at` (`submitted_at`),
  ADD KEY `idx_cafe_requests_area` (`area`);

--
-- Indexes for table `cafe_request_images`
--
ALTER TABLE `cafe_request_images`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cloudinary_public_id` (`cloudinary_public_id`),
  ADD KEY `idx_request_id` (`request_id`);

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
  ADD KEY `cafe_id` (`cafe_id`),
  ADD KEY `idx_reviews_phone_number` (`phone_number`),
  ADD KEY `idx_reviews_phone_cafe_date` (`phone_number`,`cafe_id`,`date`),
  ADD KEY `idx_user_cafe_date` (`user`,`cafe_id`,`date`);

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
-- AUTO_INCREMENT for table `cafes`
--
ALTER TABLE `cafes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `cafe_images`
--
ALTER TABLE `cafe_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `cafe_requests`
--
ALTER TABLE `cafe_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `cafe_request_images`
--
ALTER TABLE `cafe_request_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cafe_images`
--
ALTER TABLE `cafe_images`
  ADD CONSTRAINT `cafe_images_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cafe_request_images`
--
ALTER TABLE `cafe_request_images`
  ADD CONSTRAINT `cafe_request_images_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `cafe_requests` (`id`) ON DELETE SET NULL;

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

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `cleanup_expired_verifications` ON SCHEDULE EVERY 1 HOUR STARTS '2025-06-14 22:52:05' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  DELETE FROM phone_verifications WHERE expires_at < NOW();
  DELETE FROM verified_phone_sessions WHERE expires_at < NOW();
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
