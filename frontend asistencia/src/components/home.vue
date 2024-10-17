<template>
  <q-layout view="hHh lpR fff">
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

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered class="my-drawer" :breakpoint="500">
      <q-scroll-area style="height: calc(100% - 150px);  border-right: 1px solid #ddd">

        <div class="avatar-container">
          <q-avatar class="large-avatar">
            <img class="per" src="/imagenes/usuario.png" style=" margin-top: 15%;" alt="perfil" />
          </q-avatar>
        </div>
        <h5>
          Bienvenid@
          <strong style="display: block;">{{ nombre }}</strong>
        </h5>
        <q-list class="drawer-content">
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
      </q-scroll-area>
      <div class="logon">
        <img class="negro" src="/imagenes/snegr.png" alt="" />
      </div>
    </q-drawer>
    <q-page-container>

      <div v-if="route.path === '/home'">
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
    </div>
    <router-view />
  </q-page-container>

    <q-footer class="bg-grey-4 text-black">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center text-h6 text-weight-bold text-subtitle1">REPFORA ASISTENCIA - Sena 2024 © Todos los derechos reservados</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
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
  {label: 'Informes', path:'/informes'}
];

// Información de las tarjetas y las rutas correspondientes
const cards = [
  { title: 'Fichas', img: '/imagenes/documentos.png', alt: 'Salud Publica', route: '/ficha' },
  { title: 'Aprendices', img: '/imagenes/estudiantes.png', alt: 'Salud Publica', route: '/aprendiz' },
  { title: 'Bitacoras', img: '/imagenes/internet.png', alt: 'Salud Publica', route: '/bitacora' },
  { title: 'Usuarios', img: '/imagenes/seguidores.png', alt: 'Salud Publica', route: '/usuario' },

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

function isActiveRoute(path) {
  return router.currentRoute.value.path == path;
}


</script>


<style scoped>
.q-drawer {
  overflow-y: auto !important;
  /* Asegura que el contenido del drawer permita scroll */
}

/* Estilos base */
.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.large-avatar {
  width: 110px;
  height: 110px;
  max-width: 100%;
}

.large-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.negro {
  width: 30%;
  height: auto;
  max-width: 100%;
}

.bg-green {
  background-color: rgb(203, 203, 203);
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
  margin: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  color: white;
  width: 100%;
  max-width: 250px;
  font-size: 16px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.custom-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;
}

.active-item {
  background-color: #005500;
  color: #ffffff;
  font-weight: bold;
}

.indicator-icon {
  color: rgb(255, 255, 255);
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
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 10px 0;
}

.card-header {
  background-color: green;
  color: #fff;
  padding: 15px;
  text-align: center;
  font-size: 18px;
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
  width: 100%;
  max-width: 200px;
  padding: 10px;
  margin: 10px auto;
  display: block;
  text-align: center;
  font-size: 16px;
  transition: box-shadow 0.3s;
}

.ver:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;
}

.pta {
  width: 40%;
  height: auto;
  max-width: 100%;
}

.q-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;
}

.footer {
  background-color: #e7e3e3;
  color: #000;
  margin-bottom: 0;
  width: 100%;
  padding: 15px 0;
  text-align: center;
}


@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .card {
    width: 90%;
    margin: 10px auto;
  }

  .custom-button {
    font-size: 14px;
  }

  .card-header {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .large-avatar {
    width: 80px;
    height: 80px;
  }

  .custom-button {
    font-size: 12px;
  }

  .ver {
    font-size: 14px;
  }
}

active-item {
  color: var(--q-primary);
  background: var(--q-grey-2);
}

@media (max-width: 1023px) {
  .q-drawer {
    width: 100% !important;
    max-width: 280px;
  }
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
