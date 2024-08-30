import { defineStore } from "pinia";
import axios from "axios";
import { useUsuariosStore } from './usuario.js';  // Importa la tienda

export const useFichaStore = defineStore("ficha", () => {
    const usuariosStore = useUsuariosStore();  // Crea una instancia de la tienda de usuarios

    const listarFicha = async () => {
        try {
            let r = await axios.get("http://localhost:3082/ficha", {
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
            let r = await axios.post("http://localhost:3082/ficha", 
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

    // Otros métodos...

    return {
        listarFicha,
        guardarFicha,
        // Otros métodos...
    };
});
