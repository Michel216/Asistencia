const bcryptjs = require('bcryptjs');
const Usuario = require('../modelos/usuarios');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { generarJWT } = require('../middlewares/validarJWT');
const { encriptarPassword, validarEmailUnico, validarUnicidadCreacion, validarUnicidadActualizacion } = require('../helpers/usuario.js');

const usuarioController = {
    // Crear usuario

    crear: async (req, res) => {
        try {
            await validarUnicidadCreacion(req.body);
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
            const usuarios = await Usuario.findOne({ email });
            res.json(usuarios);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    },


    // Modificar usuario (incluyendo cambiar contraseña)
    modificar: async (req, res) => {
        const id = req.params.id;
        const nuevosDatos = req.body;

        try {
            await validarUnicidadActualizacion(id, req.body);
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
        const id = req.params.id;
        try {
            const usuarioActivo = await Usuario.findByIdAndUpdate(
                id,
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
        const id = req.params.id;
        try {
            const usuarioInactivo = await Usuario.findByIdAndUpdate(
                id,
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
    enviarEmail: async (req, res) => {
        const { email } = req.params;
        try {
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }
            // const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

            const resetURL = `https://asistencia-i7sv.onrender.com/recuperarContraseña`;
            const mailOptions = {
                from: '"Recuperación de Contraseña" <no-reply@tuapp.com>',
                to: email,
                subject: 'Restablecer tu contraseña',
                html: `
                        <div style="text-align: center; font-family: Arial, sans-serif;">
                        <img src="https://cdn.goconqr.com/uploads/node/image/5862283/LOGO_SENA.png" alt="Logo SENA" style="width: 100px; height: auto; margin-bottom: 20px;" />
                        <h2>Recuperación de Contraseña</h2>
                            <p>Recibes este correo porque solicitaste restablecer tu contraseña para la plataforma de asistencia del SENA.</p>
                            <p>Por favor, haz clic en el botón de abajo para proceder con la recuperación de tu contraseña.</p>
                            <a href="${resetURL}" style="background-color: #357a38; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; margin: 20px 0;">Recuperar Contraseña</a>
                            <p style="margin-top: 30px;">Si no realizaste esta solicitud, ignora este correo y no se realizará ningún cambio.</p>
                        </div>
                    `,
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            })
            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Correo enviado. Revisa tu bandeja de entrada.' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ error: 'Error al enviar el correo' })
        }
    },
    // Cambiar contraseña
    cambiarContrasena: async (req, res) => {
        const { token } = req.body;
        const { newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;

            // Encontrar usuario por email
            const usuario = await Usuario.findOne({ email });

            // Verificar si el usuario existe
            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }


            // Encriptar nueva contraseña
            const hashedPassword = encriptarPassword(newPassword);

            // Actualizar contraseña en la base de datos
            usuario.password = hashedPassword;
            await usuario.save();

            res.json({ message: 'Contraseña modificada exitosamente' });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ error: 'El token ha expirado' });
            }
            console.error('Error al cambiar la contraseña:', error);
            res.status(500).json({ error: 'Error al cambiar la contraseña' });
        }
    },
};

module.exports = usuarioController;
