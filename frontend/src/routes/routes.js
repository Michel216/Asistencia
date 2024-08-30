import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/home.vue';
import Aprendiz from '../components/aprendiz.vue';
import Ficha from '../components/Fichas.vue';
import Login from '../components/login.vue';
import Usuario from '../components/Usuarios.vue';
import Bitacora from '../components/bitacoras.vue';
import RecuperarContraseña from '../components/recuperarContraseña.vue';
import registroAprendiz from '../components/registroAprendiz.vue';


const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home,  },
  { path: '/ficha', component: Ficha,  },
  { path: '/usuario', component: Usuario,  },
  { path: '/bitacora', component: Bitacora,  },
  { path: '/aprendiz', component: Aprendiz,  },
  { path: '/recuperarContraseña', component: RecuperarContraseña },
  { path: '/registro', component: registroAprendiz }
];

export const router = createRouter({
  history: createWebHistory(),  // Cambia a createWebHashHistory si prefieres el hash mode
  routes
});


