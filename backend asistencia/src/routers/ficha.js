const express = require('express');
const fichaController = require('../controllers/ficha.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validarJWT');

const fichaRouter = express.Router();

// Listar todas las fichas - No se requiere JWT para esta ruta
fichaRouter.get('/',
    [
        validarJWT,
        validarCampos
    ], fichaController.listarTodos);

fichaRouter.post('/',
    [
        validarJWT,
        check('codigo').optional().isNumeric().withMessage('El código debe ser un número'),
        check('nombre').optional().not().isEmpty().withMessage('El nombre es obligatorio'),
        validarCampos
    ],
    fichaController.crear
);

fichaRouter.put('/modificar/:id',
    [
        validarJWT,
        check('id', 'El id es obligatorio').isMongoId(),
        check('codigo').optional().isNumeric().withMessage('El código debe ser un número'),
        check('nombre').optional().not().isEmpty().withMessage('El nombre es obligatorio'),
        validarCampos
    ],
    fichaController.modificar
);

// Activar una ficha - Se requiere JWT
fichaRouter.put('/activar/:id',
    [
        validarJWT,
        check('id', 'El id es obligatorio').isMongoId(),
        validarCampos
    ], fichaController.activar,
);

// Inactivar una ficha - Se requiere JWT
fichaRouter.put('/desactivar/:id',
    [
        validarJWT,
        check('id', 'El id es obligatorio').isMongoId(),
        validarCampos
    ], fichaController.desactivar,);

module.exports = fichaRouter;
