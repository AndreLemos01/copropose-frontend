import React, { useState, useRef, useEffect } from 'react';
import styles from './CRMcard.module.css';
import { FaEllipsisV, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal';
import RejectionReasonModal from './RejectionReasonModal';

function CRMCard({ item, provided, snapshot, onDelete, onUpdateStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false); // Correct state variable and setter
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    setMenuOpen(false);
    navigate('/adicionar-proposta', { state: { proposalToEdit: item.fullProposta } });
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowConfirmDeleteModal(false); // Corrected setter name
    if (onDelete) onDelete(item.id);
  };

  const cancelDelete = () => {
    setShowConfirmDeleteModal(false); // Corrected setter name
  };

  const handleApprove = () => {
    setMenuOpen(false);
    if (onUpdateStatus) {
      onUpdateStatus(item.id, 'aprovada');
    }
  };

  const handleRejectClick = () => {
    setMenuOpen(false);
    setShowRejectionModal(true);
  };

  const confirmReject = (reason) => {
    setShowRejectionModal(false);
    if (onUpdateStatus) {
      onUpdateStatus(item.id, 'reprovada', reason);
    }
  };

  const cancelReject = () => {
    setShowRejectionModal(false);
  };

  const handleGenerateContract = () => {
    alert(`Gerando contrato para a proposta de ${item.nome}!`);
  };

  const handleViewRejectionReason = () => {
    alert(`Motivo da Reprovação para ${item.nome}: ${item.fullProposta?.rejectionReason || 'Não especificado'}`);
  };

  const isApproved = item.fullProposta?.status === 'aprovada';
  const isRejected = item.fullProposta?.status === 'reprovada';

  return (
    <>
      <div
        className={`${styles.kanbanCard} ${
          snapshot.isDragging ? styles.dragging : ''
        }`}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div className={styles.cardActionsMenu} ref={menuRef}>
          <button
            className={styles.menuButton}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Opções do card"
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <ul className={styles.menuDropdown}>
              <li onClick={handleEdit}>
                <FaEdit /> Editar
              </li>
              {!isApproved && !isRejected && (
                <>
                  <li onClick={handleApprove}>
                    <FaCheckCircle /> Aprovar
                  </li>
                  <li onClick={handleRejectClick}>
                    <FaTimesCircle /> Reprovar
                  </li>
                </>
              )}
              {isApproved && (
                <li onClick={handleGenerateContract}>
                  <FaFileAlt /> Gerar Contrato
                </li>
              )}
              {isRejected && (
                <li onClick={handleViewRejectionReason}>
                  <FaTimesCircle /> Ver Motivo
                </li>
              )}
              <li onClick={handleDeleteClick}>
                <FaTrash /> Excluir
              </li>
            </ul>
          )}
        </div>

        <h4 className={styles.clientName}>{item.nome}</h4>
        <p className={styles.clientProposal}>
          {item.proposta.itens} itens - R$ {item.proposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        {(item.fullProposta?.status) && (
            <span className={`${styles.statusBadge} ${isApproved ? styles.approved : styles.rejected}`}>
                {isApproved ? 'APROVADA' : 'REPROVADA'}
            </span>
        )}
      </div>

      <ConfirmationModal
        show={showConfirmDeleteModal}
        message={`Você tem certeza que deseja excluir a proposta de "${item.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <RejectionReasonModal
        show={showRejectionModal}
        onConfirm={confirmReject}
        onCancel={cancelReject}
      />
    </>
  );
}

export default CRMCard;