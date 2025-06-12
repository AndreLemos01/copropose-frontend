// src/components/clientes/PessoaJuridicaForm.js
import React from "react";
import styles from "./PessoaJuridicaForm.module.css";

const PessoaJuridicaForm = ({ dados = {}, setDados, erros = {}, validarCampo }) => {
  const handleChange = (field, value) => {
    setDados({
      ...dados,
      [field]: value,
    });
    // A validação em tempo real é feita aqui ao digitar, e ao sair do campo.
  };

  const handleBlur = (field, value) => {
    validarCampo(field, value); // Validação ao sair do campo
  };

  return (
    <div className={styles.container}>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="razaoSocial" className={styles.label}>
            Razão Social*
          </label>
          <input
            id="razaoSocial"
            type="text"
            className={`${styles.inputBase} ${erros.razaoSocial ? styles.inputError : ""}`}
            placeholder="Digite a razão social"
            value={dados.razaoSocial || ""}
            onChange={(e) => handleChange("razaoSocial", e.target.value)}
            onBlur={(e) => handleBlur("razaoSocial", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.razaoSocial}
            aria-describedby={erros.razaoSocial ? "error-razaoSocial" : undefined}
            required
          />
          {erros.razaoSocial && (
            <div id="error-razaoSocial" className={styles.errorMsg}>
              {erros.razaoSocial}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="cnpj" className={styles.label}>
            CNPJ*
          </label>
          <input
            id="cnpj"
            type="text"
            className={`${styles.inputBase} ${erros.cnpj ? styles.inputError : ""}`}
            placeholder="00.000.000/0000-00"
            value={dados.cnpj || ""}
            onChange={(e) => handleChange("cnpj", e.target.value)}
            onBlur={(e) => handleBlur("cnpj", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.cnpj}
            aria-describedby={erros.cnpj ? "error-cnpj" : undefined}
            required
          />
          {erros.cnpj && (
            <div id="error-cnpj" className={styles.errorMsg}>
              {erros.cnpj}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dataAbertura" className={styles.label}>
            Data de abertura*
          </label>
          <input
            id="dataAbertura"
            type="date"
            className={`${styles.inputBase} ${erros.dataAbertura ? styles.inputError : ""}`}
            value={dados.dataAbertura || ""}
            onChange={(e) => handleChange("dataAbertura", e.target.value)}
            onBlur={(e) => handleBlur("dataAbertura", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.dataAbertura}
            aria-describedby={erros.dataAbertura ? "error-dataAbertura" : undefined}
            required
          />
          {erros.dataAbertura && (
            <div id="error-dataAbertura" className={styles.errorMsg}>
              {erros.dataAbertura}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="porte" className={styles.label}>
            Porte*
          </label>
          <select
            id="porte"
            className={`${styles.inputBase} ${erros.porte ? styles.inputError : ""}`}
            value={dados.porte || ""}
            onChange={(e) => handleChange("porte", e.target.value)}
            onBlur={(e) => handleBlur("porte", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.porte}
            aria-describedby={erros.porte ? "error-porte" : undefined}
            required
          >
            <option value="">Selecione</option>
            <option value="Microempresa">Microempresa</option>
            <option value="Pequena Empresa">Pequena Empresa</option>
            <option value="Média Empresa">Média Empresa</option>
            <option value="Grande Empresa">Grande Empresa</option>
          </select>
          {erros.porte && (
            <div id="error-porte" className={styles.errorMsg}>
              {erros.porte}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="responsavelLegal" className={styles.label}>
            Responsável Legal*
          </label>
          <input
            id="responsavelLegal"
            type="text"
            className={`${styles.inputBase} ${erros.responsavelLegal ? styles.inputError : ""}`}
            placeholder="Digite o nome do responsável legal"
            value={dados.responsavelLegal || ""}
            onChange={(e) => handleChange("responsavelLegal", e.target.value)}
            onBlur={(e) => handleBlur("responsavelLegal", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.responsavelLegal}
            aria-describedby={erros.responsavelLegal ? "error-responsavelLegal" : undefined}
            required
          />
          {erros.responsavelLegal && (
            <div id="error-responsavelLegal" className={styles.errorMsg}>
              {erros.responsavelLegal}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PessoaJuridicaForm;