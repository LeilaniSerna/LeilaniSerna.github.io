import React, { useEffect, useState } from 'react';
import './HomePage.css';
import logo from '../img/logo.png';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'; // Usamos MarkerF
import axios from 'axios'; // Importa Axios para hacer las peticiones HTTP

const mapContainerStyle = { width: '100%', height: '300px' };
const center = { lat: 19.432608, lng: -99.133209 }; // Coordenadas predeterminadas
const weatherApiKey = 'YOUR_GOOGLE_WEATHER_API_KEY'; // Sustituye por tu clave API

function HomePage() {
  const [animales, setAnimales] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoAnimal, setNuevoAnimal] = useState({
    tipo_de_animal: '',
    raza: '',
    fecha_nacimiento: '',
    peso: '',
    estado_salud: '',
    observaciones: '',
  });

  const [clima, setClima] = useState(null); // Estado para almacenar los datos del clima

  // Función para obtener los datos del clima
  useEffect(() => {
    const fetchClima = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${center.lat}&lon=${center.lng}&appid=${weatherApiKey}&units=metric`
        );
        setClima(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del clima:', error);
      }
    };
    fetchClima();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoAnimal({ ...nuevoAnimal, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/animales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoAnimal),
      });

      if (response.ok) {
        const nuevo = await response.json();
        setAnimales([...animales, nuevo]);
        setMostrarFormulario(false);
        setNuevoAnimal({
          tipo_de_animal: '',
          raza: '',
          fecha_nacimiento: '',
          peso: '',
          estado_salud: '',
          observaciones: '',
        });
      } else {
        console.error('Error al agregar animal');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Global Position Farm</h1>
      </header>

      {/* Mostrar el clima si está disponible */}
      {clima ? (
        <div className="clima">
          <h2>Clima Actual</h2>
          <p>{clima.weather[0].description}</p>
          <p>Temperatura: {clima.main.temp}°C</p>
          <p>Humedad: {clima.main.humidity}%</p>
        </div>
      ) : (
        <p>Cargando clima...</p>
      )}

      <div className="mapcontainer">
        <LoadScript googleMapsApiKey="AIzaSyAhcZF6Gog2rtjF0SKYh_6e8mG7mfrVq-o">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
            {animales.map((animal) => (
              <MarkerF
                key={animal.id_animal}
                position={{
                  lat: animal.lat || center.lat,
                  lng: animal.lng || center.lng,
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

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

      {mostrarFormulario ? (
        <form onSubmit={handleSubmit} className="formulario-ganado">
          <input
            type="text"
            name="tipo_de_animal"
            value={nuevoAnimal.tipo_de_animal}
            onChange={handleChange}
            placeholder="Tipo de Animal"
            required
          />
          <input
            type="text"
            name="raza"
            value={nuevoAnimal.raza}
            onChange={handleChange}
            placeholder="Raza"
            required
          />
          <input
            type="date"
            name="fecha_nacimiento"
            value={nuevoAnimal.fecha_nacimiento}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="peso"
            value={nuevoAnimal.peso}
            onChange={handleChange}
            placeholder="Peso"
            required
          />
          <input
            type="text"
            name="estado_salud"
            value={nuevoAnimal.estado_salud}
            onChange={handleChange}
            placeholder="Estado de Salud"
          />
          <textarea
            name="observaciones"
            value={nuevoAnimal.observaciones}
            onChange={handleChange}
            placeholder="Observaciones"
          />
          <button type="submit" className="addbutton">
            Guardar
          </button>
        </form>
      ) : (
        <button onClick={() => setMostrarFormulario(true)} className="addbutton">
          Agregar Ganado
        </button>
      )}
    </div>
  );
}

export default HomePage;
