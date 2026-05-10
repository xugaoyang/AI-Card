import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index'
import App from './App.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import './style.css'

createApp(App).use(createPinia()).use(router).mount('#app')
