const express = require('express');
const  aprendizController  = require('../controllers/aprendiz');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos.js');
const { validarJWT } = require('../middlewares/validarJWT');

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

aprendizRouter.post('/', 
    [
        validarJWT,
        check('documento', 'El número de documento es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('telefono', 'El telefono es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('id_ficha', 'El ID de la ficha es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    aprendizController.crear
);

aprendizRouter.put('/modificar/:id', 
    [
        validarJWT,
        check('id', 'El id es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    aprendizController.modificar
);

aprendizRouter.put('/activar/:id', 
   [ validarJWT,
    validarCampos],

     aprendizController.activar);

aprendizRouter.put('/desactivar/:id', 
   [   validarJWT,
    validarCampos],

     aprendizController.desactivar);

module.exports = aprendizRouter;
