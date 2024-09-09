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
          <img class="per" src="../../public/imagenes/usuario.png" alt="perfil" />
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
                  :loading="loadingState[`guardar-${props.row._id}`]"
                />
                <q-btn 
                  @click="desactivar(props.row.email)" 
                  flat 
                  dense 
                  icon="cancel" 
                  v-if="props.row.estado == 1" 
                  color="red" 
                  :loading="loadingState[`desactivar-${props.row._id}`]"
                />
                <q-btn 
                  @click="activar(props.row.email)" 
                  flat 
                  dense 
                  icon="check_circle" 
                  v-else 
                  color="green" 
                  :loading="loadingState[`activar-${props.row._id}`]"
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
                <div class="text-h6" v-if="b">Editar Usuario</div>
                <div class="text-h6" v-else>Guardar Usuario</div>
              </q-card-section>

              <q-separator />

              <q-card-section style="max-height: 50vh" class="scroll">
                <q-input filled v-model="email" label="Código del Usuario" :dense="dense" />
                <q-input filled v-model="nombre" label="Nombre del Usuario" :dense="dense" />
                <q-input 
                  v-if="!b" 
                  filled 
                  v-model="password" 
                  type="password" 
                  label="Contraseña" 
                  :dense="dense" 
                />
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
const password = ref(""); // Agrega esta línea
const b = ref(false);

const selectedId = ref(""); // Almacena el ID del Usuario seleccionado
const rows = ref([]);

const loadingCrearUsuario = ref(false);
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
    selectedId.value = row._id || '';
    email.value = row.email || '';
    nombre.value = row.nombre || '';
    password.value = ''; // Limpia la contraseña en modo edición
    b.value = true;
  } else {
    // Modo creación
    selectedId.value = '';
    email.value = '';
    nombre.value = '';
    password.value = ''; // Inicializa la contraseña para creación
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
  const id = selectedId.value;
  loadingState.value[`activar-${id}`] = true
  try {
    await useUsuario.activarUsuario(email);
    await traer();  // Refresca la lista de usuarios
  } catch (error) {
    console.error("Error al activar usuario:", error);
  } finally {
    loadingState.value[`activar-${id}`] = false;
  }
}

async function desactivar(email) {
  const id = selectedId.value;
  loadingState.value[`desactivar-${id}`] = true
  try {
    await useUsuario.desactivarUsuario(email);
    await traer();  // Refresca la lista de usuarios
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
  } finally {
    loadingState.value[`desactivar-${id}`]= false;
  }
}

async function crearUsuario() {
  if (!nombre.value.trim() || !email.value.trim() || (b.value === false && !password.value.trim())) {
    // Muestra un notify de error si los campos obligatorios están vacíos
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Todos los campos son obligatorios'
    });
    return; // Detiene la ejecución si los campos están vacíos
  }
  if (b.value === true) { // Editar
    if (!selectedId.value) {
      console.error("ID del Usuario no está disponible");
      return;
    }

    loadingState.value[`guardar-${selectedId.value}`] = true;
    try {
      await useUsuario.modificarUsuario(selectedId.value, email.value, nombre.value);
      await traer();
      fixed.value = false;
      b.value = false;
      $q.notify({
        color: 'positive',
        icon: 'check',
        message: 'Usuario editado correctamente'
      });
    } catch (error) {
      console.error("Error al modificar el Usuario:", error);
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error al editar el usuario'
      });
    } finally {
      loadingState.value[`guardar-${selectedId.value}`] = false;
    }
  } else { // Crear
    loadingState.value['guardar-nuevo'] = true;
    try {
      await useUsuario.guardarUsuario(email.value, nombre.value, password.value);
      await traer();
      $q.notify({
        color: 'positive',
        icon: 'check',
        message: 'Usuario guardado correctamente'
      });
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error al guardar el usuario'
      });
    } finally {
      loadingState.value['guardar-nuevo'] = false;
    }
  }
}
const columns = [
  {
    name: 'nombre1',
    required: true,
    label: 'Nombre del Usuario',
    align: 'center',
    field: "nombre",
    sortable: true
  },
  {
    name: 'codigo1',
    align: 'center',
    label: 'Email del Usuario',
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
    label: 'Opciones',
    align: 'center'
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
  background-color: #005500;
  /* Fondo más oscuro para la ventana activa */
  color: #ffffff;
  /* Cambia esto por el color que desees */
  font-weight: bold;
}

.button-text {
  color: white;
}
</style>
