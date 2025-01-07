import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  return (
    <>
      <div className="container mt-5">
        <Liste />
      </div>
    </>
  );
}
  // Modifier un membre existant
  const handleUpdateMembre = async (membreData) => {
    try {
      await axios.put(`/api/membres/${membreData.telephone}`, membreData);
      fetchMembres(); // Rafraîchir la liste des membres
    } catch (error) {
      console.error("Erreur lors de la modification du membre", error);
    }
  };

  // Supprimer un membre
  const handleDeleteMembre = async (telephone) => {
    try {
      await axios.delete(`/api/membres/${telephone}`);
      fetchMembres(); // Rafraîchir la liste des membres
    } catch (error) {
      console.error("Erreur lors de la suppression du membre", error);
    }
  };

function Liste() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [membres, setMembres] = useState([]);
  const [memberId, setMemberId] = useState('');

  useEffect(() => {
    const fetchMembres = async () => {
        try {
          const response = await axios.get("https://test-d-two.vercel.app/api/membres2");
          setMembres(response.data);
        } catch (error) {
          console.error("Erreur lors du chargement des membres", error);
        }
      };
    fetchMembres();
  }, []);



    // Modifier un membre existant
  const handleUpdateMembre = async (membreData) => {
    try {
      await axios.put(`/api/membres/${membreData.telephone}`, membreData);
      fetchMembres(); // Rafraîchir la liste des membres
    } catch (error) {
      console.error("Erreur lors de la modification du membre", error);
    }
  };

  // Supprimer un membre
  const handleDeleteMembre = async (telephone) => {
    try {
      await axios.delete(`/api/membres/${telephone}`);
      fetchMembres(); // Rafraîchir la liste des membres
    } catch (error) {
      console.error("Erreur lors de la suppression du membre", error);
    }
  };
  const handleEditThis = (telephone) => {
    setFormVisible(true)
    setMemberId(telephone)
  }

  return (
    <div className="row text-center">
      <h3 className="mt-2">Membres de bureau :</h3>
    
      <table className="table table-responsive mt-3">
        <thead>
          <tr>
            <th>Téléphone</th>
            <th>Nom</th>
            <th>Prénoms</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {membres.map((membre) => (
            <tr key={membre.telephone}>
              <td>{membre.telephone}</td>
              <td>{membre.nom}</td>
              <td>{membre.prenoms}</td>
              <td>{membre.type}</td>
              <td>
                <button className="btn btn-sm" onClick={()=>handleEditThis(membre.telephone)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-sm text-danger" onClick={() => handleDeleteMembre(membre.telephone)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Formulaire
        telephone={memberId}
        isVisible={isFormVisible}
        onConfirm={(data) => console.log(data)} // Gérer la soumission des données du formulaire
        onClose={() => setFormVisible(false)}
      />
    </div>
  );
}


function Formulaire({ telephone, isVisible, onConfirm, onClose }) {
  const [titre, setTitre] = useState('')
  const [formData, setFormData] = useState({
    titre: "president",
  });

  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
        await axios.post("/api/membres_bureau_add", {titre, telephone});
        // fetchMembres(); // Rafraîchir la liste des membres
      } catch (error) {
        console.error("Erreur lors de l'ajout du membre", error);
      }
    onConfirm(formData);
    onClose(); // Ferme le formulaire après la soumission
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container2">
        <h3>Membre de bureau</h3>

        <div className="row">
          <label htmlFor="nom">Numero</label>
          <input
            type="text"
            name="telephone"
            className="form-control"
            value={telephone}
            placeholder={telephone}
            readOnly
          />
        </div>

        <div className="row">
          <label htmlFor="titre">Titre :</label>
          <select
            name="titre"
            className="form-select"
            value={formData.titre}
            onChange={(e)=>{setTitre(e.target.value)}}
          >
            <option value="president">Président</option>
            <option value="vice president">Vice président</option>
            <option value="secretaire">Sécretaire</option>
            <option value="conseillé">Conseillé</option>
            <option value="tresorier">Trésorier</option>
            <option value="Résponsable de communication">Résponsable de communication</option>
          </select>
        </div>

        <div className="modal-buttons">
          <button className="btn btn-outline-success" onClick={handleSubmit}>
            Confirmer
          </button>
          <button className="btn btn-outline-danger" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
