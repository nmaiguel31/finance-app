const Movimiento = require('../models/movimiento.js');

// Obtener movimientos solo del usuario autenticado
const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find({ userId: req.userId });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los movimientos' });
  }
};

// Crear movimiento asociado al usuario
const crearMovimiento = async (req, res) => {
  try {
    const nuevoMovimiento = new Movimiento({
      ...req.body,
      userId: req.userId
    });
    await nuevoMovimiento.save();
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar movimiento solo si pertenece al usuario
const eliminarMovimiento = async (req, res) => {
  try {
    const movimientoEliminado = await Movimiento.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!movimientoEliminado) {
      return res.status(404).json({ error: 'Movimiento no encontrado o no autorizado' });
    }

    res.json({ mensaje: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el movimiento' });
  }
};

// Controlador del resumen financiero

const resumenFinanciero = async (req, res) => {
  try {
    const movimientos = await Movimiento.find({ userId: req.userId });

    const totalIngresos = movimientos
      .filter(mov => mov.tipo === 'ingreso')
      .reduce((sum, mov) => sum + mov.monto, 0);

    const totalGastos = movimientos
      .filter(mov => mov.tipo === 'gasto')
      .reduce((sum, mov) => sum + mov.monto, 0);

    const saldoFinal = totalIngresos - totalGastos;

    res.json({
      totalIngresos,
      totalGastos,
      saldoFinal
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el resumen' });
  }
};

module.exports = {
  obtenerMovimientos,
  crearMovimiento,
  eliminarMovimiento,
  resumenFinanciero
};