import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiStore } from './api'

export const useReservationStore = defineStore('reservation', () => {
  // --------------------------------------------------
  // State

  const inProgressItem = ref(null)
  const reservedItemIds = ref([])

  // --------------------------------------------------
  // Exported functions and properties

  function init () {
    const reserveItemId = getReserveItemFromWindowLocation()
    if (reserveItemId) {
      clearReserveItemFromWindowLocation()

      const { reserveItem } = useApiStore()
      reserveItem({ id: reserveItemId })
    }
  }

  function itemReserved ({ data }) {
    console.log('Created reservation: { %o }', data)
    const item = data.item
    reservedItemIds.value.push(item.id)
  }

  function isReserved (item) {
    const reservedIds = reservedItemIds.value
    return reservedIds.includes(item.id)
  }

  function reserveItemRedirectUrl (item) {
    const url = new URL(window.location)
    const params = url.searchParams
    params.set(RESERVE_ITEM_PARAM, item.id)
    const newSearch = params.toString()
    url.search = newSearch
    return url
  }

  const exported = { init, reserveItemRedirectUrl, inProgressItem, itemReserved, isReserved }

  // --------------------------------------------------
  // Store definition

  return exported
})

// ------------------------------------------------------------
// Private implementation

// TODO: DRY window location manipulation code
const RESERVE_ITEM_PARAM = 'reserve'

function getReserveItemFromWindowLocation () {
  const params = new URL(window.location).searchParams
  const itemVal = params.get(RESERVE_ITEM_PARAM)
  return parseInt(itemVal) || 0
}

function clearReserveItemFromWindowLocation () {
  const url = new URL(window.location)
  const params = url.searchParams
  params.delete(RESERVE_ITEM_PARAM)
  const newSearch = params.toString()
  if (url.search !== newSearch) {
    url.search = newSearch
    window.history.pushState(null, '', url)
  }
}
