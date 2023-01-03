import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import { deleteParam, relativeUrl } from '../helpers/window-location-helper'

import { useSessionStore } from './session'
import { useApiStore } from './api'
import { useClosuresStore } from './closures'

export const RESERVE_ITEM_PARAM = 'reserve'

export const useReservationStore = defineStore('reservation', () => {
  // --------------------------------------------------
  // State

  const currentReservation = ref(null)
  const completedReservation = ref(null)
  const reservedItemIds = ref([])

  // --------------------------------------------------
  // Internal functions and properties

  function doReserve (reserveItemId) {
    const { isAuthenticated } = useSessionStore()
    if (isAuthenticated) {
      const { closed } = storeToRefs(useClosuresStore())
      if (closed.value) {
      } else {
        const { fetchItem } = useApiStore()
        return fetchItem(reserveItemId).then(({ data }) => {
          const item = data
          startReservation(item)
        })
      }
    } else {
    }
  }

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    const reserveItemId = deleteParam(RESERVE_ITEM_PARAM)
    if (reserveItemId) {
      return doReserve(reserveItemId)
    }
  }

  function itemReserved ({ data }) {
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
  }

  function confirmReservation () {
    const api = useApiStore()
    const { reserveItem } = api

    const rsvn = currentReservation.value
    rsvn.confirmed = true

    const itemId = rsvn.item.id
    reserveItem(itemId)
  }

  function cancelReservation () {
    currentReservation.value = null
  }

  function acknowledgeComplete () {
    completedReservation.value = null
  }

  function isReserved (item) {
    const reservedIds = reservedItemIds.value
    return reservedIds.includes(item.id)
  }

  function reserveItemRedirectUrl (item) {
    return relativeUrl({ [RESERVE_ITEM_PARAM]: item.id })
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
    isReserved
  }

  // --------------------------------------------------
  // Store definition

  return exported
})
