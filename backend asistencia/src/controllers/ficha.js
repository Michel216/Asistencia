const Ficha = require('../modelos/ficha');
const { validarCodigoUnico, validarUnicidadActualizacion } = require('../helpers/ficha');

const fichaController = {
    crear: async (req, res) => {
        const { codigo, nombre } = req.body;
        try {
            // Validar si el código ya existe
            await validarCodigoUnico(codigo);

            // Crear nueva ficha
            const nuevaFicha = new Ficha({ codigo, nombre });
            await nuevaFicha.save();
            res.status(201).json({ message: 'Ficha creada exitosamente' });
        } catch (error) {
            console.error('Error al crear ficha:', error);
            res.status(400).json({ error: error.message }); // Respuesta con el mensaje específico
        }
    },

    listarTodos: async (req, res) => {
        try {
            const fichas = await Ficha.find();
            res.json(fichas);
        } catch (error) {
            console.error('Error al obtener las fichas:', error);
            res.status(500).json({ error: 'Error interno al obtener las fichas' });
        }
    },

    modificar: async (req, res) => {
        const id = req.params.id;
        const nuevosDatos = req.body;

        try {
            // Validar si el código es único (si cambió)
            await validarUnicidadActualizacion(id, nuevosDatos);

            // Actualizar ficha
            const fichaModificada = await Ficha.findByIdAndUpdate(id, nuevosDatos, { new: true });
            if (!fichaModificada) {
                return res.status(404).json({ message: 'Ficha no encontrada' });
            }
            res.json({ message: 'Ficha modificada exitosamente', fichaModificada });
        } catch (error) {
            console.error('Error al modificar ficha:', error);
            res.status(400).json({ error: error.message }); // Mensaje de error más específico
        }
    },

    activar: async (req, res) => {
        const id = req.params.id;
        try {
            const fichaActiva = await Ficha.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!fichaActiva) {
                return res.status(404).json({ message: 'Ficha no encontrada' });
            }
            res.json({ message: 'Ficha activada exitosamente', fichaActiva });
        } catch (error) {
            console.error('Error al activar ficha:', error);
            res.status(500).json({ error: 'Error interno al activar la ficha' });
        }
    },

    desactivar: async (req, res) => {
        const id = req.params.id;
        try {
            const fichaInactiva = await Ficha.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!fichaInactiva) {
                return res.status(404).json({ message: 'Ficha no encontrada' });
            }
            res.json({ message: 'Ficha inactivada exitosamente', fichaInactiva });
        } catch (error) {
            console.error('Error al desactivar ficha:', error);
            res.status(500).json({ error: 'Error interno al desactivar la ficha' });
        }
    }
};

module.exports = fichaController;
