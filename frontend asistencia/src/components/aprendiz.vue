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
     
     <br>
     <div class="avatar-container">
   <q-avatar>
     <img class="per" src="../../public/imagenes/usuario.png" alt="perfil " />
   </q-avatar>
 
 </div>
     
     <q-list>
       <br>
       <q-item to="./home" active-class="q-item--active" class="custom-button" @click="showFichas">
       <q-item-section avatar>
         <q-icon name="home" class="icon" />
       </q-item-section>
       <q-item-section>
         
         <span class="button-text">Home</span>
       </q-item-section>
     </q-item>

       <q-item to="./aprendiz" active-class="q-item--active" class="custom-button" >
         <q-item-section avatar>
           <q-icon name="people" class="icon" />
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
    
     <q-list>
      
   
    

       <q-item to="/registro" active-class="q-item--active" class="custom-button">
         <q-item-section avatar>
           <q-icon name="people" class="icon" />
         </q-item-section>
         <q-item-section>
           <span class="button-text">Registro Asistencia</span>
         </q-item-section>
       </q-item>
     </q-list>
<br>
<div class="logon">
     <img class="negro" src="../../public/imagenes/snegr.png" alt="">
   </div>
 
   </q-drawer>

    <q-page-container>
      <div class="aprendices-container q-pa-md">
        <h4 class="text-center">Aprendices</h4>
        <div class="q-pa-md">
          <div style="display: flex; justify-content: end;">
            <q-btn @click="abrirModal()" color="green">Agregar Aprendiz </q-btn>
          </div>
          <q-table title="Aprendiz" :rows="rows" :columns="columns" row-key="name">
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

            <template v-slot:body-cell-opciones="props">

              <q-td :props="props"><q-btn flat icon="edit" @click="abrirModal(props.row)" />
                <!-- <q-btn @click="abrirModal(props.row)" color="primary">📝</q-btn> -->
                <q-btn @click="desactivar(props.row.documento)" flat dense icon="cancel" v-if="props.row.estado == 1" color="red"></q-btn>
                <q-btn @click="activar(props.row.documento)" flat dense icon="check_circle" v-else-if="props.row.estado == 0" color="green"></q-btn>
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
                <div class="text-h6" v-if="b == true">Editar Aprendiz</div>
                <div class="text-h6" v-else> Guardar Aprendiz </div>
              </q-card-section>

              <q-separator />

              <q-card-section style="max-height: 50vh" class="scroll">
                <q-input filled v-model="documento" label="Documento Aprendiz" :dense="dense" />
                <q-input filled v-model="nombre" label="Nombre Del Aprendiz" :dense="dense" />
                <q-input filled v-model="telefono" label="Telefono Del Aprendiz" :dense="dense" />
                <q-input filled v-model="email" label="Email Del Aprendiz" :dense="dense" />
                <q-select filled v-model="model" use-input input-debounce="0" label="Codigo de la ficha" :options="options"
                  @filter="filterFn" style="width: 250px" behavior="menu">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>


              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary" v-close-popup @click="fixed.value = false" />
                <q-btn flat label="Guardar" color="primary" @click="crearAprendiz()" />
              </q-card-actions>
            </q-card>
          </q-dialog>


        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import axios from 'axios'
// import { Notify } from 'quasar';
import { useQuasar } from 'quasar'
import { onBeforeMount, ref } from 'vue'
import { useAprendizStore } from '../stores/aprendiz.js';
import { useFichaStore } from '../stores/ficha.js';


let useAprendiz = useAprendizStore()
const dense = ref(false);
let $q = useQuasar()
let r = ref("")
let fixed = ref(false)
let documento = ref("");
let nombre = ref("");
let telefono = ref("");
let email = ref("");
let ficha = ref("")
let b = ref(false);

let id = ref("");
let rows = ref([])

onBeforeMount(() => {
  traer()
})

function abrirModal(row = null) {
  if (row) {
    // Modo edición
    id.value = row.id || ''  // Asigna el iD de la Aprendiz
    documento.value = row.documento || ''
    nombre.value = row.nombre || ''
    telefono.value = row.telefono || ''
    email.value = row.email || ''
    ficha.value = row.ficha || ''
    b.value = true
  } else {
    // Modo creación
    id.value = '' // Limpia el iD
    documento.value = '' // row es null, así que asignamos un string vacío
    nombre.value = ''
    telefono.value = ''
    email.value = ''
    ficha.value = ''
    b.value = false
  }
  fixed.value = true
}

async function traer() {
  let res = await useAprendiz.listarAprendiz()
  rows.value = res.data
}
async function activar(id) {
  console.log('iD para activar:', id);  // Agrega un log para verificar el iD
  if (id) {
    await useAprendiz.activarAprendiz(id);
    await traer();  // Actualiza los datos después de la activación
  } else {
    console.error('iD no proporcionado para activar');
  }
}

async function desactivar(id) {
  console.log('iD para desactivar:', id);  // Agrega un log para verificar el iD
  if (id) {
    await useAprendiz.desactivarAprendiz(id);
    await traer();  // Actualiza los datos después de la desactivación
  } else {
    console.error('iD no proporcionado para desactivar');
  }
}

async function crearAprendiz() {
  console.log(b.value);
  if (b.value === true) {
    console.log("estoy editando...");
    if (!id.value) {
      console.error("iD de la Aprendiz no está disponible")
      return
    }

    try {
      let res = await useAprendiz.modificarAprendiz(id.value, documento.value, nombre.value, telefono.value, email.value, ficha.value)
      console.log('Respuesta del servidor (modificar):', res.data)
      await traer()
      fixed.value = false
      b.value = false
    } catch (error) {
      console.error("Error al modificar la Aprendiz1:", error)
    }
  } else {
    try {
      let res = await useAprendiz.guardarAprendiz(documento.value, nombre.value, telefono.value, email.value, ficha.value);
      console.log('Respuesta del servidor (guardar):', res);
      await traer();
      fixed.value = false;
    } catch (error) {
      console.error("Error al guardar el aprendiz:", error.response?.data || error.message);
    }
  }
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
    field: 'nombre',  // Cambiado a 'nombre'
    sortable: true
  },
  {
    name: 'telefono1',
    align: 'center',
    label: 'Telefono del Aprendiz',
    field: 'telefono',  // Cambiado a 'telefono'
    sortable: true
  },
  {
    name: 'email1',
    align: 'center',
    label: 'Email del Aprendiz',
    field: 'email',  // Cambiado a 'email'
    sortable: true
  },
  {
    name: 'ficha',
    align: 'center',
    label: 'Ficha del Aprendiz',
    field: 'id_ficha',  // Cambiado a 'id_ficha'
    sortable: true
  },
  {
    name: 'estado1',
    align: 'center',
    label: 'Estado',
    field: 'estado',  // Sin cambios
    sortable: true
  },
  {
    name: 'opciones',
    label: 'Opciones'
  },
]




const useFicha =useFichaStore()


const options = ref()
const model = ref(null)
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

</script>

<style>
.custom-button {
  text-decoration: none;
  background-color: green;
  /* padding: 10px; */
  border-radius: 10px;
  margin-bottom: 20px;
  margin-left: 25px;
  margin-right: 25px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  border: none;
  /* cursor: pointer; */
  width: 250px;
}

.avatar-container {
  display: flex;
  /* Usar flexbox */
  justify-content: center;
  /* Centrar horizontalmente */
  align-items: center;
  /* Centrar verticalmente */

}

.per {
  /* Puedes ajustar el tamaño de la imagen si es necesario */
  max-width: 100%;
  max-height: 100%;


}

.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.aprendices-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>