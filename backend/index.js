import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors'; // Importer cors

dotenv.config(); // Charger les variables d'environnement

const app = express();
const port = process.env.PORT || 3000;

  // Activer CORS pour permettre les requêtes depuis le frontend
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://test-d-yvso.vercel.app', // Utiliser une variable d'environnement pour l'URL frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restreindre aux méthodes nécessaires
    credentials: true // Autoriser les cookies ou les en-têtes d'authentification
  }));

// Configurer la connexion MySQL avec un pool
const con = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Vérifier la connexion à la base de données
con.getConnection((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); // Arrêter le serveur si la connexion échoue
  } else {
    console.log('Connected to MySQL');
  }
});
 
// Middleware pour analyser les requêtes JSON
app.use(express.json());

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

app.get('/api/membres', (req, res) => {
  const sql = 'SELECT * FROM membres'; // Votre requête SQL pour récupérer tous les membres

  con.query(sql, (err, results) => {
      if (err) {
          console.error('Erreur lors de la récupération des membres:', err);
          return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(200).json(results); // Renvoie les résultats sous forme de JSON
  });
});

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
