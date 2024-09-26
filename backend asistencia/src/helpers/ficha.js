const Ficha = require('../modelos/ficha');

const fichaHelper = {
    validarCodigoUnico: async (codigo) => {
        try {
            const ficha = await Ficha.findOne({ codigo });
            if (ficha) {
                throw new Error(`El código ${codigo} ya está registrado`);
            }
        } catch (error) {
            throw new Error(`Error al verificar código: ${error.message}`);
        }
    },

    verificarCodigo: async (codigo) => {
        try {
            const ficha = await Ficha.findOne({ codigo });
            if (!ficha) {
                throw new Error(`El código ${codigo} no está registrado`);
            }
            return ficha;
        } catch (error) {
            throw new Error(`Error al verificar código: ${error.message}`);
        }
    },

    verificarId: async (id) => {
        try {
            const ficha = await Ficha.findById(id);
            if (!ficha) {
                throw new Error(`La ficha con ID ${id} no está registrada`);
            }
            return ficha;
        } catch (error) {
            throw new Error(`Error al verificar ID: ${error.message}`);
        }
    },

    validarUnicidadActualizacion: async (id, data) => {
        const { codigo } = data;

        const fichaActual = await Ficha.findById(id);
        if (!fichaActual) {
            throw new Error(`La ficha con ID ${id} no existe`);
        }

        // Si el código cambió, verificar si ya existe
        if (codigo && codigo !== fichaActual.codigo) {
            const codigoExistente = await Ficha.findOne({ codigo });
            if (codigoExistente) {
                throw new Error('Ya existe una ficha con este código');
            }
        }

        return true;
    }
};

module.exports = fichaHelper;
