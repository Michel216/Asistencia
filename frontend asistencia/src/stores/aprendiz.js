import { defineStore } from 'pinia';
import axios from 'axios';
import { useQuasar } from 'quasar';  // Importa useQuasar para las notificaciones
import { useUsuariosStore } from './usuario.js';

const API_URL = 'https://asistencia-backend-31lj.onrender.com';

export const useAprendizStore = defineStore('aprendiz', () => {
    const $q = useQuasar();
    const usuariosStore = useUsuariosStore();

    const listarAprendiz = async () => {
        console.log('Función listarAprendiz ejecutada');
        console.log(`Token actual:`, usuariosStore.token);

        try {
            let r = await axios.get(`${API_URL}/aprendiz`, {
                headers: { "token": usuariosStore.token },
            });
            console.log(r);
            return r;
        } catch (error) {
            console.error('Error al listar aprendices:', error);
            $q.notify({
                color: 'negative',
                icon: 'error',
                message: 'Error al listar los aprendices'
            });
            return error;
        }
    };

    const guardarAprendiz = async (documento, nombre, telefono, email, id_ficha, firma) => {
        try {
            let formData = new FormData();
            formData.append('documento', documento.value);
            formData.append('nombre', nombre.value);
            formData.append('telefono', telefono.value);
            formData.append('email', email.value);
            formData.append('ficha', id_ficha.value);
            formData.append('firma', firma.value);

            let r = await axios.post(`${API_URL}/aprendiz`, formData, {
                headers: {
                    "token": usuariosStore.token,
                    'Content-Type': 'multipart/form-data'
                },
            });
            $q.notify({
                color: 'positive',
                icon: 'check',
                message: 'Aprendiz guardado correctamente'
            });
            return r;
        } catch (error) {
            console.error('Error al guardar aprendiz:', error);
            $q.notify({
                color: 'negative',
                icon: 'error',
                message: 'Error al guardar el aprendiz'
            });
            return error;
        }
    };

const modificarAprendiz = async (id, documento, nombre, telefono, email, ficha, ) => {
    console.log(`Función modificarAprendiz ejecutada`, { id, documento, nombre, telefono, email, ficha });
    try {
        const res = await axios.put(`${API_URL}/aprendiz/modificar/${id}`, {
            documento, nombre, telefono, email, id_ficha: ficha
        }, {
            headers: { "token": usuariosStore.token },
        });
        $q.notify({
            color: 'positive',
            icon: 'check',
            message: 'Aprendiz editado correctamente'
        });
        return res;
    } catch (error) {
        console.error('Error al modificar aprendiz:', error);
        $q.notify({
            color: 'negative',
            icon: 'error',
            message: 'Error al editar el aprendiz'
        });
        return error;
    }
};

const activarAprendiz = async (id) => {
    console.log(`Función activarAprendiz ejecutada con ID:`, id);
    if (!id) {
        throw new Error('ID no proporcionado');
    }
    try {
        let r = await axios.put(`${API_URL}/aprendiz/activar/${id}`, {}, {
            headers: { "token": usuariosStore.token },
        });
        $q.notify({
            color: 'positive',
            icon: 'check',
            message: 'Aprendiz activo'
        });
        return r;
    } catch (error) {
        console.error('Error en activarAprendiz:', error);
        $q.notify({
            color: 'negative',
            icon: 'error',
            message: 'Error al activar aprendiz'
        });
        throw error;
    }
};

const desactivarAprendiz = async (id) => {
    console.log(`Función desactivarAprendiz ejecutada con ID:`, id);
    if (!id) {
        throw new Error('ID no proporcionado');
    }
    try {
        let r = await axios.put(`${API_URL}/aprendiz/desactivar/${id}`, {}, {
            headers: { "token": usuariosStore.token },
        });
        $q.notify({
            color: 'positive',
            icon: 'check',
            message: 'Aprendiz inactivo'
        });
        return r;
    } catch (error) {
        console.error('Error en desactivarAprendiz:', error);
        $q.notify({
            color: 'negative',
            icon: 'error',
            message: 'Error al inactivar aprendiz'
        });
        throw error;
    }
};

return {
    listarAprendiz,
    guardarAprendiz,
    modificarAprendiz,
    activarAprendiz,
    desactivarAprendiz
};
    });
