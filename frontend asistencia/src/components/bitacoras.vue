<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar style="background-color: green;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Asistencia
        </q-toolbar-title>

        <q-item to="/" active-class="q-item--active" class="salida">
          <q-item-section avatar>
          </q-item-section>
          <q-item-section>
            <q-btn dense flat round icon="logout" />
          </q-item-section>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- Contenido del drawer -->
      <br>
        <div class="avatar-container">
    <q-avatar>
      <img class="per" src="./usuario.png" alt="perfil " />
    </q-avatar>
  </div>
      <q-list>
        <br>
        <q-item to="/home" active-class="q-item--active" class="custom-button">
        <q-item-section avatar>
          <q-icon name="people" class="icon" />
        </q-item-section>
        <q-item-section>
          <span class="button-text">home</span>
        </q-item-section>
      </q-item>
       
             <q-item to="./Ficha" active-class="q-item--active" class="custom-button" >
        <q-item-section avatar>
          <q-icon name="people" class="icon" />
        </q-item-section>
        <q-item-section>
          
          <span class="button-text">Fichas</span>
        </q-item-section>
      </q-item>

         <q-item to="/usuario" active-class="q-item--active" class="custom-button">
        <q-item-section avatar>
          <q-icon name="people" class="icon" />
        </q-item-section>
        <q-item-section>
          <span class="button-text">Usuarios</span>
        </q-item-section>
      </q-item>


        <q-item to="/aprendiz" active-class="q-item--active" class="custom-button">
        <q-item-section avatar>
          <q-icon name="people" class="icon" />
        </q-item-section>
        <q-item-section>
          <span class="button-text">Aprendices</span>
        </q-item-section>
      </q-item>

       

        
      </q-list>
      <div class="logon">
      <img class="negro" src="./snegr.png" alt="">
    </div>
    </q-drawer>

     <q-page-container>
      <div class="fichas-container q-pa-md">
        <div class="text-center">
          <h4>Bitacoras</h4>
        </div>
    

    <!-- Tabla para mostrar el registro específico -->
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
      <q-select
            filled
            v-model="estado"
            :options="estadoOptions"
            label="Estado"
            :dense="dense"
          />
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
import { ref, onMounted } from 'vue';
import { useAsistenciaStore } from '../stores/registroAprendiz.js';

const ficha = ref('');
const nombre = ref('');
const rows = ref([]);
const leftDrawerOpen = ref(false);
const useAsistencia = useAsistenciaStore();

const estadoOptions = [
  { label: 'No Asistido', value: 'no_asistido' },
  { label: 'Asistido', value: 'asistido' },
  { label: 'Excusa', value: 'excusa' },
  { label: 'Pendiente', value: 'pendiente' }
]
const HandleLogin = async () => {
  if (ficha.value && nombre.value) {
    await useAsistencia.crear(ficha.value, nombre.value);
    ficha.value = '';
    nombre.value = '';
    await traer();
  }
};

const traer = async () => {
  const res = await useAsistencia.listarTodos();
  rows.value = res.data;
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const columns = [
  { name: 'nombre', label: 'Nombre del Aprendiz', align: 'center' },
  { name: 'ficha', label: 'Nombre de la Ficha', align: 'center' },
  { name: 'fecha', label: 'Fecha', align: 'center' },
];

onMounted(traer);
</script>

<style>
.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.fichas-container {
  max-width: 1200px;
  margin: 0 auto;
}



.icon {
  color: white;
  height: 20px;
  margin-right: 10px;
}

.button-text {
  color: white;
}

.logon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.negro {
  width: 30%;
  height: 30%;
}
</style>

