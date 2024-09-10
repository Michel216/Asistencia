import { defineStore } from 'pinia';
import axios from 'axios';
import { useUsuariosStore } from './usuario.js';  // Importa la tienda
const API_URL= 'https://asistencia-backend-31lj.onrender.com'

export const useFichaStore = defineStore('ficha', () => {
    const usuariosStore = useUsuariosStore();  // Crea una instancia de la tienda de usuarios

    const listarFicha = async () => {
        console.log(`Función listarAprendiz ejecutada`); // Para confirmar ejecución
        console.log(`Token actual:`, usuariosStore.token); // Verifica el token

        try {
            let r = await axios.get(`${API_URL}/ficha`, {
                headers: {
                    "token": usuariosStore.token,  // Accede al token desde la tienda
                }
            });
            console.log(usuariosStore.token)

            console.log(r);
            return r;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const guardarFicha = async (codigo, nombre) => {
        try {
            let r = await axios.post(`${API_URL}/ficha`,
                {
                    codigo: codigo,
                    nombre: nombre,
                },
                {
                    headers: {
                        "token": usuariosStore.token,  // Accede al token desde la tienda
                    },
                }
            );
            console.log(r);
            return r;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    const modificarFicha = async (id, codigo, nombre) => {
        try {
            const r = await axios.put(`${API_URL}/ficha/modificar/${id}`, {
                codigo: codigo,
                nombre: nombre
            },  {
                headers: {
                    "token": usuariosStore.token,
                },
            });
            console.log(r);
            return r;
        } catch (error) {
            throw error;
        }
    };

    // Función para activar un aprendiz
    const activarFicha = async (id) => {
        console.log(`Función activarficha ejecutada con ID:`, id);
        if (!id) {
            throw new Error('ID no proporcionado');
        }
        try {
            let r = await axios.put(`${API_URL}/ficha/activar/${id}`, {}, {
                headers: {
                    "token": usuariosStore.token, // Accede al token desde la tienda
                },
            });
            console.log(`Respuesta de activarficha:`, r);
            return r;
        } catch (error) {
            console.error('Error en activarficha:', error);
            throw error;  // Vuelve a lanzar el error para manejarlo en el frontend
        }
    };

    // Función para desactivar un ficha
    const desactivarFicha = async (id) => {
        console.log(`Función desactivarficha ejecutada con ID:`, id);
        if (!id) {
            throw new Error('ID no proporcionado');
        }
        try {
            let r = await axios.put(`${API_URL}/ficha/desactivar/${id}`, {}, {
                headers: {
                    "token": usuariosStore.token, // Accede al token desde la tienda
                },
            });
            console.log(`Respuesta de desactivarficha:`, r);
            return r;
        } catch (error) {
            console.error('Error en desactivarficha:', error);
            throw error;  // Vuelve a lanzar el error para manejarlo en el frontend
        }
    };


    return {
        listarFicha,
        guardarFicha,
        modificarFicha,
        activarFicha,
        desactivarFicha
    };
});
