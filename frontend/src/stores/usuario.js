import { ref } from 'vue';
import { defineStore } from "pinia";
import { Notify } from 'quasar';
import axios from 'axios';

const API_URL= 'https://asistencia-backend-31lj.onrender.com'

export const useUsuariosStore = defineStore("usuario", () => {
    const token = ref('');
    const usuario = ref('');
    const loading = ref(false);

    const login = async (email, password) => {
        loading.value = true;
        try {
            const r = await axios.post(`${API_URL}/usuario/login`, {
                email,
                password,
            });

            token.value = r.data.token;
            usuario.value = r.data.usuario;

            Notify.create({
                type: 'positive',
                message: 'Inicio de sesión exitoso',
            });

        } catch (error) {
            Notify.create({
                type: 'negative',
                message: 'Error al iniciar sesión: ' + (error.response?.data?.message || error.message),
            });
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
                type: "positive",
                message: "Usuario creado con éxito",
            });
            return r;
        } catch (error) {
            console.log(error);
            Notify.create({
                type: "negative",
                message: "Error al crear el usuario",
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

    const activarUsuario = async (id) => {
        try {
            let r = await axios.put(`${API_URL}/usuario/usuario/${id}`, {}, {
                headers: {
                   "token": token.value,
                }
            });
            return r;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    const desactivarUsuario = async (id) => {
        try {
            let r = await axios.put(`${API_URL}/usuario/inactivar/${id}`, {}, {
                headers: {
                   "token": token.value,
                }
            });
            return r;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    return {
        token,
        usuario,
        loading,
        login,
        modificarUsuario,
        listarUsuarios,
        activarUsuario,
        desactivarUsuario,
        guardarUsuario
    };
},{persist:true});
