<template>
  <q-layout view="hHh lpR lFf">
    <!-- Encabezado y menú lateral -->
    <q-header elevated class="bg-green text-white">
      <q-toolbar style="background-color: green;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Bitacoras</q-toolbar-title>
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
        <q-avatar>
          <img class="per" src="../../public/imagenes/usuario.png" alt="perfil " />
        </q-avatar>
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
        <img class="negro" src="../../public/imagenes/snegr.png" alt="">
      </div>
    </q-drawer>
    <q-page-container>
      <div class="fichas-container q-pa-md">
        <!-- Botones para generar documento y guardar estados -->
        <q-btn icon="save" @click="guardarEstados" :loading="loadingGuardarEstados" class="q-mr-xs">
          <q-tooltip anchor="bottom middle" self="top middle">Guardar estados</q-tooltip>
        </q-btn>
        <q-btn icon="description" @click="openDateDialog" :loading="loadingGenerarDocumento" class="q-mr-xs">
          <q-tooltip anchor="bottom middle" self="top middle">Generar documento</q-tooltip>
        </q-btn>

        <!-- Diálogo para seleccionar fecha -->
        <q-dialog v-model="fechaFiltrada">
          <q-card>
            <q-card-section>
              <q-input
          filled
          v-model="selectedDate"
          label="Fecha (AAAA-MM-DD)"
          dense
          ref="dateInput"
          :error="showError"
          error-message="Por favor, ingrese la fecha"
          class="custom-error-message"
          @input="showError = false" 
        >
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
        <q-btn 
          label="Previsualizar" 
          color="green" 
          @click="previsualizarDocumento" 
        />
        <q-btn  label="Cancelar" @click="fechaFiltrada = false" />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Vista previa del documento generado -->
        <q-dialog v-model="mostrarDialogo">
          <q-card>
            <q-card-section>
              <h5>RBitacora</h5>
              <q-table :rows="rowsFiltrados" :columns="columnsPDF" row-key="_id" ref="tableContainer"
                :rows-per-page-options="[0]" flat bordered>
                <template v-slot:body-cell-documento="props">
                  <q-td :props="props" class="table-cell">
                    {{ props.row.id_aprendiz ? props.row.id_aprendiz.documento : 'No disponible' }}
                  </q-td>
                </template>
                <template v-slot:body-cell-nombre="props">
                  <q-td :props="props" class="table-cell">
                    {{ props.row.id_aprendiz ? props.row.id_aprendiz.nombre : 'No disponible' }}
                  </q-td>
                </template>
                <template v-slot:body-cell-telefono="props">
                  <q-td :props="props" class="table-cell">
                    {{ props.row.id_aprendiz ? props.row.id_aprendiz.telefono : 'No disponible' }}
                  </q-td>
                </template>
                <template v-slot:body-cell-email="props">
                  <q-td :props="props" class="table-cell">
                    {{ props.row.id_aprendiz ? props.row.id_aprendiz.email : 'No disponible' }}
                  </q-td>
                </template>
                <template v-slot:body-cell-codigo_ficha="props">
                  <q-td :props="props" class="table-cell">
                    {{ props.row.id_aprendiz && props.row.id_aprendiz.id_ficha ? props.row.id_aprendiz.id_ficha.codigo :
                      'No disponible' }}
                  </q-td>
                </template>
                <template v-slot:body-cell-nombre_ficha="props">
                  <q-td :props="props" class="table-cell">
                    {{ props.row.id_aprendiz && props.row.id_aprendiz.id_ficha ? props.row.id_aprendiz.id_ficha.nombre :
                      'No disponible' }}
                  </q-td>
                </template>
              </q-table>
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
import 'jspdf-autotable';
import { Notify, QTooltip } from 'quasar';


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
const useFicha = useFichaStore();
const useBitacora = useBitacoraStore();
const showError = ref(false); 
import { useFichaStore } from '../stores/ficha.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
import 'jspdf-autotable';

const menuItems = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Aprendices', path: '/aprendiz', icon: 'school' },
  { label: 'Bitacora', path: '/bitacora', icon: 'library_books' },
  { label: 'Fichas', path: '/ficha', icon: 'folder' },
  { label: 'Usuarios', path: '/usuario', icon: 'people' },
  { label: 'Registro Asistencia', path: '/registro', icon: 'assignment' }
]
function isActiveRoute(path) {
  console.log(`Current Route: ${route.path}, Checking Path: ${path}`);
  return route.path === path;
}

const estadoOptions = [
  { label: 'Asistió', value: 'Asistió' },
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
    Notify.create({
      type: 'negative',
      message: 'Error al traer los datos.',
      position: 'top-right'
    });
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
    Notify.create({
      type: 'positive',
      message: 'Estado actualizado correctamente.',
      position: 'top-right'
    });
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al actualizar el estado.',
      position: 'top-right'
    });
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
    Notify.create({
      type: 'positive',
      message: 'Todos los estados han sido guardados exitosamente.',
      position: 'top-right'
    });
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al guardar los estados.',
      position: 'top-right'
    });
    console.error('Error al guardar los estados:', error);
  } finally {
    loadingGuardarEstados.value = false;
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

  const Asistió = filteredRows.filter(row => row.estado === 'Asistió');

  if (Asistió.length === 0) {
    Notify.create({
      type: 'warning',
      message: 'No hay aprendices marcados con Asistió para la fecha seleccionada.',
      position: 'top-right'
    });
    return;
  }

  rowsFiltrados.value = Asistió;
  mostrarDialogo.value = true;
};

const columnsPDF = [
  {
    name: 'numero',
    label: 'N°',
    align: 'center',
    field: row => rows.value.indexOf(row) + 1, // Esto te da el número de fila
  },
  { name: 'documento', label: 'Documento', align: 'center', field: 'id_aprendiz.documento' },
  { name: 'nombre', label: 'Nombre', align: 'center', field: 'id_aprendiz.nombre' },
  { name: 'telefono', label: 'Teléfono', align: 'center', field: 'id_aprendiz.telefono' },
  { name: 'email', label: 'Email', align: 'center', field: 'id_aprendiz.email' },
  { name: 'codigo_ficha', label: 'Código Ficha', align: 'center', field: 'id_aprendiz.id_ficha.codigo' },
  { name: 'nombre_ficha', label: 'Nombre Ficha', align: 'center', field: 'id_aprendiz.id_ficha.nombre' }
];

// Función para generar el PDF
const generarPdf = async () => {
  loadingGenerarPdf.value = true;

  await nextTick(); // Asegura que el DOM esté actualizado

  const doc = new jsPDF('l', 'mm', 'a4');;

  // Define las columnas para el PDF
  const pdfColumns = [
    { header: 'N°', dataKey: 'numero' }, // Columna de enumeración
    { header: 'Documento', dataKey: 'documento' },
    { header: 'Nombre', dataKey: 'nombre' },
    { header: 'Teléfono', dataKey: 'telefono' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Código Ficha', dataKey: 'codigo_ficha' },
    { header: 'Nombre Ficha', dataKey: 'nombre_ficha' }
  ];

  // Mapea los datos filtrados a un formato compatible con jsPDF
  const pdfRows = rowsFiltrados.value.map((row, index) => ({
    numero: index + 1, // Número de fila
    documento: row.id_aprendiz ? row.id_aprendiz.documento : 'No disponible',
    nombre: row.id_aprendiz ? row.id_aprendiz.nombre : 'No disponible',
    telefono: row.id_aprendiz ? row.id_aprendiz.telefono : 'No disponible',
    email: row.id_aprendiz ? row.id_aprendiz.email : 'No disponible',
    codigo_ficha: row.id_aprendiz && row.id_aprendiz.id_ficha ? row.id_aprendiz.id_ficha.codigo : 'No disponible',
    nombre_ficha: row.id_aprendiz && row.id_aprendiz.id_ficha ? row.id_aprendiz.id_ficha.nombre : 'No disponible'
  }));

  // Define el encabezado con "Registro de Asistencia" y la fecha

  const fecha = new Date(selectedDate.value);
  const dia = fecha.getDate();
  const mes = fecha.toLocaleString('default', { month: 'long' }).toUpperCase(); // Nombre completo del mes
  const año = fecha.getFullYear();
  const fechaTexto = `DEL DÍA ${dia} DEL MES DE ${mes} DEL AÑO ${año}`;
  const headerText = [`REGISTRO DE ASISTENCIA      ${fechaTexto}`];

  doc.autoTable({
    head: [
      [
        { content: headerText, colSpan: 7, styles: { halign: 'center', fontSize: 11, lineWidth: 0.3, lineColor: [0, 0, 0], cellPadding: 5, textColor: [0, 0, 0], fillColor: [255, 255, 255] } }
      ], ['N°', 'Documento', 'Nombre', 'Teléfono', 'Email', 'Código Ficha', 'Nombre Ficha']],
    startY: 40, // Ajusta la posición de inicio para la tabla
    columns: pdfColumns,
    body: pdfRows,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      halign: 'center',
      valign: 'middle',
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.3,
      lineColor: [0, 0, 0] // Solo bordes exteriores
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.3,
      lineColor: [0, 0, 0] // Solo bordes exteriores
    },
    tableWidth: 'auto', // Ajusta el ancho de la tabla automáticamente
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    didDrawCell: (data) => {
      if (data.column.index === 0) { // Si es la primera columna del encabezado
        doc.setDrawColor(0, 0, 0);
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height); // Dibuja el borde exterior
      }
    }
  });

  const nombreArchivo = `registro_asistencia_${año}-${mes}-${dia}.pdf`;

  doc.save(nombreArchivo);

  Notify.create({
    type: 'positive',
    message: 'PDF generado exitosamente.',
    position: 'top-right'
  });

  loadingGenerarPdf.value = false;
  mostrarDialogo.value = false;
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
  color: red; /* Cambia el color del mensaje a tu preferencia */
}
.boton-flotante {
  position: fixed;
  bottom: 20px;
  left: 20px;
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
</style>
