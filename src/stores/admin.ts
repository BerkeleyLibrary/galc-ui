import { Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { useItemsStore } from './items'
import { useClosuresStore } from './closures'

export const MODE_ITEMS = 'items'
export const MODE_CLOSURES = 'closures'

export type AdminMode = typeof MODE_ITEMS | typeof MODE_CLOSURES

export const useAdminStore = defineStore('admin', () => {
  // --------------------------------------------------
  // State

  const adminMode: Ref<AdminMode> = ref(MODE_ITEMS)
  const showInternalFields: Ref<boolean> = ref(true)

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

  const exported = { adminMode, showInternalFields, showClosures, createClosure, showItems, createItem }

  // --------------------------------------------------
  // Store definition

  return exported
})
