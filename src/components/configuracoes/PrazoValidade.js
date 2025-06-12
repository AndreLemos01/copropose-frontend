import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; // Importar ícone de lixeira
import toast from "react-hot-toast"; // Importar toast
import styles from "./PrazoValidade.module.css";

// Prazos de validade padrão
const PRAZOS_VALIDADE_PADRAO = ["07 Dias", "15 Dias", "30 Dias", "60 Dias", "90 Dias"];

const PrazoValidade = ({ prazosValidade, setPrazosValidade }) => {
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("Dias");

  // Garante que os prazos padrão estejam presentes na inicialização, se não houver nenhum
  useEffect(() => {
    if (prazosValidade.length === 0) {
      setPrazosValidade(PRAZOS_VALIDADE_PADRAO);
    }
  }, [prazosValidade, setPrazosValidade]);


  const handleAdicionarPrazo = () => {
    if (!quantidade.trim()) {
      toast.error("Informe a quantidade para adicionar o prazo.");
      return;
    }
    const valor = `${quantidade.padStart(2, "0")} ${unidade}`;
    if (prazosValidade.includes(valor)) {
      toast.error("Este prazo de validade já existe.");
      return;
    }
    setPrazosValidade([...prazosValidade, valor]);
    setQuantidade("");
    setUnidade("Dias");
    toast.success("Prazo de validade adicionado!");
  };

  const handleRemoverPrazo = (item) => {
    if (window.confirm(`Tem certeza que deseja remover o prazo "${item}"?`)) {
      setPrazosValidade(prazosValidade.filter((i) => i !== item));
      toast.success("Prazo de validade removido!");
    }
  };

  // Limita o input para no máximo 2 dígitos numéricos
  const handleQuantidadeChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,2}$/.test(val)) {
      setQuantidade(val);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Validade da Proposta</h3>

      <div className={styles.inputGroup}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          value={quantidade}
          onChange={handleQuantidadeChange}
          placeholder="Qtd"
          className={styles.inputQuantidade}
          aria-label="Quantidade"
        />

        <select
          value={unidade}
          onChange={(e) => setUnidade(e.target.value)}
          className={styles.selectUnidade}
          aria-label="Unidade de tempo"
        >
          <option value="Dias">Dias</option>
          <option value="Meses">Meses</option>
          <option value="Ano">Ano</option>
        </select>

        <button
          onClick={handleAdicionarPrazo}
          className={styles.addButton}
          disabled={!quantidade.trim()}
          aria-label="Adicionar prazo de validade"
        >
          Adicionar
        </button>
      </div>

      <ul className={styles.list}>
        {prazosValidade.map((item, index) => (
          <li key={index} className={styles.listItem}>
            <span>{item}</span>
            <button
              onClick={() => handleRemoverPrazo(item)}
              className={styles.removeButton}
              aria-label={`Remover prazo ${item}`}
            >
              <FaTrash /> {/* Ícone de lixeira */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrazoValidade;