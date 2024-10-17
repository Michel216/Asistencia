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
    registroExistenteHoy: async (id_aprendiz) => {
        const hoy = moment().startOf('day'); // Fecha de hoy, 00:00 horas
    
        // Busca un registro del aprendiz para el día actual
        const registro = await Bitacora.findOne({
          aprendiz: id_aprendiz,
          fecha: { $gte: hoy.toDate(), $lt: moment(hoy).endOf('day').toDate() },
        });
    
        return registro ? true : false;
      },
};

module.exports = bitacoraHelper;




