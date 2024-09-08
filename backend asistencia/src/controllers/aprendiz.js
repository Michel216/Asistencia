

const Aprendiz = require('../modelos/aprendiz');
const { validarCCUnico } = require('../helpers/aprendiz');

const aprendizController = {

    crear: async (req, res) => {
        try {
            const { documento, nombre, telefono, email, id_ficha } = req.body;
            await validarCCUnico(documento);

            const nuevoAprendiz = new Aprendiz({ documento, nombre, telefono, email, id_ficha });
            await nuevoAprendiz.save();
            res.json({ message: 'Aprendiz creado', aprendiz: nuevoAprendiz });
        } catch (error) {
            console.error('Error al crear aprendiz:', error);
            res.status(500).json({ error: 'Error al crear aprendiz' });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const aprendices = await Aprendiz.find()
            .populate({path: 'id_ficha'})
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
        const id = req.params._id;
        const nuevosDatos = req.body;
        try {
            const aprendizModificado = await Aprendiz.findOneAndUpdate( id , nuevosDatos, { new: true });
            if (!aprendizModificado) {
                return res.status(404).json({ msg: 'Aprendiz no encontrado' });
            }
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

module.exports = aprendizController;
