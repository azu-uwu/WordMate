-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 31, 2026 at 09:40 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wordmate`
--

-- --------------------------------------------------------

--
-- Table structure for table `roadmaps`
--

CREATE TABLE `roadmaps` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roadmaps`
--

INSERT INTO `roadmaps` (`id`, `name`, `description`, `image`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Tiếng Anh giao tiếp', 'Lộ trình học tiếng Anh giao tiếp', NULL, 1, 1, '2026-07-30 18:07:23', '2026-07-31 06:43:29'),
(2, 'TOEIC cơ bản', 'Lộ trình học từ vựng TOEIC cơ bản', NULL, 1, 2, '2026-07-30 18:07:23', '2026-07-30 18:07:23'),
(3, 'IELTS', 'Lộ trình học từ vựng IELTS cơ bản', NULL, 1, 3, '2026-07-30 18:07:23', '2026-07-30 18:07:23');

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `id` bigint UNSIGNED NOT NULL,
  `roadmap_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `roadmap_id`, `name`, `description`, `image`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Greetings', 'Các từ vựng và mẫu câu chào hỏi, giới thiệu bản thân.', NULL, 1, 1, '2026-07-31 08:56:05', '2026-07-31 08:56:05'),
(2, 1, 'Family', 'Các từ vựng về gia đình và các mối quan hệ.', NULL, 2, 1, '2026-07-31 08:56:05', '2026-07-31 08:56:05'),
(3, 1, 'Numbers', 'Các từ vựng về số đếm, số thứ tự và cách sử dụng.', NULL, 3, 1, '2026-07-31 08:56:05', '2026-07-31 08:56:05');

-- --------------------------------------------------------

--
-- Table structure for table `vocabularies`
--

CREATE TABLE `vocabularies` (
  `id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL,
  `word` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pronunciation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `part_of_speech` enum('noun','verb','adjective','adverb','preposition','phrasal_verb','idiom','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `meaning` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `example` text COLLATE utf8mb4_unicode_ci,
  `example_meaning` text COLLATE utf8mb4_unicode_ci,
  `audio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vocabularies`
--

INSERT INTO `vocabularies` (`id`, `topic_id`, `word`, `pronunciation`, `part_of_speech`, `meaning`, `example`, `example_meaning`, `audio`, `image`, `created_at`, `updated_at`) VALUES
(1, 1, 'hello', '/həˈləʊ/', 'other', 'xin chào', 'Hello! Nice to meet you.', 'Xin chào! Rất vui được gặp bạn.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(2, 1, 'goodbye', '/ˌɡʊdˈbaɪ/', 'other', 'tạm biệt', 'Goodbye! See you tomorrow.', 'Tạm biệt! Hẹn gặp bạn vào ngày mai.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(3, 1, 'thanks', '/θæŋks/', 'other', 'cảm ơn', 'Thanks for your help.', 'Cảm ơn vì sự giúp đỡ của bạn.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(4, 2, 'father', '/ˈfɑːðər/', 'noun', 'bố', 'My father is a teacher.', 'Bố tôi là một giáo viên.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(5, 2, 'mother', '/ˈmʌðər/', 'noun', 'mẹ', 'My mother cooks very well.', 'Mẹ tôi nấu ăn rất ngon.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(6, 2, 'brother', '/ˈbrʌðər/', 'noun', 'anh trai hoặc em trai', 'My brother is playing football.', 'Anh trai tôi đang chơi bóng đá.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(7, 3, 'one', '/wʌn/', 'other', 'một', 'I have one book.', 'Tôi có một quyển sách.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(8, 3, 'two', '/tuː/', 'other', 'hai', 'She has two cats.', 'Cô ấy có hai con mèo.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46'),
(9, 3, 'three', '/θriː/', 'other', 'ba', 'There are three students.', 'Có ba học sinh.', NULL, NULL, '2026-07-31 08:56:46', '2026-07-31 08:56:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `roadmaps`
--
ALTER TABLE `roadmaps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_roadmaps_is_active` (`is_active`),
  ADD KEY `idx_roadmaps_sort_order` (`sort_order`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_topics_roadmap_id` (`roadmap_id`),
  ADD KEY `idx_topics_sort_order` (`sort_order`),
  ADD KEY `idx_topics_is_active` (`is_active`);

--
-- Indexes for table `vocabularies`
--
ALTER TABLE `vocabularies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_vocabularies_topic_word` (`topic_id`,`word`),
  ADD KEY `idx_vocabularies_word` (`word`),
  ADD KEY `idx_vocabularies_topic_id` (`topic_id`),
  ADD KEY `idx_vocabularies_part_of_speech` (`part_of_speech`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roadmaps`
--
ALTER TABLE `roadmaps`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vocabularies`
--
ALTER TABLE `vocabularies`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `fk_topics_roadmap` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vocabularies`
--
ALTER TABLE `vocabularies`
  ADD CONSTRAINT `fk_vocabularies_topic` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
