<template>
  <div class="recovery-wrapper">
    <div class="frente">
      <div class="cuerpo">
        <img class="rp" src="/imagenes/simg.png" alt="Logo SENA" />
      </div>

      <q-card-section>
        <h5>Recuperar Contraseña</h5>
        <q-form @submit.prevent="handleEmailSubmit">
          <q-input v-model="email" label="Correo Electrónico" outlined lazy-rules
            :rules="[val => val && val.trim() !== '' || 'Por favor ingresa tu correo electrónico']" />
          <q-btn class="q-mt-md recovery-button" :disabled="isLoading" @click="handleEmailSubmit">
            <template v-if="isLoading">
              <q-spinner size="20px" color="white" />
            </template>
            <template v-else>
              Enviar Correo
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

const email = ref('');
const isLoading = ref(false);
const useUsuario = useUsuariosStore();
const $q = useQuasar();

const handleEmailSubmit = async () => {
  if (!email.value.trim()) {
    $q.notify({
      message: 'Por favor ingresa un correo electrónico.',
      color: 'negative',
      icon: 'warning',
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await useUsuario.solicitarRecuperacion(email.value);

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
