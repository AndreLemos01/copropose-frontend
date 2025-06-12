import React, { useState, useRef, useEffect } from 'react';
import styles from './Sidebar.module.css';
import {
  FiUsers,
  FiFileText,
  FiPlusCircle,
  FiMenu,
  FiGrid,
  FiSettings, // Adicionado para Configurações do Sistema
} from 'react-icons/fi';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import sidebarLogo from '../assets/copropose_logotipo.png';

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <header className={styles.sidebarHeader}>
        {isOpen && (
          <Link to="/dashboard" className={styles.sidebarLogoLink}>
            <div className={styles.sidebarLogoContainer}>
              <img src={sidebarLogo} alt="CoproProse Logotipo" className={styles.sidebarLogo} />
            </div>
          </Link>
        )}
        <button
          className={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <FiMenu size={24} />
        </button>
      </header>

      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            data-tooltip="Dashboard" // Adicionado para o tooltip
          >
            <FiGrid size={22} />
            {isOpen && <span className={styles.linkText}>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            data-tooltip="Clientes" // Adicionado para o tooltip
          >
            <FiUsers size={22} />
            {isOpen && <span className={styles.linkText}>Clientes</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/propostas"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            data-tooltip="Propostas" // Adicionado para o tooltip
          >
            <FiFileText size={22} />
            {isOpen && <span className={styles.linkText}>Propostas</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/adicionar-proposta"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            data-tooltip="Nova Proposta" // Adicionado para o tooltip
          >
            <FiPlusCircle size={22} />
            {isOpen && <span className={styles.linkText}>Nova Proposta</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/configuracoes-sistema" // Nova rota para configurações do sistema
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
            data-tooltip="Configurações do Sistema" // Adicionado para o tooltip
          >
            <FiSettings size={22} />
            {isOpen && <span className={styles.linkText}>Configurações do Sistema</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;