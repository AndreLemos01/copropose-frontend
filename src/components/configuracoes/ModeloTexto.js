import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./ModeloTexto.module.css";
import toast from "react-hot-toast"; // Importar toast para notificações

const PADRAO_KEY = "padrao";

// Texto padrão para o modelo de texto
const MODELO_TEXTO_PADRAO = {
  id: PADRAO_KEY,
  texto: `<p>Prezado(a) Cliente,</p>
<p>Encaminhamos esta proposta para sua análise e consideração. Estamos à disposição para esclarecer quaisquer dúvidas e ajustar os termos conforme necessário para melhor atendê-lo(a).</p>
<p>Agradecemos a oportunidade e esperamos estabelecer uma parceria de sucesso.</p>
<p>Atenciosamente,</p>
<p>[Seu Nome/Nome da Empresa]</p>
<p>[Seu Contato]</p>`,
};

function htmlToText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const ModeloTexto = ({ modelosTexto, setModelosTexto }) => {
  const [novoModeloTexto, setNovoModeloTexto] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    if (!modelosTexto.find((item) => item?.id === PADRAO_KEY)) {
      setModelosTexto([MODELO_TEXTO_PADRAO, ...(modelosTexto || [])]);
    }
  }, [modelosTexto, setModelosTexto]);

  useEffect(() => {
    if (selecionado) setNovoModeloTexto(selecionado.texto);
    else setNovoModeloTexto("");
  }, [selecionado]);

  const handleAdicionar = () => {
    if (!novoModeloTexto.trim()) return;
    setModelosTexto([
      ...(modelosTexto || []),
      { id: Date.now().toString(), texto: novoModeloTexto },
    ]);
    setSelecionado(null);
    setNovoModeloTexto("");
    toast.success("Novo modelo de texto adicionado!");
  };

  const handleSalvar = () => {
    if (!selecionado) return;

    setModelosTexto(
      (modelosTexto || []).map((item) =>
        item.id === selecionado.id ? { ...item, texto: novoModeloTexto } : item
      )
    );
    setSelecionado(null);
    setNovoModeloTexto("");
    toast.success("Modelo de texto atualizado!");
  };

  const handleExcluir = () => {
    if (!selecionado) return;
    if (selecionado.id === PADRAO_KEY) {
      toast.error("O modelo padrão não pode ser excluído.");
      return;
    }
    setModelosTexto(
      (modelosTexto || []).filter((item) => item.id !== selecionado.id)
    );
    setSelecionado(null);
    setNovoModeloTexto("");
    toast.success("Modelo de texto excluído!");
  };

  const handleReverterPadrao = () => {
    setNovoModeloTexto(MODELO_TEXTO_PADRAO.texto);
    toast("Texto revertido para o padrão.", { icon: '🔄' });
  };

  const handleSelecionar = (e) => {
    const id = e.target.value;
    const selecionadoObj = (modelosTexto || []).find((item) => item.id === id);
    setSelecionado(selecionadoObj || null);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Modelo de Texto</h3>

      <div className={styles.selectWrapper}>
        <label htmlFor="modeloSelect" className={styles.label}>
          Selecione um modelo:
        </label>
        <select
          id="modeloSelect"
          className={styles.selectInput}
          onChange={handleSelecionar}
          value={selecionado ? selecionado.id : ""}
          aria-label="Selecionar modelo de texto"
        >
          <option value="">Nenhum</option>
          {(modelosTexto || [])
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
        value={novoModeloTexto}
        onChange={setNovoModeloTexto}
        placeholder="Escreva seu modelo de texto aqui..."
        theme="snow"
        className={styles.editor}
      />

      <div className={styles.buttonGroup}>
        {selecionado ? (
          <>
            <button
              className={styles.saveButton}
              onClick={handleSalvar}
              aria-label="Salvar alterações do modelo"
            >
              Salvar alterações
            </button>

            {selecionado.id === PADRAO_KEY && (
              <button
                className={styles.reverterButton}
                onClick={handleReverterPadrao}
                aria-label="Reverter para o modelo padrão"
                type="button"
              >
                Reverter para padrão
              </button>
            )}

            <button
              className={styles.removeButton}
              onClick={handleExcluir}
              aria-label="Excluir modelo selecionado"
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
            onClick={handleAdicionar}
            aria-label="Adicionar novo modelo"
            disabled={!novoModeloTexto.trim()}
          >
            Adicionar
          </button>
        )}
      </div>
    </div>
  );
};

export default ModeloTexto;