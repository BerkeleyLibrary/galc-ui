import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// ------------------------------------------------------------
// Store definition

export const useFacetStore = defineStore('facets', () => {
  // ------------------------------
  // State

  const facets = ref([])
  const facetExpanded = ref({})
  const computedExpansionState = {}

  // ------------------------------
  // Computed properties

  const facetNames = computed(() => { return facets.value.map(f => f.name) })

  function expanded (facetName) {
    let expansionState = computedExpansionState[facetName]
    if (!expansionState) {
      expansionState = computed({
        get () {
          return !!facetExpanded.value[facetName]
        },
        set (v) {
          facetExpanded.value[facetName] = !!v
        }
      })
      computedExpansionState[facetName] = expansionState
    }
    return expansionState
  }

  // ------------------------------
  // Actions

  function expandAll (expandedNames = facetNames.value) {
    const expanded = { ...facetExpanded.value }
    for (const facetName of expandedNames) {
      expanded[facetName] = true
    }
    facetExpanded.value = expanded
  }

  function collapseAll () {
    facetExpanded.value = {}
  }

  // ------------------------------
  // Store

  return { facets, expanded, facetNames, expandAll, collapseAll }
})
