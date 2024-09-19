const bcryptjs = require('bcryptjs');
const Usuario = require('../modelos/usuarios');

const usuarioHelper = {
    encriptarPassword: (password) => {
        const salt = bcryptjs.genSaltSync();
        return bcryptjs.hashSync(password, salt);
    },

    compararPassword: (password, hash) => {
        return bcryptjs.compareSync(password, hash);
    },

    validarEmailUnico: async (email) => {
        const usuario = await Usuario.findOne({ email });
        if (usuario) {
            throw new Error(`El correo ${email} ya está registrado`);
        }
    },

    validarUnicidadCreacion: async (data) => {
        const { email } = data;

        const emailExistente = await Usuario.findOne({ email });
        if (emailExistente) {
            throw new Error('Ya existe un usuario con este email');
        }

        return true;
    },
    validarUnicidadActualizacion: async (id, data) => {
        const { email } = data;

        const usuarioActual = await Usuario.findById(id);
        if (!usuarioActual) {
            throw new Error(`El usuario con ID ${id} no existe`);
        }

        if (email && email !== usuarioActual.email) {
            const emailExistente = await Usuario.findOne({ email });
            if (emailExistente) {
                throw new Error('Ya existe un usuario con este email');
            }
        }

        return true;
    }
}

module.exports =  usuarioHelper 
