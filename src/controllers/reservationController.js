const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../config/db');
const sendEmail = require('../services/emailService');

const TABLE_NAME = 'Reservations';

router.post('/', async (req, res) => {
    try {
        const { movie, room, schedule, seats, email } = req.body;
        if (!movie || !room || !schedule || !seats || !email) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        if (!Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ error: "Debe proporcionar al menos un asiento válido." });
        }

        const reservationId = uuidv4();
        const params = {
            TableName: TABLE_NAME,
            Item: {
                id: reservationId,
                movie,
                room,
                schedule,
                seats,
                email,
                createdAt: new Date().toISOString()
            }
        };

        await dynamoDB.put(params).promise();
        const subject = 'Reserva Confirmada';
        const text = `Tu reserva para la película "${movie}" en la sala "${room}" con horario y fecha: "${schedule}" ha sido confirmada.\nAsientos: ${seats.join(', ')}`;

        try {
            await sendEmail(email, subject, text);
        } catch (emailError) {
            console.error("Error al enviar el correo de confirmación:", emailError);
        }

        res.status(201).json({ 
            message: 'Reserva creada exitosamente',
            reservation: {
                id: reservationId,
                movie,
                room,
                schedule,
                seats,
                email
            }
        });

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});

router.get('/', async (req, res) => {
    try {
        const params = {
            TableName: TABLE_NAME
        };
        const data = await dynamoDB.scan(params).promise();
        
        res.json({
            total: data.Items.length,
            reservations: data.Items
        });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { movieName, email } = req.body;

        if (!id) {
            return res.status(400).json({ error: "El ID de la reserva es obligatorio." });
        }

        if (!movieName || !email) {
            return res.status(400).json({ error: "El nombre de la película y el correo son obligatorios." });
        }
        const params = {
            TableName: TABLE_NAME,
            Key: { id }
        };

        await dynamoDB.delete(params).promise();
        const emailContent = `
            Reserva Cancelada
            Tu reserva para la película ${movieName} ha sido cancelada exitosamente.
        `;

        await sendEmail(email, "Confirmación de Cancelación", emailContent);

        res.json({ message: "Reserva eliminada exitosamente y correo enviado." });

    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        res.status(500).json({ error: "Error al eliminar la reserva" });
    }
});


module.exports = router;
