import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect
import './StatisticsPage.css'; // Importa los estilos CSS

// Componente para mostrar un gráfico de datos de frecuencia cardíaca
function DataChart() {
  const [data, setData] = useState([]); // Estado para almacenar los datos del gráfico

  // Hook para obtener los datos de frecuencia cardíaca del servidor cuando el componente se monta
  useEffect(() => {
    fetch('http://localhost:5000/api/frecuencia') // Realiza una petición GET a la API
      .then(response => response.json()) // Convierte la respuesta a JSON
      .then(data => {
        const formattedData = data.map(item => ({
          label: item.id_dispositivo,
          value: item.frecuencia_cardiaca
        })); // Formatea los datos para el gráfico
        setData(formattedData); // Actualiza el estado con los datos formateados
      })
      .catch(error => console.error('Error fetching chart data:', error)); // Maneja errores en la petición
  }, []); // El array vacío como segundo argumento indica que este efecto solo se ejecuta una vez, al montar el componente

  return (
    <div className="chart-container">
      <h2>Gráfico de Frecuencia Cardíaca</h2>
      <svg width="500" height="400" viewBox="0 0 500 400" className="chart">
        {/* Dibuja el eje Y */}
        <line x1="50" y1="20" x2="50" y2="350" stroke="black" strokeWidth="2" />
        {/* Dibuja el eje X */}
        <line x1="50" y1="350" x2="450" y2="350" stroke="black" strokeWidth="2" />

        {/* Marca los valores en el eje Y */}
        {[20, 40, 60, 80, 100].map((value, index) => (
          <g key={index}>
            <line x1="45" y1={350 - value * 3} x2="50" y2={350 - value * 3} stroke="black" />
            <text x="40" y={350 - value * 3} textAnchor="end" fontSize="10">
              {value}
            </text>
          </g>
        ))}

        {/* Etiqueta del eje Y */}
        <text x="-200" y="15" transform="rotate(-90)" textAnchor="middle" fontSize="12">
          Frecuencia Cardíaca (en lpm)
        </text>

        {/* Dibuja las barras del gráfico */}
        {data.map((item, index) => (
          <rect
            key={index}
            x={index * 70 + 60}
            y={350 - item.value * 3}
            width="30"
            height={item.value * 3}
            fill="#4caf50"
            className="bar"
          />
        ))}

        {/* Etiquetas en el eje X */}
        {data.map((item, index) => (
          <text key={index} x={index * 70 + 75} y="365" textAnchor="middle" fontSize="10">
            {item.label}
          </text>
        ))}

        {/* Etiqueta del eje X */}
        <text x="250" y="390" textAnchor="middle" fontSize="12">
          ID Dispositivo
        </text>
      </svg>
    </div>
  );
}

// Componente para mostrar una tabla de dispositivos y un formulario para agregar nuevos dispositivos
function DataTable() {
  const [tableData, setTableData] = useState([]); // Estado para almacenar los datos de la tabla
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario
  const [formData, setFormData] = useState({
    id_dispositivo: '',
    id_animal: '',
    ubicacion_actual: '',
    frecuencia_cardiaca: '',
    saturacion_oxigeno: '',
    temperatura: '',
    timestamp: ''
  }); // Estado para almacenar los datos del formulario
  const [animalIds, setAnimalIds] = useState([]); // Estado para almacenar los IDs de los animales

  // Hook para obtener los datos de los dispositivos del servidor cuando el componente se monta
  useEffect(() => {
    fetch('http://localhost:5000/api/dispositivos') // Realiza una petición GET a la API
      .then(response => response.json()) // Convierte la respuesta a JSON
      .then(data => setTableData(data)) // Actualiza el estado con los datos recibidos
      .catch(error => console.error('Error fetching table data:', error)); // Maneja errores en la petición
  }, []); // El array vacío como segundo argumento indica que este efecto solo se ejecuta una vez, al montar el componente

  // Hook para obtener los IDs de los animales del servidor cuando el componente se monta
  useEffect(() => {
    fetch('http://localhost:5000/api/animales') // Realiza una petición GET a la API
      .then(response => response.json()) // Convierte la respuesta a JSON
      .then(data => {
        setAnimalIds(data.map(animal => animal.id_animal)); // Extrae y almacena los IDs de los animales
      })
      .catch(error => console.error('Error fetching animal ids:', error)); // Maneja errores en la petición
  }, []); // El array vacío como segundo argumento indica que este efecto solo se ejecuta una vez, al montar el componente

  // Maneja el cambio de los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Obtiene el nombre y valor del input
    setFormData({
      ...formData,
      [name]: value // Actualiza el estado del formulario con el nuevo valor
    });
  };

  // Muestra el formulario cuando se hace clic en "Agregar Datos"
  const handleAddClick = () => {
    setShowForm(true);
  };

  // Oculta el formulario cuando se hace clic en el botón de cerrar
  const handleCloseClick = () => {
    setShowForm(false);
  };

  // Guarda los datos del formulario cuando se hace clic en "Guardar"
  const handleSaveClick = () => {
    // Verifica que todos los campos estén completos
    if (formData.id_dispositivo && formData.id_animal && formData.ubicacion_actual && formData.frecuencia_cardiaca && formData.saturacion_oxigeno && formData.temperatura && formData.timestamp) {
      // Envía los datos del formulario al servidor
      fetch('http://localhost:5000/api/dispositivos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convierte los datos del formulario a JSON
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor'); // Lanza un error si la respuesta no es OK
        }
        return response.json();
      })
      .then(newData => {
        setTableData([...tableData, newData]); // Añade los nuevos datos a la tabla
        setShowForm(false); // Oculta el formulario
        setFormData({
          id_dispositivo: '',
          id_animal: '',
          ubicacion_actual: '',
          frecuencia_cardiaca: '',
          saturacion_oxigeno: '',
          temperatura: '',
          timestamp: ''
        }); // Resetea los campos del formulario
      })
      .catch(error => console.error('Error actualizando los datos de la tabla:', error)); // Maneja errores en la petición
    } else {
      alert('Por favor, completa todos los campos.'); // Alerta al usuario si hay campos incompletos
    }
  };

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <h2>Tabla de Dispositivos</h2>
        <table>
          <thead>
            <tr>
              <th>ID Dispositivo</th>
              <th>ID Animal</th>
              <th>Ubicación actual</th>
              <th>Frecuencia cardíaca</th>
              <th>Saturación de oxígeno</th>
              <th>Temperatura</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.id_dispositivo}</td>
                <td>{row.id_animal}</td>
                <td>{row.ubicacion_actual}</td>
                <td>{row.frecuencia_cardiaca}</td>
                <td>{row.saturacion_oxigeno}</td>
                <td>{row.temperatura}</td>
                <td>{new Date(row.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          </table>
        <button className="add-button" onClick={handleAddClick}>Agregar Datos</button>
      </div>
      {showForm && (
        <div className="popup-form">
          <div className="form-container">
            <span className="close" onClick={handleCloseClick}>&times;</span> {/* Botón para cerrar el formulario */}
            <input name="id_dispositivo" placeholder="ID Dispositivo" value={formData.id_dispositivo} onChange={handleInputChange} />
            <select name="id_animal" value={formData.id_animal} onChange={handleInputChange}>
              <option value="">Selecciona un ID de Animal</option>
              {animalIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <input name="ubicacion_actual" placeholder="Ubicación actual" value={formData.ubicacion_actual} onChange={handleInputChange} />
            <input name="frecuencia_cardiaca" placeholder="Frecuencia cardíaca" value={formData.frecuencia_cardiaca} onChange={handleInputChange} />
            <input name="saturacion_oxigeno" placeholder="Saturación de oxígeno" value={formData.saturacion_oxigeno} onChange={handleInputChange} />
            <input name="temperatura" placeholder="Temperatura" value={formData.temperatura} onChange={handleInputChange} />
            <input name="timestamp" placeholder="Fecha y Hora" value={formData.timestamp} onChange={handleInputChange} />
            <button className="save-button" onClick={handleSaveClick}>Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar videos de YouTube
function YouTubeVideos() {
  return (
    <div className="videos-container">
      <h2>Videos de YouTube</h2>
      <div className="video-item">
        <iframe width="100%" height="150" src="https://www.youtube.com/embed/5VlIfIjxDwI" title="Así es la ENGORDA de GANADO en Sonora 🐂 | Dietas, Alimentos y Control" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
      <div className="video-item">
        <iframe width="100%" height="150" src="https://www.youtube.com/embed/mlrfjzABdmY" title="Las 14 mejores razas de ganado vacuno para la producción de carne a nivel mundial" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
      <div className="video-item">
        <iframe width="100%" height="150" src="https://www.youtube.com/embed/0VvcAsk1AUM" title="Cuidados de los ovinos Dorper- TvAgro por Juan Gonzalo Angel Restrepo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
      <div className="video-item">
        <iframe width="100%" height="150" src="https://www.youtube.com/embed/y7dRzuA_3Kk" title="10 mejores razas ovinas para carne del mundo." frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
    </div>
  );
}

// Componente para mostrar el clima utilizando la API de OpenWeatherMap
function Weather() {
  const [weatherData, setWeatherData] = useState(null); // Estado para almacenar los datos del clima
  const apiKey = 'abda8bfc519f0984774ff6522f160497'; // Reemplaza con tu clave de API de OpenWeatherMap
  const city = 'Aguascalientes';

  // Hook para obtener los datos del clima del servidor cuando el componente se monta
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json()) // Convierte la respuesta a JSON
      .then(data => setWeatherData(data)) // Actualiza el estado con los datos recibidos
      .catch(error => console.error('Error fetching the weather data:', error)); // Maneja errores en la petición
  }, []); // El array vacío como segundo argumento indica que este efecto solo se ejecuta una vez, al montar el componente

  // Si los datos del clima aún no se han cargado, muestra un mensaje de carga
  if (!weatherData) {
    return <p>Cargando datos del clima...</p>;
  }

  const temperature = Math.round(weatherData.main.temp).toString().padStart(2, '0'); // Redondea y formatea la temperatura

  return (
    <div className="weather-container">
      <h2>Clima</h2>
      <p className="city">Clima en {weatherData.name}</p>
      <p className="temperature">{temperature}°C</p>
      <p className="humidity">Humedad: {weatherData.main.humidity}%</p>
      <p className="conditions">Condiciones: {weatherData.weather[0].description}</p>
    </div>
  );
}

// Componente principal para la página de estadísticas
function StatisticsPage() {
  return (
    <div>
      <div className="statistics-container">
        <div className="statistics-item">
          <DataChart /> {/* Componente del gráfico */}
        </div>
        <div className="statistics-item">
          <DataTable /> {/* Componente de la tabla */}
        </div>
        <div className="statistics-item">
          <YouTubeVideos /> {/* Componente de videos */}
        </div>
        <div className="statistics-item">
          <Weather /> {/* Componente del clima */}
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage; // Exporta el componente principal
