<template>
  <div>
    <div class="aprendices-container q-pa-md">
      <h3 class="title-table">Aprendices</h3>
      <hr id="hr" class="bg-green-9">
      <div class="q-pa-md">
        <div style="display: flex; justify-content: end; ">
          <q-btn class="agregar" @click="abrirModal()" :loading="loadingCrearAprendiz">
            Agregar Aprendiz
          </q-btn>
        </div>
        <q-table title="Aprendiz" :rows="rows" :columns="columns" row-key="_id">
          <template v-slot:body-cell-documento="props">
            <q-td :props="props">
              {{ props.row.documento ? props.row.documento : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-nombre="props">
            <q-td :props="props">
              {{ props.row.nombre ? props.row.nombre : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-telefono="props">
            <q-td :props="props">
              {{ props.row.telefono ? props.row.telefono : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              {{ props.row.email ? props.row.email : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-ficha="props">
            <q-td :props="props">
              {{ props.row.id_ficha ? props.row.id_ficha.codigo : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-fichaNombre="props">
            <q-td :props="props">
              {{ props.row.id_ficha ? props.row.id_ficha.nombre : 'No disponible' }}
            </q-td>
          </template>
          <template v-slot:body-cell-firma="props">
            <q-td :props="props">
              <img v-if="props.row.firma" :src="props.row.firma" alt="Firma"
                style="max-width: 100px; max-height: 50px;" />
              <img v-else-if="firmaPreview" :src="firmaPreview" alt="Firma"
                style="max-width: 100px; max-height: 50px;" />
              <span v-else>No disponible</span>
            </q-td>
          </template>
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
      <div class="text-h6" v-if="b">Editar Aprendiz</div>
      <div class="text-h6" v-else>Guardar Aprendiz</div>
    </q-card-section>

    <q-separator />
    <div class="agua">
      <q-card-section
        style="max-height: none; max-width: 100%; width: 100vw; margin: auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        <!-- Fila 1 -->
        <q-input filled v-model="documento" label="Documento Aprendiz" :dense="dense"
          :rules="[val => val.trim() !== '' || 'Por favor, ingrese el documento']"
          style="margin-bottom: 15px; border-radius: 8px;">
          <template v-slot:prepend>
            <q-icon name="card_membership" />
          </template>
        </q-input>

        <q-input filled v-model="nombre" label="Nombre Del Aprendiz" :dense="dense"
          :rules="[val => val.trim() !== '' || 'Por favor, ingrese el nombre']"
          style="margin-bottom: 15px; border-radius: 8px;">
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <!-- Fila 2 -->
        <q-input filled v-model="telefono" label="Teléfono Del Aprendiz" :dense="dense"
          :rules="[val => val.trim() !== '' || 'Por favor, ingrese el teléfono', val => val.trim().length === 10 || 'Ingrese un teléfono válido']"
          style="margin-bottom: 15px; border-radius: 8px;">
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>

        <q-input filled v-model="email" label="Email Del Aprendiz" :dense="dense"
          :rules="[val => val.trim() !== '' || 'Por favor, ingrese el email']"
          style="margin-bottom: 15px; border-radius: 8px;">
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <!-- Fila 3 -->
        <q-select filled type="number" v-model="ficha" use-input input-debounce="0" label="Ficha"
          :options="options" @filter="filterFn"
          style="width: 100%; margin-bottom: 20px; border-radius: 8px;" behavior="menu" emit-value
          map-options lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Por favor, dígite el código de la ficha']">
          <template v-slot:prepend>
            <q-icon name="folder" />
          </template>

          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- <q-file style="max-width: 250px; min-width: 200px;" clearable filled v-model="firma"
          accept=".jpg, image/*" label="Firma" @input="handleFirma" :rules="[
            (val) => !change ? (val !== null || 'Por favor, seleccione un archivo') : true]">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <div v-if="firmaPreview && change === true" style="max-width: 250px; min-width: 200px;">
          <q-img :src="firmaPreview" alt="Firma del aprendiz">
            <div class="absolute-bottom text-subtitle1 text-center">
              Firma Actual
            </div>
          </q-img>
        </div>

        <div v-if="!firmaPreview && change === true" style="max-width: 250px; min-width: 200px;">
          <q-img
            src="https://media.istockphoto.com/id/1409329028/es/vector/no-hay-imagen-disponible-marcador-de-posici%C3%B3n-miniatura-icono-dise%C3%B1o-de-ilustraci%C3%B3n.jpg?s=612x612&w=0&k=20&c=Bd89b8CBr-IXx9mBbTidc-wu_gtIj8Py_EMr3hGGaPw="
            alt="Firma del aprendiz">
            <div class="absolute-bottom text-subtitle1 text-center">
              Image not found
            </div>
          </q-img>
        </div> -->
   
        <q-file clearable color="green" filled bottom-slots v-model="firma" accept=".jpg, .jpeg, .png, image/*"
                  label="Firma" @input="handleFirma" :rules="[
                    (val) => !val || (val.length === 0 ? 'Por favor, seleccione un archivo' : true),
                  ]" counter>
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>

                </q-file>
      </q-card-section>
    </div>

    <q-separator />

    <q-card-actions style="justify-content: center;" align="right">
      <q-btn flat label="Cerrar" color="primary" v-close-popup @click="fixed.value = false" />
      <q-btn flat label="Guardar" color="primary" @click="crearAprendiz()"
        :loading="loadingGuardarAprendiz" />
    </q-card-actions>
  </q-card>
</q-dialog>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAprendizStore } from '../stores/aprendiz.js'
import { useFichaStore } from '../stores/ficha.js'
import { useRoute } from 'vue-router'
import { useUsuariosStore } from '../stores/usuario.js';

const route = useRoute()
const $q = useQuasar();

const { InfoUser } = useUsuariosStore();
console.log(InfoUser);

// Computed para garantizar la reactividad y mostrarlo en el template
const nombreUser = computed(() => InfoUser[0]);
const emailUser = computed(() => InfoUser[1]);

const menuItems = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Aprendices', path: '/aprendiz', icon: 'school' },
  { label: 'Bitacora', path: '/bitacora', icon: 'library_books' },
  { label: 'Fichas', path: '/ficha', icon: 'folder' },
  { label: 'Usuarios', path: '/usuario', icon: 'people' },
]

const leftDrawerOpen = ref(false)
const fixed = ref(false)
const documento = ref("")
const nombre = ref("")
const telefono = ref("")
const email = ref("")
const firma = ref(null)
const firmaPreview = (null)
const change = ref(false);
const b = ref(false)
const id = ref("")
const rows = ref([])
const options = ref([])
const ficha = ref()
const dense = ref(false)

// Manejo de carga por ID
const loadingState = ref({})
const loadingGuardarAprendiz = ref(false)
const loadingCrearAprendiz = ref({})

const useAprendiz = useAprendizStore()
const useFicha = useFichaStore()

onBeforeMount(() => {
  traer()
  traerFichas()
})

async function abrirModal(row = null) {
  if (row) {
    id.value = row._id || ''
    documento.value = row.documento || ''
    nombre.value = row.nombre || ''
    telefono.value = row.telefono || ''
    email.value = row.email || ''
    ficha.value = row.id_ficha ? row.id_ficha._id : ''
    firma.value = row.firma || ''
    firma.value = row.firma || ''
    b.value = true
  } else {
    id.value = ''
    documento.value = ''
    nombre.value = ''
    telefono.value = ''
    email.value = ''
    ficha.value = ''
    firma.value = ''
    firma.value = ''
    b.value = false
  }
  fixed.value = true
}

async function traer() {
  loadingState.value['traer'] = true
  try {
    let res = await useAprendiz.listarAprendiz()
    console.log("Datos traídos:", res.data) // Depuración para ver los datos traídos
    rows.value = res.data
  } catch (error) {
    console.error("Error al traer aprendices:", error)
  } finally {
    loadingState.value['traer'] = false
  }
}

function handleFirma(file) {
  if (file && file.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      firmaPreview.value = e.target.result;
      firma.value = e.target.result;
      change.value = true;
    };
    reader.readAsDataURL(file[0]);
  } else {
    firmaPreview.value = null;
    firma.value = null;
    change.value = false;
  }
}

async function crearAprendiz() {
  if (!documento.value.trim() || !nombre.value.trim() || !telefono.value.trim() || !email.value.trim() || !ficha.value || !firma.value) {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Todos los campos son obligatorios'
    });
    return;
  }

  if (b.value) {  // Editar
    if (!id.value) {
      console.error("ID del Aprendiz no está disponible");
      return;
    }

    loadingState.value[`guardar-${id.value}`] = true;
    try {
      await useAprendiz.modificarAprendiz(id.value, documento.value.trim(), nombre.value.trim(), telefono.value.trim(), email.value.trim(), ficha.value.trim(), firma.value, firmaPreview.value);
      traer()

      fixed.value = false;
      b.value = false;

    } finally {
      loadingState.value[`guardar-${id.value}`] = false;
    }
  } else {  // Crear
    loadingState.value['guardar-nuevo'] = true;
    try {
      console.log(documento.value, nombre.value, telefono.value, email.value, ficha.value, firma.value);

      await useAprendiz.guardarAprendiz(documento.value.trim(), nombre.value.trim(), telefono.value.trim(), email.value.trim(), ficha.value.trim(), firma.value);
      await traer();  // Actualizar la lista de aprendices
      fixed.value = false;

    } finally {
      loadingState.value['guardar-nuevo'] = false;
    }
  }
}

async function activar(id) {
  if (id) {
    loadingState.value[`activar-${id}`] = true
    try {
      await useAprendiz.activarAprendiz(id);
      await traer();

    } catch (error) {

      console.error('Error al activar:', error);
    } finally {
      loadingState.value[`activar-${id}`] = false
    }
  } else {
    console.error('ID no proporcionado para activar');
  }
}

async function desactivar(id) {
  if (id) {
    loadingState.value[`desactivar-${id}`] = true
    try {
      await useAprendiz.desactivarAprendiz(id);
      await traer();

    } catch (error) {

      console.error('Error al desactivar:', error);
    } finally {
      loadingState.value[`desactivar-${id}`] = false
    }
  } else {
    console.error('ID no proporcionado para desactivar');
  }
}
async function traerFichas() {
  let res = await useFicha.listarFicha();
  options.value = res.data.map(ficha => ({
    label: ficha.codigo,
    value: ficha._id
  }));

}


const filterFn = async (val, update) => {
  let res = await useFicha.listarFicha();
  if (val === '') {
    update(() => {
      options.value = res.data.map(ficha => ({
        label: ficha.codigo,
        value: ficha._id
      }));
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = res.data.map(ficha => ({
      label: ficha.codigo,
      value: ficha._id
    })).filter(option => option.label.toLowerCase().includes(needle));
  });
}

const columns = [
  {
    name: 'documento1',
    required: true,
    label: 'Numero Documento',
    align: 'center',
    field: "documento",
    sortable: true
  },
  {
    name: 'nombre1',
    align: 'center',
    label: 'Nombre del Aprendiz',
    field: 'nombre',
    sortable: true
  },
  {
    name: 'telefono1',
    align: 'center',
    label: 'Telefono del Aprendiz',
    field: 'telefono',
    sortable: true
  },
  {
    name: 'email1',
    align: 'center',
    label: 'Email del Aprendiz',
    field: 'email',
    sortable: true
  },
  {
    name: 'ficha',
    align: 'center',
    label: 'Ficha del Aprendiz',
    field: 'id_ficha',
    sortable: true
  },
  {
    name: 'fichaNombre',
    align: 'center',
    label: 'Nombre de la Ficha',
    field: 'id_ficha',
    sortable: true
  },
  {
    name: 'firma',
    align: 'center',
    label: 'Firma Aprendiz',
    field: 'firma',
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
    align: 'center',
  },
]
</script>



<style>
.user-info {
  text-align: center;
  margin: 0.5rem 0;
}

.user-name {
  margin: 0;
  font-weight: bold;
}

.user-email {
  margin: 0;
}

.drawer-list {
  flex: 1;
  /* Permite que la lista se expanda para llenar el espacio disponible */

}

.q-drawer {
  overflow-y: auto !important;
  /* Asegura que el contenido del drawer permita scroll */
}

.custom-button {
  background-color: green;
  border-radius: 10px;
  margin: 20px;
  height: auto;
  display: flex;
  align-items: center;
  color: white;
  width: 250px;
  font-size: 130%;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.active-item {
  background-color: #005500;
  /* Fondo más oscuro para la ventana activa */
  color: #ffffff !important;
  /* Cambia esto por el color que desees */
  font-weight: bold;
}

.indicator-icon {
  color: rgb(255, 255, 255);
  margin-left: 5px;
}

.custom-button:hover {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  font-weight: bold;

}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.per {
  max-width: 110%;
  max-height: 110%;
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

.logon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.negro {
  width: 30%;
  height: 30%;
}

.title-table {
  text-align: center;
  margin-bottom: 0
}

.bg-green-9 {
  color: green;
  width: 70%;
  height: 3.5px;
  border-radius: 10px;
}

.agregar {
  background-color: green;
  color: #ffffff;
  align-content: center;
  align-items: center;
  height: auto;
  width: auto;
  margin-bottom: 20px;

}

.agregar:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;

}

.aprendices-container {
  max-width: 1200px;
  margin: 0 auto;
}

.text-h6 {
  font-weight: bold;
  align-content: center;
  text-align: center;
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
  min-height: 100vh;
  /* Ocupa el 100% del alto de la pantalla */
}

.container {
  flex-grow: 1;
  /* Permite que el contenido se expanda para empujar el footer hacia abajo */
}

.footer {
  background-color: #e7e3e3;
  color: #000;
  padding: 15px 0;
  text-align: center;
  margin-top: auto;
  /* Esto fuerza al footer a estar en la parte inferior */
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