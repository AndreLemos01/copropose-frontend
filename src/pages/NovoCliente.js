// src/pages/NovoCliente.js
import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { saveCliente } from "../data/clientesMock";

import PessoaFisicaForm from "../components/clientes/PessoaFisicaForm";
import PessoaJuridicaForm from "../components/clientes/PessoaJuridicaForm";
import AccordionContato from "../components/clientes/AccordionContato";
import AccordionEndereco from "../components/clientes/AccordionEndereco";
import AccordionObservacoes from "../components/clientes/AccordionObservacoes";
import { Accordion, Card, Button } from "react-bootstrap";
import styles from "./NovoCliente.module.css";

// Regex mais robustas para validação
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cepRegex = /^\d{5}-?\d{3}$/;
const telRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/; // Formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX

const AdicionarClientes = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tipoPessoa, setTipoPessoa] = useState("");
  const [dados, setDados] = useState({
    telefones: [""],
    emails: [""],
    logradouro: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    complemento: "",
    observacoes: "",
    nomeCompleto: "",
    cpf: "",
    razaoSocial: "",
    cnpj: "",
    dataAbertura: "",
    porte: "",
    responsavelLegal: "",
    dataNascimento: "",
    sexo: "",
    estadoCivil: "",
    profissao: "",
    nacionalidade: "",
    naturalidade: "",
  });
  const [animatingOut, setAnimatingOut] = useState(false);
  const [erros, setErros] = useState({});
  const primeiroInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.clientToEdit) {
      const client = location.state.clientToEdit;
      setIsEditing(true);
      setCurrentClientId(client.id);

      setTipoPessoa(client.tipo === "Pessoa Física" ? "fisica" : "juridica");
      setDados({
        ...dados,
        nomeCompleto: client.nome || "",
        razaoSocial: client.nome || "",
        cpf: client.cpf_cnpj || "",
        cnpj: client.cpf_cnpj || "",
        emails: client.contatos?.map(c => c.email).filter(e => e) || [client.email || ""].filter(e => e) || [""],
        telefones: client.contatos?.map(c => c.telefone).filter(t => t) || [client.telefone || ""].filter(t => t) || [""],
        logradouro: client.endereco?.logradouro || "",
        endereco: client.endereco?.rua || "",
        numero: client.endereco?.numero || "",
        bairro: client.endereco?.bairro || "",
        cidade: client.endereco?.cidade || "",
        estado: client.endereco?.estado || "",
        cep: client.endereco?.cep || "",
        complemento: client.endereco?.complemento || "",
        observacoes: client.observacoes || "",
        dataAbertura: client.dataAbertura || "",
        porte: client.porte || "",
        responsavelLegal: client.responsavelLegal || "",
        dataNascimento: client.dataNascimento || "",
        sexo: client.sexo || "",
        estadoCivil: client.estadoCivil || "",
        profissao: client.profissao || "",
        nacionalidade: client.nacionalidade || "",
        naturalidade: client.naturalidade || "",
      });
    } else {
      setIsEditing(false);
      setCurrentClientId(null);
      setTipoPessoa("");
      setDados({
        telefones: [""], emails: [""], logradouro: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "",
        cep: "", complemento: "", observacoes: "", nomeCompleto: "", cpf: "",
        razaoSocial: "", cnpj: "", dataAbertura: "", porte: "", responsavelLegal: "",
        dataNascimento: "", sexo: "", estadoCivil: "", profissao: "", nacionalidade: "", naturalidade: "",
      });
    }

    if (!animatingOut) {
      setTimeout(() => {
        primeiroInputRef.current?.focus();
      }, 200);
    }
  }, [location.state, animatingOut]);


  const updateTelefone = (index, valor) => {
    const novosTelefones = [...dados.telefones];
    novosTelefones[index] = valor;
    setDados({ ...dados, telefones: novosTelefones });
    validarCampo('telefones', novosTelefones); // Validação imediata
  };

  const addTelefone = () => {
    setDados({ ...dados, telefones: [...dados.telefones, ""] });
  };

  const removeTelefone = (index) => {
    const novos = dados.telefones.filter((_, i) => i !== index);
    setDados({ ...dados, telefones: novos.length ? novos : [""] });
    validarCampo('telefones', novos.length ? novos : [""]); // Validação imediata
  };

  const updateEmail = (index, valor) => {
    const novosEmails = [...dados.emails];
    novosEmails[index] = valor;
    setDados({ ...dados, emails: novosEmails });
    validarCampo('emails', novosEmails); // Validação imediata
  };

  const addEmail = () => {
    setDados({ ...dados, emails: [...dados.emails, ""] });
  };

  const removeEmail = (index) => {
    const novos = dados.emails.filter((_, i) => i !== index);
    setDados({ ...dados, emails: novos.length ? novos : [""] });
    validarCampo('emails', novos.length ? novos : [""]); // Validação imediata
  };

  // Função genérica para validar um campo e atualizar o estado de erros
  const validarCampo = (campo, valor) => {
    let mensagemErro = '';
    const tempErros = { ...erros }; // Cópia dos erros atuais

    switch (campo) {
      case 'tipoPessoa':
        if (!valor) {
          mensagemErro = "Tipo de pessoa é obrigatório.";
        }
        break;
      case 'nomeCompleto':
        if (tipoPessoa === 'fisica' && (!valor || valor.trim() === "")) {
          mensagemErro = "Nome completo é obrigatório.";
        }
        break;
      case 'cpf':
        if (tipoPessoa === 'fisica' && (!valor || !/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(valor))) {
          mensagemErro = "CPF inválido. Use o formato 000.000.000-00";
        }
        break;
      case 'razaoSocial':
        if (tipoPessoa === 'juridica' && (!valor || valor.trim() === "")) {
          mensagemErro = "Razão social é obrigatória.";
        }
        break;
      case 'cnpj':
        if (tipoPessoa === 'juridica' && (!valor || !/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(valor))) {
          mensagemErro = "CNPJ inválido. Use o formato 00.000.000/0000-00";
        }
        break;
      case 'dataAbertura':
        if (tipoPessoa === 'juridica' && !valor) {
          mensagemErro = "Data de abertura é obrigatória.";
        }
        break;
      case 'porte':
        if (tipoPessoa === 'juridica' && !valor) {
          mensagemErro = "Porte é obrigatório.";
        }
        break;
      case 'responsavelLegal':
        if (tipoPessoa === 'juridica' && (!valor || valor.trim() === "")) {
          mensagemErro = "Responsável legal é obrigatório.";
        }
        break;
      case 'dataNascimento':
        if (tipoPessoa === 'fisica' && !valor) {
            mensagemErro = "Data de nascimento é obrigatória.";
        }
        break;
      case 'telefones':
        const hasValidTel = valor.some((tel) => tel.trim() !== "" && telRegex.test(tel));
        const hasInvalidFilledTel = valor.some(tel => tel.trim() !== "" && !telRegex.test(tel));
        if (!hasValidTel && valor.some(tel => tel.trim() !== "")) { // Se houver algum preenchido, mas nenhum válido
            mensagemErro = "Informe pelo menos um telefone válido (ex: (00) 00000-0000).";
        } else if (hasInvalidFilledTel) {
            mensagemErro = "Alguns telefones estão inválidos. Use o formato (00) 00000-0000.";
        } else if (valor.every(tel => tel.trim() === "")) { // Se todos estiverem vazios
            mensagemErro = "Informe pelo menos um telefone.";
        }
        break;
      case 'emails':
        const hasValidEmail = valor.some((email) => email.trim() !== "" && emailRegex.test(email));
        const hasInvalidFilledEmail = valor.some(email => email.trim() !== "" && !emailRegex.test(email));
        if (!hasValidEmail && valor.some(email => email.trim() !== "")) { // Se houver algum preenchido, mas nenhum válido
            mensagemErro = "Informe pelo menos um e-mail válido.";
        } else if (hasInvalidFilledEmail) {
            mensagemErro = "Alguns e-mails estão inválidos.";
        } else if (valor.every(email => email.trim() === "")) { // Se todos estiverem vazios
            mensagemErro = "Informe pelo menos um e-mail.";
        }
        break;
      case 'cep':
        if (!valor || valor.trim() === "") {
            mensagemErro = "O campo CEP é obrigatório.";
        } else if (!cepRegex.test(valor)) {
            mensagemErro = "CEP inválido. Use o formato 00000-000.";
        }
        break;
      case 'logradouro':
        if (!valor || valor.trim() === "") {
          mensagemErro = "O campo Logradouro é obrigatório.";
        }
        break;
      case 'endereco':
        if (!valor || valor.trim() === "") {
          mensagemErro = "O campo Endereço é obrigatório.";
        }
        break;
      case 'numero':
        if (!valor || valor.trim() === "") {
          mensagemErro = "O campo Número é obrigatório.";
        }
        break;
      case 'bairro':
        if (!valor || valor.trim() === "") {
          mensagemErro = "O campo Bairro é obrigatório.";
        }
        break;
      case 'cidade':
        if (!valor || valor.trim() === "") {
          mensagemErro = "O campo Cidade é obrigatório.";
        }
        break;
      case 'estado':
        if (!valor || valor.trim() === "") {
          mensagemErro = "O campo Estado é obrigatório.";
        }
        break;
      case 'observacoes':
        // A validação de observações é opcional, pode ser vazia
        break;
      default:
        break;
    }

    if (mensagemErro) {
      tempErros[campo] = mensagemErro;
    } else {
      delete tempErros[campo];
    }
    setErros(tempErros);
    return !mensagemErro; // Retorna true se não houver erro
  };


  const adicionarCliente = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    const currentErrors = {}; // Objeto temporário para coletar todos os erros na submissão

    // Validar tipo de pessoa primeiro
    if (!validarCampo('tipoPessoa', tipoPessoa)) formIsValid = false;

    // Validar campos específicos de Pessoa Física
    if (tipoPessoa === 'fisica') {
      if (!validarCampo('nomeCompleto', dados.nomeCompleto)) formIsValid = false;
      if (!validarCampo('cpf', dados.cpf)) formIsValid = false;
      if (!validarCampo('dataNascimento', dados.dataNascimento)) formIsValid = false;
      // Sexo, estado civil, profissão, nacionalidade, naturalidade são opcionais aqui
    }

    // Validar campos específicos de Pessoa Jurídica
    if (tipoPessoa === 'juridica') {
      if (!validarCampo('razaoSocial', dados.razaoSocial)) formIsValid = false;
      if (!validarCampo('cnpj', dados.cnpj)) formIsValid = false;
      if (!validarCampo('dataAbertura', dados.dataAbertura)) formIsValid = false;
      if (!validarCampo('porte', dados.porte)) formIsValid = false;
      if (!validarCampo('responsavelLegal', dados.responsavelLegal)) formIsValid = false;
    }

    // Validar Contatos (telefones e emails)
    if (!validarCampo('telefones', dados.telefones)) formIsValid = false;
    if (!validarCampo('emails', dados.emails)) formIsValid = false;

    // Validar Endereço
    if (!validarCampo('cep', dados.cep)) formIsValid = false;
    if (!validarCampo('logradouro', dados.logradouro)) formIsValid = false;
    if (!validarCampo('endereco', dados.endereco)) formIsValid = false;
    if (!validarCampo('numero', dados.numero)) formIsValid = false;
    if (!validarCampo('bairro', dados.bairro)) formIsValid = false;
    if (!validarCampo('cidade', dados.cidade)) formIsValid = false;
    if (!validarCampo('estado', dados.estado)) formIsValid = false;

    // Se após todas as validações, o formulário não for válido, não prossegue
    if (!formIsValid || Object.keys(erros).length > 0) { // Verifica se algum erro foi setado
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    const clienteParaSalvar = {
      id: isEditing ? currentClientId : Date.now(),
      tipo: tipoPessoa === "fisica" ? "Pessoa Física" : "Pessoa Jurídica",
      nome: dados.nomeCompleto || dados.razaoSocial || "",
      cpf_cnpj: dados.cpf || dados.cnpj || "",
      // Pegar o primeiro telefone/email válido ou vazio
      email: dados.emails.filter(e => e.trim() !== "" && emailRegex.test(e))[0] || "",
      telefone: dados.telefones.filter(t => t.trim() !== "" && telRegex.test(t))[0] || "",
      observacoes: dados.observacoes || "",
      endereco: {
        cep: dados.cep,
        logradouro: dados.logradouro,
        rua: dados.endereco,
        numero: dados.numero,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.cidade,
        estado: dados.estado,
      },
      // Salvar todos os contatos como um array de objetos
      contatos: dados.telefones
        .map((telefone, i) => ({
          telefone: telefone || "",
          email: dados.emails[i] || "", // Associa email correspondente
        }))
        .filter(c => c.telefone.trim() !== "" || c.email.trim() !== ""), // Filtra contatos vazios

      dataAbertura: dados.dataAbertura || "",
      porte: dados.porte || "",
      responsavelLegal: dados.responsavelLegal || "",
      dataNascimento: dados.dataNascimento || "",
      sexo: dados.sexo || "",
      estadoCivil: dados.estadoCivil || "",
      profissao: dados.profissao || "",
      nacionalidade: dados.nacionalidade || "",
      naturalidade: dados.naturalidade || "",
    };

    saveCliente(clienteParaSalvar);

    if (isEditing) {
      toast.success("Cliente atualizado com sucesso!");
    } else {
      toast.success("Cliente salvo com sucesso!");
    }
    
    if (onClose) onClose(clienteParaSalvar);
  };

  const fecharFormulario = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      if (onClose) onClose(null);
    }, 400);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="novo-cliente-title">
      <div className={`${styles.container} ${animatingOut ? styles.hide : styles.show}`}>
        <div className={styles.header}>
          <h1 id="novo-cliente-title">{isEditing ? "Editar Cliente" : "Adicionar Cliente"}</h1>
          <button onClick={fecharFormulario} className={styles.closeButton} aria-label="Fechar">
            <FaTimes />
          </button>
        </div>

        <form className={styles.form} onSubmit={adicionarCliente} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="tipoPessoa" className={styles.label}>Tipo</label>
            <select
              id="tipoPessoa"
              value={tipoPessoa}
              onChange={(e) => {
                setTipoPessoa(e.target.value);
                setDados({ // Resetar dados específicos do tipo de pessoa ao mudar
                  telefones: [""], emails: [""], logradouro: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "",
                  cep: "", complemento: "", observacoes: "", nomeCompleto: "", cpf: "",
                  razaoSocial: "", cnpj: "", dataAbertura: "", porte: "", responsavelLegal: "",
                  dataNascimento: "", sexo: "", estadoCivil: "", profissao: "", nacionalidade: "", naturalidade: "",
                });
                setErros({}); // Limpa erros ao mudar o tipo de pessoa
                validarCampo('tipoPessoa', e.target.value); // Valida imediatamente
              }}
              className={`${styles.select} ${erros.tipoPessoa ? styles.inputError : ""}`}
              required
              ref={primeiroInputRef}
              disabled={isEditing}
              aria-invalid={!!erros.tipoPessoa}
              aria-describedby={erros.tipoPessoa ? "error-tipoPessoa" : undefined}
            >
              <option value="">Selecione</option>
              <option value="fisica">Física</option>
              <option value="juridica">Jurídica</option>
            </select>
            {erros.tipoPessoa && (
              <div id="error-tipoPessoa" className={styles.errorMsg}>
                {erros.tipoPessoa}
              </div>
            )}
          </div>

          {tipoPessoa === "fisica" && (
            <PessoaFisicaForm dados={dados} setDados={setDados} erros={erros} validarCampo={validarCampo} />
          )}

          {tipoPessoa === "juridica" && (
            <PessoaJuridicaForm dados={dados} setDados={setDados} erros={erros} validarCampo={validarCampo} />
          )}

          <Accordion>
            <Card>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" className={styles.accordionToggle}>
                Contato
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <AccordionContato
                    dados={dados}
                    updateTelefone={updateTelefone}
                    addTelefone={addTelefone}
                    removeTelefone={removeTelefone}
                    updateEmail={updateEmail}
                    addEmail={addEmail}
                    removeEmail={removeEmail}
                    erros={erros}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>

            <Card>
              <Accordion.Toggle as={Button} variant="link" eventKey="1" className={styles.accordionToggle}>
                Endereço
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <AccordionEndereco dados={dados} setDados={setDados} erros={erros} validarCampo={validarCampo} />
                </Card.Body>
              </Accordion.Collapse>
            </Card>

            <Card>
              <Accordion.Toggle as={Button} variant="link" eventKey="2" className={styles.accordionToggle}>
                Observações Gerais
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <AccordionObservacoes
                    dados={dados}
                    setDados={setDados}
                    erros={erros}
                    validarCampo={validarCampo}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.submitButton}>{isEditing ? "Atualizar Cliente" : "Salvar Cliente"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdicionarClientes;