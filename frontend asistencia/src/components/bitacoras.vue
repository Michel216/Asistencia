<template>
  <q-layout view="hHh lpR fFf">

    <h3 class="title-table">Bitacoras</h3>
    <hr id="hr" class="bg-green-9">
    <div class="fichas-container q-pa-md">

      <!-- Tabla de Bitácoras -->
      <q-table title="Bitacora" :rows="rows" :columns="columns" row-key="_id" style=" margin: auto 5% ">
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
            <q-select filled v-model="props.row.estado" label="Estado" style="max-width: 300px;"
              :options="estadoOptions" emit-value map-options :loading="loadingButtons[props.row._id]"
              @update:model-value="updateEstado($event, props.row._id)" />
            <q-spinner v-if="props.row.loading" size="20px" color="primary" />
          </q-td>
        </template>
        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            {{ new Date(props.row.fecha).toLocaleString() }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBitacoraStore } from '../stores/bitacora.js';
import { Notify } from 'quasar';
import { useUsuariosStore } from '../stores/usuario.js';
import { useRoute, useRouter } from 'vue-router';
import { useFichaStore } from '../stores/ficha.js'


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
const useFicha = useFichaStore()
const options = ref([])
const showError = ref(false);
const ficha = ref()
const filteredRows = ref([]);



const menuItems = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Aprendices', path: '/aprendiz', icon: 'school' },
  { label: 'Bitacora', path: '/bitacora', icon: 'library_books' },
  { label: 'Fichas', path: '/ficha', icon: 'folder' },
  { label: 'Usuarios', path: '/usuario', icon: 'people' },
];

function isActiveRoute(path) {
  return route.path === path;
}

const estadoOptions = [
  { label: 'Asistió', value: 'Asistió' },
  { label: 'No Asistió', value: 'No Asistió' },
  { label: 'Excusa', value: 'Excusa' },
];

const columns = [
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'id_aprendiz.nombre' },
  { name: 'ficha', label: 'Ficha', align: 'left', field: 'id_aprendiz.id_ficha.codigo' },
  { name: 'estado', label: 'Estado', align: 'left', field: 'estado' },
  { name: 'fecha', label: 'Fecha', align: 'left', field: 'fecha' }
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const traer = async () => {
  try {
    const res = await useBitacora.listarTodos();
    rows.value = res.data.map(item => ({
      ...item,
      estado: item.estado || 'Pendiente',
      loading: false
    }));
  } catch (error) {
    console.error('Error al traer los datos:', error);
  }
};

const loadingButtons = ref({}); // Estado para manejar los spinners de carga


// Función para actualizar el estado
const updateEstado = async (newValue, id) => {
  loadingButtons.value[id] = true; // Activar spinner

  try {
    // Llamada a la API para actualizar el estado
    await useBitacora.updateEstado(id, newValue);

  } catch (error) {

    console.error('Error al actualizar el estado:', error);
  } finally {
    loadingButtons.value[id] = false; // Desactivar spinner
  }
};


const openDateDialog = () => {
  fechaFiltrada.value = true;
};
const filterFn = async (val, update) => {
  let res = await useFicha.listarFicha();
  if (val === '') {
    update(() => {
      options.value = res.data.map(ficha => ({
        label: ficha.codigo,
        value: ficha._id
      }));
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = res.data.map(ficha => ({
      label: ficha.codigo,
      value: ficha._id
    })).filter(option => option.label.toLowerCase().includes(needle));
  });
}
const previsualizarDocumento = async () => {
  if (!selectedDate.value) {
    showError.value = true;
    return;
  }
  showError.value = false;

  try {
    const selectedDateObj = new Date(selectedDate.value);

    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    const filteredRows = rows.value.filter(row => {
      const rowDate = new Date(row.fecha);
      return rowDate >= startOfDay && rowDate <= endOfDay;
    });

    const filtrarFichas = filteredRows.filter(row => {
      return row.id_aprendiz && row.id_aprendiz.id_ficha && row.id_aprendiz.id_ficha._id === ficha.value;
    });

    const Asistieron = filtrarFichas.filter(row => row.estado === 'Asistió');

    if (Asistieron.length === 0) {
      Notify.create({
        type: 'negative',
        message: 'No hay registros de asistencia para la fecha seleccionada.'
      });
      return;
    }

    router.push({
      path: '/documento',
      query: { date: selectedDate.value, data: JSON.stringify(Asistieron) }
    });
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: `Error: ${error.message}`
    });
  }
};

onMounted(() => {
  traer();
});
</script>


<style scoped>
/* Estilos */
.avatar-container {
  display: flex;
  justify-content: center;
}

.avatar-container .per {
  width: 100px;
  height: 100px;
}

.large-avatar {
  width: 110px;
  /* Ancho del avatar */
  height: 110px;
  /* Alto del avatar */
}

.large-avatar img {
  width: 100%;
  /* La imagen ocupa todo el avatar */
  height: 100%;
  /* La imagen ocupa todo el avatar */
}

.custom-button {
  margin-bottom: 10px;
}

.button-text {
  font-size: 16px;
}

.icon {
  color: white;
}

.logon {
  display: flex;
  justify-content: center;
}

.logon .negro {
  width: 100px;
  height: 100px;
}

.q-btn {
  transition: background-color 0.3s ease;
}

.active-item {
  background-color: #005500;
  /* Fondo más oscuro para la ventana activa */
  color: #ffffff;
  /* Cambia esto por el color que desees */
  font-weight: bold;
}

.q-btn:hover {


  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  /* Sombra al pasar el mouse, sin cambiar el color */
  text-shadow: 0px 0px 10px white;
  /* Color de hover para los botones fuera del menú lateral */
}

.q-mr-xs {
  background-color: green;
  color: #ffffff;
  margin-bottom: 20px;

}

.my-card {
  max-width: 900px;
  margin: 20px auto;
}

.custom-error-message .q-field__messages {
  color: red;
  /* Cambia el color del mensaje a tu preferencia */
}

.boton-flotante {
  position: fixed;
  bottom: 20px;
  left: 20px;
}

.title-table {
  margin-bottom: 0
}

.bg-green-9 {
  color: green;
  width: 70%;
  height: 3.5px;
  border-radius: 10px;
}

.btn {
  display: flex;
  justify-content: end;
  margin-right: 5%;
}

.q-dialog--fullscreen .q-card {
  max-width: 100%;
  height: 100vh;
  overflow-y: auto;
}

.table-cell {
  text-align: center;
  border: 1px solid #ddd;
  /* Bordes de las celdas */
}

.q-table__header th {
  border: 1px solid #ddd;
  /* Bordes exteriores del encabezado */
  border-right: none;
  /* Sin bordes interiores en el encabezado */
}

.q-table__header th:first-child {
  border-left: 1px solid #ddd;
  /* Borde izquierdo del encabezado */
}

.q-table__header th:last-child {
  border-right: 1px solid #ddd;
  /* Borde derecho del encabezado */
}


/* Asegúrate de que el calendario se centre correctamente */
.calendar-centered {
  display: flex;
  justify-content: center;
  align-items: center;

}

.calendar-centered .q-btn {
  background-color: green;
  color: white;
}

.calendar-centered .q-btn {
  background-color: green;
  color: white;
}


.q-popup-proxy {
  display: flex;
  justify-content: center;
  align-items: center;
}


.custom-overlay .q-overlay {
  background-color: rgb(0, 0, 0);
  /* Ajusta la opacidad aquí */
  background-color: rgb(0, 0, 0);
  /* Ajusta la opacidad aquí */
}


  .main-content {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* Ocupa el 100% del alto de la pantalla */
    min-height: 100vh;
    /* Ocupa el 100% del alto de la pantalla */
  }

  .container {
    flex-grow: 1;
    /* Permite que el contenido se expanda para empujar el footer hacia abajo */
    flex-grow: 1;
    /* Permite que el contenido se expanda para empujar el footer hacia abajo */
  }

  .footer {
    background-color: #e7e3e3;
    color: #000;
    padding: 15px 0;
    text-align: center;
    margin-top: auto;
    /* Esto fuerza al footer a estar en la parte inferior */
    margin-top: auto;
    /* Esto fuerza al footer a estar en la parte inferior */
    width: 100%;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr;
    }

    .footer {
      font-size: 14px;
    }
  }

  .q-date__header {
    background-color: #008000
  }
  </style>
