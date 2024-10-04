import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import axios from 'axios';
import { useQuasar } from 'quasar'
// import { cambiarContrasena } from '../../../backend asistencia/src/controllers/usuarios';


const API_URL = 'https://asistencia-backend-31lj.onrender.com';

// Definición de la tienda para el manejo de usuarios y token
export const useUsuariosStore = defineStore('usuario', () => {
    const token = ref("");
    const usuario = ref("");
    const loading = ref(false);
    const $q = useQuasar();


    const InfoUser = computed(() => {
        return usuario.value ? [usuario.value.nombre, usuario.value.email] : [];
    });

    const login = async (email, password) => {
        loading.value = true;
        try {
            const r = await axios.post(`${API_URL}/usuario/login`, { email, password });

            // Asignar el token y usuario a sus respectivas referencias
            token.value = r.data.token;
            usuario.value = r.data.usuario;

            // Notificar éxito
            Notify.create({
                type: 'positive',
                message: 'Inicio de sesión exitoso',
            });
            return true;
        } catch (error) {
            // Notificar error
            Notify.create({
                type: 'negative',
                message: `Error al iniciar sesión. Verifica el correo o la contraseña. `,
            });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const listarUsuarios = async () => {
        try {
            const r = await axios.get(`${API_URL}/usuario`, {
                headers: { "token": token.value }
            });
            return r;
        } catch (error) {
            console.error(error);
            Notify.create({
                type: 'negative',
                message: 'Error al listar usuarios',
            });
            return error;
        }
    };

    const guardarUsuario = async (email, nombre, password) => {
        try {
            const r = await axios.post(`${API_URL}/usuario`, { email, nombre, password }, {
                headers: { "token": token.value }
            });
            $q.notify({
                color: 'positive',
                icon: 'check',
                message: 'Usuario guardado correctamente'
            });
            return r;
        } catch (error) {
            console.error(error);
            $q.notify({
                color: 'negative',
                icon: 'error',
                message: 'Error al guardar el usuario'
            });
            return error;
        }
    };

    const solicitarRecuperacion = async (email) => {
        try {
            const response = await axios.post(`${API_URL}/usuario/enviarEmail/${email}`);
            $q.notify({
                message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.',
                color: 'positive',
                icon: 'check',
            });
            return response;
        } catch (error) {
            Notify.create({
                type: 'negative',
                message: 'Error al enviar el correo. Inténtalo de nuevo.',
                icon: 'error'
            });
            throw error;
        }
    };

    const restablecerContraseña = async (token, newPassword) => {
        try {
            const r = await axios.put(`${API_URL}/usuario/cambiarContrasena/${token}`, {
                newPassword: newPassword
            });
            $q.notify({
                color: 'positive',
                icon: 'check',
                message: 'Contraseña cambiada correctamente'
            });
            return r;
        } catch (error) {
            console.error(error);
            
            // Manejo de notificación para token expirado
            if (error.response && error.response.data.msg === 'El token ha expirado') {
                $q.notify({
                    color: 'negative',
                    icon: 'error',
                    message: 'El token ha expirado. Por favor, solicita un nuevo enlace de recuperación.'
                });
            } else {
                // $q.notify({
                //     color: 'negative',
                //     icon: 'error',
                //     message: 'Error al cambiar la contraseña'
                // });
                console.log("error")
            }
            
            return error;
        }
    };


    const modificarDatosUsuario = async (id, email, nombre) => {
        try {
            const response = await axios.put(`${API_URL}/usuario/modificar/${id}`, { email, nombre }, {
                headers: { "token": token.value },
            });
            $q.notify({
                color: 'positive',
                icon: 'check',
                message: 'Usuario editado correctamente'
            });
            return response;
        } catch (error) {
            $q.notify({
                color: 'negative',
                icon: 'error',
                message: 'Error al editar el usuario'
            });
            throw error;
        }
    };

    const activarUsuario = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/usuario/activar/${id}`, {}, {
                headers: { "token": token.value },
            });
            Notify.create({
                type: 'positive',
                icon:'check',
                message: 'Usuario activado con éxito',
            });
            return response;
        } catch (error) {
            console.error('Error al activar el usuario:', error);
            Notify.create({
                type: 'negative',
                message: 'Error al activar el usuario',
            });
            throw error;
        }
    };

    const desactivarUsuario = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/usuario/desactivar/${id}`, {}, {
                headers: { "token": token.value },
            });
            Notify.create({
                type: 'positive',
                icon:'check',
                message: 'Usuario desactivado con éxito',
            });
            return response;
        } catch (error) {
            console.error('Error al desactivar el usuario:', error);
            Notify.create({
                type: 'negative',
                message: 'Error al desactivar el usuario',
            });
            throw error;
        }
    }

    return {
        token,
        usuario,
        loading,
        login,
        restablecerContraseña,
        solicitarRecuperacion,
        modificarDatosUsuario,
        listarUsuarios,
        activarUsuario,
        desactivarUsuario,
        guardarUsuario,
        InfoUser
    };
}, { persist: true });
