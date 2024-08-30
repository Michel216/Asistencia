import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'
import './style.css'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
import {router} from './routes/routes.js'
// import 'leaflet/dist/leaflet.css';

const pinia= createPinia()
pinia.use(piniaPluginPersistedstate)

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
})

myApp.use(pinia)
// Assumes you have a <div id="app"></div> in your index.html
myApp.use(router)
myApp.mount('#app')


