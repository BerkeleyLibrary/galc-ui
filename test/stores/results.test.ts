import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useResultStore } from "../../src/stores/results"
import { availability as availMeta, items as itemData, pagination as pageMeta } from "../data/items"

// ------------------------------------------------------------
// Tests

describe('results', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('items', () => {
    it('defaults to an empty list', () => {
      const { items: storeItems } = storeToRefs(useResultStore())
      const items = storeItems.value
      expect(items).toHaveLength(0)
    })
  })

  describe('pagination', () => {
    it('defaults to an empty object', () => {
      const { pagination: storePagination } = storeToRefs(useResultStore())
      const pagination = storePagination.value

      expect(!!pagination.current).toEqual(false)
      expect(!!pagination.limit).toEqual(false)
      expect(!!pagination.records).toEqual(false)
    })
  })

  describe('searchPerformed', () => {
    it('defaults to false', () => {
      const { searchPerformed } = storeToRefs(useResultStore())
      expect(searchPerformed.value).toEqual(false)
    })
  })

  describe('hasResults', () => {
    it('defaults to false', () => {
      const { hasResults } = storeToRefs(useResultStore())
      expect(hasResults.value).toEqual(false)
    })
  })

  describe('updateResults', () => {
    it('updates the results', () => {
      const { updateResults } = useResultStore()
      const results = {
        data: itemData,
        meta: {
          availability: availMeta,
          pagination: pageMeta
        }
      }
      updateResults(results)

      const { items, pagination, searchPerformed, hasResults } = storeToRefs(useResultStore())
      expect(items.value).toEqual(itemData)
      expect(pagination.value).toEqual(pageMeta)
      expect(searchPerformed.value).toEqual(true)
      expect(hasResults.value).toEqual(true)
    })
  })
})
