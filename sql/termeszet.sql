-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Sze 12. 00:22
-- Kiszolgáló verziója: 10.4.25-MariaDB
-- PHP verzió: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `termeszet`
--
CREATE DATABASE IF NOT EXISTS `termeszet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `termeszet`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `courseregisters`
--

CREATE TABLE `courseregisters` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `enabled` tinyint(1) DEFAULT NULL,
  `paid` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `courseregisters`
--

INSERT INTO `courseregisters` (`id`, `userId`, `courseId`, `enabled`, `paid`, `createdAt`, `updatedAt`) VALUES
(82, 10, 53, 1, 1, '2024-09-01 07:03:32', '2024-09-11 22:14:54'),
(84, 10, 51, 0, 0, '2024-09-01 07:23:54', '2024-09-11 22:14:58'),
(85, 10, 9, 0, 0, '2024-09-01 07:27:57', '2024-09-11 22:06:59');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `homeworks`
--

CREATE TABLE `homeworks` (
  `id` int(11) NOT NULL,
  `cim` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `felhasznaloId` int(11) DEFAULT NULL,
  `leiras` varchar(512) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `hataridoDatum` date DEFAULT NULL,
  `letrehozasDatum` date DEFAULT NULL,
  `megoldas` varchar(512) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `ready` tinyint(1) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `homeworks`
--

INSERT INTO `homeworks` (`id`, `cim`, `felhasznaloId`, `leiras`, `hataridoDatum`, `letrehozasDatum`, `megoldas`, `ready`, `createdAt`, `updatedAt`) VALUES
(2, 'Elso hazi', 1, 'Anyad ez egy leiras', '1900-01-01', '1900-01-01', 'juj szia ez a jo megoldas', 0, '2024-07-20', '2024-07-20');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `minikurzus`
--

CREATE TABLE `minikurzus` (
  `id` int(11) NOT NULL,
  `cim` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `helyszin` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `idopont` date DEFAULT NULL,
  `ar` int(11) DEFAULT NULL,
  `temakor` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `leiras` varchar(512) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `szoveg` longtext COLLATE utf8mb4_hungarian_ci NOT NULL,
  `fajlok` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `felhasznalok` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `megkotesek` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `video` varchar(512) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `minikurzus`
--

INSERT INTO `minikurzus` (`id`, `cim`, `helyszin`, `idopont`, `ar`, `temakor`, `leiras`, `szoveg`, `fajlok`, `felhasznalok`, `megkotesek`, `video`, `createdAt`, `updatedAt`) VALUES
(9, 'Random cím2', 'Budapest', '2024-03-16', 420, 'Norbi szuletese', 'Egy legenda szuletett akkor', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ', 'futyi.png', '[1,2,3,10]', '[3,4,5,6]', '1725208635796.mp4', '2024-07-01', '2024-09-01'),
(51, 'Kurzus1', 'Budapest', '2024-08-16', 69420, '', '', '', '', '[]', '[]', NULL, '2024-08-04', '2024-08-11'),
(52, 'Kurzus2', 'Budapest', '2024-08-16', 69420, '', '', '', '', '[]', NULL, NULL, '2024-08-04', '2024-08-10'),
(53, 'Kurzus3', 'Budapest', '2024-08-16', 69420, '', '', '', '', '[]', NULL, NULL, '2024-08-04', '2024-08-11'),
(62, 'Ez egy meno kurzus lesz', 'Veszprém', '2024-09-11', 69000, '', '', '', '', '[]', NULL, '1723521644011.mp4', '2024-08-13', '2024-08-13');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `pwd` varchar(512) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `rang` char(1) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `bornDate` date DEFAULT NULL,
  `allergies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`allergies`)),
  `mutetek` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`mutetek`)),
  `amalganFilling` tinyint(1) DEFAULT NULL,
  `drugs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`drugs`)),
  `complaints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`complaints`)),
  `goal` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `courses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`courses`)),
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `fullName`, `username`, `email`, `pwd`, `rang`, `description`, `bornDate`, `allergies`, `mutetek`, `amalganFilling`, `drugs`, `complaints`, `goal`, `courses`, `createdAt`, `updatedAt`) VALUES
(1, 'Ujj Norbert', 'norbi', 'norbert.ujj@gmail.com', '$2a$10$FmRiILvstQ6llF5nNp75KO9UstMwVmra6oPetkn8wApS8oEl8l.6K', 'a', 'Valami fasza leírást írok magamról, hogy le tudjam tesztelni minden működik-e?', '2024-08-18', '\"{\\\"mukodik?\\\":\\\"de\\\",\\\"meg mindig mukodik?\\\":\\\"de meg mennyire\\\"}\"', '\"{\\\"könyök törés\\\":\\\"nagyon fájt\\\"}\"', 1, '\"{\\\"viagra\\\":\\\"kék pirula\\\"}\"', '\"{\\\"fáj a fogam\\\":\\\"nagyon\\\"}\"', 'Gazdag szeretnék lenni, egy boldog családdal', '\"{\\\"ezt már nem használom\\\":\\\"igaz\\\"}\"', '2024-07-01', '2024-09-02'),
(10, 'Régi Norbert', 'norbii', 'norbert.ujj2@gmail.com', '$2a$10$k1WloHkVOgvQBXaCPh5f0uvZxYf2LlOcIa/FQhs8MQoLzVQ1dgcD6', 'u', '-', '2022-07-20', '{}', '{}', 0, '{}', '{}', '', '{}', '2024-08-01', '2024-08-01');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `courseregisters`
--
ALTER TABLE `courseregisters`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `homeworks`
--
ALTER TABLE `homeworks`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `minikurzus`
--
ALTER TABLE `minikurzus`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `courseregisters`
--
ALTER TABLE `courseregisters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT a táblához `homeworks`
--
ALTER TABLE `homeworks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `minikurzus`
--
ALTER TABLE `minikurzus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
