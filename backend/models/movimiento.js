const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  descripcion: { 
    type: String, 
    required: [true, 'La descripción es obligatoria'], 
    trim: true 
  },
  monto: { 
    type: Number, 
    required: [true, 'El monto es obligatorio'], 
    min: [0, 'El monto no puede ser negativo'] 
  },
  tipo: { 
    type: String, 
    enum: {
      values: ['ingreso', 'gasto'],
      message: '{VALUE} no es un tipo válido'
    },
    required: [true, 'El tipo es obligatorio']
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  userId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Usuario', 
  required: true 
  }
});

module.exports = mongoose.model('Movimiento', movimientoSchema);
