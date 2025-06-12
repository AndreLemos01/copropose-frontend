// src/components/clientes/AccordionEndereco.js
import React from "react";
import InputMask from "react-input-mask";
import styles from "./AccordionEndereco.module.css";
import correiosIcon from '../../icons/correios.png'; // Importe o ícone dos Correios

const AccordionEndereco = ({ dados, setDados, erros, validarCampo }) => {
  // Lista de siglas de todos os estados brasileiros
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
    "SP", "SE", "TO"
  ];

  const handleChange = (field, value) => {
    setDados({ ...dados, [field]: value });
    validarCampo(field, value); // Validação em tempo real
  };

  const handleBlur = (field, value) => {
    validarCampo(field, value); // Validação ao sair do campo
  };

  return (
    <div className={styles.accordionBody}>
      {/* 1ª linha: CEP */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <InputMask
          mask="99999-999"
          maskChar={null}
          placeholder="Digite o CEP"
          className={`${styles.inputCep} ${erros.cep ? styles.inputError : ""}`}
          value={dados.cep || ""}
          onChange={(e) => handleChange("cep", e.target.value)}
          onBlur={(e) => handleBlur("cep", e.target.value)} // Adicionado onBlur
          required
          aria-invalid={!!erros.cep}
          aria-describedby={erros.cep ? "error-cep" : undefined}
        />
        <button
          type="button"
          className={styles.correiosButton}
          title="Buscar endereço nos Correios"
          onClick={() =>
            window.open("https://buscacepinter.correios.com.br/app/endereco/index.php", "_blank")
          }
        >
          <img src={correiosIcon} alt="Ícone Correios" className={styles.correiosIconImage} /> {/* Usar a imagem */}
        </button>
      </div>
      {erros.cep && (
        <div id="error-cep" className={styles.errorMsg}>
          {erros.cep}
        </div>
      )}

      {/* 2ª linha: Logradouro (select), Endereço, Nº, Complemento */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
        <select
          className={`${styles.select} ${erros.logradouro ? styles.inputError : ""}`}
          value={dados.logradouro || ""}
          onChange={(e) => handleChange("logradouro", e.target.value)}
          onBlur={(e) => handleBlur("logradouro", e.target.value)} // Adicionado onBlur
          required
          aria-invalid={!!erros.logradouro}
          aria-describedby={erros.logradouro ? "error-logradouro" : undefined}
          style={{ flex: "1 1 150px" }}
        >
          <option value="">Logradouro*</option>
          <option value="Rua">Rua</option>
          <option value="Avenida">Avenida</option>
          <option value="Travessa">Travessa</option>
          <option value="Alameda">Alameda</option>
          <option value="Praça">Praça</option>
        </select>
        {erros.logradouro && (
          <div id="error-logradouro" className={styles.errorMsg}>
            {erros.logradouro}
          </div>
        )}

        <input
          type="text"
          placeholder="Endereço*"
          className={`${styles.input} ${erros.endereco ? styles.inputError : ""}`}
          value={dados.endereco || ""}
          onChange={(e) => handleChange("endereco", e.target.value)}
          onBlur={(e) => handleBlur("endereco", e.target.value)} // Adicionado onBlur
          required
          aria-invalid={!!erros.endereco}
          aria-describedby={erros.endereco ? "error-endereco" : undefined}
          style={{ flex: "2 1 200px" }}
        />
        {erros.endereco && (
          <div id="error-endereco" className={styles.errorMsg}>
            {erros.endereco}
          </div>
        )}

        <input
          type="text"
          placeholder="Nº*"
          className={`${styles.input} ${erros.numero ? styles.inputError : ""}`}
          value={dados.numero || ""}
          onChange={(e) => handleChange("numero", e.target.value)}
          onBlur={(e) => handleBlur("numero", e.target.value)} // Adicionado onBlur
          required
          aria-invalid={!!erros.numero}
          aria-describedby={erros.numero ? "error-numero" : undefined}
          style={{ flex: "1 1 100px" }}
        />
        {erros.numero && (
          <div id="error-numero" className={styles.errorMsg}>
            {erros.numero}
          </div>
        )}

        <input
          type="text"
          placeholder="Complemento"
          className={styles.input}
          value={dados.complemento || ""}
          onChange={(e) => handleChange("complemento", e.target.value)}
          onBlur={(e) => handleBlur("complemento", e.target.value)} // Adicionado onBlur
          style={{ flex: "1 1 150px" }}
        />
      </div>

      {/* 3ª linha: Estado, Cidade, Bairro */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <select
          className={`${styles.select} ${erros.estado ? styles.inputError : ""}`}
          value={dados.estado || ""}
          onChange={(e) => handleChange("estado", e.target.value)}
          onBlur={(e) => handleBlur("estado", e.target.value)} // Adicionado onBlur
          required
          aria-invalid={!!erros.estado}
          aria-describedby={erros.estado ? "error-estado" : undefined}
          style={{ flex: "1 1 100px" }}
        >
          <option value="">Estado*</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
        {erros.estado && (
          <div id="error-estado" className={styles.errorMsg}>
            {erros.estado}
          </div>
        )}

        <input
          type="text"
          placeholder="Cidade*"
          className={`${styles.input} ${erros.cidade ? styles.inputError : ""}`}
          value={dados.cidade || ""}
          onChange={(e) => handleChange("cidade", e.target.value)}
          onBlur={(e) => handleBlur("cidade", e.target.value)} // Adicionado onBlur
          required
          aria-invalid={!!erros.cidade}
          aria-describedby={erros.cidade ? "error-cidade" : undefined}
          style={{ flex: "2 1 200px" }}
        />
        {erros.cidade && (
          <div id="error-cidade" className={styles.errorMsg}>
            {erros.cidade}
          </div>
        )}

        <input
          type="text"
          placeholder="Bairro*"
          className={`${styles.input} ${erros.bairro ? styles.inputError : ""}`}
          value={dados.bairro || ""}
          onChange={(e) => handleChange("bairro", e.target.value)}
          onBlur={(e) => handleBlur("bairro", e.target.value)} // Adicionado onBlur
          required
          aria-invalid={!!erros.bairro}
          aria-describedby={erros.bairro ? "error-bairro" : undefined}
          style={{ flex: "1 1 150px" }}
        />
        {erros.bairro && (
          <div id="error-bairro" className={styles.errorMsg}>
            {erros.bairro}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionEndereco;