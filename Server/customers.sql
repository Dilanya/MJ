-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2023 at 04:34 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mj_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `hash_id` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `hash_id`, `image_url`, `created_at`) VALUES
(1, NULL, NULL, '2023-08-18 03:16:13'),
(2, NULL, NULL, '2023-08-18 04:06:08'),
(3, NULL, NULL, '2023-08-18 04:06:17'),
(4, 'e61c2cbf-2ca4-4782-9852-ed984c59dcb0', NULL, '2023-08-18 04:12:26'),
(5, 'f9304f29-a15d-42e8-9f21-125ea7cf80cd', 'http://localhost:3000/uploads\\image-1692516351521.png', '2023-08-20 07:25:51'),
(6, '4dc0b4dc-215b-4a4b-8e14-54e0c4f9752f', 'http://localhost:3000/uploads\\image-1692516400381.png', '2023-08-20 07:26:40'),
(7, 'c363e5bf-3000-44c9-aa9d-0ebb164237aa', 'http://localhost:3000/uploads\\image-1692516504335.png', '2023-08-20 07:28:24'),
(8, '31c2ed75-5cac-49f2-878d-862652eaf321', 'http://localhost:3000/uploads\\image-1692516749385.png', '2023-08-20 07:32:29'),
(9, '6f898cfe-5fd3-4dbe-b876-a276101b1433', 'http://localhost:3000/uploads\\image-1692516845569.png', '2023-08-20 07:34:05'),
(10, '875c5d8f-225b-4ef8-b5ab-c0584d41cd65', 'http://localhost:3000/uploads\\image-1692516916148.png', '2023-08-20 07:35:16'),
(11, '0edfe786-ebc0-450b-b3f5-680530b15972', 'http://localhost:3000/uploads\\image-1692517219389.jpg', '2023-08-20 07:40:19'),
(12, '26b6682d-75f4-405e-86c0-589fda2b7a5e', 'http://localhost:3000/uploads\\image-1692518148766.jpg', '2023-08-20 07:55:48'),
(13, '8577b8e4-c858-4502-a08d-82a8ab3a52de', 'http://localhost:3000/uploads\\image-1692518233048.jpg', '2023-08-20 07:57:13'),
(14, 'cec673be-ad3d-4bec-a78b-12e9ec920a64', 'http://localhost:3000/uploads\\image-1692518672151.jpg', '2023-08-20 08:04:32'),
(15, '816adc5d-32c0-4671-a0dd-4b99b6f5a74b', 'http://localhost:3000/uploads\\image-1692523743391.jpg', '2023-08-20 09:29:03'),
(16, '1f9df3cd-2632-4072-8bef-b3e92d317936', 'http://localhost:3000/uploads\\image-1692523859472.jpg', '2023-08-20 09:30:59'),
(17, '0dedf2dd-4cab-422f-a4d3-996f0026ef50', 'http://localhost:3000/uploads\\image-1692524279343.jpg', '2023-08-20 09:37:59'),
(18, '0d51fb81-cb82-4998-aa1d-a5fd3ec71ddb', 'http://localhost:3000/uploads\\image-1692524360082.jpg', '2023-08-20 09:39:20'),
(19, '7168613a-9c6d-4c92-ad41-7ffdc2c54640', 'http://localhost:3000/uploads\\image-1692524978617.jpg', '2023-08-20 09:49:38'),
(20, 'e62d9ab2-8894-4ac7-aa5d-e70d0728d2b6', 'http://localhost:3000/uploads\\image-1692525039583.jpg', '2023-08-20 09:50:39'),
(21, 'e7b93dc3-f1bd-4eeb-bef9-7aa86f9365d8', 'http://localhost:3000/uploads\\image-1692525053935.jpg', '2023-08-20 09:50:53'),
(22, '52e6e4fb-05fb-49df-b668-0445e2de52dd', 'http://localhost:3000/uploads\\image-1692525071421.jpg', '2023-08-20 09:51:11'),
(23, '002bdae3-8979-484c-8494-41d12ecfdc72', 'http://localhost:3000/uploads\\image-1692525095402.jpg', '2023-08-20 09:51:35'),
(24, 'a0f60a51-27d1-446f-b34d-43f6a050d566', 'http://localhost:3000/uploads\\image-1692525566416.jpg', '2023-08-20 09:59:26'),
(25, 'b5ad32c0-c9bb-4640-9ffa-611354b1cfc0', 'http://localhost:3000/uploads\\image-1692525761869.jpg', '2023-08-20 10:02:41'),
(26, '74c68851-4505-4c0e-b927-71c5766d8ede', 'http://localhost:3000/uploads\\image-1692525861147.jpg', '2023-08-20 10:04:21'),
(27, 'bbe56149-8e78-4037-8749-2a0948bb53a2', 'http://localhost:3000/uploads\\image-1692527623587.jpg', '2023-08-20 10:33:43'),
(28, 'b9e38c7d-2d4f-4995-86a1-aedb7342fa51', 'http://localhost:3000/uploads\\image-1692528654179.jpg', '2023-08-20 10:50:54'),
(29, 'cdb9f2f5-aa6c-4715-bfe1-0345e7d167ca', 'http://localhost:3000/uploads\\image-1692529299199.jpg', '2023-08-20 11:01:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
