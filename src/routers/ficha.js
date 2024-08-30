const express = require('express');
const fichaController = require('../controllers/ficha.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validarJWT');

const fichaRouter = express.Router();

// Listar todas las fichas - No se requiere JWT para esta ruta
fichaRouter.get('/', fichaController.listarTodos);

fichaRouter.post('/',
    [
        validarJWT,
        check('codigo', 'El código es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    fichaController.crear
);

fichaRouter.put('/modificar/:_id', 
    [
        validarJWT,
        validarCampos
    ],
    fichaController.modificar
);
// check('codigo', 'El código es obligatorio').optional().not().isEmpty(),
// check('nombre', 'El nombre es obligatorio').optional().not().isEmpty(),

// Activar una ficha - Se requiere JWT
fichaRouter.put('/activar/:codigo', 
    validarJWT, 
    fichaController.activar,
    validarCampos);

// Inactivar una ficha - Se requiere JWT
fichaRouter.put('/inactivar/:codigo', 
    validarJWT, 
    fichaController.inactivar,
    validarCampos);

module.exports = fichaRouter;
