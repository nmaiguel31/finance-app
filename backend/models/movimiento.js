// models/movimiento.js
const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  monto: { type: Number, required: true },
  tipo: { type: String, enum: ['ingreso', 'gasto'], required: true },
  categoria: { type: String, required: true }, // ✅ AÑADIDO
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Movimiento', MovimientoSchema);
