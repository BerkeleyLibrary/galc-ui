import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStore } from './session'
import { useApiStore } from './api'

export const useReservationStore = defineStore('reservation', () => {
  // --------------------------------------------------
  // State

  const currentReservation = ref(null)
  const completedReservation = ref(null)
  const currentPreview = ref(null)
  const reservedItemIds = ref([])

  // --------------------------------------------------
  // Exported functions and properties

  function init () {
    const reserveItemId = getReserveItemFromWindowLocation()
    if (reserveItemId) {
      clearReserveItemFromWindowLocation()

      // TODO: retry auth?
      const { isAuthenticated } = useSessionStore()
      if (isAuthenticated) {
        const { fetchItem } = useApiStore()
        fetchItem(reserveItemId).then(({ data }) => {
          const item = data
          startReservation(item)
        })
      }
    }
  }

  function itemReserved ({ data }) {
    console.log('Created reservation: { %o }', data)
    const item = data.item
    reservedItemIds.value.push(item.id)

    const rsvn = currentReservation.value
    const rsvnItemId = rsvn && rsvn.item.id
    if (rsvnItemId === item.id) {
      currentReservation.value = null
      completedReservation.value = rsvn
    }
  }

  function startReservation (item) {
    const rsvn = {
      item: item,
      confirmed: false
    }
    currentReservation.value = rsvn

    console.log('startReservation(%o) => %o', item.id, currentReservation.value)
  }

  function confirmReservation () {
    console.log('confirmReservation(): %o', currentReservation.value)

    const api = useApiStore()
    const { reserveItem } = api

    const rsvn = currentReservation.value
    rsvn.confirmed = true

    const itemId = rsvn.item.id
    reserveItem(itemId)
  }

  function cancelReservation () {
    console.log('cancelReservation()')
    currentReservation.value = null
  }

  function acknowledgeComplete () {
    console.log('acknowledgeComplete()')
    completedReservation.value = null
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

  function startPreview (item) {
    // TODO: find less hacky way to prevent launching preview from confirm dialog
    if (currentReservation.value) {
      console.log('not previewing')
      return
    }
    console.log('previewing %o', item)
    currentPreview.value = item
  }

  function endPreview () {
    currentPreview.value = null
  }

  const exported = {
    init,
    reserveItemRedirectUrl,
    startReservation,
    confirmReservation,
    cancelReservation,
    currentReservation,
    completedReservation,
    acknowledgeComplete,
    itemReserved,
    isReserved,
    currentPreview,
    startPreview,
    endPreview
  }

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
  return params.get(RESERVE_ITEM_PARAM)
}

function clearReserveItemFromWindowLocation () {
  console.log('clearReserveItemFromWindowLocation()')
  const url = new URL(window.location)
  const oldSearch = url.search

  const params = url.searchParams
  params.delete(RESERVE_ITEM_PARAM)
  const newSearch = params.toString()

  if (oldSearch !== newSearch) {
    url.search = newSearch
    window.history.pushState(null, '', url)
  }
}
