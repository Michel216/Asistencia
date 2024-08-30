const mongoose = require('mongoose');

const usuariosShema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    nombre: { type: String, require: true },
    estado: {type: String, default:1}
}, {timestamps: true});

module.exports = mongoose.model('Usuarios', usuariosShema)