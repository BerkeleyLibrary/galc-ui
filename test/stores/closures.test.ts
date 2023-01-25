import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { newEmptyClosure, useClosuresStore } from "../../src/stores/closures"
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

describe('newEmptyClosure()', () => {
  it('returns a new empty closure', () => {
    const cls = newEmptyClosure()
    expect(cls.id).toBeFalsy()
    expect(cls.startDate).toEqual('')
  })
})

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

  describe('closurePatch', () => {
    it('defaults to empty', () => {
      const { closurePatch } = storeToRefs(useClosuresStore())
      expect(closurePatch.value).toBeFalsy()
    })
  })

  describe('closed', () => {
    it('defaults to false', () => {
      const { closed } = storeToRefs(useClosuresStore())
      expect(closed.value).toEqual(false)
    })

    it('is false if no closures are current', () => {
      const { closures, closed } = storeToRefs(useClosuresStore())
      closures.value = [
        { id: '1', startDate: '01-02-2003' },
        { id: '2', startDate: '02-03-2004' }
      ]
      expect(closed.value).toEqual(false)
    })

    it('is true if any closures are current', () => {
      const { closures, closed } = storeToRefs(useClosuresStore())
      closures.value = [
        { id: '1', startDate: '01-02-2003' },
        { id: '2', startDate: '02-03-2004', current: true },
        { id: '3', startDate: '03-04-2005', current: true },
      ]
      expect(closed.value).toEqual(true)
    })
  })

  describe('reopenDate', () => {
    it('defaults to empty', () => {
      const { reopenDate } = storeToRefs(useClosuresStore())
      expect(reopenDate.value).toBeFalsy()
    })

    it('is undefined if no closures are current', () => {
      const { closures, reopenDate } = storeToRefs(useClosuresStore())
      closures.value = [
        { id: '1', startDate: '01-02-2003' },
        { id: '2', startDate: '02-03-2004' }
      ]
      expect(reopenDate.value).toBeFalsy()
    })

    it('is undefined if the first current closure has no end date', () => {
      const { closures, reopenDate } = storeToRefs(useClosuresStore())
      closures.value = [
        { id: '1', startDate: '01-02-2003' },
        { id: '2', startDate: '02-03-2004', current: true },
        { id: '3', startDate: '03-04-2004', endDate: '04-05-2004', current: true}
      ]
      expect(reopenDate.value).toBeFalsy()
    })

    it('holds the date of the first current closure', () => {
      const { closures, reopenDate } = storeToRefs(useClosuresStore())
      closures.value = [
        { id: '1', startDate: '01-02-2003' },
        { id: '2', startDate: '02-03-2004', endDate: '03-04-2005', current: true },
        { id: '3', startDate: '03-04-2004', endDate: '04-05-2004', current: true}
      ]
      expect(reopenDate.value).toEqual('03-04-2005')
    })
  })

  describe('init', () => {
    it('loads closures', async () => {
      const expectedClosures: Array<Closure> = [
        { id: '1', startDate: '01-02-2003' },
        { id: '2', startDate: '02-03-2004' }
      ]
      const results = { data: expectedClosures }
      loadClosures.mockImplementationOnce(() => Promise.resolve(results))

      const { init } = useClosuresStore()
      await init()

      const { closures } = storeToRefs(useClosuresStore())
      expect(closures.value).toEqual(expectedClosures)
    })
  })

  describe('newClosure', () => {
    it('starts editing a new empty closure', () => {
      const { newClosure } = useClosuresStore()
      const { closurePatch } = storeToRefs(useClosuresStore())
      newClosure()
      const patch = <Closure> closurePatch.value
      expect(patch.id).toBeFalsy()
      expect(patch.startDate).toEqual('')
    })
  })

  describe('editClosure', () => {
    it('edits an existing closure', () => {
      const { editClosure } = useClosuresStore()
      const { closurePatch } = storeToRefs(useClosuresStore())
      const orig = { id: '1', startDate: '01-02-2003', endDate: '02-03-2004', note: 'test' }
      editClosure(orig)
      const patch = <Closure> closurePatch.value
      expect(patch).not.toBe(orig)
      expect(patch.id).toEqual(orig.id)
      expect(patch.startDate).toEqual(orig.startDate)
      expect(patch.endDate).toEqual(orig.endDate)
      expect(patch.note).toEqual(orig.note)
    })
  })

  describe('deleteClosure', () => {
    it('deletes a closure. then reloads', async () => {
      const { deleteClosure: apiDeleteClosure } = apiStore

      const closure = { id: '1', startDate: '01-02-2003', endDate: '02-03-2004', note: 'test' }
      apiDeleteClosure.mockImplementationOnce((cls) => {
        expect(cls).toBe(closure)
        return Promise.resolve()
      })

      loadClosures.mockImplementationOnce(() => Promise.resolve({ data: [] }))

      const { deleteClosure } = useClosuresStore()
      await deleteClosure(closure)
      expect(apiDeleteClosure).toHaveBeenCalledOnce()
      expect(loadClosures).toHaveBeenCalledOnce()
    })
  })

  describe('cancelEdit', () => {
    it('stops editing', () => {
      const { editClosure, cancelEdit } = useClosuresStore()
      const { closurePatch } = storeToRefs(useClosuresStore())
      const orig = { id: '1', startDate: '01-02-2003', endDate: '02-03-2004', note: 'test' }
      editClosure(orig)
      cancelEdit()
      expect(closurePatch.value).toBeFalsy()
    })
  })

  describe('applyEdit', () => {
    it('saves, reloads, and stops editing', async () => {
      const closure = { id: '1', startDate: '01-02-2003', endDate: '02-03-2004', note: 'test' }

      saveClosure.mockImplementationOnce((cls) => {
        expect(cls).toBe(closure)
        return Promise.resolve()
      })
      const expectedClosures = [closure]
      loadClosures.mockImplementationOnce(() => {
        return Promise.resolve({ data: expectedClosures })
      })

      const { editClosure, applyEdit } = useClosuresStore()
      editClosure(closure)

      await applyEdit(closure)
      expect(saveClosure).toHaveBeenCalledOnce()

      const { closurePatch, closures } = storeToRefs(useClosuresStore())
      expect(closurePatch.value).toBeFalsy()

      expect(loadClosures).toHaveBeenCalledOnce()
      expect(closures.value).toEqual(expectedClosures)
    })
  })
})
