// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import styles from './Navbar.module.css';
import logo from '../assets/copropose_logo.png';

// Recebe a prop 'user'
function Navbar({ toggleSidebar, user }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Remove os dados fictícios de usuário, agora eles vêm das props
  // const user = {
  //   name: 'João Silva',
  //   email: 'joao.silva@email.com',
  //   photoURL: '/default-user.png',
  // };

  // Usa um avatar padrão se user.photoURL não estiver disponível, ou o usuário não está logado
  const userAvatar = user?.photoURL || '/default-user.png';
  const userName = user?.name || 'Visitante'; // Usa o nome do usuário logado ou "Visitante"

  // Fecha o menu de usuário ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSystemConfigClick = () => {
    setUserMenuOpen(false);
    navigate('/configuracoes-sistema');
  };

  const handleLogoutClick = () => {
    setUserMenuOpen(false);
    localStorage.removeItem('auth'); // Remove o dado de autenticação
    navigate('/login'); // Redireciona para o login
    window.location.reload(); // Recarrega a página para resetar o estado da aplicação
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link to="/dashboard" className={styles.logoLink}>
          <div className={styles.systemLogoPlaceholder}>
            <img src={logo} alt="CoproProse Logo" className={styles.systemLogo} />
          </div>
        </Link>
      </div>

      <div className={styles.rightSection} ref={userMenuRef}>
        <div className={styles.userInfo} onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <img src={userAvatar} alt="User Avatar" className={styles.userAvatar} /> {/* Usa userAvatar */}
          <span className={styles.userName}>{userName}</span> {/* Usa userName */}
          <FiChevronDown size={16} className={`${styles.dropdownIcon} ${userMenuOpen ? styles.rotate : ''}`} />
        </div>

        {userMenuOpen && (
          <ul className={styles.userDropdownMenu}>
            <li onClick={handleSystemConfigClick}>
              <FiSettings size={18} /> Configurações do Sistema
            </li>
            <li onClick={handleLogoutClick}>
              <FiLogOut size={18} /> Sair
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;