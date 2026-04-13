-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 11, 2026 at 08:51 AM
-- Server version: 11.4.10-MariaDB-cll-lve-log
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `therfqch_resartz`
--

-- --------------------------------------------------------

--
-- Table structure for table `Courses`
--

CREATE TABLE `Courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` float DEFAULT 0,
  `category` varchar(255) DEFAULT 'General',
  `isPublished` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Courses`
--

INSERT INTO `Courses` (`id`, `title`, `description`, `thumbnail`, `price`, `category`, `isPublished`, `createdAt`, `updatedAt`) VALUES
(1, 'Resin Art for Beginners', 'Learn everything you need to start your resin art journey. From basics to beautiful creations.', 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=600', 1499, 'Resin Art', 1, '2026-03-26 18:18:24', '2026-03-26 18:18:24'),
(2, 'Resin Art Basic Course', 'Perfect for beginners. Learn Theory & Safety, Science of Mixing, Color Chemistry, and Vendors. Hands-on projects include Wall Art, Letter Keychain, and Name Plate.', '/uploads/img-1774634160624-259303.jpg', 4500, 'Basic', 1, '2026-03-26 18:40:13', '2026-03-27 17:56:09'),
(3, 'Resin Art Advance Course', 'Take your skills to the next level. Includes everything from Basic, plus Layering & Depth, Blow torch techniques, Geode Art, Gold leaf, and Beach Art Clock.', '', 7500, 'Advance', 1, '2026-03-26 18:40:14', '2026-03-26 18:40:14'),
(4, 'Resin Business Course', 'Everything from Advance, plus Flower Preservation, Floral Jewellery, Tissue Holder, Finishing School, Pricing for Profit, Catalogue Creation, and Instagram Advertising.', '', 16000, 'Business', 1, '2026-03-26 18:40:14', '2026-03-26 18:40:14'),
(5, 'Flower Preservation Masterclass', 'A specialized course focused entirely on the delicate art of drying, preparing, and casting botanical elements in resin without burning or color loss.', '', 5500, 'Flower Preservation', 1, '2026-03-26 18:40:14', '2026-03-26 18:40:14');

-- --------------------------------------------------------

--
-- Table structure for table `Lessons`
--

CREATE TABLE `Lessons` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `videoUrl` varchar(255) NOT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `order` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `courseId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Lessons`
--

INSERT INTO `Lessons` (`id`, `title`, `description`, `videoUrl`, `duration`, `order`, `createdAt`, `updatedAt`, `courseId`) VALUES
(1, 'Introduction to Resin', 'What is resin? Types, safety, and tools.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '10:30', 0, '2026-03-26 18:18:24', '2026-03-26 18:18:24', 1),
(2, 'Your First Pour', 'Step-by-step guide to your first resin pour.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18:45', 1, '2026-03-26 18:18:24', '2026-03-26 18:18:24', 1),
(3, 'Theory & Safety', 'Introduction to resin safety and handling.', 'pending', '15:00', 0, '2026-03-26 18:40:13', '2026-03-26 18:40:13', 2),
(4, 'The Science of Mixing', 'Proper ratios and mixing techniques.', 'pending', '20:00', 1, '2026-03-26 18:40:13', '2026-03-26 18:40:13', 2),
(5, 'Color Chemistry', 'Working with pigments and dyes.', 'pending', '18:00', 2, '2026-03-26 18:40:13', '2026-03-26 18:40:13', 2),
(6, 'Hands-on: Wall Art', 'Create your first piece of wall art.', 'pending', '45:00', 3, '2026-03-26 18:40:13', '2026-03-26 18:40:13', 2),
(7, 'Hands-on: Letter Keychain', 'Making functional keychains.', 'pending', '30:00', 4, '2026-03-26 18:40:13', '2026-03-26 18:40:13', 2),
(8, 'Hands-on: Name Plate', 'Designing a custom name plate.', 'pending', '40:00', 5, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 2),
(9, 'Product Purchase Vendors', 'Where to buy your supplies.', 'pending', '10:00', 6, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 2),
(10, 'Theory & Safety', 'Safety review.', 'pending', '10:00', 0, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(11, 'The Science of Mixing & Color Chemistry', 'Advanced mixing techniques.', 'pending', '25:00', 1, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(12, 'Layering & Depth', 'Creating 3D effects.', 'pending', '35:00', 2, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(13, 'Blow Torch Techniques', 'Removing bubbles and creating cells.', 'pending', '15:00', 3, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(14, 'Geode Art', 'Simulating natural stone.', 'pending', '50:00', 4, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(15, 'Gold Leaf Technique', 'Adding metallic accents.', 'pending', '20:00', 5, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(16, 'Hands-on: Beach Art Clock', 'Creating realistic waves.', 'pending', '60:00', 6, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(17, 'Hands-on: Jewellery Making using Bezel', 'Fine resin jewelry.', 'pending', '45:00', 7, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(18, 'Tips & Tricks', 'Professional finishing.', 'pending', '15:00', 8, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 3),
(19, 'Theory & Safety', 'Review of safety basics.', 'pending', '10:00', 0, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(20, 'Hands-on: Flower Preservation', 'Drying and casting flowers.', 'pending', '60:00', 1, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(21, 'Hands-on: Floral Jewellery Making', 'Small-scale botanical casting.', 'pending', '45:00', 2, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(22, 'Hands-on: Tissue Holder', 'Casting functional home decor.', 'pending', '55:00', 3, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(23, 'Shaping Technique & Finishing School', 'Sanding, polishing, and perfect edges.', 'pending', '40:00', 4, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(24, 'Pricing for Profit', 'Calculating costs and retail value.', 'pending', '30:00', 5, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(25, 'Catalogue Creation', 'Photographing and presenting your work.', 'pending', '35:00', 6, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(26, 'Instagram Advertising', 'Marketing your resin business online.', 'pending', '45:00', 7, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(27, 'Product Purchase Vendors', 'Comprehensive vendor list.', 'pending', '15:00', 8, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 4),
(28, 'Flower Drying Techniques', 'Silica gel vs pressing.', 'pending', '30:00', 0, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 5),
(29, 'Preparation & Layout', 'Designing the floral arrangement.', 'pending', '40:00', 1, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 5),
(30, 'Deep Pouring Resin', 'Understanding deep pour vs coating resin.', 'pending', '45:00', 2, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 5),
(31, 'Layering & Bubble Control', 'Keeping flowers pristine.', 'pending', '35:00', 3, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 5),
(32, 'Finishing & Polishing', 'Achieving a glass-like finish.', 'pending', '50:00', 4, '2026-03-26 18:40:14', '2026-03-26 18:40:14', 5);

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `price` float DEFAULT 0,
  `category` varchar(255) DEFAULT 'General',
  `inStock` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `title`, `description`, `images`, `price`, `category`, `inStock`, `createdAt`, `updatedAt`) VALUES
(1, 'Resin Art Starter Kit', 'Everything you need to start your resin art journey. Includes molds, pigments, and resin.', '[\"https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=600\"]', 2499, 'Kits', 1, '2026-03-26 18:18:24', '2026-03-26 18:18:24'),
(2, 'Wedding flowers preservation', '12x12 inch | Teak wood frame', '[\"/uploads/img-1774722353484-303399.jpg\"]', 4700, 'Varmala Preservation', 1, '2026-03-27 08:18:18', '2026-03-28 18:26:22');

-- --------------------------------------------------------

--
-- Table structure for table `UserCourses`
--

CREATE TABLE `UserCourses` (
  `UserId` int(11) NOT NULL,
  `CourseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `UserProducts`
--

CREATE TABLE `UserProducts` (
  `UserId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `inviteToken` varchar(255) DEFAULT NULL,
  `isRegistered` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `role`, `inviteToken`, `isRegistered`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'admin@resartz.com', '$2b$10$p4CIB2JuvuUAigLlob1KheOEG9.7bAMRFwC4wnDYBk60k9rJ8aPJq', 'admin', NULL, 1, '2026-03-26 18:18:24', '2026-03-26 18:18:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Courses`
--
ALTER TABLE `Courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Lessons`
--
ALTER TABLE `Lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `UserCourses`
--
ALTER TABLE `UserCourses`
  ADD PRIMARY KEY (`UserId`,`CourseId`),
  ADD KEY `CourseId` (`CourseId`);

--
-- Indexes for table `UserProducts`
--
ALTER TABLE `UserProducts`
  ADD PRIMARY KEY (`UserId`,`ProductId`),
  ADD KEY `ProductId` (`ProductId`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`),
  ADD UNIQUE KEY `email_61` (`email`),
  ADD UNIQUE KEY `email_62` (`email`),
  ADD UNIQUE KEY `email_63` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Courses`
--
ALTER TABLE `Courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Lessons`
--
ALTER TABLE `Lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Lessons`
--
ALTER TABLE `Lessons`
  ADD CONSTRAINT `Lessons_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `Courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `UserCourses`
--
ALTER TABLE `UserCourses`
  ADD CONSTRAINT `UserCourses_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserCourses_ibfk_2` FOREIGN KEY (`CourseId`) REFERENCES `Courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `UserProducts`
--
ALTER TABLE `UserProducts`
  ADD CONSTRAINT `UserProducts_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserProducts_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
