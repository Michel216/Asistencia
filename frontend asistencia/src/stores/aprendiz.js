import { defineStore } from "pinia";
import axios from "axios";
import { useUsuariosStore } from './usuario.js';  // Importa la tienda de usuarios

export const useAprendizStore = defineStore("aprendiz", () => {
    // Obtener la tienda de usuarios para usar el token
    const usuariosStore = useUsuariosStore();

    // Función para listar aprendices
    const listarAprendiz = async () => {
        console.log("Función listarAprendiz ejecutada"); // Para confirmar ejecución
        console.log("Token actual:", usuariosStore.token); // Verifica el token
        
        if (!usuariosStore.token) {
            console.error("Token no definido en usuariosStore");
            return; // O maneja el error de acuerdo a tu lógica
        }

        try {
            const r = await axios.get('http://localhost:3082/aprendiz', {
                headers: {
                    "token": usuariosStore.token,  // Accede al token desde la tienda
                }
            });
            console.log("Respuesta:", r); // Para verificar la respuesta
            return r;
        } catch (error) {
            console.error('Error al listar aprendices:', error);
        }
    };

    // Función para guardar un aprendiz
    const guardarAprendiz = async (documento, nombre, telefono, email, id_ficha) => {
        console.log("Función guardarAprendiz ejecutada", { documento, nombre, telefono, email, id_ficha });
        try {
            let r = await axios.post("http://localhost:3082/aprendiz", {
                documento,
                nombre,
                telefono,
                email,
                id_ficha
            }, {
                headers: {
                    "token": usuariosStore.token,  // Accede al token desde la tienda
                },
            });
            console.log("Respuesta de guardarAprendiz:", r);
            return r;
        } catch (error) {
            console.error('Error al guardar aprendiz:', error);
            return error;
        }
    };

    // Función para modificar un aprendiz
    const modificarAprendiz = async (id, documento, nombre, telefono, email, ficha) => {
        console.log("Función modificarAprendiz ejecutada", { id, documento, nombre, telefono, email, ficha });
        try {
            const res = await axios.put(`http://localhost:3082/aprendiz/modificar/${id}`, {
                documento,
                nombre,
                telefono,
                email,
                id_ficha: ficha
            }, {
                headers: {
                    "token": usuariosStore.token,  // Accede al token desde la tienda
                },
            });
            console.log("Respuesta de modificarAprendiz:", res);
            return res;
        } catch (error) {
            console.error('Error al modificar aprendiz:', error);
            return error;
        }
    };

    // Función para activar un aprendiz
    const activarAprendiz = async (id) => {
        console.log("Función activarAprendiz ejecutada con ID:", id);
        if (!id) {
            throw new Error('ID no proporcionado');
        }
        try {
            let r = await axios.put(`http://localhost:3082/aprendiz/activar/${id}`, {}, {
                headers: {
                    "token": usuariosStore.token, // Accede al token desde la tienda
                },
            });
            console.log("Respuesta de activarAprendiz:", r);
            return r;
        } catch (error) {
            console.error('Error en activarAprendiz:', error);
            throw error;  // Vuelve a lanzar el error para manejarlo en el frontend
        }
    };

    // Función para desactivar un aprendiz
    const desactivarAprendiz = async (id) => {
        console.log("Función desactivarAprendiz ejecutada con ID:", id);
        if (!id) {
            throw new Error('ID no proporcionado');
        }
        try {
            let r = await axios.put(`http://localhost:3082/aprendiz/desactivar/${id}`, {}, {
                headers: {
                    "token": usuariosStore.token, // Accede al token desde la tienda
                },
            });
            console.log("Respuesta de desactivarAprendiz:", r);
            return r;
        } catch (error) {
            console.error('Error en desactivarAprendiz:', error);
            throw error;  // Vuelve a lanzar el error para manejarlo en el frontend
        }
    };

    // Retorna todas las funciones disponibles en la tienda
    return {
        listarAprendiz,
        guardarAprendiz,
        modificarAprendiz,
        activarAprendiz,
        desactivarAprendiz
    };
});
