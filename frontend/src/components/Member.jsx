import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./modal";

function Member() {
    const [page, setPage] = useState('list');
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMembreId, setSelectedMembreId] = useState(null); // État pour stocker l'ID du membre sélectionné

    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const message = "Etes-vous sûr d'ajouter ce nouveau membre ?";
    const confirm = () => {
        hideModal();
    }

    return (
        <> 
            <div className="container mt-5">
                {page === 'list' && (
                    <List setPage={setPage} setSelectedMembreId={setSelectedMembreId} />
                )}

                {page === 'info' && (
                    <Info setPage={setPage} membreId={selectedMembreId} />
                )}

                {page === 'edit' && (
                    <EditMember membreId={selectedMembreId} setPage={setPage} showModal={showModal} />
                )}

                {page === 'new' && (
                    <NewMember setPage={setPage} showModal={showModal} />
                )}

                <Modal 
                    title={'Ajouter un membre'} 
                    message={message} 
                    isVisible={isModalVisible}
                    onConfirm={confirm}
                    onClose={hideModal}
                />
            </div>
        </>
    );
}

function List({ setPage, setSelectedMembreId }) {
    const [membres, setMembres] = useState([]);

    useEffect(() => {
        const fetchMembres = async () => {
            try {
                const response = await axios.get('/api/membres');
                setMembres(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des membres:', error);
            }
        };

        fetchMembres();
    }, []);

    return (
        <div className="row text-center">
            <h3 className="mt-2">Liste des membres :</h3>
            <div className="row">
                <div className="col-1">
                    <button onClick={() => setPage('new')} className="btn btn-dark">
                        <i className="bi bi-plus"></i>
                    </button>
                </div>
            </div>
            <table className="table table-responsive mt-3">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénoms</th>
                        <th>Surnom</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {membres.length > 0 ? (
                        membres.map((membre) => (
                            <tr key={membre.telephone}>
                                <td>{membre.nom}</td>
                                <td>{membre.prenoms}</td>
                                <td>{membre.surnom}</td>
                                <td>{membre.type}</td>
                                <td>
                                    <button 
                                        className="btn btn-info" 
                                        onClick={() => {
                                            setSelectedMembreId(membre.telephone); // Mettre à jour l'ID du membre sélectionné
                                            setPage('info'); // Changer la page
                                        }}>
                                        plus d'info
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Aucun membre trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function EditMember({ membreId, setPage, showModal }) {
    const [formData, setFormData] = useState({
        nom: '',
        prenoms: '',
        surnom: '',
        date_naissance: '',
        situation: 'celibataire',
        enfants: '',
        profession: '',
        taille: '',
        pointure: '',
        adresse: '',
        telephone: '',
        facebook: '',
        whatsapp: '',
        photo: null
    });

    // Gestion des changements dans les champs de formulaire
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value // Pour les fichiers, on utilise files[0]
        }));
    };

    // Récupérer les informations du membre pour pré-remplir le formulaire
    useEffect(() => {
        const fetchMembre = async () => {
            try {
                const response = await axios.get(`/api/membre/${membreId}`);
                const fetchedData = response.data;

                // Vérifier si la date de naissance est définie et la formater correctement
                const formattedDate = fetchedData.date_naissance ? new Date(fetchedData.date_naissance).toISOString().split('T')[0] : '';

                // Mettre à jour les données du formulaire avec les données reçues
                setFormData({
                    ...fetchedData,
                    date_naissance: formattedDate // S'assurer que la date est correctement formatée
                });
            } catch (error) {
                console.error('Erreur lors de la récupération du membre:', error);
            }
        };

        if (membreId) {
            fetchMembre();
        }
    }, [membreId]);

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Créer une instance de FormData pour gérer l'envoi des fichiers et des données
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]); // Ajoute chaque champ au FormData
        }

        console.log('Photo:', formData.photo); // Vérifier si la photo est bien dans les données
        console.log('FormData contenu:', formData);

        try {
            // Envoi de la requête PUT pour mettre à jour les informations du membre
            const response = await axios.put(`/api/membre/${membreId}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' } // Gérer automatiquement les fichiers
            });
            console.log('Membre mis à jour:', response.data);
            showModal(); // Afficher le modal de succès
        } catch (error) {
            console.error('Erreur lors de la mise à jour du membre:', error);
        }
    };

    return (
        <div className="row text-center">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-11 text-center">
                        <h3>Modifier un membre</h3>
                    </div>
                    <div className="col-1">
                        <button onClick={() => setPage('list')} className="btn btn-danger" type="button">
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-5 col-lg-4 mx-auto">
                        <label htmlFor="nom">Nom :</label>
                        <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} required />
                    </div>
                    <div className="col-12 col-md-5 col-lg-4">
                        <label htmlFor="prenoms">Prénoms :</label>
                        <input type="text" className="form-control" name="prenoms" value={formData.prenoms} onChange={handleChange} required />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-5 col-lg-4 mx-auto">
                        <label htmlFor="surnom">Surnom :</label>
                        <input type="text" className="form-control" name="surnom" value={formData.surnom} onChange={handleChange} />
                    </div>
                    <div className="col-12 col-md-5 col-lg-4">
                        <label htmlFor="date_naissance">Date de naissance :</label>
                        <input type="date" className="form-control" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-5 col-lg-4 mx-auto">
                        <label htmlFor="situation">Situation :</label>
                        <select className="form-control" name="situation" value={formData.situation} onChange={handleChange}>
                            <option value="celibataire">Célibataire</option>
                            <option value="marie">Marié(e)</option>
                            <option value="divorce">Divorcé(e)</option>
                            <option value="veuf">Veuf/Veuve</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-5 col-lg-4">
                        <label htmlFor="enfants">Nombre d'enfants :</label>
                        <input type="number" className="form-control" name="enfants" value={formData.enfants} onChange={handleChange} />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-5 col-lg-4 mx-auto">
                        <label htmlFor="profession">Profession :</label>
                        <input type="text" className="form-control" name="profession" value={formData.profession} onChange={handleChange} />
                    </div>
                    <div className="col-12 col-md-5 col-lg-4">
                        <label htmlFor="taille">Taille (cm) :</label>
                        <input type="number" className="form-control" name="taille" value={formData.taille} onChange={handleChange} />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-5 col-lg-4 mx-auto">
                        <label htmlFor="pointure">Pointure :</label>
                        <input type="number" className="form-control" name="pointure" value={formData.pointure} onChange={handleChange} />
                    </div>
                    <div className="col-12 col-md-5 col-lg-4">
                        <label htmlFor="adresse">Adresse :</label>
                        <input type="text" className="form-control" name="adresse" value={formData.adresse} onChange={handleChange} required />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-5 col-lg-4 mx-auto">
                        <label htmlFor="telephone">Téléphone :</label>
                        <input type="tel" className="form-control" name="telephone" value={formData.telephone} onChange={handleChange} required />
                    </div>
                    <div className="col-12 col-md-5 col-lg-4">
                        <label htmlFor="facebook">Facebook :</label>
                        <input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-5 col-lg-4 mx-auto">
                        <label htmlFor="whatsapp">WhatsApp :</label>
                        <input type="tel" className="form-control" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                    </div>
                    <div className="col-12 col-md-5 col-lg-4">
                        <label htmlFor="photo">Photo :</label>
                        <input type="file" className="form-control" name="photo" onChange={handleChange} />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-dark">Enregistrer les modifications</button>
                </div>
            </form>
        </div>
    );
}



function Info({ setPage, membreId }) {
    const [membre, setMembre] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchMembre = async () => {
            try {
                const response = await axios.get(`/api/membre/${membreId}`);
                setMembre(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du membre:', error);
            } finally {
                setLoading(false);
            }
        };

        if (membreId) {
            fetchMembre();
        }
    }, [membreId]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?");
        if (confirmDelete) {
            try {
                await axios.delete(`/api/membre/${membreId}`);
                alert('Membre supprimé avec succès');
                setPage('list'); // Rediriger vers la liste après suppression
            } catch (error) {
                console.error('Erreur lors de la suppression du membre:', error);
                alert('Erreur lors de la suppression.');
            }
        }
    };

    if (loading) return <div>Chargement...</div>;

    if (!membre) return <div>Aucun membre trouvé.</div>;

    // URL de base pour les photos
    const photoBaseUrl = 'https://test-d-two.vercel.app/uploads/';

    return (
        <div id="info">
            <div className="row">
                <div id="photo" className="col-6 col-lg-2 shadow mx-auto text-center rounded">
                    {membre.photo ? (
                        <img 
                            src={`${photoBaseUrl}${membre.photo}`} 
                            alt="Photo de membre"
                            className="img-fluid rounded" 
                        />
                    ) : (
                        <h5 className="my-auto">Pas de photo disponible</h5>
                    )}
                </div>
                <div className="col-lg-9 mt-5 mx-auto my-auto">
                    <h3>{membre.nom} {membre.prenoms}</h3>
                    <h5>Surnom : {membre.surnom}</h5>
                </div>
            </div>
            {/* Informations du membre */}
            <div className="row mt-5">
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-calendar-date me-2"></i>
                        Date de naissance : {membre.date_naissance}
                    </h5>
                </div>
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-heart-fill me-2"></i>
                        Situation matrimoniale : {membre.situation}
                    </h5>
                </div>
            </div>
            {/* Autres informations du membre */}
            <div className="row mt-5">
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-person-fill me-2"></i>
                        Nombre d'enfants : {membre.enfants}
                    </h5>
                </div>
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-briefcase-fill me-2"></i>
                        Profession : {membre.profession}
                    </h5>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-rulers me-2"></i>
                        Taille : {membre.taille}
                    </h5>
                </div>
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-bag me-2"></i>
                        Pointure chaussure : {membre.pointure}
                    </h5>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-house-fill me-2"></i>
                        Adresse : {membre.adresse}
                    </h5>
                </div>
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-telephone-fill me-2"></i>
                        Téléphone : {membre.telephone}
                    </h5>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-facebook me-2"></i>
                        Facebook : {membre.facebook}
                    </h5>
                </div>
                <div className="col-12 col-lg-5 mx-auto">
                    <h5>
                        <i className="bi bi-whatsapp me-2"></i>
                        WhatsApp : {membre.whatsapp}
                    </h5>
                </div>
            </div>
            {/* Boutons d'action */}
            <div className="row mt-5">
                <div className="col-11 text-center">
                    <button className="btn btn-outline-secondary" onClick={() => setPage('edit')}>
                        <i className="bi bi-pencil me-2"></i>
                        Modifier
                    </button>
                    <button className="btn btn-danger ms-5" onClick={handleDelete}>
                        <i className="bi bi-trash me-2"></i>
                        Supprimer
                    </button>
                    <button className="btn btn-light ms-5" onClick={() => setPage('list')}>
                        <i className="bi bi-arrow-left me-2"></i>
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}


function NewMember({ setPage, showModal }) {
    const [formData, setFormData] = useState({
        nom: '',
        prenoms: '',
        surnom: '',
        date_naissance: '',
        situation: 'celibataire',
        enfants: '',
        profession: '',
        taille: '',
        pointure: '',
        adresse: '',
        telephone: '',
        facebook: '',
        whatsapp: '',
        photo: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await axios.post('/api/membre', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Membre ajouté:', response.data);
            showModal();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du membre:', error);
        }
    };

    return (
        <>
            <div className="row text-center">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-11 text-center">
                            <h3>Nouveau membre</h3>
                        </div>
                        <div className="col-1">
                            <button onClick={() => setPage('list')} className="btn btn-danger" type="button">
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 mx-auto">
                            <label htmlFor="nom">Nom :</label>
                            <input type="text" className="form-control" name="nom" value={formData.nom} onChange={handleChange} required maxLength="50" />
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <label htmlFor="prenoms">Prénoms :</label>
                            <input type="text" className="form-control" name="prenoms" value={formData.prenoms} onChange={handleChange} required maxLength="50"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 mx-auto">
                            <label htmlFor="surnom">Surnom :</label>
                            <input type="text" className="form-control" name="surnom" value={formData.surnom} onChange={handleChange} maxLength="40"/>
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <i className="bi bi-calendar-date me-2"></i>
                            <label htmlFor="date_naissance">Date de naissance :</label>
                            <input type="date" className="form-control" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 mx-auto">
                            <i className="bi bi-person-check me-2"></i>
                            <label htmlFor="situation">Situation :</label>
                            <select className="form-select" name="situation" value={formData.situation} onChange={handleChange}>
                                <option value="celibataire">Célibataire</option>
                                <option value="marie">Marié</option>
                                <option value="divorce">Divorcé</option>
                                <option value="veuf">Veuf</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <label htmlFor="enfants">Enfants :</label>
                            <input type="text" className="form-control" name="enfants" value={formData.enfants} onChange={handleChange} maxLength="3"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 mx-auto">
                            <label htmlFor="profession">Profession :</label>
                            <input type="text" className="form-control" name="profession" value={formData.profession} onChange={handleChange} maxLength="30" />
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <label htmlFor="taille">Taille :</label>
                            <input type="text" className="form-control" name="taille" value={formData.taille} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 mx-auto">
                            <label htmlFor="pointure">Pointure :</label>
                            <input type="text" className="form-control" name="pointure" value={formData.pointure} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <label htmlFor="adresse">Adresse :</label>
                            <input type="text" className="form-control" name="adresse" value={formData.adresse} onChange={handleChange} maxLength="60"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 mx-auto">
                            <label htmlFor="telephone">Téléphone :</label>
                            <input type="text" className="form-control" name="telephone" value={formData.telephone} onChange={handleChange} maxLength="20"/>
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <label htmlFor="facebook">Facebook :</label>
                            <input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} maxLength="100"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 mx-auto">
                            <label htmlFor="whatsapp">WhatsApp :</label>
                            <input type="text" className="form-control" name="whatsapp" value={formData.whatsapp} onChange={handleChange} maxLength="20"/>
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <label htmlFor="photo">Photo :</label>
                            <input type="file" className="form-control" name="photo" accept="image/*" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-dark">Enregistrer</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Member;
