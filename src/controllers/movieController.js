const express = require('express');
const Movie = require('../models/movie');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
    try {
        const { title, genre, duration, classification, desc, poster } = req.body;
        const newMovie = new Movie(uuidv4(), title, genre, duration, classification, desc, poster);
        const savedMovie = await Movie.create(newMovie);
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la película" });
    }
});

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.getAll();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las películas" });
    }
});
router.delete('/', async (req, res) => {
    try {
        await Movie.deleteAll();
        res.json({ message: "Todas las películas han sido eliminadas exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar las películas" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMovie = await Movie.delete(id);

        if (!deletedMovie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.json({ message: 'Película eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la película' });
    }
});

module.exports = router;
