import { defineStore } from 'pinia'
import { ref } from 'vue'

import { deleteParam, relativeUrl } from '../helpers/window-location-helper'

import { useSessionStore } from './session'
import { useApiStore } from './api'

export const RESERVE_ITEM_PARAM = 'reserve'

export const useReservationStore = defineStore('reservation', () => {
  // --------------------------------------------------
  // State

  const currentReservation = ref(null)
  const completedReservation = ref(null)
  const reservedItemIds = ref([])

  const closure = ref(null)

  // --------------------------------------------------
  // Internal functions and properties

  function initClosure () {
    const { fetchClosures } = useApiStore()
    const params = { limit: 1 }
    params['filter[current]'] = true

    return fetchClosures(params).then(({ data }) => {
      let currentClosure = null
      if (Array.isArray(data) && data.length > 0) {
        currentClosure = data[0]
      }
      console.log('currentClosure: %o', currentClosure)
      closure.value = currentClosure
    })
  }

  function doReserve (reserveItemId) {
    const { isAuthenticated } = useSessionStore()
    if (isAuthenticated) {
      if (closure.value) {
        console.log('Ignoring %o=%o; closure in effect: %o', RESERVE_ITEM_PARAM, reserveItemId, closure.value)
      } else {
        console.log('Found %o=%o', RESERVE_ITEM_PARAM, reserveItemId)
        const { fetchItem } = useApiStore()
        fetchItem(reserveItemId).then(({ data }) => {
          console.log('Item fetched')
          const item = data
          startReservation(item)
        })
      }
    } else {
      console.log('Ignoring %o=%o; user not authenticated', RESERVE_ITEM_PARAM, reserveItemId)
    }
  }

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    console.log('reservation.init()')
    return initClosure().then(() => {
      const reserveItemId = deleteParam(RESERVE_ITEM_PARAM)
      console.log('reserveItemId: %o', reserveItemId)
      if (reserveItemId) {
        doReserve(reserveItemId)
      }
    })
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
    console.log('startReservation(%o)', item)
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
    closure
  }

  // --------------------------------------------------
  // Store definition

  return exported
})
