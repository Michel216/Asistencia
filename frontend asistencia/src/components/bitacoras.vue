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

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <br>
      <div class="avatar-container">
        <q-avatar class="large-avatar">
          <img class="per" src="/imagenes/usuario.png" alt="perfil " />
        </q-avatar>
      </div>
      <div style="text-align: center; margin-top: 10px;">
        <p style="margin: 0;"> <strong>{{ nombreUser }}</strong></p>
        <p style="margin: 0;"> {{ emailUser }}</p>
      </div>
      <q-list>
        <br>
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
      <br>
      <div class="logon">
        <img class="negro" src="/imagenes/snegr.png" alt="">
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

        <!-- Diálogo para seleccionar fecha -->
        <q-dialog v-model="fechaFiltrada">
          <q-card>
            <q-card-section>
              <q-input filled v-model="selectedDate" label="Fecha (AAAA-MM-DD)" dense ref="dateInput" :error="showError"
                error-message="Por favor, ingrese la fecha" class="custom-error-message" @input="showError = false">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="selectedDate" locale="auto">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <br>
              <q-btn label="Previsualizar" color="green" @click="previsualizarDocumento" />
              <q-btn label="Cancelar" @click="fechaFiltrada = false" />
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
      <div class="footer">
          <div class="text-h7 text-weight-bold">
              ASISTENCIA SENA - Sena 2024 © Todos los derechos reservados
          </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBitacoraStore } from '../stores/bitacora.js';
import { Notify } from 'quasar';
import { useUsuariosStore } from '../stores/usuario.js';
import { useRoute, useRouter } from 'vue-router';

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
const useAsistencia = useAsistenciaStore();
const useBitacora = useBitacoraStore();
const showError = ref(false);


const menuItems = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Aprendices', path: '/aprendiz', icon: 'school' },
  { label: 'Bitacora', path: '/bitacora', icon: 'library_books' },
  { label: 'Fichas', path: '/ficha', icon: 'folder' },
  { label: 'Usuarios', path: '/usuario', icon: 'people' },
  { label: 'Registro Asistencia', path: '/registro', icon: 'assignment' }
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
    const res = await useAsistencia.listarTodos();
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

const previsualizarDocumento = () => {
  if (!selectedDate.value) {
    showError.value = true;
    return;
  }
  showError.value = false;
  const selectedDateObj = new Date(selectedDate.value);
  const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

  const filteredRows = rows.value.filter(row => {
    const rowDate = new Date(row.fecha);
    return rowDate >= startOfDay && rowDate <= endOfDay;
  });
  const Asistieron = filteredRows.filter(row => row.estado === 'Asistió');

  // Enviar los datos filtrados a la vista previa
  router.push({
    path: '/documento',
    query: { date: selectedDate.value, data: JSON.stringify(Asistieron) }
  });
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
  background-color: green;
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
.footer {
  background-color: #e7e3e3; /* Color de fondo del pie de página */
  color: #000; /* Color del texto del pie de página */
  margin-bottom: 0;
  width: 100%;
  height: 45px;
  position: sta;
  bottom: 0;
  align-content: center;
text-align: center;
}
</style>
