import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaDownload, FaSearch, FaPlusCircle, FaArrowDown, FaArrowUp } from "react-icons/fa";
import styles from "./Propostas.module.css";
import noDataImg from "../assets/no-data.png";
import { getPropostas, deleteProposta } from "../data/propostasMock";
import ProposalDetailModal from "../components/proposals/ProposalDetailModal";

const Propostas = () => {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // Novo estado para filtro de status
  const [filterType, setFilterType] = useState(""); // Novo estado para filtro de tipo
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const loadProposals = () => {
    setPropostas(getPropostas());
  };

  useEffect(() => {
    loadProposals();
    const handleStorageChange = (e) => {
      if (e.key === 'propostas') {
        loadProposals();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sorted = [...propostas].sort((a, b) => {
      const aValue = (a[key] || "").toString().toLowerCase();
      const bValue = (b[key] || "").toString().toLowerCase();

      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setPropostas(sorted);
  };

  const handleEditProposal = (proposal) => {
    navigate("/adicionar-proposta", { state: { proposalToEdit: proposal } });
  };

  const handleDeleteProposal = (id) => {
    if (window.confirm("Deseja realmente excluir esta proposta?")) {
      deleteProposta(id);
      loadProposals();
      setSelectedProposal(null);
      setShowDetailModal(false);
    }
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetailModal(true);
  };

  const handleDownloadPdf = (proposal) => {
    alert(`Baixando PDF da proposta de ${proposal.cliente}! (Simulação rápida)`);
  };

  // Filtrar propostas com base no termo de busca e nos novos filtros
  const filteredPropostas = propostas.filter(prop => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = (
      (prop.cliente || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (prop.tipo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (prop.validoPor || '').toLowerCase().includes(lowerCaseSearchTerm)
    );

    const matchesStatus = filterStatus ? (prop.status === filterStatus) : true;
    const matchesType = filterType ? (prop.tipo === filterType) : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className={styles.propostasContainer}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Minhas Propostas</h1>
        <div className={styles.actionsGroup}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar proposta..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar proposta"
            />
          </div>

          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="">Todos os Status</option>
            <option value="enviadas">Enviadas</option>
            <option value="negociacao">Em Negociação</option>
            <option value="aprovada">Aprovadas</option>
            <option value="reprovada">Reprovadas</option>
            <option value="fechamento">Fechamento</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Filtrar por tipo"
          >
            <option value="">Todos os Tipos</option>
            <option value="contrato">Contrato</option>
            <option value="avulso">Avulso</option>
            <option value="ambos">Ambos</option>
          </select>

          <button
            className={styles.btnNovaProposta}
            onClick={() => navigate("/adicionar-proposta")}
            aria-label="Criar nova proposta"
          >
            <FaPlusCircle /> Criar Nova Proposta
          </button>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {["cliente", "tipo", "validoPor", "status", "dataCriacao"].map((col) => (
                <th key={col} onClick={() => requestSort(col)} className={styles.th}>
                  {col === "cliente" && "Cliente"}
                  {col === "tipo" && "Tipo"}
                  {col === "validoPor" && "Validade"}
                  {col === "status" && "Status"}
                  {col === "dataCriacao" && "Criação"}
                  {sortConfig.key === col && (
                    <span className={styles.sortIcon}>
                      {sortConfig.direction === "ascending" ? <FaArrowUp /> : <FaArrowDown />}
                    </span>
                  )}
                </th>
              ))}
              <th className={styles.thActions}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPropostas.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyMessage}>
                  {propostas.length === 0 && !searchTerm && !filterStatus && !filterType ? (
                    <div className={styles.emptyMessageContent}>
                      <img src={noDataImg} alt="Nenhuma proposta encontrada" className={styles.emptyImage} />
                      <p className={styles.emptyMessageTitle}>Nenhuma proposta salva ainda</p>
                      <p className={styles.emptyMessageText}>
                        Comece agora a criar suas propostas e acompanhe todas elas aqui de forma rápida e fácil!
                      </p>
                      <button className={styles.startButton} onClick={() => navigate("/adicionar-proposta")}>
                        <FaPlusCircle /> Criar Nova Proposta
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className={styles.emptyMessageTitle}>Nenhuma proposta encontrada.</p>
                      <p className={styles.emptyMessageText}>Tente ajustar sua busca ou seus filtros.</p>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filteredPropostas.map((prop) => (
                <tr key={prop.id} onClick={() => handleViewDetails(prop)} className={styles.tableRow}>
                  <td data-label="Cliente">{prop.cliente}</td>
                  <td data-label="Tipo">{prop.tipo}</td>
                  <td data-label="Validade">{prop.validoPor}</td>
                  <td data-label="Status">
                    <span className={`${styles.statusBadge} ${styles[prop.status]}`}>
                      {prop.status ? prop.status.toUpperCase() : 'N/A'}
                    </span>
                  </td>
                  <td data-label="Criação">{new Date(prop.dataCriacao).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditProposal(prop); }}
                      aria-label={`Editar proposta ${prop.cliente}`}
                      className={styles.btnAction}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownloadPdf(prop); }}
                      aria-label={`Baixar PDF da proposta ${prop.cliente}`}
                      className={styles.btnAction}
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProposal(prop.id); }}
                      aria-label={`Excluir proposta ${prop.cliente}`}
                      className={`${styles.btnAction} ${styles.btnDelete}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProposalDetailModal
        show={showDetailModal}
        proposal={selectedProposal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedProposal(null);
        }}
      />
    </div>
  );
};

export default Propostas;