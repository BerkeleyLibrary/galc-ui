import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useWindowLocationStore } from "../../src/stores/window-location"
import { AUTH_TOKEN_PARAM, LOGIN_PARAM, RESERVE_ITEM_PARAM } from "../../src/helpers/params"

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

      it('does not modify the window history unless changed', () => {
        const expectedUrl = new URL('/galc', window.location.href)

        const { location } = storeToRefs(useWindowLocationStore())
        location.value = expectedUrl

        const lengthBefore = window.history.length
        location.value = expectedUrl
        expect(window.history.length).toEqual(lengthBefore)
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

  describe('relativeUrl', () => {
    it('appends parameters', () => {
      const { relativeUrl } = useWindowLocationStore()

      window.history.pushState('', '', '?keywords=blue%2Cmedium')
      const oldUrl = new URL(window.location.href)

      const params = { page: 2 }
      const newUrl = relativeUrl(params)

      const expectedUrlStr = `${oldUrl.toString()}&page=2`
      expect(newUrl.toString()).toEqual(expectedUrlStr)
    })

    it('can clear parameters', () => {
      const { relativeUrl } = useWindowLocationStore()
      const subqueryToReplace = 'keywords=blue%2Cmedium'

      window.history.pushState('', '', `?${subqueryToReplace}`)
      const oldUrl = new URL(window.location.href)

      const params = { page: 2 }
      const newUrl = relativeUrl(params, true)

      const expectedUrlStr = oldUrl.toString().replace(subqueryToReplace, 'page=2')
      expect(newUrl.toString()).toEqual(expectedUrlStr)
    })

    it('ignores undefined parameters', () => {
      const { relativeUrl } = useWindowLocationStore()

      window.history.pushState('', '', `?keywords=blue%2Cmedium`)
      const oldUrl = new URL(window.location.href)

      const params = { page: undefined }
      const newUrl = relativeUrl(params, false)
      expect(newUrl.toString()).toEqual(oldUrl.toString())
    })

    it('preserves protected parameters', () => {
      const { relativeUrl } = useWindowLocationStore()
      const subqueryToReplace = 'keywords=blue%2Cmedium'

      const subqueryToKeep = Object.entries({
        [LOGIN_PARAM]: 'true',
        [AUTH_TOKEN_PARAM]: 'aGVscCBJIGFtIHRyYXBwZWQgaW4gYSB1bml0IHRlc3Q',
        [RESERVE_ITEM_PARAM]: '8675309'
      }).map(([k, v]) => `${k}=${v}`).join('&')

      window.history.pushState('', '', `?${subqueryToKeep}&${subqueryToReplace}`)
      const oldUrl = new URL(window.location.href)

      const params = { page: 2 }
      const newUrl = relativeUrl(params, true)

      const expectedUrlStr = oldUrl.toString().replace(subqueryToReplace, 'page=2')
      expect(newUrl.toString()).toEqual(expectedUrlStr)
    })
  })

  describe('readParam', () => {
    it('reads a parameter', () => {
      window.history.pushState('', '', '?keywords=blue%2Cmedium')

      const { readParam } = useWindowLocationStore()
      const val = readParam('keywords')
      expect(val).toEqual('blue,medium')
    })
  })

  describe('setParams', () => {
    it('sets parameters', () => {
      const windowLocationStore = useWindowLocationStore()
      const { setParams } = windowLocationStore
      const params = { keywords: 'blue,medium' }
      setParams(params)

      const expectedSearch = '?keywords=blue%2Cmedium'

      const { location } = storeToRefs(windowLocationStore)
      const url = location.value
      expect(url.search).toEqual(expectedSearch)

      const newUrl = new URL(window.location.href)
      expect(newUrl.search).toEqual(expectedSearch)
    })
  })

  describe('deleteParam', () => {
    it('reads and deletes a parameter', () => {
      const windowLocationStore = useWindowLocationStore()
      const { location } = storeToRefs(windowLocationStore)

      window.history.pushState('', '', '?keywords=blue%2Cmedium')
      const { deleteParam } = windowLocationStore
      const val = deleteParam('keywords')
      expect(val).toEqual('blue,medium')

      expect(location.value.toString()).not.toContain('keywords')
    })

    it('returns null if the parameter is not set', () => {
      const windowLocationStore = useWindowLocationStore()
      const { location } = storeToRefs(windowLocationStore)

      window.history.pushState('', '', '?keywords=blue%2Cmedium')
      const newLocation = location.value

      const { deleteParam } = windowLocationStore
      const val = deleteParam('chocolate')
      expect(val).toEqual(null)

      expect(location.value).toEqual(newLocation)
    })
  })
})
