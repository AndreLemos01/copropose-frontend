import React, { useState } from "react";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaBarcode,
  FaUniversity,
  FaQrcode,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimesCircle,
} from "react-icons/fa"; // Importar mais ícones se necessário
import toast from "react-hot-toast"; // Importar toast
import styles from "./FormaPagamento.module.css";

const ICONS_MAP = {
  dinheiro: { icon: <FaMoneyBillWave />, label: "Dinheiro" },
  credito: { icon: <FaCreditCard />, label: "Cartão de Crédito" },
  debito: { icon: <FaUniversity />, label: "Cartão de Débito" }, // Alterado para FaUniversity para representar melhor um banco/débito
  boleto: { icon: <FaBarcode />, label: "Boleto Bancário" },
  pix: { icon: <FaQrcode />, label: "Pix" },
  // Adicione mais ícones/labels conforme a necessidade
};

// Formas padrão com ids fixos para bloquear exclusão/edição
const FORMAS_PAGAMENTO_PADRAO = [
  { id: "1", nome: "Dinheiro", iconeId: "dinheiro" },
  { id: "2", nome: "Cartão de Crédito", iconeId: "credito" },
  { id: "3", nome: "Cartão de Débito", iconeId: "debito" },
  { id: "4", nome: "Boleto Bancário", iconeId: "boleto" },
  { id: "5", nome: "Pix", iconeId: "pix" },
];

const FormaPagamento = ({ formasPagamento, setFormasPagamento }) => {
  const [novaFormaNome, setNovaFormaNome] = useState("");
  const [novoIcone, setNovoIcone] = useState("dinheiro");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [editandoIcone, setEditandoIcone] = useState("dinheiro");

  const ehPadrao = (id) => FORMAS_PAGAMENTO_PADRAO.some((f) => f.id === id);

  const handleAdicionar = () => {
    if (!novaFormaNome.trim()) {
      toast.error("O nome da nova forma de pagamento não pode ser vazio.");
      return;
    }
    if (
      formasPagamento.some(
        (f) => f.nome.toLowerCase() === novaFormaNome.trim().toLowerCase()
      )
    ) {
      toast.error("Forma de pagamento já existe.");
      return;
    }
    const novaForma = {
      id: Date.now().toString(),
      nome: novaFormaNome.trim(),
      iconeId: novoIcone,
    };
    setFormasPagamento([...formasPagamento, novaForma]);
    setNovaFormaNome("");
    setNovoIcone("dinheiro");
    toast.success("Forma de pagamento adicionada!");
  };

  const iniciarEdicao = (forma) => {
    if (ehPadrao(forma.id)) return;
    setEditandoId(forma.id);
    setEditandoNome(forma.nome);
    setEditandoIcone(forma.iconeId);
  };

  const salvarEdicao = () => {
    if (!editandoNome.trim()) {
      toast.error("O nome da forma de pagamento não pode ser vazio.");
      return;
    }
    // Verifica se o nome já existe em outras formas (exceto a que está sendo editada)
    if (
      formasPagamento.some(
        (f) =>
          f.id !== editandoId &&
          f.nome.toLowerCase() === editandoNome.trim().toLowerCase()
      )
    ) {
      toast.error("Já existe outra forma de pagamento com este nome.");
      return;
    }

    setFormasPagamento(
      formasPagamento.map((f) =>
        f.id === editandoId
          ? { ...f, nome: editandoNome.trim(), iconeId: editandoIcone }
          : f
      )
    );
    cancelarEdicao();
    toast.success("Forma de pagamento atualizada!");
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoNome("");
    setEditandoIcone("dinheiro");
  };

  const handleRemover = (id) => {
    if (ehPadrao(id)) {
      toast.error("Não é possível remover formas de pagamento padrão.");
      return;
    }
    if (window.confirm("Tem certeza que deseja remover esta forma de pagamento?")) {
      setFormasPagamento(formasPagamento.filter((f) => f.id !== id));
      toast.success("Forma de pagamento removida!");
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Formas de Pagamento</h3>

      {/* Adicionar nova forma */}
      <div className={styles.addForm}>
        <input
          type="text"
          placeholder="Nova forma de pagamento"
          value={novaFormaNome}
          onChange={(e) => setNovaFormaNome(e.target.value)}
          className={styles.input}
        />

        {/* Melhoria visual para seleção de ícone */}
        <select
          value={novoIcone}
          onChange={(e) => setNovoIcone(e.target.value)}
          className={styles.selectIcon}
          aria-label="Selecionar ícone para nova forma"
        >
          {Object.entries(ICONS_MAP).map(([key, { icon, label }]) => (
            <option key={key} value={key}>
              {label} {/* Exibe o label no dropdown */}
            </option>
          ))}
        </select>
        <div className={styles.iconPreview}>
          {ICONS_MAP[novoIcone].icon}
        </div>

        <button
          onClick={handleAdicionar}
          disabled={!novaFormaNome.trim()}
          className={styles.addButton}
        >
          Adicionar
        </button>
      </div>

      {/* Lista de formas */}
      <ul className={styles.list}>
        {formasPagamento.map((forma) => (
          <li key={forma.id} className={`${styles.listItem} ${editandoId === forma.id ? styles.editing : ''}`}>
            <div className={styles.icon}>{ICONS_MAP[forma.iconeId].icon}</div> {/* Renderiza o ícone */}

            {editandoId === forma.id ? (
              <>
                <input
                  type="text"
                  value={editandoNome}
                  onChange={(e) => setEditandoNome(e.target.value)}
                  className={styles.inputEdit}
                />
                <select
                  value={editandoIcone}
                  onChange={(e) => setEditandoIcone(e.target.value)}
                  className={styles.selectIconEdit}
                  aria-label="Alterar ícone da forma"
                >
                  {Object.entries(ICONS_MAP).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className={styles.iconPreviewEdit}>
                   {ICONS_MAP[editandoIcone].icon}
                </div>
                <button onClick={salvarEdicao} className={styles.saveButton} aria-label="Salvar edição">
                  <FaSave />
                </button>
                <button onClick={cancelarEdicao} className={styles.cancelButton} aria-label="Cancelar edição">
                  <FaTimesCircle />
                </button>
              </>
            ) : (
              <>
                <span className={styles.formaNome}>{forma.nome}</span>
                {!ehPadrao(forma.id) && (
                  <div className={styles.actions}>
                    <button
                      onClick={() => iniciarEdicao(forma)}
                      className={styles.editButton}
                      aria-label={`Editar forma de pagamento ${forma.nome}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemover(forma.id)}
                      className={styles.removeButton}
                      aria-label={`Remover forma de pagamento ${forma.nome}`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormaPagamento;