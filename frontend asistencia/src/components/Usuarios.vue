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
        <q-item 
          v-for="item in menuItems" 
          :key="item.label" 
          :to="item.path" 
          active-class="active-item" 
          class="custom-button"
        >
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
      <div class="usuarios-container q-pa-md">
        <h4 class="text-center">Usuarios</h4>

        <div class="q-pa-md">
          <div style="display: flex; justify-content: end;">
            <q-btn 
              @click="abrirModal()" 
              color="green" 
              label="Agregar Usuario" 
              :loading="loadingCrearUsuario"
            />
          </div>
          <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="email">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn 
                  flat 
                  icon="edit" 
                  @click="abrirModal(props.row)" 
                  :loading="loadingEditarUsuario"
                />
                <q-btn 
                  @click="desactivar(props.row.email)" 
                  flat 
                  dense 
                  icon="cancel" 
                  v-if="props.row.estado == 1" 
                  color="red" 
                  :loading="loadingDesactivar"
                />
                <q-btn 
                  @click="activar(props.row.email)" 
                  flat 
                  dense 
                  icon="check_circle" 
                  v-else 
                  color="green" 
                  :loading="loadingActivar"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-estado1="props">
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
                <div class="text-h6" v-if="b == true">Editar Usuario</div>
                <div class="text-h6" v-else>Guardar Usuario</div>
              </q-card-section>

              <q-separator />

              <q-card-section style="max-height: 50vh" class="scroll">
                <q-input filled v-model="email" label="Código del Usuario" :dense="dense" />
                <q-input filled v-model="nombre" label="Nombre del Usuario" :dense="dense" />
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary" v-close-popup @click="fixed.value = false" />
                <q-btn 
                  flat 
                  label="Guardar" 
                  color="primary" 
                  @click="crearUsuario()"
                  :loading="loadingCrearUsuario"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import { useUsuariosStore } from '../stores/usuario.js'

// Define the reactive property for controlling the drawer
const leftDrawerOpen = ref(false);

// Function to toggle the drawer
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const useUsuario = useUsuariosStore();
const $q = useQuasar();
const fixed = ref(false);
const email = ref("");
const nombre = ref("");
const b = ref(false);

const selectedId = ref(""); // Almacena el ID del Usuario seleccionado
const rows = ref([]);

const loadingCrearUsuario = ref(false);
const loadingEditarUsuario = ref(false);
const loadingDesactivar = ref(false);
const loadingActivar = ref(false);
const loadingState = ref({});

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

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
onBeforeMount(() => {
  traer();
});

function abrirModal(row = null) {
  if (row) {
    // Modo edición
    selectedId.value = row._id || '';  // Asigna el ID del Usuario
    email.value = row.email || '';
    nombre.value = row.nombre || '';
    b.value = true;
  } else {
    // Modo creación
    selectedId.value = ''; // Limpia el ID
    email.value = '';
    nombre.value = '';
    b.value = false;
  }
  fixed.value = true;
}

async function traer() {
  try {
    const res = await useUsuario.listarUsuarios();
    rows.value = res.data;
  } catch (error) {
    console.error("Error al traer usuarios:", error);
  }
}

async function activar(email) {
  loadingActivar.value = true;
  try {
    await useUsuario.activarUsuario(email);
    await traer();  // Refresca la lista de usuarios
  } catch (error) {
    console.error("Error al activar usuario:", error);
  } finally {
    loadingActivar.value = false;
  }
}

async function desactivar(email) {
  loadingDesactivar.value = true;
  try {
    await useUsuario.desactivarUsuario(email);
    await traer();  // Refresca la lista de usuarios
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
  } finally {
    loadingDesactivar.value = false;
  }
}

async function crearUsuario() {
  if (b.value === true) {
    if (!selectedId.value) {
      console.error("ID del Usuario no está disponible");
      return;
    }

    loadingEditarUsuario.value = true;
    try {
      await useUsuario.modificarUsuario(selectedId.value, email.value, nombre.value);
      await traer();
      fixed.value = false;
      b.value = false;
    } catch (error) {
      console.error("Error al modificar el Usuario:", error);
    } finally {
      loadingEditarUsuario.value = false;
    }
  } else {
    loadingCrearUsuario.value = true;
    try {
      await useUsuario.guardarUsuario(email.value, nombre.value);
      await traer();
      fixed.value = false;
    } catch (error) {
      console.error("Error al guardar el Usuario:", error);
    } finally {
      loadingCrearUsuario.value = false;
    }
  }
}

const columns = [
  {
    name: 'nombre1',
    required: true,
    label: 'Email del Usuario',
    align: 'center',
    field: "nombre",
    sortable: true
  },
  {
    name: 'codigo1',
    align: 'center',
    label: 'Nombre del Usuario',
    field: 'email',
    sortable: true
  },
  {
    name: 'estado1',
    align: 'center',
    label: 'Estado',
    field: 'estado',
    sortable: true
  },
  {
    name: 'opciones',
    label: 'Opciones'
  },
];


</script>

<style scoped>
.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.usuarios-container {
  max-width: 1200px;
  margin: 0 auto;
}

.custom-button {
  text-decoration: none;
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
  cursor: pointer;
  width: 250px;
}

.custom-button:hover {
  background-color: darkgreen;
}

.icon {
  color: white;
  height: 20px;
  margin-right: 10px;
}
.active-item {
  background-color: #005500; /* Fondo más oscuro para la ventana activa */
  color: #ffffff; /* Cambia esto por el color que desees */
  font-weight: bold;
}
.button-text {
  color: white;
}
</style>
