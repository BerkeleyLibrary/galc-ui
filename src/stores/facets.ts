import { defineStore } from 'pinia'
import { computed, Ref, ref, WritableComputedRef } from 'vue'
import { Facet } from "../types/Facet"

// ------------------------------------------------------------
// Store definition

export const useFacetStore = defineStore('facets', () => {
  // ------------------------------
  // State

  const facets: Ref<Facet[]> = ref([])
  const facetExpanded: Ref<{ [key: string]: boolean | undefined }> = ref({})
  const computedExpansionState: { [key: string]: WritableComputedRef<boolean> } = {}
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700
  const facetsOpen = ref(!isMobile)

  // ------------------------------
  // Computed properties

  const facetNames = computed(() => { return facets.value.map(f => f.name) })

  function toggleFacets() {
    facetsOpen.value = !facetsOpen.value
  }

  function expanded(facetName: string) {
    let expansionState = computedExpansionState[facetName]
    if (!expansionState) {
      expansionState = computed({
        get(): boolean {
          return !!facetExpanded.value[facetName]
        },
        set(v: boolean) {
          facetExpanded.value[facetName] = v
        }
      })
      computedExpansionState[facetName] = expansionState
    }
    return expansionState
  }

  // ------------------------------
  // Actions

  function expandAll(expandedNames = facetNames.value) {
    const expanded = { ...facetExpanded.value }
    for (const facetName of expandedNames) {
      expanded[facetName] = true
    }
    facetExpanded.value = expanded
  }

  function collapseAll() {
    facetExpanded.value = {}
  }

  function facetForName(name: string): Facet | undefined {
    return facets.value.find((f) => f.name === name)
  }

  // ------------------------------
  // Store

  return { facets, expanded, facetNames, facetForName, expandAll, collapseAll, facetsOpen, toggleFacets }
})
