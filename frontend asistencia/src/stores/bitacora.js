import { defineStore } from `pinia`;
import axios from `axios`;
import { useUsuariosStore } from './usuario.js';  // Importa la tienda
import { ref } from 'vue';
API_URL= 'https://asistencia-backend-31lj.onrender.com'


export const useBitacoraStore = defineStore(`bitacora`, () => {
  const usuariosStore = useUsuariosStore();
  const rows = ref([]);
  const crear = async (id_aprendiz, fecha) => {
    if (!usuariosStore.token) {
      console.error(`Token no definido en usuariosStore`);
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
    console.log(`Función listarAprendiz ejecutada`); // Para confirmar ejecución
    console.log(`Token actual:`, usuariosStore.token); // Verifica el token
    try {
      if (!usuariosStore.token) {
        console.error(`Token no definido en usuariosStore`);
        return;
      }

      let r = await axios.get(`${API_URL}/bitacora`, {
        headers: {
          "token": usuariosStore.token,
        },
      });

      console.log(`Respuesta:`, r);
      return r;
    } catch (error) {
      console.error(`Error al listar aprendices:`, error);
      return error;
    }
  };
  // Actualizar el estado de un registro en el backend



  const updateEstado = async (id, estado) => {
    try {
      const response = await axios.put(`${API_URL}/bitacora/${id}`, { estado }, {
        headers: { 'token': usuariosStore.token }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      throw error;
    }
  };



  return {
    rows, crear, updateEstado, listarTodos
  };
})

