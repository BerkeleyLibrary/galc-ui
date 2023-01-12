import { defineStore, storeToRefs } from 'pinia'
import { Ref, ref } from 'vue'
import { useApiStore } from './api'
import { useSearchStore } from './search'
import { useResultStore } from './results'
import { Item } from "../types/Item"
import { Image } from "../types/Image"

export function newEmptyImage(): Image {
  return {
    links: {}
  }
}

export function newEmptyItem(): Item {
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

  const itemPatch: Ref<Item | null> = ref(null)

  // --------------------------------------------------
  // Exported functions

  function newItem() {
    itemPatch.value = newEmptyItem()
  }

  function editItem(item: Item) {
    itemPatch.value = newPatch(item)
  }

  function applyEdit(item: Item) {
    const { saveItem } = useApiStore()
    const { refreshSearch } = useSearchStore()
    saveItem(item).then(refreshSearch).finally(cancelEdit)
  }

  function revertEdit() {
    const item = itemForId(itemPatch.value?.id)
    if (item) {
      editItem(item)
    } else {
      newItem()
    }
  }

  function cancelEdit() {
    itemPatch.value = null
  }

  function itemForId(itemId: string | undefined) {
    if (itemId) {
      const { items } = storeToRefs(useResultStore())
      const item = items.value.find((it) => it.id === itemId)
      return item
    }
  }

  // --------------------------------------------------
  // Internal functions

  function newPatch(item: Item) {
    return {
      id: item.id,
      image: item.image,
      title: item.title,
      artist: item.artist,
      artistUrl: item.artistUrl,
      date: item.date,
      description: item.description,
      dimensions: item.dimensions,
      series: item.series,
      mmsId: item.mmsId,
      barcode: item.barcode,
      circulation: item.circulation,
      location: item.location,
      value: item.value,
      appraisalDate: item.appraisalDate,
      notes: item.notes,
      reserveDate: item.reserveDate,
      suppressed: item.suppressed,
      permalinkUri: item.permalinkUri,
      terms: item.terms.slice()
    }
  }

  // --------------------------------------------------
  // Store definition

  return { itemPatch, newItem, editItem, itemForId, applyEdit, revertEdit, cancelEdit }
})
