import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

function initGalcApp () {
  const appContainerId = 'galc-app'
  const appContainer = document.getElementById(appContainerId)
  if (!appContainer) {
    return
  }
  const apiBaseUrl = appContainer.dataset.apiBaseUrl
  const app = createApp(App, { apiBaseUrl })
  app.use(createPinia())
  app.mount(appContainer)
}

window.addEventListener('load', initGalcApp)
