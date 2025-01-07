CREATE TABLE users (
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    privilege ENUM('admin', 'simple_user', 'manager') DEFAULT 'simple_user',

    FOREIGN KEY (telephone) REFERENCES membres(telephone)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

ALTER TABLE users ADD COLUMN privilege ENUM('admin', 'simple_user', 'manager') DEFAULT 'simple_user';

CREATE TABLE IF NOT EXISTS membres (

    telephone VARCHAR(20) NOT NULL PRIMARY KEY,

    nom VARCHAR(255) NOT NULL,
    prenoms VARCHAR(255) NOT NULL,
    surnom VARCHAR(255),
    date_naissance DATE NOT NULL,
    situation ENUM('celibataire', 'marie') NOT NULL,
    enfants INT,
    profession VARCHAR(255),
    taille DECIMAL(5,2),
    pointure DECIMAL(4,1),
    adresse VARCHAR(255),

    facebook VARCHAR(255),
    whatsapp VARCHAR(255),
    photo VARCHAR(255),

    type VARCHAR(255) DEFAULT 'president'
);

ALTER TABLE membres ADD COLUMN type VARCHAR(255) DEFAULT 'president';

CREATE TABLE IF NOT EXISTS transactions (
    `date` DATETIME PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `montant` DECIMAL(10, 2) NOT NULL,
    `expediteur` VARCHAR(255) NOT NULL,
    `date_modification` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS montant(
    montant BIGINT DEFAULT 0
);
