<template>
  <q-layout view="hHh lpR lFf">
    <!-- Encabezado y menú lateral -->
    <q-header elevated class="bg-green text-white">
      <q-toolbar style="background-color: green;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Asistencia</q-toolbar-title>
        <q-item to="/" active-class="q-item--active" class="salida">
          <q-item-section avatar></q-item-section>
          <q-item-section>
            <q-btn dense flat round icon="logout" />
          </q-item-section>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- Contenido del menú lateral -->
      <div class="avatar-container">
        <q-avatar>
          <img class="per" src="../../public/imagenes/usuario.png" alt="perfil" />
        </q-avatar>
      </div>
      <q-list>
        <!-- Enlaces de menú -->
        <q-item to="./home" active-class="q-item--active" class="custom-button">
          <q-item-section avatar>
            <q-icon name="home" class="icon" />
          </q-item-section>
          <q-item-section>
            <span class="button-text">Home</span>
          </q-item-section>
        </q-item>
        <!-- Otros enlaces de menú... -->
      </q-list>
      <div class="logon">
        <img class="negro" src="../../public/imagenes/snegr.png" alt="" />
      </div>
    </q-drawer>

    <q-page-container>
      <div class="fichas-container q-pa-md">
        <!-- Botones para generar documento y guardar estados -->
        <q-btn color="primary" icon="save" @click="guardarEstados" :loading="loadingGuardarEstados" class="q-mr-sm">
          <q-tooltip anchor="bottom middle" self="top middle">Guardar estados</q-tooltip>
        </q-btn>
        <q-btn color="secondary" icon="description" @click="openDateDialog" :loading="loadingGenerarDocumento">
          <q-tooltip anchor="bottom middle" self="top middle">Generar documento</q-tooltip>
        </q-btn>

        <!-- Diálogo para seleccionar fecha -->
        <q-dialog v-model="fechaFiltrada">
          <q-card>
            <q-card-section>
              <q-input filled v-model="selectedDate" label="Fecha (AAAA-MM-DD)" dense>
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
            </q-card-section>
            <q-card-actions>
              <q-btn color="primary" label="Previsualizar" @click="previsualizarDocumento" />
              <q-btn color="secondary" label="Cancelar" @click="fechaFiltrada = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Vista previa del documento generado -->
        <q-dialog v-model="mostrarDialogo">
          <q-card>
            <q-card-section>
              <h5>Vista Previa</h5>
              <div ref="tableContainer">
                <q-table :rows="rowsFiltrados" :columns="columns" row-key="_id">
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
                      {{ props.row.estado }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-fecha="props">
                    <q-td :props="props">
                      {{ new Date(props.row.fecha).toLocaleString() }}
                    </q-td>
                  </template>
                </q-table>
              </div>
            </q-card-section>
            <q-card-actions>
              <q-btn color="secondary" @click="generarPdf" :loading="loadingGenerarPdf">Generar PDF</q-btn>
              <q-btn flat @click="mostrarDialogo = false">Cerrar</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Tabla de Bitácoras -->
        <q-table :rows="rows" :columns="columns" row-key="_id">
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
              <q-select v-model="props.row.estado" :options="estadoOptions" label="Seleccionar estado" filled dense
                emit-value map-options @input="(value) => handleUpdateEstado(props.row._id, value)" />
            </q-td>
          </template>
          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              {{ new Date(props.row.fecha).toLocaleString() }}
            </q-td>
          </template>
        </q-table>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useAsistenciaStore } from '../stores/registroAprendiz.js';
import { useBitacoraStore } from '../stores/bitacora.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const rows = ref([]);
const rowsFiltrados = ref([]);
const mostrarDialogo = ref(false);
const leftDrawerOpen = ref(false);
const fechaFiltrada = ref(false);
const selectedDate = ref(null);
const loadingGuardarEstados = ref(false);
const loadingGenerarPdf = ref(false);
const loadingGenerarDocumento = ref(false);
const tableContainer = ref(null);
const useAsistencia = useAsistenciaStore();
const useBitacora = useBitacoraStore();

const estadoOptions = [
  { label: 'Asistió ', value: 'Asistió ' },
  { label: 'Excusa', value: 'Excusa' },
  { label: 'Pendiente', value: 'Pendiente' }
];

const columns = [
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'id_aprendiz.nombre' },
  { name: 'ficha', label: 'Ficha', align: 'left', field: 'id_aprendiz.id_ficha.codigo' },
  { name: 'estado', label: 'Estado', align: 'left', field: 'estado' },
  { name: 'fecha', label: 'Fecha', align: 'left', field: 'fecha' }
];

const traer = async () => {
  try {
    const res = await useAsistencia.listarTodos();
    rows.value = res.data.map(item => ({
      ...item,
      estado: item.estado || 'Pendiente'
    }));
  } catch (error) {
    console.error('Error al traer los datos:', error);
  }
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleUpdateEstado = async (id, estado) => {
  try {
    await useBitacora.updateEstado(id, estado);
    await traer();
  } catch (error) {
    console.error('Error al manejar la actualización del estado:', error);
  }
};

const guardarEstados = async () => {
  loadingGuardarEstados.value = true;
  try {
    for (const row of rows.value) {
      if (row.estado) {
        await useBitacora.updateEstado(row._id, row.estado);
      }
    }
    console.log('Todos los estados han sido guardados exitosamente');
  } catch (error) {
    console.error('Error al guardar los estados:', error);
  } finally {
    loadingGuardarEstados.value = false;
  }
};

const openDateDialog = () => {
  fechaFiltrada.value = true;
};

const closeDatePicker = () => {
  fechaFiltrada.value = true;
};

const previsualizarDocumento = () => {
  if (!selectedDate.value) {
    console.warn('Debe seleccionar una fecha');
    return;
  }

  const selectedDateObj = new Date(selectedDate.value);
  const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

  const filteredRows = rows.value.filter(row => {
    const rowDate = new Date(row.fecha);
    return rowDate >= startOfDay && rowDate <= endOfDay;
  });

  const Asistió = filteredRows.filter(row => row.estado === 'Asistió ');

  if (Asistió.length === 0) {
    console.warn('No hay aprendices marcados como Asistió  para la fecha seleccionada');
    return;
  }

  rowsFiltrados.value = Asistió;
  mostrarDialogo.value = true;
};

const generarPdf = async () => {
  loadingGenerarPdf.value = true;

  await nextTick(); // Asegura que el DOM esté actualizado

  const container = tableContainer.value; // Usa la referencia correctamente

  if (!container) {
    console.error('No se encontró el contenedor de la tabla para generar el PDF.');
    loadingGenerarPdf.value = false;
    return;
  }

  html2canvas(container).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('documento.pdf');
    loadingGenerarPdf.value = false;
  }).catch(error => {
    console.error('Error al generar el PDF:', error);
    loadingGenerarPdf.value = false;
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
</style>
