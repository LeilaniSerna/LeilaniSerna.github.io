import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

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
      {/* Título cambiado a 'Administrador' */}
      <h1 className="navbar-logo">Administrador</h1>

      <ul className="navbar-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/Statistics">Estadísticas</Link>
        </li>
        <li>
          <Link to="/Post"></Link>
        </li>
        <li>
          <Link to="/Edit">Editar Perfil</Link>
        </li>
        {/* Mostrar la imagen si existe */}
        {imagen && (
          <li>
            <img
              src={imagen}
              alt="Perfil"
              className="navbar-profile-image"
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
          </li>
        )}
        {/* Botón de Logout */}
        <li>
          <button
            className="navbar-logout-button"
            onClick={handleLogout}
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
