// src/pages/SystemConfig.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaUserCog, FaPuzzlePiece, FaRedo } from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from './SystemConfig.module.css';

const SystemConfig = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState(localStorage.getItem('sysConfig_companyName') || ''); // Inicia vazio
  const [companyCnpj, setCompanyCnpj] = useState(localStorage.getItem('sysConfig_companyCnpj') || ''); // Inicia vazio
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem('sysConfig_adminEmail') || ''); // Inicia vazio

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('sysConfig_companyName', companyName);
    localStorage.setItem('sysConfig_companyCnpj', companyCnpj);
    localStorage.setItem('sysConfig_adminEmail', adminEmail);
    toast.success('Configurações do sistema salvas com sucesso!');
  };

  const handleResetMockData = () => {
    if (window.confirm("ATENÇÃO: Isso irá apagar TODAS as propostas, clientes, usuários e configurações mockados. Deseja continuar?")) {
      // Limpa dados de usuários e propostas
      localStorage.removeItem('users');
      localStorage.removeItem('propostas');
      localStorage.removeItem('clientes'); // Se você tiver clientes mockados diretamente no localStorage

      // Limpa configurações do sistema
      localStorage.removeItem('sysConfig_companyName');
      localStorage.removeItem('sysConfig_companyCnpj');
      localStorage.removeItem('sysConfig_adminEmail');

      // Limpa as configurações de propostas (se elas persistirem no localStorage)
      // Se elas são controladas apenas pelo ConfigContext, elas se resetam ao carregar o app.
      // Se você as estiver salvando explicitamente no localStorage em outros lugares, adicione as chaves aqui.
      // Ex: localStorage.removeItem('formasPagamento');
      // Ex: localStorage.removeItem('modelosTexto');
      // Ex: localStorage.removeItem('introducoes');
      // Ex: localStorage.removeItem('prazosValidade');
      // Ex: localStorage.removeItem('itensDisponiveis');
      // Ex: localStorage.removeItem('papeisTimbrados');

      toast.success('Dados mockados resetados. Por favor, recarregue a página para ver as mudanças.');
      // Opcional: navigate('/login'); para garantir que o usuário veja a tela de login inicial
      window.location.reload(); // Recarrega a página para zerar o estado de todos os componentes
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate('/dashboard')}
          className={styles.btnVoltar}
          aria-label="Voltar para Dashboard"
          type="button"
        >
          <FaArrowLeft />
          <span>Voltar</span>
        </button>
        <h2 className={styles.title}>Configurações do Sistema</h2>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tabButton} ${styles.active}`} type="button">
          <FaBuilding /> Informações da Empresa
        </button>
        <button className={styles.tabButton} type="button">
          <FaUserCog /> Usuários e Permissões
        </button>
        <button className={styles.tabButton} type="button">
          <FaPuzzlePiece /> Integrações
        </button>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSaveConfig}>
          <div className={styles.formGroup}>
            <label htmlFor="companyName" className={styles.label}>Nome da Empresa</label>
            <input
              type="text"
              id="companyName"
              className={styles.input}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Minha Empresa de Propostas S.A."
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="companyCnpj" className={styles.label}>CNPJ</label>
            <input
              type="text"
              id="companyCnpj"
              className={styles.input}
              value={companyCnpj}
              onChange={(e) => setCompanyCnpj(e.target.value)}
              placeholder="Ex: 00.000.000/0000-00"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="adminEmail" className={styles.label}>E-mail do Administrador</label>
            <input
              type="email"
              id="adminEmail"
              className={styles.input}
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Ex: contato@empresa.com.br"
            />
          </div>
          <button type="submit" className={styles.saveButton}>Salvar Configurações</button>
        </form>

        <hr className={styles.divider} />

        <div className={styles.resetSection}>
          <h3 className={styles.resetTitle}>Resetar Dados</h3>
          <p className={styles.resetText}>
            Cuidado! Esta ação irá apagar todos os dados de propostas, clientes, usuários e configurações mockados no seu navegador.
          </p>
          <button onClick={handleResetMockData} className={styles.resetButton}>
            <FaRedo /> Resetar Dados Mockados
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;