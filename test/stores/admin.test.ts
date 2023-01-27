import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MODE_CLOSURES, MODE_ITEMS, useAdminStore } from "../../src/stores/admin"

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock items store

const newItem = vi.fn()
const itemsStore = { newItem }

vi.mock('@/stores/items', () => {
  return {
    useItemsStore: () => itemsStore
  }
})

// ------------------------------
// Mock closures store

const newClosure = vi.fn()
const closuresStore = { newClosure }

vi.mock('@/stores/closures', () => {
  return {
    useClosuresStore: () => closuresStore
  }
})

// ------------------------------------------------------------
// Tests

describe('admin', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('adminMode', () => {
    it('defaults to MODE_ITEMS', () => {
      const { adminMode } = storeToRefs(useAdminStore())
      expect(adminMode.value).toEqual(MODE_ITEMS)
    })

    describe('showClosures', () => {
      it('sets the mode to MODE_CLOSURES', () => {
        const { showClosures } = useAdminStore()
        showClosures()

        const { adminMode } = storeToRefs(useAdminStore())
        expect(adminMode.value).toEqual(MODE_CLOSURES)
      })
    })

    describe('showItems', () => {
      it('sets the mode to MODE_ITEMS', () => {
        const { showClosures, showItems } = useAdminStore()
        showClosures()
        showItems()
        const { adminMode } = storeToRefs(useAdminStore())
        expect(adminMode.value).toEqual(MODE_ITEMS)
      })
    })
  })

  describe('showInternalFields', () => {
    it('defaults to true', () => {
      const { showInternalFields } = storeToRefs(useAdminStore())
      expect(showInternalFields.value).toEqual(true)
    })
  })

  describe('createItem', () => {
    it('creates an item', () => {
      const { createItem } = useAdminStore()

      createItem()
      expect(newItem).toHaveBeenCalledOnce()
    })

    it('sets MODE_ITEMS if not in that mode', () => {
      const { showClosures, createItem } = useAdminStore()

      showClosures()
      createItem()
      const { adminMode } = storeToRefs(useAdminStore())
      expect(adminMode.value).toEqual(MODE_ITEMS)
    })
  })

  describe('createClosure', () => {
    it('creates an closure', () => {
      const { createClosure } = useAdminStore()

      createClosure()
      expect(newClosure).toHaveBeenCalledOnce()
    })

    it('sets MODE_CLOSURES if not in that mode', () => {
      const { showItems, createClosure } = useAdminStore()

      showItems()
      createClosure()
      const { adminMode } = storeToRefs(useAdminStore())
      expect(adminMode.value).toEqual(MODE_CLOSURES)
    })
  })
})
