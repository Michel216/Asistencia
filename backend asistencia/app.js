const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const fichaRouter = require('./src/routers/ficha.js');
const aprendizRouter = require('./src/routers/aprendiz.js');
const bitacoraRouter = require('./src/routers/bitacora.js');
const usuarioRouter = require('./src/routers/usuario.js');

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'https://asistencia-i7sv.onrender.com',
     'http://localhost:5173',
   '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(express.static('public'));

app.use('/ficha', fichaRouter);
app.use('/aprendiz', aprendizRouter);
app.use('/bitacora', bitacoraRouter);
app.use('/usuario', usuarioRouter);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error de conexión a MongoDB:', error);
  });
