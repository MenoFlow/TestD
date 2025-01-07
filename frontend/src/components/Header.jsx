import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
function Header({ handleLogout }) {
    const username = sessionStorage.getItem('username'); // Récupérer les données stockées

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [telephone, setTelephone] = useState('');
    const [membre, setMembre] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('/api/users/'+username)
                setTelephone(response.data.telephone.telephone)
                try{
                    const membreId = response.data.telephone.telephone;
                    const response2 = await axios.get(`/api/membre/${membreId}`);
                    setMembre(response2.data)
                }
                catch (error){
                    console.error('Erreur lors de la récupération du membre : '+error)
                }
            }
            catch (error){
                console.error('Erreur lors de la récupération de l\'utilisateur : '+error)
            }
        };
        fetchData();
    }, [])

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    const handleLogout2 = () => {
        sessionStorage.removeItem('username'); // Supprime la clé 'username'
        handleLogout()
      };
      console.log(membre.photo)
      const photoBaseUrl = 'https://test-d-two.vercel.app/uploads/'+membre.photo;
    return (
        <>
            <div id="header" className="row bg-dark text-light">
                <div className="col-10">
                    <h3>AssoManage</h3>
                    <h6>V.1.0.0</h6>
                </div>
                <div className="col-2 text-end">
                    <button className="btn btn-outline-light" onClick={toggleMenu}>
                        <i className="bi bi-list"></i>
                    </button>
                </div>
            </div>

            {/* Menu latéral qui apparaît depuis la droite */}
            <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
                <button className="btn btn-light" onClick={toggleMenu}>
                    <i className="bi bi-x"></i>
                </button>
                <div id="user" className="row mt-4 text-center text-light">
                    <div className="row">
                        <div id="pdp" className="col-7 mx-auto shadow rounded-circle mt-3">
                        {membre.photo ? (
                        <img 
                            src={`${photoBaseUrl}`} 
                            alt="Photo de membre"
                            className="img-fluid rounded" 
                        />
                    ) : (
                        <h5 className="my-auto">Pas de photo disponible</h5>
                    )}
                        </div>
                    </div>
                    <div className="row mt-3">
                        <h4>{username}</h4>
                    </div>
                </div>
                <div className="row text-light ">
                <ul className="list-unstyled mt-3 text-center" >
                        <li><Link to = '/member/administration' onClick={toggleMenu} className="nav-link mt-5">Membres de bureau</Link></li>
                        <li><Link to = '/users' onClick={toggleMenu} className="nav-link mt-5">Gestion des utilisateurs</Link></li>
                        <li><Link to = '/commucations' onClick={toggleMenu} className="nav-link mt-5">Communications</Link></li>
                        <li><button onClick={ handleLogout } className="btn btn-danger mt-5 mx-auto">Déconnexion</button></li>
               </ul>
                </div>
            </div>

            {/* Masque pour cliquer à l'extérieur du menu et le fermer */}
            {isMenuOpen && <div className="backdrop" onClick={toggleMenu}></div>}
        </>
    );
}

export default Header;
