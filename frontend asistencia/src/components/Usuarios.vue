USUARIOS <template>
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

    <q-drawer
    show-if-above
    v-model="leftDrawerOpen"
    side="left"
    bordered
    class="my-drawer"
       :breakpoint="500"
  >
    <div class="avatar-container">
      <q-avatar class="large-avatar">
        <img class="per" src="/imagenes/usuario.png" style=" margin-top: 15%;" alt="perfil" />
      </q-avatar>
    </div>
    <div class="user-info">
      <p class="user-name">{{ nombreUser }}</p>
      <p class="user-email">{{ emailUser }}</p>
    </div>
    <q-list class="drawer-list">
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
    <div class="logon">
      <img class="negro" src="/imagenes/snegr.png" alt="" />
    </div>
  </q-drawer>

    <q-page-container>
      <div class="usuarios-container q-pa-md">
        <h3 class="title-table">Usuarios</h3>
        <hr id="hr" class="bg-green-9">
        <div class="q-pa-md">
          <div style="display: flex; justify-content: end; ">
            <q-btn @click="abrirModal()"
              style="background-color: green; color: white; margin:10px 0 20px 0; width: 160px" label="Agregar Usuario"
              :loading="loadingCrearUsuario" />
          </div>
          <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="email">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn flat icon="edit" @click="abrirModal(props.row)"
                  :loading="loadingState[`guardar-${props.row._id}`]" />
                <q-btn @click="desactivar(props.row._id)" flat dense icon="cancel" v-if="props.row.estado == 1"
                  color="red" :loading="loadingState[`desactivar-${props.row._id}`]" />
                <q-btn @click="activar(props.row._id)" flat dense icon="check_circle" v-else color="green"
                  :loading="loadingState[`activar-${props.row._id}`]" />
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
              <q-card-section class="vert" style="background-color: green; color:white">
                <div class="text-h6" v-if="b">Editar Usuario</div>
                <div class="text-h6" v-else>Guardar Usuario</div>
              </q-card-section>

              <q-separator />

              <q-card-section
   style="max-height: none; max-width: 100%; width: 100vw; margin: auto; "
  >
    <!-- Nombre del Usuario -->
    <q-input
      filled
      v-model="nombre"
      label="Nombre del Usuario"
      :dense="dense"
      lazy-rules
      :rules="[val => val && val.trim() !== '' || 'Por favor ingresa el nombre']"
    >
      <template v-slot:prepend>
        <q-icon name="person" />
      </template>
    </q-input>

    <!-- Email del Usuario -->
    <q-input
      filled
      v-model="email"
      label="Email del Usuario"
      :dense="dense"
      lazy-rules
      :rules="[val => val && val.trim() !== '' || 'Por favor ingresa el email']"
    >
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
    </q-input>

    <!-- Contraseña -->
    <q-input
      v-if="!b"
      :type="isPwd ? 'password' : 'text'"
      filled
      v-model="password"
      label="Contraseña"
      lazy-rules
      :rules="[val => val && val.trim().length >= 6 || 'La contraseña debe tener al menos 6 caracteres']"
    >
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
  </q-card-section>

              <q-separator />

              <q-card-actions style="justify-content: center;"  align="right">
                <q-btn flat label="Cerrar" color="primary" v-close-popup @click="fixed.value = false" />
                <q-btn flat label="Guardar" color="primary" @click="crearUsuario()" :loading="loadingCrearUsuario" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    <!-- El footer -->
      <footer class="footer">
        <div class="text-h7 text-weight-bold">
          ASISTENCIA SENA - Sena 2024 © Todos los derechos reservados
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>



<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useUsuariosStore } from '../stores/usuario.js'

// Define the reactive property for controlling the drawer
const leftDrawerOpen = ref(false);

// Function to toggle the drawer
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const { InfoUser } = useUsuariosStore();
console.log(InfoUser);

// Computed para garantizar la reactividad y mostrarlo en el template
const nombreUser = computed(() => InfoUser[0]);
const emailUser = computed(() => InfoUser[1]);

const useUsuario = useUsuariosStore();
const $q = useQuasar();
const fixed = ref(false);
const email = ref("");
const nombre = ref("");
const password = ref(""); // Agrega esta línea
const b = ref(false);
const isPwd = ref(true);
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
  // console.log(Current Route: ${route.path}, Checking Path: ${path});
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

async function activar(id) {
  // const id = selectedId.value;
  loadingState.value[`activar-${id}`] = true
  try {
    await useUsuario.activarUsuario(id);
    await traer();  // Refresca la lista de usuarios
  } catch (error) {
    console.error("Error al activar usuario:", error);
  } finally {
    loadingState.value[`activar-${id}`] = false;
  }
}

async function desactivar(id) {
  // const id = selectedId.value
  loadingState.value[`desactivar-${id}`] = true
  try {
    await useUsuario.desactivarUsuario(id);
    await traer();  // Refresca la lista de usuarios
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
  } finally {
    loadingState.value[`desactivar-${id}`] = false;
  }
}

async function crearUsuario() {
  if (!nombre.value.trim() || !email.value.trim() || (b.value === false && !password.value.trim())) {
    // Muestra un notify de error si los campos obligatorios están vacíos
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Error al guardar Usuario'
    });
    return; // Detiene la ejecución si los campos están vacíos
  }
  if (b.value) { // Editar
    if (!selectedId.value) {
      console.error("ID del Usuario no está disponible");
      return;
    }

    loadingState.value[`guardar-${selectedId.value}`] = true;
    try {
      await useUsuario.modificarDatosUsuario(selectedId.value, email.value, nombre.value);
      await traer();
      fixed.value = false;
      b.value = false;

    } catch (error) {
      console.error("Error al modificar el Usuario:", error);

    } finally {
      loadingState.value[`guardar-${selectedId.value}`] = false;
      
    }
  } else { // Crear
    loadingState.value['guardar-nuevo'] = true;
    try {
      await useUsuario.guardarUsuario(email.value, nombre.value, password.value);
      fixed.value = false;
      await traer();

    } catch (error) {
      console.error("Error al guardar el usuario:", error);

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

.large-avatar {
  width: 110px;
  /* Ancho del avatar */
  height: 110px;
  /* Alto del avatar */
}

.large-avatar img {
  width: 100%;
  /* La imagen ocupa todo el avatar */
  height: 100%;
  /* La imagen ocupa todo el avatar */
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

.title-table {
  margin-bottom: 0
}

.bg-green-9 {
  color: green;
  width: 70%;
  height: 3.5px;
  border-radius: 10px;
}

.q-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;
  background-color: green !important;
  color: white !important;

}





 .main-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ocupa el 100% del alto de la pantalla */
}

.container {
  flex-grow: 1; /* Permite que el contenido se expanda para empujar el footer hacia abajo */
}

.footer {
  background-color: #e7e3e3;
  color: #000;
  padding: 15px 0;
  text-align: center;
  margin-top: auto; /* Esto fuerza al footer a estar en la parte inferior */
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .footer {
    font-size: 14px;
  }
}
</style>
