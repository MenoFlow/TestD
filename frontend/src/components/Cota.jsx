import { useState, useEffect } from "react"
import Axios from 'axios'
import axios from "axios"

function Cota(){

    const montant   = 5000
    const nonPaye = 0

    const [isFormVisible,setFormVisible] = useState(false)

    const openForm = () => setFormVisible(true)
    const closeForm = () => setFormVisible(false)
    const confirm = () => {

        closeForm();
    }
    return(
        <>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <button onClick={ openForm } className="btn btn-dark">
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div id="coinDash" className="row">
                    <div id="cotisationDash" className="col-sm-12 col-md-12 col-lg-5 mx-auto mt-2">
                        <Cotisation montant={montant} nonPaye={nonPaye} />
                    </div>
                    <div id="transactionDash" className="col-sm-12 col-md-12 col-lg-6 mx-auto mt-2">
                        <Transaction  />
                    </div>
                </div>
            </div>

            <Form isVisible = { isFormVisible } onConfirm = { confirm } onClose = { closeForm } />
        </>
    )
}
function Cotisation() {
    const [transactions, setTransactions] = useState([]);
    const [nonPaye, setNonPaye] = useState(0); // État pour le montant non payé
    const [statut, setStatus] = useState('non payé')
    const [montant2, setMontant] = useState(0)
    const [montant3, setMontant3] = useState(0)
    const [ stateEdit, setStateEdit ] = useState(false)

    const handleEdit = () => {
        setStateEdit(true)
    }

    const handleSave = async () => {
        // console.log(montant)
        try {
            console.log(montant3)
            axios.put('https://test-d-two.vercel.app/api/updateMontant', {montant3})
            .then(response=>{
                console.log(response.data.result)
                
            })
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des données', error);
        }
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await Axios.get('https://test-d-two.vercel.app/api/transactions'); // Remplace par l'URL de ton API
                const cotisations = response.data.filter(transaction => transaction.description === 'cotisation');

                setTransactions(cotisations);
                
                // Calculer le montant non payé
                const totalPaye = cotisations.reduce((acc, transaction) => acc + (transaction.status === 'payé' ? transaction.montant : 0), 0);
                setNonPaye(montant2 - totalPaye); // Calculer le montant non payé
            } catch (error) {
                console.error('Erreur lors de la récupération des transactions:', error);
            }
        };

        fetchTransactions();
    }, [montant2]); // Montant comme dépendance si besoin de mettre à jour les non payés
    
    useEffect(() => {
        const fetchMontant = () => {
            try{
                axios.get('https://test-d-two.vercel.app/api/montant')
                .then(result=>{
                    console.log(result.data.result[0].montant)
                    setMontant(result.data.result[0].montant)
                })
            } catch (error) {
                console.error('Erreur lors de la récupération des transactions:', error);
            }
        }
        fetchMontant();
    }, [montant2])

    return (
        <>
            <div id="cotaTitle" className="row text-light">
                <div className="col-4">
                    <h5>cotisation : </h5>
                </div>
                <div className=" col-7 text-end">
                    <h5>{montant2} MGA / mois</h5>
                </div>
                <div className="col-1">
                <button onClick={handleEdit} className="btn btn-sm"><i className="bi bi-pencil text-light"></i></button>
                </div>
            </div>

            <div id="cotaTab" className="row overflow-scroll">
                <div className="row">
                    <table className="table table-responsive text-center">
                        <thead>
                            <tr>
                                <th>Nom et prénoms</th>
                                <th>Montant</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) =>{
                            
                            return (
                                <tr key={transaction.date}>
                                    <td className={transaction.montant>=montant2 ? 'bg-secondary text-light' : 'bg-danger text-light'}>{transaction.expediteur}</td>
                                    <td className={transaction.montant>=montant2 ? 'bg-secondary text-light' : 'bg-danger text-light'}>{transaction.montant}</td>
                                    <td className={transaction.montant>=montant2 ? 'bg-secondary text-light' : 'bg-danger text-light'}>{(transaction.montant>=montant2) ? 'payé' : 'non payé' }</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
            { stateEdit &&
                (
                <div className="modal-overlay">
                    <div className="modal-container2">
                      <h3>Montant</h3>              

                        <div className="row">
                          <input
                            type="text"
                            name="descriptionPrev2"
                            placeholder="Veuillez entrer le montant"
                            className="form-control"
                            onChange={(e) => setMontant3(e.target.value)}
                          />
                        </div>
                                    
                    <div className="modal-buttons">
                        <button className="btn btn-outline-success" onClick={handleSave}>
                            Valider
                        </button>
                        <button className="btn btn-outline-danger" onClick={()=>setStateEdit(false)}>
                            Annuler
                        </button>
                    </div>
                    </div>
                </div>
                )
            }

            {/* <div id="cotaFooter" className="row text-light">
                <div className="col-12 text-end">
                    <h5>Non payé : {nonPaye} MGA</h5>
                </div>
            </div> */}
        </>
    );
}

function EditForm({ isVisible, onConfirm, onClose, transaction }) {
    const [description, setDescri] = useState(transaction.description);
    const [selectValue, setSelectValue] = useState(transaction.description === 'cotisation' ? 'cotisation' : 'autre');
    const [montant, setMontant] = useState(transaction.montant);
    const [expediteur, setExpediteur] = useState(transaction.expediteur);
    const [type, setType] = useState(transaction.type);
    const [date, setDate] = useState(transaction.date); // Ajouté pour gérer la date

    if (!isVisible) return null;

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        const data = {
            type,
            description,
            montant,
            expediteur,
            date: formatDate(date), // Formater la date avant de l'envoyer
        };

        try {
            const response = await Axios.put(`https://test-d-two.vercel.app/api/transactions/${data.date}`, data);
            console.log('Réponse du serveur :', response.data);
            onConfirm(); // Ferme le formulaire après la confirmation
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la transaction:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container2">
                <h3>Modifier Transaction</h3>

                <div className="row">
                    <label htmlFor="type">Type :</label>
                    <select
                        name="type"
                        className="form-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="revenue">revenue</option>
                        <option value="depense">dépense</option>
                    </select>
                </div>

                <div className="row">
                    <label htmlFor="description">Déscription :</label>
                    <select
                        onChange={(e) => {
                            setSelectValue(e.target.value);
                            setDescri(e.target.value === 'autre' ? '' : e.target.value);
                        }}
                        name="description"
                        className="form-select"
                        value={selectValue}
                    >
                        <option value="cotisation">cotisation</option>
                        <option value="autre">autre</option>
                    </select>
                </div>

                {selectValue === 'autre' && (
                    <div className="row">
                        <input
                            type="text"
                            name="description2"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescri(e.target.value)}
                        />
                    </div>
                )}

                <div className="row">
                    <label htmlFor="montant">Montant :</label>
                    <input
                        type="number"
                        name="montant"
                        className="form-control"
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                    />
                </div>

                <div className="row">
                    <label htmlFor="expediteur">Expediteur :</label>
                    <input
                        type="text"
                        name="expediteur"
                        className="form-control"
                        value={expediteur}
                        onChange={(e) => setExpediteur(e.target.value)}
                        readOnly
                    />
                </div>


                <div className="modal-buttons">
                    <button className="btn btn-outline-success" onClick={handleSubmit}>
                        Mettre à jour
                    </button>
                    <button className="btn btn-outline-danger" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await Axios.get('https://test-d-two.vercel.app/api/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
        setCurrentTransaction(null);
    };
    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`;
    };

    const handleDelete = async (date) => {
        try {
            const formattedDate = formatDate(date)

            await Axios.delete(`https://test-d-two.vercel.app/api/transactions/${formattedDate}`);
            setTransactions(transactions.filter(transaction => transaction.date !== date));
            console.log('Transaction supprimée avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression de la transaction:', error);
        }
    };
    

    return (
        <>
            <div id="transTitle" className="row text-light">
                <div className="col-12 text-center">
                    <h5>Transactions :</h5>
                </div>
            </div>

            <div id="transTab" className="row overflow-scroll">
                <div className="row">
                    <table className="table table-responsive table text-center">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Montant</th>
                                <th>Venant de</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.date}>
                                    <td className={'bg-success text-light'}>{transaction.type}</td>
                                    <td className={'bg-success text-light'}>{transaction.description}</td>
                                    <td className={'bg-success text-light'}>{transaction.montant}</td>
                                    <td className={'bg-success text-light'}>{transaction.expediteur}</td>
                                    <td className={'bg-success text-light'}>
                                        {new Date(transaction.date).toLocaleString()}
                                    </td>
                                    <td className={'bg-success text-light'}>
                                        <button className="btn btn-sm btn-light" onClick={() => handleEdit(transaction)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(transaction.date)}>
                                        <i className="bi bi-trash"></i>
                                            
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditing && (
                <EditForm 
                    isVisible={isEditing} 
                    onConfirm={handleCloseEdit} 
                    onClose={handleCloseEdit} 
                    transaction={currentTransaction} 
                />
            )}
        </>
    );
}


  


function Form({ isVisible, onConfirm, onClose }) {

    const [descriptionPrev, setDescri] = useState('cotisation');
    const [selectValue, setSelectValue] = useState(''); // 
    const [selectValue2, setSelectValue2] = useState(''); // 
    const [montant, setMontant] = useState('');
    const [expediteurPrev, setExpediteurPrev] = useState('');
    const [type, setType] = useState('revenue');
    const [membres, setMembres] = useState([])

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

    if (!isVisible) return null;
    
    const handleSubmit = async () => {
        const description = selectValue === 'cotisation' ? 'cotisation' : descriptionPrev;
        const expediteur = selectValue2 === 'autre' ? expediteurPrev : selectValue2;
        const data = {
            type,
            description,
            montant,
            expediteur,
        };

      try {
        const response = await Axios.post('https://test-d-two.vercel.app/api/create_transactions', data);
        console.log('Réponse du serveur :', response.data);
      } catch (error) {
        if (error.response) {
          // Erreur côté serveur (ex : 400)
          console.log('Erreur côté serveur:', error.response.status);
          console.log('Message d’erreur:', error.response.data.error);
        } else if (error.request) {
          // Aucune réponse reçue du serveur
          console.log('Aucune réponse reçue du serveur:', error.request);
        } else {
          // Erreur lors de la configuration de la requête
          console.log('Erreur de configuration de la requête:', error.message);
        }
      }
      
    };

    return (
      <div className="modal-overlay">
        <div className="modal-container2">
          <h3>Transaction</h3>
  
          <div className="row">
            <label htmlFor="type">Type :</label>
            <select
              name="type"
              className="form-select"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="revenue">revenue</option>
              <option value="depense">dépense</option>
            </select>
          </div>
  
          <div className="row">
            <label htmlFor="descriptionPrev">Déscription :</label>
            <select
              onChange={(e) => setSelectValue(e.target.value)}
              name="descriptionPrev"
              className="form-select"
            >
              <option value="cotisation">cotisation</option>
              <option value="autre">autre</option>
            </select>
          </div>
  
          {selectValue === 'autre' && (
            <div className="row">
              <input
                type="text"
                name="descriptionPrev2"
                placeholder="Veuillez entrer ici la cotisation de type autre"
                className="form-control"
                onChange={(e) => setDescri(e.target.value)}
              />
            </div>
          )}
  
          <div className="row">
            <label htmlFor="montant">Montant :</label>
            <input
              type="number"
              name="montant"
              className="form-control"
              onChange={(e) => setMontant(e.target.value)}
            />
          </div>
  
          <div className="row">
  <label htmlFor="expediteur">Expediteur :</label>

  <select
    name="expediteur"
    className="form-select"
    onChange={(e) => setSelectValue2(e.target.value)}
    defaultValue="" // Par défaut, aucune option sélectionnée
  >
    <option value="" disabled>
      Veuillez selectionner une option
    </option>
    <option value="autre">autre</option>

    {membres.map((membre) => (
      <option key={membre.telephone} value={`${membre.nom} ${membre.prenoms}`}>
        {membre.nom} {membre.prenoms}
      </option>
    ))}
  </select>
  
</div>

          {selectValue2 === 'autre' && (
                    <div className="row">
                        <input
                            type="text"
                            placeholder="Veuillez entrer ici l'expediteur de type autre"
                            name="expediteur2"
                            className="form-control"
                            value={expediteurPrev}
                            onChange={(e) => setExpediteurPrev(e.target.value)}
                        />
                    </div>
            )}

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
// descri
export default Cota;