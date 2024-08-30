const express = require('express');
const { check } = require('express-validator');
const usuarioController = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validarJWT');

const usuarioRouter = express.Router();

usuarioRouter.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  usuarioController.crear
);
usuarioRouter.post('/login', 
  [
      check('email', 'El correo es obligatorio').isEmail(),
      check('password', 'La contraseña es obligatoria').not().isEmpty(),
      validarCampos
  ], 
  usuarioController.login
);
usuarioRouter.get('/listarPorCorreo/:email', 
  [
      check('email', 'El correo es obligatorio').isEmail(),
      validarCampos
  ], 
  usuarioController.login
);

usuarioRouter.get('/', [
  validarJWT,
   validarCampos], usuarioController.listarTodos);

usuarioRouter.put(
  '/modificar/:email',
  [
    // validarJWT,
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').optional().isLength({ min: 6 }),
    validarCampos,
  ],
  usuarioController.modificar
);

usuarioRouter.put('/activar/:email', 
  validarJWT,
   usuarioController.activar);

usuarioRouter.put('/inactivar/:email', 
  validarJWT,
   usuarioController.inactivar);

usuarioRouter.delete('/:email', 
  validarJWT,
   usuarioController.eliminar);


// usuarioRouter.put(
//   '/cambiar-contrasena/:email',
//   [
//     check('password', 'La contraseña actual es requerida').not().isEmpty(),
//     check('newPassword', 'La nueva contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
//     validarCampos,
//   ],
  // validarJWT,
//   usuarioController.cambiarContrasena
// );

module.exports = usuarioRouter;
