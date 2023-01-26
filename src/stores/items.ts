import { defineStore, storeToRefs } from 'pinia'
import { Ref, ref } from 'vue'
import { useApiStore } from './api'
import { useSearchStore } from './search'
import { useResultStore } from './results'
import { Item } from "../types/Item"
import { Image } from "../types/Image"

export function newEmptyImage(): Image {
  // TODO: separate ImagePatch (incomplete, w/o Links) from Image
  return {}
}

export function newPatch(item: Item): Item {
  return { ...item, terms: item.terms.slice() }
}

function newEmptyItem(): Item {
  // TODO: should these really be empty strings, or should they be undefined?
  return {
    title: '',
    artist: '',
    artistUrl: '',
    date: '',
    description: '',
    dimensions: '',
    series: '',
    mmsId: '',
    barcode: '',
    circulation: '',
    location: '',
    value: '',
    appraisalDate: '',
    notes: '',
    suppressed: false,
    terms: [],
    image: newEmptyImage()
  }
}

export const useItemsStore = defineStore('items', () => {
  // --------------------------------------------------
  // State

  const itemPatch: Ref<Item | undefined> = ref()
  const itemToDelete: Ref<Item | undefined> = ref()

  // --------------------------------------------------
  // Exported functions

  function newItem() {
    itemPatch.value = newEmptyItem()
  }

  function editItem(item: Item) {
    itemPatch.value = newPatch(item)
  }

  // TODO: should this take an argument, or just submit the current patch?
  function applyEdit(item: Item) {
    const { saveItem } = useApiStore()
    const { refreshSearch } = useSearchStore()
    return saveItem(item).then(refreshSearch).finally(cancelEdit)
  }

  function revertEdit() {
    // TODO: explicitly save the original? or go to server?
    const item = itemForId(itemPatch.value?.id)
    if (item) {
      editItem(item)
    } else {
      newItem()
    }
  }

  function cancelEdit() {
    itemPatch.value = undefined
  }

  function itemForId(itemId: string | undefined): Item | undefined {
    if (itemId) {
      const { items } = storeToRefs(useResultStore())
      const item = items.value.find((it) => it.id === itemId)
      return item
    }
  }

  function deleteItem(item: Item) {
    itemToDelete.value = item
  }

  function confirmDelete() {
    const item = itemToDelete.value
    if (item) {
      const { deleteItem } = useApiStore()
      const { refreshSearch } = useSearchStore()
      return deleteItem(item).then(refreshSearch).finally(cancelDelete)
    }
  }

  function cancelDelete() {
    itemToDelete.value = undefined
  }

  // TODO: Cleaner way to encapsulate links
  function thumbnailUriFor(item: Item | undefined): string | undefined {
    return item?.image?.links?.icon?.href
  }

  // TODO: Cleaner way to encapsulate links
  function imageUriFor(item: Item | undefined): string | undefined {
    return item?.image?.links?.alternate?.href
  }

  // --------------------------------------------------
  // Store definition

  return {
    itemPatch,
    itemToDelete,
    newItem,
    editItem,
    itemForId,
    applyEdit,
    revertEdit,
    cancelEdit,
    deleteItem,
    confirmDelete,
    cancelDelete,
    thumbnailUriFor,
    imageUriFor
  }
})
