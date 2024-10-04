<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <q-btn dense flat round icon="arrow_back" @click="goHome" class="back-button" />
        <img src="/imagenes/simg.png" alt="Logo SENA" />
      </div>
      <h5><strong>Registro de Asistencia</strong></h5>
      <q-form @submit.prevent="handleSubmit">
        <div class="form-group">
          <q-select clearable filled v-model="model" use-input input-debounce="0" label="Escribe tu documento" :options="options"
            @filter="filterFn" style="width: 250px" behavior="menu">
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
import { useBitacoraStore } from '../stores/bitacora.js';
import { useAprendizStore } from '../stores/aprendiz.js';
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const rows = ref([])
const $q = useQuasar();
const model = ref(null);
const options = ref([]);
const isLoading = ref(false);

const useBitacora = useBitacoraStore();
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
      // Enviar solo el valor (ObjectId)
      const creado = await useBitacora.crear(model.value.value, new Date().toISOString());

      // Revisa si la respuesta contiene los datos esperados
      console.log('creado', creado);


      // Actualizar la tabla o cualquier otro estado necesario
      await fetchRegistros();

      model.value = null;
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);

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

const fetchRegistros = async () => {
  try {
    const res = await useBitacora.listarTodos();
    rows.value = res.data;
  } catch (error) {
    console.error('Error al listar registros:', error);
  }
};

// Inicializa la lista de usuarios
filterFn('', () => { });

const goHome = () => {
  // Redirige a la página de inicio
  router.push('/home');
};
</script>

<style>
/* Estilos para el contenedor y los elementos del formulario */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  margin: auto auto
}

.form-card {
  margin: 8% auto;
  width: 400px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.331);
  background-color: white;
  height: 80%;
  border: none;
  border-radius: 10px;
}

.form-header {
  background-color: green;
  text-align: center;
  width: 100%;
  padding: 10px 0;
  position: relative;
  border-radius: 10px 10px 0px 0px;

}

.form-header img {
  width: 100px;
}

h5 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin: 30px 75px;
  width: 100%;
  align-items: center;
}

.submit-button {
  width: 80%;
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
  margin: 20px auto;

  transition: background-color 0.3s, box-shadow 0.3s;
}

.submit-button:hover {
  background-color: darkgreen;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;


}

.submit-button:disabled {
  background-color: darkgreen;
  cursor: not-allowed;
}

/* Estilo para el botón de regreso */
.back-button {
  position: absolute;
  left: 10px;
  top: 10px;
  color: white;
  background-color: transparent;
  transition: color 0.3s;
}

.back-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;


}
</style>
