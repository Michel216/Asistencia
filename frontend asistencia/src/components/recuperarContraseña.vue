<template>
  <div class="recovery-wrapper">
    <div class="frente">
      <div class="cuerpo">
        <img class="rp" src="/imagenes/simg.png" alt="Logo SENA" />
      </div>

      <q-card-section>
        <h5>Recuperar Contraseña</h5>
        <q-form @submit.prevent="handlePasswordReset">
          <q-input v-model="email" label="Correo Electrónico" outlined lazy-rules
            :rules="[val => val && val.trim() !== '' || 'Por favor ingresa tu correo electrónico']" />
          <q-input v-model="newPassword" label="Nueva Contraseña" :type="isPwdNew ? 'password' : 'text'" outlined
            lazy-rules :rules="[
               val => val && val.trim().length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
            ]" autocomplete="off">
            <template v-slot:append>
              <q-icon :name="isPwdNew ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="togglePasswordVisibility('new')" />
            </template>
          </q-input>

          <q-input v-model="confirmPassword" label="Confirmar Contraseña" :type="isPwd ? 'password' : 'text'" outlined
            lazy-rules :rules="[
              val => val && val.trim().length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
            ]" autocomplete="off">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="togglePasswordVisibility('confirm')" />
            </template>
          </q-input>
          <q-btn class="q-mt-md recovery-button" :disabled="isLoading" @click="handlePasswordReset">
            <template v-if="isLoading">
              <q-spinner size="20px" color="white" />
            </template>
            <template v-else>
              Restablecer Contraseña
            </template>
          </q-btn>
        </q-form>
      </q-card-section>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../stores/usuario.js';

const useUsuario = useUsuariosStore();
const isPwd = ref(true);
const isPwdNew = ref(true);
const isLoading = ref(false); // Estado para manejar la carga

const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const $q = useQuasar();
const router = useRouter();

const togglePasswordVisibility = (type) => {
  if (type === 'new') {
    isPwdNew.value = !isPwdNew.value;  // Alterna visibilidad para nueva contraseña
  } else if (type === 'confirm') {
    isPwd.value = !isPwd.value;  // Alterna visibilidad para confirmar contraseña
  }

  // Después de 3 segundos, oculta la contraseña de nuevo
  setTimeout(() => {
    if (type === 'new') {
      isPwdNew.value = true;
    } else if (type === 'confirm') {
      isPwd.value = true;
    }
  }, 3000);  // Cambia 3000 (3 segundos) al tiempo deseado
};
const handlePasswordReset = async () => {
  if (newPassword.value !== confirmPassword.value) {
    $q.notify({
      message: 'Las contraseñas no coinciden.',
      color: 'negative',
      icon: 'warning',
    });
    return;
  }

  isLoading.value = true; // Muestra el spinner

  try {
    const response = await useUsuario.modificarUsuario(email.value, newPassword.value);
    if (response.status === 200) {

      router.push('/'); // Redirige al login después de cambiar la contraseña
    } else {
      throw new Error('Error al actualizar la contraseña');
    }
  } catch (error) {

  } finally {
    isLoading.value = false; // Oculta el spinner
  }
};
</script>


<style scoped>
.recovery-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

.frente {
  width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  height: auto;
  margin-top: 20%;
}

.cuerpo {
  background-color: green;
  text-align: center;
  width: 400px;
  margin-left: -20px;
  margin-top: -20px;
  padding: 0px 0;
}

.rp {
  width: 80px;
  height: 90px;
}

.q-mt-md {
  width: 100%;
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  /* Transición para el hover */
}

.q-btn:disabled {
  background-color: green;
  cursor: not-allowed;
}

.recovery-button:hover {
  background-color: darkgreen;
  /* Color de fondo al pasar el ratón */
}
</style>
