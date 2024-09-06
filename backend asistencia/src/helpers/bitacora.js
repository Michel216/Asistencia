const Bitacora = require('../modelos/bitacora');

const validarBitacoraUnica = async (id_aprendiz, fecha) => {
    const bitacora = await Bitacora.findOne({ cc, fecha });
    if (bitacora) {
        throw new Error(`Ya existe una bitácora para el aprendiz con id ${id_aprendiz} en la fecha ${fecha}`);
    }
}

module.exports = {
    validarBitacoraUnica
}

const Bitacora = require('../modelos/bitacora');

const validarBitacoraUnica = async (id_aprendiz, fecha) => {
    const bitacora = await Bitacora.findOne({ cc, fecha });
    if (bitacora) {
        throw new Error(`Ya existe una bitácora para el aprendiz con id ${id_aprendiz} en la fecha ${fecha}`);
    }
}

module.exports = {
    validarBitacoraUnica
}
