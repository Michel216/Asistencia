import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import axios from 'axios';
const API_URL= 'https://asistencia-backend-31lj.onrender.com'

// Definición de la tienda para el manejo de usuarios y token
export const useUsuariosStore = defineStore('usuario', () => {
    const token = ref("");
    const usuario = ref("");
    const loading = ref(false);
    const InfoUser = ref("");

    const login = async (email, password) => {
        loading.value = true;
        try {
            const r = await axios.post(`${API_URL}/usuario/login`, {
                email,
                password,
            });

            // Asignar el token y usuario a sus respectivas referencias
            token.value = r.data.token;
            usuario.value = r.data.usuario;
            InfoUser.value = r.data.usuario.nombre;

            // Notificar éxito (puedes ajustar este mensaje según tu necesidad)
            Notify.create({
                type: `positive`,
                message: `Inicio de sesión exitoso`,
            });
            return true
        } catch (error) {
            // Notificar error
            Notify.create({
                type: `negative`,
                message: `Error al iniciar sesión: ` + (error.response?.data?.message || error.message),
            });
            return false
        } finally {
            loading.value = false;
        }
    };

    const listarUsuarios = async () => {
        try {
            let r = await axios.get(`${API_URL}/usuario`, {
                headers: {
                    "token": token.value,
                }

            });
            console.log(r);
            return r;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const guardarUsuario = async (email, nombre) => {
        try {
            let r = await axios.post(`${API_URL}/usuario`,
                {
                    email: email,
                    nombre: nombre,
                },
                {
                    headers: {
                        "token": token.value,
                    },
                }
            );
            Notify.create({
                type: `positive`,
                message: `Usuario creado con éxito`,
            });
            return r;
        } catch (error) {
            console.log(error);
            Notify.create({
                type: `negative`,
                message: `Error al crear el usuario`,
            });
            return error;
        }
    };

    const modificarUsuario = async (email, newPassword) => {
        try {
            const response = await axios.put(`${API_URL}/usuario/modificar/${email}`, {
                password: newPassword
            });
            return response;
        } catch (error) {
            throw error;
        }
    };
    const modificarDatosUsuario = async (id, email, nombre) => {
        try {
            const response = await axios.put(`${API_URL}/usuario/modificar/${id}`, {
                email: email,
                nombre: nombre
            },  {
                headers: {
                    "token": token.value,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const activarUsuario = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/usuario/activar/${id}`, {}, {
                headers: {
                    "token": token.value,
                }
            });
            Notify.create({
                type: `positive`,
                message: `Usuario activado con éxito`,
            });
            return response;
        } catch (error) {
            console.error(`Error al activar el usuario:`, error);
            Notify.create({
                type: `negative`,
                message: `Error al activar el usuario`,
            });
            throw error;
        }
    };

    const desactivarUsuario = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/usuario/desactivar/${id}`, {}, {
                headers: {
                    "token": token.value,
                }
            });
            Notify.create({
                type: `positive`,
                message: `Usuario desactivado con éxito`,
            });
            return response;
        } catch (error) {
            console.error(`Error al desactivar el usuario:`, error);
            Notify.create({
                type: `negative`,
                message: `Error al desactivar el usuario`,
            });
            throw error;
        }
    };

    return {
        token,
        usuario,
        loading,
        login,
        modificarUsuario,
        modificarDatosUsuario,
        listarUsuarios,
        activarUsuario,
        desactivarUsuario,
        guardarUsuario,
        InfoUser
    };
}, { persist: true });
