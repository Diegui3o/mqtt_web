import express from 'express';

const router = express.Router();

// Define tus rutas aquí
router.get('/example', (req, res) => {
    res.send('Hello, world!');
});

export default router;