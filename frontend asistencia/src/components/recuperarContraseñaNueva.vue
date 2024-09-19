<template>
  <div class="recovery-wrapper">
    <div class="frente">
      <div class="cuerpo">
        <img class="rp" src="/imagenes/simg.png" alt="Logo SENA" />
      </div>

      <q-card-section>
        <h5>Restablecer Contraseña</h5>
        <q-form @submit.prevent="handlePasswordReset">
          <q-input v-model="newPassword" label="Nueva Contraseña" :type="isPwdNew ? 'password' : 'text'" outlined
            lazy-rules :rules="[val => val && val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres']"
            autocomplete="off">
            <template v-slot:append>
              <q-icon :name="isPwdNew ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="togglePasswordVisibility('new')" />
            </template>
          </q-input>

          <q-input v-model="confirmPassword" label="Confirmar Contraseña" :type="isPwd ? 'password' : 'text'" outlined
            lazy-rules :rules="[val => val && val.trim() !== '' || 'La contraseña debe coincidir']" autocomplete="off">
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
import { useUsuariosStore } from '../stores/usuario.js';
import { useRouter, useRoute } from 'vue-router';

const isPwd = ref(true);
const isPwdNew = ref(true);
const isLoading = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');

const useUsuario = useUsuariosStore();
const $q = useQuasar();
const router = useRouter();
const route = useRoute(); // Para obtener el token desde la URL

const togglePasswordVisibility = (type) => {
  if (type === 'new') {
    isPwdNew.value = !isPwdNew.value;
  } else if (type === 'confirm') {
    isPwd.value = !isPwd.value;
  }
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

  isLoading.value = true;

  try {
    const response = await useUsuario.restablecerContraseña(route.params.token, newPassword.value);
    if (response.status === 200) {
      $q.notify({
        message: 'Contraseña restablecida correctamente.',
        color: 'positive',
        icon: 'check',
      });
      router.push('/'); // Redirige al login
    } else {
      throw new Error('Error al restablecer la contraseña');
    }
  } catch (error) {
    $q.notify({
      message: 'Error al restablecer la contraseña.',
      color: 'negative',
      icon: 'error',
    });
  } finally {
    isLoading.value = false;
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