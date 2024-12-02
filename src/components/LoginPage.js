import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Archivo CSS
import logo from '../img/logo.png'; // Logo del proyecto
import fondo from '../img/fondo.webp'; // Imagen de fondo

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Almacena el userId y isAdmin en localStorage
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAdmin', data.isAdmin);
        setMessage('Inicio de sesión exitoso');
        
        // Redirige según el rol
        if (data.isAdmin === 1) {
          navigate('/home');  // Redirige a home si es administrador
        } else {
          navigate('/homeinvitado');  // Redirige a homeinvitado si es invitado
        }
      } else {
        setMessage(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setMessage('Error en el servidor. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">Accede a tu cuenta</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              className="input-field"
              placeholder="Introduce tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="error-message">{message}</p>}
          <div className="form-action">
            <button type="submit" className="btn-login">Entrar</button>
          </div>
        </form>
        <div className="login-footer">
          <p>
            <Link to="/RegPage">¿No tienes una cuenta? Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
