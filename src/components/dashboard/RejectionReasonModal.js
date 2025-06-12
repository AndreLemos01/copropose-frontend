// src/components/dashboard/RejectionReasonModal.jsx
import React, { useState } from 'react';
import styles from './RejectionReasonModal.module.css'; // Criaremos este CSS

const RejectionReasonModal = ({ show, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('Preço');
  const [otherReason, setOtherReason] = useState('');

  const reasons = ['Preço', 'Prazo', 'Escopo', 'Concorrência', 'Outros'];

  if (!show) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(reason === 'Outros' ? otherReason : reason);
    setReason('Preço'); // Reseta estado
    setOtherReason(''); // Reseta estado
  };

  const handleCancel = () => {
    onCancel();
    setReason('Preço'); // Reseta estado
    setOtherReason(''); // Reseta estado
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Motivo da Reprovação</h3>
        <p className={styles.message}>Por favor, selecione ou digite o motivo da reprovação da proposta:</p>

        <div className={styles.reasonSelection}>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className={styles.select}>
            {reasons.map((r, index) => (
              <option key={index} value={r}>{r}</option>
            ))}
          </select>
          {reason === 'Outros' && (
            <textarea
              className={styles.textarea}
              placeholder="Descreva o outro motivo..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              rows="3"
            />
          )}
        </div>

        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancel}>
            Cancelar
          </button>
          <button className={`${styles.button} ${styles.confirmButton}`} onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal;