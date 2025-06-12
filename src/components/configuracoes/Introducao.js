import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./Introducao.module.css";
import toast from 'react-hot-toast';

const PADRAO_KEY = "padrao";

// Texto padrão para a introdução
const MODELO_INTRODUCAO_PADRAO = {
  id: PADRAO_KEY,
  texto:
    "<p>Prezados,</p>" +
    "<p>Apresentamos a seguir nossa proposta, elaborada com o objetivo de atender plenamente às suas necessidades e expectativas. Detalhamos as soluções, escopo e condições comerciais para sua análise.</p>" +
    "<p>Estamos à disposição para qualquer esclarecimento adicional ou ajuste necessário, visando sempre a excelência e a construção de uma parceria de sucesso.</p>" +
    "<p>Atenciosamente,</p>",
};

function htmlToText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const Introducao = ({ introducoes, setIntroducoes }) => {
  const [novaIntroducao, setNovaIntroducao] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    // Garante que o modelo padrão exista na lista
    if (!introducoes.find((item) => item?.id === PADRAO_KEY)) {
      setIntroducoes([MODELO_INTRODUCAO_PADRAO, ...(introducoes || [])]);
    }
  }, [introducoes, setIntroducoes]);

  useEffect(() => {
    if (selecionado) setNovaIntroducao(selecionado.texto);
    else setNovaIntroducao("");
  }, [selecionado]);

  const handleAdicionarIntroducao = () => {
    if (!novaIntroducao.trim()) return;
    setIntroducoes([
      ...(introducoes || []),
      { id: Date.now().toString(), texto: novaIntroducao },
    ]);
    setSelecionado(null);
    setNovaIntroducao("");
    toast.success("Nova introdução adicionada!");
  };

  const handleSalvarAlteracoes = () => {
    if (!selecionado) return;

    setIntroducoes(
      (introducoes || []).map((item) =>
        item.id === selecionado.id ? { ...item, texto: novaIntroducao } : item
      )
    );
    setSelecionado(null);
    setNovaIntroducao("");
    toast.success("Introdução atualizada!");
  };

  const handleExcluirIntroducao = () => {
    if (!selecionado) return;
    if (selecionado.id === PADRAO_KEY) {
      toast.error("O texto padrão não pode ser excluído.");
      return;
    }
    setIntroducoes(
      (introducoes || []).filter((item) => item.id !== selecionado.id)
    );
    setSelecionado(null);
    setNovaIntroducao("");
    toast.success("Introdução excluída!");
  };

  const handleReverterPadrao = () => {
    setNovaIntroducao(MODELO_INTRODUCAO_PADRAO.texto);
    toast("Texto revertido para o padrão.", { icon: '🔄' });
  };

  const handleSelecaoIntroducao = (e) => {
    const id = e.target.value;
    const selecionadoObj = (introducoes || []).find((item) => item.id === id);
    setSelecionado(selecionadoObj || null);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Introdução</h3>

      <div className={styles.selectWrapper}>
        <label htmlFor="introducaoSelect" className={styles.label}>
          Selecione uma introdução:
        </label>
        <select
          id="introducaoSelect"
          className={styles.selectInput}
          onChange={handleSelecaoIntroducao}
          value={selecionado ? selecionado.id : ""}
          aria-label="Selecionar introdução"
        >
          <option value="">Nenhuma</option>
          {(introducoes || [])
            .filter((item) => item && item.texto)
            .map((item) => (
              <option key={item.id} value={item.id}>
                {htmlToText(item.texto).length > 60
                  ? htmlToText(item.texto).slice(0, 60) + "..."
                  : htmlToText(item.texto)}
              </option>
            ))}
        </select>
      </div>

      <ReactQuill
        value={novaIntroducao}
        onChange={setNovaIntroducao}
        placeholder="Escreva sua introdução aqui..."
        theme="snow"
        className={styles.editor}
      />

      <div className={styles.buttonGroup}>
        {selecionado ? (
          <>
            <button
              className={styles.saveButton}
              onClick={handleSalvarAlteracoes}
              aria-label="Salvar alterações da introdução"
            >
              Salvar alterações
            </button>

            {selecionado.id === PADRAO_KEY && (
              <button
                className={styles.reverterButton}
                onClick={handleReverterPadrao}
                aria-label="Reverter para o texto padrão"
                type="button"
              >
                Reverter para padrão
              </button>
            )}

            <button
              className={styles.removeButton}
              onClick={handleExcluirIntroducao}
              aria-label="Excluir introdução selecionada"
              disabled={selecionado.id === PADRAO_KEY}
              style={
                selecionado.id === PADRAO_KEY
                  ? { cursor: "not-allowed", opacity: 0.6 }
                  : {}
              }
            >
              Excluir
            </button>
          </>
        ) : (
          <button
            className={styles.addButton}
            onClick={handleAdicionarIntroducao}
            aria-label="Adicionar nova introdução"
            disabled={!novaIntroducao.trim()}
          >
            Adicionar
          </button>
        )}
      </div>
    </div>
  );
};

export default Introducao;