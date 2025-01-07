import { useState } from 'react'; // Importer useState pour gérer l'état
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importer Axios
// import { ModifiedPathsSnapshot } from 'mongoose';

function Login({ setIsAuthenticated }) { // Passer setIsAuthenticated en tant que prop
  const [username, setUsername] = useState(''); // État pour le nom d'utilisateur
  const [password, setPassword] = useState(''); // État pour le mot de passe
  const [errorMessage, setErrorMessage] = useState(''); // État pour le message d'erreur
  const [successMessage, setSuccessMessage] = useState(''); // État pour le message de succès

  const navigate = useNavigate();

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    try {
      const response = await axios.post('https://test-d-two.vercel.app/api/login', {
        username,
        password
      });
      
      // Traiter la réponse du serveur
      if (response.status === 200) {
        sessionStorage.setItem('username', username);
        setSuccessMessage('Connexion réussie !'); // Afficher le message de succès
        setErrorMessage(''); // Réinitialiser le message d'erreur
        localStorage.setItem('token', response.data.token); // Stocker le token
        setIsAuthenticated(true); // Mettre à jour l'état d'authentification
        navigate('/'); // Rediriger vers la page d'accueil
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage('Nom d\'utilisateur ou mot de passe incorrect.'); // Afficher un message d'erreur
      setSuccessMessage(''); // Réinitialiser le message de succès
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div id='header' className="row col-12 text-center">
          <h2>AssoManage</h2>
        </div>
        <div className="row col-12 col-md-5 col-lg-5 text-center mt-5 mx-auto p-5 shadow rounded-4 bg-light" id="loginForm">
        <h2>Connexion</h2>
          <form onSubmit={handleSubmit}> {/* Appeler handleSubmit lors de la soumission du formulaire */}
            <label className="form-label" htmlFor="userName">Nom d'utilisateur</label>
            <input
              className="form-control"
              type="text"
              id="userName"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Mettre à jour l'état du nom d'utilisateur
              required // Champ requis
            />
            <label className="form-label" htmlFor="password">Mot de passe :</label>
            <input
              className="form-control"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Mettre à jour l'état du mot de passe
              required // Champ requis
            />
            <div className='row col-12 col-md-7 col-lg-5 mx-auto'>
              <button type='submit' className='btn btn-outline-dark'>Se connecter</button> {/* Type 'submit' pour soumettre le formulaire */}
            </div>
            <div className='row col-12 col-md-9 col-lg-9 mx-auto'>
              <button id='forgot' className='btn text-secondary'>Mot de passe oublié</button>
            </div>
            <Link to='/register' className='btn text-secondary'>S'enregistrer</Link>
          </form>
          {/* Afficher les messages d'erreur ou de succès */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>

        <div id='version' className="row col-12 text-center py-2">
          <h6>v.1.0.0</h6>
        </div>
      </div>
    </>
  );
}

export default Login;
