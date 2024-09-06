const bcryptjs = require('bcryptjs');
const Usuario = require('../modelos/usuarios');

const encriptarPassword = (password) => {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
}

const compararPassword = (password, hash) => {
    return bcryptjs.compareSync(password, hash);
}

const validarEmailUnico = async (email) => {
    const usuario = await Usuario.findOne({ email });
    if (usuario) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

module.exports = {
    encriptarPassword,
    compararPassword,
    validarEmailUnico
}




