const Ficha = require('../modelos/ficha');

const fichaHelper = {
    validarCodigoUnico: async (codigo) => {
        try {
            const ficha = await Ficha.findOne({ codigo });
            if (ficha) {
                throw new Error(`El código ${codigo} ya está registrado`);
            }
        }
        catch (error) {
            throw new Error(`Error al verificar codigo: ${error.message}`);
        }
    },

    verificarCodigo: async (codigo) => {
        try {
            const ficha = await Ficha.findOne({ codigo });
            if (!ficha) {
                throw new Error(`El codigo ${codigo} no está registrado`);
            }
            return ficha;
        } catch (error) {
            throw new Error(`Error al verificar codigo: ${error.message}`);
        }
    },
    verificarId: async (id) => {
        try {
            const ficha = await Ficha.findById({ id });
            if (!ficha) {
                throw new Error(`La ficha con ID ${id} no está registrado`);
            }
            return ficha;
        } catch (error) {
            throw new Error(`Error al verificar id: ${error.message}`);
        }
    },
    validarUnicidadCreacion: async (data) => {
        const { codigo } = data;

        const codigoExistente = await Ficha.findOne({ codigo });
        if (codigoExistente) {
            throw new Error('Ya existe un ficha con este email');
        }
        return true;
    },
    validarUnicidadActualizacion: async (id, data) => {
        const { codigo } = data;

        const fichaActual = await Ficha.findById(id);
        if (!fichaActual) {
            throw new Error(`El ficha con ID ${id} no existe`);
        }

        if (codigo && codigo !== fichaActual.codigo) {
            const codigoExistente = await Ficha.findOne({ codigo });
            if (codigoExistente) {
                throw new Error('Ya existe un ficha con este codigo');
            }
        }

        return true;
    }

}

export { fichaHelper };
