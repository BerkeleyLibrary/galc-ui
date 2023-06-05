import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { newEmptyImage, newPatch, useItemsStore } from "../../src/stores/items"
import { Item, ItemEntry } from "../../src/types/Item"
import { Image } from "../../src/types/Image"
import { items as itemData } from "../data/items"
import { Term } from "../../src/types/Term"
import { Result } from "../../src/types/GalcApi"
import { ref } from "vue"

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock api store

const saveItem: Mock<[Item], Promise<Result<Item>>> = vi.fn()
const deleteItem = vi.fn()
const apiStore = { saveItem, deleteItem }

vi.mock('@/stores/api', () => {
  return {
    useApiStore: () => apiStore,
  }
})

// ------------------------------
// Mock search store

const refreshSearch: Mock<[], Promise<void>> = vi.fn()
const searchStore = { refreshSearch }

vi.mock('@/stores/search', () => {
  return {
    useSearchStore: () => searchStore
  }
})

// ------------------------------
// Mock result store

const resultStore = {
  items: ref(<Item[]>[])
}

vi.mock('@/stores/results', () => {
  return {
    useResultStore: () => resultStore
  }
})

// ------------------------------
// Helper methods

function assertCopyOf(expected: Item, actual: Item | undefined) {
  // TODO: check that it's not a proxy for the original
  expect(expected).not.toBe(actual)

  for (const [attr, expVal] of <[ItemEntry]>Object.entries(expected)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actVal = actual![attr]
    if (attr == 'terms') {
      const expectedTerms = <[Term]>expVal
      const actualTerms = <[Term]>actVal
      for (let i = 0; i < expectedTerms.length; i++) {
        const expectedTerm = expectedTerms[i]
        const actualTerm = actualTerms[i]
        expect(actualTerm).toEqual(expectedTerm)
      }
    } else {
      expect(actVal).toEqual(expVal)
    }
  }
}

// ------------------------------------------------------------
// Tests

describe('newEmptyImage()', () => {
  it('returns a new, empty image', () => {
    const img = newEmptyImage()
    expect(img).toBeTypeOf('object')
    expect(img.id).toBeUndefined()
    expect(img.thumbnail).toBeUndefined()
    expect(img.basename).toBeUndefined()
    expect(img.links).toBeUndefined()
  })
})

describe('items', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('newPatch', () => {
    it('returns a copy of the original item', () => {
      const item = itemData[0]
      const patch = newPatch(item)
      assertCopyOf(item, patch)
    })
  })

  describe('itemPatch', () => {
    it('defaults to empty', () => {
      const { itemPatch } = storeToRefs(useItemsStore())
      const patch = itemPatch.value
      expect(patch).toBeFalsy()
    })
  })

  describe('newItem()', () => {
    it('initializes the patch to a new empty item', () => {
      const itemsStore = useItemsStore()

      const { newItem } = itemsStore
      newItem()

      const { itemPatch } = storeToRefs(itemsStore)
      const patch = <Item>itemPatch.value
      expect(patch.id).toBeFalsy()

      const terms = patch.terms
      expect(terms).toHaveLength(0)

      const image = <Image>patch.image
      expect(image.id).toBeFalsy()
    })
  })

  describe('editItem()', () => {
    it('initializes the patch to a clone of an item', () => {
      const itemsStore = useItemsStore()
      const { editItem } = itemsStore

      const item = itemData[0]
      editItem(item)

      const { itemPatch } = storeToRefs(itemsStore)
      const patch = <Item>itemPatch.value
      assertCopyOf(item, patch)
    })
  })

  describe('applyEdit()', () => {
    it('saves the specified item', async () => {
      const itemsStore = useItemsStore()
      const { applyEdit } = itemsStore

      const { itemPatch } = storeToRefs(itemsStore)
      const patch = newPatch(itemData[0])
      itemPatch.value = patch

      saveItem.mockImplementationOnce((it) => {
        expect(it).toEqual(patch)
        return Promise.resolve({ data: newPatch(patch) })
      })
      refreshSearch.mockImplementationOnce(() => Promise.resolve())

      await applyEdit(patch)

      expect(saveItem).toHaveBeenCalledOnce()
      expect(refreshSearch).toHaveBeenCalledOnce()
    })
  })

  describe('revertEdit()', () => {
    it('reverts changes when editing an existing item', () => {
      const itemsStore = useItemsStore()

      const { itemPatch } = storeToRefs(itemsStore)
      const originalItem = itemData[0]
      const patch = newPatch(originalItem)
      itemPatch.value = patch

      for (const [attr, origVal] of <[ItemEntry]>Object.entries(originalItem)) {
        if (attr == 'id') {
          continue
        }
        if (attr == 'terms') {
          patch.terms = (<Term[]>origVal).filter((_t, i) => i % 2 == 0)
        } else if (attr == 'suppressed') {
          patch.suppressed = !(<boolean>origVal)
        } else if (attr == 'image') {
          patch.image = { id: `999${origVal}` }
        } else {
          patch[attr] = `edited ${origVal}`
        }
      }

      resultStore.items.value = itemData
      const { revertEdit } = itemsStore
      revertEdit()
      expect(itemPatch.value).not.toBe(patch)
      assertCopyOf(originalItem, itemPatch.value)
    })

    it('clears the patch when editing a new item', () => {
      const itemsStore = useItemsStore()
      const { itemPatch } = storeToRefs(itemsStore)
      const { newItem, revertEdit } = itemsStore

      newItem()
      const patch = <Item>itemPatch.value
      const emptyItem = { ...patch }

      Object.assign(patch, itemData[0])
      delete patch.id

      revertEdit()
      expect(itemPatch.value).not.toBe(patch)
      assertCopyOf(emptyItem, <Item>itemPatch.value)
    })
  })

  describe('cancelEdit()', () => {
    it('clears the patch', () => {
      const itemsStore = useItemsStore()

      const { newItem, cancelEdit } = itemsStore
      newItem()
      cancelEdit()

      const { itemPatch } = storeToRefs(itemsStore)
      const patch = itemPatch.value
      expect(patch).toBeFalsy()
    })
  })

  describe('itemForId', () => {
    it('returns the specified item from the result store', () => {
      resultStore.items.value = itemData
      const expected = itemData[0]

      const itemsStore = useItemsStore()
      const { itemForId } = itemsStore

      const actual = itemForId(expected.id)
      expect(actual).toEqual(expected)
    })
  })

  describe('deleteItem', () => {
    it('sets the item to be deleted', () => {
      const itemsStore = useItemsStore()
      const { deleteItem } = itemsStore
      const { itemToDelete } = storeToRefs(itemsStore)

      const item = itemData[0]
      deleteItem(item)
      expect(itemToDelete.value).toEqual(item)
    })
  })

  describe('confirmDelete', () => {
    it('deletes an item', async () => {
      const { deleteItem: apiDeleteItem } = apiStore

      const itemsStore = useItemsStore()
      const { itemToDelete } = storeToRefs(itemsStore)
      const { deleteItem } = itemsStore

      const expectedItem = itemData[0]
      deleteItem(expectedItem)

      apiDeleteItem.mockImplementationOnce((itemToDelete) => {
        expect(itemToDelete).toEqual(expectedItem)
        return Promise.resolve()
      })
      refreshSearch.mockImplementationOnce(() => Promise.resolve())

      const { confirmDelete } = itemsStore
      await confirmDelete()

      expect(apiDeleteItem).toHaveBeenCalledOnce()
      expect(refreshSearch).toHaveBeenCalledOnce()

      expect(itemToDelete.value).toBeUndefined()
    })

    it('can be called safely even with no item to delete', async () => {
      const itemsStore = useItemsStore()
      const { itemToDelete } = storeToRefs(itemsStore)
      expect(itemToDelete.value).toBeUndefined() // just to be sure

      const { confirmDelete } = itemsStore
      await confirmDelete()
    })
  })

  describe('thumbnailUriFor', () => {
    it('returns the thumbnail URI for an item', () => {
      const item = itemData[0]
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const expected = item!.image!.links!.icon!.href

      const { thumbnailUriFor } = useItemsStore()
      expect(thumbnailUriFor(item)).toEqual(expected)
    })
  })

  describe('imageUriFor', () => {
    it('returns the image URI for an item', () => {
      const item = itemData[0]
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const expected = item!.image!.links!.alternate!.href

      const { imageUriFor } = useItemsStore()
      expect(imageUriFor(item)).toEqual(expected)
    })
  })
})
