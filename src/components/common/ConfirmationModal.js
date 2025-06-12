
import React from 'react';
import styles from './ConfirmationModal.module.css'; // Estilos para o modal

const ConfirmationModal = ({ message, onConfirm, onCancel, show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onCancel}>
            Cancelar
          </button>
          <button className={`${styles.button} ${styles.confirmButton}`} onClick={onConfirm}>
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;