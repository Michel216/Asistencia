const Bitacora = require('../modelos/bitacora');

const bitacoraHelper = {

    validarBitacoraUnica: async (id_aprendiz, fecha) => {
        try {
            // Buscar una bitácora con el id_aprendiz y fecha especificados
            const bitacora = await Bitacora.findOne({ id_aprendiz, fecha });
            if (bitacora) {
                throw new Error(`Ya existe una bitácora para el aprendiz con id ${id_aprendiz} en la fecha ${fecha}`);
            }
            return true; // Si no existe, retorna true
        } catch (error) {
            console.error('Error al validar bitácora única:', error);
            throw new Error(`Error al validar bitácora: ${error.message}`);
        }
    },
};

module.exports = bitacoraHelper;




