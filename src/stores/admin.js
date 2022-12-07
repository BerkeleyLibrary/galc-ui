import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useItemsStore } from './items'
import { useClosuresStore } from './closures'

export const MODE_ITEMS = 'items'
export const MODE_CLOSURES = 'closures'

export const useAdminStore = defineStore('admin', () => {
  // --------------------------------------------------
  // State

  const adminMode = ref(MODE_ITEMS)
  const showHiddenFields = ref(true)

  // --------------------------------------------------
  // Exported functions and properties

  function showClosures () {
    adminMode.value = MODE_CLOSURES
  }

  function showItems () {
    adminMode.value = MODE_ITEMS
  }

  function createItem () {
    const { newItem } = useItemsStore()
    newItem()
    showItems()
  }

  function createClosure () {
    const { newClosure } = useClosuresStore()
    newClosure()
    showClosures()
  }

  const exported = { adminMode, showHiddenFields, showClosures, createClosure, showItems, createItem }

  // --------------------------------------------------
  // Store definition

  return exported
})
