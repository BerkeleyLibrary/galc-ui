import { defineStore } from 'pinia'
import { ref } from 'vue'

import { deleteParam, relativeUrl } from '../helpers/window-location-helper'

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
    const reserveItemId = deleteParam(RESERVE_ITEM_PARAM)
    if (reserveItemId) {
      const { isAuthenticated } = useSessionStore()
      if (isAuthenticated) {
        const { fetchItem } = useApiStore()
        fetchItem(reserveItemId).then(({ data }) => {
          const item = data
          startReservation(item)
        })
      } else {
        console.log('Ignoring %o=%o; user not authenticated', RESERVE_ITEM_PARAM, reserveItemId)
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

  // TODO: Handle/prevent multiple simultaneous attempted reservations
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
    return relativeUrl({ [RESERVE_ITEM_PARAM]: item.id })
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

const RESERVE_ITEM_PARAM = 'reserve'
