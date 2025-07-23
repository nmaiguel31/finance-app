// backend/controllers/movimientoController.js
const Movimiento = require('../models/movimiento');

const crearMovimiento = async (req, res) => {
  const { tipo, categoria, monto, descripcion } = req.body;

  if (!tipo || !categoria || !monto || !descripcion) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const nuevoMovimiento = new Movimiento({
      usuario: req.usuario.id, // <- del token
      tipo,
      categoria,
      monto,
      descripcion
    });

    await nuevoMovimiento.save();
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({ mensaje: 'Error al crear movimiento' });
  }
};

const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find({ usuario: req.usuario.id }).sort({ fecha: -1 });
    res.status(200).json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ error: error.message });
  }
};

const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    await Movimiento.deleteOne({ _id: id, usuario: req.usuario.id }); // ← corregido aquí también
    res.json({ mensaje: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resumenFinanciero = async (req, res) => {
  try {
    const movimientos = await Movimiento.find({ usuario: req.usuario.id }); // ← aquí también

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
    console.error('Error al calcular el resumen:', error);
    res.status(500).json({ error: 'Error al calcular el resumen' });
  }
};

module.exports = {
  obtenerMovimientos,
  crearMovimiento,
  eliminarMovimiento,
  resumenFinanciero
};
