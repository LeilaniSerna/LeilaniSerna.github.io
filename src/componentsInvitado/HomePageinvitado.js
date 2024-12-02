import React, { useEffect, useState } from 'react';
import './HomePageinvitado.css'; // Actualiza el nombre del archivo CSS si es necesario
import logo from '../img/logo.png';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '300px' };
const center = { lat: 19.432608, lng: -99.133209 };

function HomePageinvitado() {
  const [animales, setAnimales] = useState([]);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/animales');
        const data = await response.json();
        setAnimales(data);
      } catch (error) {
        console.error('Error al cargar animales:', error);
      }
    };
    fetchAnimales();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Global Position Farm</h1>
      </header>

      <div className="mapcontainer">
        <LoadScript googleMapsApiKey="AIzaSyAun-2qBzNpZRBS_6nS3Ef6X-jBl3qrLwE">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
            {animales.map((animal) => (
              <Marker key={animal.id_animal} position={{ lat: center.lat, lng: center.lng }} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Si no hay animales, muestra la tabla, de lo contrario muestra el mensaje */}
      {animales.length === 0 ? (
        <p>(Todavía no hay ganado registrado)</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tipo de Animal</th>
              <th>Raza</th>
              <th>Fecha de Nacimiento</th>
              <th>Peso</th>
              <th>Estado de Salud</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {animales.map((animal) => (
              <tr key={animal.id_animal}>
                <td>{animal.tipo_de_animal}</td>
                <td>{animal.raza}</td>
                <td>{animal.fecha_nacimiento}</td>
                <td>{animal.peso}</td>
                <td>{animal.estado_salud}</td>
                <td>{animal.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HomePageinvitado;
