const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

require('./src/config/db');

const app = express();
app.use(express.json());
app.use(cors())
const movieRoutes = require('./src/controllers/movieController');
const roomRoutes = require('./src/controllers/roomController');
const reservationRoutes = require('./src/controllers/reservationController');
const infoRoutes = require('./src/controllers/infoController');

app.use('/movies', movieRoutes);
app.use('/rooms', roomRoutes);
app.use('/reservations', reservationRoutes);
app.use('/info', infoRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
