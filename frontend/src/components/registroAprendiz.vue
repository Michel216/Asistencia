<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <img src="../../public/imagenes/simg.png" alt="Logo SENA" />
      </div>
      <h5>Registro de Asistencia</h5>
      <q-form @submit.prevent="handleSubmit">
        <div class="form-group">
          <q-select
            filled
            v-model="model"
            use-input
            input-debounce="0"
            label="Escribe tu nombre"
            :options="options"
            @filter="filterFn"
            style="width: 250px"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <button type="submit" class="submit-button" :disabled="isLoading">
          <template v-if="isLoading">
            <q-spinner size="20px" color="white" />
          </template>
          <template v-else>
            Registrar
          </template>
        </button>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useAsistenciaStore } from '../stores/registroAprendiz.js';
import { useAprendizStore } from '../stores/aprendiz.js';
import Aprendiz from './aprendiz.vue';

const $q = useQuasar();
const model = ref(null);
const options = ref([]);
const isLoading = ref(false);

const useAsistencia = useAsistenciaStore();
const useAprendiz = useAprendizStore();

const filterFn = async (val, update) => {
  let res = await useAprendiz.listarAprendiz();
  if (val === '') {
    update(() => {
      options.value = res.data.map(aprendiz => ({
        label: aprendiz.documento,
        value: aprendiz._id
      }));
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = res.data.map(aprendiz => ({
      label: aprendiz.documento,
      value: aprendiz._id
    })).filter(option => option.label.toLowerCase().includes(needle));
  });
}

const handleSubmit = async () => {
  if (model.value) {
    isLoading.value = true;

    try {
  const creado=    await useAsistencia.crear(model.value, new Date().toISOString());
      console.log(creado);
      
      $q.notify({
        type: 'positive',
        message: 'Asistencia registrada con éxito',
      });

      // Actualizar la tabla o cualquier otro estado necesario
      await fetchRegistros();

      model.value = null;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al registrar la asistencia',
      });
    } finally {
      isLoading.value = false;
    }
  } else {
    $q.notify({
      type: 'negative',
      message: 'Aprendiz no encontrado',
    });
  }
};

// const fetchRegistros = async () => {
//   try {
//     const res = await useAsistencia.listarTodos();
//     rows.value = res.data || [];
//   } catch (error) {
//     console.error('Error al listar registros:', error);
//   }
// };

// Inicializa la lista de usuarios
filterFn('', () => {});
</script>

<style>
/* Estilos para el contenedor y los elementos del formulario */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.form-card {
  width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  height: 80%;
}

.form-header {
  background-color: green;
  text-align: center;
  width: 100%;
  padding: 10px 0;
}

.form-header img {
  width: 89px;
}

h5 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-top: 20px;
  margin-left: 50px;
  align-items: center;
}

.submit-button {
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
  margin-top: 20px;
}

.submit-button:disabled {
  background-color: darkgreen;
  cursor: not-allowed;
}
</style>
