import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Login.css'; // Assure-toi que le CSS est importé

function Register() {
  const [username, setUsername] = useState('');  // Gérer l'état du nom d'utilisateur
  const [password, setPassword] = useState('');  // Gérer l'état du mot de passe
  const [message, setMessage] = useState('');    // Gérer les messages de succès ou d'erreur
  const [telephone, setTelephone] = useState('');    // Gérer les messages de succès ou d'erreur

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
      // Envoyer les données au backend via une requête POST
      const response = await axios.post('https://test-d-two.vercel.app/api/register', {
        username,
        password,
        telephone,
      });

      // Traiter la réponse
      if (response.status === 201) {
        setMessage('Inscription réussie !');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      if (error.response && error.response.status === 409) {
        setMessage('Nom d\'utilisateur déjà pris.');
      } else {
        setMessage('Erreur du serveur.');
      }
    }
  };

  return (
    <div className="container-fluid">
      <div id='header' className="row col-12 text-center">
        <h2>AssoManage</h2>
      </div>
      <div className="row col-12 col-md-5 col-lg-5 text-center mt-5 mx-auto p-5 shadow rounded-4 bg-light" id="loginForm">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="password">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="telephone">Telephone</label>
          <input
            type="text"
            className="form-control"
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
            maxLength="30"
          />
          <div className='row col-12 col-md-7 col-lg-5 mx-auto'>
            <button type="submit" className="btn btn-outline-dark">S'inscrire</button>
          </div>
          <div className='row col-12 col-md-9 col-lg-9 mx-auto'>
            <Link to='/login' className='btn text-secondary'>Déjà inscrit</Link>
          </div>
        </form>
        {/* Afficher le message d'erreur ou de succès */}
        {message && <p style={{ color: message.includes('réussie') ? 'green' : 'red' }}>{message}</p>}
      </div>

      <div id='version' className="row col-12 text-center py-2">
        <h6>v.1.0.0</h6>
      </div>
    </div>
  );
}

export default Register;
