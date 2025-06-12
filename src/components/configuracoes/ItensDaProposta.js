// src/components/configuracoes/ItensDaProposta.jsx
import React, { useState, useContext, useEffect } from "react";
import { ConfigContext } from "../../context/ConfigContext";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import styles from "./ItensDaProposta.module.css";

const estilos = [
  { value: "simples", label: "Simples" },
  { value: "agrupado", label: "Agrupável por Item" },
  { value: "detalhado", label: "Detalhamento Técnico" },
];

export default function ItensDaProposta() {
  const { itensDisponiveis, setItensDisponiveis } = useContext(ConfigContext);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [estilo, setEstilo] = useState("simples");
  
  // Variáveis para definir a estrutura da variável/campo na definição do item
  const [variavelNome, setVariavelNome] = useState("");
  const [variavelTipoInput, setVariavelTipoInput] = useState("text"); // 'text', 'number', 'boolean' (para checkbox)
  const [variavelValorPadrao, setVariavelValorPadrao] = useState(""); // Valor padrão para Detalhamento
  const [variavelIncluidoPadrao, setVariavelIncluidoPadrao] = useState(true); // Se sub-item agrupável vem selecionado

  // A lista de variáveis/campos definidos para o item
  const [variaveisDefinidas, setVariaveisDefinidas] = useState([]);
  
  const [itemEditando, setItemEditando] = useState(null);

  // Efeito para preencher o formulário quando um item é selecionado para edição.
  useEffect(() => {
    if (itemEditando) {
      setTitulo(itemEditando.titulo);
      setDescricao(itemEditando.descricao);
      setEstilo(itemEditando.estilo);
      // Variáveis agora são objetos, então precisamos mapeá-las para o estado local
      setVariaveisDefinidas(itemEditando.variaveis || []);
    } else {
      // Limpa o formulário quando não está editando ou após salvar/excluir
      setTitulo("");
      setDescricao("");
      setEstilo("simples");
      setVariaveisDefinidas([]);
      // Limpa os campos de adição de variável também
      setVariavelNome("");
      setVariavelTipoInput("text");
      setVariavelValorPadrao("");
      setVariavelIncluidoPadrao(true);
    }
  }, [itemEditando]);

  // Este useEffect lida com a mudança de estilo (tipo de item) enquanto o usuário está no formulário.
  useEffect(() => {
    if ((itemEditando && itemEditando.estilo !== estilo) || (estilo === "simples" && !itemEditando)) {
        setVariaveisDefinidas([]); // Limpa as variáveis se o tipo de item mudar ou for "simples"
    }
    // Ao mudar o estilo, reseta os campos de adição de variável para o default do tipo
    setVariavelNome("");
    setVariavelValorPadrao("");
    if (estilo === "agrupado") {
        setVariavelTipoInput("boolean"); // Sugerir checkbox para agrupável
        setVariavelIncluidoPadrao(true);
    } else if (estilo === "detalhado") {
        setVariavelTipoInput("text"); // Sugerir texto para detalhado
        setVariavelIncluidoPadrao(false); // Detalhes não são "incluídos" por default
    } else {
        setVariavelTipoInput("text"); // Default para simples (não visível)
    }
  }, [estilo, itemEditando]);

  const handleAdicionarVariavel = () => {
    if (!variavelNome.trim()) {
      toast.error("O nome da variável/sub-item não pode ser vazio.");
      return;
    }
    // Verifica se já existe uma variável com o mesmo nome
    if (variaveisDefinidas.some(v => v.name.toLowerCase() === variavelNome.trim().toLowerCase())) {
        toast.error("Já existe uma variável/sub-item com este nome.");
        return;
    }

    const novaVariavel = {
      name: variavelNome.trim(),
      // Propriedades específicas para cada estilo
      ...(estilo === "agrupado" && { type: 'boolean', defaultIncluded: variavelIncluidoPadrao, value: Number(variavelValorPadrao) || 0 }), // Adiciona valor para agrupável
      ...(estilo === "detalhado" && { type: variavelTipoInput, defaultValue: variavelValorPadrao.trim() }),
    };

    setVariaveisDefinidas([...variaveisDefinidas, novaVariavel]);
    setVariavelNome("");
    setVariavelValorPadrao("");
    // Mantém o variavelIncluidoPadrao como estava ou reseta dependendo da necessidade
  };

  const handleRemoverVariavel = (index) => {
    setVariaveisDefinidas(variaveisDefinidas.filter((_, i) => i !== index));
  };

  const handleSalvarItem = () => {
    if (!titulo.trim()) {
      toast.error("O título é obrigatório.");
      return;
    }
    
    const tituloExistente = itensDisponiveis.some(item => 
        item.id !== (itemEditando ? itemEditando.id : null) && 
        item.titulo.toLowerCase() === titulo.trim().toLowerCase()
    );

    if (tituloExistente) {
        toast.error("Já existe um item com este título.");
        return;
    }

    const novoItem = {
      id: itemEditando ? itemEditando.id : Date.now().toString(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      estilo,
      variaveis: (estilo !== "simples" && variaveisDefinidas.length > 0) ? variaveisDefinidas : [],
    };

    if (itemEditando) {
      const atualizados = itensDisponiveis.map((item) =>
        item.id === itemEditando.id ? novoItem : item
      );
      setItensDisponiveis(atualizados);
      toast.success("Item atualizado com sucesso!");
    } else {
      setItensDisponiveis([...itensDisponiveis, novoItem]);
      toast.success("Novo item adicionado com sucesso!");
    }

    // Reseta o formulário após salvar
    setItemEditando(null);
    setTitulo("");
    setDescricao("");
    setEstilo("simples");
    setVariaveisDefinidas([]);
    setVariavelNome("");
    setVariavelTipoInput("text");
    setVariavelValorPadrao("");
    setVariavelIncluidoPadrao(true);
  };

  const handleEditarItem = (item) => {
    setItemEditando(item);
  };

  const handleDeletarItem = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
        const atualizados = itensDisponiveis.filter(item => item.id !== id);
        setItensDisponiveis(atualizados);
        toast.success("Item excluído com sucesso!");
    }
  };

  const handleCancelarEdicao = () => {
    setItemEditando(null);
    setTitulo("");
    setDescricao("");
    setEstilo("simples");
    setVariaveisDefinidas([]);
    setVariavelNome("");
    setVariavelTipoInput("text");
    setVariavelValorPadrao("");
    setVariavelIncluidoPadrao(true);
  };

  // Funções para definir rótulos e placeholders dinamicamente
  const getVariavelPlaceholder = () => {
    switch (estilo) {
      case "agrupado":
        return "Nome do Sub-item (Ex: Barata Alemã)";
      case "detalhado":
        return "Nome da Variável (Ex: Litragem)";
      default:
        return "";
    }
  };

  const getVariavelLabel = () => {
    switch (estilo) {
      case "agrupado":
        return "Sub-itens/Componentes para Agrupamento";
      case "detalhado":
        return "Variáveis para Detalhamento Técnico";
      default:
        return "";
    }
  };

  const getVariavelTipoInputOptions = () => {
    if (estilo === "agrupado") {
        return (
            <>
                <option value="boolean">Incluível (Checkbox)</option>
            </>
        );
    } else if (estilo === "detalhado") {
        return (
            <>
                <option value="text">Texto</option>
                <option value="number">Número</option>
            </>
        );
    }
    return null;
  };


  return (
    <div className={styles.itensContainer}>
      <div className={`${styles.formContainer} ${itemEditando ? styles.editingMode : ''}`}>
        <h3 className={styles.formTitle}>{itemEditando ? "Editar Item" : "Adicionar Novo Item"}</h3>

        <div className={styles.formCard}>
          <div className={styles.formCardContent}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo do Item</label>
              <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className={styles.select}>
                {estilos.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Título*</label>
              <input 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                placeholder="Ex: Desenvolvimento de Software" 
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Descrição (opcional)</label>
              <textarea 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                placeholder={estilo === "simples" ? "Detalhes breves sobre o item." : "Detalhes sobre o item (Ex: criação de sistema web personalizado)"} 
                className={styles.textarea}
                rows="3"
              />
            </div>

            {estilo !== "simples" && (
              <div className={styles.variavelContainer}>
                <label className={styles.label}>{getVariavelLabel()}</label>
                <p className={styles.variavelInfo}>
                    <FaInfoCircle /> Defina as variáveis ou sub-itens que compõem este modelo.
                    {estilo === "agrupado" && " (Cada um poderá ser incluído/excluído na proposta, e terá seu próprio valor opcional)."}
                    {estilo === "detalhado" && " (Cada variável será um campo editável na proposta para preenchimento de detalhes)."}
                </p>

                <div className={styles.variavelInputGroup}>
                  <input
                    type="text"
                    value={variavelNome}
                    onChange={(e) => setVariavelNome(e.target.value)}
                    placeholder={getVariavelPlaceholder()}
                    className={styles.input}
                  />
                  {estilo === "detalhado" && (
                      <select
                        value={variavelTipoInput}
                        onChange={(e) => setVariavelTipoInput(e.target.value)}
                        className={styles.selectVariavelTipo}
                      >
                        {getVariavelTipoInputOptions()}
                      </select>
                  )}
                  {(estilo === "agrupado" || variavelTipoInput === "text" || variavelTipoInput === "number") && (
                    <input
                      type={variavelTipoInput === "boolean" ? "number" : variavelTipoInput} // 'number' para valor de agrupável
                      value={variavelValorPadrao}
                      onChange={(e) => setVariavelValorPadrao(e.target.value)}
                      placeholder={estilo === "agrupado" ? "Valor padrão" : "Valor padrão (opcional)"}
                      className={styles.inputVariavelValor}
                    />
                  )}
                  {estilo === "agrupado" && (
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="incluidoPadrao"
                        checked={variavelIncluidoPadrao}
                        onChange={(e) => setVariavelIncluidoPadrao(e.target.checked)}
                      />
                      <label htmlFor="incluidoPadrao">Incluído por padrão</label>
                    </div>
                  )}

                  <button onClick={handleAdicionarVariavel} className={styles.addVariavelButton}>
                    <FaPlus /> Adicionar Variável
                  </button>
                </div>
                {variaveisDefinidas.length > 0 && (
                  <div className={styles.variaveisList}>
                    {variaveisDefinidas.map((item, index) => (
                      <span key={index} className={styles.variavelItem}>
                        {item.name}
                        {item.type && ` (${item.type})`}
                        {item.defaultValue && ` = "${item.defaultValue}"`}
                        {item.defaultIncluded !== undefined && ` (Padrão: ${item.defaultIncluded ? 'Incluído' : 'Excluído'})`}
                        {item.value !== undefined && ` (Valor: R$ ${item.value.toFixed(2)})`}
                        <button onClick={() => handleRemoverVariavel(index)} className={styles.removeVariavelButton}>
                          <FaTimesCircle />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button onClick={handleSalvarItem} className={styles.saveButton}>
                <FaSave /> {itemEditando ? "Atualizar Item" : "Salvar Item"}
              </button>
              {itemEditando && (
                <button onClick={handleCancelarEdicao} className={styles.cancelButton}>
                  <FaTimesCircle /> Cancelar Edição
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.itemsListSection}>
        <h3 className={styles.listTitle}>Itens Salvos</h3>
        {itensDisponiveis.length === 0 ? (
          <div className={styles.noItemsMessage}>
            <p>Nenhum item de proposta configurado ainda. Comece adicionando um!</p>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {itensDisponiveis.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemCardHeader}>
                    <h4>{item.titulo}</h4>
                    <span className={`${styles.estiloBadge} ${styles[item.estilo]}`}>
                        {estilos.find(s => s.value === item.estilo)?.label}
                    </span>
                </div>
                {item.descricao && <p className={styles.itemDescription}>{item.descricao}</p>}
                {item.variaveis && item.variaveis.length > 0 && (
                    <div className={styles.cardVariaveis}>
                        <strong>Variáveis:</strong>
                        <ul className={styles.cardVariaveisList}>
                            {item.variaveis.map((v, idx) => (
                              <li key={idx}>
                                {v.name}
                                {v.type && ` (${v.type})`}
                                {v.defaultValue !== undefined && ` = "${v.defaultValue}"`}
                                {v.defaultIncluded !== undefined && ` (Padrão: ${v.defaultIncluded ? 'Incluído' : 'Excluído'})`}
                                {v.value !== undefined && ` (Valor: R$ ${v.value.toFixed(2)})`}
                              </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => handleEditarItem(item)} 
                    className={styles.editButton}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button 
                    onClick={() => handleDeletarItem(item.id)} 
                    className={styles.deleteButton}
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}