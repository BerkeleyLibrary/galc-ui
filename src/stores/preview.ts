import { defineStore } from 'pinia'
import {Ref, ref} from 'vue'
import {Item} from "../types/Item";

export const usePreviewStore = defineStore('preview', () => {
  // --------------------------------------------------
  // State

  const currentPreview: Ref<Item|null> = ref(null)

  // --------------------------------------------------
  // Exported functions and properties

  function startPreview (item: Item) {
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
