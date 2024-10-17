<template>
  <q-layout view="hHh lpR fFf">
    <h3 class="title-table">Informes</h3>
    <hr id="hr" class="bg-green-9">
    <div class="fichas-container q-pa-md">

      <!-- Carta de filtrado -->
      <div v-if="!hasFilteredData">
        <q-card class="my-card">
          <q-card-section>
            <h5>Filtrar Asistencias</h5>
            <q-select filled type="number" v-model="ficha" use-input input-debounce="0" label="Ficha" :options="options"
              @filter="filterFn" style="max-height: none; max-width: 100%; width: 100vw; margin: auto;" behavior="menu"
              emit-value map-options lazy-rules :rules="[ 
                (val) => {
                  if (b.value === false) {
                    return (val && val.length > 0) || 'Por favor, dígite el código de la ficha'
                  } else { return true }
                }
              ]">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input filled v-model="selectedDate" label="Fecha (AAAA-MM-DD)" dense ref="dateInput" :error="showError"
              error-message="Por favor, ingrese la fecha" class="custom-error-message" @input="handleInput">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" @click="showDatePicker" />
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="custom-overlay">
                  <div class="calendar-centered" style="width: 100%">
                    <q-date v-model="selectedDate" locale="auto">
                      <div class="row items-center justify-center">
                        <q-btn v-close-popup label="Aceptar" style="background-color: green; color: white"flat />
                      </div>
                    </q-date>
                  </div>
                </q-popup-proxy>
              </template>
            </q-input>
            <br>
            <q-card-actions style="justify-content: center;" align="right">
              <q-btn label="Cancelar" @click="fechaFiltrada = false" /> <span> </span>
              <q-btn label="Filtrar" style="background-color: green; color: white" @click="previsualizarDocumento" />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabla de Bitácoras -->
      <div v-if="hasFilteredData">
        <div class="btn">
        <q-btn icon="save" @click="imprimirDatos"  :loading="loadingGenerarDocumento" class="q-mr-xs">
          <q-tooltip style="float: right;" round anchor="bottom middle" self="top middle">Imprimir documento</q-tooltip>
        </q-btn>
      </div>
        <q-table title="Bitacora" :rows="filteredRows" :columns="columns" row-key="_id" style="margin: auto 5%">
          <template v-slot:body-cell-nombre="props">
            <q-td :props="props">
              {{ props.row.id_aprendiz ? props.row.id_aprendiz.nombre : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-ficha="props">
            <q-td :props="props">
              {{ props.row.id_aprendiz ? props.row.id_aprendiz.id_ficha.codigo : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              {{ props.row.estado || 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              {{ new Date(props.row.fecha).toLocaleString() }}
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBitacoraStore } from '../stores/bitacora.js';
import { Notify } from 'quasar';
import { useUsuariosStore } from '../stores/usuario.js';
import { useRoute, useRouter } from 'vue-router';
import { useFichaStore } from '../stores/ficha.js';

const { InfoUser } = useUsuariosStore();

const nombreUser = computed(() => InfoUser[0]);
const emailUser = computed(() => InfoUser[1]);

const rows = ref([]);
const leftDrawerOpen = ref(false);
const fechaFiltrada = ref(false);
const selectedDate = ref(null);
const router = useRouter();
const route = useRoute();
const loadingGuardarEstados = ref(false);
const loadingGenerarDocumento = ref(false);
const useBitacora = useBitacoraStore();
const useFicha = useFichaStore();
const options = ref([]);
const showError = ref(false);
const rowDate = ref("")
const ficha = ref();
const filteredRows = ref([]);
const showPrintTable = ref(false);
const Asistencia = ref("")

// Computed property to check if there are filtered data
const hasFilteredData = computed(() => filteredRows.value.length > 0);

// Botones y columnas
const columns = [
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'id_aprendiz.nombre' },
  { name: 'ficha', label: 'Ficha', align: 'left', field: 'id_aprendiz.id_ficha.codigo' },
  { name: 'estado', label: 'Estado', align: 'left', field: 'id_aprendiz.estado' },
  { name: 'fecha', label: 'Fecha', align: 'left', field: 'fecha' }
];

// Toggle para el drawer
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// Función para traer los datos
const traer = async () => {
  try {
    const res = await useBitacora.listarTodos();
    rows.value = res.data.map(item => ({ ...item }));
  } catch (error) {
    console.error('Error al traer los datos:', error);
  }
};


// Filtrar fichas
const filterFn = async (val, update) => {
  // Traer los datos de las fichas
  const res = await useFicha.listarFicha();
  
  // Asegúrate de que res.data contenga datos
  console.log(res.data);

  // Filtrar cuando la entrada está vacía
  if (val === '') {
    update(() => {
      options.value = res.data
        .filter(ficha => ficha.estado === "1") // Filtrar fichas activas (estado "1")
        .map(ficha => ({
          label: ficha.codigo,
          value: ficha._id
        }));
    });
    return;
  }

  // Filtrar según el valor ingresado
  update(() => {
    const needle = val.toLowerCase();
    options.value = res.data
      .filter(ficha => ficha.estado === "1" && ficha.codigo.toLowerCase().includes(needle)) // Filtrar fichas activas que coinciden con la búsqueda
      .map(ficha => ({
        label: ficha.codigo,
        value: ficha._id
      }));
  });
};


// Previsualizar documento
const previsualizarDocumento = async () => {
  if (!selectedDate.value || !ficha.value) {
    showError.value = true;
    return;
  }
  showError.value = false;

  try {
    const selectedDateObj = new Date(selectedDate.value);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    filteredRows.value = rows.value.filter(row => {
      const fechaRow = new Date(row.fecha);
      return fechaRow >= startOfDay && fechaRow <= endOfDay;
    });

    const filtrarFichas = filteredRows.value.filter(row => {
      return row.id_aprendiz && row.id_aprendiz.id_ficha && row.id_aprendiz.id_ficha._id === ficha.value;
    });
    const  Asistieron = filtrarFichas.filter(row => row.estado === 'Asistió');
    Asistencia.value= Asistieron

    if (Asistieron.length === 0) {
      Notify.create({
        type: 'negative',
        message: 'No hay registros de asistencia para la fecha seleccionada.'
      });
      return;
    }else{
      Notify.create({
        type: 'positive',
        message: 'Datos filtrados.'
      });
    }

    filteredRows.value = Asistieron; // Actualizar rows filtrados
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: `Error: ${error.message}`
    });
  }
};

const imprimirDatos = () => {

  // Redirigir a la ruta con los datos
  router.push({
    path: '/documento',
    query: { date: formatFecha(selectedDate.value), data: JSON.stringify(Asistencia.value) }
  });
};

function formatFecha(fecha) {
    const date = new Date(fecha);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);

    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    };

    return date.toLocaleString("es-ES", options);
}

// Inicializar al montar el componente
onMounted(() => {
  traer();
});


</script>

<style scoped>
.my-card {
  max-width: 300px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
}
.title-table {
  text-align: center;
  margin-top: 20px;
}
.custom-error-message {
  color: red;
}
.custom-overlay {
  background: white;
}
.calendar-centered {
  display: flex;
  justify-content: center;
}
.q-mr-xs{
background-color: green;
color: rgb(255, 255, 255);
}
</style>
