import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegPage.css';
import fondo from '../img/fondo.webp'; // Imagen de fondo
import logo from '../img/logo.png'; // Logo del proyecto

const RegPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '',
    imagen: null, // Añadimos el estado para la imagen
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Maneja el cambio del input de imagen
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      imagen: e.target.files[0], // Guardamos el archivo de la imagen
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificación básica de los campos
    if (!formData.nombre || !formData.correo || !formData.telefono || !formData.contrasena) {
      setMessage('Por favor, complete todos los campos.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('correo', formData.correo);
    formDataToSend.append('contrasena', formData.contrasena);
    formDataToSend.append('telefono', formData.telefono);
    formDataToSend.append('nombre', formData.nombre);
    if (formData.imagen) {
      formDataToSend.append('imagen', formData.imagen); // Añadimos la imagen al FormData
    }

    try {
      const response = await fetch('http://localhost:5000/api/CrearCuenta', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuario registrado con éxito');
        setFormData({ nombre: '', correo: '', telefono: '', contrasena: '', imagen: null });
        setTimeout(() => {
          navigate('/'); // Redirigir a la página de login después de 2 segundos
        }, 2000);
      } else {
        setMessage(data.error || 'Hubo un error en el registro');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setMessage('Error al registrar el usuario. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="reg-container">
      <img src={logo} alt="Logo" className="login-logo" />
      <h2 className="reg-title">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="reg-form">
        <div className="reg-input-group">
          <label htmlFor="nombre" className="reg-label">Nombre</label>
          <input
            placeholder="Nombre o alias"
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="reg-input"
          />
        </div>
        <div className="reg-input-group">
          <label htmlFor="correo" className="reg-label">Correo</label>
          <input
            placeholder="Correo Electrónico"
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            className="reg-input"
          />
        </div>
        <div className="reg-input-group">
          <label htmlFor="telefono" className="reg-label">Teléfono</label>
          <input
            placeholder="Número de teléfono"
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="reg-input"
          />
        </div>
        <div className="reg-input-group">
          <label htmlFor="contrasena" className="reg-label">Contraseña</label>
          <input
            placeholder="Nueva Contraseña"
            type="password"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
            className="reg-input"
          />
        </div>

        <div className="reg-input-group">
          <label htmlFor="imagen" className="reg-label">Imagen</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            onChange={handleImageChange}
            className="reg-input"
          />
        </div>

        {message && <p className="reg-message">{message}</p>}
        <button type="submit" className="reg-button">Registrar</button>
      </form>
    </div>
  );
};

export default RegPage;
