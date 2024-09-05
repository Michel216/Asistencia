const { genSaltSync, hashSync, compareSync } = require ('bcryptjs');
const { findOne } = require ('../modelos/usuarios');

const encriptarPassword = (password) => {
    const salt = genSaltSync();
    return hashSync(password, salt);
}

const compararPassword = (password, hash) => {
    return compareSync(password, hash);
}

const validarEmailUnico = async (email) => {
    const usuario = await findOne({ email });
    if (usuario) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

export default {
    encriptarPassword,
    compararPassword,
    validarEmailUnico
}

