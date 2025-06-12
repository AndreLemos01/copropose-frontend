import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getPropostas, deleteProposta, updatePropostaStatus } from '../../data/propostasMock.js';
import CRMCard from './CRMcard';
import styles from './CRM.module.css';
import toast from 'react-hot-toast'; // Importa a biblioteca toast

// Dados iniciais do CRM - AGORA COM COLUNAS PARA REPROVADAS
const initialCRMData = {
  columns: {
    enviadas: {
      name: 'Enviadas',
      items: [],
    },
    negociacao: {
      name: 'Em negociação',
      items: [],
    },
    aprovadas: {
      name: 'Aprovadas',
      items: [],
    },
    reprovadas: {
      name: 'Reprovadas',
      items: [],
    },
    fechamento: {
      name: 'Fechamento',
      items: [],
    },
  },
  columnOrder: ['enviadas', 'negociacao', 'aprovadas', 'reprovadas', 'fechamento'],
};

function CRM() {
  const [data, setData] = useState(initialCRMData);

  // Função para carregar propostas e popular as colunas
  const loadProposalsIntoKanban = () => {
    const allProposals = getPropostas();
    const newColumns = JSON.parse(JSON.stringify(initialCRMData.columns));

    allProposals.forEach(p => {
      const proposalStatus = p.status || 'enviadas';

      const cardItem = {
        id: String(p.id),
        nome: p.cliente,
        proposta: {
          itens: p.itensSelecionados.length,
          valor: p.itensSelecionados.reduce((acc, item) => acc + (item.quantidade * item.valor), 0),
          fullProposta: { ...p, status: proposalStatus }
        }
      };

      switch (proposalStatus) {
        case 'aprovada':
          newColumns.aprovadas.items.push(cardItem);
          break;
        case 'reprovada':
          newColumns.reprovadas.items.push(cardItem);
          break;
        case 'negociacao':
          newColumns.negociacao.items.push(cardItem);
          break;
        case 'fechamento':
          newColumns.fechamento.items.push(cardItem);
          break;
        case 'enviadas':
        default:
          newColumns.enviadas.items.push(cardItem);
          break;
      }
    });

    setData(prevData => ({
      ...prevData,
      columns: newColumns,
    }));
  };

  useEffect(() => {
    loadProposalsIntoKanban();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'propostas') {
        loadProposalsIntoKanban();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  function onDragEnd(result) {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    let destItems = [...destColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);

    // --- Lógica de Restrição de Movimento ---
    const sourceIndex = initialCRMData.columnOrder.indexOf(source.droppableId);
    const destIndex = initialCRMData.columnOrder.indexOf(destination.droppableId);

    // Impedir movimento para colunas à esquerda (índice menor)
    if (destIndex < sourceIndex) {
      toast.error("Não é possível mover o card para uma coluna à esquerda.");
      loadProposalsIntoKanban();
      return;
    }

    // Impedir que propostas aprovadas ou reprovadas sejam movidas
    const currentStatus = removed.fullProposta?.status;
    if (currentStatus === 'aprovada' || currentStatus === 'reprovada') {
        if (destination.droppableId !== currentStatus) {
            toast.error(`Proposta ${currentStatus === 'aprovada' ? 'aprovada' : 'reprovada'} não pode ser movida para outra fase.`);
            loadProposalsIntoKanban();
            return;
        }
    }
    // --- Fim da Lógica de Restrição ---

    // Atualiza o status da proposta no localStorage quando é movida de coluna
    const newStatus = destination.droppableId;
    updatePropostaStatus(removed.id, newStatus, removed.fullProposta?.rejectionReason);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      const newColumn = { ...sourceColumn, items: sourceItems };
      setData(prevData => ({
        ...prevData,
        columns: { ...prevData.columns, [source.droppableId]: newColumn },
      }));
    } else {
      destItems.splice(destination.index, 0, removed);
      setData(prevData => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [source.droppableId]: { ...sourceColumn, items: sourceItems },
          [destination.droppableId]: { ...destColumn, items: destItems },
        },
      }));
    }
  }

  const handleCRMCardDelete = (idToDelete) => {
    deleteProposta(idToDelete);
    loadProposalsIntoKanban();
  };

  const handleCRMCardUpdateStatus = (id, newStatus, reason = null) => {
    updatePropostaStatus(id, newStatus, reason);
    loadProposalsIntoKanban();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.kanbanContainer}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          return (
            <div key={columnId} className={styles.kanbanColumn}>
              <h3 className={styles.columnTitle}>{column.name}</h3>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    className={styles.droppableArea}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <CRMCard
                            item={item}
                            provided={provided}
                            snapshot={snapshot}
                            onDelete={handleCRMCardDelete}
                            onUpdateStatus={handleCRMCardUpdateStatus}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default CRM;