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
      <img class="per" src="/public/imagenes/usuario.png" alt="perfil " />
    </q-avatar>
  
  </div>
      
      <q-list>
        <br>
        <q-item to="./" active-class="q-item--active" class="custom-button" @click="showFichas">
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
      <img class="negro" src="/public/imagenes/snegr.png" alt="">
    </div>
  
    </q-drawer>

    <q-page-container>
      <!-- Sección de tarjetas que se muestra cuando `showCards` es verdadero -->
      <div v-if="showCards" class="container">
        <div class="card">
          <div class="card-header">Fichas</div>
          <div class="card-body">
            <img class="pta" src="/public/imagenes/documentos.png" alt="Salud Publica">
          </div>
          <hr>
          <div class="card-footer">
            <q-item to="/Ficha" active-class="q-item--active" class="ver" >
          <q-item-section>
            <button class="ver">Ver</button>
          </q-item-section>
        </q-item>
            
          </div>
        </div>
        <div class="card">
          <div class="card-header">Aprendices</div>
          <div class="card-body">
            <img class="pta" src="/public/imagenes/estudiantes.png" alt="Salud Publica">
          </div>
          <hr>
          <div class="card-footer">
            <q-item to="/aprendiz" active-class="q-item--active" class="ver" >
          <q-item-section>
            <button class="ver">Ver</button>
          </q-item-section>
        </q-item>
          </div>
        </div>
        <div class="card">
          <div class="card-header">Bitacoras</div>
          <div class="card-body">
            <img class="pta" src="/public/imagenes/internet.png" alt="Salud Publica">
          </div>
          <hr>
          <div class="card-footer">
            <q-item to="/Bitacora" active-class="q-item--active" class="ver" >
          <q-item-section>
            <button class="ver">Ver</button>
          </q-item-section>
        </q-item>
          </div>
        </div>
        <div class="card">
          <div class="card-header">Usuarios</div>
          <div class="card-body">
            <img class="pta" src="/public/imagenes/seguidores.png" alt="Salud Publica">
          </div>
          <hr>
          <div class="card-footer">
            <q-item to="/Usuario" active-class="q-item--active" class="ver" >
          <q-item-section>
            <button class="ver">Ver</button>
          </q-item-section>
        </q-item>
          </div>
        </div>
      </div>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref,  } from 'vue'
// import { useUsuariosStore } from '../stores/usuario';

const leftDrawerOpen = ref(false)
const showCards = ref(true) // Variable para controlar la visibilidad de las tarjetas
const username = ref('')


// const useUsuarios = useUsuariosStore();
// console.log(useUsuarios);
//  usuario= async () =>  {
//   usuario= useUsuarios.login()
//   console.log(usuario)
// }
// const userEmail = computed(() => useUsuarios.email);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
  // usuario()
}


</script>

<style scoped>
/* Estilos personalizados */
.avatar-container {
  display: flex; /* Usar flexbox */
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */

}

.per {
  /* Puedes ajustar el tamaño de la imagen si es necesario */
  max-width: 110%;
  max-height: 110%;

  
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
.pta{
  width: 40%;
  height: 40%;
}
/* Estilos para los botones personalizados en el drawer */
.custom-button {
  background-color: green;
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
.ver{
 
  color: #fff;
  background-color: green;
  border: none;
  border-radius: 5px;
  width: 50%;
  margin: 0 auto; /* Centrar horizontalmente */
  display: block; /* Convertir en elemento de bloque */
  text-align: center; /* Centrar texto */
}
.icon {
  color: white;
  height: 20px;
  margin-right: 10px;
}

.button-text {
  color: white;
}

/* Estilos para las tarjetas */
.container {
  display: grid;
  width: 90%;
  grid-template-columns: repeat(2, 1fr); /* 2 columnas de igual tamaño */
  grid-gap: 0px; /* Espacio entre las tarjetas */
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}


.card {
  width: 65%; /* Ancho completo del contenedor de la tarjeta */
  border: 1px solid #ccc;
  border-radius: 5px;
margin-top: 10%;
margin: 5% auto;
}

.card-header {
  background-color: green;
  color: #fff;
  padding: 10px;
  text-align: center;
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

.button {
  background-color: #28a745;
  color: #fff;
  /* padding: 10px 20px; */
  border: none;
  border-radius: 5px;
 
}



</style>
