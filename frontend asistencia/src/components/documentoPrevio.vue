<template>
  <div>
    <div class="pdfBtn"> <q-btn class="Btn" style="background-color: green; color: white;" @click="generarPdf"
          :loading="loadingGenerarPdf">Generar PDF</q-btn>
        <q-btn dense flat round icon="arrow_back" @click="goHome" class="back-button" />
      </div>

    <div class="containerx">
      <div class="header">
        <h1>REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-</h1>
        <div class="date-section">
          <span>DEL DÍA </span>
          <span class="line">{{ dia }}</span>
          <span>DEL MES DE </span>
          <span class="line">{{ mes }}</span>
          <span>DEL AÑO </span>
          <span class="line">{{ año }}</span>
        </div>
      </div>

      <div class="objetivos">
          OBJETIVO(S): 
        </div>

      <table class="attendance-table" border="1">
        <thead>
          <tr>
            <th>N°</th>
            <th>No. DOCUMENTO</th>
            <th>NOMBRES Y APELLIDO</th>
            <th>PLANTA</th>
            <th>CONTRATISTA</th>
            <th>OTRO ¿CUÁL?</th>
            <th>DEPENDENCIA/EMPRESA</th>
            <th>CORREO ELECTRÓNICO</th>
            <th>TELÉFONO</th>
            <th>AUTORIZACIÓN GRABADA</th>
            <th>FIRMA O PARTICIPACIÓN VIRTUAL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rowsFiltrados" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ row.id_aprendiz ? row.id_aprendiz.documento : '' }}</td>
            <td>{{ row.id_aprendiz ? row.id_aprendiz.nombre : '' }}</td>
            <td>{{ row.planta }}</td>
            <td>{{ row.contratista }}</td>
            <td>{{ (row.id_aprendiz || row.contratista || row.dependencia_empresa || row.otro || row.autoriza_grabacion || row.firma_virtual) ? 'Aprendiz' : '' }}</td>
            <td>{{ (row.id_aprendiz || row.contratista || row.dependencia_empresa || row.otro || row.autoriza_grabacion || row.firma_virtual) ? 'SENA/CAT' : '' }}</td>
            <td>{{ row.id_aprendiz ? row.id_aprendiz.email : '' }}</td>
            <td>{{ row.id_aprendiz ? row.id_aprendiz.telefono : '' }}</td>
            <td>{{ row.autoriza_grabacion }}</td>
            <td>
              <img v-if="row.firma_virtual" :src="row.firma_virtual" alt="Firma del aprendiz" style="max-width: 100px; max-height: 50px;">
              <span v-else></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
const loadingGenerarPdf = ref(false);
const dia = ref("");
const mes = ref("");
const año = ref("");
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const dateQuery = route.query.date;
  const dataQuery = route.query.data;

  if (dateQuery) {
    const fecha = new Date(dateQuery);
    dia.value = fecha.getDate();
    mes.value = fecha.toLocaleString('default', { month: 'long' }).toUpperCase();
    año.value = fecha.getFullYear();
  }

  if (dataQuery) {
    rowsFiltrados.value = JSON.parse(dataQuery);
  }

  for (let i = 0; i < 8; i++) {
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

const generarPdf = async () => {
  loadingGenerarPdf.value = true;
  await nextTick();

  const doc = new jsPDF({
    orientation: 'landscape',
    // format: 'tabloid'
  });
  

  const headerText = `REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No- ${dia.value} ${mes.value} ${año.value}`;
  const objetivos= `OBJETIVO(S)`

  const pdfColumns = [
    { header: 'N°', dataKey: 'numero' },
    { header: 'Documento', dataKey: 'documento' },
    { header: 'Nombre', dataKey: 'nombre' },
    { header: 'Planta', dataKey: 'planta' },
    { header: 'Contratista', dataKey: 'contratista' },
    { header: 'Otro ¿Cual?', dataKey: 'otro' },
    { header: 'Dependencia/Empresa', dataKey: 'dependencia_empresa' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Teléfono', dataKey: 'telefono' },
    { header: 'Autoriza Grabación', dataKey: 'autoriza_grabacion' },
    { header: 'Firma o participacion virtual', dataKey: 'firma_virtual' }
  ];

  const pdfRows = rowsFiltrados.value.map((row, index) => ({
    numero: index + 1,
    documento: row.id_aprendiz ? row.id_aprendiz.documento : '',
    nombre: row.id_aprendiz ? row.id_aprendiz.nombre : '',
    planta: row.planta,
    contratista: row.contratista,
    otro: row.id_aprendiz ? (row.otro ? row.otro : 'Aprendiz'):'',  
    dependencia_empresa: row.id_aprendiz ? (row.dependencia_empresa ? row.dependencia_empresa : 'SENA/CAT'):'',  
    email: row.id_aprendiz ? row.id_aprendiz.email : '',
    telefono: row.id_aprendiz ? row.id_aprendiz.telefono : '',
    autoriza_grabacion: row.autoriza_grabacion,
    firma_virtual: row.firma_virtual
  }));

  doc.autoTable({
    head: [
      [{ content: headerText, colSpan: pdfColumns.length, styles: { halign: 'center', fontSize: 12 } }],
      [{ content: objetivos, colSpan: pdfColumns.length, styles: { halign: 'left', fontSize: 12 } }],
      pdfColumns.map(col => col.header)
    ],
    body: pdfRows.map(row => pdfColumns.map(col => row[col.dataKey])),
    startY: 30,
    theme: 'grid', // Cambia a 'plain' para un estilo sin color
    styles: {   fontSize: 10, // Reducimos el tamaño de la fuente para evitar el corte
      cellPadding: 2, // Reducimos el padding de las celdas para aprovechar espacio
     
      halign: 'center',
      valign: 'middle',
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.3,
      lineColor: [0, 0, 0]}, // Texto negro
    headStyles: {   fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.3,
      lineColor: [0, 0, 0]}, // Encabezado blanco y texto negro
    columnStyles: {
      numero: { cellWidth: 10 },
      documento: { cellWidth: 30 },
      nombre: { cellWidth: 40 },
      telefono: { cellWidth: 30 },
      email: { cellWidth: 50 }
    },
    tableWidth: 'auto',
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    didDrawPage: (data) => {
      doc.setFontSize(10);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, 270, 285); // Añadir el número de página
    }
  });

  doc.save('registro_asistencia.pdf');
  Notify.create({
    type: 'positive',
    message: 'PDF generado exitosamente',
    icon: 'check'
  });
  loadingGenerarPdf.value = false;
};

const goHome = () => {
  router.replace('/bitacora');
};
</script>

<style scoped>
.back-button {
  background-color: green;
  color: white;
  margin-left: 5%;
  padding: 10px;
}

.pdfBtn {
  display: flex;
  justify-content: flex-end;
  margin-right: 5%;
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
  width: 90px;
  border-bottom: 1px solid black;
  margin: 0 10px;
  text-align: center;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th, .attendance-table td {
 padding: 5px;
  /* text-align: center; */
  font-size: 12px;
}
.attendance-table th:nth-child(1),
        .attendance-table td:nth-child(1) {
            width: 50px; /* Ancho para la primera columna */
            text-align: center;
        }
        .attendance-table th:nth-child(2),
        .attendance-table td:nth-child(2) {
            width: 150px; /* Ancho para la segunda columna */
            text-align: center;
        }
        .attendance-table th:nth-child(3),
        .attendance-table td:nth-child(3) {
            width: 250px; /* Ancho para la tercera columna */
            text-align: center;
        }
        .attendance-table th:nth-child(4),
        .attendance-table td:nth-child(4) {
            width: 20px; /* Ancho para la tercera columna */
            text-align: center;
        }
        .attendance-table th:nth-child(5),
        .attendance-table td:nth-child(5) {
            width: 200px; /* Ancho para la tercera columna */
            text-align: center;
        }
        .attendance-table th:nth-child(6),
        .attendance-table td:nth-child(6) {
            width: 100px; /* Ancho para la tercera columna */
            text-align: center;
        }
        .attendance-table th:nth-child(7),
        .attendance-table td:nth-child(7) {
            width: 200px; /* Ancho para la tercera columna */
            text-align: center;
        }
        .attendance-table th:nth-child(8),
        .attendance-table td:nth-child(8) {
            width: 200px; /* Ancho para la tercera columna */
            text-align: center;
          
        }
        .attendance-table th:nth-child(9),
        .attendance-table td:nth-child(9) {
            width: 200px; /* Ancho para la tercera columna */
            text-align: center;
          }
          .attendance-table th:nth-child(10),
        .attendance-table td:nth-child(10) {
            width: 100px; /* Ancho para la tercera columna */
            text-align: center;
          }
          .attendance-table th:nth-child(11),
        .attendance-table td:nth-child(11) {
            width: 200px; /* Ancho para la tercera columna */
            text-align: center;
          }
        
.objetivos {
  border: 1px solid black; 
  padding: 10px;         
  margin-top: 20px;      
  font-size: 14px;       
  font-weight: bold;       }
</style>