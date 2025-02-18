// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { registerPlugins } from '@/plugins'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

registerPlugins(app)

app.use(vuetify).use(createPinia())

app.mount('#app')
