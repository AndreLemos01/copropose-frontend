// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import styles from './Login.module.css';
import logo from '../assets/copropose_logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); // Mantido 'senha' para consistência do state
  const navigate = useNavigate();

  const handleLogin = async (e) => { // Adicionado 'async'
    e.preventDefault();

    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Requisição HTTP para o backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: senha }), // Envia a senha como 'password'
      });

      const data = await response.json();

      if (response.ok) {
        // Armazenar o token JWT e informações básicas do usuário no localStorage
        // O token será usado para autenticar requisições futuras ao backend
        localStorage.setItem('auth', JSON.stringify({ email: data.user.email, name: data.user.name, token: data.token }));
        toast.success(`Login realizado com sucesso! Bem-vindo(a), ${data.user.name}!`);
        navigate('/'); // Redireciona para a página Home (rota '/')
        window.location.reload(); // Recarrega a página para resetar o estado da aplicação e reavaliar PrivateRoute
      } else {
        toast.error(data.message || 'E-mail ou senha inválidos. Por favor, verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      toast.error('Erro de conexão ou servidor.');
    }
  };

  const handleSocialLogin = (platform) => {
    toast.info(`Login com ${platform} (funcionalidade não implementada)`);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <img src={logo} alt="CoproProse Logo" className={styles.logo} />
          <p className={styles.subtitle}>Gerencie suas propostas de forma inteligente.</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <FiMail className={styles.inputIcon} />
            <input
              type="email"
              placeholder="E-mail"
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
              placeholder="Senha"
              className={styles.inputField}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              aria-label="Senha"
              required
            />
          </div>

          <div className={styles.formActions}>
            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
              Esqueceu a senha?
            </Link>
          </div>

          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>

        <div className={styles.divider}>Ou entre com</div>

        <div className={styles.socialLoginButtons}>
          <button className={`${styles.socialButton} ${styles.google}`} onClick={() => handleSocialLogin('Google')}>
            <FcGoogle className={styles.socialIcon} /> Google
          </button>
          <button className={`${styles.socialButton} ${styles.facebook}`} onClick={() => handleSocialLogin('Facebook')}>
            <FaFacebook className={styles.socialIcon} /> Facebook
          </button>
          <button className={`${styles.socialButton} ${styles.outlook}`} onClick={() => handleSocialLogin('Outlook')}>
            <FiMail className={styles.socialIcon} /> Outlook
          </button>
        </div>

        <div className={styles.loginFooter}>
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className={styles.registerLink}>
              Crie uma agora!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;