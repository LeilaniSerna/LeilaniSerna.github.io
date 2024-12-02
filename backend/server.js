const express = require('express');
const path = require('path'); // IMPORTANTE: Asegúrate de importar 'path'
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/postRoutes');
const logRoutes = require('./routes/logRoutes');
const ganadoroutes = require('./routes/ganadoroutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

// Middleware para parsear JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar las rutas de posts
app.use('/api', postRoutes);

// Usar las rutas de Log
app.use('/api', logRoutes);

// Usar las rutas de Ganado
app.use('/api', ganadoroutes);

// Usar la nueva ruta de datos 
app.use('/api', statisticsRoutes);

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('Welcome to Moofind Backend!');
});

// Escuchar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'uploads')}`);
});
