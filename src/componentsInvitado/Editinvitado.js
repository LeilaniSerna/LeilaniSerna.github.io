import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Editadmin.css';

const EditPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '',
    imagen: null,
  });

  const [profileImage, setProfileImage] = useState(null); // Estado para la imagen del perfil
  const [message, setMessage] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      // Obtener datos del usuario
      fetch(`http://localhost:5000/api/ObtenerUsuario/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            nombre: data.nombre,
            correo: data.correo,
            telefono: data.telefono,
            contrasena: '',
            imagen: data.imagen,
          });
        })
        .catch((error) => console.error('Error al obtener datos del usuario:', error));

      // Obtener imagen del perfil
      fetch(`http://localhost:5000/api/imagen/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.imagen) {
            setProfileImage(`http://localhost:5000/uploads/${data.imagen}`);
          }
        })
        .catch((error) => console.error('Error al obtener la imagen:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      imagen: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');

    if (!userId) {
      return setMessage('No se pudo encontrar el usuario logueado');
    }

    const formDataToSend = new FormData();
    formDataToSend.append('correo', formData.correo);
    formDataToSend.append('contrasena', formData.contrasena);
    formDataToSend.append('telefono', formData.telefono);
    formDataToSend.append('nombre', formData.nombre);
    if (formData.imagen) {
      formDataToSend.append('imagen', formData.imagen);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/UpdateCuenta/${userId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuario actualizado con éxito');
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 3000);
      } else {
        setMessage(data.error || 'Hubo un error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setMessage('Error al actualizar el usuario. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="edit-container">
      <div className="edit-content">
        {/* Reemplazamos el logo con la imagen del perfil */}
        {profileImage ? (
          <img
            src={profileImage}
            alt="Perfil"
            className="edit-profile-image"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '20px',
            }}
          />
        ) : (
          <p>Cargando imagen...</p>
        )}
        <h2 className="edit-title">Editar Perfil</h2>
        {message && <p className="edit-message">{message}</p>}
        {!isUpdated && (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="edit-input-group">
              <label htmlFor="nombre" className="edit-label">Nombre</label>
              <input
                placeholder="Cambiar nombre"
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="edit-input"
              />
            </div>
            <div className="edit-input-group">
              <label htmlFor="correo" className="edit-label">Correo</label>
              <input
                placeholder="Correo electrónico"
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="edit-input"
              />
            </div>
            <div className="edit-input-group">
              <label htmlFor="telefono" className="edit-label">Teléfono</label>
              <input
                placeholder="Número de teléfono"
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="edit-input"
              />
            </div>
            <div className="edit-input-group">
              <label htmlFor="contrasena" className="edit-label">Contraseña</label>
              <input
                placeholder="Nueva contraseña"
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="edit-input"
              />
            </div>
            <div className="edit-input-group">
              <label htmlFor="imagen" className="edit-label">Imagen</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                onChange={handleImageChange}
                className="edit-input"
              />
            </div>
            <button type="submit" className="edit-button">Actualizar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPage;
