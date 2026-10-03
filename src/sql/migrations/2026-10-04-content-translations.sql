-- 2026-10-04: tartalomfordítások (szolgáltatás, kurzus, lecke, galéria) -- lásd
-- src/models/translationModels.js és docs/i18n.md.
--
-- Csak ÚJ táblák: a meglévő táblákhoz nem nyúl, a magyar (alapnyelvi) szöveg marad az
-- eredeti táblákban. A futó régi kód ezeket a táblákat nem ismeri, ezért a migráció a kód
-- élesítése ELŐTT biztonságosan lefuttatható. Idempotens (IF NOT EXISTS).
-- A DDL a Sequelize sync() által generálttal azonos (MySQL 8 SHOW CREATE TABLE alapján).

CREATE TABLE IF NOT EXISTS `service_translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceId` int NOT NULL,
  `lang` varchar(10) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `price` varchar(100) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `sourceHash` char(64) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_service_translations_serviceId_lang` (`serviceId`,`lang`),
  CONSTRAINT `service_translations_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `course_translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `lang` varchar(10) NOT NULL,
  `cim` varchar(255) DEFAULT NULL,
  `temakor` varchar(255) DEFAULT NULL,
  `helyszin` varchar(255) DEFAULT NULL,
  `leiras` text,
  `szoveg` text,
  `sourceHash` char(64) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_translations_courseId_lang` (`courseId`,`lang`),
  CONSTRAINT `course_translations_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `minikurzus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `lesson_translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lessonId` int NOT NULL,
  `lang` varchar(10) NOT NULL,
  `cim` varchar(255) DEFAULT NULL,
  `szoveg` text,
  `sourceHash` char(64) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_lesson_translations_lessonId_lang` (`lessonId`,`lang`),
  CONSTRAINT `lesson_translations_ibfk_1` FOREIGN KEY (`lessonId`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `gallery_translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `galleryId` int NOT NULL,
  `lang` varchar(10) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `sourceHash` char(64) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_gallery_translations_galleryId_lang` (`galleryId`,`lang`),
  CONSTRAINT `gallery_translations_ibfk_1` FOREIGN KEY (`galleryId`) REFERENCES `galeria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
