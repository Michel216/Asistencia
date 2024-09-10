const Bitacora = require('../modelos/bitacora');
const Aprendiz = require('../modelos/aprendiz');

const bitacoraController = {

    crear: async (req, res) => {
        try {
            const { id_aprendiz, fecha } = req.body;

            if (!id_aprendiz || !fecha) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const nuevaBitacora = new Bitacora({ id_aprendiz, fecha });
            const resultado = await nuevaBitacora.save();
            res.status(201).json(resultado);
        } catch (error) {
            console.error('Error al crear la bitacora:', error.message);
            res.status(500).json({ error: 'Error al crear la bitacora', details: error.message });
        }
    },

    listarTodos: async (req, res) => {
        try {
            const bitacoras = await Bitacora.find().sort({fecha: -1})
                .populate({
                    path: 'id_aprendiz', populate: {
                        path: 'id_ficha',
                    }
                })
                .exec();

            console.log('Bitacoras encontradas:', bitacoras); // Verifica el contenido aquí

            res.json(bitacoras);
        } catch (error) {
            console.error('Error al obtener las bitacoras:', error);
            res.status(500).json({ error: 'Error al obtener las bitacoras' });
        }
    },
    listarAprendiz: async (req, res) => {
        const { cc, fechaInicio, fechaFin } = req.body;

        try {
            const result = await Bitacora.aggregate([
                {
                    $lookup: {
                        from: 'aprendices',
                        localField: 'id_aprendiz',
                        foreignField: 'cc',
                        as: 'aprendiz'
                    }
                },
                {
                    $unwind: '$aprendiz'
                },
                {
                    $match: {
                        'aprendiz.cc': cc,
                        fecha: { $gte: fechaInicio, $lte: fechaFin }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id_aprendiz: 1,
                        fecha: 1,
                        aprendiz: {
                            id_ficha: 1,
                            cc: 1,
                            nombre: 1
                        }
                    }
                }
            ]);

            res.json(result);
        } catch (error) {
            console.error('Error al listar Bitacora por aprendiz:', error);
            res.status(500).json({ error: error.message });
        }
    },

    listarFicha: async (req, res) => {
        const { id_ficha, fechaInicio, fechaFin } = req.body;

        try {
            const result = await Bitacora.aggregate([
                {
                    $lookup: {
                        from: 'aprendices',
                        localField: 'id_aprendiz',
                        foreignField: 'id_ficha',
                        as: 'aprendiz'
                    }
                },
                {
                    $unwind: '$aprendiz'
                },
                {
                    $match: {
                        'aprendiz.id_ficha': id_ficha,
                        fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        id_aprendiz: 1,
                        fecha: 1,
                        aprendiz: {
                            id_ficha: 1,
                            cc: 1,
                            nombre: 1
                        }
                    }
                }
            ]);

            res.json(result);
        } catch (error) {
            console.error('Error al listar Bitacora por ficha:', error);
            res.status(500).json({ error: error.message });
        }

    },

    updateEstado: async (req, res) => {
        try {
            const { estado } = req.body;
            const { id } = req.params;
    
            console.log('Datos recibidos para actualización:', { id, estado });
    
            const bitacora = await Bitacora.findById(id);
    
            if (!bitacora) {
                console.log('Bitacora no encontrada para el ID:', id);
                return res.status(404).json({ message: 'Bitacora no encontrada' });
            }
    
            bitacora.estado = estado;
            await bitacora.save();
    
            res.status(200).json(bitacora);
        } catch (error) {
            console.error('Error al actualizar bitacora:', error);
            res.status(500).json({ message: 'Error al actualizar bitacora', errorDetail: error.message });
        }
    }
        
}
module.exports = bitacoraController;
