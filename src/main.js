import { createApp, watch } from 'vue'
import './assets/scss/main.scss'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

watch(
  pinia.state,
  (state) => {
    const stateToStore = {}
    Object.keys(state).forEach((key) => {
      if (key === 'background') { // Background store does not contain relevant data for storage
        return
      }
      stateToStore[key] = state[key]
    })

    localStorage.setItem('appState', JSON.stringify(stateToStore))
  },
  { deep: true }
)

const appState = localStorage.getItem('appState')
if (appState) {
  pinia.state.value = JSON.parse(appState)
}

app.use(pinia)
app.mount('#app')
