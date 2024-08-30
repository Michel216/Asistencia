const Ficha = require('../modelos/ficha');
const { validarCodigoUnico } = require('../helpers/ficha');

const fichaController = {
    crear: async (req, res) => {
        const { codigo, nombre } = req.body;
        try {
            await validarCodigoUnico(codigo);
            const nuevoFicha = new Ficha({ codigo, nombre });
            await nuevoFicha.save();
            res.json({ message: 'Ficha creada' });
        } catch (error) {
            console.error('Error al crear ficha:', error);
            res.status(500).json({ error: 'Error al crear ficha' });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const fichas = await Ficha.find();
            res.json(fichas);
        } catch (error) {
            console.error('Error al obtener las fichas:', error);
            res.status(500).json({ error: 'Error al obtener las fichas' });
        }
    },
    modificar: async (req, res) => {
        const id = req.params._id;

        const nuevosDatos = req.body;
        try {
            const fichaModificada = await Ficha.findByIdAndUpdate(id, nuevosDatos, { new: true });
            if (!fichaModificada) {
                return res.status(404).json({ message: 'Ficha no encontrada' });
            }
            res.json({ message: 'Datos de la ficha modificados', fichaModificada });
        } catch (error) {
            console.error('Error al modificar los datos de la ficha:', error);
            res.status(500).json({ error: 'Error al modificar los datos de la ficha' });
        }

    },

        activar: async (req, res) => {
            const codigo = req.params.codigo;
            try {
                const fichaActiva = await Ficha.findOneAndUpdate({ codigo }, { estado: 1 }, { new: 1 });
                res.json({ message: 'Ficha activada', fichaActiva });
            } catch (error) {
                console.error('Error al activar la ficha:', error);
                res.status(500).json({ error: 'Error al activar la ficha' });
            }
        },
            inactivar: async (req, res) => {
                const codigo = req.params.codigo;
                try {
                    const fichaInactiva = await Ficha.findOneAndUpdate({ codigo }, { estado: 0 }, { new: 1 });
                    res.json({ message: 'Ficha inactivada' });
                } catch (error) {
                    console.error('Error al inactivar la ficha:', error);
                    res.status(500).json({ error: 'Error al inactivar la ficha' });
                }
            }
    };

    module.exports = fichaController;
