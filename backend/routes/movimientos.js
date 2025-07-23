const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  obtenerMovimientos,
  crearMovimiento,
  eliminarMovimiento,
  resumenFinanciero
} = require('../controllers/movimientosController');


router.post('/', authMiddleware, crearMovimiento);
router.get('/', authMiddleware, obtenerMovimientos);
router.delete('/:id', authMiddleware, eliminarMovimiento);
router.get('/resumen', authMiddleware, resumenFinanciero);

module.exports = router;
