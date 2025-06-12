// src/data/clientesMock.js

let clientes = [];

// Carrega clientes do localStorage ao inicializar
if (typeof window !== 'undefined') {
  const storedClients = localStorage.getItem('clientes');
  if (storedClients) {
    clientes = JSON.parse(storedClients);
  }
}

export const getClientes = () => {
  return clientes;
};

export const saveCliente = (novoCliente) => {
  const existingIndex = clientes.findIndex(c => c.id === novoCliente.id);

  if (existingIndex > -1) {
    const existingHistory = clientes[existingIndex].proposals_history || [];
    clientes[existingIndex] = {
      ...clientes[existingIndex],
      ...novoCliente,
      proposals_history: existingHistory // Garante que o histórico não seja sobrescrito
    };
  } else {
    novoCliente.id = Date.now(); // Gera um ID único para o novo cliente
    novoCliente.proposals_history = []; // Inicializa o histórico de propostas para o novo cliente
    clientes.push(novoCliente);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }
  return novoCliente;
};

export const deleteCliente = (id) => {
  clientes = clientes.filter(cliente => cliente.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }
  return id;
};

// **NOVA FUNÇÃO:** Para adicionar/atualizar uma proposta no histórico do cliente
export const addProposalToClientHistory = (clientId, proposalId, proposalName, status, value, date) => {
  const clientIndex = clientes.findIndex(c => c.id === clientId);
  if (clientIndex > -1) {
    if (!clientes[clientIndex].proposals_history) {
      clientes[clientIndex].proposals_history = [];
    }

    // Procura por uma entrada existente para esta proposta (se já foi adicionada antes)
    const historyEntryIndex = clientes[clientIndex].proposals_history.findIndex(item => item.proposalId === proposalId);

    const newHistoryEntry = {
      proposalId,
      proposalName,
      status,
      value,
      date,
      lastUpdated: new Date().toISOString(), // Para saber quando foi a última atualização
    };

    if (historyEntryIndex > -1) {
      // Atualiza a entrada existente
      clientes[clientIndex].proposals_history[historyEntryIndex] = newHistoryEntry;
    } else {
      // Adiciona uma nova entrada
      clientes[clientIndex].proposals_history.push(newHistoryEntry);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('clientes', JSON.stringify(clientes));
    }
  }
};

// **NOVA FUNÇÃO:** Para remover uma proposta do histórico do cliente (ao deletar a proposta principal)
export const removeProposalFromClientHistory = (clientId, proposalId) => {
    const clientIndex = clientes.findIndex(c => c.id === clientId);
    if (clientIndex > -1 && clientes[clientIndex].proposals_history) {
        clientes[clientIndex].proposals_history = clientes[clientIndex].proposals_history.filter(
            item => item.proposalId !== proposalId
        );
        if (typeof window !== 'undefined') {
            localStorage.setItem('clientes', JSON.stringify(clientes));
        }
    }
};