import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useResultStore } from "../../src/stores/results"
import { items as itemData, availability as availData, pagination as pageData, results as resultsData } from "../data/items"

// ------------------------------------------------------------
// Tests

describe('results', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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

      expect(pagination.current).toBeFalsy()
      expect(pagination.limit).toBeFalsy()
      expect(pagination.records).toBeFalsy()
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
      updateResults(resultsData)

      const { items, pagination, searchPerformed, hasResults } = storeToRefs(useResultStore())
      expect(items.value).toEqual(itemData)
      expect(pagination.value).toEqual(pageData)
      expect(searchPerformed.value).toEqual(true)
      expect(hasResults.value).toEqual(true)
    })
  })

  describe('getAvailability', () => {
    it('defaults to false(y)', () => {
      const { getAvailability } = useResultStore()
      const mmsId = Object.keys(availData)[0]
      const available = getAvailability({ mmsId })
      expect(available).toBeFalsy()
    })

    it('returns the availablity', () => {
      const { getAvailability, updateResults } = useResultStore()
      updateResults(resultsData)

      const mmsIds = itemData.map((it) => it.mmsId)
      for (const mmsId of mmsIds) {
        const expected: boolean = mmsId ? !!availData[mmsId] : false
        const actual = getAvailability({ mmsId })
        expect(actual).toEqual(expected)
      }
    })
  })
})
