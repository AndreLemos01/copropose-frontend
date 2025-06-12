// src/components/clientes/PessoaFisicaForm.js
import React from "react";
import styles from "./PessoaFisicaForm.module.css";

const PessoaFisicaForm = ({ dados = {}, setDados, erros = {}, validarCampo }) => {
  const formatCpf = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const handleChange = (field, value) => {
    const newValue = field === "cpf" ? formatCpf(value) : value;
    setDados({
      ...dados,
      [field]: newValue,
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
          <label htmlFor="nomeCompleto" className={styles.label}>
            Nome completo*
          </label>
          <input
            id="nomeCompleto"
            type="text"
            className={`${styles.inputBase} ${erros.nomeCompleto ? styles.inputError : ""}`}
            placeholder="Digite o nome completo"
            value={dados.nomeCompleto || ""}
            onChange={(e) => handleChange("nomeCompleto", e.target.value)}
            onBlur={(e) => handleBlur("nomeCompleto", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.nomeCompleto}
            aria-describedby={erros.nomeCompleto ? "error-nomeCompleto" : undefined}
            required
          />
          {erros.nomeCompleto && (
            <div id="error-nomeCompleto" className={styles.errorMsg}>
              {erros.nomeCompleto}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="cpf" className={styles.label}>
            CPF*
          </label>
          <input
            id="cpf"
            type="text"
            maxLength={14}
            className={`${styles.inputBase} ${erros.cpf ? styles.inputError : ""}`}
            placeholder="000.000.000-00"
            value={dados.cpf || ""}
            onChange={(e) => handleChange("cpf", e.target.value)}
            onBlur={(e) => handleBlur("cpf", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.cpf}
            aria-describedby={erros.cpf ? "error-cpf" : undefined}
            required
          />
          {erros.cpf && (
            <div id="error-cpf" className={styles.errorMsg}>
              {erros.cpf}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dataNascimento" className={styles.label}>
            Data de nascimento*
          </label>
          <input
            id="dataNascimento"
            type="date"
            className={`${styles.inputBase} ${erros.dataNascimento ? styles.inputError : ""}`}
            value={dados.dataNascimento || ""}
            onChange={(e) => handleChange("dataNascimento", e.target.value)}
            onBlur={(e) => handleBlur("dataNascimento", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.dataNascimento}
            aria-describedby={erros.dataNascimento ? "error-dataNascimento" : undefined}
            required
          />
          {erros.dataNascimento && (
            <div id="error-dataNascimento" className={styles.errorMsg}>
              {erros.dataNascimento}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="sexo" className={styles.label}>
            Sexo
          </label>
          <select
            id="sexo"
            className={`${styles.inputBase} ${erros.sexo ? styles.inputError : ""}`}
            value={dados.sexo || ""}
            onChange={(e) => handleChange("sexo", e.target.value)}
            onBlur={(e) => handleBlur("sexo", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.sexo}
            aria-describedby={erros.sexo ? "error-sexo" : undefined}
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
            <option value="Prefere não informar">Prefere não informar</option>
          </select>
          {erros.sexo && (
            <div id="error-sexo" className={styles.errorMsg}>
              {erros.sexo}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="estadoCivil" className={styles.label}>
            Estado civil
          </label>
          <select
            id="estadoCivil"
            className={`${styles.inputBase} ${erros.estadoCivil ? styles.inputError : ""}`}
            value={dados.estadoCivil || ""}
            onChange={(e) => handleChange("estadoCivil", e.target.value)}
            onBlur={(e) => handleBlur("estadoCivil", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.estadoCivil}
            aria-describedby={erros.estadoCivil ? "error-estadoCivil" : undefined}
          >
            <option value="">Selecione</option>
            <option value="Solteiro">Solteiro</option>
            <option value="Casado">Casado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viúvo">Viúvo</option>
          </select>
          {erros.estadoCivil && (
            <div id="error-estadoCivil" className={styles.errorMsg}>
              {erros.estadoCivil}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profissao" className={styles.label}>
            Profissão
          </label>
          <input
            id="profissao"
            type="text"
            placeholder="Digite a profissão"
            className={`${styles.inputBase} ${erros.profissao ? styles.inputError : ""}`}
            value={dados.profissao || ""}
            onChange={(e) => handleChange("profissao", e.target.value)}
            onBlur={(e) => handleBlur("profissao", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.profissao}
            aria-describedby={erros.profissao ? "error-profissao" : undefined}
          />
          {erros.profissao && (
            <div id="error-profissao" className={styles.errorMsg}>
              {erros.profissao}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="nacionalidade" className={styles.label}>
            Nacionalidade
          </label>
          <input
            id="nacionalidade"
            type="text"
            placeholder="Digite a nacionalidade"
            className={`${styles.inputBase} ${erros.nacionalidade ? styles.inputError : ""}`}
            value={dados.nacionalidade || ""}
            onChange={(e) => handleChange("nacionalidade", e.target.value)}
            onBlur={(e) => handleBlur("nacionalidade", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.nacionalidade}
            aria-describedby={erros.nacionalidade ? "error-nacionalidade" : undefined}
          />
          {erros.nacionalidade && (
            <div id="error-nacionalidade" className={styles.errorMsg}>
              {erros.nacionalidade}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="naturalidade" className={styles.label}>
            Naturalidade
          </label>
          <input
            id="naturalidade"
            type="text"
            placeholder="Digite a naturalidade"
            className={`${styles.inputBase} ${erros.naturalidade ? styles.inputError : ""}`}
            value={dados.naturalidade || ""}
            onChange={(e) => handleChange("naturalidade", e.target.value)}
            onBlur={(e) => handleBlur("naturalidade", e.target.value)} // Adicionado onBlur
            aria-invalid={!!erros.naturalidade}
            aria-describedby={erros.naturalidade ? "error-naturalidade" : undefined}
          />
          {erros.naturalidade && (
            <div id="error-naturalidade" className={styles.errorMsg}>
              {erros.naturalidade}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PessoaFisicaForm;