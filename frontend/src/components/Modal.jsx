
import PropTypes from 'prop-types';

function Modal({ title, message, isVisible, onConfirm, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-outline-success" onClick={onConfirm}>
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

Modal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default Modal;
