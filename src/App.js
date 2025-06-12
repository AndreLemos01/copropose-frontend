import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ConfigProvider } from './context/ConfigContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Propostas from './pages/Propostas';
import Clientes from './pages/Clientes';
import AdicionarProposta from './pages/AdicionarProposta';
import ConfiguracoesProposta from './pages/ConfiguracoesProposta';
import SystemConfig from './pages/SystemConfig';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './routes/PrivateRoute';

import styles from './App.module.css';

import 'bootstrap/dist/css/bootstrap.min.css';

function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [loggedInUser, setLoggedInUser] = useState(null); // Estado para o usuário logado

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Efeito para carregar o usuário logado do localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      setLoggedInUser(JSON.parse(authData));
    } else {
      setLoggedInUser(null);
    }
  }, [location.pathname]); // Recarrega quando a rota muda, útil para login/logout

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const isAuth = localStorage.getItem('auth');
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';

  const layoutClass = sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed;

  return (
    <>
      {isAuth && !hideSidebar ? (
        <div className={layoutClass}>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={styles.navbarContainer}>
            <Navbar toggleSidebar={toggleSidebar} user={loggedInUser} />
          </div>
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/" element={<Home user={loggedInUser} />} /> {/* Passa o usuário para Home */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/propostas" element={<Propostas />} />
              <Route path="/clientes/*" element={<Clientes />} />
              <Route path="/adicionar-proposta" element={<AdicionarProposta />} />
              <Route path="/configuracoes" element={<ConfiguracoesProposta />} />
              <Route path="/configuracoes-sistema" element={<SystemConfig />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ConfigProvider>
            <Layout />
      </ConfigProvider>
    </Router>
  );
}