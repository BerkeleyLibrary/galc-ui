import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useResultStore } from "./results"
import { Pagination } from "../types/Pagination"

export const P8N_EMPTY: Pagination = { current: 0, records: 0, offset: 0, limit: 0 }

export const usePaginationStore = defineStore('pagination', () => {

  // TODO: can we move this in here?
  const { pagination } = storeToRefs(useResultStore())

  // --------------------------------------------------
  // Exported functions and properties

  const fromItem = computed(() => {
    const { current, limit } = pagination.value

    return ((current - 1) * limit) + 1
  })

  const toItem = computed(() => {
    const firstItem = fromItem.value
    const { limit } = pagination.value
    return firstItem + limit - 1
  })

  const totalItems = computed(() => pagination.value.records)

  const current = computed(() => pagination.value.current)

  const prev = computed(() => pagination.value.prev)

  const next = computed(() => pagination.value.next)

  const last = computed(() => pagination.value.last)

  return { fromItem, toItem, totalItems, current, prev, next, last }
})
