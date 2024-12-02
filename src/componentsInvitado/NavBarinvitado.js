import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBarinvitado.css";

function NavBar() {
  const [imagen, setImagen] = useState(null); // Estado para almacenar la imagen
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    // Obtener el userId del localStorage
    const userId = localStorage.getItem("userId");

    if (userId) {
      // Realizar la solicitud para obtener la imagen
      fetch(`http://localhost:5000/api/imagen/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.imagen) {
            // Establecer la URL completa de la imagen
            setImagen(`http://localhost:5000/uploads/${data.imagen}`);
          }
        })
        .catch((error) => console.error("Error al obtener la imagen:", error));
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "¿Estás seguro de que quieres cerrar sesión?"
    );
    if (confirmLogout) {
      localStorage.clear(); // Limpiar datos de sesión
      navigate("/"); // Redirigir al login
    }
  };

  return (
    <nav className="navbar">
      {/* Título 'Invitado' a la izquierda */}
      <div className="navbar-title">
        <h1>Invitado</h1>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/homeinvitado">Home</Link>
        </li>
        <li>
          <Link to="/Statisticsinvitado">Estadísticas</Link>
        </li>
        

        {/* Mostrar la imagen si existe*/}
        {imagen && (
          <li>
            <img
              src={imagen}
              alt="Perfil"
              className="navbar-profile-image"
            />
          </li>
        )}

        {/* Botón de Logout */}
        <li>
          <button
            className="navbar-logout-button"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
