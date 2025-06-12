// src/components/clientes/AccordionContato.js
import React from "react";
import InputMask from "react-input-mask";
import styles from "./AccordionContato.module.css";

const AccordionContato = ({ dados, updateTelefone, addTelefone, removeTelefone, updateEmail, addEmail, removeEmail, erros }) => {
  // A validação de telefones e emails já é chamada em 'updateTelefone' e 'updateEmail' no NovoCliente.js
  // O onBlur nesses inputs também vai disparar a validação através do handleChange ou update...
  const handleBlurTel = () => {
    // A validação para telefones já ocorre em updateTelefone
  };

  const handleBlurEmail = () => {
    // A validação para emails já ocorre em updateEmail
  };

  return (
    <div className={styles.accordionBody}>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Telefones */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <label className={styles.label}>Telefone*</label>
          {dados.telefones.map((telefone, idx) => (
            <div key={"tel-" + idx} className={styles.multiInputRow}>
              <InputMask
                mask="(99) 99999-9999"
                maskChar={null}
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => updateTelefone(idx, e.target.value)}
                onBlur={handleBlurTel} // Adicionado onBlur
                className={`${styles.input} ${erros.telefones && idx === 0 ? styles.inputError : ""}`}
                required={idx === 0}
                aria-invalid={erros.telefones && idx === 0}
                aria-describedby={erros.telefones && idx === 0 ? "error-tel" : undefined}
              />
              {dados.telefones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTelefone(idx)}
                  className={styles.removeButton}
                  aria-label="Remover telefone"
                >
                  –
                </button>
              )}
              {idx === dados.telefones.length - 1 && (
                <button
                  type="button"
                  onClick={addTelefone}
                  className={styles.addButton}
                  aria-label="Adicionar telefone"
                >
                  +
                </button>
              )}
            </div>
          ))}
          {erros.telefones && (
            <div id="error-tel" className={styles.errorMsg}>
              {erros.telefones}
            </div>
          )}
        </div>

        {/* Emails */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <label className={styles.label}>Email*</label>
          {dados.emails.map((email, idx) => (
            <div key={"email-" + idx} className={styles.multiInputRow}>
              <input
                type="email"
                placeholder="Digite o email"
                value={email}
                onChange={(e) => updateEmail(idx, e.target.value)}
                onBlur={handleBlurEmail} // Adicionado onBlur
                className={`${styles.input} ${erros.emails && idx === 0 ? styles.inputError : ""}`}
                required={idx === 0}
                aria-invalid={erros.emails && idx === 0}
                aria-describedby={erros.emails && idx === 0 ? "error-email" : undefined}
              />
              {dados.emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmail(idx)}
                  className={styles.removeButton}
                  aria-label="Remover email"
                >
                  –
                </button>
              )}
              {idx === dados.emails.length - 1 && (
                <button
                  type="button"
                  onClick={addEmail}
                  className={styles.addButton}
                  aria-label="Adicionar email"
                >
                  +
                </button>
              )}
            </div>
          ))}
          {erros.emails && (
            <div id="error-email" className={styles.errorMsg}>
              {erros.emails}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionContato;