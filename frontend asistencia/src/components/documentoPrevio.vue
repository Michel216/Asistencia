<template>
  <div>

    <q-card-section>

      <div class="pdfBtn"> <q-btn class="Btn" style="background-color: green; color: white;" @click="generarPdf"
          :loading="loadingGenerarPdf">Generar PDF</q-btn>
        <q-btn dense flat round icon="arrow_back" @click="goHome" class="back-button" />
      </div>

      <h5 style="margin-top: 0; margin-bottom: 0;"><strong>REGISTRO DE ASISTENCIA</strong> </h5>

      <div style="text-align: center;  margin-bottom: 20px" v-if="selectedDate" class="text-subtitle2">
        {{ formatFecha(selectedDate) }}
      </div>
      <q-table :rows="rowsFiltrados" :columns="columnsPDF" row-key="_id" ref="tableContainer" :pagination="pagination"
        flat bordered>
        <template v-slot:body-cell-documento="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.documento : 'No disponible' }}
          </q-td>
        </template>
        <template v-slot:body-cell-nombre="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.nombre : 'No disponible' }}
          </q-td>
        </template>
        <template v-slot:body-cell-telefono="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.telefono : 'No disponible' }}
          </q-td>
        </template>
        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.email : 'No disponible' }}
          </q-td>
        </template>
        <template v-slot:body-cell-codigo_ficha="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz && props.row.id_aprendiz.id_ficha ? props.row.id_aprendiz.id_ficha.codigo : 'No disponible' }}
          </q-td>
        </template>
        <template v-slot:body-cell-nombre_ficha="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz && props.row.id_aprendiz.id_ficha ? props.row.id_aprendiz.id_ficha.nombre : 'No disponible' }}
          </q-td>
        </template>
      </q-table>
    </q-card-section>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Notify } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
const tableContainer = ref(null);

const rowsFiltrados = ref([]);
const selectedDate = ref(null);
const loadingGenerarPdf = ref(false);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const dateQuery = route.query.date;
  const dataQuery = route.query.data;

  if (dateQuery) {
    selectedDate.value = dateQuery;
  }

  if (dataQuery) {
    rowsFiltrados.value = JSON.parse(dataQuery);
  }
});
const pagination = ref({
  page: 1,
  rowsPerPage: 0, // Establece 0 para mostrar todas las filas sin paginación
  rowsNumber: 0
});
const formatFecha = (date) => {
  const fecha = new Date(date);
  const dia = fecha.getDate();
  const mes = fecha.toLocaleString('default', { month: 'long' }).toUpperCase();
  const año = fecha.getFullYear();
  return `DEL DÍA ${dia} DEL MES DE ${mes} DEL AÑO ${año}`;
};
const columnsPDF = [
  { name: 'numero', label: 'N°', align: 'center', field: row => rowsFiltrados.value.indexOf(row) + 1 },
  { name: 'documento', label: 'Documento', align: 'center', field: 'id_aprendiz.documento' },
  { name: 'nombre', label: 'Nombre', align: 'center', field: 'id_aprendiz.nombre' },
  { name: 'telefono', label: 'Teléfono', align: 'center', field: 'id_aprendiz.telefono' },
  { name: 'email', label: 'Email', align: 'center', field: 'id_aprendiz.email' },
  { name: 'codigo_ficha', label: 'Código Ficha', align: 'center', field: 'id_aprendiz.id_ficha.codigo' },
  { name: 'nombre_ficha', label: 'Nombre Ficha', align: 'center', field: 'id_aprendiz.id_ficha.nombre' }
];

const generarPdf = async () => {
  loadingGenerarPdf.value = true;

  await nextTick(); // Asegura que el DOM esté actualizado

  const doc = new jsPDF('l', 'mm', 'a4');
  const pageHeight = doc.internal.pageSize.height; // Altura de la página
  const startY = 40; // Posición vertical inicial para la tabla
  const rowsPerPage = 20; // Número de filas por página

  // Define las columnas para el PDF
  const pdfColumns = [
    { header: 'N°', dataKey: 'numero' },
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

  let currentPage = 1;
  let startRow = 0;

  while (startRow < pdfRows.length) {
    // Define el encabezado para cada página
    const fechaTexto = formatFecha(selectedDate.value);
    const headerText = [`REGISTRO DE ASISTENCIA      ${fechaTexto}`];

    // Agrega el encabezado en la primera página
    if (currentPage === 1) {
      doc.text(headerText, 10, startY - 20); // Agregar encabezado en la parte superior
    }

    doc.autoTable({
      head: [
        [
          { content: headerText, colSpan: 7, styles: { halign: 'center', fontSize: 11, lineWidth: 0.3, lineColor: [0, 0, 0], cellPadding: 5, textColor: [0, 0, 0], fillColor: [255, 255, 255] } }
        ], ['N°', 'Documento', 'Nombre', 'Teléfono', 'Email', 'Código Ficha', 'Nombre Ficha']
      ],
      startY: startY,
      columns: pdfColumns,
      body: pdfRows.slice(startRow, startRow + rowsPerPage),
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        halign: 'center',
        valign: 'middle',
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.3,
        lineColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.3,
        lineColor: [0, 0, 0]
      },
      tableWidth: 'auto',
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      didDrawPage: (data) => {
        // Agrega el encabezado en cada página
        if (currentPage > 1) {
          doc.text(headerText, 10, startY - 20); // Agregar encabezado en la parte superior
        }
        doc.setFontSize(10);
        doc.text(`Page ${currentPage}`, 190, 285); // Añadir el número de página
        currentPage++;
      }
    });

    startRow += rowsPerPage; // Avanza al siguiente grupo de filas
    if (startRow < pdfRows.length) {
      doc.addPage(); // Agregar nueva página si hay más registros
    }
  }

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

const goHome = () => {
  // Redirige a la página de inicio
  router.replace('/bitacora');
};
</script>
<style scoped>
.back-button {
  background-color: green;
  margin-left: 5%;
  padding: 10px;
  color: white
}

.back-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;
}

.pdfBtn {
  display: flex;
  justify-content: end;
  margin-right: 5%
}

.Btn:hover {

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);

  font-weight: bold;
}

.q-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;

}
</style>