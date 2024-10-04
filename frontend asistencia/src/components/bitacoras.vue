<template>
  <q-layout view="hHh lpR lFf">
    <!-- Encabezado y menú lateral -->
    <q-header elevated class="bg-green text-white">
      <q-toolbar style="background-color: green;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Asistencia</q-toolbar-title>
        <q-item to="/" active-class="q-item--active" class="salida">
          <q-item-section avatar>
            <q-btn dense flat round icon="logout" />
          </q-item-section>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered class="my-drawer" :breakpoint="500">
      <div class="avatar-container">
        <q-avatar class="large-avatar">
          <img class="per" src="/imagenes/usuario.png" style=" margin-top: 15%;" alt="perfil" />
        </q-avatar>
      </div>
      <div class="user-info">
        <p class="user-name">{{ nombreUser }}</p>
        <p class="user-email">{{ emailUser }}</p>
      </div>
      <q-list class="drawer-list">
        <q-item v-for="item in menuItems" :key="item.label" :to="item.path" exact-active-class="active-item"
          class="custom-button">
          <q-item-section avatar>
            <q-icon :name="item.icon" class="icon" />
          </q-item-section>
          <q-item-section>
            <span class="button-text">{{ item.label }}</span>
          </q-item-section>
          <q-item-section side v-if="isActiveRoute(item.path)">
            <q-icon name="arrow_right" class="indicator-icon" />
          </q-item-section>
        </q-item>
      </q-list>
      <div class="logon">
        <img class="negro" src="/imagenes/snegr.png" alt="" />
      </div>
    </q-drawer>

    <q-page-container>
      <h3 class="title-table">Bitacoras</h3>
      <hr id="hr" class="bg-green-9">
      <div class="fichas-container q-pa-md">
        <!-- Botones para generar documento y guardar estados -->
        <div class="btn">
          <q-btn icon="description" @click="openDateDialog" :loading="loadingGenerarDocumento" class="q-mr-xs">
            <q-tooltip anchor="bottom middle" self="top middle">Generar documento</q-tooltip>
          </q-btn>
        </div>

        <q-dialog v-model="fechaFiltrada">
          <q-card>
            <q-card-section class="vert" style="background-color: green; color:white">
              <div class="text-h6">Filtro Asistencia</div>
            </q-card-section>

            <q-separator />
            <q-card-section>
              <q-select  filled type="number" v-model="ficha" use-input input-debounce="0" label="Ficha"
                :options="options" @filter="filterFn"
                style="max-height: none; max-width: 100%; width: 100vw; margin: auto;" behavior="menu" emit-value
                map-options clearable lazy-rules :rules="[
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
                          <q-btn v-close-popup label="Aceptar" color="white" flat />
                        </div>
                      </q-date>
                    </div>
                  </q-popup-proxy>
                </template>
              </q-input>
              <br>
              <q-card-actions style="justify-content: center;" align="right">
                <q-btn label="Cancelar" icon="close"
                  style="background-color: white; color: black; box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);"
                  @click="fechaFiltrada = false" />
                <q-btn label="Visualizar" icon="visibility"
                  style="background-color: green; color: white; margin-left: 16px;" @click="previsualizarDocumento" />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-dialog>

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
      <!-- El footer -->
      <footer class="footer">
        <div class="text-h7 text-weight-bold">
          ASISTENCIA SENA - Sena 2024 © Todos los derechos reservados
        </div>
      </footer>
    </q-page-container>
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

.q-popup-proxy {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-overlay .q-overlay {
  background-color: rgb(0, 0, 0);
  /* Ajusta la opacidad aquí */
}

.main-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Ocupa el 100% del alto de la pantalla */
}

.container {
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
