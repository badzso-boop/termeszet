CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255),
    pwd VARCHAR(512),
    rang CHAR(1),
    description VARCHAR(255),
    bornDate DATE,
    allergies JSON,
    mutetek JSON,
    amalganFilling BOOLEAN,
    drugs JSON,
    complaints JSON,
    goal VARCHAR(255),
    courses JSON,
    createdAt DATE,
    updatedAt DATE
);

CREATE TABLE minikurzus(
    id INT PRIMARY KEY AUTO_INCREMENT,
    cim VARCHAR(255),
    helyszin VARCHAR(255),
    idopont DATE,
    ar INT,
    temakor VARCHAR(255),
    leiras VARCHAR(512),
    fajlok VARCHAR(255),
    felhasznalok JSON,
    megkotesek JSON,
    video VARCHAR(512),
    createdAt DATE,
    updatedAt DATE
);

CREATE TABLE homeworks(
  	id INT AUTO_INCREMENT PRIMARY KEY,
    cim VARCHAR(255),
    felhasznaloId INT,
    leiras VARCHAR(512),
    hataridoDatum DATE,
    letrehozasDatum DATE,
    megoldas VARCHAR(512),
    ready BOOLEAN,
    createdAt DATE,
    updatedAt DATE,
    CONSTRAINT fk_homeworks_user
        FOREIGN KEY (felhasznaloId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- courseregisters: Sequelize a `courseregister` modellnevet alapértelmezetten
-- `courseregisters`-re pluralizálja, ez a tényleges tábla neve az adatbázisban.
-- Ez a tábla korábban hiányzott ebből a referenciafájlból, csak a modellből
-- jött létre sequelize.sync()-kel — most itt is dokumentáljuk, a FK-kkal együtt.
CREATE TABLE courseregisters(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    enabled BOOLEAN NOT NULL,
    paid BOOLEAN,
    adminPaid BOOLEAN,
    createdAt DATE,
    updatedAt DATE,
    CONSTRAINT fk_courseregisters_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_courseregisters_course
        FOREIGN KEY (courseId) REFERENCES minikurzus(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE galeria(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    filename VARCHAR(255) NOT NULL,
    originalUrl VARCHAR(500) NOT NULL,
    thumbnailUrl VARCHAR(500),
    isStarred BOOLEAN DEFAULT FALSE,
    size INT,
    createdAt DATE,
    updatedAt DATE
);

CREATE TABLE services(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    iconUrl VARCHAR(500),
    iconType VARCHAR(50) DEFAULT 'hands',
    price VARCHAR(100),
    duration VARCHAR(100),
    isStarred BOOLEAN DEFAULT TRUE,
    `order` INT DEFAULT 0,
    createdAt DATETIME,
    updatedAt DATETIME
);

-- Leckék (kurzusonként sorrendezett videó+szöveg blokkok; a Sequelize lessonModel.js alapján)
CREATE TABLE `lessons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `cim` varchar(255) NOT NULL,
  `sorrend` int NOT NULL DEFAULT '0',
  `szoveg` text,
  `video` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `minikurzus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tartalomfordítások (lásd src/sql/migrations/2026-10-04-content-translations.sql)
CREATE TABLE `service_translations` (
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

CREATE TABLE `course_translations` (
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

CREATE TABLE `lesson_translations` (
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

CREATE TABLE `gallery_translations` (
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
