const express = require('express'); // Importa el framework Express
const router = express.Router(); // Crea un nuevo router para manejar las rutas
const db = require('../config/db'); // Importa la configuración de la base de datos

// Ruta para obtener los datos de lecturas históricas de la frecuencia cardiaca
router.get('/frecuencia', (req, res) => {
  const query = 'SELECT id_dispositivo, frecuencia_cardiaca FROM lecturas_historicas'; // Consulta SQL para obtener datos
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error); // Imprime el error en la consola si falla
      return res.status(500).json({ error: 'Error al obtener los datos' }); // Responde con un error al cliente
    }
    res.json(results); // Envía los resultados de la consulta en formato JSON
  });
});

// Ruta para obtener los datos de los dispositivos
router.get('/dispositivos', (req, res) => {
  const query = 'SELECT id_dispositivo, id_animal, ubicacion_actual, frecuencia_cardiaca, saturacion_oxigeno, temperatura, timestamp FROM dispositivos'; // Consulta SQL para obtener datos
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error); // Imprime el error en la consola si falla
      return res.status(500).json({ error: 'Error al obtener los datos' }); // Responde con un error al cliente
    }
    res.json(results); // Envía los resultados de la consulta en formato JSON
  });
});

// Ruta para obtener todos los IDs de los animales
router.get('/animales', (req, res) => {
  const getAnimalIdsQuery = 'SELECT id_animal FROM animales'; // Consulta SQL para obtener IDs de animales
  db.query(getAnimalIdsQuery, (err, results) => {
    if (err) {
      console.error('Error al obtener los IDs de animales:', err); // Imprime el error en la consola si falla
      res.status(500).json({ error: 'Error al obtener los IDs de animales' }); // Responde con un error al cliente
      return;
    }
    res.json(results); // Envía los resultados de la consulta en formato JSON
  });
});

// Ruta para insertar un nuevo dispositivo en la base de datos
router.post('/dispositivos', (req, res) => {
  const { id_dispositivo, id_animal, ubicacion_actual, frecuencia_cardiaca, saturacion_oxigeno, temperatura, timestamp } = req.body; // Obtiene los datos del cuerpo de la solicitud

  const insertDispositivoQuery = 'INSERT INTO dispositivos (id_dispositivo, id_animal, ubicacion_actual, frecuencia_cardiaca, saturacion_oxigeno, temperatura, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)'; // Consulta SQL para insertar datos

  db.query(insertDispositivoQuery, [id_dispositivo, id_animal, ubicacion_actual, frecuencia_cardiaca, saturacion_oxigeno, temperatura, timestamp], (err, result) => {
    if (err) {
      console.error('Error al insertar el dispositivo:', err); // Imprime el error en la consola si falla
      res.status(500).json({ error: 'Error al insertar el dispositivo' }); // Responde con un error al cliente
      return;
    }
    res.status(201).json({ message: 'Datos insertados correctamente' }); // Responde con un mensaje de éxito
  });
});

module.exports = router; // Exporta el router para usarlo en otras partes de la aplicación
