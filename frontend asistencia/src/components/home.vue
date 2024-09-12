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
        <q-avatar class="large-avatar">
          <img class="per" src="/imagenes/usuario.png" alt="perfil" />
        </q-avatar>

      </div>
      <h5>Bienvenid@ <strong>{{ nombre }}</strong></h5>
      <q-list>
        <br>
        <q-item v-for="item in menuItems" :key="item.label" :to="item.path" active-class="active-item"
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
        <img class="negro" src="/imagenes/snegr.png" alt="">
      </div>
    </q-drawer>

    <q-page-container>
      <div v-if="showCards" class="container">
        <div v-for="(card, index) in cards" :key="index" class="card">
          <div class="card-header">{{ card.title }}</div>
          <div class="card-body">
            <img class="pta" :src="card.img" :alt="card.alt">
          </div>
          <div class="card-footer">
            <q-btn :loading="isLoading[index]" @click="handleClick(index, card.route)" class="ver">Abrir</q-btn>
          </div>
        </div>
      </div>

      <router-view />
      <div class="footer">
          <div class="text-h7 text-weight-bold">
              ASISTENCIA SENA - Sena 2024 © Todos los derechos reservados
          </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUsuariosStore } from '../stores/usuario.js';
import { useRoute, useRouter } from 'vue-router';

// Extrae InfoUser del store
const { InfoUser } = useUsuariosStore();
console.log(InfoUser);

// Computed para garantizar la reactividad y mostrarlo en el template
const nombre = computed(() => InfoUser[0]);

const leftDrawerOpen = ref(false);
const showCards = ref(true);
const route = useRoute();
const router = useRouter();

// Arreglo para controlar el estado de carga de cada botón individualmente
const isLoading = ref([false, false, false, false]);

// Menú con rutas y etiquetas
const menuItems = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Aprendices', path: '/aprendiz', icon: 'school' },
  { label: 'Bitacora', path: '/bitacora', icon: 'library_books' },
  { label: 'Fichas', path: '/ficha', icon: 'folder' },
  { label: 'Usuarios', path: '/usuario', icon: 'people' },
  { label: 'Registro Asistencia', path: '/registro', icon: 'assignment' }
];

// Información de las tarjetas y las rutas correspondientes
const cards = [
  { title: 'Fichas', img: '/imagenes/documentos.png', alt: 'Salud Publica', route: '/ficha' },
  { title: 'Aprendices', img: '/imagenes/estudiantes.png', alt: 'Salud Publica', route: '/aprendiz' },
  { title: 'Bitacoras', img: '/imagenes/internet.png', alt: 'Salud Publica', route: '/bitacora' },
  { title: 'Usuarios', img: '/imagenes/seguidores.png', alt: 'Salud Publica', route: '/usuario' }
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Función para gestionar el estado del spinner de cada botón individualmente y navegar
function handleClick(index, route) {
  isLoading.value[index] = true;
  setTimeout(() => {
    isLoading.value[index] = false;
    router.push(route);
  }, 2000);
}

// Verifica si la ruta actual está activa
function isActiveRoute(path) {
  return route.path === path;
}
</script>


<style scoped>
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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

.bg-green {
  background-color: green;
}

.text-white {
  color: white;
}

.q-toolbar-title {
  display: flex;
  align-items: center;
}

.icon {
  color: white;
  height: 20px;
  margin-right: 10px;
}

.button-text {
  color: white;
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

.custom-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;

}

.active-item {
  background-color: #005500;
  /* Fondo más oscuro para la ventana activa */
  color: #ffffff;
  /* Cambia esto por el color que desees */
  font-weight: bold;
}

.indicator-icon {
  color: rgb(255, 255, 255);
  /* Color del ícono indicador */
  margin-left: 5px;

}

.container {
  display: grid;
  width: 90%;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.card {
  width: 65%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10%;
  margin: 5% auto;
}

.card-header {
  background-color: green;
  color: #fff;
  height: 60px;
  text-align: center;
  align-content: center;
  font-size: 160%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.card-body {
  padding: 10px;
  text-align: center;
}

.card-footer {
  padding: 10px;
  text-align: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.ver {
  color: #fff;
  background-color: green;
  border: none;
  border-radius: 5px;
  width: 35%;
  height: 10px;
  margin: auto auto;
  display: block;
  /* padding-top: 20px; */
  align-content: center;
  text-align: center;
  font-size: 110%;
  transition: box-shadow 0.3s;
}

.ver:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;

}

.pta {
  width: 40%;
  height: 40%;
}

.q-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;

}
.footer {
  background-color: #e7e3e3; /* Color de fondo del pie de página */
  color: #000; /* Color del texto del pie de página */
  margin-bottom: 0;
  width: 100%;
  height: 45px;
  align-content: center;
text-align: center;
}
</style>
