import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Header from './components/Header';
import Dashboard from './components/dashboard';
import Member from './components/Member';
import Cota from './components/Cota';
import Admin from './components/Administration';
import Register from './components/register';
import Users from './components/Users';
import Com from './components/Com';

function App() {
  // Vérifie si l'utilisateur est authentifié en regardant dans le localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'; // Lecture de l'état depuis le localStorage
  });

  // Effet pour mettre à jour le localStorage à chaque fois que l'état d'authentification change
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated); // Sauvegarde l'état dans le localStorage
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false); // Met à jour l'état local
    localStorage.removeItem('isAuthenticated'); // Supprime l'état du localStorage
  };

  return (
    <BrowserRouter>
      {/* Affiche le NavBar et Header uniquement si l'utilisateur est authentifié */}
      {isAuthenticated && <NavBar handleLogout={handleLogout} />}
      {isAuthenticated && <Header handleLogout={handleLogout} />}
      <Routes>
        <Route path='/login' element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path='/register' element={<Register />} />
        {/* Redirection vers la page de connexion si l'utilisateur n'est pas authentifié */}
        <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/member' element={isAuthenticated ? <Member /> : <Navigate to="/login" />} />
        <Route path='/member/administration' element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
        <Route path='/cota' element={isAuthenticated ? <Cota /> : <Navigate to="/login" />} />
        <Route path='/member/administration' element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
        <Route path='/users' element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
        <Route path='/commucations' element={isAuthenticated ? <Com /> : <Navigate to="/login" />} />
        {/* Redirection vers la page de connexion par défaut si non authentifié */}
        <Route path='/' element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
