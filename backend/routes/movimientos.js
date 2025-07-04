const express = require('express');
const router = express.Router();
const { obtenerMovimientos, crearMovimiento, eliminarMovimiento, resumenFinanciero } = require('../controllers/movimientosController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/resumen', authMiddleware, resumenFinanciero);
router.get('/', authMiddleware, obtenerMovimientos);
router.post('/', authMiddleware, crearMovimiento);
router.delete('/:id', authMiddleware, eliminarMovimiento);

module.exports = router;

