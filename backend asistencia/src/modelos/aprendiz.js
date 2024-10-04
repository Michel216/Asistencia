const mongoose = require('mongoose');

const aprendizShema = new mongoose.Schema({
    documento: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    telefono: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    id_ficha: { type: mongoose.Schema.Types.ObjectId, ref: 'Ficha' },
    firma: { type: String},
    estado: { type: String, required: true, default: 1 }
}, { timestamps: true })

module.exports = mongoose.model('Aprendiz', aprendizShema)
