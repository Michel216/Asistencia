<template>
  <q-layout view="hHh lpR lFf">
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
        <h4 class="text-center">FICHAS</h4>

        <div style="display: flex; justify-content: end; margin-bottom: 20px;">
          <q-btn @click="abrirModal()" color="green" label="Crear Ficha" style="width: 200px;"
            :loading="loadingCrearFicha" />
        </div>

        <q-table title="Fichas" :rows="rows" :columns="columns" row-key="codigo">
          <!-- Columna de Opciones -->
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn flat dense icon="edit" color="grey-8" @click="abrirModal(props.row)"
                :loading="loadingState[`guardar-${props.row._id || 'default'}`]" />
              <q-btn @click="desactivar(props.row.codigo)" flat dense icon="cancel" v-if="props.row.estado == 1"
                color="red" :loading="loadingState[`desactivar-${props.row.codigo || 'default'}`]" />
              <q-btn @click="activar(props.row.codigo)" flat dense icon="check_circle" v-else-if="props.row.estado == 0"
                color="green" :loading="loadingState[`activar-${props.row.codigo || 'default'}`]" />

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
              <q-input filled v-model="codigo" label="Código de la Ficha" :dense="dense"
                :rules="[val => val.trim() !== '' || 'Por favor, ingrese el codigo de su ficha']" />
              <q-input filled v-model="nombre" label="Nombre de la Ficha" :dense="dense"
                :rules="[val => val.trim() !== '' || 'Por favor, ingrese el nombre de su ficha']" />

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
import { useQuasar } from 'quasar'

import { useFichaStore } from '../stores/ficha.js';

const useFicha = useFichaStore();
const dense = ref(false);
const loadingCrearFicha = ref(false);
const loadingState = ref({});
const fixed = ref(false);
const codigo = ref("");
const nombre = ref("");
const $q = useQuasar()

const b = ref(false);
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()


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
  loadingState.value[`activar-${id}`] = true;
  try {
    await useFicha.activarFicha(id);
    await traer();
  } catch (error) {
    console.error("Error al activar la ficha:", error);
  } finally {
    loadingState.value[`activar-${id}`] = false;
  }
}

async function desactivar(id) {
  loadingState.value[`desactivar-${id}`] = true;
  try {
    await useFicha.desactivarFicha(id);
    await traer();
  } catch (error) {
    console.error("Error al desactivar la ficha:", error);
  } finally {
    loadingState.value[`desactivar-${id}`] = false;
  }
}

async function crearFicha() {
  if (!nombre.value.trim() && !codigo.value.trim()) {

    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'No se pudo guardar la ficha'
    });
    return;
  }
    if (b.value === true) {
      if (!selectedId.value) {
        console.error("ID de la ficha no está disponible");
        return;
      }

      loadingState.value[`guardar-${selectedId.value}`] = true;

      try {
        await useFicha.modificarFicha(selectedId.value, codigo.value, nombre.value);
        await traer();
        fixed.value = false;
        b.value = false;
        $q.notify({
        color: 'positive',
        icon: 'check',
        message: 'Ficha editada correctamente'
      });
      } catch (error) {
        $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error al editar la ficha'
      });
        console.error("Error al modificar la ficha:", error);
      } finally {
        loadingState.value[`guardar-${selectedId.value}`] = false;
      }
    } else {
      loadingState.value[`guardar-${selectedId.value}`] = false;

      try {
        await useFicha.guardarFicha(codigo.value, nombre.value);
        await traer();
        fixed.value = false;
        $q.notify({
        color: 'positive',
        icon: 'check',
        message: 'Ficha guardada correctamente'
      });
      } catch (error) {
        $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error al guardar la ficha'
      });
        console.error("Error al guardar la ficha:", error);
      } finally {
        loadingState.value[`crear`] = false;
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

<style scoped>
.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.fichas-container {
  max-width: 1200px;
  margin: 0 auto;
}

.custom-button {
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
}

.custom-button:hover {
  background-color: darkgreen;
}

.active-item {
  background-color: #005500;
  /* Fondo más oscuro para la ventana activa */
  color: #ffffff;
  /* Cambia esto por el color que desees */
  font-weight: bold;
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
