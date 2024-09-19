const Aprendiz = require('../modelos/aprendiz');

const aprendizHelper = {
    existeDocumento: async (documento) => {

        const existente = await Aprendiz.findOne({ documento });
        if (existente) {
            throw new Error('Ya existe un aprendiz con este documento');
        }
    },
    existeEmail: async (email) => {

        const existente = await Aprendiz.findOne({ email });
        if (existente) {
            throw new Error('Ya existe un aprendiz con este email');
        }
    },

    verificarID: async (id) => {
        try {
            const existe = await Aprendz.findById(id);
            if (!existe) {
                throw new Error(`El Aprendiz con ID ${id} no existe`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al buscar el aprendiz por ID: ${error.message}`);
        }
    },
    verificarDocumento: async (cc) => {
        try {
            const existe = await Aprendiz.findOne({ cc });
            if (!existe) {
                throw new Error(`El cc ${cc} no está registrado`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al verificar cc: ${error.message}`);
        }
    },

    validarUnicidadCreacion: async (data) => {
        const { email, documento, telefono } = data;

        const emailExistente = await Aprendiz.findOne({ email });
        if (emailExistente) {
            throw new Error('Ya existe un aprendiz con este email');
        }

        const documentoExistente = await Aprendiz.findOne({ documento });
        if (documentoExistente) {
            throw new Error('Ya existe un aprendiz con este documento');
        }

        const telefonoExistente = await Aprendiz.findOne({ telefono });
        if (telefonoExistente) {
            throw new Error('Ya existe un aprendiz con este telefono');
        }

        return true;
    },
    validarUnicidadActualizacion: async (id, data) => {
        const { email, documento, telefono } = data;

        const aprendizActual = await Aprendiz.findById(id);
        if (!aprendizActual) {
            throw new Error(`El aprendiz con ID ${id} no existe`);
        }

        if (email && email !== aprendizActual.email) {
            const emailExistente = await Aprendiz.findOne({ email });
            if (emailExistente) {
                throw new Error('Ya existe un aprendiz con este email');
            }
        }

        if (documento && documento !== aprendizActual.documento) {
            const documentoExistente = await Aprendiz.findOne({ documento });
            if (documentoExistente) {
                throw new Error('Ya existe un aprendiz con este documento');
            }
        }

        if (telefono && telefono !== aprendizActual.telefono) {
            const telefonoExistente = await Aprendiz.findOne({ telefono });
            if (telefonoExistente) {
                throw new Error('Ya existe un aprendiz con este telefono');
            }
        }

        return true;
    }

}

export { aprendizHelper }
