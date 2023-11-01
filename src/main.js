import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueDiff from 'vue-diff'
import 'vue-diff/dist/index.css'
import { router } from './router'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(VueDiff, {
    componentName: 'diff'
})

app.use(pinia)
app.use(router)

app.mount('#app')
