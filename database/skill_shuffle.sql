-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2024 at 12:33 PM
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
-- Database: `skill_shuffle`
--
CREATE DATABASE IF NOT EXISTS `skill_shuffle` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `skill_shuffle`;

-- --------------------------------------------------------

--
-- Table structure for table `blocked_users`
--

CREATE TABLE IF NOT EXISTS `blocked_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `blocked_user` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `blocked_user` (`blocked_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE IF NOT EXISTS `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) DEFAULT NULL,
  `type` enum('PRIVATE','COMMUNITY','GROUP') NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `community_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `community_id` (`community_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `name`, `type`, `avatar_url`, `community_id`) VALUES
(1, 'Lebron Fans', 'GROUP', 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/chats/1/avatar/1713779149315-da78f776-e46f-4894-b317-022e000c5c51-2544.webp', NULL),
(3, 'Test test, Test test3, Test test1', 'GROUP', NULL, NULL),
(4, 'Quantum Hub', 'COMMUNITY', 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/communities/1/avatar/diguyewhuyt39jkdnifnoisdjgfosdjoi.jpg', 1),
(5, '', 'PRIVATE', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_history`
--

CREATE TABLE IF NOT EXISTS `chat_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hidden_before` datetime(6) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnxfafnpp3l5irkjd4706v8ik3` (`chat_id`),
  KEY `FKqw6yblcx0hqkn34q6jg03bj8` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `chat_members`
--

CREATE TABLE IF NOT EXISTS `chat_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `role` enum('CREATOR','ADMIN','MEMBER') NOT NULL,
  `notifications` bit(1) NOT NULL DEFAULT b'1',
  `joined_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
  `left_at` timestamp(3) NULL DEFAULT NULL,
  `is_kicked` bit(1) NOT NULL DEFAULT b'0',
  `cleared_at` timestamp(3) NULL DEFAULT NULL,
  `closed_at` timestamp(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `chat_members`
--

INSERT INTO `chat_members` (`id`, `chat_id`, `member_id`, `role`, `notifications`, `joined_at`, `left_at`, `is_kicked`, `cleared_at`, `closed_at`) VALUES
(1, 1, 1, 'MEMBER', b'1', '2024-04-22 09:45:49.000', NULL, b'0', '2024-05-01 18:52:38.818', '2024-05-18 20:43:31.219'),
(2, 1, 4, 'CREATOR', b'1', '2024-04-22 09:45:49.000', NULL, b'0', NULL, '2024-05-20 10:30:16.270'),
(3, 1, 2, 'MEMBER', b'1', '2024-04-22 09:45:49.000', NULL, b'0', NULL, NULL),
(6, 3, 1, 'CREATOR', b'1', '2024-04-22 09:57:26.000', NULL, b'0', '2024-05-01 17:55:41.050', '2024-05-17 21:10:43.676'),
(7, 3, 4, 'MEMBER', b'0', '2024-04-22 09:57:26.000', NULL, b'0', NULL, '2024-05-16 15:26:22.535'),
(8, 3, 2, 'MEMBER', b'1', '2024-04-22 09:57:26.000', NULL, b'0', NULL, '2024-05-18 20:44:49.808'),
(9, 5, 1, 'MEMBER', b'1', '2024-04-22 10:20:04.000', NULL, b'0', NULL, '2024-05-20 10:33:01.399'),
(10, 5, 4, 'MEMBER', b'1', '2024-04-22 10:20:04.000', NULL, b'0', NULL, '2024-05-02 21:51:29.386'),
(11, 4, 1, 'MEMBER', b'1', '2024-05-02 16:35:30.901', NULL, b'0', NULL, '2024-05-20 10:32:59.759');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `content` varchar(1024) NOT NULL,
  `timestamp` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `type` enum('MESSAGE','ANNOUNCEMENT','ENTRY') NOT NULL,
  `status` enum('SENT','SEEN') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`sender_id`),
  KEY `chat_id` (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=612 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `sender_id`, `chat_id`, `content`, `timestamp`, `type`, `status`) VALUES
(1, 1, 1, '<a href=\'/users?nn=testuser\'>Test test The testuser</a> created <i>\'Lebron Fans\'</i>', '2024-04-16 10:14:57.985', 'ANNOUNCEMENT', 'SENT'),
(3, 1, 3, '<a href=\'/users?nn=testuser\'>Test test The testuser</a> created <i>\'Test test, Test test3, Test test1\'</i>', '2024-04-17 10:21:47.411', 'ANNOUNCEMENT', 'SENT'),
(4, 1, 4, 'Alo', '2024-04-22 10:17:53.000', 'MESSAGE', 'SENT'),
(5, 1, 5, 'Test test The testuser has entered the chat', '2024-04-22 10:20:04.900', 'ENTRY', 'SENT'),
(6, 1, 5, 'https://media.tenor.com/SBxgk-Kf42IAAAAC/crip.gif', '2024-04-22 10:20:21.540', 'MESSAGE', 'SENT'),
(7, 1, 1, 'Lebron scored 23 in the last match😬', '2024-04-17 10:21:42.411', 'MESSAGE', 'SENT'),
(8, 1, 1, '💀💀💀💀💀💀💀💀💀💀💀💀💀💀', '2024-04-17 10:21:53.691', 'MESSAGE', 'SENT'),
(9, 1, 1, 'LAKERS WON THE NBA FINALS!!!!😎😎🤓🤓🤓', '2024-04-22 10:23:50.524', 'MESSAGE', 'SENT'),
(10, 1, 1, 'heyyyy', '2024-05-01 18:52:32.725', 'MESSAGE', 'SENT'),
(11, 4, 1, 'test r u here?', '2024-05-01 20:26:26.119', 'MESSAGE', 'SENT'),
(12, 4, 1, '??', '2024-05-01 20:27:37.360', 'MESSAGE', 'SENT'),
(13, 1, 1, 'what do you want nigga', '2024-05-01 20:27:45.252', 'MESSAGE', 'SENT'),
(14, 4, 1, 'https://media.tenor.com/BG-84cOdq20AAAAC/fr-fr-fr.gif', '2024-05-01 20:27:53.794', 'MESSAGE', 'SENT'),
(15, 1, 1, 'no shit', '2024-05-02 06:35:13.998', 'MESSAGE', 'SENT'),
(16, 4, 1, 'hey', '2024-05-02 21:07:04.449', 'MESSAGE', 'SENT'),
(17, 4, 1, 'huh??', '2024-05-02 21:07:15.662', 'MESSAGE', 'SENT'),
(610, 2, 3, 'What\'s up men', '2024-05-18 20:44:45.243', 'MESSAGE', 'SENT'),
(611, 4, 1, 'gsdfgdsfg', '2024-05-20 10:30:05.329', 'MESSAGE', 'SENT');

-- --------------------------------------------------------

--
-- Table structure for table `chat_message_attachments`
--

CREATE TABLE IF NOT EXISTS `chat_message_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `message_id` (`message_id`),
  KEY `video_id` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `likes` int(11) NOT NULL,
  `content` varchar(512) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `comments_ibfk_2` (`post_id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `comment_attachments`
--

CREATE TABLE IF NOT EXISTS `comment_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_attachments_ibfk_2` (`comment_id`),
  KEY `comment_attachments_ibfk_1` (`file_id`),
  KEY `video_id` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `communities`
--

CREATE TABLE IF NOT EXISTS `communities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `description` varchar(275) DEFAULT NULL,
  `subject_id` int(11) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `banner_color` varchar(7) NOT NULL DEFAULT '#bdbdbd',
  `creator_id` int(11) NOT NULL,
  `privacy` enum('OPEN','CLOSED','PRIVATE') NOT NULL DEFAULT 'OPEN',
  `allow_comments` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname` (`nickname`),
  KEY `subject_id` (`subject_id`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `communities`
--

INSERT INTO `communities` (`id`, `name`, `nickname`, `description`, `subject_id`, `avatar_url`, `banner_url`, `banner_color`, `creator_id`, `privacy`, `allow_comments`, `created_at`) VALUES
(1, 'Quantum Hub', 'quantumhub', 'Explore the mysteries of quantum cognition and neural mechanics in the Quantum Minds Hub. Connect with fellow enthusiasts.', 1, 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/communities/1/avatar/diguyewhuyt39jkdnifnoisdjgfosdjoi.jpg', NULL, '#bdbdbd', 3, 'OPEN', b'1', '2024-04-22 10:09:04');

-- --------------------------------------------------------

--
-- Table structure for table `community_banned_users`
--

CREATE TABLE IF NOT EXISTS `community_banned_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `community_id` (`community_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `community_chats`
--

CREATE TABLE IF NOT EXISTS `community_chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfom2li8u9kyvwud4gp2m4uu5a` (`chat_id`),
  KEY `FKo0hc1ffyqymov0dphmk484x7y` (`community_id`),
  KEY `FK2r94rp7q2pxr3gl34sxwpj869` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `community_followers`
--

CREATE TABLE IF NOT EXISTS `community_followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `community_members`
--

CREATE TABLE IF NOT EXISTS `community_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('admin','moderator','member','creator') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `community_posts`
--

CREATE TABLE IF NOT EXISTS `community_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `community_subjects`
--

CREATE TABLE IF NOT EXISTS `community_subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `community_subjects`
--

INSERT INTO `community_subjects` (`id`, `name`) VALUES
(1, 'Astronomy');

-- --------------------------------------------------------

--
-- Table structure for table `confirmation_code`
--

CREATE TABLE IF NOT EXISTS `confirmation_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `reset_code` varchar(5) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('WEBINAR','COMPETITION') NOT NULL,
  `title` varchar(75) NOT NULL,
  `description` varchar(1024) NOT NULL,
  `banner_url` varchar(255) NOT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `community_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `event_participants`
--

CREATE TABLE IF NOT EXISTS `event_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `event_topics`
--

CREATE TABLE IF NOT EXISTS `event_topics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` mediumblob NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `file_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `friendships`
--

CREATE TABLE IF NOT EXISTS `friendships` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `friend_id` (`friend_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `friendships`
--

INSERT INTO `friendships` (`id`, `user_id`, `friend_id`) VALUES
(1, 1, 2),
(2, 1, 4),
(3, 4, 2),
(5, 1, 3),
(8, 15, 4),
(10, 1, 15),
(11, 16, 1),
(12, 16, 4);

-- --------------------------------------------------------

--
-- Table structure for table `friend_requests`
--

CREATE TABLE IF NOT EXISTS `friend_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` enum('PENDING','IGNORED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `receiver_id` (`receiver_id`),
  KEY `sender_id` (`sender_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receiver_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` varchar(155) NOT NULL,
  `type` enum('like','comment','friend-request') NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `privacy` enum('PUBLIC','FRIENDS') NOT NULL,
  `likes_count` int(7) NOT NULL DEFAULT 0,
  `shares_count` int(7) NOT NULL DEFAULT 0,
  `comments_count` int(7) NOT NULL DEFAULT 0,
  `allow_comments` bit(1) NOT NULL DEFAULT b'1',
  `allow_notifications` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK6xvn0811tkyo3nfjk2xvqx6ns` (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `author_id`, `text`, `privacy`, `likes_count`, `shares_count`, `comments_count`, `allow_comments`, `allow_notifications`, `created_at`, `updated_at`) VALUES
(2, 1, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.😄😄🙏🏿', 'PUBLIC', 1, 0, 0, b'1', b'0', '2024-05-18 16:34:31', '2024-05-19 13:08:40'),
(3, 1, 'Тестовый пост, всем привет!🙏🏿', 'FRIENDS', 0, 0, 0, b'0', b'0', '2024-05-18 19:56:13', '2024-05-19 13:16:39'),
(5, 1, 'ahhaahahahha😂😂😂😂😭😭😭', 'PUBLIC', 0, 0, 0, b'1', b'1', '2021-05-14 20:03:51', '2024-05-18 22:32:09'),
(6, 1, 'ahhaahahahha😂😂😂😂😭😭😭', 'PUBLIC', 0, 0, 0, b'1', b'1', '2024-05-18 20:04:55', '2024-05-18 20:04:55'),
(7, 1, 'ahhaahahahha😂😂😂😂😭😭😭', 'PUBLIC', 0, 0, 0, b'1', b'1', '2024-05-17 20:05:29', '2024-05-18 22:25:27'),
(9, 1, 'Wait what💀💀', 'PUBLIC', 1, 0, 0, b'1', b'1', '2024-05-18 22:38:10', '2024-05-20 09:48:47'),
(10, 1, 'xxDDDDDDDD', 'PUBLIC', 1, 1, 0, b'1', b'1', '2024-05-18 22:39:18', '2024-05-20 09:49:17'),
(11, 4, 'She\'s a ten\n\n\n\n\n\n\n\nten tonne', 'PUBLIC', 1, 14, 0, b'1', b'1', '2024-05-19 13:11:02', '2024-05-20 09:49:13'),
(12, 4, 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', 'PUBLIC', 3, 1, 0, b'1', b'1', '2024-05-19 13:12:34', '2024-05-20 10:28:18'),
(13, 3, 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', 'PUBLIC', 0, 0, 0, b'1', b'1', '2024-05-20 09:50:22', '2024-05-20 09:50:22'),
(14, 3, 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', 'PUBLIC', 0, 0, 0, b'1', b'1', '2024-05-20 09:50:36', '2024-05-20 09:50:36');

-- --------------------------------------------------------

--
-- Table structure for table `post_attachments`
--

CREATE TABLE IF NOT EXISTS `post_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `post_id` (`post_id`),
  KEY `video_id` (`video_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `post_attachments`
--

INSERT INTO `post_attachments` (`id`, `post_id`, `file_id`, `photo_url`, `video_id`) VALUES
(4, 2, NULL, 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/users/1/posts/2/1716050071815-b42d02cd-6139-4e16-a9f5-aa0e52e0a840', NULL),
(5, 2, NULL, 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/users/1/posts/2/1716050072252-19499882-57ce-4e5f-a1f3-cf492c94f338', NULL),
(10, 14, NULL, 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/users/3/posts/14/1716198636289-424dafe2-9caf-451a-ab07-f897eef71f7b', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `refresh_token`
--

CREATE TABLE IF NOT EXISTS `refresh_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `refresh_token`
--

INSERT INTO `refresh_token` (`id`, `token`, `expires_at`, `user_id`) VALUES
(2, '79bf984e-5987-4cc1-8a98-68532e443e2b', '2024-04-29 09:42:16.575', 1),
(7, '0c4ac0ac-5401-481c-ade0-3cfbd936cc0d', '2024-05-09 05:22:22.220', 1),
(8, '20fe582f-e36d-4e31-bd28-130ca47aaeb9', '2024-05-09 05:39:06.886', 4),
(13, '76310d17-c18e-4b7d-a3a6-bd791b59ef95', '2024-05-25 17:44:20.935', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `username` varchar(75) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(40) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `bio` varchar(275) DEFAULT NULL,
  `points` int(7) NOT NULL DEFAULT 0,
  `avatar_url` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `banner_color` varchar(7) NOT NULL DEFAULT '#00b3db',
  `is_public` bit(1) NOT NULL DEFAULT b'1',
  `auto_follow` bit(1) NOT NULL DEFAULT b'0',
  `last_seen` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `nickname`, `email`, `gender`, `birth_date`, `bio`, `points`, `avatar_url`, `banner_url`, `banner_color`, `is_public`, `auto_follow`, `last_seen`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Test test', 'The testuser', 'test', '$2a$10$JEg8WMqgkd4mbM20o7vOSu9mlCogeiqA6ECGLza4KBg1gzUV/6iru', 'testuser', 'test@gmail.com', 'OTHER', '2004-12-22', 'Test test', 0, 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/users/1/avatar/2023-10-27_183115.png', 'https://skill-shuffle.s3.eu-north-1.amazonaws.com/users/1/banner/mak7ilenin-banner.png', '#00b3db', b'1', b'0', '2024-05-20 10:33:02', '2024-04-22 09:35:00', '2024-05-20 10:33:02', NULL),
(2, 'Test test1', 'The test1', 'test1', '$2a$10$sRN8k2KLY8xHO7sec08zOe2/MLjlQgDtkX/jdyadSqfIce1aJEJVq', 'test1', 'test1@gmail.com', 'OTHER', '2004-12-22', 'Test test1', 0, NULL, NULL, '#00b3db', b'1', b'0', '2024-05-18 20:44:24', '2024-04-22 09:40:59', '2024-05-18 20:44:24', NULL),
(3, 'Test test2', 'The test2', 'test2', '$2a$10$QycMomHz4iW9PrWfHtucX.antDp4iLeHtAS1FVZbO0EBmV1fEok56', 'test2', 'test2@gmail.com', 'OTHER', '2004-12-22', 'Test test2', 0, NULL, NULL, '#00b3db', b'1', b'0', '2024-05-20 10:02:07', '2024-04-22 09:41:14', '2024-05-20 10:02:07', NULL),
(4, 'Test test3', 'The test3', 'test3', '$2a$10$Yn99CbLOCqoMG5HPXRNkYOm8AImK3.UPS9tUcAyNOlff0MvgaJv1W', 'test3', 'test3@gmail.com', 'OTHER', '2004-12-22', 'Test test3', 0, NULL, NULL, '#00b3db', b'1', b'0', '2024-05-20 10:29:59', '2024-04-22 09:42:13', '2024-05-20 10:29:59', NULL),
(15, 'Test4', 'Testovich', 'test4', '$2a$10$2hxjn9WN.zpbnGb5FNwMOu4AZi3IEanhHrru.B3c4i6LyUIQ79whC', 'test4', NULL, 'MALE', '1993-01-16', NULL, 0, NULL, NULL, '#00b3db', b'1', b'0', '2024-05-17 20:56:06', '2024-05-16 18:50:57', '2024-05-17 20:56:06', NULL),
(16, 'Test5', 'Testina', 'test5', '$2a$10$xrqUZCY2JG20oY7EI4LOguqEQ4GJUWoCjlUQnQ54gOMJ1hM3viLki', 'test5', NULL, 'FEMALE', '1992-02-16', NULL, 0, NULL, NULL, '#00b3db', b'1', b'0', '2024-05-16 21:39:03', '2024-05-16 19:10:33', '2024-05-16 21:39:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_communities`
--

CREATE TABLE IF NOT EXISTS `user_communities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `community_id` (`community_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `user_followers`
--

CREATE TABLE IF NOT EXISTS `user_followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `follower_id` (`follower_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `user_followers`
--

INSERT INTO `user_followers` (`id`, `user_id`, `follower_id`) VALUES
(1, 15, 16),
(3, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_notifications`
--

CREATE TABLE IF NOT EXISTS `user_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `likes_notification` bit(1) NOT NULL DEFAULT b'1',
  `comments_notification` bit(1) NOT NULL DEFAULT b'1',
  `reposted_notification` bit(1) NOT NULL DEFAULT b'1',
  `private_messages_notification` bit(1) NOT NULL DEFAULT b'1',
  `friend_requests_notification` bit(1) NOT NULL DEFAULT b'1',
  `mentions_notification` bit(1) NOT NULL DEFAULT b'1',
  `followers_notification` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `user_photos`
--

CREATE TABLE IF NOT EXISTS `user_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_photos_ibfk_1` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `user_post_interactions`
--

CREATE TABLE IF NOT EXISTS `user_post_interactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `interaction_type` enum('BOOKMARKED','LIKED','REPOSTED') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `user_post_interactions`
--

INSERT INTO `user_post_interactions` (`id`, `user_id`, `post_id`, `interaction_type`, `created_at`) VALUES
(42, 1, 12, 'LIKED', '2024-05-20 10:28:18'),
(43, 1, 12, 'BOOKMARKED', '2024-05-20 10:28:25');

-- --------------------------------------------------------

--
-- Table structure for table `user_privacy`
--

CREATE TABLE IF NOT EXISTS `user_privacy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `privacy_options_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `privacy_options_id` (`privacy_options_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `user_privacy_options`
--

CREATE TABLE IF NOT EXISTS `user_privacy_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `view_main_information` enum('all users','friends only','only me') NOT NULL DEFAULT 'all users',
  `view_followings` enum('all users','friends only','only me') NOT NULL DEFAULT 'all users',
  `view_photos_videos` enum('all users','friends only','only me') NOT NULL DEFAULT 'all users',
  `view_friends` enum('all users','friends only','only me') NOT NULL DEFAULT 'all users',
  `birthday_settings` enum('do not show','month and day','full birthday') NOT NULL DEFAULT 'full birthday',
  `view_post_comments` enum('all users','friends only','only me') NOT NULL DEFAULT 'all users',
  `comment_on_posts` enum('all users','friends only','only me') NOT NULL DEFAULT 'all users',
  `send_private_messages` enum('all users','friends only','no one') NOT NULL DEFAULT 'all users',
  `add_to_chats` enum('all users','friends only','no one') NOT NULL DEFAULT 'all users',
  `invite_to_communities` enum('all users','friends only','no one') NOT NULL DEFAULT 'all users',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `user_videos`
--

CREATE TABLE IF NOT EXISTS `user_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `video_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `video_id` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `duration` time NOT NULL,
  `resolution` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` mediumtext DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocked_users`
--
ALTER TABLE `blocked_users`
  ADD CONSTRAINT `blocked_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blocked_users_ibfk_2` FOREIGN KEY (`blocked_user`) REFERENCES `users` (`id`);

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`);

--
-- Constraints for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD CONSTRAINT `FKnxfafnpp3l5irkjd4706v8ik3` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`),
  ADD CONSTRAINT `FKqw6yblcx0hqkn34q6jg03bj8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_members`
--
ALTER TABLE `chat_members`
  ADD CONSTRAINT `chat_members_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_members_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chat_messages_ibfk_3` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`);

--
-- Constraints for table `chat_message_attachments`
--
ALTER TABLE `chat_message_attachments`
  ADD CONSTRAINT `chat_message_attachments_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `chat_message_attachments_ibfk_2` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_message_attachments_ibfk_4` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comment_attachments`
--
ALTER TABLE `comment_attachments`
  ADD CONSTRAINT `comment_attachments_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `comment_attachments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_attachments_ibfk_3` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`);

--
-- Constraints for table `communities`
--
ALTER TABLE `communities`
  ADD CONSTRAINT `communities_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `community_subjects` (`id`),
  ADD CONSTRAINT `communities_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `community_banned_users`
--
ALTER TABLE `community_banned_users`
  ADD CONSTRAINT `community_banned_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_banned_users_ibfk_2` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `community_chats`
--
ALTER TABLE `community_chats`
  ADD CONSTRAINT `FK2r94rp7q2pxr3gl34sxwpj869` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKfom2li8u9kyvwud4gp2m4uu5a` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FKo0hc1ffyqymov0dphmk484x7y` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`);

--
-- Constraints for table `community_followers`
--
ALTER TABLE `community_followers`
  ADD CONSTRAINT `community_followers_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_followers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `community_members`
--
ALTER TABLE `community_members`
  ADD CONSTRAINT `community_members_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `community_posts`
--
ALTER TABLE `community_posts`
  ADD CONSTRAINT `community_posts_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `confirmation_code`
--
ALTER TABLE `confirmation_code`
  ADD CONSTRAINT `confirmation_code_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_participants`
--
ALTER TABLE `event_participants`
  ADD CONSTRAINT `event_participants_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_topics`
--
ALTER TABLE `event_topics`
  ADD CONSTRAINT `event_topics_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `friend_requests_ibfk_1` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friend_requests_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `FK6xvn0811tkyo3nfjk2xvqx6ns` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_attachments`
--
ALTER TABLE `post_attachments`
  ADD CONSTRAINT `post_attachments_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `post_attachments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_attachments_ibfk_4` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`);

--
-- Constraints for table `refresh_token`
--
ALTER TABLE `refresh_token`
  ADD CONSTRAINT `refresh_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_communities`
--
ALTER TABLE `user_communities`
  ADD CONSTRAINT `user_communities_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_communities_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_followers`
--
ALTER TABLE `user_followers`
  ADD CONSTRAINT `user_followers_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_followers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD CONSTRAINT `user_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_photos`
--
ALTER TABLE `user_photos`
  ADD CONSTRAINT `user_photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_post_interactions`
--
ALTER TABLE `user_post_interactions`
  ADD CONSTRAINT `user_post_interactions_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_post_interactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_privacy`
--
ALTER TABLE `user_privacy`
  ADD CONSTRAINT `user_privacy_ibfk_1` FOREIGN KEY (`privacy_options_id`) REFERENCES `user_privacy_options` (`id`),
  ADD CONSTRAINT `user_privacy_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_videos`
--
ALTER TABLE `user_videos`
  ADD CONSTRAINT `user_videos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_videos_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
