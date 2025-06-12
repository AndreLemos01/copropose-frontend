// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import styles from './Register.module.css';
import logo from '../assets/copropose_logo.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => { // Adicionado 'async'
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    try {
      // Requisição HTTP para o backend
      const response = await fetch('http://localhost:5000/api/auth/register', { // Supondo que seu backend esteja em http://localhost:5000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        navigate('/login'); // Redireciona para a página de login
      } else {
        toast.error(data.message || 'Erro no registro.'); // Exibe a mensagem de erro do backend
      }
    } catch (error) {
      console.error('Erro na requisição de registro:', error);
      toast.error('Erro de conexão ou servidor.');
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <img src={logo} alt="CoproProse Logo" className={styles.logo} />
          <h2 className={styles.title}>Criar sua Conta</h2>
          <p className={styles.subtitle}>Junte-se ao Sistema de Gestão de Propostas.</p>
        </div>

        <form className={styles.registerForm} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <FiUser className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Seu Nome Completo"
              className={styles.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Nome Completo"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <FiMail className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Seu E-mail"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="E-mail"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <FiLock className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Crie uma Senha"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Senha"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <FiLock className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Confirme sua Senha"
              className={styles.inputField}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirme a Senha"
              required
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            Registrar
          </button>
        </form>

        <div className={styles.registerFooter}>
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className={styles.loginLink}>
              Faça Login!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;