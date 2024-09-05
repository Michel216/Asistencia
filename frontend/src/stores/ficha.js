import { defineStore } from "pinia";
import axios from "axios";
import { useUsuariosStore } from './usuario.js';  // Importa la tienda

const API_URL= 'https://asistencia-backend-31lj.onrender.com'

export const useFichaStore = defineStore("ficha", () => {
    const usuariosStore = useUsuariosStore();  // Crea una instancia de la tienda de usuarios

    const listarFicha = async () => {
        try {
            let r = await axios.get(`${API_URL}/ficha`, {
                headers: {
                    "token": usuariosStore.token,  // Accede al token desde la tienda
                }
            });
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

    return {
        listarFicha,
        guardarFicha,
    };
});
