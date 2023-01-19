import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'
import { Item } from "../types/Item"
import { Availability } from "../types/Availability"
import { Pagination } from "../types/Pagination"
import { ItemResults } from "../types/ItemResults"
import { P8N_EMPTY } from "./pagination"

type ResultState = {
  items: Item[],
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
    // TODO: can we move this to stores/pagination.ts?
    pagination: P8N_EMPTY,
    searchPerformed: false
  })

  // --------------------------------------------------
  // Exported functions and properties

  const items = computed(() => state.value.items)

  const pagination = computed(() => state.value.pagination)

  const searchPerformed = computed(() => state.value.searchPerformed)

  const hasResults = computed(() => {
    const items = state.value.items
    return Array.isArray(items) && items.length > 0
  })

  // TODO: return a computed property?
  function getAvailability(item: { mmsId?: string }): boolean {
    const availability = state.value.availability
    const mmsId = item.mmsId
    const available = mmsId ? availability[mmsId] : false
    return !!available
  }

  function updateResults({ data, meta }: ItemResults) {
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
