const mongoose = require('mongoose');

const usuariosShema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    estado: { type: String, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Usuarios', usuariosShema)