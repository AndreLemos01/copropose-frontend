import React from "react";
import styles from "./AccordionObservacoes.module.css";

const AccordionObservacoes = ({ dados, setDados, erros, validarCampo }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    setDados({ ...dados, observacoes: value });
    validarCampo('observacoes', value); // Validação em tempo real
  };

  const handleBlur = (e) => {
    const value = e.target.value;
    validarCampo('observacoes', value); // Validação ao sair do campo
  };

  return (
    <div className={styles.accordionBody}>
      <textarea
        placeholder="Digite observações gerais"
        className={`${styles.textarea} ${erros.observacoes ? styles.inputError : ""}`}
        value={dados.observacoes || ""}
        onChange={handleChange}
        onBlur={handleBlur} // Adicionado onBlur
        aria-invalid={!!erros.observacoes}
        aria-describedby={erros.observacoes ? "error-observacoes" : undefined}
      />
      {erros.observacoes && (
        <div id="error-observacoes" className={styles.errorMsg}>
          {erros.observacoes}
        </div>
      )}
    </div>
  );
};

export default AccordionObservacoes;