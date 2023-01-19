import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { items as itemData } from "../data/items"
import { RESERVE_ITEM_PARAM, useReservationStore } from "../../src/stores/reservation"
import { Reservation } from "../../src/types/Reservation"
import { newPatch } from "../../src/stores/items"

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock api store

const reserveItem: Mock<[String], Promise<void>> = vi.fn()
const apiStore = { reserveItem }

vi.mock('@/stores/api', () => {
  return {
    useApiStore: () => apiStore,
  }
})

// ------------------------------
// Mock session store

const sessionStore = {}

vi.mock('@/stores/session', () => {
  return {
    useSessionStore: () => sessionStore,
  }
})

// ------------------------------
// Mock closures store

const closuresStore = {}

vi.mock('@/stores/closures', () => {
  return {
    useClosuresStore: () => closuresStore,
  }
})

// ------------------------------------------------------------
// Tests

describe('reservation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('currentReservation', () => {
    it('defaults to empty', () => {
      const rsvnStore = useReservationStore()
      const { currentReservation } = storeToRefs(rsvnStore)
      expect(!!currentReservation.value).toEqual(false)
    })
  })

  describe('startReservation', () => {
    it('starts a reservation', () => {
      const rsvnStore = useReservationStore()
      const { startReservation } = rsvnStore

      const item = itemData[0]
      startReservation(item)

      const { currentReservation } = storeToRefs(rsvnStore)
      const rsvn = <Reservation>currentReservation.value
      expect(rsvn.item).toEqual(item)
      expect(rsvn.confirmed).toEqual(false)
    })
  })

  describe('confirmReservation', () => {
    it('submits a reservation request', async () => {
      const rsvnStore = useReservationStore()
      const { startReservation, confirmReservation } = rsvnStore

      const item = itemData[0]
      startReservation(item)

      reserveItem.mockImplementationOnce((id) => {
        expect(id).toEqual(item.id)
        return Promise.resolve()
      })

      await confirmReservation()

      expect(reserveItem).toHaveBeenCalledOnce()

      const { currentReservation } = storeToRefs(rsvnStore)
      const rsvn = <Reservation>currentReservation.value
      expect(rsvn.item).toEqual(item)
      expect(rsvn.confirmed).toEqual(true)
    })
  })

  describe('cancelReservation', () => {
    it('clears the current reservation', () => {
      const rsvnStore = useReservationStore()
      const { startReservation, cancelReservation } = rsvnStore

      const item = itemData[0]
      startReservation(item)

      cancelReservation()
      const { currentReservation } = storeToRefs(rsvnStore)
      expect(!!currentReservation.value).toEqual(false)
    })
  })

  describe('acknowledgeComplete', () => {
    it('clears the completed reservation', () => {
      const rsvnStore = useReservationStore()
      const { startReservation, acknowledgeComplete } = rsvnStore

      const item = itemData[0]
      startReservation(item)

      acknowledgeComplete()
      const { completedReservation } = storeToRefs(rsvnStore)
      expect(!!completedReservation.value).toEqual(false)
    })
  })

  describe('reservationSuccessful', () => {
    it('processes a reservation response', () => {
      const rsvnStore = useReservationStore()
      const { startReservation, reservationSuccessful, isReserved } = rsvnStore
      const { currentReservation, completedReservation } = storeToRefs(rsvnStore)

      const origItem = itemData[0]
      startReservation(origItem)
      const rsvn = currentReservation.value

      const item = newPatch(origItem)
      const user = { id: '5551212' }
      const rsvnResponse = { id: `${user.id}/${item.id}`, item: item, user: user }
      reservationSuccessful({ data: rsvnResponse })

      expect(isReserved(item)).toEqual(true)

      expect(!!currentReservation.value).toEqual(false)
      expect(completedReservation.value).toEqual(rsvn)
    })
  })

  describe('isReserved', () => {
    it('returns false for an item that has not been reserved', () => {
      const item = newPatch(itemData[0])

      const { isReserved } = useReservationStore()
      expect(isReserved(item)).toEqual(false)
    })

    it('returns false for an un-persisted item', () => {
      const item = newPatch(itemData[0])
      delete item.id

      const { isReserved } = useReservationStore()
      expect(isReserved(item)).toEqual(false)
    })
  })

  describe('reserveItemRedirectUrl', () => {
    it('returns the redirect URL to reserve an item after login', () => {
      const item = itemData[0]
      const expectedUrl = new URL(`?${RESERVE_ITEM_PARAM}=${item.id}`, window.location.href)

      const { reserveItemRedirectUrl } = useReservationStore()
      const redirectUrl = <URL> reserveItemRedirectUrl(item)
      expect(redirectUrl.toString()).toEqual(expectedUrl.toString())
    })
  })
})
