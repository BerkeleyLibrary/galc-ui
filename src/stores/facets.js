import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// ------------------------------------------------------------
// Store definition

export const useFacetStore = defineStore('facets', () => {
  // ------------------------------
  // State

  const facets = ref([])
  const facetExpanded = ref({})

  // ------------------------------
  // Getters

  const expanded = (facetName) => computed({
    get () {
      return !!facetExpanded.value[facetName]
    },
    set (v) {
      facetExpanded.value[facetName] = !!v
    }
  })

  const facetNames = computed(() => { return facets.value.map(f => f.name) })

  // ------------------------------
  // Actions

  function collapseAll () {
    facetExpanded.value = {}
  }

  // ------------------------------
  // Store

  return { facets, expanded, facetNames, collapseAll }
})
