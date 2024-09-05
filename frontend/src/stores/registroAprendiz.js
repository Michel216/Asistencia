// stores/useAsistenciaStore.js
import { defineStore } from 'pinia';
import axios from "axios";
import { useUsuariosStore } from './usuario.js';

const API_URL= 'https://asistencia-i7sv.onrender.com'

export const useAsistenciaStore = defineStore('asistencia', () => {
  const useUsuarios = useUsuariosStore();


  const crear = async (id_aprendiz, fecha) => {
    try {
      let r = await axios.post(`${API_URL}/bitacora`, {
        id_aprendiz,
        fecha
      }, {
        headers: {
          "token": useUsuarios.token,  // Accede al token desde la tienda
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
    try {
      const r = await axios.get(`${API_URL}/bitacora`, {
        headers: {
          "token": useUsuarios.token,  // Accede al token desde la tienda
        }
      });

      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return {
    crear,
    listarTodos
  };
});
