import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useResultStore = defineStore('results', () => {
  // --------------------------------------------------
  // State

  // NOTE: We encapsulate the result state in one ref() so we can update it atomically
  // TODO: Is that really necessary?
  const state = ref({
    items: [],
    availability: {},
    pagination: {},
    searchPerformed: false
  })

  // --------------------------------------------------
  // Exported functions and properties

  const items = computed(() => { return state.value.items })
  const availability = computed(() => { return state.value.availablity })
  const pagination = computed(() => { return state.value.pagination })
  const searchPerformed = computed(() => { return state.value.searchPerformed })

  const hasResults = computed(() => {
    const items = state.value.items
    return Array.isArray(items) && items.length > 0
  })

  function getAvailability (item) {
    return state.value.availability[item.mmsId]
  }

  function updateResults ({ data, meta }) {
    state.value = {
      items: data,
      availability: meta.availability,
      pagination: meta.pagination,
      searchPerformed: true
    }
  }

  const exported = { items, availability, pagination, hasResults, searchPerformed, getAvailability, updateResults }

  // --------------------------------------------------
  // Internal functions and properties

  // --------------------------------------------------
  // Store definition

  return exported
})
