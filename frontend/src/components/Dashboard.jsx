import { useState, useEffect } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';  // Assurez-vous d'avoir installé axios

function Dashboard(){
    return(
        <>
            <div className="container mt-5">
                <div className="row">
                    <Counter />
                </div>
                <div className="row mt-5">
                    <div className="col-12 col-md-6 col-lg-6">
                        <Graph1 />
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <Graph2/>
                    </div>
                </div>
            </div>
        </>
    )
}

function Counter(){

    const [member, setMember] = useState(0)
    const [coin, setCoin] = useState(0)
    const [up, setUp] = useState(0)
    const [down, setDown] = useState(0)

    // Utilisation de useEffect pour récupérer le nombre de membres depuis le backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/members/count');  // API pour récupérer le nombre de membres
                setMember(response.data.count);  // Mise à jour du nombre de membres
            } catch (error) {
                console.error('Erreur lors de la récupération du nombre de membres:', error);
            }
        };

        fetchData();  // Appel de la fonction pour récupérer les données
    }, []);  // [] signifie que cet effet s'exécutera uniquement lors du montage du composant

    useEffect(() => {
        const fetchMembres = async () => {
            try {
                const response = await axios.get('/api/caisse');
                setCoin(response.data.count);
            } catch (error) {
                console.error('Erreur lors de la récupération de la solde:', error);
            }
        };

        fetchMembres();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/up');  // API pour récupérer le nombre de membres
                setUp(response.data.revenue);  // Mise à jour du nombre de membres
            } catch (error) {
                console.error('Erreur lors de la récupération du nombre de membres:', error);
            }
        };

        fetchData();  // Appel de la fonction pour récupérer les données
    }, []);  // [] signifie que cet effet s'exécutera uniquement lors du montage du composant

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/down');  // API pour récupérer le nombre de membres
                setDown(response.data.depense);  // Mise à jour du nombre de membres
            } catch (error) {
                console.error('Erreur lors de la récupération du nombre de membres:', error);
            }
        };

        fetchData();  // Appel de la fonction pour récupérer les données
    }, []);  // [] signifie que cet effet s'exécutera uniquement lors du montage du composant
    const username = sessionStorage.getItem('username'); // Récupérer les données stockées
    console.log('Nom d\'utilisateur:', username);

    return(
        <>
            <div id="count" className="row">
                <div id="member" className="col-6 col-md-5 col-lg-4 rounded-3 shadow text-center mx-auto">
                    <h4>
                        <i className="bi bi-people me-4"></i>
                        Membres
                    </h4>
                    <h5>{ member }</h5>
                </div>

                <div id="cash" className="col-6 col-md-5 col-lg-4 rounded-3 shadow text-center mx-auto my-auto">
                    <h4>
                        <i className="bi bi-cash-coin me-4"></i>
                        Caisse
                    </h4>
                    <h5>{ coin.toLocaleString('fr-FR') } MGA</h5>
                </div>
            </div>

            <div className="row mt-5 text-center">
                <h4>Historique de transactions</h4>
                <div id="transaction" className="row col-10 shadow rounded-3 mx-auto mt-3 my-auto">
                    <div className="col-6 text-success my-auto">
                        <h5>
                            <i className="bi bi-arrow-up me-2"></i>
                            { up.toLocaleString('fr-FR') } MGA
                        </h5>
                    </div>

                    <div className="col-6 text-danger my-auto">
                        <h5>
                            <i className="bi bi-arrow-down me-2"></i>
                            { down.toLocaleString('fr-FR') } MGA
                        </h5>
                    </div>
                </div>
            </div>
        </>
    )
}

function Graph1(){
    const data = {
        labels: ['Members', 'Coins'],
        datasets: [
          {
            label: 'Data',
            data: [100, 200],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1,
          },
        ],
      };
    
      return (
            <div className="graph">
              <Doughnut data={data} />
            </div>
      );
}

function Graph2(){
    const data = {
        labels: ['Members', 'Coins'],
        datasets: [
          {
            label: 'Data',
            data: [130, 100],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1,
          },
        ],
      };
    
      return (
            <div className="graph">
              <Doughnut data={data} />
            </div>
      );
}

export default Dashboard;
