import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useWindowLocationStore } from "../../src/stores/window-location"

// ------------------------------------------------------------
// Tests

describe('window-location', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('location', () => {
    it('defaults to the current window location', () => {
      const expectedUrlStr = window.location.href
      const { location } = storeToRefs(useWindowLocationStore())
      const actualUrl = location.value
      expect(actualUrl.toString()).toEqual(expectedUrlStr)
    })

    describe('set', () => {
      it('sets its own value', () => {
        const expectedUrl = new URL('/galc', window.location.href)

        const { location } = storeToRefs(useWindowLocationStore())
        location.value = expectedUrl
        expect(location.value).toEqual(expectedUrl)
      })

      it('sets the window location', () => {
        const expectedUrl = new URL('/galc', window.location.href)

        const { location } = storeToRefs(useWindowLocationStore())
        location.value = expectedUrl

        expect(window.location.href).toEqual(expectedUrl.toString())
      })
    })

    it('updates on hash change', () => {
      const expectedHash = '#expected-hash'
      window.location.hash = expectedHash

      const { location } = storeToRefs(useWindowLocationStore())
      const actualUrl = location.value
      expect(actualUrl.hash).toEqual(expectedHash)
    })

    it('updates on pushstate', () => {
      const relativeUrlStr = '/some/path#and-hash'
      const expectedUrl = new URL(relativeUrlStr, window.location.href)

      window.history.pushState('test', '', relativeUrlStr)
      expect(window.location.href).toEqual(expectedUrl.toString()) // just to be sure

      const { location } = storeToRefs(useWindowLocationStore())
      const actualUrl = location.value
      expect(actualUrl.toString()).toEqual(window.location.href)
    })

    it('updates on popstate', () => {
      window.history.pushState('test', '', '/some/path#and-hash')

      window.history.back()

      const { location } = storeToRefs(useWindowLocationStore())
      const actualUrl = location.value
      expect(actualUrl.toString()).toEqual(window.location.href)
    })
  })
})
