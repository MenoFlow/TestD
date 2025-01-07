import { useState } from "react";

function Com(){


    return(
        <>

            <div className="container mt-5 text-center">
                <h3 className="mt-5">Envoyer des message</h3>

                <form className="mt-4">
                    <div className="row col-12  col-md-7 col-lg-6 mx-auto">
                        <label htmlFor="">Destination :</label>
                        <select name="destination" className="form-select">
                            <option value="tout">Tout le monde</option>
                            <option value="admin">Membre de bureau</option>
                        </select>
                    </div>
                    <div className="row col-12 col-md-7 col-lg-6 mx-auto mt-4">
                        <label htmlFor="message">Texte : </label>
                        <textarea className="form-control" name="message" rows="10"></textarea>
                    </div>

                    <button type="submit" className="btn btn-success mt-4">Envoyer</button>

                </form>

            </div>
        </>
    )
}

export default Com;