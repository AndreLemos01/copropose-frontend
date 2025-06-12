// src/data/propostasMock.js

let propostas = [];

// Carrega propostas do localStorage ao inicializar
if (typeof window !== 'undefined') {
  const storedPropostas = localStorage.getItem('propostas');
  if (storedPropostas) {
    propostas = JSON.parse(storedPropostas);
  }
}

export const getPropostas = () => {
  return propostas;
};

// Nova função para adicionar um evento ao histórico da proposta
export const addEventToPropostaHistory = (proposalId, eventType, details = {}) => {
  const proposalIndex = propostas.findIndex(p => String(p.id) === String(proposalId));
  if (proposalIndex > -1) {
    if (!propostas[proposalIndex].history) {
      propostas[proposalIndex].history = [];
    }
    const newEvent = {
      timestamp: new Date().toISOString(),
      type: eventType,
      ...details,
    };
    propostas[proposalIndex].history.push(newEvent);
    if (typeof window !== 'undefined') {
      localStorage.setItem('propostas', JSON.stringify(propostas));
    }
  }
};


export const saveProposta = (novaProposta) => {
  const existingIndex = propostas.findIndex(p => String(p.id) === String(novaProposta.id));

  if (existingIndex > -1) {
    // Atualiza proposta existente
    const oldStatus = propostas[existingIndex].status; // Pega o status antigo
    propostas[existingIndex] = { ...propostas[existingIndex], ...novaProposta };

    // Se o status mudou ou foi editada, registra no histórico
    if (oldStatus !== novaProposta.status) {
        addEventToPropostaHistory(novaProposta.id, 'Status Alterado', {
            from: oldStatus,
            to: novaProposta.status
        });
    } else {
        addEventToPropostaHistory(novaProposta.id, 'Proposta Editada');
    }

  } else {
    // Adiciona nova proposta
    novaProposta.id = Date.now(); // Gera um ID único
    novaProposta.dataCriacao = new Date().toISOString();
    novaProposta.history = []; // Inicializa o histórico para nova proposta
    propostas.push(novaProposta);
    addEventToPropostaHistory(novaProposta.id, 'Proposta Criada'); // Registra criação
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('propostas', JSON.stringify(propostas));
  }
  return novaProposta;
};

export const deleteProposta = (id) => {
  propostas = propostas.filter(prop => String(prop.id) !== String(id));
  if (typeof window !== 'undefined') {
    localStorage.setItem('propostas', JSON.stringify(propostas));
  }
  // Não há necessidade de adicionar evento para proposta deletada, pois ela não existirá mais.
  return id;
};

// Modifica updatePropostaStatus para usar addEventToPropostaHistory
export const updatePropostaStatus = (id, newStatus, reason = null) => {
  const proposalIndex = propostas.findIndex(p => String(p.id) === String(id));
  if (proposalIndex > -1) {
    const oldStatus = propostas[proposalIndex].status;
    propostas[proposalIndex].status = newStatus;
    if (reason) {
      propostas[proposalIndex].rejectionReason = reason;
    } else {
      delete propostas[proposalIndex].rejectionReason;
    }

    // Registra mudança de status no histórico
    if (oldStatus !== newStatus) {
      addEventToPropostaHistory(id, 'Status Alterado', {
        from: oldStatus,
        to: newStatus,
        reason: reason,
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('propostas', JSON.stringify(propostas));
    }
    return propostas[proposalIndex];
  }
  return null;
};