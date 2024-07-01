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
    updatedAt DATE
);