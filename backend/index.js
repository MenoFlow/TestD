import express from "express";
import routes from "./Routes/routes.js";
import cors from 'cors'; // Importer CORS
import session from 'express-session'; // Importer express-session

const app = express();
const port = 3000;

// Script d'initialisation SQL
const initializeDatabase = async () => {
  const queries = [
    `
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
    )
    `,
    `
    INSERT INTO membres (
    telephone,
    nom,
    prenoms,
    surnom,
    date_naissance,
    situation,
    enfants,
    profession,
    taille,
    pointure,
    adresse,
    facebook,
    whatsapp,
    type
    ) VALUES (
    '0345835632',     
    'Rakoto',           
    'Jean Michel',
    'Mike',
    '1990-05-15',
    'celibataire',
    2,
    'Ingénieur',
    1.75,
    42.5,
    'Lot 123, Ville',
    'jean',
    '0349876543',
    'president'
    )

    `,
    `
    CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        privilege ENUM('admin', 'simple_user', 'manager') DEFAULT 'simple_user',
        FOREIGN KEY (telephone) REFERENCES membres(telephone)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS transactions (
        date DATETIME PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        montant DECIMAL(10, 2) NOT NULL,
        expediteur VARCHAR(255) NOT NULL,
        date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS montant (
        montant BIGINT DEFAULT 0
    )
    `,
  ];

  try {
    const conn = await pool.getConnection();
    for (const query of queries) {
      await conn.query(query);
    }
    console.log("Base de données initialisée avec succès.");
    conn.release();
  } catch (err) {
    console.error("Erreur lors de l'initialisation de la base de données:", err.message);
  }
};

// Appel de la fonction d'initialisation lors du démarrage du serveur
initializeDatabase();


// Activer CORS pour permettre les requêtes depuis le frontend
app.use(cors({
  origin: 'https://test-d-yvso.vercel.app', // Utiliser une variable d'environnement pour l'URL frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restreindre aux méthodes nécessaires
  credentials: true // Autoriser les cookies ou les en-têtes d'authentification
}));

// Middleware pour analyser le corps des requêtes JSON
app.use(express.json());

// Configuration de la session
app.use(session({
  secret: 'menoh22Test', // Change ce secret pour plus de sécurité
  resave: false, // Ne pas sauvegarder la session si elle n'est pas modifiée
  saveUninitialized: false, // Créer une session même si elle est vide
  cookie: {
    // secure: false
    maxAge: 1000 * 60* 60 * 24
  } // Si tu utilises HTTP, sinon true pour HTTPS
}));

app.use('/uploads', express.static('uploads'));

// Utilisation des routes
app.use('/api', routes); // Préfixe '/api' pour les routes

// Exemple d'API pour récupérer des données
app.get('/api/data', (req, res) => {
  con.query('SELECT * FROM test_table', (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
