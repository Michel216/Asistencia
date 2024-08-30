const Aprendiz = require('../modelos/aprendiz');

const validarCCUnico = async (documento) => {
    if (!documento || !documento.trim()) {
        throw new Error('El campo documento no puede ser vacío');
    }

    const existente = await Aprendiz.findOne({ documento });
    if (existente) {
        throw new Error('Ya existe un aprendiz con este documento');
    }
};


module.exports = {
    validarCCUnico
}
