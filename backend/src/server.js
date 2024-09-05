const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.MONGO_URI=process.env.MONGO_URI
        this.paths = {
            aprendiz: '/aprendiz',
            bitacora: '/bitacora',
            ficha: '/ficha',
            usuario: '/usuario'
        };
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: [
                'https://asistencia-i7sv.onrender.com',
                'http://localhost:5173'
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'token']
        }));
        this.app.use(express.static('public'));
    }
    routes() {
        this.app.use(this.paths.aprendiz, require('./routers/aprendiz.js'));
        this.app.use(this.paths.bitacora, require('./routers/bitacora.js'));
        this.app.use(this.paths.ficha, require('./routers/ficha.js'));
        this.app.use(this.paths.usuario, require('./routers/usuario.js'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`El servidor está funcionando en el puerto ${this.port}`);
            mongoose.connect(this.MONGO_URI).then(() => console.log('Connected!'))
        });
    }
}
module.exports = Server