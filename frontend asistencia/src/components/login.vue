<template>
  <div class="wrapper">
    <q-card style="width: 400px; height: 600px;">
      <q-card-section class="header-section">
        <div class="text-h6 text-white text-center">
          <img src="../../public/imagenes/simg.png" class="logoSena" alt="">
        </div>
      </q-card-section>
      <div class="form-box login text-center">
        <h2>Login</h2>
        <q-form @submit.prevent="Login">
          <q-input class="q-mt-sm" outlined v-model="email" label="Correo Electrónico" lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor ingresa tu correo electrónico']" />
          <q-input outlined class="q-mt-md" v-model="password" label="Contraseña" :type="isPwd ? 'password' : 'text'"
            :rules="[val => val !== null && val !== '' || 'Por favor ingresa tu contraseña']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <div class="remember-forgot q-mt-md">
            <q-btn class="btn-green" type="submit" :loading="isLoading" label="INICIO DE SESIÓN"  unelevated :ripple="true" />
          </div>
          <q-btn class="btn-white" @click="redirectToRecoveryPage" label="¿Olvidaste tu contraseña?"  unelevated :ripple="true" />
        </q-form>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar';
import { useUsuariosStore } from '../stores/usuario.js';

const useUsuarios = useUsuariosStore();
const email = ref('');
const password = ref('');
const router = useRouter();
const $q = useQuasar();
const isPwd = ref(true);
const isLoading = ref(false);

const Login = async () => {
  if (!email.value || !password.value) {
    return; // Prevenir la ejecución si los campos están vacíos
  }
  
  isLoading.value = true; // Muestra el spinner
  try {
    const login = await useUsuarios.login(email.value, password.value);
    if (login) {
      router.push('/home');
    }
  } catch (error) {
    console.error("Error en el login:", error);
    $q.notify({
      type: 'negative',
      message: 'Error en el inicio de sesión. Por favor, revisa tus credenciales.'
    });
  } finally {
    isLoading.value = false; // Oculta el spinner
  }
};

const redirectToRecoveryPage = () => {
  router.push('/recuperarContraseña');
};
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: auto;
  padding-top: 25px;
}

h2 {
  color: rgb(44, 43, 43);
  font-size: 35px;
}

.btn-green {
  width: 60%;
  padding: 1px;
  font-size: 16px;
  margin-top: 5px;
  text-align: center;
height: 10px;
  background-color: rgb(11, 115, 2); 
  color: white;
  border: none;
  transition: box-shadow 0.3s ease;
}

.btn-green:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Sombra al pasar el mouse, sin cambiar el color */
  text-shadow: 0px 0px 10px white;
}

.btn-white {
  width: 70%;
  padding: -5px;
  font-size: 16px;
  height: 10px;
  margin-top: 20px;
  background-color: transparent; 
  color: rgb(0, 0, 0); 
  border: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding-top: 10px;
}

.btn-white::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0; 
  width: 80%;
  height: 2px;
  background-color: rgb(0, 115, 0);
  transition: transform 0.8s ease;
  transform: translateX(-50%) scaleX(1); 
  text-shadow: 0px 0px 10px rgb(0, 0, 0);
}

.btn-white:hover::after {
  transform: translateX(-50%) scaleX(0); 

}

.logoSena {
  width: 100px;
  height: 100px;
}

.form-box.login.text-center {
  padding: 15px;
}


.text-h6.text-white.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-green{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
  padding-top: 20px;
}

.header-section {
  background-color: green;
  margin-bottom: -5px;
  padding: 10px;
}
</style>
