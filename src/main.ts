import './assets/main.css'
// Import shared global styles
import '@/shared/styles/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/features/identity'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.use(vuetify)
  const auth = useAuthStore()
  await auth.initAuth()
  app.mount('#app')
}

bootstrap()
