import { defineStore } from 'pinia';
import axios from 'axios';
import { useUsuariosStore } from './usuario.js';  // Importa la tienda
import { ref } from 'vue';
import { useQuasar } from 'quasar'; // Importa useQuasar para notificaciones

const API_URL = 'https://asistencia-backend-31lj.onrender.com';

export const useBitacoraStore = defineStore('bitacora', () => {
  const usuariosStore = useUsuariosStore();
  const $q = useQuasar(); // Usa useQuasar para acceder a $q
  const rows = ref([]);

  const crear = async (id_aprendiz, fecha) => {
    if (!usuariosStore.token) {
      console.error('Token no definido en usuariosStore');
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
      });
      console.log(r);
      $q.notify({
        type: 'positive',
        message: 'Asistencia registrada con éxito',
        icon: 'check'
      });
      return r;
    } catch (error) {
      console.log(error);
      $q.notify({
        type: 'negative',
        message: 'Error al registrar la asistencia',
        icon: 'error'
      });
      return error;
    }
  };

  const listarTodos = async () => {

    try {
      if (!usuariosStore.token) {
        console.error('Token no definido en usuariosStore');
        return;
      }

      let r = await axios.get(`${API_URL}/bitacora`, {
        headers: {
          "token": usuariosStore.token,
        },
      });

      console.log('Respuesta:', r);
      return r;
    } catch (error) {
      console.error('Error al listar datos:', error);
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error al traer los datos.',
      });
      return error;
    }
  };

  const listarFichaFecha = async (idFicha, fecha) => {
    try {
      let r = await axios.post(`${API_URL}/bitacora/listarFichaHora`, {
         idFicha,
         fecha: new Date(fecha).toISOString()
      }, {
        headers: {
          "token": usuariosStore.token,
        },
      });
      console.log('Respuesta:', r);
      return r;
    } catch (error) {
      console.error('Error al listar datos:', error);
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error al traer los datos.',
      })
    }
  }

  const updateEstado = async (id, estado) => {
    console.log("id:", id, "estado:", estado);

    try {
      const response = await axios.put(`${API_URL}/bitacora/${id}`, { estado }, {
        headers: { 'token': usuariosStore.token }
      });
      $q.notify({
        color: 'positive',
        icon: 'check',
        message: 'Estado actualizado correctamente.',
        timeout: 900
      });
      return response;
    } catch (error) {
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error al actualizar el estado.',
        timeout: 900
      });
      return error;
    }
  };

  return {
    rows, crear, updateEstado, listarTodos, listarFichaFecha
  };
});
