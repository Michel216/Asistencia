// cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});

// Configuración de almacenamiento con multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Carpeta en Cloudinary donde se guardarán los archivos
        format: async (req, file) => 'png', // puedes elegir el formato aquí
        public_id: (req, file) => file.originalname.split('.')[0], // Nombre del archivo
    },
});

// Configurar multer
const upload = multer({ storage: storage });

export default upload;
