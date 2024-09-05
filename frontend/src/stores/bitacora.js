import { defineStore } from "pinia";
import axios from "axios";
import { useUsuariosStore } from './usuario.js';  // Importa la tienda

const API_URL= 'https://asistencia-i7sv.onrender.com'

export const useBitacoraStore = defineStore("bitacora", () => {
    const usuariosStore = useUsuariosStore();

    const crear = async (id_aprendiz, fecha) => {
      if (!usuariosStore.token) {
        console.error("Token no definido en usuariosStore");
        return; // O maneja el error de acuerdo a tu lógica
      }
      
      try {
        let r = await axios.post(`${API_URL}/bitacora`, {
          id_aprendiz, 
          fecha
        }, {
          headers: {
            "token": usuariosStore.token,  // Accede al token desde la tienda
          }
        })
        console.log(r);
        return r;
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    
    const listarTodos = async () => {
      console.log("listarTodos se está ejecutando"); // Verifica si la función se ejecuta
      try {
        if (!usuariosStore.token) {
          console.error("Token no definido en usuariosStore");
          return;
        }
    
        let r = await axios.get(`${API_URL}/bitacora`, {
          headers: {
            "token": usuariosStore.token,
          },
        });
    
        console.log("Respuesta:", r);
        return r;
      } catch (error) {
        console.error("Error al listar aprendices:", error);
        return error;
      }
    };
      
    return {
      crear, listarTodos
    };
})

