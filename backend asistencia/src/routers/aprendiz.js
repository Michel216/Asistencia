const express = require('express');
const aprendizController = require('../controllers/aprendiz');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos.js');
const { validarJWT } = require('../middlewares/validarJWT');
const upload = require('../config/cloudinaryConfig.js')

const aprendizRouter = express.Router();

aprendizRouter.get('/aprendiz/:cc', [
    validarJWT,
    validarCampos], aprendizController.listarCC);

aprendizRouter.get('/aprendiz/ficha/:id_ficha', [
    validarJWT,
    validarCampos], aprendizController.listarFicha);

aprendizRouter.get('/', [
    validarJWT,
    validarCampos], aprendizController.listarTodos);

// Ruta POST con subida de archivo
aprendizRouter.post('/',
    [
        validarJWT,
        upload.single('firma'), 
        check('documento', 'El número de documento es obligatorio')
            .notEmpty().withMessage('Debe ingresar un valor')
            .isNumeric().withMessage('Debe ser un número').trim(),
        check('nombre').isString().withMessage('El campo nombre debe ser una cadena')
            .not().isEmpty().withMessage('El campo nombre no puede estar vacío').trim(),
        check('telefono', 'El teléfono es obligatorio')
            .notEmpty().withMessage('Debe ingresar un valor')
            .isNumeric().withMessage('Debe ser un número')
            .isLength({ min: 10, max: 10 }).withMessage('Debe tener exactamente 10 dígitos').trim(),
        check('email', 'El email es obligatorio').notEmpty()
            .withMessage('Debe ingresar un valor')
            .isEmail().withMessage('Debe ser un email válido').trim(),
        check('id_ficha', 'El ID de la ficha es obligatorio').isMongoId().trim(),
        validarCampos
    ],
    aprendizController.crear
);

// Ruta PUT para modificar con subida de archivo
aprendizRouter.put('/modificar/:id',
    [
        validarJWT,
        upload.single('file'), // Middleware para subir archivo
        check('documento', 'El número de documento es obligatorio')
            .notEmpty().withMessage('Debe ingresar un valor')
            .isNumeric().withMessage('Debe ser un número').trim(),
        check('nombre').isString().withMessage('El campo nombre debe ser una cadena')
            .not().isEmpty().withMessage('El campo nombre no puede estar vacío').trim(),
        check('telefono', 'El teléfono es obligatorio')
            .notEmpty().withMessage('Debe ingresar un valor')
            .isNumeric().withMessage('Debe ser un número')
            .isLength({ min: 10, max: 10 }).withMessage('Debe tener exactamente 10 dígitos').trim(),
        check('email', 'El email es obligatorio').notEmpty().withMessage('Debe ingresar un valor').isEmail().withMessage('Debe ser un email válido').trim(),
        check('id_ficha', 'El ID de la ficha es obligatorio').isMongoId().trim(),
        validarCampos
    ],
    aprendizController.modificar
);

aprendizRouter.put('/activar/:id',
    [
        validarJWT,
        check('id', 'El ID proporcionado no es válido').isMongoId().trim(),
        validarCampos
    ],
    aprendizController.activar);

aprendizRouter.put('/desactivar/:id',
    [
        validarJWT,
        check('id', 'El ID proporcionado no es válido').isMongoId().trim(),
        validarCampos
    ],
    aprendizController.desactivar);

module.exports = aprendizRouter;
