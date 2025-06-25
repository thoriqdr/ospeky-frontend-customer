import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  // Jika 'isOpen' adalah false, jangan render apa-apa
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Batal
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;