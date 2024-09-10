const bcryptjs = require('bcryptjs');
const Usuario = require('../modelos/usuarios');
const { generarJWT } = require('../middlewares/validarJWT');
const { encriptarPassword, compararPassword, validarEmailUnico } = require('../helpers/usuario.js');

const usuarioController = {
    // Crear usuario

    crear: async (req, res) => {
        try {
            const { email, password, nombre } = req.body;
            await validarEmailUnico(email);

            const hashedPassword = encriptarPassword(password);

            const nuevoUsuario = new Usuario({
                email,
                password: hashedPassword,
                nombre
            });

            await nuevoUsuario.save();

            const token = await generarJWT(nuevoUsuario._id);

            // Responder con el usuario y el token
            res.json({
                usuario: nuevoUsuario,
                token
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
            }

            const validPassword = bcryptjs.compareSync(password, usuario.password);
            if (!validPassword) {
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
            }

            const token = await generarJWT(usuario.id);
            res.json({ usuario, token });

        } catch (error) {
            console.error('Error en el login:', error);
            res.status(500).json({ msg: 'Error en el login' });
        }
    },





    // Listar todos los usuarios
    listarTodos: async (req, res) => {
        try {
            const usuarios = await Usuario.find();
            res.json(usuarios);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    },
    listarPorEmail: async (req, res) => {
        try {
            const usuarios = await Usuario.findOne({email});
            res.json(usuarios);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    },

    // login: async (req, res) => {
    //     const { email, password } = req.body;
    //     try {
    //         const usuario = await Usuario.findOne({ email });
    //         if (!usuario) {
    //             return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
    //         }

    //         const validPassword = compararPassword(password, usuario.password);
    //         if (!validPassword) {
    //             return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
    //         }

    //         const token = await generarJWT(usuario.id);
    //         res.json({ usuario, token });

    //     } catch (error) {
    //         console.error('Error en el login:', error);
    //         res.status(500).json({ msg: 'Error en el login' });
    //     }
    // },

    // Modificar usuario (incluyendo cambiar contraseña)
    modificar: async (req, res) => {
        const { id } = req.params;
        const nuevosDatos = req.body;

        try {

            if (nuevosDatos.password) {
                nuevosDatos.password = encriptarPassword(nuevosDatos.password);
            }

            const usuarioModificado = await Usuario.findByIdAndUpdate(id, nuevosDatos, { new: true });

            if (!usuarioModificado) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            res.json({ message: 'Datos del usuario modificados', usuario: usuarioModificado });
        } catch (error) {
            console.error('Error al modificar los datos del usuario:', error);
            res.status(500).json({ error: 'Error al modificar los datos del usuario' });
        }
    },


 // Activar usuario
activar: async (req, res) => {
    const { email } = req.params;
    try {
        const usuarioActivo = await Usuario.findOneAndUpdate(
            { email }, 
            { estado: 1 }, 
            { new: true }
        );
        if (!usuarioActivo) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario activado', usuario: usuarioActivo });
    } catch (error) {
        console.error('Error al activar al usuario:', error);
        res.status(500).json({ error: 'Error al activar al usuario' });
    }
},

// Inactivar usuario
inactivar: async (req, res) => {
    const { email } = req.params;
    try {
        const usuarioInactivo = await Usuario.findOneAndUpdate(
            { email }, 
            { estado: 0 }, 
            { new: true }
        );
        if (!usuarioInactivo) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario inactivado', usuario: usuarioInactivo });
    } catch (error) {
        console.error('Error al inactivar al usuario:', error);
        res.status(500).json({ error: 'Error al inactivar al usuario' });
    }
},


    // Eliminar usuario
    eliminar: async (req, res) => {
        const { email } = req.params;
        try {
            const usuarioEliminado = await Usuario.findOneAndDelete({ email });
            if (!usuarioEliminado) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario eliminado', usuario: usuarioEliminado });
        } catch (error) {
            console.error('Error al eliminar al usuario:', error);
            res.status(500).json({ error: 'Error al eliminar al usuario' });
        }
    },

    // Cambiar contraseña
    // cambiarContrasena: async (req, res) => {
    //     const { email } = req.params;
    //     const { password, newPassword } = req.body;

    //     try {
    //         // Encontrar usuario por email
    //         const usuario = await Usuario.findOne({ email });

    //         // Verificar si el usuario existe
    //         if (!usuario) {
    //             return res.status(404).json({ msg: 'Usuario no encontrado' });
    //         }

    //         // Verificar si la contraseña actual coincide
    //         const isMatch = compararPassword(password, usuario.password);

    //         if (!isMatch) {
    //             return res.status(400).json({ msg: 'La contraseña actual no es válida' });
    //         }

    //         // Encriptar nueva contraseña
    //         const hashedPassword = encriptarPassword(newPassword);

    //         // Actualizar contraseña en la base de datos
    //         usuario.password = hashedPassword;
    //         await usuario.save();

    //         res.json({ message: 'Contraseña modificada exitosamente' });
    //     } catch (error) {
    //         console.error('Error al cambiar la contraseña:', error);
    //         res.status(500).json({ error: 'Error al cambiar la contraseña' });
    //     }
    // },
};

module.exports = usuarioController;
