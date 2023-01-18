import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useItemsStore } from "../../src/stores/items"
import { Item, ItemEntry } from "../../src/types/Item"
import { Image } from "../../src/types/Image"
import { items as itemData } from "../data/items"
import { Term } from "../../src/types/Term"

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

// ------------------------------
// Mock search store

const searchStore = {}

vi.mock('@/stores/search', () => {
  return {
    useSearchStore: () => searchStore
  }
})

// ------------------------------
// Mock result store

const resultStore = {}

vi.mock('@/stores/results', () => {
  return {
    useResultStore: () => resultStore
  }
})

// ------------------------------------------------------------
// Tests

describe('items', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('itemPatch', () => {
    it('defaults to undefined', () => {
      const { itemPatch } = storeToRefs(useItemsStore())
      const patch = itemPatch.value
      expect(!!patch).toEqual(false)
    })
  })

  describe('newItem()', () => {
    it('initializes the patch to a new empty item', () => {
      const itemsStore = useItemsStore()

      const { newItem } = itemsStore
      newItem()

      const { itemPatch } = storeToRefs(itemsStore)
      const patch = <Item> itemPatch.value
      expect(!!patch.id).toEqual(false)

      const terms = patch.terms
      expect(terms).toHaveLength(0)

      const image = <Image> patch.image
      expect(!!image.id).toEqual(false)
    })
  })

  describe('editItem()', () => {
    it('initializes the patch to a clone of an item', () => {
      const itemsStore = useItemsStore()
      const { editItem } = itemsStore

      const item = itemData[0]
      editItem(item)

      const { itemPatch } = storeToRefs(itemsStore)
      const patch = <Item> itemPatch.value

      for (const [attr, expected] of <[ItemEntry]> Object.entries(item)) {
        const actual = patch[attr]
        if (attr == 'terms') {
          const expectedTerms = <[Term]> expected
          const actualTerms = <[Term]> actual
          for (let i = 0; i < expectedTerms.length; i++) {
            const expectedTerm = expectedTerms[i]
            const actualTerm = actualTerms[i]
            expect(actualTerm).toEqual(expectedTerm)
          }
        } else {
          expect(actual).toEqual(expected)
        }
      }
    })
  })
})
