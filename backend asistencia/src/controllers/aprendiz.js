

const Aprendiz = require('../modelos/aprendiz.js');
const { validarCCUnico, validarUnicidadCreacion, validarUnicidadActualizacion } = require('../helpers/aprendiz.js');
const Ficha = require('../modelos/ficha.js')
const aprendizHelper = require('../helpers/aprendiz');

const aprendizController = {


    crear: async (req, res) => {
        try {
            // Validar unicidad de los campos antes de crear el aprendiz
            await aprendizHelper.validarUnicidadCreacion(req.body);
    
            // Crear el aprendiz si las validaciones son exitosas
            const { documento, nombre, telefono, email, id_ficha } = req.body;
            const nuevoAprendiz = new Aprendiz({ documento, nombre, telefono, email, id_ficha });
    
            await nuevoAprendiz.save();
            return res.json({ message: 'Aprendiz creado', aprendiz: nuevoAprendiz });
            
        } catch (error) {
            // Verificar si el error lanzado es personalizado (de las validaciones)
            if (error.message.includes('Ya existe un aprendiz')) {
                return res.status(400).json({ error: error.message });
            }
    
            // Para otros errores no controlados
            console.error('Error al crear aprendiz:', error);
            return res.status(500).json({ error: 'Error al crear aprendiz' });
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
        try {
            await validarUnicidadActualizacion(id, req.body);
            const aprendizModificado = await Aprendiz.findByIdAndUpdate(id, nuevosDatos, { new: true });
            if (!aprendizModificado) {
                return res.status(404).json({ msg: 'Aprendiz no encontrado' });
            }
            res.json({ message: 'Datos del aprendiz modificados', aprendiz: aprendizModificado });
        } catch (error) {
            if (error.message.includes('Ya existe un aprendiz')) {
                return res.status(400).json({ error: error.message });
            }
    
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
