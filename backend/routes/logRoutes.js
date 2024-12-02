const express = require('express');
const multer = require('multer'); // Importamos multer
const path = require('path'); // Para manejar las rutas de archivos
const router = express.Router();
const db = require('../config/db');

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Usamos la fecha para nombrar la imagen
  }
});

const upload = multer({ storage: storage });  // Creamos un middleware para multer

// Ruta para registrar un nuevo usuario con imagen
router.post('/CrearCuenta', upload.single('imagen'), (req, res) => {
    const { correo, contrasena, telefono, nombre } = req.body;
    const imagen = req.file ? req.file.filename : null; // Obtenemos el nombre del archivo cargado
  
    // Validación de campos
    if (!correo || !contrasena || !telefono || !nombre) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    // Query SQL para insertar los datos del usuario, incluyendo la imagen
    const query = 'INSERT INTO usuario (correo, contrasena, telefono, nombre, imagen) VALUES (?, ?, ?, ?, ?)';
  
    db.query(query, [correo, contrasena, telefono, nombre, imagen], (err, result) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        return res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
      }
      
      return res.status(200).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
    });
});

// Ruta para login
router.post('/login', (req, res) => { 
    const { username, password } = req.body; 
    const query = 'SELECT idnew_table AS userId, administrador AS isAdmin FROM usuario WHERE nombre = ? AND contrasena = ?'; 
    const values = [username, password]; 
    
    db.query(query, values, (err, results) => { 
        if (err) { 
            return res.status(500).json({ error: 'Error en el servidor' }); 
        } 
        if (results.length > 0) { 
            const user = results[0];
            res.status(200).json({ message: 'Login exitoso', userId: user.userId, isAdmin: user.isAdmin });
        } else { 
            res.status(401).json({ error: 'Usuario o contraseña incorrectos' }); 
        } 
    }); 
});

// Ruta para actualizar la cuenta de usuario
router.put('/UpdateCuenta/:id', upload.single('imagen'), (req, res) => {
  const { correo, contrasena, telefono, nombre } = req.body;
  const userId = req.params.id; 
  const imagen = req.file ? req.file.filename : null; // Obtenemos el nombre del archivo cargado

  // Validación básica
  if (!userId || !correo || !contrasena || !telefono || !nombre) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Consulta para actualizar los datos del usuario
  let query = `
    UPDATE usuario 
    SET correo = ?, contrasena = ?, telefono = ?, nombre = ?
  `;

  // Si se sube una imagen, actualizamos también ese campo
  if (imagen) {
    query += ', imagen = ?';
  }

  query += ' WHERE idnew_table = ?';

  // Si la imagen es proporcionada, la añadimos al array de parámetros
  const params = imagen ? [correo, contrasena, telefono, nombre, imagen, userId] : [correo, contrasena, telefono, nombre, userId];

  // Ejecutar la consulta
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ error: 'Hubo un error al actualizar el usuario' });
    }

    // Verificar si se afectó alguna fila
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario actualizado con éxito' });
  });
});

// Ruta para obtener la imagen del perfil del usuario
router.get('/imagen/:id', (req, res) => {
  const userId = req.params.id;
  
  // Consulta SQL para obtener la imagen del usuario
  const query = 'SELECT imagen FROM usuario WHERE idnew_table = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener la imagen:', err);
      return res.status(500).json({ error: 'Hubo un error al obtener la imagen' });
    }
    
    if (results.length > 0) {
      // Si encontramos la imagen, la devolvemos
      return res.json({ imagen: results[0].imagen });
    } else {
      // Si no encontramos la imagen, enviamos un error
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

module.exports = router;
