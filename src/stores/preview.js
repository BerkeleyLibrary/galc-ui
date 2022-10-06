import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreviewStore = defineStore('preview', () => {
  // --------------------------------------------------
  // State

  const currentPreview = ref(null)

  // --------------------------------------------------
  // Exported functions and properties

  function startPreview (item) {
    currentPreview.value = item
  }

  function endPreview () {
    currentPreview.value = null
  }

  const exported = {
    currentPreview,
    startPreview,
    endPreview
  }

  // --------------------------------------------------
  // Store definition

  return exported
})
