import { ref } from 'vue';
import { defineStore } from "pinia";
import { Notify } from 'quasar';
import axios from 'axios';

// Definición de la tienda para el manejo de usuarios y token
export const useUsuariosStore = defineStore("usuario", () => {
    const token = ref('');
    const usuario = ref('');
    const loading = ref(false);

    const login = async (email, password) => {
        loading.value = true;
        try {
            const r = await axios.post('http://localhost:3082/usuario/login', {
                email,
                password,
            });

            // Asignar el token y usuario a sus respectivas referencias
            token.value = r.data.token;
            usuario.value = r.data.usuario;

            // Notificar éxito (puedes ajustar este mensaje según tu necesidad)
            Notify.create({
                type: 'positive',
                message: 'Inicio de sesión exitoso',
            });

        } catch (error) {
            // Notificar error
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
            let r = await axios.get("http://localhost:3082/usuario", {
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
            let r = await axios.post("http://localhost:3082/usuario", 
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
            const response = await axios.put(`http://localhost:3082/usuario/modificar/${email}`, {
                password: newPassword
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const activarUsuario = async (id) => {
        try {
            let r = await axios.put(`http://localhost:3082/usuario/usuario/${id}`, {}, {
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
            let r = await axios.put(`http://localhost:3082/usuario/inactivar/${id}`, {}, {
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
