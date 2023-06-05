import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ref } from "vue"
import { Item } from "../../src/types/Item"
import { Reservation } from "../../src/types/Reservation"
import { Result } from "../../src/types/GalcApi"
import { newPatch } from "../../src/stores/items"
import { useReservationStore } from "../../src/stores/reservation"
import { items as itemData } from "../data/items"
import { Params } from "../../src/types/Params"
import { RESERVE_ITEM_PARAM } from "../../src/helpers/params"

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock window location store

const relativeUrl: Mock<[Params], URL> = vi.fn()
const deleteParam: Mock<[string], string | null> = vi.fn()
const windowLocationStore = { relativeUrl, deleteParam }
vi.mock('@/stores/window-location', () => {
  return {
    useWindowLocationStore: () => windowLocationStore
  }
})

// ------------------------------
// Mock api store

const fetchItem: Mock<[string], Promise<Result<Item>>> = vi.fn()
const reserveItem: Mock<[string], Promise<void>> = vi.fn()
const apiStore = { fetchItem, reserveItem }

vi.mock('@/stores/api', () => {
  return {
    useApiStore: () => apiStore,
  }
})

// ------------------------------
// Mock session store

const isAuthenticated = ref(true)
const sessionStore = { isAuthenticated }

vi.mock('@/stores/session', () => {
  return {
    useSessionStore: () => sessionStore,
  }
})

// ------------------------------
// Mock closures store

const closed = ref(false)
const closuresStore = { closed }

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
    isAuthenticated.value = true
    closed.value = false
  })

  describe('init', () => {
    describe('when reservation allowed', () => {
      it('reserves the item specified in the URL', async () => {
        const item = itemData[0]
        const itemId = <string>item.id

        deleteParam.mockImplementationOnce((param) => {
          expect(param).toEqual(RESERVE_ITEM_PARAM)
          return itemId
        })

        const resultItem = newPatch(item)
        fetchItem.mockImplementationOnce((id) => {
          expect(id).toEqual(itemId)
          const result = { data: resultItem }
          return Promise.resolve(result)
        })

        const rsvnStore = useReservationStore()
        const { init } = rsvnStore
        await init()

        expect(deleteParam).toHaveBeenCalledOnce()
        expect(fetchItem).toHaveBeenCalledOnce()

        const { currentReservation } = storeToRefs(rsvnStore)
        const rsvn = <Reservation>currentReservation.value
        expect(rsvn.item).toEqual(resultItem)
        expect(rsvn.confirmed).toEqual(false)
      })
    })

    it('does nothing if no item is specified', async () => {
      deleteParam.mockImplementationOnce((param) => {
        expect(param).toEqual(RESERVE_ITEM_PARAM)
        return null
      })

      const rsvnStore = useReservationStore()
      const { init } = rsvnStore
      await init()

      expect(fetchItem).not.toHaveBeenCalled()

      const { currentReservation } = storeToRefs(rsvnStore)
      expect(currentReservation.value).toBeFalsy()
    })

    describe('when reservation not allowed', () => {
      const cases = {
        'user is not authenticated': () => { isAuthenticated.value = false },
        'GALC is closed': () => { closed.value = true }
      }

      for (const [condition, setup] of Object.entries(cases)) {
        it(`does not reserve an item if ${condition}`, async () => {
          setup()

          const item = itemData[0]
          const itemId = <string>item.id

          deleteParam.mockImplementationOnce((param) => {
            expect(param).toEqual(RESERVE_ITEM_PARAM)
            return itemId
          })

          const rsvnStore = useReservationStore()
          const { init } = rsvnStore
          await init()

          expect(fetchItem).not.toHaveBeenCalled()

          const { currentReservation } = storeToRefs(rsvnStore)
          expect(currentReservation.value).toBeFalsy()
        })
      }
    })
  })

  describe('currentReservation', () => {
    it('defaults to empty', () => {
      const rsvnStore = useReservationStore()
      const { currentReservation } = storeToRefs(rsvnStore)
      expect(currentReservation.value).toBeFalsy()
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

    it('does nothing if there is no reservation to confirm', async () => {
      const rsvnStore = useReservationStore()
      const { confirmReservation } = rsvnStore

      await confirmReservation()
      expect(reserveItem).not.toHaveBeenCalled()
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
      expect(currentReservation.value).toBeFalsy()
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
      expect(completedReservation.value).toBeFalsy()
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

      const rsvnItem = newPatch(origItem)
      const user = { id: '5551212' }
      const rsvnResponse = { id: `${user.id}/${rsvnItem.id}`, item: rsvnItem, user }
      reservationSuccessful({ data: rsvnResponse })

      expect(isReserved(rsvnItem)).toEqual(true)

      expect(currentReservation.value).toBeFalsy()
      expect(completedReservation.value).toEqual(rsvn)
    })

    it('handles a successful reservation while another reservation is in progress', () => {
      const rsvnStore = useReservationStore()
      const { startReservation, reservationSuccessful, isReserved } = rsvnStore
      const { currentReservation, completedReservation } = storeToRefs(rsvnStore)

      const item0 = itemData[0]
      startReservation(item0)
      const newReservation = currentReservation.value
      expect(currentReservation.value).not.toBeFalsy()

      const item1 = itemData[1]
      const rsvnItem = newPatch(item1)
      const user = { id: '5551212' }
      const rsvnResponse = { id: `${user.id}/${rsvnItem.id}`, item: rsvnItem, user }
      reservationSuccessful({ data: rsvnResponse })

      expect(isReserved(rsvnItem)).toEqual(true)

      expect(currentReservation.value).toEqual(newReservation)
      expect(completedReservation.value).toBeFalsy()
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

      relativeUrl.mockImplementationOnce((params: Params) => {
        expect(params[RESERVE_ITEM_PARAM]).toEqual(item.id)
        return expectedUrl
      })

      const { reserveItemRedirectUrl } = useReservationStore()
      const redirectUrl = <URL>reserveItemRedirectUrl(item)
      expect(redirectUrl.toString()).toEqual(expectedUrl.toString())
    })
  })
})
