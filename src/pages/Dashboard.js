// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import styles from './Dashboard.module.css';
import CRM from '../components/dashboard/CRM';
import { getPropostas } from '../data/propostasMock';

function CardMenu({ options }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.cardMenu}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={styles.menuButton}
        aria-label="Abrir menu de opções"
      >
        &#x22EE;
      </button>
      {open && (
        <ul className={styles.menuList} role="menu">
          {options.map((opt, i) => (
            <li key={i} role="menuitem">
              <button onClick={() => { opt.action(); setOpen(false); }}>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBarChartCard({ title, data }) {
  const options = [
    { label: 'Atualizar', action: () => alert('Atualizar clicked') },
    { label: 'Configurações', action: () => alert('Configurações clicked') },
    { label: 'Fechar', action: () => alert('Fechar clicked') },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        <CardMenu options={options} />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        {data.length > 0 && data.some(d => d.value > 0) ? (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} /> {/* Garante que o eixo Y não tenha números quebrados */}
            <Tooltip />
            <Bar dataKey="value" fill="#4caf50" />
          </BarChart>
        ) : (
          <div className={styles.noDataMessage}>Nenhum dado de status disponível.</div>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function ValoresListCard({ title, items }) {
  const options = [
    { label: 'Atualizar', action: () => alert('Atualizar clicked') },
    { label: 'Configurações', action: () => alert('Configurações clicked') },
    { label: 'Fechar', action: () => alert('Fechar clicked') },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        <CardMenu options={options} />
      </div>
      {items.length > 0 && items.some(item => item.value > 0) ? (
        <ul className={styles.valoresList}>
          {items.map(({ label, value }, i) => (
            <li key={i} className={styles.valorItem}>
              <span className={styles.valorLabel}>{label}</span>
              <span className={styles.valorNumber}>R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.noDataMessage}>Nenhum valor disponível.</div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [dataStatus, setDataStatus] = useState([]);
  const [valoresLista, setValoresLista] = useState([]);
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  const processProposalsData = () => {
    const allProposals = getPropostas();

    // Contagem de status para o gráfico
    let approvedCount = 0;
    let rejectedCount = 0;
    let inProgressCount = 0; // Incluirá enviadas, negociacao, fechamento

    // Soma de valores para a lista
    let totalApprovedValue = 0;
    let totalRejectedValue = 0;
    let totalInProgressValue = 0;

    allProposals.forEach(p => {
      const proposalValue = p.itensSelecionados.reduce((itemSum, item) => itemSum + (item.quantidade * item.valor), 0);

      switch (p.status) {
        case 'aprovada':
          approvedCount++;
          totalApprovedValue += proposalValue;
          break;
        case 'reprovada':
          rejectedCount++;
          totalRejectedValue += proposalValue;
          break;
        case 'enviadas':
        case 'negociacao':
        case 'fechamento': // Incluir 'fechamento' em 'Em Andamento'
          inProgressCount++;
          totalInProgressValue += proposalValue;
          break;
        default: // Caso status não esteja definido ou seja inesperado, tratar como 'enviadas'/'Em Andamento'
          inProgressCount++;
          totalInProgressValue += proposalValue;
          break;
      }
    });

    setDataStatus([
      { name: 'Aprovadas', value: approvedCount },
      { name: 'Reprovadas', value: rejectedCount },
      { name: 'Em Andamento', value: inProgressCount },
    ]);

    setValoresLista([
      { label: 'Em Andamento', value: totalInProgressValue },
      { label: 'Reprovadas', value: totalRejectedValue },
      { label: 'Aprovadas', value: totalApprovedValue },
    ]);
  };

  useEffect(() => {
    processProposalsData();
  }, [refreshDashboard]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'propostas') {
        setRefreshDashboard(prev => prev + 1);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <section className={styles.dashboardContainer}>
      <div className={styles.cardsRow}>
        <StatusBarChartCard title="Status das Propostas" data={dataStatus} />
        <ValoresListCard title="Valores e Baixas" items={valoresLista} />
      </div>

      <CRM />
    </section>
  );
}