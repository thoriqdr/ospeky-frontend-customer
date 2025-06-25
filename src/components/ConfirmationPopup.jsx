// src/components/ConfirmationPopup.jsx (Sudah dimodifikasi)

import React from 'react';
import './ConfirmationPopup.css';

const ConfirmationPopup = ({ title, message, onConfirm, onCancel, confirmText, cancelText, isAlertMode = false }) => {
  // Jika dalam mode alert, onCancel akan sama dengan onConfirm,
  // ini berguna jika pengguna menutup popup dengan mengklik overlay.
  const handleOverlayClick = isAlertMode ? onConfirm : onCancel;

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-content confirmation-popup" onClick={(e) => e.stopPropagation()}>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className={`popup-actions ${isAlertMode ? 'single-action' : ''}`}>
          {!isAlertMode && (
            <button className="btn-secondary" onClick={onCancel}>
              {cancelText || 'Batalkan'}
            </button>
          )}
          <button className="btn-primary" onClick={onConfirm}>
            {confirmText || (isAlertMode ? 'OK' : 'Lanjutkan')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;