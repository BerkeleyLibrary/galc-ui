import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClosuresStore } from "../../src/stores/closures"
import { Closure } from "../../src/types/Closure"

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock api store

const loadClosures = vi.fn()
const saveClosure = vi.fn()
const deleteClosure = vi.fn()
const apiStore = { loadClosures, saveClosure, deleteClosure }

vi.mock('@/stores/api', () => {
  return {
    useApiStore: () => apiStore
  }
})

// ------------------------------------------------------------
// Tests

describe('closures', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('closures', () => {
    it('defaults to an empty list', () => {
      const { closures } = storeToRefs(useClosuresStore())
      expect(closures.value).toHaveLength(0)
    })
  })

  describe('init', () => {
    it('loads closures', async () => {
      const expectedClosures: Array<Closure> = [
        { id: '1' },
        { id: '2' }
      ]
      const results = { data: expectedClosures }
      loadClosures.mockImplementationOnce(() => Promise.resolve(results))

      const { init } = useClosuresStore()
      await init()

      const { closures } = storeToRefs(useClosuresStore())
      expect(closures.value).toEqual(expectedClosures)
    })
  })
})
