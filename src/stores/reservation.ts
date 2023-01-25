import { defineStore, storeToRefs } from 'pinia'
import { Ref, ref } from 'vue'

import { useSessionStore } from './session'
import { useApiStore } from './api'
import { useClosuresStore } from './closures'
import { Reservation } from "../types/Reservation"
import { Item } from "../types/Item"
import { Result } from "../types/GalcApi"
import { useWindowLocationStore } from "./window-location"
import { RESERVE_ITEM_PARAM } from "../helpers/params"
import { handleError } from "../helpers/handle-error"

export const useReservationStore = defineStore('reservation', () => {
  // --------------------------------------------------
  // State

  const currentReservation: Ref<Reservation | undefined> = ref(undefined)
  const completedReservation: Ref<Reservation | undefined> = ref(undefined)
  const reservedItemIds: Ref<string[]> = ref([])

  // --------------------------------------------------
  // Internal functions and properties

  function doReserve(reserveItemId: string) {
    const { isAuthenticated } = storeToRefs(useSessionStore())
    if (!isAuthenticated.value) {
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
      .catch(handleError(`fetchItem(${reserveItemId}) failed`))
  }

  function clearCurrentRsvn() {
    currentReservation.value = undefined
  }

  // --------------------------------------------------
  // Exported functions and properties

  async function init() {
    const { deleteParam } = useWindowLocationStore()
    const reserveItemId = deleteParam(RESERVE_ITEM_PARAM)
    if (reserveItemId) {
      return doReserve(reserveItemId)
    }
  }

  // TODO: Handle/prevent multiple simultaneous attempted reservations
  function startReservation(item: Item) {
    const rsvn = { item, confirmed: false }
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
      const { relativeUrl } = useWindowLocationStore()
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
