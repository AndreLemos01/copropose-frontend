// src/pages/AdicionarProposta.js
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { FaCog, FaDownload, FaPlusCircle, FaTimes, FaInfoCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ConfigContext } from "../context/ConfigContext";
import { getClientes, addProposalToClientHistory } from "../data/clientesMock";
import { saveProposta, getPropostas } from "../data/propostasMock";
import ProposalDetailModal from "../components/proposals/ProposalDetailModal";
import styles from "./AdicionarProposta.module.css";

function htmlToText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const AdicionarProposta = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // TODAS AS DECLARAÇÕES DE ESTADO E REFS DEVERÃO ESTAR AQUI
  const [tipo, setTipo] = useState("");
  const [cliente, setCliente] = useState(null);
  const [modeloTextoId, setModeloTextoId] = useState("");
  const [validoPor, setValidoPor] = useState("");
  const [condicoesPagamentoId, setCondicoesPagamentoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [introducaoId, setIntroducaoId] = useState("");
  const [textoIntroducaoSelecionado, setTextoIntroducaoSelecionado] = useState("");
  const [textoModeloSelecionado, setTextoModeloSelecionado] = useState("");
  
  // Estados e ref para a busca de clientes
  const [searchClienteText, setSearchClienteText] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const clienteSearchRef = useRef(null); // Ref para o input de busca de clientes
  const debounceTimeoutRef = useRef(null); // Ref para o debounce do cliente

  // Estados e ref para a busca de itens da proposta
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [filteredAvailableItems, setFilteredAvailableItems] = useState([]);
  const itemSearchRef = useRef(null); // Ref para o input de busca de itens

  // Estados para o modal de visualização
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProposalForView, setSelectedProposalForView] = useState(null);

  // Estados para o modo de edição
  const [isEditing, setIsEditing] = useState(false);
  const [currentProposalId, setCurrentProposalId] = useState(null);

  // ... (o restante do código do componente AdicionarProposta)


  const handleSearchClienteChange = useCallback((value) => {
    setSearchClienteText(value);
    setCliente(null); // Limpa o cliente selecionado se o texto mudar

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (value.trim().length > 0) {
        const allClients = getClientes(); //
        const filtered = allClients.filter((c) =>
          c.nome.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredClients(filtered);
      } else {
        setFilteredClients([]);
      }
    }, 300); // 300ms de debounce
  }, [setSearchClienteText, setCliente, setFilteredClients, debounceTimeoutRef]); // Adicionadas dependências

  const irParaConfiguracoes = () => navigate("/configuracoes"); // Alterado para /configuracoes
  const irParaCadastroCliente = () => {
    navigate("/clientes/novo-cliente", { state: { initialClientName: searchClienteText } });
  };

  const {
    modelosTexto = [],
    formasPagamento = [],
    prazosValidade = [],
    itensDisponiveis = [], // Ensure itensDisponiveis is available
    introducoes = [],
  } = useContext(ConfigContext);

  // Efeito para preencher o formulário se estiver em modo de edição
  useEffect(() => {
    if (location.state && location.state.proposalToEdit) {
      const proposal = location.state.proposalToEdit;
      setIsEditing(true);
      setCurrentProposalId(proposal.id);

      setTipo(proposal.tipo);
      
      const fullClient = getClientes().find(c => c.nome === proposal.cliente); //
      setCliente(fullClient || { nome: proposal.cliente, id: proposal.clienteId }); // Garante o ID do cliente
      setSearchClienteText(proposal.cliente);

      setTextoIntroducaoSelecionado(proposal.introducao || "");
      const matchedIntro = introducoes.find(item => item.texto === proposal.introducao || item.id === proposal.introducao);
      setIntroducaoId(matchedIntro ? matchedIntro.id || matchedIntro.texto : '');

      setTextoModeloSelecionado(proposal.modeloTexto || ""); // Alterado para modeloTexto (corpo principal)
      const matchedModel = modelosTexto.find(item => item.texto === proposal.modeloTexto || item.id === proposal.modeloTexto);
      setModeloTextoId(matchedModel ? matchedModel.id || matchedModel.texto : '');

      setValidoPor(proposal.validoPor || "");
      const matchedPayment = formasPagamento.find(f => f.nome === proposal.condicoesPagamento || f.id === proposal.condicoesPagamento);
      setCondicoesPagamentoId(matchedPayment ? matchedPayment.id || matchedPayment.nome : '');
      
      setDescricao(proposal.descricao || "");
      // Ao carregar para edição, garantir que 'itensSelecionados' inclua toda a estrutura do item disponível,
      // especialmente as 'variaveis' com os valores que foram salvos na proposta.
      setItensSelecionados(proposal.itensSelecionados.map(propItem => {
        const fullItem = itensDisponiveis.find(di => di.id === propItem.id); // Busca o item completo dos itensDisponiveis
        if (fullItem) {
          return {
            ...fullItem, // Mantém todas as propriedades do item disponível (incluindo variáveis padrão)
            ...propItem, // Sobrescreve com os valores específicos da proposta (quantidade, valor, e valores customizados das variáveis)
            variaveis: propItem.variaveis || [], // Garante que as variáveis salvas na proposta sejam usadas
          };
        }
        return propItem; // Caso não encontre, retorna o item como está
      }));

    } else {
      setIsEditing(false);
      setCurrentProposalId(null);
      setTipo("");
      setCliente(null);
      setSearchClienteText("");
      setIntroducaoId("");
      setTextoIntroducaoSelecionado("");
      setModeloTextoId("");
      setTextoModeloSelecionado("");
      setValidoPor("");
      setCondicoesPagamentoId("");
      setDescricao("");
      setItensSelecionados([]);
    }
  }, [location.state, introducoes, modelosTexto, formasPagamento, itensDisponiveis, setIsEditing, setCurrentProposalId, setTipo, setCliente, setSearchClienteText, setIntroducaoId, setTextoIntroducaoSelecionado, setModeloTextoId, setTextoModeloSelecionado, setValidoPor, setCondicoesPagamentoId, setDescricao, setItensSelecionados]);

  // useEffect para filtrar itens disponíveis com base no termo de busca
  useEffect(() => {
    if (itemSearchTerm.trim() === '') {
      setFilteredAvailableItems([]);
      return;
    }
    const filtered = itensDisponiveis.filter(item =>
      item.titulo.toLowerCase().includes(itemSearchTerm.toLowerCase())
    );
    setFilteredAvailableItems(filtered);
  }, [itemSearchTerm, itensDisponiveis]); // Dependências do useEffect


  // Efeito para filtrar clientes conforme o usuário digita - AGORA USANDO useCallback
  useEffect(() => {
    if (cliente && searchClienteText === cliente.nome) {
      setFilteredClients([]);
      return;
    }
  }, [searchClienteText, cliente, setFilteredClients]);


  const selecionarCliente = (clientObj) => {
    setCliente(clientObj);
    setSearchClienteText(clientObj.nome);
    setFilteredClients([]);
    clienteSearchRef.current.focus();
  };

  const handleAddItem = (itemId) => { // Mudado para itemId
    const itemBase = itensDisponiveis.find((item) => item.id === itemId);
    if (!itemBase) return;

    if (itensSelecionados.some((item) => item.id === itemId)) {
      toast.error("Este item já foi adicionado à proposta.");
      return;
    }

    const novoItem = {
      ...itemBase,
      quantidade: 1,
      valor: itemBase.valor !== undefined ? itemBase.valor : 0,
      variaveis: itemBase.variaveis ? itemBase.variaveis.map(v => ({ ...v })) : [],
    };
    
    setItensSelecionados([...itensSelecionados, novoItem]);
    setItemSearchTerm(''); // Clear search after adding
    setFilteredAvailableItems([]); // Clear suggestions
    itemSearchRef.current.focus(); // Keep focus on search input
  };

  const handleRemoveItem = (index) => {
    const novos = [...itensSelecionados];
    novos.splice(index, 1);
    setItensSelecionados(novos);
  };

  const handleAlterarItem = (index, field, value) => {
    const novos = [...itensSelecionados];
    if (field === "quantidade" || field === "valor") {
      value = Number(value);
      if (isNaN(value) || value < 0) value = 0;
    }
    novos[index][field] = value;
    setItensSelecionados(novos);
  };

  const handleUpdateItemVariable = (itemIndex, varIdx, field, value) => {
    const novosItens = [...itensSelecionados];
    if (novosItens[itemIndex] && novosItens[itemIndex].variaveis && novosItens[itemIndex].variaveis[varIdx]) {
      const finalValue = field === 'value' ? (Number(value) || 0) : value;
      novosItens[itemIndex].variaveis[varIdx][field] = finalValue;
      setItensSelecionados(novosItens);
    }
  };

  // Calcula o subtotal de um item
  const calculateItemSubtotal = (item) => {
    let subtotal = item.quantidade * (item.valor || 0);
    if (item.estilo === 'agrupado' && item.variaveis) {
      subtotal += item.variaveis.reduce((sum, v) => sum + (v.defaultIncluded ? (v.value || 0) : 0), 0);
    }
    return subtotal;
  };

  // Calcula o total geral da proposta
  const calculateTotalProposalValue = () => {
    return itensSelecionados.reduce((total, item) => total + calculateItemSubtotal(item), 0);
  };

  const totalGeralProposta = calculateTotalProposalValue();


  const handleSelecionarIntroducao = (e) => {
    const id = e.target.value;
    const selecionadoObj = introducoes.find((item) => (item.id ? item.id === id : item.texto === id));
    if (selecionadoObj) {
      setIntroducaoId(selecionadoObj.id || selecionadoObj.texto);
      setTextoIntroducaoSelecionado(selecionadoObj.texto || selecionadoObj);
    } else {
      setIntroducaoId("");
      setTextoIntroducaoSelecionado("");
    }
  };

  const handleSelecionarModeloTexto = (e) => {
    const id = e.target.value;
    const selecionadoObj = modelosTexto.find((item) => (item.id ? item.id === id : item.texto === id));
    if (selecionadoObj) {
      setModeloTextoId(selecionadoObj.id || selecionadoObj.texto);
      setTextoModeloSelecionado(selecionadoObj.texto || selecionadoObj);
    } else {
      setModeloTextoId("");
      setTextoModeloSelecionado("");
    }
  };

  const getFormaPagamentoNome = (idOrNome) => {
    const obj = formasPagamento.find((f) => f.id === idOrNome || f.nome === idOrNome);
    return obj ? obj.nome : idOrNome;
  };

  const handleBaixarProposta = () => {
    if (!cliente) {
      toast.error("Selecione um cliente para baixar a proposta");
      return;
    }

    const doc = new jsPDF();
    let yPos = 20; // Posição Y inicial
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Recuperar informações da empresa do localStorage (se existirem)
    const companyName = localStorage.getItem('sysConfig_companyName') || 'Sua Empresa'; //
    const companyCnpj = localStorage.Item('sysConfig_companyCnpj') || 'XX.XXX.XXX/XXXX-XX'; //

    // --- Cabeçalho ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, margin, yPos);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`CNPJ: ${companyCnpj}`, margin, yPos + 6);
    yPos += 20;
    doc.line(margin, yPos, pageWidth - margin, yPos); // Linha separadora
    yPos += 10;

    // --- Título da Proposta ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`PROPOSTA COMERCIAL`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Para: ${cliente.nome}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    // --- Informações Gerais ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Informações da Proposta:", margin, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Tipo: ${tipo}`, margin, yPos);
    doc.text(`Validade: ${validoPor}`, pageWidth / 2, yPos);
    yPos += 7;
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 7;
    doc.text(`Condições de Pagamento: ${getFormaPagamentoNome(condicoesPagamentoId)}`, margin, yPos);
    yPos += 15;

    // --- Introdução ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Introdução:", margin, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    const introText = htmlToText(textoIntroducaoSelecionado);
    const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin);
    doc.text(introLines, margin, yPos);
    yPos += (introLines.length * 6) + 10;

    // --- Itens da Proposta ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Itens da Proposta:", margin, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");

    itensSelecionados.forEach((item, i) => {
      const itemSubtotal = calculateItemSubtotal(item); // Calcula o subtotal do item
      const itemTitleLine = `${i + 1}. ${item.titulo} (Qtd: ${item.quantidade}) - R$ ${(item.valor || 0).toFixed(2)} cada - Subtotal: R$ ${itemSubtotal.toFixed(2)}`;
      doc.text(itemTitleLine, margin + 5, yPos);
      yPos += 7;
      
      if (item.descricao) {
        const itemDesc = `    ${item.descricao}`;
        const descLines = doc.splitTextToSize(itemDesc, pageWidth - 2 * margin - 10);
        doc.text(descLines, margin + 10, yPos);
        yPos += (descLines.length * 6);
      }

      if (item.estilo !== 'simples' && item.variaveis && item.variaveis.length > 0) {
        item.variaveis.forEach(variable => {
          if (item.estilo === 'agrupado' && variable.defaultIncluded) {
            const subItemText = `      - ${variable.name}: R$ ${(variable.value || 0).toFixed(2)}`;
            doc.text(subItemText, margin + 15, yPos);
            yPos += 7;
          } else if (item.estilo === 'detalhado') {
            const detailText = `      - ${variable.name}: ${variable.value || variable.defaultValue}`;
            doc.text(detailText, margin + 15, yPos);
            yPos += 7;
          }
        });
      }
    });
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Valor Total Geral: R$ ${totalGeralProposta.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 15;

    // --- Modelo de Texto (Corpo Principal) ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhes e Condições:", margin, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    const modelText = htmlToText(textoModeloSelecionado);
    const modelLines = doc.splitTextToSize(modelText, pageWidth - 2 * margin);
    doc.text(modelLines, margin, yPos);
    yPos += (modelLines.length * 6) + 10;

    // --- Observações Finais ---
    if (descricao) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Observações:", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(descricao, pageWidth - 2 * margin);
      doc.text(descLines, margin, yPos);
      yPos += (descLines.length * 6) + 10;
    }

    // --- Rodapé (Número de página) ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    doc.save(`Proposta_${cliente.nome}.pdf`);
    toast.success("PDF da proposta gerado com sucesso!");
  };

  const handleSendProposal = () => {
    toast.info("A funcionalidade de 'Enviar Proposta' requer um backend para envio de e-mails. Esta é uma simulação.");
  };

  const handleViewProposal = () => {
    if (!cliente) {
        toast.error("Selecione um cliente para visualizar a proposta.");
        return;
    }

    const proposalToPreview = {
      id: "preview-" + Date.now(),
      tipo,
      cliente: cliente.nome,
      clienteId: cliente.id,
      modeloTexto: textoModeloSelecionado,
      modeloTextoId: modeloTextoId,
      validoPor,
      condicoesPagamento: getFormaPagamentoNome(condicoesPagamentoId),
      condicoesPagamentoId: condicoesPagamentoId,
      descricao,
      itensSelecionados,
      introducao: textoIntroducaoSelecionado,
      dataCriacao: new Date().toISOString(),
      status: 'rascunho',
      history: [],
    };

    setSelectedProposalForView(proposalToPreview);
    setShowDetailModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tipo || !cliente || !modeloTextoId || !textoModeloSelecionado) {
      toast.error("Preencha todos os campos obrigatórios (Tipo, Cliente, Modelo de Texto).");
      return;
    }

    const propostaParaSalvar = {
      id: isEditing ? currentProposalId : Date.now(),
      tipo,
      cliente: cliente.nome,
      clienteId: cliente.id,
      modeloTexto: textoModeloSelecionado,
      modeloTextoId: modeloTextoId,
      validoPor,
      condicoesPagamento: getFormaPagamentoNome(condicoesPagamentoId),
      condicoesPagamentoId: condicoesPagamentoId,
      descricao,
      itensSelecionados,
      introducao: textoIntroducaoSelecionado,
      dataCriacao: isEditing ? getPropostas().find(p => p.id === currentProposalId)?.dataCriacao : new Date().toISOString(),
      status: isEditing ? (getPropostas().find(p => p.id === currentProposalId)?.status || 'enviadas') : 'enviadas',
    };

    const savedProposal = saveProposta(propostaParaSalvar); //

    // Depois de salvar/atualizar, atualiza o histórico da proposta do cliente
    const proposalValue = savedProposal.itensSelecionados.reduce((sum, item) => {
      let itemTotal = item.quantidade * (item.valor || 0);
      if (item.estilo === 'agrupado' && item.variaveis) {
        itemTotal += item.variaveis.reduce((subSum, v) => subSum + (v.defaultIncluded ? (v.value || 0) : 0), 0);
      }
      return sum + itemTotal;
    }, 0);

    addProposalToClientHistory(
      cliente.id,
      savedProposal.id,
      savedProposal.cliente,
      savedProposal.status,
      proposalValue,
      savedProposal.dataCriacao
    );

    if (isEditing) {
      toast.success("Proposta atualizada com sucesso!");
    } else {
      toast.success("Proposta salva com sucesso!");
    }
    navigate("/propostas");
  };

  return (
    <div className={styles["adicionar-proposta"]}>
      <div className={styles["top-bar"]}>
        <h2>{isEditing ? "Editar Proposta" : "Adicionar Nova Proposta"}</h2>
        <FaCog className={styles["config-icon"]} onClick={irParaConfiguracoes} />
      </div>

      <form onSubmit={handleSubmit} className={styles["form-proposta"]}>
        {/* Card: Informações Gerais da Proposta */}
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Dados da Proposta</h3>
          <div className={styles.formColumns}>
            <div className={styles.formSection}>
              <label htmlFor="tipoProposta" className={styles.label}>Tipo *</label>
              <select id="tipoProposta" value={tipo} onChange={(e) => setTipo(e.target.value)} required className={styles.selectField}>
                <option value="">Selecione</option>
                <option value="contrato">Contrato</option>
                <option value="avulso">Avulso</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>

            <div className={styles.formSection}>
              <label htmlFor="validade" className={styles.label}>Validade da Proposta</label>
              <select id="validade" value={validoPor} onChange={(e) => setValidoPor(e.target.value)} className={styles.selectField}>
                <option value="">Selecione</option>
                {prazosValidade.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formSection}>
              <label htmlFor="formaPagamento" className={styles.label}>Forma de Pagamento</label>
              <select id="formaPagamento" value={condicoesPagamentoId} onChange={(e) => setCondicoesPagamentoId(e.target.value)} className={styles.selectField}>
                <option value="">Selecione</option>
                {formasPagamento.map((f) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>
          </div> {/* Fim form-columns */}
        </div> {/* Fim formCard */}


        {/* Card: Seleção de Cliente */}
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Cliente</h3>
          <div className={styles.formSection} style={{ position: "relative" }}>
            <label htmlFor="searchClient" className={styles.label}>Cliente *</label>
            <input
              id="searchClient"
              type="text"
              value={searchClienteText}
              onChange={(e) => handleSearchClienteChange(e.target.value)} // Usar o handler com debounce
              placeholder="Digite o nome do cliente ou selecione"
              autoComplete="off"
              className={styles.inputField}
              required
              ref={clienteSearchRef}
            />
            {searchClienteText.length > 0 && filteredClients.length > 0 && (
              <div className={styles.clientDropdown}>
                {filteredClients.map((c) => (
                  <div
                    key={c.id}
                    className={styles.clientOption}
                    onClick={() => selecionarCliente(c)}
                  >
                    {c.nome} — {c.cpf_cnpj}
                  </div>
                ))}
              </div>
            )}
            {/* O prompt de registro aparece SOMENTE se não houver cliente selecionado E a busca não retornou resultados */}
            {searchClienteText.length > 0 && filteredClients.length === 0 && !cliente && (
              <div
                className={styles.clientRegisterPrompt}
                onClick={irParaCadastroCliente}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter") irParaCadastroCliente();
                }}
              >
                <FaPlusCircle /> Cadastrar novo cliente: "{searchClienteText}"
              </div>
            )}
            {cliente && <p className={styles.selectedClientInfo}>Cliente selecionado: <strong>{cliente.nome}</strong></p>}
          </div>
        </div> {/* Fim formCard */}


        {/* Card: Conteúdo da Proposta - Introdução */}
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Introdução</h3>
          <div className={styles.formSection}>
            <label htmlFor="introducaoSelect" className={styles.label}>Modelos de Introdução</label>
            <select id="introducaoSelect" value={introducaoId} onChange={handleSelecionarIntroducao} className={styles.selectField}>
              <option value="">Selecione a introdução</option>
              {introducoes.map((item) => (
                <option key={item.id || item.texto} value={item.id || item.texto}>{htmlToText(item.texto || item).substring(0, 50)}...</option>
              ))}
            </select>
          </div>
          <div className={styles.formSection}>
            <ReactQuill
              value={textoIntroducaoSelecionado}
              onChange={setTextoIntroducaoSelecionado}
              placeholder="Edite a introdução aqui..."
              theme="snow"
              className={styles.quillEditor}
            />
          </div>
        </div>


        {/* Card: Itens da Proposta (MODIFIED SECTION) */}
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Itens da Proposta</h3>
          <div className={styles.formSection}>
            <label htmlFor="addItemSearch" className={styles.label}>Adicionar Item</label>
            <div className={styles.addItemRow}>
                <input
                  id="addItemSearch"
                  type="text"
                  value={itemSearchTerm}
                  onChange={(e) => setItemSearchTerm(e.target.value)}
                  placeholder="Busque ou selecione um item..."
                  autoComplete="off"
                  className={styles.inputField}
                  ref={itemSearchRef}
                />
                {itemSearchTerm.length > 0 && filteredAvailableItems.length > 0 && (
                  <div className={styles.itemDropdown}>
                    {filteredAvailableItems.map((item) => (
                      <div
                        key={item.id}
                        className={styles.itemOption}
                        onClick={() => handleAddItem(item.id)}
                      >
                        {item.titulo} ({item.estilo})
                      </div>
                    ))}
                  </div>
                )}
                 {itemSearchTerm.length > 0 && filteredAvailableItems.length === 0 && (
                  <p className={styles.noItemFoundMessage}>Nenhum item encontrado. Verifique as configurações de itens.</p>
                )}
            </div>

            <ul className={styles.selectedItemsList}>
              {itensSelecionados.length === 0 ? (
                <li className={styles.noItemsMessage}>Nenhum item adicionado.</li>
              ) : (
                itensSelecionados.map((item, idx) => (
                  <li key={item.id} className={styles.itemProposta}>
                    <div className={styles.itemSummary}> {/* Novo container para título e subtotal */}
                      <span className={styles.itemTitle}>{item.titulo} ({item.estilo})</span>
                      <span className={styles.itemSubtotal}>Subtotal: R$ {calculateItemSubtotal(item).toFixed(2)}</span>
                    </div>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemInputGroup}>
                        <label>Qtd</label>
                        <input
                          type="number"
                          min="0"
                          value={item.quantidade}
                          onChange={(e) => handleAlterarItem(idx, "quantidade", e.target.value)}
                          className={styles.itemInputField}
                        />
                      </div>
                      <div className={styles.itemInputGroup}>
                        <label>Valor (R$)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.valor}
                          onChange={(e) => handleAlterarItem(idx, "valor", e.target.value)}
                          className={styles.itemInputField}
                        />
                      </div>
                      <button type="button" onClick={() => handleRemoveItem(idx)} className={styles.removeItemButton}>
                        <FaTimes />
                      </button>
                    </div>

                    {/* Renderiza as variáveis/sub-itens para estilos 'agrupado' e 'detalhado' */}
                    {item.estilo !== 'simples' && item.variaveis && item.variaveis.length > 0 && (
                      <div className={styles.itemVariablesContainer}>
                        <p className={styles.itemVariablesLabel}>
                            <FaInfoCircle /> {item.estilo === 'agrupado' ? 'Sub-itens:' : 'Detalhes Técnicos:'}
                        </p>
                        <ul className={styles.itemVariablesList}>
                          {item.variaveis.map((variable, varIdx) => (
                            <li key={variable.name} className={styles.itemVariableEntry}>
                              <span className={styles.itemVariableName}>{variable.name}:</span>
                              {item.estilo === 'agrupado' ? (
                                <div className={styles.variableInputWrapper}>
                                    <input
                                      type="checkbox"
                                      checked={variable.defaultIncluded}
                                      onChange={(e) => handleUpdateItemVariable(idx, varIdx, 'defaultIncluded', e.target.checked)}
                                    />
                                    <label>Incluir</label>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={variable.value}
                                      onChange={(e) => handleUpdateItemVariable(idx, varIdx, 'value', e.target.value)}
                                      className={styles.itemVariableValueInput}
                                    />
                                </div>
                              ) : ( // estilo === 'detalhado'
                                <input
                                  type={variable.type || 'text'}
                                  value={variable.value || ''}
                                  onChange={(e) => handleUpdateItemVariable(idx, varIdx, 'value', e.target.value)}
                                  placeholder={variable.defaultValue}
                                  className={styles.itemVariableValueInput}
                                />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
            {/* Total Geral da Proposta */}
            {itensSelecionados.length > 0 && (
              <div className={styles.totalGeralContainer}>
                <span className={styles.totalGeralLabel}>Total Geral da Proposta:</span>
                <span className={styles.totalGeralValue}>R$ {totalGeralProposta.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>


        {/* Card: Conteúdo da Proposta - Modelo de Texto */}
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Modelo de Texto</h3>
          <div className={styles.formSection}>
            <label htmlFor="modeloTextoSelect" className={styles.label}>Modelos de Texto</label>
            <select id="modeloTextoSelect" value={modeloTextoId} onChange={handleSelecionarModeloTexto} className={styles.selectField}>
              <option value="">Selecione o modelo</option>
              {modelosTexto.map((item) => (
                <option key={item.id || item.texto} value={item.id || item.texto}>{htmlToText(item.texto || item).substring(0, 50)}...</option>
              ))}
            </select>
          </div>
          <div className={styles.formSection}>
            <ReactQuill
              value={textoModeloSelecionado}
              onChange={setTextoModeloSelecionado}
              placeholder="Edite o modelo de texto aqui..."
              theme="snow"
              className={styles.quillEditor}
            />
          </div>
        </div>


        {/* Card: Observações Gerais */}
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>Observações da Proposta</h3>
          <div className={styles.formSection}>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Escreva observações adicionais da proposta."
              className={styles.textareaField}
            />
          </div>
        </div>


        {/* Grupo de Botões de Ação */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            {isEditing ? "Atualizar Proposta" : "Salvar Proposta"}
          </button>
          <button type="button" onClick={handleSendProposal} className={styles.actionButton}>
            Enviar Proposta
          </button>
          <button type="button" onClick={handleViewProposal} className={styles.actionButton}>
            Visualizar Proposta
          </button>
          <button type="button" onClick={handleBaixarProposta} className={styles.actionButton}>
            <FaDownload /> Baixar Proposta
          </button>
        </div>
      </form>

      {/* Modal de Detalhes da Proposta para visualização */}
      <ProposalDetailModal
        show={showDetailModal}
        proposal={selectedProposalForView}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedProposalForView(null);
        }}
      />
    </div>
  );
};

export default AdicionarProposta;