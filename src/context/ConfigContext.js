// src/context/ConfigContext.js
import React, { createContext, useState, useEffect } from "react"; // <--- Adicione 'useState' e 'useEffect' aqui

// Definindo padrões iniciais que serão usados se nada estiver no localStorage
// IMPORTANTE: Estes são os valores padrão do sistema.
// Se o localStorage estiver vazio para uma determinada chave, estes valores serão usados.
// Se uma chave for definida no localStorage, o valor do localStorage terá precedência.

const FORMAS_PAGAMENTO_PADRAO_INICIAL = [
  { id: "1", nome: "Dinheiro", iconeId: "dinheiro" },
  { id: "2", nome: "Cartão de Crédito", iconeId: "credito" },
  { id: "3", nome: "Cartão de Débito", iconeId: "debito" },
  { id: "4", nome: "Boleto Bancário", iconeId: "boleto" },
  { id: "5", nome: "Pix", iconeId: "pix" },
];

const MODELO_INTRODUCAO_PADRAO_INICIAL = {
  id: "padrao",
  texto:
    "<p>Prezados,</p>" +
    "<p>Apresentamos a seguir nossa proposta, elaborada com o objetivo de atender plenamente às suas necessidades e expectativas. Detalhamos as soluções, escopo e condições comerciais para sua análise.</p>" +
    "<p>Estamos à disposição para qualquer esclarecimento adicional ou ajuste necessário, visando sempre a excelência e a construção de uma parceria de sucesso.</p>" +
    "<p>Atenciosamente,</p>",
};

const MODELO_TEXTO_PADRAO_INICIAL = {
  id: "padrao",
  texto: `<p>Prezado(a) Cliente,</p>
<p>Encaminhamos esta proposta para sua análise e consideração. Estamos à disposição para esclarecer quaisquer dúvidas e ajustar os termos conforme necessário para melhor atendê-lo(a).</p>
<p>Agradecemos a oportunidade e esperamos estabelecer uma parceria de sucesso.</p>
<p>Atenciosamente,</p>
<p>[Seu Nome/Nome da Empresa]</p>
<p>[Seu Contato]</p>`,
};

const PRAZOS_VALIDADE_PADRAO_INICIAL = ["07 Dias", "15 Dias", "30 Dias", "60 Dias", "90 Dias"];

const ITENS_PADRAO_INICIAL = []; // Alterado para array vazio, sem padrões iniciais

const PAPEIS_TIMBRADOS_PADRAO_INICIAL = [];


// Crie e exporte o contexto diretamente aqui
export const ConfigContext = createContext(); // <--- Adicione 'export' aqui

export const ConfigProvider = ({ children }) => {
  // Estado para controlar se as configurações já foram carregadas do localStorage
  const [isInitialized, setIsInitialized] = useState(false);

  // Estados locais para cada configuração
  const [formasPagamento, setFormasPagamentoState] = useState([]);
  const [modelosTexto, setModelosTextoState] = useState([]);
  const [introducoes, setIntroducoesState] = useState([]);
  const [clientes, setClientes] = useState([]); // Clientes são gerenciados em clientesMock.js, não diretamente aqui
  const [prazosValidade, setPrazosValidadeState] = useState([]);
  const [itensDisponiveis, setItensDisponiveisState] = useState([]);
  const [papeisTimbrados, setPapeisTimbradosState] = useState([]);

  // useEffect para carregar as configurações do localStorage ou definir padrões
  // Este useEffect é executado apenas uma vez, após a primeira renderização
  useEffect(() => {
    // Garante que o código só seja executado no ambiente do navegador (onde localStorage existe)
    if (typeof window === 'undefined') return;

    // Função auxiliar para carregar uma configuração específica
    const loadConfig = (key, defaultValues) => {
      const stored = localStorage.getItem(`config_${key}`);
      return stored ? JSON.parse(stored) : defaultValues;
    };

    // Carrega cada configuração, usando o valor do localStorage ou o padrão inicial
    setFormasPagamentoState(loadConfig("formasPagamento", FORMAS_PAGAMENTO_PADRAO_INICIAL));
    setModelosTextoState(loadConfig("modelosTexto", [MODELO_TEXTO_PADRAO_INICIAL])); // Note que modelosTexto é um array que contém o objeto padrão
    setIntroducoesState(loadConfig("introducoes", [MODELO_INTRODUCAO_PADRAO_INICIAL])); // Note que introducoes é um array que contém o objeto padrão
    setPrazosValidadeState(loadConfig("prazosValidade", PRAZOS_VALIDADE_PADRAO_INICIAL));
    setItensDisponiveisState(loadConfig("itensDisponiveis", ITENS_PADRAO_INICIAL));
    setPapeisTimbradosState(loadConfig("papeisTimbrados", PAPEIS_TIMBRADOS_PADRAO_INICIAL));

    // Clientes são carregados diretamente do mock de clientes, que gerencia seu próprio localStorage
    setClientes(JSON.parse(localStorage.getItem('clientes')) || []);

    // Marca que a inicialização do contexto foi concluída
    setIsInitialized(true);
  }, []);

  // UseEffects separados para cada estado, para salvar no localStorage sempre que o estado mudar.
  // A verificação `isInitialized` impede que o localStorage seja salvo antes de ser totalmente carregado.
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem("config_formasPagamento", JSON.stringify(formasPagamento));
    }
  }, [formasPagamento, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem("config_modelosTexto", JSON.stringify(modelosTexto));
    }
  }, [modelosTexto, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem("config_introducoes", JSON.stringify(introducoes));
    }
  }, [introducoes, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem("config_prazosValidade", JSON.stringify(prazosValidade));
    }
  }, [prazosValidade, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem("config_itensDisponiveis", JSON.stringify(itensDisponiveis));
    }
  }, [itensDisponiveis, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem("config_papeisTimbrados", JSON.stringify(papeisTimbrados));
    }
  }, [papeisTimbrados, isInitialized]);


  // Wrappers para os setters dos estados.
  // Eles atualizam o estado local e os `useEffect`s acima cuidam de salvar no localStorage.
  const setFormasPagamento = (value) => setFormasPagamentoState(value);
  const setModelosTexto = (value) => setModelosTextoState(value);
  const setIntroducoes = (value) => setIntroducoesState(value);
  const setPrazosValidade = (value) => setPrazosValidadeState(value);
  const setItensDisponiveis = (value) => setItensDisponiveisState(value);
  const setPapeisTimbrados = (value) => setPapeisTimbradosState(value);


  return (
    <ConfigContext.Provider
      value={{
        formasPagamento,
        setFormasPagamento,
        modelosTexto,
        setModelosTexto,
        introducoes,
        setIntroducoes,
        clientes,
        setClientes, // Manter o setter de clientes para o mock
        prazosValidade,
        setPrazosValidade,
        itensDisponiveis,
        setItensDisponiveis,
        papeisTimbrados,
        setPapeisTimbrados,
      }}
    >
      {/* Renderiza os filhos apenas depois que o contexto foi inicializado (carregado do localStorage ou padrões) */}
      {isInitialized ? children : <div>Carregando configurações...</div>}
    </ConfigContext.Provider>
  );
};