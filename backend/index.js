import express from "express";
import routes from "./Routes/routes.js";
import cors from 'cors'; // Importer CORS
import session from 'express-session'; // Importer express-session
import dotenv from 'dotenv';
import mysql2 from 'mysql2';

dotenv.config(); // Charger les variables d'environnement

const app = express();
const port = 3000;

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
    maxAge: 1000 * 60 * 60 * 24
  } // Si tu utilises HTTP, sinon true pour HTTPS
}));

app.use('/uploads', express.static('uploads'));

// Utilisation des routes
app.use('/api', routes); // Préfixe '/api' pour les routes

// Exemple d'API pour récupérer des données
app.get('/api/data', async (req, res) => {
  try {
    const [results] = await promisePool.query('SELECT * FROM test_table');
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
