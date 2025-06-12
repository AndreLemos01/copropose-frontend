import React, { useState, useEffect, useContext, useCallback } from 'react'; // Importado useCallback
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiUsers, FiCheckCircle, FiClock, FiPlusCircle } from 'react-icons/fi';
import styles from './Home.module.css';
import { getPropostas } from '../data/propostasMock';
import { ConfigContext } from '../context/ConfigContext';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const { clientes } = useContext(ConfigContext);
  const [metrics, setMetrics] = useState({
    totalProposals: 0,
    inProgressProposals: 0,
    approvedProposals: 0,
    totalClients: 0,
  });

  // Usando useCallback para memoizar calculateMetrics
  const calculateMetrics = useCallback(() => {
    const allProposals = getPropostas();
    const totalProposals = allProposals.length;

    const approvedProposals = allProposals.filter(p => p.status === 'aprovada').length;
    const inProgressProposals = totalProposals - approvedProposals;

    setMetrics({
      totalProposals,
      inProgressProposals,
      approvedProposals,
      totalClients: clientes.length,
    });
  }, [clientes]); // Depende de 'clientes' do contexto

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]); // Adicionado calculateMetrics como dependência

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'propostas') {
        calculateMetrics();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [calculateMetrics]); // Adicionado calculateMetrics como dependência

  const userName = user?.name || 'Usuário';

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.welcomeTitle}>Bem-vindo de volta, {userName}!</h1>
      <p className={styles.tagline}>Aqui está um resumo do seu Sistema de Gestão de Propostas.</p>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <FiFileText size={36} className={styles.metricIcon} />
          <span className={styles.metricValue}>{metrics.totalProposals}</span>
          <span className={styles.metricLabel}>Total de Propostas</span>
        </div>

        <div className={styles.metricCard}>
          <FiClock size={36} className={styles.metricIcon} />
          <span className={styles.metricValue}>{metrics.inProgressProposals}</span>
          <span className={styles.metricLabel}>Propostas em Andamento</span>
        </div>

        <div className={styles.metricCard}>
          <FiCheckCircle size={36} className={styles.metricIcon} />
          <span className={styles.metricValue}>{metrics.approvedProposals}</span>
          <span className={styles.metricLabel}>Propostas Aprovadas</span>
        </div>

        <div className={styles.metricCard}>
          <FiUsers size={36} className={styles.metricIcon} />
          <span className={styles.metricValue}>{metrics.totalClients}</span>
          <span className={styles.metricLabel}>Clientes Cadastrados</span>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.actionButton} onClick={() => navigate('/adicionar-proposta')}>
          <FiPlusCircle size={20} /> Criar Nova Proposta
        </button>
        <button className={styles.actionButton} onClick={() => navigate('/propostas')}>
          <FiFileText size={20} /> Ver Todas as Propostas
        </button>
        <button className={styles.actionButton} onClick={() => navigate('/clientes')}>
          <FiUsers size={20} /> Gerenciar Clientes
        </button>
      </div>
    </div>
  );
};

export default Home;