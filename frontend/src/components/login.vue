<template>
  <div class="wrapper">
    <q-card style="width: 400px; height: 600px;">
      <q-card-section class="header-section">
        <div class="text-h6 text-white text-center">
          <img src="/public/imagenes/simg.png" class="logoSena" alt="">
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
            <button class="btn btn-green" type="submit">INICIO DE SESIÓN</button>
          </div>
          <button class="btn btn-white" @click="redirectToRecoveryPage">¿Olvidaste tu contraseña?</button>
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
    await useUsuarios.login(email.value, password.value);
    router.push('/home'); // Redirige a la ruta deseada
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
  height: 100vh;
  padding-top: 20px;
}

h2 {
  color: rgb(44, 43, 43);
  font-size: 35px;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 10px;
}

.btn-green {
  background-color: green;
  color: white;
  border: none;
}

.btn-white {
  background-color: white;
  color: green;
  border: none;
}

.btn-white a {
  color: green;
  text-decoration: none;
}

.btn-white::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: green;
  margin-top: 5px;
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

.header-section {
  background-color: green;
  margin-bottom: 20px;
  padding: 20px;
}
</style>
