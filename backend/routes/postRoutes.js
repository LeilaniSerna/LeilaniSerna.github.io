const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Asegúrate de que la ruta a tu archivo de configuración de la base de datos es correcta

// Ruta para obtener todos los registros de animales
router.get('/animales', (req, res) => {
    const query = 'SELECT * FROM animales';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Ruta para agregar o insertar un nuevo registro de animal
router.post('/animales', (req, res) => {
    const { tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones } = req.body;
    const query = 'INSERT INTO animales (tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Animal agregado exitosamente', id_animal: result.insertId });
    });
});

// Ruta para actualizar un registro de animal por ID
router.put('/animales/:id', (req, res) => {
    const { id } = req.params;
    const { tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones } = req.body;
    const query = 'UPDATE animales SET tipo_de_animal = ?, raza = ?, fecha_nacimiento = ?, peso = ?, estado_salud = ?, observaciones = ? WHERE id_animal = ?';
    const values = [tipo_de_animal, raza, fecha_nacimiento, peso, estado_salud, observaciones, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Registro de animal actualizado exitosamente' });
    });
});

// Ruta para eliminar un registro de animal por ID
router.delete('/animales/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM animales WHERE id_animal = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Animal eliminado exitosamente' });
    });
});

module.exports = router;
