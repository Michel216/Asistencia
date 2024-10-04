<template>
  <div>

    <q-card-section>

      <div class="pdfBtn"> <q-btn class="Btn" style="background-color: green; color: white;" @click="generarPdf"
          :loading="loadingGenerarPdf">Generar PDF</q-btn>
        <q-btn dense flat round icon="arrow_back" @click="goHome" class="back-button" />
      </div>
      <div class="containerx">
        <div class="header">
          <h1>REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-</h1>
          <div class="date-section">
            <span>DEL DÍA </span>
            <span class="line" style="text-align: center">{{ dia }}</span>
            <span>DEL MES DE </span>
            <span class="line" style="text-align: center;">{{ mes }}</span>
            <span>DEL AÑO  </span>
            <span class="line" style="text-align: center;">{{ año }}</span>
          
            
          </div>
        </div>
        <div class="objetivos">
          OBJETIVO(S):
        </div>
      </div>
      <q-table :rows="rowsFiltrados" :columns="columnsPDF" row-key="_id" ref="tableContainer" :pagination="pagination"
        flat bordered style="border: 1px solid #000;">
        <template v-slot:body-cell-documento="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.documento : '' }}
          </q-td>
        </template>
        <template v-slot:body-cell-nombre="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.nombre : '' }}
          </q-td>
        </template>
        <template v-slot:body-cell-telefono="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.telefono : '' }}
          </q-td>
        </template>
        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz ? props.row.id_aprendiz.email : '' }}
          </q-td>
        </template>
        <template v-slot:body-cell-codigo_ficha="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz && props.row.id_aprendiz.id_ficha ? props.row.id_aprendiz.id_ficha.codigo : '' }}
          </q-td>
        </template>
        <template v-slot:body-cell-nombre_ficha="props">
          <q-td :props="props">
            {{ props.row.id_aprendiz && props.row.id_aprendiz.id_ficha ? props.row.id_aprendiz.id_ficha.nombre : '' }}
          </q-td>
        </template>

        <template v-slot:body-cell-planta="props">
  <q-td :props="props">
    {{ props.row.id_aprendiz ? (props.row.planta ? props.row.planta : 'SENA CAT') : '' }}
  </q-td>
</template>
<template v-slot:body-cell-otro="props">
  <q-td :props="props">
    {{ props.row.id_aprendiz ? (props.row.otro ? props.row.otro : 'Aprendiz') : '' }}
  </q-td>
</template>
<template v-slot:body-cell-firma="props">
  <q-td :props="props">
    <img v-if="props.row.firma" :src="props.row.firma" alt="Firma" style="max-width: 100px; max-height: 50px;" />
    <img v-else-if="firmaPreview" :src="firmaPreview" alt="Firma" style="max-width: 100px; max-height: 50px;" />
    <span v-else>No disponible</span>
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
const dia = ref("")
const mes = ref("")
const año = ref("")

onMounted(() => {
  const dateQuery = route.query.date;
  const dataQuery = route.query.data;

  if (dateQuery) {
    selectedDate.value = dateQuery;
  }

  if (dataQuery) {
    rowsFiltrados.value = JSON.parse(dataQuery);
    const fecha = new Date(dateQuery);
    dia.value = fecha.getDate();
    mes.value = fecha.toLocaleString('default', { month: 'long' }).toUpperCase();
    año.value = fecha.getFullYear();
  }
  for (let i = 0; i < 5; i++) {
    rowsFiltrados.value.push({
      id_aprendiz: null,
      planta: '',
      otro: '',
      dependencia_empresa: '',
      contratista: '',
      autoriza_grabacion: '',
      firma_virtual: ''
    });
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
  return `${dia} ${mes}  ${año}`;
};
const columnsPDF = [
  { name: 'numero', label: 'N°', align: 'center', field: row => rowsFiltrados.value.indexOf(row) + 1 },
  { name: 'documento', label: 'Documento', align: 'center', field: 'id_aprendiz.documento' },
  { name: 'nombre', label: 'Nombre', align: 'center', field: 'id_aprendiz.nombre' },
  { name: 'telefono', label: 'Teléfono', align: 'center', field: 'id_aprendiz.telefono' },
  { name: 'email', label: 'Email', align: 'center', field: 'id_aprendiz.email' },
  { name: 'codigo_ficha', label: 'Código Ficha', align: 'center', field: 'id_aprendiz.id_ficha.codigo' },
  { name: 'nombre_ficha', label: 'Nombre Ficha', align: 'center', field: 'id_aprendiz.id_ficha.nombre' },
  { name: 'planta', label: 'Planta', align: 'center', field: 'id_aprendiz.id_ficha.planta' },
  { name: 'contratista', label: 'Contratista', align: 'center', field: 'contratista' },
  { name: 'otro', label: 'Otro ¿Cuál?', align: 'center', field: 'otro' },
  { name: 'dependencia_empresa', label: 'Dependencia/Empresa', align: 'center', field: 'dependencia_empresa' },
  { name: 'autoriza_grabacion', label: 'Autoriza Grabación', align: 'center', field: 'autoriza_grabacion' },
  { name: 'firma_virtual', label: 'Firma o Participación Virtual', align: 'center', field: 'firma_virtual' }

];

const generarPdf = async () => {
  loadingGenerarPdf.value = true;
  await nextTick(); // Asegura que el DOM esté actualizado

  const doc = new jsPDF({
  orientation: 'landscape', // Mantener orientación vertical
  
  format: 'tabloid' // Cambia esto a 'letter' o 'tabloid' si es necesario
});
  const pageHeight = doc.internal.pageSize.height;
  const startY = 30;

  const pdfColumns = [
    { header: 'N°', dataKey: 'numero' },
    { header: 'Documento', dataKey: 'documento' },
    { header: 'Nombre', dataKey: 'nombre' },
    { header: 'Teléfono', dataKey: 'telefono' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Código Ficha', dataKey: 'codigo_ficha' },
    { header: 'Nombre Ficha', dataKey: 'nombre_ficha' },
    { header: 'Planta', dataKey: 'planta' },
    { header: 'Contratista', dataKey: 'contratista' },
    { header: 'Otro ¿Cuál?', dataKey: 'otro' },
    { header: 'Dependencia/Empresa', dataKey: 'dependencia_empresa' },
    { header: 'Autoriza Grabación', dataKey: 'autoriza_grabacion' },
    { header: 'Firma o Participación Virtual', dataKey: 'firma_virtual' }
  ];

  const pdfRows = rowsFiltrados.value.map((row, index) => ({
    numero: index + 1,
    documento: row.id_aprendiz ? row.id_aprendiz.documento : '',  
    nombre: row.id_aprendiz ? row.id_aprendiz.nombre : '',        
    telefono: row.id_aprendiz ? row.id_aprendiz.telefono : '',    
    email: row.id_aprendiz ? row.id_aprendiz.email : '',          
    codigo_ficha: row.id_aprendiz && row.id_aprendiz.id_ficha ? row.id_aprendiz.id_ficha.codigo : '',
    nombre_ficha: row.id_aprendiz && row.id_aprendiz.id_ficha ? row.id_aprendiz.id_ficha.nombre : '',
    planta: row.id_aprendiz ? (row.planta ? row.planta : 'SENA CAT') : '', // Solo muestra "Sena Cat" si hay aprendiz
    contratista: row.contratista ? row.contratista : '',       
    otro: row.id_aprendiz ? (row.otro ? row.otro : 'Aprendiz'):'',                       
    dependencia_empresa: row.dependencia_empresa ? row.dependencia_empresa : '',
    autoriza_grabacion: row.autoriza_grabacion ? row.autoriza_grabacion : '',
    firma_virtual: row.firma_virtual ? row.firma_virtual : ''
}));


  // Define los estilos de las columnas
  const columnStyles = {
    numero: { cellWidth: 10 },
    documento: { cellWidth: 20 },
    nombre: { cellWidth: 40 },
    telefono: { cellWidth: 20 },
    email: { cellWidth: 50 },
    codigo_ficha: { cellWidth: 25 },
    nombre_ficha: { cellWidth: 40 },
    planta: { cellWidth: 25 },
    contratista: { cellWidth: 40 },
    otro: { cellWidth: 20 },
    dependencia_empresa: { cellWidth: 40 },
    autoriza_grabacion: { cellWidth: 35 },
    firma_virtual: { cellWidth: 45 }
  };

  const fechaTexto = formatFecha(selectedDate.value);
  const headerText = `REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-    ${fechaTexto}`;
  const objetivos= `OBJETIVO(S)`

  // Agregar encabezado y tabla
  doc.autoTable({
    head: [
      [
        { content: headerText, colSpan: 15, styles: { halign: 'center', fontSize: 11, textColor: [0, 0, 0] } }
        
      ],
      [
      { content: objetivos, colSpan: 15, styles: { halign: 'rigth', fontSize: 11, textColor: [0, 0, 0] } }
    ],
      ['N°', 'Documento', 'Nombre', 'Teléfono', 'Email', 'Código Ficha', 'Nombre Ficha', 'Planta', 'Contratista', 'Otro ¿Cuál?', 'Dependencia/Empresa', 'Autoriza Grabación', 'Firma o Participación Virtual']
    ],
    startY: startY,
    columns: pdfColumns,
    body: pdfRows,
    theme: 'grid',
    styles: {
      fontSize: 8, // Reducimos el tamaño de la fuente para evitar el corte
      cellPadding: 2, // Reducimos el padding de las celdas para aprovechar espacio
     
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
    columnStyles: columnStyles,
   
     tableWidth: 'auto',
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    didDrawPage: (data) => {
      doc.setFontSize(10);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, 270, 285); // Añadir el número de página
    }
  });

  const nombreArchivo = `registro_asistencia.pdf`;
  doc.save(nombreArchivo);

  Notify.create({
    type: 'positive',
    message: 'PDF generado exitosamente.',
    icon: 'check'
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

.containerx {
  border: 1px solid black;
  padding: 2px; 
  width: 100%;
  margin: 0 auto;
  margin-top: 50px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 50px;
 
  
}

.header h1 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.date-section {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.date-section span {
  margin: 0 5px;
}

.date-section .line {
  display: inline-block;
  width: 100px;
  border-bottom: 1px solid black;
  margin: 0 10px;
}
.objetivos {
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  border-top: 1px solid black;
  padding-top: 10px;
}
</style>