import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useApiStore } from './api'
import { useSearchStore } from './search'
import { useResultStore } from './results'

export function newEmptyImage () {
  return {
    links: {}
  }
}

export function newEmptyItem () {
  return {
    imageUri: null,
    thumbnail: '',
    thumbnailUri: null,
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
    reserveDate: null,
    suppressed: false,
    createdAt: null,
    updatedAt: null,
    permalinkUri: null,
    terms: [],
    image: newEmptyImage()
  }
}

export const useItemsStore = defineStore('items', () => {
  // --------------------------------------------------
  // State

  const itemPatch = ref(null)

  // --------------------------------------------------
  // Exported functions

  function newItem () {
    itemPatch.value = newEmptyItem()
  }

  function editItem (item) {
    itemPatch.value = newPatch(item)
  }

  function applyEdit (item) {
    if (item) {
      const { saveItem } = useApiStore()
      const { refreshSearch } = useSearchStore()
      saveItem(item).then(refreshSearch).finally(cancelEdit)
    }
  }

  function revertEdit () {
    const item = itemForId(itemPatch.value.id)
    if (item) {
      editItem(item)
    } else {
      newItem()
    }
  }

  function cancelEdit () {
    itemPatch.value = null
  }

  function itemForId (itemId) {
    if (itemId) {
      const { items } = storeToRefs(useResultStore())
      const item = items.value.find((it) => it.id === itemId)
      return item
    }
  }

  // --------------------------------------------------
  // Internal functions

  function newPatch (item) {
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
