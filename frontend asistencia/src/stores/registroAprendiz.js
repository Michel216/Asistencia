// stores/useAsistenciaStore.js
import { defineStore } from 'pinia';
import axios from "axios";
import { useUsuariosStore } from './usuario.js';

export const useAsistenciaStore = defineStore('asistencia', () => {
  const useUsuarios = useUsuariosStore();


  const crear = async (id_aprendiz, fecha) => {
    try {
      let r = await axios.post("http://localhost:3082/bitacora", {
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
      const r = await axios.get('http://localhost:3082/bitacora', {
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
