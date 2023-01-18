import { defineStore, storeToRefs } from 'pinia'
import { Ref, ref } from 'vue'

import { deleteParam, relativeUrl } from '../helpers/window-location-helper'

import { useSessionStore } from './session'
import { useApiStore } from './api'
import { useClosuresStore } from './closures'
import { Reservation } from "../types/Reservation"
import { Item } from "../types/Item"
import { Result } from "../types/GalcApi"

export const RESERVE_ITEM_PARAM = 'reserve'

export const useReservationStore = defineStore('reservation', () => {
  // --------------------------------------------------
  // State

  const currentReservation: Ref<Reservation|null> = ref(null)
  const completedReservation: Ref<Reservation|null> = ref(null)
  const reservedItemIds: Ref<String[]> = ref([])

  // --------------------------------------------------
  // Internal functions and properties

  function doReserve (reserveItemId: string) {
    const { isAuthenticated } = useSessionStore()
    if (!isAuthenticated) {
      return
    }

    const { closed } = storeToRefs(useClosuresStore())
    if (closed.value) {
      return
    }

    const { fetchItem } = useApiStore()
    return fetchItem(reserveItemId)
      .then(({ data }: Result<Item>) => {
        const item = data
        if (item) {
          startReservation(item)
        }
      })
  }

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    const reserveItemId = deleteParam(RESERVE_ITEM_PARAM)
    if (reserveItemId) {
      return doReserve(reserveItemId)
    }
  }

  function itemReserved ({ data }: Result<Reservation>) {
    if (!data) {
      return
    }
    const item = data.item
    const itemId = <string> item.id
    reservedItemIds.value.push(itemId)

    const rsvn = currentReservation.value
    const rsvnItemId = rsvn && rsvn.item.id
    if (rsvnItemId === item.id) {
      currentReservation.value = null
      completedReservation.value = rsvn
    }
  }

  // TODO: Handle/prevent multiple simultaneous attempted reservations
  function startReservation (item: Item) {
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
    if (rsvn) {
      rsvn.confirmed = true

      const itemId = <string> rsvn.item.id
      return reserveItem(itemId)
    }
  }

  function cancelReservation () {
    currentReservation.value = null
  }

  function acknowledgeComplete () {
    completedReservation.value = null
  }

  function isReserved (item: Item) {
    if (!item.id) {
      return false
    }
    const reservedIds = reservedItemIds.value
    return reservedIds.includes(item.id)
  }

  function reserveItemRedirectUrl (item: Item) {
    if (item.id) {
      return relativeUrl({ [RESERVE_ITEM_PARAM]: item.id })
    }
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
