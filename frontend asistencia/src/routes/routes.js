import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../components/home.vue';
import Aprendiz from '../components/aprendiz.vue';
import Ficha from '../components/Fichas.vue';
import Login from '../components/login.vue';
import Usuario from '../components/Usuarios.vue';
import Bitacora from '../components/bitacoras.vue';
import Informes from '../components/informes.vue'; 
import RecuperarContraseñaEmail from '../components/recuperarContraseñaEmail.vue';
import registroAprendiz from '../components/registroAprendiz.vue';
import documentoPrevio from '../components/documentoPrevio.vue';
import RecuperarContraseñaNueva from '../components/recuperarContraseñaNueva.vue';

const routes = [
  { path: '/home', component: Home, children:[
    { path: '/ficha', component: Ficha, },
    { path: '/usuario', component: Usuario, },
    { path: '/bitacora', component: Bitacora, },
    { path: '/aprendiz', component: Aprendiz, },
    { path: '/informes', component: Informes, },
  ] },
  { path: '/', component: Login },
  { path: '/recuperarContraseñaEmail', component: RecuperarContraseñaEmail },
  { path: '/recuperarContrasena/:token', component: RecuperarContraseñaNueva },
  { path: '/registro', component: registroAprendiz },
  { path: '/documento', component: documentoPrevio }
];

export const router = createRouter({
  history: createWebHashHistory(),  // Cambia a createWebHashHistory si prefieres el hash mode
  routes
});



