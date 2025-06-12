import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom"; // Removido useLocation
import { FaArrowDown, FaArrowUp, FaTrash, FaUserPlus, FaEdit, FaSearch } from "react-icons/fa";
import NovoCliente from "./NovoCliente";
import styles from "./Clientes.module.css";
import { getClientes, deleteCliente } from "../data/clientesMock";

const Clientes = () => {
  // Removido 'location' pois não está sendo usado
  // const location = useLocation();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadClients = () => {
    setClientes(getClientes());
  };

  useEffect(() => {
    loadClients();
    const handleStorageChange = (e) => {
      if (e.key === 'clientes') {
        loadClients();
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
    const sorted = [...clientes].sort((a, b) => {
      const aValue = (a[key] || "").toString().toLowerCase();
      const bValue = (b[key] || "").toString().toLowerCase();

      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setClientes(sorted);
  };

  const excluirCliente = (id) => {
    if (window.confirm("Deseja realmente excluir este cliente?")) {
      deleteCliente(id);
      loadClients();
    }
  };

  const editarCliente = (cliente) => {
    navigate("novo-cliente", { state: { clientToEdit: cliente } });
  };

  const filteredClientes = clientes.filter(cliente => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      (cliente.nome || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cliente.cpf_cnpj || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cliente.email || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cliente.telefone || '').toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className={styles.clientesContainer}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Cadastro de Clientes</h1>
        <div className={styles.actionsGroup}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar cliente"
            />
          </div>
          <button
            className={styles.btnNovoCliente}
            onClick={() => navigate("novo-cliente")}
            aria-label="Adicionar novo cliente"
          >
            <FaUserPlus /> Novo Cliente
          </button>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {["nome", "cpf_cnpj", "email", "telefone", "situacao"].map((col) => (
                <th key={col} onClick={() => requestSort(col)} className={styles.th}>
                  {col === "nome" && "Nome"}
                  {col === "cpf_cnpj" && "CPF / CNPJ"}
                  {col === "email" && "E-mail"}
                  {col === "telefone" && "Telefone"}
                  {col === "situacao" && "Status"}
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
            {filteredClientes.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyMessage}>
                  {clientes.length === 0 && !searchTerm ? (
                    <>
                      <p className={styles.emptyMessageTitle}>Nenhum cliente cadastrado ainda.</p>
                      <p className={styles.emptyMessageText}>Comece adicionando seu primeiro cliente!</p>
                      <button className={styles.startButton} onClick={() => navigate("novo-cliente")}>
                        <FaUserPlus /> Adicionar Cliente
                      </button>
                    </>
                  ) : (
                    <>
                      <p className={styles.emptyMessageTitle}>Nenhum cliente encontrado.</p>
                      <p className={styles.emptyMessageText}>Tente ajustar sua busca ou adicione um novo cliente.</p>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filteredClientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className={selectedClient && selectedClient.id === cliente.id ? styles.selectedRow : ""}
                  onClick={() => setSelectedClient(cliente)}
                >
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf_cnpj}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.situacao || "Ativo"}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editarCliente(cliente);
                      }}
                      aria-label={`Editar cliente ${cliente.nome}`}
                      className={styles.btnEdit}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        excluirCliente(cliente.id);
                      }}
                      aria-label={`Excluir cliente ${cliente.nome}`}
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

      <Routes>
        <Route
          path="novo-cliente"
          element={
            <NovoCliente
              onClose={() => {
                navigate("/clientes");
                loadClients();
              }}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Clientes;