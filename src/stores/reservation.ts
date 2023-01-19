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

  const currentReservation: Ref<Reservation | undefined> = ref(undefined)
  const completedReservation: Ref<Reservation | undefined> = ref(undefined)
  const reservedItemIds: Ref<String[]> = ref([])

  // --------------------------------------------------
  // Internal functions and properties

  function doReserve(reserveItemId: string) {
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

  function clearCurrentRsvn() {
    currentReservation.value = undefined
  }

  // --------------------------------------------------
  // Exported functions and properties

  async function init() {
    const reserveItemId = deleteParam(RESERVE_ITEM_PARAM)
    if (reserveItemId) {
      return doReserve(reserveItemId)
    }
  }

  // TODO: Handle/prevent multiple simultaneous attempted reservations
  function startReservation(item: Item) {
    const rsvn = {
      item: item,
      confirmed: false
    }
    currentReservation.value = rsvn
  }

  function confirmReservation(): Promise<void> {
    const rsvn = currentReservation.value
    if (!rsvn) {
      return Promise.resolve()
    }

    const itemId = <string>rsvn.item.id
    rsvn.confirmed = true

    const { reserveItem } = useApiStore()
    return reserveItem(itemId)
  }

  function cancelReservation() {
    clearCurrentRsvn()
  }

  function acknowledgeComplete() {
    completedReservation.value = undefined
  }

  function reservationSuccessful({ data }: Result<Reservation>) {
    if (!data) {
      return
    }
    const item = data.item
    const itemId = <string>item.id
    reservedItemIds.value.push(itemId)

    const rsvn = currentReservation.value
    const rsvnItemId = rsvn && rsvn.item.id
    if (rsvnItemId === item.id) {
      clearCurrentRsvn()
      completedReservation.value = rsvn
    }
  }

  function isReserved(item: Item): boolean {
    if (!item.id) {
      return false
    }
    const reservedIds = reservedItemIds.value
    return reservedIds.includes(item.id)
  }

  function reserveItemRedirectUrl(item: Item): URL | undefined {
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
    reservationSuccessful,
    isReserved
  }

  // --------------------------------------------------
  // Store definition

  return exported
})
