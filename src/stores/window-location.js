import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// ------------------------------------------------------------
// Store definition

export const useWindowLocationStore = defineStore('window-location', () => {
  // ------------------------------
  // Internal state

  // NOTE: We use the string here, not the location object, because the latter
  //       is prone to changing out from under us without events that trigger
  //       Vue computed property updates
  const currentLocation = ref(new URL(window.location.toString()))

  // ------------------------------
  // Exported state

  const location = computed({
    get () { return currentLocation.value },

    set (v) {
      // console.log('location.set(%o)', v)
      const oldLocation = window.location.toString()
      if (v !== oldLocation) {
        // console.log('pushing location %o', v)
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

  function updateState (_event) {
    const oldLocation = currentLocation.value.toString()
    const newLocation = window.location.toString()
    // console.log('oldLocation: %o, newLocation: %o', oldLocation, newLocation)
    if (oldLocation !== newLocation) {
      currentLocation.value = newLocation
    }
  }

  // ------------------------------
  // Store

  return { location }
})
