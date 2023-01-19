import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from "vue"
import { P8N_EMPTY, usePaginationStore } from "../../src/stores/pagination"
import { Pagination } from "../../src/types/Pagination"

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock result store

const pagination = ref(P8N_EMPTY)
const resultStore = { pagination }

vi.mock('@/stores/results', () => {
  return {
    useResultStore: () => resultStore
  }
})

// ------------------------------------------------------------
// Tests

describe('pagination', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    pagination.value = P8N_EMPTY
  })

  describe('fromItem', () => {
    it('returns 1 when on the first page', () => {
      pagination.value = { current: 1, next: 2, last: 31, records: 921, offset: 0, limit: 30 }

      const { fromItem } = storeToRefs(usePaginationStore())
      expect(fromItem.value).toEqual(1)
    })

    it('returns the correct item number when not on the first page', () => {
      pagination.value = { current: 2, first: 1, next: 3, last: 31, records: 921, offset: 30, limit: 30 }

      const { fromItem } = storeToRefs(usePaginationStore())
      expect(fromItem.value).toEqual(31)
    })
  })

  describe('toItem', () => {
    it('returns the last item on the current page', () => {
      pagination.value = { current: 1, next: 2, last: 31, records: 921, offset: 0, limit: 30 }

      const { toItem } = storeToRefs(usePaginationStore())
      expect(toItem.value).toEqual(30)

      pagination.value = { current: 2, first: 1, next: 3, last: 31, records: 921, offset: 30, limit: 30 }
      expect(toItem.value).toEqual(60)
    })
  })

  describe('totalItems', () => {
    it('returns the total number of records', () => {
      pagination.value = { current: 1, next: 2, last: 31, records: 921, offset: 0, limit: 30 }

      const { totalItems } = storeToRefs(usePaginationStore())
      expect(totalItems.value).toEqual(921)
    })
  })

  for (const attr of ['current', 'prev', 'next', 'last']) {
    describe(attr, () => {
      it(`delegates to pagination.${attr}`, () => {
        const p8n = pagination.value
        const p8nStore = storeToRefs(usePaginationStore())

        const expectedVal = 123
        p8n[<keyof Pagination>attr] = expectedVal

        const storeVal = p8nStore[<keyof typeof p8nStore>attr].value
        expect(storeVal).toEqual(expectedVal)
      })
    })
  }
})
