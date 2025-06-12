// src/components/configuracoes/PapelTimbrado.js
import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaRegFileAlt, FaFileUpload } from "react-icons/fa"; // Adicionado FaFileUpload
import toast from "react-hot-toast";
import styles from "./PapelTimbrado.module.css";

// REMOVIDO: PAPEIS_TIMBRADOS_PADRAO
// O componente agora inicia completamente vazio, sem modelos padrão pré-definidos.

const PapelTimbrado = ({ papeisTimbrados, setPapeisTimbrados }) => {
  const [novoPapelTimbrado, setNovoPapelTimbrado] = useState("");

  // Não há useEffect para carregar padrões aqui, pois o objetivo é iniciar vazio.
  // A inicialização vazia virá diretamente do ConfigContext.

  const handleAdicionarPapelTimbrado = () => {
    if (!novoPapelTimbrado.trim()) {
      toast.error("O nome do modelo não pode ser vazio.");
      return;
    }
    if (papeisTimbrados.includes(novoPapelTimbrado.trim())) {
      toast.error("Este modelo já existe.");
      return;
    }
    setPapeisTimbrados([...papeisTimbrados, novoPapelTimbrado.trim()]);
    setNovoPapelTimbrado("");
    toast.success("Modelo de papel timbrado adicionado!");
  };

  const handleRemoverPapelTimbrado = (item) => {
    // Não há verificação para "modelos padrão" aqui, pois não existem mais.
    if (window.confirm(`Tem certeza que deseja remover o modelo "${item}"?`)) {
      const updatedList = papeisTimbrados.filter((i) => i !== item);
      setPapeisTimbrados(updatedList);
      toast.success("Modelo de papel timbrado removido!");
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Modelos de Papel Timbrado</h3>
      
      <div className={styles.addForm}>
        <input
          type="text"
          value={novoPapelTimbrado}
          onChange={(e) => setNovoPapelTimbrado(e.target.value)}
          placeholder="Nome do modelo (Ex: 'Timbrado Personalizado')"
          className={styles.input}
        />
        <button 
          onClick={handleAdicionarPapelTimbrado} 
          className={styles.addButton}
          disabled={!novoPapelTimbrado.trim()}
        >
          <FaPlus /> Adicionar Modelo
        </button>
        {/* Futuro slot para o botão/funcionalidade de upload de PDF */}
        {/* <button className={styles.uploadButton} disabled><FaFileUpload /> Upload PDF</button> */}
      </div>
      
      <ul className={styles.list}>
        {papeisTimbrados.length === 0 ? (
          <p className={styles.noItemsMessage}>
            Nenhum modelo de papel timbrado configurado. 
            Comece adicionando um nome de modelo acima!
            (Funcionalidade de upload de PDF não disponível nesta versão.)
          </p>
        ) : (
          papeisTimbrados.map((item, index) => (
            <li key={index} className={styles.listItem}>
              <div className={styles.itemContent}>
                <FaRegFileAlt className={styles.itemIcon} />
                <span>{item}</span>
              </div>
              <button 
                onClick={() => handleRemoverPapelTimbrado(item)} 
                className={styles.removeButton}
                aria-label={`Remover ${item}`}
              >
                <FaTrash />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PapelTimbrado;