<template>
 <q-layout view="hHh lpR lFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar style="background-color: green;">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Asistencia
        </q-toolbar-title>

        <q-item to="/" active-class="q-item--active" class="custom-button">
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
      <q-avatar style="padding: 5px;">
        <img src="/public/imagenes/usuario.png" alt="Logo SENA" />
      </q-avatar>
      <q-list>
        <br>

 <router-link to="/home" class="q-item q-item--active custom-button">
          <q-item>
            <q-item-section avatar>
              <q-icon name="home" class="icon" />
            </q-item-section>
            <q-item-section>
              <span class="button-text">Home</span>
            </q-item-section>
          </q-item>
        </router-link>

 <router-link to="/ficha" class="q-item q-item--active custom-button">
          <q-item>
            <q-item-section avatar>
              <q-icon name="people" class="icon" />
            </q-item-section>
            <q-item-section>
              <span class="button-text">Fichas</span>
            </q-item-section>
          </q-item>
        </router-link>

  <router-link to="/bitacora" class="q-item q-item--active custom-button">
          <q-item>
            <q-item-section avatar>
              <q-icon name="people" class="icon" />
            </q-item-section>
            <q-item-section>
              <span class="button-text">Bitacora</span>
            </q-item-section>
          </q-item>
        </router-link>

      <router-link to="/usuario" class="q-item q-item--active custom-button">
          <q-item>
            <q-item-section avatar>
              <q-icon name="home" class="icon" />
            </q-item-section>
            <q-item-section>
              <span class="button-text">Usuarios</span>
            </q-item-section>
          </q-item>
        </router-link>

        <router-link to="/aprendiz" class="q-item q-item--active custom-button">
          <q-item>
            <q-item-section avatar>
              <q-icon name="home" class="icon" />
            </q-item-section>
            <q-item-section>
              <span class="button-text">Aprendices</span>
            </q-item-section>
          </q-item>
        </router-link>

      </q-list>
      <div class="logon">
      <img class="negro" src="/public/imagenes/snegr.png" alt="">
    </div>
    </q-drawer>


    <q-page-container>
      <div class="usuarios-container q-pa-md">
        <h4 class="text-center">Usuarios</h4>
    <div class="q-pa-md">
      <div style="display: flex; justify-content: end;">
        <q-btn @click="abrirModal()" color="green">Agregar Usuario </q-btn>
      </div>
      <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props"><q-btn flat icon="edit" @click="abrirModal(props.row)" />
            <!-- <q-btn @click="abrirModal(props.row)" color="primary">📝</q-btn> -->
            <q-btn @click="desactivar(props.row.codigo)" v-if="props.row.estado == 1">❌</q-btn>
            <q-btn @click="activar(props.row.codigo)" v-else >✅</q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-estado1="props">
          <q-td :props="props">
            <p :style="{ backgroundColor: 'darkgreen', color: 'white', borderRadius: '10px', width: '100px', height: '20px', textAlign: 'center' }"
              v-if="props.row.estado == 1">activo</p>
            <p :style="{ backgroundColor: ' red', color: 'white', borderRadius: '10px', width: '100px', height: '20px', textAlign: 'center' }"
              v-else>inactivo</p>
  
          </q-td>
        </template>
      </q-table>
      <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
        transition-hide="rotate" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6" v-if="b == true">Editar Usuario</div>
            <div class="text-h6" v-else> Guardar Usuario </div>
          </q-card-section>
  
          <q-separator />
  
          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input filled v-model="codigo" label="Codigo Del Usuario" :dense="dense" />
            <q-input filled v-model="nombre" label="Nombre Del Usuario" :dense="dense" />
          </q-card-section>
  
          <q-separator />
  
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup @click="fixed.value = false" />
            <q-btn flat label="Guardar" color="primary" @click="crearUsuario()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <!-- //boton de estado estilo quasar -->
  
  
  
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
  import { useUsuariosStore } from '../stores/usuario.js';
  
  
  let useUsuario = useUsuariosStore()
  
  let $q = useQuasar()
  let r = ref("")
  let fixed = ref(false)
  let email = ref("");
  let nombre = ref("");
  // let error =ref("")
  let b = ref(false);
  
  let selectedId = ref(""); // Almacena el ID de la Usuario seleccionada
  let rows = ref([])
  
  onBeforeMount(() => {
    traer()
  })
  
  function abrirModal(row = null) {
    if (row) {
      // Modo edición
      selectedId.value = row._id || ''  // Asigna el ID de la Usuario
      email.value = row.email || ''
      nombre.value = row.nombre || ''
      b.value = true
    } else {
      // Modo creación
      selectedId.value = '' // Limpia el ID
      email.value = ''
      nombre.value = ''
      b.value = false
    }
    fixed.value = true
  }
  async function login(){
    let res = await useUsuario.login()
  }
  async function traer() {
    let res = await useUsuario.listarUsuarios()
    rows.value = res.data
  }
  async function activar(id) {
    await useUsuario.activarUsuarios(id)
    traer()
  }
  async function desactivar(id) {
    await useUsuario.desactivarUsuarios(id)
    traer()
  }
  async function crearUsuario() {
    console.log(b.value);
    if (b.value === true) {
      console.log("estoy editando...");
      if (!selectedId.value) {
        console.error("ID de la Usuario no está disponible")
        return
      }
  
      try {
        let res = await useUsuario.modificarUsuario(selectedId.value, email.value, nombre.value)
        console.log('Respuesta del servidor (modificar):', res.data)
        await traer()
        fixed.value = false
        b.value = false
      } catch (error) {
        console.error("Error al modificar la Usuario:", error)
      }
    }else {
        try {
          let res = await useUsuario.guardarUsuario(email.value, nombre.value);
          console.log('Respuesta del servidor (guardar):', res);
          await traer();
          fixed.value = false;
        } catch (error) {
          console.error("Error al guardar la Usuario:", error);
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
  ]
  
  

  
  </script>

<style>
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
  /* cursor: pointer; */
  width: 250px;
}
.icon {
  color: white;
  height: 20px;
  margin-right: 10px;
}

.button-text {
  color: white;
}

</style>
