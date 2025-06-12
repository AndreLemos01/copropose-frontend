import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigContext } from "../context/ConfigContext"; // Import corrigido
import {
  FaEdit,
  FaFileAlt,
  FaCreditCard,
  FaClock,
  FaFileSignature,
  FaListAlt,
  FaArrowLeft,
} from "react-icons/fa";
import Introducao from "../components/configuracoes/Introducao";
import ModeloTexto from "../components/configuracoes/ModeloTexto";
import FormaPagamento from "../components/configuracoes/FormaPagamento";
import PrazoValidade from "../components/configuracoes/PrazoValidade";
import PapelTimbrado from "../components/configuracoes/PapelTimbrado";
import ItensDaProposta from "../components/configuracoes/ItensDaProposta";

import styles from "./ConfiguracoesProposta.module.css";

const ConfiguracoesProposta = () => {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("introducao");
  const {
    modelosTexto,
    setModelosTexto,
    formasPagamento,
    setFormasPagamento,
    prazosValidade,
    setPrazosValidade,
    introducoes,
    setIntroducoes,
    papeisTimbrados,
    setPapeisTimbrados,
  } = useContext(ConfigContext);

  const renderAba = () => {
    switch (abaAtiva) {
      case "introducao":
        return <Introducao introducoes={introducoes} setIntroducoes={setIntroducoes} />;
      case "modeloTexto":
        return (
          <ModeloTexto modelosTexto={modelosTexto} setModelosTexto={setModelosTexto} />
        );
      case "formaPagamento":
        return (
          <FormaPagamento
            formasPagamento={formasPagamento}
            setFormasPagamento={setFormasPagamento}
          />
        );
      case "prazoValidade":
        return (
          <PrazoValidade
            prazosValidade={prazosValidade}
            setPrazosValidade={setPrazosValidade}
          />
        );
      case "papelTimbrado":
        return (
          <PapelTimbrado
            papeisTimbrados={papeisTimbrados}
            setPapeisTimbrados={setPapeisTimbrados}
          />
        );
      case "itensDaProposta":
        return <ItensDaProposta />;
      default:
        return <Introducao introducoes={introducoes} setIntroducoes={setIntroducoes} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate("/adicionar-proposta")}
          className={styles.btnVoltar}
          aria-label="Voltar para Adicionar Proposta"
          type="button"
        >
          <FaArrowLeft />
          <span>Voltar</span>
        </button>

        <h2 className={styles.title}>Configurações da Proposta</h2>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            abaAtiva === "introducao" ? styles.active : ""
          }`}
          onClick={() => setAbaAtiva("introducao")}
          type="button"
        >
          <FaEdit />
          Introdução
        </button>
        <button
          className={`${styles.tabButton} ${
            abaAtiva === "modeloTexto" ? styles.active : ""
          }`}
          onClick={() => setAbaAtiva("modeloTexto")}
          type="button"
        >
          <FaFileAlt />
          Modelo de Texto
        </button>
        <button
          className={`${styles.tabButton} ${
            abaAtiva === "formaPagamento" ? styles.active : ""
          }`}
          onClick={() => setAbaAtiva("formaPagamento")}
          type="button"
        >
          <FaCreditCard />
          Forma de Pagamento
        </button>
        <button
          className={`${styles.tabButton} ${
            abaAtiva === "prazoValidade" ? styles.active : ""
          }`}
          onClick={() => setAbaAtiva("prazoValidade")}
          type="button"
        >
          <FaClock />
          Validade
        </button>
        <button
          className={`${styles.tabButton} ${
            abaAtiva === "papelTimbrado" ? styles.active : ""
          }`}
          onClick={() => setAbaAtiva("papelTimbrado")}
          type="button"
        >
          <FaFileSignature />
          Papel Timbrado
        </button>
        <button
          className={`${styles.tabButton} ${
            abaAtiva === "itensDaProposta" ? styles.active : ""
          }`}
          onClick={() => setAbaAtiva("itensDaProposta")}
          type="button"
        >
          <FaListAlt />
          Itens da Proposta
        </button>
      </div>

      <div className={styles.content}>{renderAba()}</div>
    </div>
  );
};

export default ConfiguracoesProposta;
