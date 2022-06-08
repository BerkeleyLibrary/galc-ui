import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useMachine } from 'xstate-vue'
import { resultsMachine } from '../state/results'

export const useResultStore = defineStore('results', () => {
  // --------------------------------------------------
  // State

  const state = ref({
    items: [],
    availability: {},
    pagination: {}
  })

  const resultState = useMachine(resultsMachine)
  const service = resultState.service
  service.onTransition((state) => console.log('resultState.onTransition(%o)', state.value))
  service.start()

  // --------------------------------------------------
  // Exported functions and properties

  const items = computed(() => { return state.value.items })
  const availability = computed(() => { return state.value.availablity })
  const pagination = computed(() => { return state.value.pagination })

  const hasResults = computed(() => {
    const items = state.value.items
    return Array.isArray(items) && items.length > 0
  })

  const showingResults = computed(() => {
    const stateValue = resultState.state.value
    return stateValue.matches('showing_results')
  })

  function getAvailability (item) {
    return state.value.availability[item.mmsId]
  }

  function updateResults ({ data, meta }) {
    state.value = {
      items: data,
      availability: meta.availability,
      pagination: meta.pagination
    }
    resultState.send('SEARCH_PERFORMED')
  }

  const exported = { items, availability, pagination, hasResults, showingResults, getAvailability, updateResults }

  // --------------------------------------------------
  // Store definition

  return exported
})
