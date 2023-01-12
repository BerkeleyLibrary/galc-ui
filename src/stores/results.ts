import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'
import { Item } from "../types/Item"
import { Availability } from "../types/Availability"
import { Pagination } from "../types/Pagination"
import { ItemResults } from "../types/ItemResults"

type ResultState = {
  items: Array<Item>,
  availability: Availability,
  pagination: Pagination,
  searchPerformed: boolean
}

export const useResultStore = defineStore('results', () => {
  // --------------------------------------------------
  // State

  // NOTE: We encapsulate the result state in one ref() so we can update it atomically (TODO: is that necessary?)
  const state: Ref<ResultState> = ref({
    items: [],
    availability: {},
    pagination: {},
    searchPerformed: false
  })

  // --------------------------------------------------
  // Exported functions and properties

  const items = computed(() => {
    return state.value.items
  })
  const pagination = computed(() => { return state.value.pagination })
  const searchPerformed = computed(() => { return state.value.searchPerformed })

  const hasResults = computed(() => {
    const items = state.value.items
    return Array.isArray(items) && items.length > 0
  })

  function getAvailability (item: Item): boolean | undefined {
    const mmsId = item.mmsId
    if (mmsId) {
      return state.value.availability[mmsId]
    }
  }

  function updateResults ({ data, meta }: ItemResults) {
    state.value = {
      items: data,
      availability: meta.availability,
      pagination: meta.pagination,
      searchPerformed: true
    }
  }

  const exported = { items, pagination, hasResults, searchPerformed, getAvailability, updateResults }

  // --------------------------------------------------
  // Internal functions and properties

  // --------------------------------------------------
  // Store definition

  return exported
})
