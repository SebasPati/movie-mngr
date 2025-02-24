const express = require('express');
const router = express.Router();
const dynamoDB = require('../config/db');
const Room = require('../models/room');

router.post('/', async (req, res) => {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const newRoom = new Room(name, capacity);

        const params = {
            TableName: "rooms",
            Item: newRoom
        };

        await dynamoDB.put(params).promise();
        res.status(201).json(newRoom);

    } catch (error) {
        if (error.message.includes("Capacidad inválida")) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/', async (req, res) => {
    const params = {
        TableName: "rooms"
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las salas" });
    }
});

module.exports = router;
