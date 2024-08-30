<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar style="background-color: green;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Asistencia
        </q-toolbar-title>

        <q-item to="/" active-class="q-item--active" class="salida">
       
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
      <img class="per" src="/public/imagenes/usuario.png" alt="perfil " />
    </q-avatar>
  </div>
      <q-list>
        <br>
        <q-item to="./" active-class="q-item--active" class="custom-button" @click="showFichas">
        <q-item-section avatar>
          <q-icon name="people" class="icon" />
        </q-item-section>
        <q-item-section>
          
          <span class="button-text">Home</span>
        </q-item-section>
      </q-item>

        <q-item to="./aprendiz" active-class="q-item--active" class="custom-button" >
          <q-item-section avatar>
            <q-icon name="home" class="icon" />
          </q-item-section>
          <q-item-section>
            <span class="button-text">Aprendices</span>
          </q-item-section>
          
        </q-item>

        <q-item to="/bitacora" active-class="q-item--active" class="custom-button">
          <q-item-section avatar>
            <q-icon name="people" class="icon" />
          </q-item-section>
          <q-item-section>
            <span class="button-text">Bitacora</span>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Botón de Fichas que mostrará la sección de tarjetas -->
     

      <q-item to="/usuario" active-class="q-item--active" class="custom-button">
        <q-item-section avatar>
          <q-icon name="people" class="icon" />
        </q-item-section>
        <q-item-section>
          <span class="button-text">Usuarios</span>
        </q-item-section>
      </q-item>

       

     
       
      <div class="logon">
      <img class="negro" src="/public/imagenes/snegr.png" alt="">
    </div>
    </q-drawer>
   
    <q-page-container>
      <div class="fichas-container q-pa-md">
        <h4 class="text-center">FICHAS</h4>

        <div style="display: flex; justify-content: end; margin-bottom: 20px;">
          <q-btn @click="abrirModal()" color="green" label="Crear Ficha" style="width: 200px;" />
        </div>

        <q-table title="Fichas" :rows="rows" :columns="columns" row-key="codigo">
          <!-- Columna de Opciones -->
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn flat dense icon="edit" color="grey-8" @click="abrirModal(props.row)" />
              <q-btn flat dense icon="check_circle" v-if="props.row.estado == 1" color="green" @click="desactivar(props.row.codigo)" />
              <q-btn flat dense icon="cancel" v-else color="red" @click="activar(props.row.codigo)" />
            </q-td>
          </template>

          <!-- Columna de Estado -->
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip square outline color="green" v-if="props.row.estado == 1">Activo</q-chip>
              <q-chip square outline color="red" v-else>Inactivo</q-chip>
            </q-td>
          </template>
        </q-table>

        <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
          transition-hide="rotate" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6" v-if="b == true">Editar Ficha</div>
              <div class="text-h6" v-else>Guardar Ficha</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input filled v-model="codigo" label="Código de la Ficha" :dense="dense" />
              <q-input filled v-model="nombre" label="Nombre de la Ficha" :dense="dense" />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" v-close-popup @click="fixed.value = false" />
              <q-btn flat label="Guardar" color="primary" @click="crearFicha()" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useFichaStore } from '../stores/ficha.js';
import { RouterLink } from 'vue-router'
const useFicha = useFichaStore();
const dense = ref(false);

const $q = useQuasar();
const r = ref("");
const fixed = ref(false);
const codigo = ref("");
const nombre = ref("");
const b = ref(false);

const selectedId = ref(""); // Almacena el ID de la ficha seleccionada
const rows = ref([]);

onBeforeMount(() => {
  traer();
});

function abrirModal(row = null) {
  if (row) {
    // Modo edición
    selectedId.value = row._id || '';  // Asigna el ID de la ficha
    codigo.value = row.codigo || '';
    nombre.value = row.nombre || '';
    b.value = true;
  } else {
    // Modo creación
    selectedId.value = ''; // Limpia el ID
    codigo.value = '';
    nombre.value = '';
    b.value = false;
  }
  fixed.value = true;
}

async function traer() {
  const res = await useFicha.listarFicha();
  rows.value = res.data;
}

async function activar(id) {
  await useFicha.activarFichas(id);
  traer();
}

async function desactivar(id) {
  await useFicha.desactivarFichas(id);
  traer();
}

async function crearFicha() {
  if (b.value === true) {
    if (!selectedId.value) {
      console.error("ID de la ficha no está disponible");
      return;
    }

    try {
      await useFicha.modificarFicha(selectedId.value, codigo.value, nombre.value);
      await traer();
      fixed.value = false;
      b.value = false;
    } catch (error) {
      console.error("Error al modificar la ficha:", error);
    }
  } else {
    try {
      await useFicha.guardarFicha(codigo.value, nombre.value);
      await traer();
      fixed.value = false;
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
    }
  }
}

const columns = [
  {
    name: 'numero',
    required: true,
    label: 'N°',
    align: 'center',
    field: row => rows.value.indexOf(row) + 1, // Esto te da el número de fila
    sortable: true
  },
  {
    name: 'codigo',
    align: 'center',
    label: 'Código',
    field: 'codigo',
    sortable: true
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre',
    field: 'nombre',
    sortable: true
  },
  {
    name: 'estado',
    align: 'center',
    label: 'Estado',
    field: 'estado',
    sortable: true
  },
  {
    name: 'opciones',
    align: 'center',
    label: 'Opciones'
  },
];

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
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
/* .custom-button {
  background-color: green;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
  margin-left: 25px;
  margin-right: 25px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  border: none;
 
  width: 250px;
} */
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
.negro{
  width: 30%;
  height:30% ;
}
</style>
