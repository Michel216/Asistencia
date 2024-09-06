const Ficha = require('../modelos/ficha');

const validarCodigoUnico = async (codigo) => {
    const ficha = await Ficha.findOne({ codigo });
    if (ficha) {
        throw new Error(`El código ${codigo} ya está registrado`);
    }
}

module.exports = {
    validarCodigoUnico
}

const Ficha = require('../modelos/ficha');

const validarCodigoUnico = async (codigo) => {
    const ficha = await Ficha.findOne({ codigo });
    if (ficha) {
        throw new Error(`El código ${codigo} ya está registrado`);
    }
}

module.exports = {
    validarCodigoUnico
}
