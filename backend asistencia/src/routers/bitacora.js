const express = require('express');
const bitacoraController = require('../controllers/bitacora.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validarJWT');

const bitacoraRouter = express.Router();

// Listar todas las bitacoras - Requiere JWT y fechas de inicio y fin
bitacoraRouter.get('/',
    [
        validarJWT,
        validarCampos
    ],
    bitacoraController.listarTodos
);
bitacoraRouter.put('/:id',
    [
        validarJWT,
        check('id', 'El id es obligatorio').isMongoId().trim(),
        validarCampos
    ],
    bitacoraController.updateEstado
);


bitacoraRouter.post('/listarAprendiz',
    [
        validarJWT,
        // check('cc', 'El documento del aprendiz es obligatorio').not().isEmpty(),
        // check('fechaInicio', 'La fecha de inicio es obligatoria').isISO8601(),
        // check('fechaFin', 'La fecha de fin es obligatoria').isISO8601(),
        validarCampos
    ],
    bitacoraController.listarAprendiz
);

bitacoraRouter.post('/listarFicha',
    [
        validarJWT,
        check('id_ficha', 'El ID de la ficha es obligatorio').not().isEmpty().trim(),
        check('fechaInicio', 'La fecha de inicio es obligatoria').isISO8601().trim(),
        check('fechaFin', 'La fecha de fin es obligatoria').isISO8601().trim(),
        validarCampos
    ],
    bitacoraController.listarFicha
);
bitacoraRouter.post('/listarFichaHora', [
    validarJWT,
    check('idFicha', 'El idFicha es obligatorio').isMongoId().trim(),
    check('fecha', 'La fecha es obligatoria').notEmpty().trim(),
    validarCampos
], bitacoraController.listarPorFichaYFecha);

// Crear una nueva bitacora - Requiere JWT y validaciones de campos
bitacoraRouter.post('/',
    [
        validarJWT,
        check('id_aprendiz', 'El ID del aprendiz es obligatorio').not().isEmpty().trim(),
        validarCampos
    ],
    bitacoraController.crear
);


module.exports = bitacoraRouter;
