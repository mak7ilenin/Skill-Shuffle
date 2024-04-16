-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Апр 16 2024 г., 23:56
-- Версия сервера: 10.4.22-MariaDB
-- Версия PHP: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `skill_shuffle`
--
CREATE DATABASE IF NOT EXISTS `skill_shuffle` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `skill_shuffle`;

-- --------------------------------------------------------

--
-- Структура таблицы `blocked_users`
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

--
-- Очистить таблицу перед добавлением данных `blocked_users`
--

TRUNCATE TABLE `blocked_users`;
-- --------------------------------------------------------

--
-- Структура таблицы `chats`
--

CREATE TABLE IF NOT EXISTS `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) COLLATE utf8mb4_bin DEFAULT NULL,
  `type` enum('PRIVATE','COMMUNITY','GROUP') COLLATE utf8mb4_bin NOT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `chats`
--

TRUNCATE TABLE `chats`;
--
-- Дамп данных таблицы `chats`
--

INSERT INTO `chats` (`id`, `name`, `type`, `avatar_url`) VALUES
(1, 'Test', 'PRIVATE', NULL),
(2, 'Real chads', 'GROUP', 'chats/chat-2/avatar/6483bb973b8f65001ea4755f.jpg'),
(3, 'Quantum Hub', 'COMMUNITY', 'communities/community-3/avatar/we-live-we-love-we-lie.webp'),
(22, 'NBA Chat', 'GROUP', 'chats/chat-22/avatar/dd4afad4-0d78-49a3-a49f-22d7d10524fe.jpg'),
(23, 'Vadim uebok', 'PRIVATE', 'chats/chat-23/avatar/2bd1939f-3ed0-4853-b668-b7032990275f.png'),
(24, 'Legenda', 'GROUP', 'chats/chat-24/avatar/60c30c6d-ba37-4a56-89f1-a63fce124577.png'),
(25, 'Rizz chat', 'GROUP', 'chats/chat-25/avatar/384580e3-b91b-40d4-a594-a734e1a1b744.jpg'),
(27, 'TESTGRAG', 'GROUP', 'chats/chat-27/avatar/2f88ec69-2145-4af2-b56b-d8601fbdf6ad.png');

-- --------------------------------------------------------

--
-- Структура таблицы `chat_history`
--

CREATE TABLE IF NOT EXISTS `chat_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `hidden_before` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `chat_id` (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `chat_history`
--

TRUNCATE TABLE `chat_history`;
-- --------------------------------------------------------

--
-- Структура таблицы `chat_members`
--

CREATE TABLE IF NOT EXISTS `chat_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `role` enum('CREATOR','ADMIN','MEMBER') COLLATE utf8mb4_bin NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `notifications` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `chat_members`
--

TRUNCATE TABLE `chat_members`;
--
-- Дамп данных таблицы `chat_members`
--

INSERT INTO `chat_members` (`id`, `chat_id`, `member_id`, `role`, `joined_at`, `notifications`) VALUES
(1, 1, 7, 'MEMBER', '2024-03-22 23:34:12', b'1'),
(2, 1, 8, 'MEMBER', '2024-03-22 23:34:12', b'1'),
(3, 2, 7, 'MEMBER', '2024-03-22 23:34:44', b'1'),
(4, 2, 8, 'MEMBER', '2024-03-22 23:34:44', b'1'),
(31, 22, 8, 'CREATOR', '2024-04-14 21:00:01', b'1'),
(32, 22, 9, 'MEMBER', '2024-04-14 21:00:01', b'1'),
(33, 22, 7, 'MEMBER', '2024-04-14 21:00:01', b'1'),
(34, 22, 6, 'MEMBER', '2024-04-14 21:00:01', b'1'),
(35, 23, 8, 'MEMBER', '2024-04-14 21:04:10', b'1'),
(36, 23, 9, 'MEMBER', '2024-04-14 21:04:10', b'1'),
(37, 24, 8, 'CREATOR', '2024-04-14 21:08:22', b'1'),
(38, 24, 9, 'MEMBER', '2024-04-14 21:08:22', b'1'),
(39, 24, 7, 'MEMBER', '2024-04-14 21:08:22', b'1'),
(40, 25, 10, 'CREATOR', '2024-04-15 13:51:22', b'1'),
(43, 27, 8, 'CREATOR', '2024-04-16 21:14:09', b'1'),
(44, 27, 6, 'MEMBER', '2024-04-16 21:14:09', b'1');

-- --------------------------------------------------------

--
-- Структура таблицы `chat_messages`
--

CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `content` varchar(1024) COLLATE utf8mb4_bin NOT NULL,
  `timestamp` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `status` enum('SENT','DELIVERED','SEEN') COLLATE utf8mb4_bin NOT NULL DEFAULT 'SENT',
  `type` enum('MESSAGE','ANNOUNCEMENT','ENTRY') COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`sender_id`),
  KEY `chat_id` (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=969 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `chat_messages`
--

TRUNCATE TABLE `chat_messages`;
--
-- Дамп данных таблицы `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `sender_id`, `chat_id`, `content`, `timestamp`, `status`, `type`) VALUES
(1, 6, 2, 'aaa', '2024-03-05 21:11:05.000', 'SENT', 'MESSAGE'),
(2, 6, 2, 'ssssssssssssss', '2024-03-06 15:40:45.000', 'DELIVERED', 'MESSAGE'),
(3, 9, 1, 'Find a job lil nigga!', '2017-03-16 21:36:43.000', 'SENT', 'MESSAGE'),
(4, 8, 2, 'test11111111', '2024-03-13 23:37:53.000', 'SENT', 'MESSAGE'),
(5, 7, 2, 'heyyyyy', '2024-03-13 23:39:43.000', 'SENT', 'MESSAGE'),
(6, 8, 2, 'wtf', '2024-03-13 23:42:19.000', 'SENT', 'MESSAGE'),
(7, 7, 2, 'dfgdfg', '2024-03-13 23:43:19.000', 'SENT', 'MESSAGE'),
(8, 8, 2, 'fdgdf', '2024-03-13 23:46:58.000', 'SENT', 'MESSAGE'),
(9, 8, 2, 'fdgdfg', '2024-03-13 23:50:58.000', 'SENT', 'MESSAGE'),
(10, 8, 2, 'ggg', '2024-03-13 23:55:02.000', 'SENT', 'MESSAGE'),
(11, 8, 2, 'ggggfhj', '2024-03-13 23:55:57.000', 'SENT', 'MESSAGE'),
(12, 8, 2, 'trtt', '2024-03-14 00:04:01.000', 'SENT', 'MESSAGE'),
(13, 7, 2, 'dfddddddddddddddd', '2024-03-14 00:14:55.000', 'SENT', 'MESSAGE'),
(14, 8, 2, 'ddddddddddd', '2024-03-14 00:15:37.000', 'SENT', 'MESSAGE'),
(25, 8, 2, 'fd', '2024-03-14 01:30:01.000', 'SENT', 'MESSAGE'),
(26, 8, 2, '11', '2024-03-14 01:30:20.000', 'SENT', 'MESSAGE'),
(27, 7, 2, 'dddddddddd', '2024-03-14 01:35:30.000', 'SENT', 'MESSAGE'),
(28, 8, 2, 'fgfg', '2024-03-14 01:36:33.000', 'SENT', 'MESSAGE'),
(30, 8, 2, 'hey', '2024-03-14 01:44:30.000', 'SENT', 'MESSAGE'),
(31, 8, 2, '1111', '2024-03-14 01:45:20.000', 'SENT', 'MESSAGE'),
(32, 8, 2, 'ff', '2024-03-14 01:46:38.000', 'SENT', 'MESSAGE'),
(33, 8, 2, 'd', '2024-03-14 01:47:30.000', 'SENT', 'MESSAGE'),
(34, 8, 2, 'd', '2024-03-14 01:48:27.000', 'SENT', 'MESSAGE'),
(35, 8, 2, 'd', '2024-03-14 01:48:40.000', 'SENT', 'MESSAGE'),
(36, 8, 2, 's', '2024-03-14 01:49:11.000', 'SENT', 'MESSAGE'),
(37, 8, 2, 'dfgdfg', '2024-03-14 01:54:38.000', 'SENT', 'MESSAGE'),
(38, 8, 2, 'f', '2024-03-14 01:54:53.000', 'SENT', 'MESSAGE'),
(39, 8, 2, 'sdfsdf', '2024-03-14 02:00:12.000', 'SENT', 'MESSAGE'),
(40, 8, 2, 'ssssss', '2024-03-14 02:03:54.000', 'SENT', 'MESSAGE'),
(41, 8, 2, 'sss', '2024-03-14 02:05:21.000', 'SENT', 'MESSAGE'),
(42, 7, 2, 'hhhhhhhhh', '2024-03-14 02:06:59.000', 'SENT', 'MESSAGE'),
(43, 7, 2, 'jhjjh', '2024-03-14 02:08:28.000', 'SENT', 'MESSAGE'),
(44, 8, 2, 'fdgdfg', '2024-03-14 02:09:36.000', 'SENT', 'MESSAGE'),
(45, 8, 2, 'dfgdfgdfg', '2024-03-14 02:10:15.000', 'SENT', 'MESSAGE'),
(46, 8, 2, 'cccccccccc', '2024-03-14 02:10:38.000', 'SENT', 'MESSAGE'),
(47, 8, 2, '44', '2024-03-14 02:17:02.000', 'SENT', 'MESSAGE'),
(48, 8, 2, '44555', '2024-03-14 02:18:40.000', 'SENT', 'MESSAGE'),
(49, 8, 2, '324', '2024-03-14 02:18:50.000', 'SENT', 'MESSAGE'),
(50, 8, 2, 'f', '2024-03-14 02:21:14.000', 'SENT', 'MESSAGE'),
(51, 8, 2, 'heyyyy', '2024-03-14 02:23:40.000', 'SENT', 'MESSAGE'),
(52, 7, 2, 'idid', '2024-03-14 02:23:58.000', 'SENT', 'MESSAGE'),
(53, 7, 2, 'ididsadfadf[df[[sfd[sdf[', '2024-03-14 02:24:02.000', 'SENT', 'MESSAGE'),
(54, 8, 2, 'sosi', '2024-03-14 02:29:24.000', 'SENT', 'MESSAGE'),
(55, 7, 2, 'ladno', '2024-03-14 02:29:28.000', 'SENT', 'MESSAGE'),
(56, 7, 2, 'odonfgddd', '2024-03-14 02:29:30.000', 'SENT', 'MESSAGE'),
(57, 7, 2, 'gg', '2024-03-14 02:29:30.000', 'SENT', 'MESSAGE'),
(58, 7, 2, 'fdg', '2024-03-14 02:29:31.000', 'SENT', 'MESSAGE'),
(59, 7, 2, '', '2024-03-14 02:29:31.000', 'SENT', 'MESSAGE'),
(60, 7, 2, 'fg\'g', '2024-03-14 02:29:31.000', 'SENT', 'MESSAGE'),
(61, 7, 2, '\'fdg', '2024-03-14 02:29:31.000', 'SENT', 'MESSAGE'),
(62, 7, 2, '\'f', '2024-03-14 02:29:32.000', 'SENT', 'MESSAGE'),
(63, 8, 2, 'idi nahui', '2024-03-14 02:29:40.000', 'SENT', 'MESSAGE'),
(64, 7, 2, 'otsosi uebanishe', '2024-03-14 02:29:50.000', 'SENT', 'MESSAGE'),
(65, 8, 2, 'sdfgsdfgdsfg;;dsflgdfsg', '2024-03-18 16:22:30.000', 'SENT', 'MESSAGE'),
(66, 8, 1, 'idi nah', '2024-03-18 16:22:37.000', 'SENT', 'MESSAGE'),
(67, 8, 2, 'fghfgh', '2024-03-18 16:22:47.000', 'SENT', 'MESSAGE'),
(68, 8, 2, 'hhh', '2024-03-18 16:23:00.000', 'SENT', 'MESSAGE'),
(69, 8, 2, 'fghfhfhfhh', '2024-03-18 16:25:06.000', 'SENT', 'MESSAGE'),
(70, 7, 1, 'emmm??', '2024-03-18 16:25:26.000', 'SENT', 'MESSAGE'),
(71, 7, 1, 'sdam', '2024-03-18 16:25:29.000', 'SENT', 'MESSAGE'),
(72, 7, 1, 'dfghdfgh', '2024-03-18 16:25:48.000', 'SENT', 'MESSAGE'),
(73, 7, 1, 'fg', '2024-03-18 16:25:50.000', 'SENT', 'MESSAGE'),
(74, 7, 1, 'g', '2024-03-18 16:25:51.000', 'SENT', 'MESSAGE'),
(75, 7, 1, 'g', '2024-03-18 16:25:51.000', 'SENT', 'MESSAGE'),
(76, 7, 1, 'g', '2024-03-18 16:25:52.000', 'SENT', 'MESSAGE'),
(77, 7, 1, 'g', '2024-03-18 16:25:52.000', 'SENT', 'MESSAGE'),
(78, 7, 1, 'g', '2024-03-18 16:25:52.000', 'SENT', 'MESSAGE'),
(79, 7, 1, 'f', '2024-03-18 16:25:53.000', 'SENT', 'MESSAGE'),
(80, 7, 1, '56456456', '2024-03-18 16:25:54.000', 'SENT', 'MESSAGE'),
(81, 7, 1, '234234', '2024-03-18 16:25:55.000', 'SENT', 'MESSAGE'),
(82, 7, 1, 'hmmmmmmmmmmmmmmmmmmmmmmmm', '2024-03-18 16:26:07.000', 'SENT', 'MESSAGE'),
(83, 7, 1, 'tfghfgh', '2024-03-18 16:26:19.000', 'SENT', 'MESSAGE'),
(84, 7, 1, 'fg', '2024-03-18 16:26:20.000', 'SENT', 'MESSAGE'),
(85, 7, 1, 'nb', '2024-03-18 16:26:21.000', 'SENT', 'MESSAGE'),
(86, 7, 1, 'v', '2024-03-18 16:26:21.000', 'SENT', 'MESSAGE'),
(87, 7, 1, 'fghrtyfdfghdfdfg', '2024-03-18 16:26:25.000', 'SENT', 'MESSAGE'),
(88, 7, 1, 'vbnvbn', '2024-03-18 16:26:26.000', 'SENT', 'MESSAGE'),
(89, 7, 1, 'vbnvbnhjhjg', '2024-03-18 16:26:28.000', 'SENT', 'MESSAGE'),
(90, 7, 1, 'gghjd45454545', '2024-03-18 16:26:30.000', 'SENT', 'MESSAGE'),
(91, 8, 1, '435345', '2024-03-18 16:26:33.000', 'SENT', 'MESSAGE'),
(92, 8, 1, '345fgh', '2024-03-18 16:26:34.000', 'SENT', 'MESSAGE'),
(93, 7, 1, 'rtdyhdrtfghndftyg jnmbcghvfytjmn ', '2024-03-18 16:26:37.000', 'SENT', 'MESSAGE'),
(94, 7, 1, 'dfghdfgjnm ghbnvm ', '2024-03-18 16:26:41.000', 'SENT', 'MESSAGE'),
(95, 7, 1, '2222222222222222222222222222222222', '2024-03-18 16:26:44.000', 'SENT', 'MESSAGE'),
(96, 8, 2, 'fghdfghfdgh', '2024-03-18 16:26:59.000', 'SENT', 'MESSAGE'),
(97, 7, 1, 'cvbncvbn', '2024-03-18 16:27:02.000', 'SENT', 'MESSAGE'),
(98, 8, 1, 'dfghdfgh', '2024-03-18 16:28:46.000', 'SENT', 'MESSAGE'),
(99, 8, 1, 'dfgh', '2024-03-18 16:28:46.000', 'SENT', 'MESSAGE'),
(100, 8, 1, 'h', '2024-03-18 16:28:46.000', 'SENT', 'MESSAGE'),
(101, 8, 1, 'fdgh', '2024-03-18 16:28:46.000', 'SENT', 'MESSAGE'),
(102, 7, 1, 'fghfdgh', '2024-03-18 16:28:54.000', 'SENT', 'MESSAGE'),
(103, 8, 1, '234234234', '2024-03-18 16:29:03.000', 'SENT', 'MESSAGE'),
(104, 7, 1, '234234', '2024-03-18 16:29:06.000', 'SENT', 'MESSAGE'),
(105, 7, 2, '234234234', '2024-03-18 16:29:11.000', 'SENT', 'MESSAGE'),
(106, 8, 2, '23424234234234234', '2024-03-18 16:29:19.000', 'SENT', 'MESSAGE'),
(107, 8, 2, '234234234', '2024-03-18 16:29:21.000', 'SENT', 'MESSAGE'),
(108, 8, 2, '2342342342341414141414', '2024-03-18 16:29:24.000', 'SENT', 'MESSAGE'),
(109, 7, 1, '1414141414', '2024-03-18 16:29:28.000', 'SENT', 'MESSAGE'),
(110, 7, 1, 'gfhfgh', '2024-03-18 18:24:48.000', 'SENT', 'MESSAGE'),
(111, 7, 2, 'fdgdfgdfg', '2024-03-18 19:24:19.000', 'SENT', 'MESSAGE'),
(112, 7, 2, 'sdfgdfgdfg', '2024-03-18 19:32:28.000', 'SENT', 'MESSAGE'),
(113, 7, 2, 'sssssssssssssss', '2024-03-18 19:32:32.000', 'SENT', 'MESSAGE'),
(114, 7, 2, 'fghfghgh', '2024-03-18 19:32:35.000', 'SENT', 'MESSAGE'),
(115, 7, 2, '33333', '2024-03-18 19:32:37.000', 'SENT', 'MESSAGE'),
(116, 7, 2, '232', '2024-03-18 19:32:38.000', 'SENT', 'MESSAGE'),
(117, 7, 2, '41243234234', '2024-03-18 19:32:40.000', 'SENT', 'MESSAGE'),
(118, 7, 2, 'ghjbmn bvhgjmk bghmkvbghjnkm', '2024-03-18 19:32:42.000', 'SENT', 'MESSAGE'),
(119, 7, 2, 'hfghdfhg', '2024-03-18 19:32:44.000', 'SENT', 'MESSAGE'),
(120, 7, 2, 'fghgfh', '2024-03-18 19:32:47.000', 'SENT', 'MESSAGE'),
(121, 8, 2, 'dfghuioriotkjfgnhkfgjioh', '2024-03-18 19:32:54.000', 'SENT', 'MESSAGE'),
(122, 8, 2, 'ghjo 590tgfhnj', '2024-03-18 19:32:56.000', 'SENT', 'MESSAGE'),
(123, 8, 1, 'fdghfg hfghbjncvlknbjmfgkdhjfcgvn', '2024-03-18 19:33:03.000', 'SENT', 'MESSAGE'),
(124, 7, 2, '34texdsrf4octgvnxedfr5tgy', '2024-03-18 19:33:05.000', 'SENT', 'MESSAGE'),
(125, 7, 2, 'gdhkfpjf ghkvcbnklmk;fvcgh', '2024-03-18 19:33:07.000', 'SENT', 'MESSAGE'),
(126, 7, 2, 'knvgnj590igknlkcfghfghfgh', '2024-03-18 19:33:10.000', 'SENT', 'MESSAGE'),
(127, 7, 2, '45u9ndfsgjkndfklgcv', '2024-03-18 19:33:12.000', 'SENT', 'MESSAGE'),
(128, 8, 2, ' cgvfhnjm gvhjn m ', '2024-03-18 19:33:20.000', 'SENT', 'MESSAGE'),
(129, 7, 1, 'tdfyhfgytjhnftghjnfghjfhujfyt', '2024-03-18 19:33:24.000', 'SENT', 'MESSAGE'),
(130, 7, 1, 'ftygjhn bfg', '2024-03-18 19:33:25.000', 'SENT', 'MESSAGE'),
(131, 7, 1, '\\b vn', '2024-03-18 19:33:25.000', 'SENT', 'MESSAGE'),
(132, 7, 1, 'c]dftgy', '2024-03-18 19:33:25.000', 'SENT', 'MESSAGE'),
(133, 7, 1, 'j', '2024-03-18 19:33:26.000', 'SENT', 'MESSAGE'),
(134, 7, 1, 'ghjmn vcgb ', '2024-03-18 19:33:30.000', 'SENT', 'MESSAGE'),
(135, 7, 1, '\\jm\\', '2024-03-18 19:33:30.000', 'SENT', 'MESSAGE'),
(136, 7, 1, ';hcgvbjm\\', '2024-03-18 19:33:30.000', 'SENT', 'MESSAGE'),
(137, 7, 1, 'ngvc\\', '2024-03-18 19:33:30.000', 'SENT', 'MESSAGE'),
(138, 7, 1, 'jm\\', '2024-03-18 19:33:30.000', 'SENT', 'MESSAGE'),
(139, 7, 1, '\'hgj', '2024-03-18 19:33:30.000', 'SENT', 'MESSAGE'),
(140, 7, 1, '\\', '2024-03-18 19:33:31.000', 'SENT', 'MESSAGE'),
(141, 7, 2, 'hey', '2024-03-19 18:03:27.000', 'SENT', 'MESSAGE'),
(142, 8, 2, 'jk', '2024-03-20 13:23:26.000', 'SENT', 'MESSAGE'),
(143, 8, 2, 'njik', '2024-03-20 13:23:27.000', 'SENT', 'MESSAGE'),
(144, 8, 2, 'okmo', '2024-03-20 13:23:28.000', 'SENT', 'MESSAGE'),
(145, 8, 2, ',lk', '2024-03-20 13:23:29.000', 'SENT', 'MESSAGE'),
(146, 7, 2, 'nujijn', '2024-03-20 13:23:44.000', 'SENT', 'MESSAGE'),
(147, 7, 2, 'jnmi', '2024-03-20 13:23:44.000', 'SENT', 'MESSAGE'),
(148, 7, 2, 'mjk,o', '2024-03-20 13:23:45.000', 'SENT', 'MESSAGE'),
(149, 8, 1, 'pllppl]', '2024-03-20 13:23:53.000', 'SENT', 'MESSAGE'),
(150, 8, 1, 'lp', '2024-03-20 13:23:53.000', 'SENT', 'MESSAGE'),
(151, 8, 1, ']lpp', '2024-03-20 13:23:53.000', 'SENT', 'MESSAGE'),
(152, 8, 1, 'l]', '2024-03-20 13:23:53.000', 'SENT', 'MESSAGE'),
(153, 8, 1, ']lp', '2024-03-20 13:23:54.000', 'SENT', 'MESSAGE'),
(154, 8, 1, ']kpp[', '2024-03-20 13:24:26.000', 'SENT', 'MESSAGE'),
(155, 7, 1, 'dsfgsdfg', '2024-03-21 16:38:35.000', 'SENT', 'MESSAGE'),
(156, 7, 1, 'fghjfghj', '2024-03-21 16:39:54.000', 'SENT', 'MESSAGE'),
(157, 7, 1, 'ghj', '2024-03-21 16:39:54.000', 'SENT', 'MESSAGE'),
(158, 7, 2, 'dfghfdgh', '2024-03-21 17:50:49.000', 'SENT', 'MESSAGE'),
(159, 7, 2, 'dfghdfg', '2024-03-21 17:50:52.000', 'SENT', 'MESSAGE'),
(160, 7, 2, 'h', '2024-03-21 17:50:52.000', 'SENT', 'MESSAGE'),
(161, 7, 2, 'dfghfdghdfgh', '2024-03-21 17:50:53.000', 'SENT', 'MESSAGE'),
(162, 7, 2, 'dfgh', '2024-03-21 17:50:54.000', 'SENT', 'MESSAGE'),
(163, 7, 2, 'rtydrtfhbgtcb cfvgb', '2024-03-21 17:50:56.000', 'SENT', 'MESSAGE'),
(164, 7, 2, 'dsfgdfgsdfg', '2024-03-21 17:51:30.000', 'SENT', 'MESSAGE'),
(165, 7, 2, 'dfgsfgdsfg', '2024-03-21 17:52:33.000', 'SENT', 'MESSAGE'),
(166, 8, 2, 'dsfgdsfg', '2024-03-21 17:52:38.000', 'SENT', 'MESSAGE'),
(167, 8, 2, 'ghjfgyhj', '2024-03-21 17:53:27.000', 'SENT', 'MESSAGE'),
(168, 8, 2, 'fghj', '2024-03-21 17:53:28.000', 'SENT', 'MESSAGE'),
(169, 8, 2, 'fgh', '2024-03-21 17:53:28.000', 'SENT', 'MESSAGE'),
(170, 7, 2, 'fghjfghj', '2024-03-21 17:53:30.000', 'SENT', 'MESSAGE'),
(171, 7, 2, 'ghjgh', '2024-03-21 17:53:30.000', 'SENT', 'MESSAGE'),
(172, 7, 2, 'j', '2024-03-21 17:53:31.000', 'SENT', 'MESSAGE'),
(173, 8, 2, 'hjklhjkl', '2024-03-21 17:53:37.000', 'SENT', 'MESSAGE'),
(174, 8, 2, 'jhkl', '2024-03-21 17:53:37.000', 'SENT', 'MESSAGE'),
(175, 7, 2, 'fgdfg', '2024-03-21 17:56:10.000', 'SENT', 'MESSAGE'),
(176, 7, 2, 'fdghfdgh', '2024-03-21 17:56:10.000', 'SENT', 'MESSAGE'),
(177, 7, 2, 'dfghdfgh', '2024-03-21 17:57:35.000', 'SENT', 'MESSAGE'),
(178, 8, 2, 'gsdfgsdfg', '2024-03-21 18:13:43.000', 'SENT', 'MESSAGE'),
(179, 7, 1, 'dfgdfg', '2024-03-21 18:44:44.000', 'SENT', 'MESSAGE'),
(180, 8, 1, 'sdfgsdfg', '2024-03-21 18:44:53.000', 'SENT', 'MESSAGE'),
(181, 7, 1, 'fgh', '2024-03-21 18:44:54.000', 'SENT', 'MESSAGE'),
(182, 8, 1, 'dfghdfgh', '2024-03-21 18:44:58.000', 'SENT', 'MESSAGE'),
(183, 7, 2, 'sdfgsdfg', '2024-03-21 18:53:27.000', 'SENT', 'MESSAGE'),
(184, 7, 2, 'dsfgsdf', '2024-03-21 18:53:30.000', 'SENT', 'MESSAGE'),
(185, 8, 2, 'dfghfgh', '2024-03-21 18:53:34.000', 'SENT', 'MESSAGE'),
(186, 7, 2, 'dfghg', '2024-03-21 18:53:37.000', 'SENT', 'MESSAGE'),
(187, 8, 1, 'fghgfh', '2024-03-21 19:06:05.000', 'SENT', 'MESSAGE'),
(188, 8, 1, 'dfghfdgh', '2024-03-21 19:08:49.000', 'SENT', 'MESSAGE'),
(189, 8, 2, 'fghjfghj', '2024-03-21 19:08:53.000', 'SENT', 'MESSAGE'),
(190, 8, 2, 'dfghdfgh', '2024-03-21 19:08:58.000', 'SENT', 'MESSAGE'),
(191, 8, 2, 'dfghfgh', '2024-03-21 19:10:22.000', 'SENT', 'MESSAGE'),
(192, 8, 2, 'dfgh', '2024-03-21 19:10:22.000', 'SENT', 'MESSAGE'),
(193, 8, 2, '', '2024-03-21 19:10:22.000', 'SENT', 'MESSAGE'),
(194, 7, 2, 'ghjkghjk', '2024-03-21 19:10:29.000', 'SENT', 'MESSAGE'),
(195, 7, 2, '', '2024-03-21 19:10:30.000', 'SENT', 'MESSAGE'),
(196, 8, 2, 'fghdfgh', '2024-03-21 19:17:09.000', 'SENT', 'MESSAGE'),
(197, 8, 2, 'dfgdfg', '2024-03-21 19:17:10.000', 'SENT', 'MESSAGE'),
(198, 8, 1, 'fghjfghjgfhj', '2024-03-21 20:21:21.000', 'SENT', 'MESSAGE'),
(199, 8, 1, 'dfghfghfgh', '2024-03-21 20:21:26.000', 'SENT', 'MESSAGE'),
(200, 8, 1, 'SDFGDSFGSDFGSDFG', '2024-03-21 20:23:28.000', 'SENT', 'MESSAGE'),
(201, 8, 2, 'SDFGDSFG', '2024-03-21 20:23:32.000', 'SENT', 'MESSAGE'),
(202, 8, 2, 'DSFG', '2024-03-21 20:23:32.000', 'SENT', 'MESSAGE'),
(203, 8, 2, 'DFG', '2024-03-21 20:23:33.000', 'SENT', 'MESSAGE'),
(204, 8, 2, 'sdfgsdfg', '2024-03-21 20:24:28.000', 'SENT', 'MESSAGE'),
(205, 7, 1, 'sdfgsdfg', '2024-03-21 20:24:33.000', 'SENT', 'MESSAGE'),
(206, 7, 1, 'sdfg', '2024-03-21 20:24:33.000', 'SENT', 'MESSAGE'),
(207, 7, 1, 'sdfg', '2024-03-21 20:24:34.000', 'SENT', 'MESSAGE'),
(208, 8, 2, 'ghjkhgjk', '2024-03-21 20:24:35.000', 'SENT', 'MESSAGE'),
(209, 8, 2, 'ghjk', '2024-03-21 20:24:36.000', 'SENT', 'MESSAGE'),
(210, 8, 2, 'ghjk', '2024-03-21 20:24:36.000', 'SENT', 'MESSAGE'),
(211, 8, 2, 'hjk', '2024-03-21 20:24:36.000', 'SENT', 'MESSAGE'),
(212, 7, 1, 'fdsgdfg', '2024-03-21 21:02:11.000', 'SENT', 'MESSAGE'),
(213, 7, 1, 'vnbctry45', '2024-03-21 21:02:14.000', 'SENT', 'MESSAGE'),
(214, 7, 1, 'fghj', '2024-03-21 21:02:16.000', 'SENT', 'MESSAGE'),
(215, 7, 1, 'vcb cvb', '2024-03-21 21:02:18.000', 'SENT', 'MESSAGE'),
(216, 8, 1, 'fghjgh', '2024-03-21 21:03:08.000', 'SENT', 'MESSAGE'),
(217, 8, 1, 'ghj', '2024-03-21 21:03:08.000', 'SENT', 'MESSAGE'),
(218, 8, 2, 'jfgjghj', '2024-03-21 21:03:15.000', 'SENT', 'MESSAGE'),
(219, 8, 2, 'gfhj', '2024-03-21 21:03:16.000', 'SENT', 'MESSAGE'),
(220, 8, 2, 'ghj', '2024-03-21 21:03:17.000', 'SENT', 'MESSAGE'),
(221, 7, 1, 'fdghfgdh', '2024-03-21 21:44:43.000', 'SENT', 'MESSAGE'),
(222, 7, 1, 'uhkjgk', '2024-03-21 21:44:53.000', 'SENT', 'MESSAGE'),
(223, 7, 1, 'hjkhjk', '2024-03-21 21:46:40.000', 'SENT', 'MESSAGE'),
(224, 8, 2, 'njhk', '2024-03-21 21:46:43.000', 'SENT', 'MESSAGE'),
(225, 8, 2, 'hjk', '2024-03-21 21:46:43.000', 'SENT', 'MESSAGE'),
(226, 8, 1, 'gh', '2024-03-21 21:46:52.000', 'SENT', 'MESSAGE'),
(227, 8, 1, 'gfh', '2024-03-21 21:46:52.000', 'SENT', 'MESSAGE'),
(228, 8, 1, 'ghf', '2024-03-21 21:46:53.000', 'SENT', 'MESSAGE'),
(229, 8, 1, 'hgjgjgj', '2024-03-21 21:53:12.000', 'SENT', 'MESSAGE'),
(230, 8, 1, 'ttyutyu', '2024-03-21 21:53:16.000', 'SENT', 'MESSAGE'),
(231, 8, 1, 'tuy', '2024-03-21 21:53:16.000', 'SENT', 'MESSAGE'),
(232, 8, 1, 'dsfgdsfg', '2024-03-21 22:01:14.000', 'SENT', 'MESSAGE'),
(233, 8, 1, 'dfg', '2024-03-21 22:01:14.000', 'SENT', 'MESSAGE'),
(234, 8, 1, 'gjhhj', '2024-03-21 22:03:23.000', 'SENT', 'MESSAGE'),
(235, 8, 1, 'ygiu', '2024-03-21 22:03:29.000', 'SENT', 'MESSAGE'),
(236, 8, 2, 'gfjghj', '2024-03-21 22:06:58.000', 'SENT', 'MESSAGE'),
(237, 8, 2, 'ghj', '2024-03-21 22:06:59.000', 'SENT', 'MESSAGE'),
(238, 8, 1, 'fghjfghj', '2024-03-21 22:07:03.000', 'SENT', 'MESSAGE'),
(239, 8, 1, 'gfhj', '2024-03-21 22:07:04.000', 'SENT', 'MESSAGE'),
(240, 8, 1, 'ghj', '2024-03-21 22:07:04.000', 'SENT', 'MESSAGE'),
(241, 8, 1, 'ghj', '2024-03-21 22:07:05.000', 'SENT', 'MESSAGE'),
(242, 7, 2, 'gfjghj', '2024-03-21 22:07:08.000', 'SENT', 'MESSAGE'),
(243, 7, 2, 'fgjghjgfhj', '2024-03-21 22:19:46.000', 'SENT', 'MESSAGE'),
(244, 8, 2, 'dfgdgdfg', '2024-03-21 23:27:07.000', 'SENT', 'MESSAGE'),
(245, 8, 2, 'dsfg5646', '2024-03-21 23:27:10.000', 'SENT', 'MESSAGE'),
(246, 8, 2, 'sdfgdfg', '2024-03-21 23:38:14.000', 'SENT', 'MESSAGE'),
(247, 7, 1, 'fdgg', '2024-03-21 23:38:22.000', 'SENT', 'MESSAGE'),
(248, 7, 1, 'hjkk', '2024-03-21 23:38:25.000', 'SENT', 'MESSAGE'),
(249, 7, 2, 'gfhfh', '2024-03-21 23:38:34.000', 'SENT', 'MESSAGE'),
(250, 7, 2, 'dfgdfgdg', '2024-03-21 23:40:43.000', 'SENT', 'MESSAGE'),
(251, 8, 2, 'dfgdfg', '2024-03-21 23:40:50.000', 'SENT', 'MESSAGE'),
(252, 8, 1, 'dgfg', '2024-03-21 23:40:54.000', 'SENT', 'MESSAGE'),
(253, 8, 1, 'dfg', '2024-03-21 23:40:54.000', 'SENT', 'MESSAGE'),
(254, 8, 1, 'gfhdgh', '2024-03-21 23:42:04.000', 'SENT', 'MESSAGE'),
(255, 7, 2, 'dfgdfg', '2024-03-21 23:42:07.000', 'SENT', 'MESSAGE'),
(256, 8, 1, 'dfgdsfgsfg', '2024-03-21 23:49:08.000', 'SENT', 'MESSAGE'),
(257, 7, 2, 'cvxbb', '2024-03-21 23:49:12.000', 'SENT', 'MESSAGE'),
(258, 7, 2, 'gjfghj', '2024-03-21 23:49:23.000', 'SENT', 'MESSAGE'),
(259, 8, 2, 'fhfgh', '2024-03-21 23:49:51.000', 'SENT', 'MESSAGE'),
(260, 8, 2, 'h', '2024-03-21 23:49:55.000', 'SENT', 'MESSAGE'),
(261, 7, 2, 'fhfgh', '2024-03-21 23:50:26.000', 'SENT', 'MESSAGE'),
(262, 7, 2, 'gfhjgfjh', '2024-03-21 23:50:45.000', 'SENT', 'MESSAGE'),
(263, 7, 2, 'ghj', '2024-03-21 23:50:45.000', 'SENT', 'MESSAGE'),
(264, 7, 2, 'fdghfgh', '2024-03-21 23:56:04.000', 'SENT', 'MESSAGE'),
(265, 8, 1, 'hgjghj', '2024-03-21 23:56:50.000', 'SENT', 'MESSAGE'),
(266, 8, 2, 'gfjghj', '2024-03-21 23:56:55.000', 'SENT', 'MESSAGE'),
(267, 8, 2, 'ghj', '2024-03-21 23:56:55.000', 'SENT', 'MESSAGE'),
(268, 8, 2, 'jkl;jkl;', '2024-03-22 20:58:02.000', 'SENT', 'MESSAGE'),
(269, 8, 2, 'dsfgfg', '2024-03-22 22:10:43.000', 'SENT', 'MESSAGE'),
(270, 8, 2, 'sdfgdsfg', '2024-03-22 22:10:49.000', 'SENT', 'MESSAGE'),
(271, 8, 2, 'dfgfg', '2024-03-22 22:10:51.000', 'SENT', 'MESSAGE'),
(272, 7, 1, 'dfgdfg', '2024-03-22 22:10:53.000', 'SENT', 'MESSAGE'),
(273, 7, 1, 'dfg', '2024-03-22 22:10:54.000', 'SENT', 'MESSAGE'),
(274, 8, 1, 'fghfghfgh', '2024-03-22 22:27:15.000', 'SENT', 'MESSAGE'),
(275, 7, 2, 'dfghfhgfgh', '2024-03-22 22:27:21.000', 'SENT', 'MESSAGE'),
(276, 7, 2, 'fhfghh', '2024-03-22 22:27:23.000', 'SENT', 'MESSAGE'),
(277, 8, 1, 'fdghfgh', '2024-03-22 22:40:19.000', 'SENT', 'MESSAGE'),
(278, 8, 1, 'ghfh', '2024-03-22 22:40:23.000', 'SENT', 'MESSAGE'),
(279, 7, 2, 'fghfdgh', '2024-03-22 22:42:28.000', 'SENT', 'MESSAGE'),
(280, 7, 2, 'dvbnvcnb', '2024-03-22 22:42:31.000', 'SENT', 'MESSAGE'),
(281, 7, 2, '5rtyry', '2024-03-22 22:42:37.000', 'SENT', 'MESSAGE'),
(282, 7, 1, 'gjhjhjhjhj', '2024-03-22 22:43:13.000', 'SENT', 'MESSAGE'),
(283, 8, 1, 'hgjkhjk', '2024-03-22 22:44:28.000', 'SENT', 'MESSAGE'),
(284, 7, 2, 'hjkhgjk', '2024-03-22 22:44:34.000', 'SENT', 'MESSAGE'),
(285, 7, 2, 'hgjkhk', '2024-03-22 22:44:35.000', 'SENT', 'MESSAGE'),
(286, 7, 2, 'dfhdfgh', '2024-03-22 22:47:43.000', 'SENT', 'MESSAGE'),
(287, 7, 2, 'dfghfgh', '2024-03-22 22:47:44.000', 'SENT', 'MESSAGE'),
(288, 8, 1, 'vbnvcbnbvn', '2024-03-22 22:47:48.000', 'SENT', 'MESSAGE'),
(289, 7, 2, 'sdfsf', '2024-03-22 23:06:00.000', 'SENT', 'MESSAGE'),
(290, 7, 2, 'sdfsdf', '2024-03-22 23:06:02.000', 'SENT', 'MESSAGE'),
(291, 7, 1, 'sadfsf', '2024-03-22 23:06:07.000', 'SENT', 'MESSAGE'),
(292, 7, 1, 'vcx;\';c', '2024-03-22 23:06:09.000', 'SENT', 'MESSAGE'),
(293, 8, 1, 'dgdfsgdfg', '2024-03-22 23:16:48.000', 'SENT', 'MESSAGE'),
(294, 8, 1, 'dsfg', '2024-03-22 23:16:50.000', 'SENT', 'MESSAGE'),
(295, 8, 1, 'dfg', '2024-03-22 23:16:50.000', 'SENT', 'MESSAGE'),
(296, 7, 1, 'dfgdfsgdg', '2024-03-22 23:20:31.000', 'SENT', 'MESSAGE'),
(297, 8, 1, 'dfgfgsfg', '2024-03-22 23:21:13.000', 'SENT', 'MESSAGE'),
(298, 8, 1, 'vcb', '2024-03-22 23:21:15.000', 'SENT', 'MESSAGE'),
(299, 7, 1, 'retdsgfgrt', '2024-03-22 23:21:19.000', 'SENT', 'MESSAGE'),
(300, 7, 2, 'dsfggsfg', '2024-03-22 23:21:26.000', 'SENT', 'MESSAGE'),
(301, 7, 2, 'dfgsg', '2024-03-22 23:21:27.000', 'SENT', 'MESSAGE'),
(302, 7, 2, 'fd', '2024-03-22 23:21:28.000', 'SENT', 'MESSAGE'),
(303, 7, 2, '34', '2024-03-22 23:21:29.000', 'SENT', 'MESSAGE'),
(304, 8, 1, 'sdgfdfgdf', '2024-03-22 23:21:58.000', 'SENT', 'MESSAGE'),
(305, 8, 1, 'dfg', '2024-03-22 23:21:59.000', 'SENT', 'MESSAGE'),
(306, 8, 1, 'g', '2024-03-22 23:21:59.000', 'SENT', 'MESSAGE'),
(307, 8, 1, 'dgfvfs', '2024-03-22 23:22:08.000', 'SENT', 'MESSAGE'),
(308, 8, 1, 'fvdsv', '2024-03-22 23:22:09.000', 'SENT', 'MESSAGE'),
(309, 7, 1, 'ghjjghj', '2024-03-22 23:26:05.000', 'SENT', 'MESSAGE'),
(310, 7, 1, 'dfghfgh', '2024-03-22 23:27:16.000', 'SENT', 'MESSAGE'),
(311, 7, 1, 'vbnbn', '2024-03-22 23:31:49.000', 'SENT', 'MESSAGE'),
(312, 7, 1, 'gjghj', '2024-03-22 23:32:06.000', 'SENT', 'MESSAGE'),
(313, 8, 1, 'ghjgjj', '2024-03-22 23:35:15.000', 'SENT', 'MESSAGE'),
(314, 7, 1, 'dfg', '2024-03-22 23:56:28.000', 'SENT', 'MESSAGE'),
(315, 7, 1, 'dfgdfg', '2024-03-22 23:56:45.000', 'SENT', 'MESSAGE'),
(316, 7, 1, 'cvbcvb', '2024-03-22 23:57:27.000', 'SENT', 'MESSAGE'),
(317, 7, 1, 'sdgsfg', '2024-03-22 23:59:38.000', 'SENT', 'MESSAGE'),
(318, 8, 1, 'hey', '2024-03-23 00:05:52.000', 'SENT', 'MESSAGE'),
(319, 8, 1, 'sdfgdsfgfg', '2024-03-23 00:08:03.000', 'SENT', 'MESSAGE'),
(320, 7, 1, 'dsfgdfgdfg', '2024-03-23 00:08:09.000', 'SENT', 'MESSAGE'),
(321, 8, 1, 'dfgdgdg', '2024-03-23 00:08:35.000', 'SENT', 'MESSAGE'),
(322, 8, 1, 'dg', '2024-03-23 00:08:36.000', 'SENT', 'MESSAGE'),
(323, 8, 1, 'dfg', '2024-03-23 00:08:39.000', 'SENT', 'MESSAGE'),
(324, 7, 1, 'sdfdfs[[fd[fd', '2024-03-23 00:09:10.000', 'SENT', 'MESSAGE'),
(325, 7, 1, 'sfdsadfsd', '2024-03-23 00:09:16.000', 'SENT', 'MESSAGE'),
(326, 8, 1, 'dsgfgsdfgdfgdsg', '2024-03-23 00:10:12.000', 'SENT', 'MESSAGE'),
(327, 8, 1, 'dfgdfg', '2024-03-23 00:10:15.000', 'SENT', 'MESSAGE'),
(328, 8, 1, 'cvbxcbcbcvb', '2024-03-23 00:10:23.000', 'SENT', 'MESSAGE'),
(329, 8, 1, 'dfgfg', '2024-03-23 00:22:20.000', 'SENT', 'MESSAGE'),
(330, 8, 1, 'fghfgh', '2024-03-23 00:26:22.000', 'SENT', 'MESSAGE'),
(331, 8, 1, 'dfgdfg', '2024-03-23 00:26:51.000', 'SENT', 'MESSAGE'),
(332, 8, 1, 'ggggg', '2024-03-23 00:27:23.000', 'SENT', 'MESSAGE'),
(333, 8, 1, 'fghfgh', '2024-03-23 00:28:41.000', 'SENT', 'MESSAGE'),
(334, 8, 1, 'ddddddddd', '2024-03-23 00:29:02.000', 'SENT', 'MESSAGE'),
(335, 8, 1, 'sdf]s]]', '2024-03-23 00:29:19.000', 'SENT', 'MESSAGE'),
(336, 8, 1, 'aaaa', '2024-03-23 00:30:26.000', 'SENT', 'MESSAGE'),
(337, 8, 1, 'ddd', '2024-03-23 00:31:29.000', 'SENT', 'MESSAGE'),
(338, 8, 1, 'dfdfd', '2024-03-23 00:31:48.000', 'SENT', 'MESSAGE'),
(339, 8, 1, 'dfgdf', '2024-03-23 00:32:22.000', 'SENT', 'MESSAGE'),
(340, 8, 1, 'dfgdg', '2024-03-23 00:33:18.000', 'SENT', 'MESSAGE'),
(341, 8, 1, 'dfgdfg', '2024-03-23 00:33:31.000', 'SENT', 'MESSAGE'),
(342, 8, 1, 'dfgfdg', '2024-03-23 00:34:29.000', 'SENT', 'MESSAGE'),
(343, 8, 1, 'dfgdfgdg', '2024-03-23 00:34:49.000', 'SENT', 'MESSAGE'),
(344, 8, 1, 'dfgdfg', '2024-03-23 00:35:07.000', 'SENT', 'MESSAGE'),
(345, 8, 1, 'dfgdfg', '2024-03-23 00:35:54.000', 'SENT', 'MESSAGE'),
(346, 8, 1, 'sdfsdf', '2024-03-23 00:39:41.000', 'SENT', 'MESSAGE'),
(347, 8, 1, 'hey', '2024-03-23 00:40:25.000', 'SENT', 'MESSAGE'),
(348, 8, 1, 'heyy', '2024-03-23 00:41:05.000', 'SENT', 'MESSAGE'),
(349, 8, 1, 'dgfdgfdg', '2024-03-23 00:41:43.000', 'SENT', 'MESSAGE'),
(350, 8, 1, 'hdfhdf', '2024-03-23 00:42:08.000', 'SENT', 'MESSAGE'),
(351, 8, 1, 'dfgdfg', '2024-03-23 00:42:40.000', 'SENT', 'MESSAGE'),
(352, 8, 1, 'yesyyyy', '2024-03-23 00:45:22.000', 'SENT', 'MESSAGE'),
(353, 8, 1, 'fdgdfg', '2024-03-23 00:45:49.000', 'SENT', 'MESSAGE'),
(354, 8, 1, 'gfdgdfg', '2024-03-23 00:48:47.000', 'SENT', 'MESSAGE'),
(355, 8, 1, 'testt', '2024-03-23 00:50:18.000', 'SENT', 'MESSAGE'),
(356, 8, 1, 'dfgdg', '2024-03-23 00:50:22.000', 'SENT', 'MESSAGE'),
(357, 8, 1, 'dfgdg', '2024-03-23 00:50:23.000', 'SENT', 'MESSAGE'),
(358, 8, 1, 'dfg', '2024-03-23 00:50:24.000', 'SENT', 'MESSAGE'),
(359, 8, 1, 'dfg', '2024-03-23 00:50:24.000', 'SENT', 'MESSAGE'),
(360, 8, 1, 'vbcvbvb', '2024-03-23 00:50:26.000', 'SENT', 'MESSAGE'),
(361, 8, 1, 'cvbcv', '2024-03-23 00:50:26.000', 'SENT', 'MESSAGE'),
(362, 8, 1, 'bffffffffffffff', '2024-03-23 00:50:28.000', 'SENT', 'MESSAGE'),
(363, 8, 1, 'hi ty', '2024-03-23 00:55:52.000', 'SENT', 'MESSAGE'),
(364, 8, 1, 'hey', '2024-03-23 01:02:48.000', 'SENT', 'MESSAGE'),
(365, 8, 1, 'heyyy', '2024-03-23 01:06:31.000', 'SENT', 'MESSAGE'),
(366, 8, 1, 'jeeeeeee', '2024-03-23 01:06:42.000', 'SENT', 'MESSAGE'),
(367, 8, 1, 'heyy', '2024-03-23 01:07:32.000', 'SENT', 'MESSAGE'),
(368, 8, 1, 'dfgdfg', '2024-03-23 01:10:10.000', 'SENT', 'MESSAGE'),
(369, 8, 1, 'heyyy', '2024-03-23 01:14:12.000', 'SENT', 'MESSAGE'),
(370, 8, 1, 'hey nigga', '2024-03-23 01:17:17.000', 'SENT', 'MESSAGE'),
(371, 8, 1, 'heyy', '2024-03-23 01:22:11.000', 'SENT', 'MESSAGE'),
(372, 7, 2, 'dgg', '2024-03-23 01:22:26.000', 'SENT', 'MESSAGE'),
(373, 7, 1, 'niggaaaaaa', '2024-03-23 01:22:33.000', 'SENT', 'MESSAGE'),
(374, 7, 1, 'dfgdfg', '2024-03-23 01:22:55.000', 'SENT', 'MESSAGE'),
(375, 7, 1, 'dfgg', '2024-03-23 01:23:14.000', 'SENT', 'MESSAGE'),
(376, 7, 1, 'hjkhjk', '2024-03-23 01:23:59.000', 'SENT', 'MESSAGE'),
(377, 7, 1, 'ghjghj', '2024-03-23 01:24:08.000', 'SENT', 'MESSAGE'),
(378, 8, 2, 'heyy', '2024-03-23 01:28:14.000', 'SENT', 'MESSAGE'),
(379, 8, 2, 'hey', '2024-03-23 01:38:37.000', 'SENT', 'MESSAGE'),
(380, 8, 2, 'hey', '2024-03-23 01:40:27.000', 'SENT', 'MESSAGE'),
(381, 8, 2, '////??', '2024-03-23 01:40:47.000', 'SENT', 'MESSAGE'),
(382, 7, 1, 'gfdg', '2024-03-23 01:43:28.000', 'SENT', 'MESSAGE'),
(383, 8, 2, 'fdgd', '2024-03-23 01:45:35.000', 'SENT', 'MESSAGE'),
(384, 8, 2, 'fgfg', '2024-03-23 01:45:45.000', 'SENT', 'MESSAGE'),
(385, 8, 2, 'heyyy', '2024-03-23 01:48:03.000', 'SENT', 'MESSAGE'),
(386, 8, 2, 'hey', '2024-03-23 01:48:25.000', 'SENT', 'MESSAGE'),
(387, 8, 2, 'hey', '2024-03-23 01:48:27.000', 'SENT', 'MESSAGE'),
(388, 8, 2, 'gfdg', '2024-03-23 01:48:37.000', 'SENT', 'MESSAGE'),
(389, 8, 2, 'sosaaaaaaaaaaa', '2024-03-23 01:48:41.000', 'SENT', 'MESSAGE'),
(390, 8, 2, 'sosattttttt', '2024-03-23 01:48:44.000', 'SENT', 'MESSAGE'),
(391, 8, 2, 'sa', '2024-03-23 01:48:45.000', 'SENT', 'MESSAGE'),
(392, 8, 2, 'gfd', '2024-03-23 01:48:46.000', 'SENT', 'MESSAGE'),
(393, 8, 2, 'gfd', '2024-03-23 01:48:47.000', 'SENT', 'MESSAGE'),
(394, 8, 2, 'hey', '2024-03-23 01:52:11.000', 'SENT', 'MESSAGE'),
(395, 8, 2, 'dfg', '2024-03-23 01:52:13.000', 'SENT', 'MESSAGE'),
(396, 8, 2, 'dfgdfgfs', '2024-03-23 01:52:15.000', 'SENT', 'MESSAGE'),
(397, 8, 2, 'dslol', '2024-03-23 01:52:20.000', 'SENT', 'MESSAGE'),
(398, 8, 2, 'jkjhkj', '2024-03-23 01:52:22.000', 'SENT', 'MESSAGE'),
(399, 8, 2, 'LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOL', '2024-03-23 01:52:26.000', 'SENT', 'MESSAGE'),
(400, 8, 2, 'LOOOOOOOOOOL', '2024-03-23 01:52:29.000', 'SENT', 'MESSAGE'),
(401, 8, 2, 'ldsad', '2024-03-23 01:52:30.000', 'SENT', 'MESSAGE'),
(402, 8, 2, '[[f[sdfsd[sdf[fsd', '2024-03-23 01:52:33.000', 'SENT', 'MESSAGE'),
(403, 8, 2, '[fsd[fsdfs[ddfs[fds[', '2024-03-23 01:52:34.000', 'SENT', 'MESSAGE'),
(404, 8, 2, 'fdsa[f[sf[fsd', '2024-03-23 01:52:38.000', 'SENT', 'MESSAGE'),
(405, 8, 2, 'fsd[fsd[fsd[s[dff[d[fdf[d[dfs[fd[', '2024-03-23 01:52:40.000', 'SENT', 'MESSAGE'),
(406, 8, 2, '[sd[f[sf[s[f[f[s', '2024-03-23 01:52:45.000', 'SENT', 'MESSAGE'),
(407, 8, 2, 'sdf[sdf', '2024-03-23 01:52:46.000', 'SENT', 'MESSAGE'),
(408, 8, 2, 'dgdf', '2024-03-23 01:53:15.000', 'SENT', 'MESSAGE'),
(409, 8, 2, 'bcvb', '2024-03-23 01:53:24.000', 'SENT', 'MESSAGE'),
(410, 8, 2, 'xcb', '2024-03-23 01:53:25.000', 'SENT', 'MESSAGE'),
(411, 8, 2, 'dfgdfg', '2024-03-23 01:53:27.000', 'SENT', 'MESSAGE'),
(412, 8, 2, 'gfd', '2024-03-23 01:53:30.000', 'SENT', 'MESSAGE'),
(413, 8, 2, 'dfgdggg', '2024-03-23 01:53:33.000', 'SENT', 'MESSAGE'),
(414, 8, 2, 'rrret', '2024-03-23 01:53:38.000', 'SENT', 'MESSAGE'),
(415, 8, 2, 'fsd[fs[sdf[fds[', '2024-03-23 01:54:31.000', 'SENT', 'MESSAGE'),
(416, 7, 1, 'stfu', '2024-03-23 01:54:34.000', 'SENT', 'MESSAGE'),
(417, 8, 2, 'dfg', '2024-03-23 01:54:36.000', 'SENT', 'MESSAGE'),
(418, 8, 2, 'dfg', '2024-03-23 01:54:40.000', 'SENT', 'MESSAGE'),
(419, 8, 2, 'dsgf', '2024-03-23 01:54:44.000', 'SENT', 'MESSAGE'),
(420, 8, 2, 'vvvvvvvvvvvvvv', '2024-03-23 01:54:48.000', 'SENT', 'MESSAGE'),
(421, 8, 2, 'wwwwwwwww', '2024-03-23 01:54:50.000', 'SENT', 'MESSAGE'),
(422, 8, 2, 'w', '2024-03-23 01:54:57.000', 'SENT', 'MESSAGE'),
(423, 8, 2, 'sdfs', '2024-03-23 01:55:06.000', 'SENT', 'MESSAGE'),
(424, 7, 1, 'xvcxvxc', '2024-03-23 01:55:09.000', 'SENT', 'MESSAGE'),
(425, 8, 2, 'asdfsdf', '2024-03-23 01:55:12.000', 'SENT', 'MESSAGE'),
(426, 8, 2, 'fdg', '2024-03-23 01:55:15.000', 'SENT', 'MESSAGE'),
(427, 8, 2, 'dgf', '2024-03-23 01:55:16.000', 'SENT', 'MESSAGE'),
(428, 8, 2, 'fg', '2024-03-23 01:55:16.000', 'SENT', 'MESSAGE'),
(429, 7, 1, 'dfgfdg', '2024-03-23 01:58:05.000', 'SENT', 'MESSAGE'),
(430, 8, 2, 'hey', '2024-03-23 02:00:24.000', 'SENT', 'MESSAGE'),
(431, 8, 2, 'test', '2024-03-23 02:05:30.000', 'SENT', 'MESSAGE'),
(432, 8, 2, 'hey', '2024-03-23 02:06:24.000', 'SENT', 'MESSAGE'),
(433, 8, 2, 'hey', '2024-03-23 02:06:30.000', 'SENT', 'MESSAGE'),
(434, 8, 2, 'heyy', '2024-03-23 02:12:18.000', 'SENT', 'MESSAGE'),
(435, 8, 2, 'hey', '2024-03-23 02:13:28.000', 'SENT', 'MESSAGE'),
(436, 8, 2, 'heyy', '2024-03-23 02:13:33.000', 'SENT', 'MESSAGE'),
(437, 8, 2, 'hee', '2024-03-23 02:13:51.000', 'SENT', 'MESSAGE'),
(438, 8, 2, 'heyy', '2024-03-23 02:14:54.000', 'SENT', 'MESSAGE'),
(439, 8, 2, 'hey', '2024-03-23 02:15:16.000', 'SENT', 'MESSAGE'),
(440, 8, 2, 'gdfgdf', '2024-03-23 02:16:03.000', 'SENT', 'MESSAGE'),
(441, 8, 2, 'gfdgdfg[', '2024-03-23 02:16:55.000', 'SENT', 'MESSAGE'),
(442, 8, 2, 'dfgdg', '2024-03-23 02:17:38.000', 'SENT', 'MESSAGE'),
(443, 7, 1, '[f[sdf[fasdfsd[', '2024-03-23 14:23:50.000', 'SENT', 'MESSAGE'),
(444, 7, 1, 'hi ty', '2024-03-23 14:24:03.000', 'SENT', 'MESSAGE'),
(445, 7, 1, 'heyy', '2024-03-23 14:25:25.000', 'SENT', 'MESSAGE'),
(446, 7, 2, 'ale', '2024-03-23 14:25:30.000', 'SENT', 'MESSAGE'),
(447, 7, 2, 'ale?', '2024-03-23 14:26:07.000', 'SENT', 'MESSAGE'),
(448, 7, 1, 'sdf[[fssdf[', '2024-03-23 14:26:17.000', 'SENT', 'MESSAGE'),
(449, 7, 1, 'gfdgdfg[', '2024-03-23 14:26:55.000', 'SENT', 'MESSAGE'),
(450, 7, 1, 'gsdfgdfg', '2024-03-23 14:27:28.000', 'SENT', 'MESSAGE'),
(451, 7, 1, 'fhgh', '2024-03-23 14:27:36.000', 'SENT', 'MESSAGE'),
(452, 7, 1, 'sdf[aasdf[dfs[', '2024-03-23 14:28:02.000', 'SENT', 'MESSAGE'),
(453, 7, 1, 'asdfsdfdsf', '2024-03-23 14:28:19.000', 'SENT', 'MESSAGE'),
(454, 7, 1, 'fdgdfgfd', '2024-03-23 14:28:34.000', 'SENT', 'MESSAGE'),
(455, 7, 1, 'sdfgdsfgdfsdfgdfgd', '2024-03-23 14:28:42.000', 'SENT', 'MESSAGE'),
(456, 7, 1, 'sdfgsdfg', '2024-03-23 14:30:11.000', 'SENT', 'MESSAGE'),
(457, 7, 1, 'ddddddddddddddddddddddddddddddddd', '2024-03-23 14:30:15.000', 'SENT', 'MESSAGE'),
(458, 7, 1, 'dgsgfdfg', '2024-03-23 14:30:37.000', 'SENT', 'MESSAGE'),
(459, 7, 1, 'dfgdfgs', '2024-03-23 14:30:47.000', 'SENT', 'MESSAGE'),
(460, 7, 1, 'sdfgdf[g[', '2024-03-23 14:31:15.000', 'SENT', 'MESSAGE'),
(461, 7, 1, 'dsfgsdfg', '2024-03-23 14:31:36.000', 'SENT', 'MESSAGE'),
(462, 7, 1, 'fds[sf[dsdf[', '2024-03-23 14:32:06.000', 'SENT', 'MESSAGE'),
(463, 7, 1, 'gdfgfd', '2024-03-23 14:32:24.000', 'SENT', 'MESSAGE'),
(464, 7, 1, 'dfgdfg', '2024-03-23 14:32:46.000', 'SENT', 'MESSAGE'),
(465, 7, 1, 'sdfsdf', '2024-03-23 14:33:03.000', 'SENT', 'MESSAGE'),
(466, 7, 1, 'sdfsdf', '2024-03-23 14:33:20.000', 'SENT', 'MESSAGE'),
(467, 7, 1, 'aleee', '2024-03-23 14:33:37.000', 'SENT', 'MESSAGE'),
(468, 7, 1, 'sdfdsffdgg', '2024-03-23 14:33:55.000', 'SENT', 'MESSAGE'),
(469, 7, 1, 'gdfsgsdfg', '2024-03-23 14:34:54.000', 'SENT', 'MESSAGE'),
(470, 7, 1, 'gfdgdf', '2024-03-23 14:35:45.000', 'SENT', 'MESSAGE'),
(471, 7, 1, 'gfdgdfg', '2024-03-23 14:35:54.000', 'SENT', 'MESSAGE'),
(472, 7, 1, 'dsfs[df', '2024-03-23 14:36:25.000', 'SENT', 'MESSAGE'),
(473, 7, 1, 'dfgdf', '2024-03-23 14:36:52.000', 'SENT', 'MESSAGE'),
(474, 7, 1, 'fgdsfds', '2024-03-23 14:37:26.000', 'SENT', 'MESSAGE'),
(475, 7, 1, 'sdfgdfsg', '2024-03-23 14:37:29.000', 'SENT', 'MESSAGE'),
(476, 7, 1, 'sdsf[sdf[sdf[sdf', '2024-03-23 14:38:28.000', 'SENT', 'MESSAGE'),
(477, 7, 1, 'sdfgdfg', '2024-03-23 14:39:49.000', 'SENT', 'MESSAGE'),
(478, 8, 2, 'dfg', '2024-03-23 14:39:51.000', 'SENT', 'MESSAGE'),
(479, 7, 1, 'df[sdf[dfs[', '2024-03-23 14:40:44.000', 'SENT', 'MESSAGE'),
(480, 8, 2, 'fghfg', '2024-03-23 14:40:47.000', 'SENT', 'MESSAGE'),
(481, 7, 1, 'sdfg', '2024-03-23 14:40:59.000', 'SENT', 'MESSAGE'),
(482, 7, 1, 'dfgfd', '2024-03-23 14:41:02.000', 'SENT', 'MESSAGE'),
(483, 7, 1, 'dfgdfsg', '2024-03-23 14:41:41.000', 'SENT', 'MESSAGE'),
(484, 8, 2, 'sdfgdfg', '2024-03-23 14:41:45.000', 'SENT', 'MESSAGE'),
(485, 8, 2, 'sdfgdfg', '2024-03-23 14:42:05.000', 'SENT', 'MESSAGE'),
(486, 8, 2, 'dfg', '2024-03-23 14:42:57.000', 'SENT', 'MESSAGE'),
(487, 8, 2, 'sdfg', '2024-03-23 14:43:22.000', 'SENT', 'MESSAGE'),
(488, 8, 2, 'cvbcvb', '2024-03-23 14:43:39.000', 'SENT', 'MESSAGE'),
(489, 8, 2, 'sdfgsdfg', '2024-03-23 14:43:55.000', 'SENT', 'MESSAGE'),
(490, 8, 2, 'sdfgdsfg', '2024-03-23 14:44:12.000', 'SENT', 'MESSAGE'),
(491, 8, 2, 'sdfgsdfg', '2024-03-23 14:44:50.000', 'SENT', 'MESSAGE'),
(492, 8, 2, 'sdfg', '2024-03-23 14:44:59.000', 'SENT', 'MESSAGE'),
(493, 8, 2, 'dsfgdsfg', '2024-03-23 14:45:35.000', 'SENT', 'MESSAGE'),
(494, 8, 2, 'dsfg', '2024-03-23 14:45:43.000', 'SENT', 'MESSAGE'),
(495, 8, 2, 'sdfg', '2024-03-23 14:45:52.000', 'SENT', 'MESSAGE'),
(496, 8, 2, 'sdfg', '2024-03-23 14:46:01.000', 'SENT', 'MESSAGE'),
(497, 8, 2, 'sdfg', '2024-03-23 14:46:17.000', 'SENT', 'MESSAGE'),
(498, 8, 2, 'sdfg', '2024-03-23 14:46:34.000', 'SENT', 'MESSAGE'),
(499, 8, 2, 'gsdfg', '2024-03-23 14:46:45.000', 'SENT', 'MESSAGE'),
(500, 7, 1, 'dfsgdf', '2024-03-23 14:49:55.000', 'SENT', 'MESSAGE'),
(501, 7, 1, 'dsfg', '2024-03-23 14:50:56.000', 'SENT', 'MESSAGE'),
(502, 7, 1, 'asdf', '2024-03-23 14:52:02.000', 'SENT', 'MESSAGE'),
(503, 7, 1, 'sdfsd', '2024-03-23 14:52:26.000', 'SENT', 'MESSAGE'),
(504, 7, 1, 'fasdfsdf', '2024-03-23 14:53:04.000', 'SENT', 'MESSAGE'),
(505, 7, 1, 'asdf', '2024-03-23 14:53:55.000', 'SENT', 'MESSAGE'),
(506, 8, 2, 'asdf', '2024-03-23 14:54:31.000', 'SENT', 'MESSAGE'),
(507, 7, 1, 'asdf', '2024-03-23 14:54:35.000', 'SENT', 'MESSAGE'),
(508, 7, 1, 'asdf', '2024-03-23 14:54:47.000', 'SENT', 'MESSAGE'),
(509, 8, 2, 'sdf', '2024-03-23 14:54:52.000', 'SENT', 'MESSAGE'),
(510, 8, 2, 'sdf', '2024-03-23 14:54:59.000', 'SENT', 'MESSAGE'),
(511, 8, 2, 'sadf', '2024-03-23 14:55:06.000', 'SENT', 'MESSAGE'),
(512, 8, 2, 'sdfsd', '2024-03-23 14:55:18.000', 'SENT', 'MESSAGE'),
(513, 8, 2, 'sdf', '2024-03-23 14:56:11.000', 'SENT', 'MESSAGE'),
(514, 8, 2, 'sdfsdf', '2024-03-23 14:56:56.000', 'SENT', 'MESSAGE'),
(515, 8, 2, 'dfgdfg', '2024-03-23 14:57:02.000', 'SENT', 'MESSAGE'),
(516, 8, 2, 'dfg', '2024-03-23 14:57:41.000', 'SENT', 'MESSAGE'),
(517, 8, 2, 'sdff', '2024-03-23 14:58:40.000', 'SENT', 'MESSAGE'),
(518, 8, 2, 'sdf', '2024-03-23 14:59:07.000', 'SENT', 'MESSAGE'),
(519, 8, 2, 'dfg', '2024-03-23 14:59:16.000', 'SENT', 'MESSAGE'),
(520, 8, 2, 'sdf', '2024-03-23 14:59:24.000', 'SENT', 'MESSAGE'),
(521, 8, 2, 'sdf', '2024-03-23 14:59:43.000', 'SENT', 'MESSAGE'),
(522, 8, 2, 'df', '2024-03-23 15:00:15.000', 'SENT', 'MESSAGE'),
(523, 8, 2, 'dfgdfg', '2024-03-23 15:00:45.000', 'SENT', 'MESSAGE'),
(524, 7, 1, 'sadfsdf', '2024-03-23 15:01:05.000', 'SENT', 'MESSAGE'),
(525, 8, 2, 'sdf', '2024-03-23 15:01:07.000', 'SENT', 'MESSAGE'),
(526, 8, 2, 'dfgdfg', '2024-03-23 15:01:29.000', 'SENT', 'MESSAGE'),
(527, 8, 2, 'dfgdgf', '2024-03-23 15:01:54.000', 'SENT', 'MESSAGE'),
(528, 8, 2, 'dfg', '2024-03-23 15:02:11.000', 'SENT', 'MESSAGE'),
(529, 8, 2, 'dfg', '2024-03-23 15:02:20.000', 'SENT', 'MESSAGE'),
(530, 8, 2, 'dsfg', '2024-03-23 15:02:48.000', 'SENT', 'MESSAGE'),
(531, 8, 2, 'jkl', '2024-03-23 15:02:56.000', 'SENT', 'MESSAGE'),
(532, 8, 2, 'dfg', '2024-03-23 15:03:19.000', 'SENT', 'MESSAGE'),
(533, 8, 2, 'asdfsdf', '2024-03-23 15:03:45.000', 'SENT', 'MESSAGE'),
(534, 8, 2, 'sdf', '2024-03-23 15:04:20.000', 'SENT', 'MESSAGE'),
(535, 8, 2, 'DFGDFG', '2024-03-23 15:04:42.000', 'SENT', 'MESSAGE'),
(536, 8, 2, 'FGH', '2024-03-23 15:04:52.000', 'SENT', 'MESSAGE'),
(537, 8, 2, 'GFH', '2024-03-23 15:15:15.000', 'SENT', 'MESSAGE'),
(538, 7, 1, 'DFG', '2024-03-23 15:15:17.000', 'SENT', 'MESSAGE'),
(539, 8, 2, 'sdfg', '2024-03-23 15:15:40.000', 'SENT', 'MESSAGE'),
(540, 8, 2, 'dfg', '2024-03-23 15:16:05.000', 'SENT', 'MESSAGE'),
(541, 8, 2, 'dfg', '2024-03-23 15:16:59.000', 'SENT', 'MESSAGE'),
(542, 8, 2, 'dfg', '2024-03-23 15:17:20.000', 'SENT', 'MESSAGE'),
(543, 8, 2, 'dfg', '2024-03-23 15:19:22.000', 'SENT', 'MESSAGE'),
(544, 7, 1, 'dfgdfsgdfg', '2024-03-23 15:28:46.000', 'SENT', 'MESSAGE'),
(545, 8, 2, 'dfgsdfgdfg', '2024-03-23 15:28:50.000', 'SENT', 'MESSAGE'),
(546, 8, 2, 'dfgdfs', '2024-03-23 15:29:36.000', 'SENT', 'MESSAGE'),
(547, 8, 2, 'sdfgdfg', '2024-03-23 15:29:47.000', 'SENT', 'MESSAGE'),
(548, 7, 1, 'dfg', '2024-03-23 15:30:35.000', 'SENT', 'MESSAGE'),
(549, 7, 1, 'dsfg', '2024-03-23 15:31:14.000', 'SENT', 'MESSAGE'),
(550, 7, 1, 'dfg', '2024-03-23 15:31:25.000', 'SENT', 'MESSAGE'),
(551, 7, 1, 'dfg', '2024-03-23 15:32:02.000', 'SENT', 'MESSAGE'),
(552, 7, 1, 'dfg', '2024-03-23 15:32:12.000', 'SENT', 'MESSAGE'),
(553, 7, 1, 'dfg', '2024-03-23 15:32:56.000', 'SENT', 'MESSAGE'),
(554, 7, 1, 'fdgh', '2024-03-23 15:33:09.000', 'SENT', 'MESSAGE'),
(555, 7, 1, 'dfg', '2024-03-23 15:33:37.000', 'SENT', 'MESSAGE'),
(556, 8, 2, 'dfgdsfg', '2024-03-23 15:33:41.000', 'SENT', 'MESSAGE'),
(557, 7, 1, 'dfg', '2024-03-23 15:40:36.000', 'SENT', 'MESSAGE'),
(558, 7, 1, 'dsfg', '2024-03-23 15:41:01.000', 'SENT', 'MESSAGE'),
(559, 7, 1, 'sdf', '2024-03-23 15:41:16.000', 'SENT', 'MESSAGE'),
(560, 7, 1, 'sdf', '2024-03-23 15:41:54.000', 'SENT', 'MESSAGE'),
(561, 7, 1, 'sdf', '2024-03-23 15:42:02.000', 'SENT', 'MESSAGE'),
(562, 8, 2, 'sdf', '2024-03-23 15:42:05.000', 'SENT', 'MESSAGE'),
(563, 8, 2, 'dfg', '2024-03-23 15:42:16.000', 'SENT', 'MESSAGE'),
(564, 7, 1, 'dfg', '2024-03-23 15:42:18.000', 'SENT', 'MESSAGE'),
(565, 8, 2, 'dfg', '2024-03-23 15:43:00.000', 'SENT', 'MESSAGE'),
(566, 7, 1, 'gfd', '2024-03-23 15:43:44.000', 'SENT', 'MESSAGE'),
(567, 7, 1, 'fgh', '2024-03-23 15:43:50.000', 'SENT', 'MESSAGE'),
(568, 7, 1, 'dfg', '2024-03-23 15:44:12.000', 'SENT', 'MESSAGE'),
(569, 8, 2, 'dfg', '2024-03-23 15:44:19.000', 'SENT', 'MESSAGE'),
(570, 7, 1, 'sdfg', '2024-03-23 15:45:14.000', 'SENT', 'MESSAGE'),
(571, 8, 2, 'dfg', '2024-03-23 15:45:19.000', 'SENT', 'MESSAGE'),
(572, 7, 1, 'sdfd', '2024-03-23 15:45:43.000', 'SENT', 'MESSAGE'),
(573, 7, 1, 'sdf', '2024-03-23 15:45:51.000', 'SENT', 'MESSAGE'),
(574, 8, 2, 'sdf', '2024-03-23 15:45:54.000', 'SENT', 'MESSAGE'),
(575, 7, 1, 'fg', '2024-03-23 15:46:50.000', 'SENT', 'MESSAGE'),
(576, 7, 1, 'ahahahahah', '2024-03-23 15:47:37.000', 'SENT', 'MESSAGE'),
(577, 8, 2, 'ashhdshadshds', '2024-03-23 15:47:41.000', 'SENT', 'MESSAGE'),
(578, 7, 1, 'sd[a[asdfs[fd', '2024-03-23 15:49:04.000', 'SENT', 'MESSAGE'),
(579, 7, 2, 'ale', '2024-03-23 15:49:08.000', 'SENT', 'MESSAGE'),
(580, 7, 2, 'ebobo', '2024-03-23 15:49:10.000', 'SENT', 'MESSAGE'),
(581, 7, 2, 'zzavali ti uje', '2024-03-23 15:49:14.000', 'SENT', 'MESSAGE'),
(582, 7, 2, 'sdaf[asdf[[dfsa', '2024-03-23 15:49:32.000', 'SENT', 'MESSAGE'),
(583, 7, 2, 'sdfasfd[df[', '2024-03-23 15:49:35.000', 'SENT', 'MESSAGE'),
(584, 7, 2, 'ale', '2024-03-23 15:49:42.000', 'SENT', 'MESSAGE'),
(585, 7, 2, 'dfg;dflkgbvdlfcvblgdcbd', '2024-03-23 15:49:44.000', 'SENT', 'MESSAGE'),
(586, 7, 2, 'bvcgdf[g[dgf[]dfg[]df[gs', '2024-03-23 15:49:45.000', 'SENT', 'MESSAGE'),
(587, 7, 2, ']fg[fg][s][gf][fg][gf][gfs', '2024-03-23 15:49:47.000', 'SENT', 'MESSAGE'),
(591, 7, 2, 'ale?', '2024-03-23 16:02:01.000', 'SENT', 'MESSAGE'),
(592, 8, 1, 'dsfgdfg', '2024-03-23 16:02:34.000', 'SENT', 'MESSAGE'),
(593, 7, 2, 'dsfgdfg', '2024-03-23 16:02:37.000', 'SENT', 'MESSAGE'),
(594, 7, 2, 'dfgdfg', '2024-03-23 16:02:52.000', 'SENT', 'MESSAGE'),
(595, 7, 2, 'dfgdsfg', '2024-03-23 16:03:07.000', 'SENT', 'MESSAGE'),
(596, 8, 2, 'da', '2024-03-23 16:03:13.000', 'SENT', 'MESSAGE'),
(597, 8, 2, 'ti', '2024-03-23 16:03:13.000', 'SENT', 'MESSAGE'),
(598, 8, 2, 'zaebesh', '2024-03-23 16:03:15.000', 'SENT', 'MESSAGE'),
(599, 8, 2, 'uje', '2024-03-23 16:03:16.000', 'SENT', 'MESSAGE'),
(600, 8, 2, 'realno', '2024-03-23 16:03:17.000', 'SENT', 'MESSAGE'),
(601, 7, 2, 'da', '2024-03-23 16:03:20.000', 'SENT', 'MESSAGE'),
(602, 7, 2, 'sry', '2024-03-23 16:03:21.000', 'SENT', 'MESSAGE'),
(603, 7, 2, 'boje', '2024-03-23 16:03:22.000', 'SENT', 'MESSAGE'),
(604, 7, 2, 'dsfs', '2024-03-23 16:03:30.000', 'SENT', 'MESSAGE'),
(605, 7, 2, 'gdfgfd', '2024-03-23 16:06:58.000', 'SENT', 'MESSAGE'),
(606, 7, 2, 'sdfg', '2024-03-23 16:07:01.000', 'SENT', 'MESSAGE'),
(607, 8, 1, 'dsfsdf[', '2024-03-23 16:07:04.000', 'SENT', 'MESSAGE'),
(608, 7, 1, 'dfsgdfg', '2024-03-23 16:07:08.000', 'SENT', 'MESSAGE'),
(609, 8, 1, 'dfgdfg', '2024-03-23 16:07:12.000', 'SENT', 'MESSAGE'),
(610, 7, 1, 'dfgdfg', '2024-03-23 16:07:22.000', 'SENT', 'MESSAGE'),
(611, 7, 1, '?', '2024-03-23 16:07:31.000', 'SENT', 'MESSAGE'),
(612, 7, 1, 'dsfgdf', '2024-03-23 16:08:24.000', 'SENT', 'MESSAGE'),
(613, 8, 1, 'sdfgdfg', '2024-03-23 16:08:26.000', 'SENT', 'MESSAGE'),
(614, 8, 2, 'sdfgfdg', '2024-03-23 16:08:29.000', 'SENT', 'MESSAGE'),
(615, 8, 2, 'fghfgh', '2024-03-23 16:08:39.000', 'SENT', 'MESSAGE'),
(616, 7, 1, 'fghfghfgh', '2024-03-23 16:08:43.000', 'SENT', 'MESSAGE'),
(617, 7, 1, 'hfghfgh', '2024-03-23 16:09:35.000', 'SENT', 'MESSAGE'),
(618, 8, 2, 'fgdg', '2024-03-23 16:10:23.000', 'SENT', 'MESSAGE'),
(619, 7, 1, 'dsfgdfgsdfg', '2024-03-23 16:10:29.000', 'SENT', 'MESSAGE'),
(620, 7, 1, 'fghg', '2024-03-23 16:10:34.000', 'SENT', 'MESSAGE'),
(621, 7, 1, 'au?', '2024-03-23 16:10:40.000', 'SENT', 'MESSAGE'),
(622, 7, 1, 'hm', '2024-03-23 16:11:11.000', 'SENT', 'MESSAGE'),
(623, 7, 1, 'dfg', '2024-03-23 16:11:23.000', 'SENT', 'MESSAGE'),
(624, 7, 1, 'aaaaaaaaaaaaaaaaaa', '2024-03-23 16:11:33.000', 'SENT', 'MESSAGE'),
(625, 7, 1, 'heyy', '2024-03-23 16:20:48.000', 'SENT', 'MESSAGE'),
(626, 7, 1, 'heyy', '2024-03-23 16:20:56.000', 'SENT', 'MESSAGE'),
(627, 7, 1, '??', '2024-03-23 16:21:00.000', 'SENT', 'MESSAGE'),
(628, 7, 1, '?', '2024-03-23 16:21:05.000', 'SENT', 'MESSAGE'),
(629, 7, 1, 'ddddddddddddd', '2024-03-23 16:21:08.000', 'SENT', 'MESSAGE'),
(630, 7, 1, 'dddddddddddddddddddddsssssssssssssss', '2024-03-23 16:21:14.000', 'SENT', 'MESSAGE'),
(631, 7, 1, 'sdfasdfdsf', '2024-03-23 16:24:13.000', 'SENT', 'MESSAGE'),
(632, 7, 1, 'ghjghj', '2024-03-23 16:24:21.000', 'SENT', 'MESSAGE'),
(633, 7, 1, 'dfgsdfgsdf', '2024-03-23 16:24:23.000', 'SENT', 'MESSAGE'),
(634, 7, 1, 'gsdfgdsfbcvb.xcv.bx.cbvcvb', '2024-03-23 16:24:25.000', 'SENT', 'MESSAGE'),
(635, 7, 1, 'cvb[', '2024-03-23 16:24:26.000', 'SENT', 'MESSAGE'),
(636, 8, 1, 'sdfgdfg', '2024-03-23 16:24:30.000', 'SENT', 'MESSAGE'),
(637, 8, 1, '\\cvbx', '2024-03-23 16:24:31.000', 'SENT', 'MESSAGE'),
(638, 8, 1, '32', '2024-03-23 16:24:31.000', 'SENT', 'MESSAGE'),
(639, 8, 1, 'sdf', '2024-03-23 16:24:32.000', 'SENT', 'MESSAGE'),
(640, 8, 1, 'dfgsdfg', '2024-03-23 16:24:42.000', 'SENT', 'MESSAGE'),
(641, 8, 1, 'dsfg', '2024-03-23 16:24:42.000', 'SENT', 'MESSAGE'),
(642, 8, 1, 'cvbxcvb', '2024-03-23 16:24:43.000', 'SENT', 'MESSAGE'),
(643, 7, 2, 'dfs[f[sddf[as', '2024-03-23 16:24:47.000', 'SENT', 'MESSAGE'),
(644, 7, 2, 'sdafsdfasdfasdf[s[df', '2024-03-23 16:27:12.000', 'SENT', 'MESSAGE'),
(645, 7, 2, 'sdfgsdfg', '2024-03-23 16:27:24.000', 'SENT', 'MESSAGE'),
(646, 7, 2, 'sdfg', '2024-03-23 16:27:24.000', 'SENT', 'MESSAGE'),
(647, 7, 2, 'dsfg', '2024-03-23 16:27:24.000', 'SENT', 'MESSAGE'),
(648, 7, 2, 'ds', '2024-03-23 16:27:24.000', 'SENT', 'MESSAGE'),
(649, 7, 2, 'fg', '2024-03-23 16:27:25.000', 'SENT', 'MESSAGE'),
(650, 7, 2, 'dsfg', '2024-03-23 16:27:25.000', 'SENT', 'MESSAGE'),
(651, 7, 2, 'gd', '2024-03-23 16:27:25.000', 'SENT', 'MESSAGE'),
(652, 7, 2, 'g', '2024-03-23 16:27:25.000', 'SENT', 'MESSAGE'),
(653, 7, 2, 'g', '2024-03-23 16:27:25.000', 'SENT', 'MESSAGE'),
(654, 7, 2, 'df', '2024-03-23 16:27:25.000', 'SENT', 'MESSAGE'),
(655, 7, 2, 'dfg', '2024-03-23 16:27:26.000', 'SENT', 'MESSAGE'),
(656, 7, 2, 'fg', '2024-03-23 16:27:26.000', 'SENT', 'MESSAGE'),
(657, 7, 2, 'gdf', '2024-03-23 16:27:26.000', 'SENT', 'MESSAGE'),
(658, 7, 2, 'fgsd', '2024-03-23 16:27:26.000', 'SENT', 'MESSAGE'),
(659, 7, 2, 'gdfs', '2024-03-23 16:27:26.000', 'SENT', 'MESSAGE'),
(660, 7, 2, 'cxvbcvbcvb', '2024-03-23 16:27:30.000', 'SENT', 'MESSAGE'),
(661, 7, 2, 'c;vb\\;', '2024-03-23 16:27:31.000', 'SENT', 'MESSAGE'),
(662, 7, 2, 'cv\\;', '2024-03-23 16:27:31.000', 'SENT', 'MESSAGE'),
(663, 7, 2, 'b\\;', '2024-03-23 16:27:31.000', 'SENT', 'MESSAGE'),
(664, 7, 2, 'cv;\\', '2024-03-23 16:27:31.000', 'SENT', 'MESSAGE'),
(665, 7, 2, 'b;\\', '2024-03-23 16:27:31.000', 'SENT', 'MESSAGE'),
(666, 7, 2, 'cv;\\', '2024-03-23 16:27:32.000', 'SENT', 'MESSAGE'),
(667, 7, 2, 'b;\\', '2024-03-23 16:27:32.000', 'SENT', 'MESSAGE'),
(668, 7, 2, 'cvb;\\cv;\\b\\;cv;\\bc;\\v', '2024-03-23 16:27:33.000', 'SENT', 'MESSAGE'),
(669, 7, 2, 'b;\\', '2024-03-23 16:27:33.000', 'SENT', 'MESSAGE'),
(670, 7, 2, 'cv;\\', '2024-03-23 16:27:33.000', 'SENT', 'MESSAGE'),
(671, 7, 2, 'b;\\', '2024-03-23 16:27:33.000', 'SENT', 'MESSAGE'),
(672, 7, 2, 'cv;\\', '2024-03-23 16:27:34.000', 'SENT', 'MESSAGE'),
(673, 7, 2, 'b;\\', '2024-03-23 16:27:34.000', 'SENT', 'MESSAGE'),
(674, 7, 2, 'cv;\\', '2024-03-23 16:27:34.000', 'SENT', 'MESSAGE'),
(675, 7, 2, 'b\\;', '2024-03-23 16:27:34.000', 'SENT', 'MESSAGE'),
(676, 7, 2, 'cv;\\', '2024-03-23 16:27:34.000', 'SENT', 'MESSAGE'),
(677, 7, 2, 'bv;\\c\\;b\\;cv;\\', '2024-03-23 16:27:35.000', 'SENT', 'MESSAGE'),
(678, 7, 2, 'b\\;cv\\;b', '2024-03-23 16:27:35.000', 'SENT', 'MESSAGE'),
(688, 8, 1, 'dfgdfg', '2024-03-23 16:29:44.000', 'SENT', 'MESSAGE'),
(689, 7, 1, 'sdfgdf', '2024-03-23 16:29:46.000', 'SENT', 'MESSAGE'),
(690, 7, 1, 'sdfasdf[sdaf[sd[f[', '2024-03-23 16:29:57.000', 'SENT', 'MESSAGE'),
(691, 7, 1, 'sadfsdfsd', '2024-03-23 16:30:01.000', 'SENT', 'MESSAGE'),
(692, 7, 1, 'dfgdfg', '2024-03-23 16:30:09.000', 'SENT', 'MESSAGE'),
(693, 7, 1, 'sdfsdf', '2024-03-23 16:30:11.000', 'SENT', 'MESSAGE'),
(694, 7, 2, 'zxvcxcvxcv', '2024-03-23 16:30:26.000', 'SENT', 'MESSAGE'),
(695, 7, 2, 'gfhjfghj', '2024-03-23 16:32:15.000', 'SENT', 'MESSAGE'),
(696, 7, 2, 'ddddddddddddddddddddddd', '2024-03-23 16:32:43.000', 'SENT', 'MESSAGE'),
(697, 7, 2, '[dfssd[fsdf[dfs[dfs[', '2024-03-23 16:35:51.000', 'SENT', 'MESSAGE'),
(698, 8, 2, 'dfgfdg', '2024-03-23 16:36:02.000', 'SENT', 'MESSAGE'),
(699, 7, 2, 'dddddddddddddddddddd', '2024-03-23 16:37:43.000', 'SENT', 'MESSAGE'),
(700, 8, 2, 'sdfgsdfg', '2024-03-23 16:41:20.000', 'SENT', 'MESSAGE'),
(701, 7, 2, 'dfgdfg', '2024-03-23 16:41:39.000', 'SENT', 'MESSAGE'),
(702, 7, 2, 'dddddddddddddddd', '2024-03-23 16:44:10.000', 'SENT', 'MESSAGE'),
(703, 7, 2, 'sdfasdf', '2024-03-23 16:44:12.000', 'SENT', 'MESSAGE'),
(704, 8, 2, 'dfgdfg', '2024-03-23 16:54:10.000', 'SENT', 'MESSAGE'),
(705, 8, 2, 'dddddddddddddddddddddddddddd', '2024-03-23 16:54:13.000', 'SENT', 'MESSAGE'),
(706, 8, 2, 'dfgdsfgdsfgdfg', '2024-03-23 16:55:27.000', 'SENT', 'MESSAGE'),
(707, 8, 2, 'sdfgdsfgdfg', '2024-03-23 16:55:40.000', 'SENT', 'MESSAGE'),
(708, 8, 2, 'sdssssssssssssssssssssssssssssss', '2024-03-23 16:55:42.000', 'SENT', 'MESSAGE'),
(709, 8, 2, '???????????????????????', '2024-03-23 16:58:18.000', 'SENT', 'MESSAGE'),
(710, 8, 2, 'nigga🗣😈', '2024-03-23 17:01:08.000', 'SENT', 'MESSAGE'),
(711, 8, 2, '🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈', '2024-03-23 17:02:10.000', 'SENT', 'MESSAGE'),
(712, 8, 2, '🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈', '2024-03-23 17:02:15.000', 'SENT', 'MESSAGE'),
(713, 8, 2, '🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈', '2024-03-23 17:02:24.000', 'SENT', 'MESSAGE'),
(714, 8, 2, '🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈', '2024-03-23 17:03:04.000', 'SENT', 'MESSAGE'),
(715, 7, 2, '<div>             <input                 type=\'text\'      😈😈😈😈😈😈😡🗣💜           value={messageContent}                 onChange={handleMessageChange}                 maxLength={1024} // Set the maximum length of the input field             />             <p>{messageContent.length}/1024 characters</p>         </div><div>             <input                 type=\'text\'                 value={messageContent}                 onChange={handleMessageChange}                 maxLength={1024} // Set the maximum length of the input field             />             <p>{messageContent.length}/1024 characters</p>         </div><div>             <input                 type=\'text\'                 value={messageContent}                 onChange={handleMessageChange}                 maxLength={1024} // Set the maximum length of the input field             />             <p>{messageContent.length}/1024 characters</p>         </div>sssssssssssssssssssssssssssssssssssssssssssssssssssss', '2024-03-23 17:07:22.000', 'SENT', 'MESSAGE');
INSERT INTO `chat_messages` (`id`, `sender_id`, `chat_id`, `content`, `timestamp`, `status`, `type`) VALUES
(716, 7, 2, '🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈', '2024-03-23 17:07:55.000', 'SENT', 'MESSAGE'),
(717, 7, 2, '🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣', '2024-03-23 17:07:59.000', 'SENT', 'MESSAGE'),
(718, 7, 2, '🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈🗣😈', '2024-03-23 17:08:01.000', 'SENT', 'MESSAGE'),
(719, 8, 2, 'fdsfsdf', '2024-03-23 17:27:44.000', 'SENT', 'MESSAGE'),
(720, 7, 2, 'sdfs', '2024-03-23 17:27:49.000', 'SENT', 'MESSAGE'),
(721, 7, 2, 'fghdfghfgh', '2024-03-23 17:27:50.000', 'SENT', 'MESSAGE'),
(722, 8, 2, 'sdfgsdfgsdfg', '2024-03-23 17:30:10.000', 'SENT', 'MESSAGE'),
(723, 7, 1, 'dsfgdfgdfgsvcb', '2024-03-23 17:30:15.000', 'SENT', 'MESSAGE'),
(724, 7, 1, 'xcvbcvbdfsg', '2024-03-23 17:30:16.000', 'SENT', 'MESSAGE'),
(725, 7, 1, 'dfgdfg', '2024-03-23 17:30:22.000', 'SENT', 'MESSAGE'),
(726, 7, 1, 'cvxbcv;b;cv;b;d[fsg;df[gsdf', '2024-03-23 17:30:25.000', 'SENT', 'MESSAGE'),
(727, 8, 1, 'looool', '2024-03-23 17:30:28.000', 'SENT', 'MESSAGE'),
(728, 8, 1, '{\"url\":\"https://media.tenor.com/MokRe9FN_SYAAAAM/holi-happy-holi-golmaal.gif\",\"width\":220,\"height\":124}', '2024-03-25 16:40:33.000', 'SENT', 'MESSAGE'),
(729, 8, 1, '{\"url\":\"https://media.tenor.com/cUmoTFHuZNoAAAAM/taylor-swift-taylor-swift-eras-tour.gif\",\"width\":165,\"height\":217}', '2024-03-25 18:45:01.000', 'SENT', 'MESSAGE'),
(730, 7, 2, '{\"url\":\"https://media.tenor.com/MokRe9FN_SYAAAAM/holi-happy-holi-golmaal.gif\",\"width\":220,\"height\":124}', '2024-03-25 20:25:44.000', 'SENT', 'MESSAGE'),
(731, 8, 1, 'https://media.tenor.com/mEo9ggzuUP0AAAAC/how-are.gif', '2024-03-25 21:39:04.000', 'SENT', 'MESSAGE'),
(732, 8, 1, 'https://media.tenor.com/5lLcKZgmIhgAAAAC/american-psycho-patrick-bateman.gif', '2024-03-25 21:41:21.000', 'SENT', 'MESSAGE'),
(733, 8, 1, 'https://media.tenor.com/Py5fYTbsfakAAAAC/patrick-bateman.gif', '2024-03-25 21:42:06.000', 'SENT', 'MESSAGE'),
(734, 8, 1, 'https://media.tenor.com/Z16slmCnZFcAAAAC/stare-christian-bale.gif', '2024-03-25 21:42:15.000', 'SENT', 'MESSAGE'),
(735, 8, 1, 'https://media.tenor.com/cKkNLp8vVBEAAAAC/patrick-bateman-american-psycho.gif', '2024-03-25 21:44:23.000', 'SENT', 'MESSAGE'),
(736, 8, 1, 'https://media.tenor.com/nogVc6m0iYUAAAAC/american-psycho-christian-bale.gif', '2024-03-25 21:44:32.000', 'SENT', 'MESSAGE'),
(737, 8, 1, 'https://media.tenor.com/PLL_Hgq-ezsAAAAC/american-psycho-impressive.gif', '2024-03-25 21:45:09.000', 'SENT', 'MESSAGE'),
(738, 8, 1, 'https://media.tenor.com/CwKLkG69yfMAAAAC/patrick-bateman-american-psycho.gif', '2024-03-25 21:45:11.000', 'SENT', 'MESSAGE'),
(739, 8, 1, 'https://media.tenor.com/Wi9uNKlPjZ0AAAAC/american-psycho-smoke.gif', '2024-03-25 21:45:15.000', 'SENT', 'MESSAGE'),
(740, 8, 1, 'https://media.tenor.com/cUmoTFHuZNoAAAAC/taylor-swift-taylor-swift-eras-tour.gif', '2024-03-25 21:49:39.000', 'SENT', 'MESSAGE'),
(741, 8, 1, 'https://media.tenor.com/9blGWJaDlI4AAAAC/%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82-%D0%B7%D0%B0%D0%B9%D1%87%D0%B8%D0%BA.gif', '2024-03-25 21:49:50.000', 'SENT', 'MESSAGE'),
(742, 7, 1, 'https://media.tenor.com/eL7FTWTPNzIAAAAC/trying-not-to-say-the-nword-spongebob.gif', '2024-03-26 20:45:34.000', 'SENT', 'MESSAGE'),
(743, 7, 1, 'https://media.tenor.com/MLhutFZkS7EAAAAC/hyperventilate-cant-breathe.gif', '2024-03-26 20:58:18.000', 'SENT', 'MESSAGE'),
(744, 7, 1, 'https://media.tenor.com/qy_WcGdRzfgAAAAC/xluna-high-five.gif', '2024-03-26 20:58:24.000', 'SENT', 'MESSAGE'),
(745, 7, 1, 'dfgsdfdslfslfksdlk https://media.tenor.com/MLhutFZkS7EAAAAC/hyperventilate-cant-breathe.gif', '2024-03-26 20:58:39.000', 'SENT', 'MESSAGE'),
(746, 8, 2, 'cvbcxcbv', '2024-03-26 21:10:18.000', 'SENT', 'MESSAGE'),
(747, 8, 1, 'cxbvvbcvb', '2024-03-26 21:10:29.000', 'SENT', 'MESSAGE'),
(748, 8, 1, 'https://media.tenor.com/nkAY5GFUw5UAAAAC/good-morning.gif', '2024-03-26 21:10:31.000', 'SENT', 'MESSAGE'),
(749, 8, 1, 'https://media.tenor.com/zhqnRnUO5LwAAAAC/sending-prayers-vibes.gif', '2024-03-26 21:11:03.000', 'SENT', 'MESSAGE'),
(750, 7, 1, 'https://media.tenor.com/ZaEZVqSQ9jEAAAAC/i-am-here-to-wish-you-happy-tuesday.gif', '2024-03-26 21:12:35.000', 'SENT', 'MESSAGE'),
(751, 8, 1, 'fghgfh https://media.tenor.com/nkAY5GFUw5UAAAAC/good-morning.gif hgfhgfhf', '2024-03-26 21:17:45.000', 'SENT', 'MESSAGE'),
(752, 8, 1, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fnature%2F&psig=AOvVaw0voAbRZYPClRBy4GyzAKSp&ust=1711574310452000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCOjOr6jtkoUDFQAAAAAdAAAAABAE', '2024-03-26 21:18:38.000', 'SENT', 'MESSAGE'),
(753, 8, 1, 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm tofhgfh estfghfgh tfghgfhi nahfghfghui fghfghfghgi', '2024-03-26 21:22:01.000', 'SENT', 'MESSAGE'),
(754, 8, 1, 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg', '2024-03-26 21:22:28.000', 'SENT', 'MESSAGE'),
(755, 8, 1, 'look https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg great?', '2024-03-26 21:22:38.000', 'SENT', 'MESSAGE'),
(756, 8, 1, 'dsgdfgd', '2024-03-26 21:25:00.000', 'SENT', 'MESSAGE'),
(757, 8, 1, 'dfgdfg', '2024-03-26 21:25:25.000', 'SENT', 'MESSAGE'),
(758, 8, 1, 'dfdfsgdfg', '2024-03-26 21:25:58.000', 'SENT', 'MESSAGE'),
(759, 8, 1, 'https://media.tenor.com/nkAY5GFUw5UAAAAC/good-morning.gif', '2024-03-26 21:39:58.000', 'SENT', 'MESSAGE'),
(760, 8, 1, 'a', '2024-03-26 21:40:00.000', 'SENT', 'MESSAGE'),
(761, 8, 1, 's', '2024-03-26 21:40:00.000', 'SENT', 'MESSAGE'),
(762, 8, 1, 'd', '2024-03-26 21:40:00.000', 'SENT', 'MESSAGE'),
(763, 8, 1, 'a', '2024-03-26 21:40:00.000', 'SENT', 'MESSAGE'),
(764, 8, 1, 'd', '2024-03-26 21:40:01.000', 'SENT', 'MESSAGE'),
(765, 8, 1, 's', '2024-03-26 21:40:01.000', 'SENT', 'MESSAGE'),
(766, 7, 1, 'sadfsfds[fsd[f', '2024-03-26 21:43:31.000', 'SENT', 'MESSAGE'),
(767, 7, 1, 'dfgggfsgs', '2024-03-26 21:43:42.000', 'SENT', 'MESSAGE'),
(768, 7, 1, 'dfgdfgfdg', '2024-03-26 21:43:50.000', 'SENT', 'MESSAGE'),
(769, 7, 1, 'dsds', '2024-03-26 21:43:55.000', 'SENT', 'MESSAGE'),
(770, 7, 1, 'asdd', '2024-03-26 21:44:07.000', 'SENT', 'MESSAGE'),
(771, 7, 1, 'https://media.tenor.com/nkAY5GFUw5UAAAAC/good-morning.gif', '2024-03-26 21:45:07.000', 'SENT', 'MESSAGE'),
(772, 7, 1, 'fdgfdg', '2024-03-26 21:46:59.000', 'SENT', 'MESSAGE'),
(773, 7, 1, 'hjgkhjk', '2024-03-26 21:47:02.000', 'SENT', 'MESSAGE'),
(774, 7, 1, 'dsfgdfg', '2024-03-26 21:47:19.000', 'SENT', 'MESSAGE'),
(775, 7, 2, 'hey', '2024-03-27 17:02:46.000', 'SENT', 'MESSAGE'),
(776, 7, 2, 'https://media.tenor.com/0KZbghSyUp4AAAAC/cardi-b-cardi.gif', '2024-03-27 17:02:53.000', 'SENT', 'MESSAGE'),
(777, 7, 1, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 17:03:08.000', 'SENT', 'MESSAGE'),
(778, 7, 2, 'https://media.tenor.com/XYPSFvI2MaIAAAAC/hahahahah-gahahahaha.gif', '2024-03-27 17:09:01.000', 'SENT', 'MESSAGE'),
(779, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 17:45:49.000', 'SENT', 'MESSAGE'),
(780, 7, 2, 'h', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(781, 7, 2, 'h', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(782, 7, 2, 'g', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(783, 7, 2, 'g', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(784, 7, 2, 'j', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(785, 7, 2, 'j', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(786, 7, 2, 'f', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(787, 7, 2, 'f', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(788, 7, 2, 'g', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(789, 7, 2, 'g', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(790, 7, 2, 'h', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(791, 7, 2, 'h', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(792, 7, 2, 'j', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(793, 7, 2, 'j', '2024-03-27 17:49:24.000', 'SENT', 'MESSAGE'),
(794, 7, 2, 'fghdfghdfghfgh', '2024-03-27 17:50:57.000', 'SENT', 'MESSAGE'),
(795, 7, 2, 'dfghgfh', '2024-03-27 17:51:14.000', 'SENT', 'MESSAGE'),
(796, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 17:56:36.000', 'SENT', 'MESSAGE'),
(797, 7, 2, 'https://media.tenor.com/Fy0hkZaMgakAAAAC/nah-im-just-kidding-jk.gif', '2024-03-27 17:56:42.000', 'SENT', 'MESSAGE'),
(798, 7, 2, 'sdfgsdfgdfgdfg', '2024-03-27 17:57:38.000', 'SENT', 'MESSAGE'),
(799, 7, 2, 'dfgdfg', '2024-03-27 17:57:40.000', 'SENT', 'MESSAGE'),
(800, 7, 2, 'dsfgdfgdfglkkldfsgkdlfslkgfd', '2024-03-27 17:57:42.000', 'SENT', 'MESSAGE'),
(801, 7, 2, 'https://media.tenor.com/0FAowMLCp2oAAAAC/good-fine.gif', '2024-03-27 17:57:46.000', 'SENT', 'MESSAGE'),
(802, 7, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 18:00:19.000', 'SENT', 'MESSAGE'),
(803, 7, 2, 'https://media.tenor.com/qy_WcGdRzfgAAAAC/xluna-high-five.gif', '2024-03-27 18:00:22.000', 'SENT', 'MESSAGE'),
(804, 7, 2, 'sdfgsgdf;ldfgl;dgfldgf', '2024-03-27 18:00:24.000', 'SENT', 'MESSAGE'),
(805, 8, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 18:00:43.000', 'SENT', 'MESSAGE'),
(806, 7, 2, 'https://media.tenor.com/JkMGlrjiG_cAAAAC/awesome-youre-awesome.gif', '2024-03-27 18:01:50.000', 'SENT', 'MESSAGE'),
(807, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 18:04:23.000', 'SENT', 'MESSAGE'),
(808, 8, 2, 'https://media.tenor.com/Fy0hkZaMgakAAAAC/nah-im-just-kidding-jk.gif', '2024-03-27 18:04:29.000', 'SENT', 'MESSAGE'),
(809, 7, 2, 'sdfgsdfg', '2024-03-27 18:04:46.000', 'SENT', 'MESSAGE'),
(810, 7, 2, 'dfgdfgdfgdfg', '2024-03-27 18:05:06.000', 'SENT', 'MESSAGE'),
(811, 8, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 18:40:55.000', 'SENT', 'MESSAGE'),
(812, 8, 2, 'https://media.tenor.com/Q_nnoR5sdYUAAAAC/wink-puppy.gif', '2024-03-27 18:41:55.000', 'SENT', 'MESSAGE'),
(813, 7, 2, 'https://media.tenor.com/0KZbghSyUp4AAAAC/cardi-b-cardi.gif', '2024-03-27 18:43:11.000', 'SENT', 'MESSAGE'),
(814, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 18:48:14.000', 'SENT', 'MESSAGE'),
(815, 7, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 18:48:48.000', 'SENT', 'MESSAGE'),
(816, 7, 2, 'fghfgh', '2024-03-27 18:49:25.000', 'SENT', 'MESSAGE'),
(817, 7, 2, 'https://media.tenor.com/YA_K69BSr8YAAAAC/peach-goma.gif', '2024-03-27 18:49:31.000', 'SENT', 'MESSAGE'),
(818, 7, 2, 'fghdfgh', '2024-03-27 18:50:44.000', 'SENT', 'MESSAGE'),
(819, 7, 2, 'dfgh', '2024-03-27 18:50:48.000', 'SENT', 'MESSAGE'),
(820, 7, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 18:51:55.000', 'SENT', 'MESSAGE'),
(821, 7, 2, 'fghdfgh', '2024-03-27 18:52:22.000', 'SENT', 'MESSAGE'),
(822, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 18:52:26.000', 'SENT', 'MESSAGE'),
(823, 7, 2, 'sdfgdsfsdf', '2024-03-27 18:52:46.000', 'SENT', 'MESSAGE'),
(824, 7, 2, 'dfgdfg', '2024-03-27 18:52:50.000', 'SENT', 'MESSAGE'),
(825, 7, 2, 'dfghdfgh', '2024-03-27 18:54:20.000', 'SENT', 'MESSAGE'),
(826, 7, 2, 'dfghdfgh', '2024-03-27 18:57:25.000', 'SENT', 'MESSAGE'),
(827, 7, 2, 'fgdhfgh', '2024-03-27 18:57:27.000', 'SENT', 'MESSAGE'),
(828, 7, 2, 'https://github.com/mak7ilenin/Skill-Shuffle/commit/8a172ea2d96f83e8b6ad890670b35d1c4cca11ba', '2024-03-27 18:57:42.000', 'SENT', 'MESSAGE'),
(829, 7, 2, 'https://github.com/mak7ilenin/Skill-Shuffle/commit/8a172ea2d96f83e8b6ad890670b35d1c4cca11ba', '2024-03-27 18:58:02.000', 'SENT', 'MESSAGE'),
(830, 7, 2, 'https://github.com/mak7ilenin/Skill-Shuffle/commit/8a172ea2d96f83e8b6ad890670b35d1c4cca11ba', '2024-03-27 18:59:00.000', 'SENT', 'MESSAGE'),
(831, 7, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 19:00:48.000', 'SENT', 'MESSAGE'),
(832, 7, 2, 'https://media.tenor.com/nNt9uv0uq1QAAAAC/animated-text.gif', '2024-03-27 19:00:52.000', 'SENT', 'MESSAGE'),
(833, 7, 2, 'https://media.tenor.com/Fy0hkZaMgakAAAAC/nah-im-just-kidding-jk.gif', '2024-03-27 19:01:07.000', 'SENT', 'MESSAGE'),
(834, 7, 2, 'gfhfgh', '2024-03-27 19:03:20.000', 'SENT', 'MESSAGE'),
(835, 7, 2, 'ghjfghj', '2024-03-27 19:03:24.000', 'SENT', 'MESSAGE'),
(836, 7, 2, 'gfhjfghj', '2024-03-27 19:03:26.000', 'SENT', 'MESSAGE'),
(837, 7, 2, 'sdf[adsf[afd[fsd[', '2024-03-27 19:03:29.000', 'SENT', 'MESSAGE'),
(838, 7, 2, 'sdfgsdfg', '2024-03-27 19:03:49.000', 'SENT', 'MESSAGE'),
(839, 7, 2, 'sdfgdfsg', '2024-03-27 19:03:51.000', 'SENT', 'MESSAGE'),
(840, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 19:03:54.000', 'SENT', 'MESSAGE'),
(841, 7, 2, 'sfd[adsf[sfd[fsd[', '2024-03-27 19:04:43.000', 'SENT', 'MESSAGE'),
(842, 7, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 19:04:50.000', 'SENT', 'MESSAGE'),
(843, 7, 2, 'fdsgdfg', '2024-03-27 19:10:33.000', 'SENT', 'MESSAGE'),
(844, 7, 2, 'fffffffffffffffffff', '2024-03-27 19:10:48.000', 'SENT', 'MESSAGE'),
(845, 7, 2, 'ffffffffffffffffffffffff', '2024-03-27 19:10:50.000', 'SENT', 'MESSAGE'),
(846, 7, 2, 'adfsfsdsdf', '2024-03-27 19:30:51.000', 'SENT', 'MESSAGE'),
(847, 7, 2, 'fghdfgh', '2024-03-27 19:32:42.000', 'SENT', 'MESSAGE'),
(848, 7, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 20:59:19.000', 'SENT', 'MESSAGE'),
(849, 7, 2, 'sd[f[fsadasdf[', '2024-03-27 20:59:36.000', 'SENT', 'MESSAGE'),
(850, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 20:59:42.000', 'SENT', 'MESSAGE'),
(851, 7, 2, 'https://media.tenor.com/5EIEPqvzwtAAAAAC/high-five-patrick-star.gif', '2024-03-27 21:00:01.000', 'SENT', 'MESSAGE'),
(852, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 21:00:05.000', 'SENT', 'MESSAGE'),
(853, 7, 2, 'https://media.tenor.com/6UlL-1vxueYAAAAC/high-five.gif', '2024-03-27 21:00:12.000', 'SENT', 'MESSAGE'),
(854, 7, 2, 'https://media.tenor.com/43s33wGTNo0AAAAC/sweating-nervous.gif', '2024-03-27 21:01:05.000', 'SENT', 'MESSAGE'),
(855, 7, 2, 'heyyy', '2024-03-27 21:08:38.000', 'SENT', 'MESSAGE'),
(856, 7, 2, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 21:08:44.000', 'SENT', 'MESSAGE'),
(857, 7, 1, 'sdfgdfggdfgdfgsdf', '2024-03-27 21:09:51.000', 'SENT', 'MESSAGE'),
(858, 8, 1, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 21:09:59.000', 'SENT', 'MESSAGE'),
(859, 7, 1, 'https://media.tenor.com/JkMGlrjiG_cAAAAC/awesome-youre-awesome.gif', '2024-03-27 21:10:08.000', 'SENT', 'MESSAGE'),
(860, 7, 1, 'https://media.tenor.com/43s33wGTNo0AAAAC/sweating-nervous.gif', '2024-03-27 21:10:14.000', 'SENT', 'MESSAGE'),
(861, 7, 1, 'https://media.tenor.com/34lZk_C7eG4AAAAC/happy-good-friday-easter-egg.gif', '2024-03-27 21:10:28.000', 'SENT', 'MESSAGE'),
(862, 8, 1, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 21:12:19.000', 'SENT', 'MESSAGE'),
(863, 7, 1, 'https://media.tenor.com/nNt9uv0uq1QAAAAC/animated-text.gif', '2024-03-27 21:12:26.000', 'SENT', 'MESSAGE'),
(864, 8, 2, 'https://media.tenor.com/ckaWfGyUI-AAAAAC/morning-goodmorning.gif', '2024-03-27 21:39:14.000', 'SENT', 'MESSAGE'),
(865, 8, 1, 'https://media.tenor.com/1Ba_NplQ1KUAAAAC/smh-cigarette.gif', '2024-03-28 22:37:49.000', 'SENT', 'MESSAGE'),
(866, 8, 1, 'https://media.tenor.com/nkAY5GFUw5UAAAAC/good-morning.gif', '2024-03-28 22:46:35.000', 'SENT', 'MESSAGE'),
(867, 8, 1, 'https://media.tenor.com/nkAY5GFUw5UAAAAC/good-morning.gif dfsfsfsf', '2024-03-28 22:46:40.000', 'SENT', 'MESSAGE'),
(868, 8, 1, 'dfgdfgdf https://media.tenor.com/nkAY5GFUw5UAAAAC/good-morning.gif', '2024-03-28 22:46:46.000', 'SENT', 'MESSAGE'),
(869, 8, 1, 'dfgdgdg', '2024-03-28 22:47:50.000', 'SENT', 'MESSAGE'),
(870, 8, 2, '[df[df[fd[', '2024-04-02 22:12:57.000', 'SENT', 'MESSAGE'),
(871, 8, 2, 'sdsssssssssssss', '2024-04-02 22:13:27.000', 'SENT', 'MESSAGE'),
(872, 8, 2, 'gggggggggggggggg', '2024-04-02 22:15:19.000', 'SENT', 'MESSAGE'),
(873, 8, 2, 'dfghdhdfghfh', '2024-04-02 22:15:23.000', 'SENT', 'MESSAGE'),
(874, 8, 2, 'dfgh', '2024-04-02 22:15:25.000', 'SENT', 'MESSAGE'),
(875, 8, 2, 'ggggggggggggggggg', '2024-04-02 22:15:28.000', 'SENT', 'MESSAGE'),
(876, 8, 2, 'dgf[[g', '2024-04-02 22:15:39.000', 'SENT', 'MESSAGE'),
(877, 8, 2, 'dfgsfgdf', '2024-04-02 22:15:44.000', 'SENT', 'MESSAGE'),
(878, 8, 2, 'gdfgdfg', '2024-04-02 22:15:45.000', 'SENT', 'MESSAGE'),
(879, 7, 1, 'fghfghfghfgh', '2024-04-02 22:16:15.000', 'SENT', 'MESSAGE'),
(880, 7, 1, 'dfgdfgdfg', '2024-04-02 22:20:12.000', 'SENT', 'MESSAGE'),
(881, 7, 1, 'fdghfdghfghfg', '2024-04-02 22:20:27.000', 'SENT', 'MESSAGE'),
(882, 7, 1, 'dsfgdfgdgdfg', '2024-04-02 22:21:34.000', 'SENT', 'MESSAGE'),
(883, 7, 1, 'ddddddddddddddd', '2024-04-02 22:21:43.000', 'SENT', 'MESSAGE'),
(884, 7, 1, 'dddddddddddddddddddddddddddddddd', '2024-04-02 22:21:45.000', 'SENT', 'MESSAGE'),
(885, 7, 1, 'bcvxbxvb', '2024-04-02 22:21:46.000', 'SENT', 'MESSAGE'),
(886, 7, 1, 'dsfgfg[df[gd[fg', '2024-04-02 22:23:34.000', 'SENT', 'MESSAGE'),
(887, 7, 1, '[[[f[fd[f', '2024-04-02 22:23:45.000', 'SENT', 'MESSAGE'),
(888, 7, 1, 'ccccccccccccc', '2024-04-02 22:23:47.000', 'SENT', 'MESSAGE'),
(889, 7, 1, 'ccccccccccvxvcvxcvcxv', '2024-04-02 22:23:51.000', 'SENT', 'MESSAGE'),
(890, 7, 1, 'FP[P[FP[F[FP[FP[FP[FDP[FP[D', '2024-04-02 22:23:56.000', 'SENT', 'MESSAGE'),
(891, 7, 1, 'dfgdfgsgffg', '2024-04-02 22:26:12.000', 'SENT', 'MESSAGE'),
(892, 7, 1, 'dfgdsfgdfg', '2024-04-02 22:27:46.000', 'SENT', 'MESSAGE'),
(893, 7, 1, 'dfgdfgg', '2024-04-02 22:28:24.000', 'SENT', 'MESSAGE'),
(894, 7, 1, 'asdfsadfsdf', '2024-04-02 22:29:16.000', 'SENT', 'MESSAGE'),
(895, 7, 1, 'sdfasdfsdf', '2024-04-02 22:29:34.000', 'SENT', 'MESSAGE'),
(896, 7, 1, 'dgsgfsg', '2024-04-02 22:33:18.000', 'SENT', 'MESSAGE'),
(897, 7, 1, 'sdfsdfsdf', '2024-04-02 22:35:15.000', 'SENT', 'MESSAGE'),
(898, 7, 1, 'ddddddddddd', '2024-04-02 22:35:51.000', 'SENT', 'MESSAGE'),
(899, 7, 1, 'dgfdgdfg', '2024-04-02 22:36:02.000', 'SENT', 'MESSAGE'),
(900, 7, 1, 'dfgdfgdfg', '2024-04-02 22:36:56.000', 'SENT', 'MESSAGE'),
(901, 7, 1, 'asdfsdf[', '2024-04-02 22:37:07.000', 'SENT', 'MESSAGE'),
(902, 7, 1, 'gdfgg', '2024-04-02 22:37:27.000', 'SENT', 'MESSAGE'),
(903, 8, 1, 'sdfgsdfgdfg', '2024-04-03 14:25:41.000', 'SENT', 'MESSAGE'),
(904, 8, 1, 'fffffffffff', '2024-04-03 14:26:35.000', 'SENT', 'MESSAGE'),
(905, 8, 1, 'df[s[sfd[sdf[df[', '2024-04-03 14:58:14.000', 'SENT', 'MESSAGE'),
(906, 8, 1, 'sdf[[dfs[dfssdf[', '2024-04-03 15:03:34.000', 'SENT', 'MESSAGE'),
(907, 8, 1, 'heyyy', '2024-04-03 15:59:11.000', 'SENT', 'MESSAGE'),
(908, 8, 1, '[dfs[dsf[f', '2024-04-03 15:59:25.000', 'SENT', 'MESSAGE'),
(909, 7, 1, 'sssssssssssssssssssssssssss', '2024-04-03 15:59:34.000', 'SENT', 'MESSAGE'),
(910, 7, 1, 'dddddddddddddddd', '2024-04-03 15:59:39.000', 'SENT', 'MESSAGE'),
(911, 7, 1, 'fsdfsdfasdfasdf', '2024-04-03 15:59:42.000', 'SENT', 'MESSAGE'),
(912, 8, 1, 'fsd[fsd[fsd', '2024-04-03 17:18:55.000', 'SENT', 'MESSAGE'),
(913, 8, 1, 'dfgsdfgdfg', '2024-04-03 17:20:23.000', 'SENT', 'MESSAGE'),
(914, 8, 1, 'heyyyyyyyyyy', '2024-04-03 17:24:39.000', 'SENT', 'MESSAGE'),
(915, 8, 1, 'heeeeeeeee', '2024-04-03 17:24:50.000', 'SENT', 'MESSAGE'),
(916, 8, 1, '????????', '2024-04-03 17:25:01.000', 'SENT', 'MESSAGE'),
(917, 8, 1, 'dsf[[fds[sdf[fsd', '2024-04-03 17:25:03.000', 'SENT', 'MESSAGE'),
(918, 7, 2, 'aleee', '2024-04-03 17:25:11.000', 'SENT', 'MESSAGE'),
(919, 7, 1, 'sdfa[fsd[dfs[sdf[sdf[fds[', '2024-04-03 17:25:18.000', 'SENT', 'MESSAGE'),
(920, 7, 1, 'xczvz;fbm n,fgcvnbfg', '2024-04-03 17:25:20.000', 'SENT', 'MESSAGE'),
(921, 8, 1, 'fdgdfg', '2024-04-03 17:25:41.000', 'SENT', 'MESSAGE'),
(922, 8, 1, 'https://media.tenor.com/pv8XMHa1iioAAAAC/dance-wiggle.gif', '2024-04-03 17:26:14.000', 'SENT', 'MESSAGE'),
(923, 7, 1, 'dfas[dsf[sdf[dsf[sdf[dsfa', '2024-04-03 17:27:13.000', 'SENT', 'MESSAGE'),
(924, 7, 1, 'sadfsdfsdf', '2024-04-03 17:27:25.000', 'SENT', 'MESSAGE'),
(925, 7, 1, 'sdfasdfsdfsdfa[sdf[', '2024-04-03 17:27:33.000', 'SENT', 'MESSAGE'),
(926, 7, 1, 'aaaaaaaaaaaaaaaaaaaaaaaaa', '2024-04-03 17:27:44.000', 'SENT', 'MESSAGE'),
(927, 7, 1, 'asdasdasd', '2024-04-03 17:27:47.000', 'SENT', 'MESSAGE'),
(928, 7, 1, 'dfgsdfgdfgdfg', '2024-04-03 17:32:08.000', 'SENT', 'MESSAGE'),
(929, 7, 1, 'safsdfsdfsdf', '2024-04-03 17:32:14.000', 'SENT', 'MESSAGE'),
(930, 7, 1, 'dfgdfg', '2024-04-03 17:32:18.000', 'SENT', 'MESSAGE'),
(931, 7, 1, 'dfgdfg', '2024-04-03 17:32:21.000', 'SENT', 'MESSAGE'),
(932, 7, 1, 'asaaaaaaaaaaaaaaaaaa', '2024-04-03 17:32:26.000', 'SENT', 'MESSAGE'),
(933, 7, 1, 'dfgdfsgdfg', '2024-04-03 17:32:29.000', 'SENT', 'MESSAGE'),
(934, 8, 1, 'hhhhhhhhhh', '2024-04-03 21:00:27.000', 'SENT', 'MESSAGE'),
(935, 8, 2, 'gggggggggggggg', '2024-04-03 21:00:45.000', 'SENT', 'MESSAGE'),
(936, 8, 2, 'fghfgh', '2024-04-03 21:05:55.000', 'SENT', 'MESSAGE'),
(937, 8, 1, 'heyyy', '2024-04-05 14:02:29.599', 'SENT', 'MESSAGE'),
(938, 8, 1, '💀', '2024-04-12 11:52:53.658', 'SENT', 'MESSAGE'),
(939, 8, 2, 'heyy', '2024-04-12 14:56:11.678', 'SENT', 'MESSAGE'),
(940, 8, 2, 'heyyy', '2024-04-12 14:58:29.139', 'SENT', 'MESSAGE'),
(941, 8, 2, 'd[fs[fsdf[', '2024-04-12 14:58:31.770', 'SENT', 'MESSAGE'),
(942, 7, 1, 'ale?', '2024-04-12 14:58:49.906', 'SENT', 'MESSAGE'),
(943, 8, 1, 'kuu', '2024-04-12 14:58:56.045', 'SENT', 'MESSAGE'),
(944, 7, 1, 'dsfsdaf', '2024-04-12 14:59:00.587', 'SENT', 'MESSAGE'),
(945, 7, 1, 'sdfasd', '2024-04-12 14:59:00.928', 'SENT', 'MESSAGE'),
(946, 7, 1, 'fsd', '2024-04-12 14:59:03.711', 'SENT', 'MESSAGE'),
(947, 8, 1, 'df[s[sdff[sd', '2024-04-12 15:01:08.509', 'SENT', 'MESSAGE'),
(948, 8, 1, 'aleeeeeee', '2024-04-12 15:02:01.995', 'SENT', 'MESSAGE'),
(949, 8, 2, 'ывапва', '2024-04-13 18:49:46.580', 'SENT', 'MESSAGE'),
(950, 8, 2, 'ыва', '2024-04-13 18:49:52.225', 'SENT', 'MESSAGE'),
(951, 8, 1, 'ывапап', '2024-04-13 18:50:19.251', 'SENT', 'MESSAGE'),
(952, 8, 2, 'ывап', '2024-04-13 18:50:21.667', 'SENT', 'MESSAGE'),
(953, 8, 2, 'ывап', '2024-04-13 18:50:28.319', 'SENT', 'MESSAGE'),
(954, 8, 1, 'ывап', '2024-04-13 18:50:30.523', 'SENT', 'MESSAGE'),
(955, 8, 1, 'ыва', '2024-04-13 18:50:34.689', 'SENT', 'MESSAGE'),
(956, 8, 2, 'dfgdfg', '2024-04-13 18:54:30.545', 'SENT', 'MESSAGE'),
(957, 8, 2, 'dsfgdfg', '2024-04-13 18:54:32.822', 'SENT', 'MESSAGE'),
(958, 8, 2, 'sdfgsdfg', '2024-04-13 18:54:36.056', 'SENT', 'MESSAGE'),
(959, 8, 1, 'aaaaaaaaa', '2024-04-13 18:54:39.367', 'SENT', 'MESSAGE'),
(960, 8, 2, 'düdü', '2024-04-13 18:54:45.021', 'SENT', 'MESSAGE'),
(962, 8, 24, '[dsf[sdf[sdf', '2024-04-14 21:08:28.330', 'SENT', 'MESSAGE'),
(963, 10, 25, 'dfsp[sdsdf[', '2024-04-15 13:51:39.802', 'SENT', 'MESSAGE'),
(964, 7, 1, 'vbn', '2024-04-16 16:35:22.787', 'SENT', 'MESSAGE'),
(965, 8, 1, 'ghjkghjkhjgk', '2024-04-16 16:38:01.534', 'SENT', 'MESSAGE'),
(966, 8, 27, 'Test test1 The test1 created \'TESTGRAG\'', '2024-04-16 21:14:09.701', 'SENT', 'ANNOUNCEMENT');

-- --------------------------------------------------------

--
-- Структура таблицы `chat_message_attachments`
--

CREATE TABLE IF NOT EXISTS `chat_message_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) NOT NULL,
  `photo_id` int(11) DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `message_id` (`message_id`),
  KEY `photo_id` (`photo_id`),
  KEY `video_id` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `chat_message_attachments`
--

TRUNCATE TABLE `chat_message_attachments`;
-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `likes` int(11) NOT NULL,
  `content` varchar(512) COLLATE utf8mb4_bin NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `comments_ibfk_2` (`post_id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `comments`
--

TRUNCATE TABLE `comments`;
-- --------------------------------------------------------

--
-- Структура таблицы `comment_attachments`
--

CREATE TABLE IF NOT EXISTS `comment_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT NULL,
  `photo_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_attachments_ibfk_2` (`comment_id`),
  KEY `photo_id` (`photo_id`),
  KEY `video_id` (`video_id`),
  KEY `comment_attachments_ibfk_1` (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `comment_attachments`
--

TRUNCATE TABLE `comment_attachments`;
-- --------------------------------------------------------

--
-- Структура таблицы `communities`
--

CREATE TABLE IF NOT EXISTS `communities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) COLLATE utf8mb4_bin NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(275) COLLATE utf8mb4_bin DEFAULT NULL,
  `subject_id` int(11) NOT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `banner_url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `banner_color` varchar(7) COLLATE utf8mb4_bin NOT NULL DEFAULT '#bdbdbd',
  `creator_id` int(11) NOT NULL,
  `privacy` enum('OPEN','CLOSED','PRIVATE') COLLATE utf8mb4_bin NOT NULL DEFAULT 'OPEN',
  `allow_comments` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname` (`nickname`),
  KEY `subject_id` (`subject_id`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `communities`
--

TRUNCATE TABLE `communities`;
--
-- Дамп данных таблицы `communities`
--

INSERT INTO `communities` (`id`, `name`, `nickname`, `description`, `subject_id`, `avatar_url`, `banner_url`, `banner_color`, `creator_id`, `privacy`, `allow_comments`, `created_at`) VALUES
(1, 'Rizzlers', 'rizz_group', NULL, 1, 'communities/community-1/avatar/Screenshot 2024-04-15 160252.jpg', NULL, '#bdbdbd', 6, 'OPEN', b'1', '2024-04-15 15:02:39');

-- --------------------------------------------------------

--
-- Структура таблицы `community_banned_users`
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

--
-- Очистить таблицу перед добавлением данных `community_banned_users`
--

TRUNCATE TABLE `community_banned_users`;
-- --------------------------------------------------------

--
-- Структура таблицы `community_chats`
--

CREATE TABLE IF NOT EXISTS `community_chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`),
  KEY `community_id` (`community_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `community_chats`
--

TRUNCATE TABLE `community_chats`;
--
-- Дамп данных таблицы `community_chats`
--

INSERT INTO `community_chats` (`id`, `chat_id`, `community_id`, `user_id`) VALUES
(1, 25, 1, 10);

-- --------------------------------------------------------

--
-- Структура таблицы `community_followers`
--

CREATE TABLE IF NOT EXISTS `community_followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `community_followers`
--

TRUNCATE TABLE `community_followers`;
-- --------------------------------------------------------

--
-- Структура таблицы `community_members`
--

CREATE TABLE IF NOT EXISTS `community_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('admin','moderator','member','creator') COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `community_members`
--

TRUNCATE TABLE `community_members`;
-- --------------------------------------------------------

--
-- Структура таблицы `community_posts`
--

CREATE TABLE IF NOT EXISTS `community_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `community_posts`
--

TRUNCATE TABLE `community_posts`;
-- --------------------------------------------------------

--
-- Структура таблицы `community_subjects`
--

CREATE TABLE IF NOT EXISTS `community_subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `community_subjects`
--

TRUNCATE TABLE `community_subjects`;
--
-- Дамп данных таблицы `community_subjects`
--

INSERT INTO `community_subjects` (`id`, `name`) VALUES
(1, 'Biology');

-- --------------------------------------------------------

--
-- Структура таблицы `confirmation_code`
--

CREATE TABLE IF NOT EXISTS `confirmation_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `reset_code` varchar(5) COLLATE utf8mb4_bin NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `confirmation_code`
--

TRUNCATE TABLE `confirmation_code`;
-- --------------------------------------------------------

--
-- Структура таблицы `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('WEBINAR','COMPETITION') COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(75) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(1024) COLLATE utf8mb4_bin NOT NULL,
  `banner_url` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `community_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `community_id` (`community_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `events`
--

TRUNCATE TABLE `events`;
-- --------------------------------------------------------

--
-- Структура таблицы `event_participants`
--

CREATE TABLE IF NOT EXISTS `event_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `event_participants`
--

TRUNCATE TABLE `event_participants`;
-- --------------------------------------------------------

--
-- Структура таблицы `event_topics`
--

CREATE TABLE IF NOT EXISTS `event_topics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `topic` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `event_topics`
--

TRUNCATE TABLE `event_topics`;
-- --------------------------------------------------------

--
-- Структура таблицы `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` mediumblob NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `file_path` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `files`
--

TRUNCATE TABLE `files`;
-- --------------------------------------------------------

--
-- Структура таблицы `friendships`
--

CREATE TABLE IF NOT EXISTS `friendships` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `friend_id` (`friend_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `friendships`
--

TRUNCATE TABLE `friendships`;
--
-- Дамп данных таблицы `friendships`
--

INSERT INTO `friendships` (`id`, `user_id`, `friend_id`) VALUES
(1, 8, 9),
(2, 8, 6),
(3, 7, 8);

-- --------------------------------------------------------

--
-- Структура таблицы `friend_requests`
--

CREATE TABLE IF NOT EXISTS `friend_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected','ignored') COLLATE utf8mb4_bin NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `receiver_id` (`receiver_id`),
  KEY `sender_id` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `friend_requests`
--

TRUNCATE TABLE `friend_requests`;
-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receiver_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` varchar(155) COLLATE utf8mb4_bin NOT NULL,
  `type` enum('like','comment','friend-request') COLLATE utf8mb4_bin NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `notifications`
--

TRUNCATE TABLE `notifications`;
-- --------------------------------------------------------

--
-- Структура таблицы `photos`
--

CREATE TABLE IF NOT EXISTS `photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_path` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `photos`
--

TRUNCATE TABLE `photos`;
-- --------------------------------------------------------

--
-- Структура таблицы `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `text` varchar(1024) COLLATE utf8mb4_bin NOT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `shares` int(11) NOT NULL DEFAULT 0,
  `allow_comments` bit(1) NOT NULL DEFAULT b'1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `posts`
--

TRUNCATE TABLE `posts`;
-- --------------------------------------------------------

--
-- Структура таблицы `post_attachments`
--

CREATE TABLE IF NOT EXISTS `post_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT NULL,
  `photo_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `post_id` (`post_id`),
  KEY `photo_id` (`photo_id`),
  KEY `video_id` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `post_attachments`
--

TRUNCATE TABLE `post_attachments`;
-- --------------------------------------------------------

--
-- Структура таблицы `refresh_token`
--

CREATE TABLE IF NOT EXISTS `refresh_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `expires_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `refresh_token`
--

TRUNCATE TABLE `refresh_token`;
--
-- Дамп данных таблицы `refresh_token`
--

INSERT INTO `refresh_token` (`id`, `token`, `expires_at`, `user_id`) VALUES
(22, 'eeedcbe0-83e0-4934-b230-eb4966a6eac7', '2024-03-21 19:29:19.000', 8),
(23, '8dceb32c-9f9f-427b-9e27-1d1814715054', '2024-03-21 19:49:52.000', 8),
(24, '6ec83542-9645-4d68-ae7d-bf1d56627fb7', '2024-03-21 19:52:42.000', 8),
(25, '69d091be-dcca-48ec-9ab3-aa00cdaa0746', '2024-03-21 19:58:09.000', 8),
(29, '9de5984b-0886-43c5-90b5-a06111a11b8e', '2024-03-25 13:40:46.000', 8),
(34, 'e76a682d-78ec-45cd-a200-874b1f78017a', '2024-03-25 16:21:23.000', 8),
(36, '492e8df8-4674-4453-9ba0-ea4c1f1eb2e6', '2024-03-25 16:25:59.000', 8),
(37, '12851cc1-d862-4821-b8e7-220bf31cd887', '2024-03-25 17:23:53.000', 7),
(38, '3d7aad57-b9a6-419a-b2d3-9c5239949aca', '2024-03-25 18:42:32.000', 7),
(40, '9ed4238c-3d39-47a3-a6b3-1fb514897c39', '2024-03-26 16:03:21.000', 7),
(41, 'f55b251f-d6ab-4a17-a383-cea4388c7a38', '2024-03-26 20:24:50.000', 8),
(42, '2ba5726c-357a-4fb0-8206-f6f414ac221b', '2024-03-26 20:38:59.000', 8),
(43, '16700b10-0b9f-4cd2-874f-b725e6a1f777', '2024-03-26 21:35:19.000', 8),
(44, 'e1308b39-c61b-45a1-b30f-feac28b33cf0', '2024-03-26 21:44:38.000', 8),
(45, 'a18b96b2-9ef9-4050-9d7e-7596f2c0b672', '2024-03-26 21:45:28.000', 8),
(46, 'a516dc68-9c64-4ef8-95f3-306bb6c0aa88', '2024-03-26 21:48:29.000', 8),
(47, '6836b5ec-39f4-4797-8f11-64450bf7a1ae', '2024-03-26 21:57:53.000', 8),
(49, '8bcfd0dd-2204-4c35-9d9b-b7991de9d6b0', '2024-03-26 22:04:38.000', 8),
(51, 'ec79a204-4273-4ef8-b39d-800b62135be4', '2024-03-26 22:17:06.000', 8),
(52, '79a08f8c-4f60-4b55-9b86-79d406efebeb', '2024-03-26 22:17:50.000', 8),
(53, '5521cf24-2920-431f-a85a-99eba26fd6a5', '2024-03-26 22:23:03.000', 8),
(55, 'cbbb4f96-3d9b-4324-b20a-1144492cb5d8', '2024-03-26 22:37:01.000', 8),
(56, 'e06f4664-807d-43cc-8959-cce72a4dd5a7', '2024-03-26 22:41:00.000', 8),
(57, '77280a0b-a535-4aec-ba4b-80c97cf09a02', '2024-03-26 22:41:25.000', 7),
(58, '283f57e0-4873-473d-9019-2c689ba28401', '2024-03-26 22:42:58.000', 7),
(59, '57a5f957-b0a8-4257-9507-f2cb5ae28e61', '2024-03-26 22:45:00.000', 7),
(60, '822a2649-bc15-4c1c-b7ad-80dfa47116bd', '2024-03-26 22:47:24.000', 8),
(62, 'f81a17d2-a008-4c58-b185-edc7c18f3f10', '2024-03-27 11:23:17.000', 7),
(66, 'e81c7e51-dc8e-4a56-aa63-1ac9d6312497', '2024-03-28 16:43:04.000', 7),
(67, '6b9fb3f0-fa62-4b81-a9ce-abd7ebcf1249', '2024-03-28 16:44:48.000', 8),
(69, 'c9eb7071-14c4-4db5-b957-c13af88d7338', '2024-04-09 18:21:40.000', 8),
(70, '8e423a55-6f92-4b47-8787-755ed2b507b2', '2024-04-09 19:13:21.000', 7),
(71, '46f936a4-b217-4e5e-8639-3a1291afb361', '2024-04-14 10:30:35.533', 8),
(72, 'a4a8483e-73ae-4b1a-8ba0-e4e6182f2ac4', '2024-04-14 10:30:54.959', 8),
(75, '51fe68f1-c599-44cb-96a6-849531251789', '2024-04-19 14:58:44.632', 7),
(77, '8020f789-9bc4-4d58-9275-8f4f20f0d649', '2024-04-21 13:26:06.132', 8),
(84, '0c453de4-5028-4300-8a4e-af79142677f6', '2024-04-22 15:29:43.590', 8),
(85, '9b2ceea4-981d-41c6-a9da-d2116b709ea6', '2024-04-23 16:17:04.699', 8),
(103, '4001151b-75bb-4deb-9176-c9d9bac94f5d', '2024-04-23 18:06:43.559', 8),
(104, 'b94d9c5e-86d7-49c2-a910-8b7670b81b77', '2024-04-23 18:06:47.996', 8),
(122, '43c6aef0-5e2a-419f-be48-3e2393304d0e', '2024-04-23 21:30:04.006', 8);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `last_name` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(75) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `nickname` varchar(40) COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') COLLATE utf8mb4_bin NOT NULL,
  `birth_date` datetime(6) DEFAULT NULL,
  `bio` varchar(275) COLLATE utf8mb4_bin DEFAULT NULL,
  `points` int(7) NOT NULL DEFAULT 0,
  `avatar_url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `banner_url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `banner_color` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `is_public` bit(1) DEFAULT NULL,
  `auto_follow` bit(1) DEFAULT NULL,
  `last_seen` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `users`
--

TRUNCATE TABLE `users`;
--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `nickname`, `email`, `gender`, `birth_date`, `bio`, `points`, `avatar_url`, `banner_url`, `banner_color`, `is_public`, `auto_follow`, `last_seen`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 'Maksim', 'Dzjubenko', 'dzalex72', '$2a$10$Q66TOqRq0TVmbKyEPP5kmOD1De4S9qfjp9BKeFySwWyJd00svLI0m', 'mak7ilenin', 'maksondzjubenko@gmail.com', 'MALE', '2004-12-22 00:00:00.000000', 'First PERSON ON THE WEBSITE!!', 0, NULL, NULL, '#bdbdbd', b'1', b'0', '2024-03-14 00:49:45', '2024-03-04 22:18:49', '2024-03-14 00:49:45', NULL),
(7, 'Maksim', 'Dzjubenko', 'mak22', '$2a$10$Lod8/Dr.Gnej19nXRcor1ujvJ6IH/YTXNoHHzmRG.YQZ1rkOGL1u6', 'makssss233', 'maskss@gmail.com', 'OTHER', '2004-12-22 00:00:00.000000', 'First PERSON ON THE WEBSITE!!', 0, NULL, NULL, '#bdbdbd', b'1', b'0', '2024-03-14 00:49:42', '2024-03-05 12:43:04', '2024-03-14 00:49:42', NULL),
(8, 'Test test1', 'The test1', 'test1', '$2a$10$XUeq9ln02Yjlsl6fy/E0nesvOZs45riPOTcNESKgLXp7iJztwdoNG', 'test1', 'test1@ee.com', 'OTHER', '2004-12-22 00:00:00.000000', 'Test test1', 0, 'users/user-8/avatar/1f635-1f4ab.png', NULL, '#bdbdbd', b'1', b'0', '2024-04-12 16:50:07', '2024-03-07 00:08:43', '2024-04-12 17:09:54', NULL),
(9, 'Test nigger', 'The nigger19', 'nigger', '$2a$10$iCg8KnjKxgIzUQtFIQphQu75LiZjyFbWRTnajb6h56nBFCVoFYFfy', 'nigger19', 'nigger@test.ee', 'OTHER', '2004-12-22 00:00:00.000000', 'Test nigger', 0, NULL, NULL, '#bdbdbd', b'1', b'0', '2024-03-14 00:49:47', '2024-03-08 23:57:19', '2024-03-14 00:49:47', NULL),
(10, 'Test nigga', 'The nigga', 'nigga', '$2a$10$8ZS.uvbKNBVU.PpyqsuCP.lv1tHibvliGuw3KlI3iEtr09N.dEHVy', 'nigga', 'nigga@gmail.com', 'OTHER', '2004-12-22 02:00:00.000000', 'Test nigga', 0, NULL, NULL, NULL, NULL, NULL, '2024-04-15 15:14:14', '2024-04-15 13:32:06', '2024-04-15 15:14:14', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `user_communities`
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

--
-- Очистить таблицу перед добавлением данных `user_communities`
--

TRUNCATE TABLE `user_communities`;
-- --------------------------------------------------------

--
-- Структура таблицы `user_followers`
--

CREATE TABLE IF NOT EXISTS `user_followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `follower_id` (`follower_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `user_followers`
--

TRUNCATE TABLE `user_followers`;
-- --------------------------------------------------------

--
-- Структура таблицы `user_notifications`
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

--
-- Очистить таблицу перед добавлением данных `user_notifications`
--

TRUNCATE TABLE `user_notifications`;
-- --------------------------------------------------------

--
-- Структура таблицы `user_photos`
--

CREATE TABLE IF NOT EXISTS `user_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `photo_id` (`photo_id`),
  KEY `user_photos_ibfk_1` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `user_photos`
--

TRUNCATE TABLE `user_photos`;
-- --------------------------------------------------------

--
-- Структура таблицы `user_post_interactions`
--

CREATE TABLE IF NOT EXISTS `user_post_interactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `interaction_type` enum('BOOKMARKED','LIKED') COLLATE utf8mb4_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `user_post_interactions`
--

TRUNCATE TABLE `user_post_interactions`;
-- --------------------------------------------------------

--
-- Структура таблицы `user_privacy`
--

CREATE TABLE IF NOT EXISTS `user_privacy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `privacy_options_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `privacy_options_id` (`privacy_options_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `user_privacy`
--

TRUNCATE TABLE `user_privacy`;
-- --------------------------------------------------------

--
-- Структура таблицы `user_privacy_options`
--

CREATE TABLE IF NOT EXISTS `user_privacy_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `view_main_information` enum('all users','friends only','only me') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `view_followings` enum('all users','friends only','only me') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `view_photos_videos` enum('all users','friends only','only me') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `view_friends` enum('all users','friends only','only me') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `birthday_settings` enum('do not show','month and day','full birthday') COLLATE utf8mb4_bin NOT NULL DEFAULT 'full birthday',
  `view_post_comments` enum('all users','friends only','only me') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `comment_on_posts` enum('all users','friends only','only me') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `send_private_messages` enum('all users','friends only','no one') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `add_to_chats` enum('all users','friends only','no one') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  `invite_to_communities` enum('all users','friends only','no one') COLLATE utf8mb4_bin NOT NULL DEFAULT 'all users',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `user_privacy_options`
--

TRUNCATE TABLE `user_privacy_options`;
-- --------------------------------------------------------

--
-- Структура таблицы `user_videos`
--

CREATE TABLE IF NOT EXISTS `user_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `video_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `video_id` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `user_videos`
--

TRUNCATE TABLE `user_videos`;
-- --------------------------------------------------------

--
-- Структура таблицы `videos`
--

CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator_id` int(11) NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `duration` time NOT NULL,
  `resolution` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `description` mediumtext COLLATE utf8mb4_bin DEFAULT NULL,
  `thumbnail_url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Очистить таблицу перед добавлением данных `videos`
--

TRUNCATE TABLE `videos`;
--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `blocked_users`
--
ALTER TABLE `blocked_users`
  ADD CONSTRAINT `blocked_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blocked_users_ibfk_2` FOREIGN KEY (`blocked_user`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `chat_history`
--
ALTER TABLE `chat_history`
  ADD CONSTRAINT `chat_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_history_ibfk_2` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`);

--
-- Ограничения внешнего ключа таблицы `chat_members`
--
ALTER TABLE `chat_members`
  ADD CONSTRAINT `chat_members_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_members_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chat_messages_ibfk_3` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`);

--
-- Ограничения внешнего ключа таблицы `chat_message_attachments`
--
ALTER TABLE `chat_message_attachments`
  ADD CONSTRAINT `chat_message_attachments_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `chat_message_attachments_ibfk_2` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_message_attachments_ibfk_3` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`),
  ADD CONSTRAINT `chat_message_attachments_ibfk_4` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`);

--
-- Ограничения внешнего ключа таблицы `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `comment_attachments`
--
ALTER TABLE `comment_attachments`
  ADD CONSTRAINT `comment_attachments_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `comment_attachments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_attachments_ibfk_3` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`),
  ADD CONSTRAINT `comment_attachments_ibfk_4` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`);

--
-- Ограничения внешнего ключа таблицы `communities`
--
ALTER TABLE `communities`
  ADD CONSTRAINT `communities_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `community_subjects` (`id`),
  ADD CONSTRAINT `communities_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `community_banned_users`
--
ALTER TABLE `community_banned_users`
  ADD CONSTRAINT `community_banned_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_banned_users_ibfk_2` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `community_chats`
--
ALTER TABLE `community_chats`
  ADD CONSTRAINT `community_chats_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_chats_ibfk_2` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`),
  ADD CONSTRAINT `community_chats_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `community_followers`
--
ALTER TABLE `community_followers`
  ADD CONSTRAINT `community_followers_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_followers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `community_members`
--
ALTER TABLE `community_members`
  ADD CONSTRAINT `community_members_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `community_posts`
--
ALTER TABLE `community_posts`
  ADD CONSTRAINT `community_posts_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `confirmation_code`
--
ALTER TABLE `confirmation_code`
  ADD CONSTRAINT `confirmation_code_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `event_participants`
--
ALTER TABLE `event_participants`
  ADD CONSTRAINT `event_participants_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `event_topics`
--
ALTER TABLE `event_topics`
  ADD CONSTRAINT `event_topics_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `friend_requests_ibfk_1` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friend_requests_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `post_attachments`
--
ALTER TABLE `post_attachments`
  ADD CONSTRAINT `post_attachments_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `post_attachments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_attachments_ibfk_3` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`),
  ADD CONSTRAINT `post_attachments_ibfk_4` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`);

--
-- Ограничения внешнего ключа таблицы `refresh_token`
--
ALTER TABLE `refresh_token`
  ADD CONSTRAINT `refresh_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_communities`
--
ALTER TABLE `user_communities`
  ADD CONSTRAINT `user_communities_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_communities_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_followers`
--
ALTER TABLE `user_followers`
  ADD CONSTRAINT `user_followers_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_followers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD CONSTRAINT `user_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_photos`
--
ALTER TABLE `user_photos`
  ADD CONSTRAINT `user_photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_photos_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

--
-- Ограничения внешнего ключа таблицы `user_post_interactions`
--
ALTER TABLE `user_post_interactions`
  ADD CONSTRAINT `user_post_interactions_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_post_interactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_privacy`
--
ALTER TABLE `user_privacy`
  ADD CONSTRAINT `user_privacy_ibfk_1` FOREIGN KEY (`privacy_options_id`) REFERENCES `user_privacy_options` (`id`),
  ADD CONSTRAINT `user_privacy_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `user_videos`
--
ALTER TABLE `user_videos`
  ADD CONSTRAINT `user_videos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_videos_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
