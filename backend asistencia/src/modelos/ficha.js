const mongoose = require('mongoose');

const fichaShema = new mongoose.Schema({
    codigo: { type: String, require: true, unique: true },
    nombre: { type: String, require: true },
    estado: {type: String, default:1}
}, {timestamps: true});

module.exports = mongoose.model('Ficha', fichaShema)