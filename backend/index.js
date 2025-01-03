import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors'; // Importer cors

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Activer CORS pour toutes les origines

app.use(cors({
    origin: 'https://test-d-yvso.vercel.app' // Remplace par l'URL de ton frontend
  }));
  
const con = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(express.json());

app.get('/api/data', (req, res) => {
  console.log(22)
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
