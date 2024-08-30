const mongoose = require('mongoose');

const aprendizShema = new mongoose.Schema({
    documento: { type: String, require: true, unique: true },
    nombre: { type: String, require: true },
    telefono: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    id_ficha: { type: mongoose.Schema.Types.ObjectId, ref: 'Ficha' },
    estado: { type: String, default: 1 }
}, { timestamps: true })

module.exports = mongoose.model('Aprendiz', aprendizShema)