

const Aprendiz = require('../modelos/aprendiz.js');
const { validarCCUnico, validarUnicidadCreacion, validarUnicidadActualizacion } = require('../helpers/aprendiz.js');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig.js'); // Asegúrate de que la ruta sea correcta

// Configuración de almacenamiento con multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'firmasAprendiz', // Carpeta en Cloudinary donde se guardarán los archivos
        allowed_formats: ['jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'heic'],
        public_id: (req, file) => file.originalname.split('.')[0], // Nombre del archivo
    },
});

// Configurar multer
const upload = multer({storage });


const aprendizController = {

    crear: async (req, res) => {
        try {

            const { documento, nombre, telefono, email, id_ficha } = req.body;
            const firma = req.file ? req.file.path : null;

            // Crea una nueva instancia de Aprendiz
            const nuevoAprendiz = new Aprendiz({
                documento, 
                nombre,
                telefono,
                email,
                id_ficha, 
                firma
            });

            // Guarda el aprendiz en la base de datos
            await nuevoAprendiz.save();
            res.json({ message: 'Aprendiz creado exitosamente', nuevoAprendiz });
        } catch (error) {
            res.status(400).json({ message: 'Error al crear aprendiz', error });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const aprendices = await Aprendiz.find()
                .populate({ path: 'id_ficha' })
                .exec()
            res.json(aprendices);
        } catch (error) {
            console.error('Error al obtener los aprendices:', error);
            res.status(500).json({ error: 'Error al obtener los aprendices' });
        }
    },
    listarFicha: async (req, res) => {
        const id_ficha = req.params.id_ficha;
        try {
            const aprendices = await Aprendiz.find({ id_ficha });
            res.json(aprendices);
        } catch (error) {
            console.error('Error al obtener los aprendices:', error);
            res.status(500).json({ error: 'Error al obtener los aprendices' });
        }
    },
    listarCC: async (req, res) => {
        const documento = req.params.documento;
        try {
            const aprendiz = await Aprendiz.findOne({ documento });
            if (!aprendiz) {
                return res.status(404).json({ msg: 'Aprendiz no encontrado' });
            }
            res.json(aprendiz);
        } catch (error) {
            console.error('Error al obtener el aprendiz:', error);
            res.status(500).json({ error: 'Error al obtener el aprendiz' });
        }
    },
    modificar: async (req, res) => {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const firma = req.file ? req.file.path : null;

        try {
            // Validar la unicidad de los datos antes de actualizar
            await validarUnicidadActualizacion(id, nuevosDatos);

            if (req.file) {
                const firmaImg = req.file.path; 
                nuevosDatos.firma = firmaImg; 
            }

            // Actualizar los datos del aprendiz
            const aprendizModificado = await Aprendiz.findByIdAndUpdate(id, nuevosDatos, { new: true });

            if (!aprendizModificado) {
                return res.status(404).json({ msg: 'Aprendiz no encontrado' });
            }

            // Responder con éxito
            res.json({ message: 'Datos del aprendiz modificados', aprendiz: aprendizModificado });
        } catch (error) {
            console.error('Error al modificar los datos del aprendiz:', error);
            res.status(500).json({ error: 'Error al modificar los datos del aprendiz' });
        }
    },

    activar: async (req, res) => {
        const id = req.params.id; // Asegúrate de que la ruta esté configurada para recibir `id` en lugar de `_id`
        try {
            const aprendizActivo = await Aprendiz.findByIdAndUpdate(
                { _id: id }, // Filtro correcto para buscar por ID
                { estado: 1 },
                { new: true }
            );
            if (!aprendizActivo) {
                return res.status(404).json({ msg: 'Aprendiz no encontrado' });
            }
            res.json({ message: 'Aprendiz activo', aprendiz: aprendizActivo });
        } catch (error) {
            console.error('Error al activar al aprendiz:', error);
            res.status(500).json({ error: 'Error al activar al aprendiz' });
        }
    },

    desactivar: async (req, res) => {
        const id = req.params.id; // Asegúrate de que la ruta esté configurada para recibir `id` en lugar de `_id`
        try {
            const aprendizInactivo = await Aprendiz.findByIdAndUpdate(
                { _id: id }, // Filtro correcto para buscar por ID
                { estado: 0 },
                { new: true }
            );
            if (!aprendizInactivo) {
                return res.status(404).json({ msg: 'Aprendiz no encontrado' });
            }
            res.json({ message: 'Aprendiz inactivo', aprendiz: aprendizInactivo });
        } catch (error) {
            console.error('Error al inactivar al aprendiz:', error);
            res.status(500).json({ error: 'Error al inactivar al aprendiz' });
        }
    }

};

module.exports = { aprendizController, upload };
