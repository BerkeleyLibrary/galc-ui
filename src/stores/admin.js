import { ref } from 'vue'
import { defineStore } from 'pinia'

export const MODE_ITEMS = 'items'
export const MODE_CLOSURES = 'closures'

export const useAdminStore = defineStore('admin', () => {
  // --------------------------------------------------
  // State

  const adminMode = ref(MODE_ITEMS)

  // --------------------------------------------------
  // Exported functions and properties

  function showClosures () {
    adminMode.value = MODE_CLOSURES
  }

  function showItems () {
    adminMode.value = MODE_ITEMS
  }

  const exported = { adminMode, showClosures, showItems }

  // --------------------------------------------------
  // Store definition

  return exported
})
