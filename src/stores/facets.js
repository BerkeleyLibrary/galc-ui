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
          const v = !!facetExpanded.value[facetName]
          console.log('expanded(%o).get() => %o', facetName, v)
          return v
        },
        set (v) {
          const newValue = !!v
          console.log('expanded(%o).set(%o) => %o', facetName, v, newValue)
          facetExpanded.value[facetName] = newValue
        }
      })
      computedExpansionState[facetName] = expansionState
    }
    return expansionState
  }

  // ------------------------------
  // Actions

  function expandAll (expandedNames = facetNames.value) {
    console.log('expandAll(%o)', expandedNames)
    const expanded = { ...facetExpanded.value }
    for (const facetName of expandedNames) {
      expanded[facetName] = true
    }
    facetExpanded.value = expanded
  }

  function collapseAll () {
    console.log('collapseAll()')
    facetExpanded.value = {}
  }

  // ------------------------------
  // Store

  return { facets, expanded, facetNames, expandAll, collapseAll }
})
