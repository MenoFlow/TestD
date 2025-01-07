import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
function Users(){

    return(
        <>
            <div className="container mt-5">
                <List />
            </div>
        </>
    )
}

function List() {
  
    const [isFormVisible,setFormVisible] = useState(false)
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState([])
    console.log(isFormVisible)
    useEffect(() => {
      const fetchMembres = async () => {
          try {
            const response = await axios.get("https://test-d-two.vercel.app/api/users");
            setUsers(response.data);
          } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
          }
        };
      fetchMembres();
    }, []);
  
      // Supprimer un utilisateur
      const handleDeleteUser = async (username) => {
        try {
          await axios.delete(`/api/users/${username}`);
          try {
            const response = await axios.get("https://test-d-two.vercel.app/api/users");
            setUsers(response.data);
          } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du membre", error);
        }
      };
      // const handleEditThis = (username) => {
      //   setFormVisible(true)
      //   setUsername(username)
      // }

    return (
        <div className="row text-center">
            <h3 className="mt-2">Utilisateurs :</h3>
            <div className="row">
                <div className="col-1">
                    <button onClick={() => setFormVisible(true) } className="btn btn-dark">
                        <i className="bi bi-plus"></i>
                    </button>
                </div>
            </div>
            <table className="table table-responsive mt-3">
                <thead>
                    <tr>
                        <th>Nom d'utilisateur</th>
                        <th>Numero</th>
                        <th>Privilège</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.telephone}</td>
                    <td>{user.privilege}</td>
                    <td>
                      {/* <button className="btn btn-sm" onClick={()=>handleEditThis(user.username)}>
                        <i className="bi bi-pencil"></i>
                      </button> */}
                      <button className="btn btn-sm text-danger" onClick={() => handleDeleteUser(user.username)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
            </table>

            <Form username={username} isVisible = {isFormVisible} onClose={() => {setFormVisible(false)}} />
        </div>
    );
}
// if (!isVisible) return null;

// const [users, setUsers] = useState([])

// useEffect(() => {
//   const fetchMembres = async () => {
//       try {
//         const response = await axios.get("https://test-d-two.vercel.app/api/usersManage/"+username);
//         setUsers(response.data);
//       } catch (error) {
//         console.error("Erreur lors du chargement des utilisateurs", error);
//       }
//     };
//   fetchMembres();
// }, []);


function Form({ isVisible, onConfirm, onClose }) {

  if (!isVisible) return null;

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordSecond: "",
    telephone: "",
    privilege: "Simple_user"
    
  });
  const [message, setMessage] = useState('');
  console.log(isVisible)

  useEffect(() => {
    if (formData.password !== formData.passwordSecond){
      setMessage("Mot de passe non identique")
    } else {
      setMessage("Mot de passe identique")
    }
  })

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
      if (formData.password === formData.passwordSecond){
        const response = await axios.post('https://test-d-two.vercel.app/api/register', formData)
        if (response.error){
          console.log("error on the post")
        }
        else {
          console.log("success to post data")
        }
      }
      else {
        console.log("passwords don't matched")
      }
    }

    return (
      <div className="modal-overlay">
        <div className="modal-container2">
          <h3>Utilisateur</h3>
  
          <div className="row">
            <label htmlFor="type">Nom d'utilisateur :</label>
            <input name="username" type="text" className="form-control" onChange={handleChange} />
          </div>

          <div className="row">
            <label htmlFor="type">Mot de passe :</label>
            <input name="password" type="password" className="form-control"  onChange={handleChange} />
          </div>

          <div className="row">
            <label htmlFor="type">Confirmez le mot de passe :</label>
            <input name="passwordSecond" type="password" className="form-control"  onChange={handleChange} />
          </div>
          <p className={message === "Mot de passe identique" ? "text-success" : "text-danger"}>
              {message}
          </p>

          <div className="row">
            <label htmlFor="type">Telephone :</label>
            <input name="telephone" type="text" className="form-control"  onChange={handleChange} />
          </div>

          <div className="row">
            <label htmlFor="Privilège">Privilège :</label>
            <select name="privilege" className="form-select"  onChange={handleChange} >
                <option value="simple_user">Simple utilisateur</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrateur</option>
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

export default Users