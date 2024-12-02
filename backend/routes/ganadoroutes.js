const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta GET para obtener los animales
router.get('/animales', async (req, res) => {
  try {
    const [animales] = await db.promise().query('SELECT * FROM animales');
    res.json(animales);
  } catch (error) {
    console.error('Error al obtener animales:', error);
    res.status(500).json({ error: 'Error al obtener animales' });
  }
});

// Ruta POST para agregar un animal
router.post('/animales', async (req, res) => {
  const { tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones } = req.body;

  if (!tipo_de_animal || !raza || !fecha_nacimiento || !peso) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const [result] = await db.promise().query(
      'INSERT INTO animales (tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones]
    );

    res.status(201).json({
      id_animal: result.insertId,
      tipo_de_animal,
      raza,
      fecha_nacimiento,
      peso,
      estado_salud,
      observaciones,
    });
  } catch (error) {
    console.error('Error al agregar animal:', error);
    res.status(500).json({ error: 'Error al agregar animal' });
  }
});

module.exports = router;
