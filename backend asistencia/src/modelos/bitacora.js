const mongoose = require('mongoose');

const bitacoraSchema = new mongoose.Schema({
  id_aprendiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Aprendiz', required: true },
  fecha: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ['No Asistió', 'Asistió', 'Excusa', 'Pendiente'],
      default: 'Pendiente' // Estado predeterminado
    },
  
}, { timestamps: true });

module.exports = mongoose.model('Bitacora', bitacoraSchema);
