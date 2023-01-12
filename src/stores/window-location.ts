import {defineStore} from 'pinia'
import {computed, Ref, ref, WritableComputedRef} from 'vue'

// ------------------------------------------------------------
// Store definition

export const useWindowLocationStore = defineStore('window-location', () => {
  // ------------------------------
  // Internal state

  // NOTE: We use the string here, not the location object, because the latter
  //       is prone to changing out from under us without events that trigger
  //       Vue computed property updates
  const currentLocation: Ref<URL> = ref(new URL(window.location.href))

  // ------------------------------
  // Exported state

  const location: WritableComputedRef<URL> = computed({
    get () { return currentLocation.value },

    set (v) {
      const oldLocation = new URL(window.location.href)
      if (v !== oldLocation) {
        window.history.pushState(`location.set(${v})`, '', v)
      }
      updateState()
    }
  })

  // ------------------------------
  // Events

  // TODO: Do we care about removing listeners?
  window.addEventListener('popstate', updateState)
  window.addEventListener('hashchange', updateState)

  function updateState (_event?: Event) {
    const oldLocation = currentLocation.value
    const newLocation = new URL(window.location.href)
    if (oldLocation !== newLocation) {
      currentLocation.value = newLocation
    }
  }

  // ------------------------------
  // Store

  return { location }
})
