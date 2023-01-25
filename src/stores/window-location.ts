import { defineStore } from 'pinia'
import { computed, Ref, ref, WritableComputedRef } from 'vue'
import { Params } from "../types/Params"
import { AUTH_TOKEN_PARAM, LOGIN_PARAM, RESERVE_ITEM_PARAM } from "../helpers/params"

// ------------------------------------------------------------
// Store definition

export const useWindowLocationStore = defineStore('window-location', () => {

  // ------------------------------
  // Internal state

  // NOTE: We use the string here, not the location object, because the latter
  //       is prone to changing out from under us without events that trigger
  //       Vue computed property updates
  const currentLocation: Ref<URL> = ref(new URL(window.location.href))

  // ------------------------------
  // Exported state

  const location: WritableComputedRef<URL> = computed({
    get () { return currentLocation.value },

    set (v) {
      const oldLocation = new URL(window.location.href)
      if (v !== oldLocation) {
        window.history.pushState(`location.set(${v})`, '', v)
      }
      updateState()
    }
  })

  // ------------------------------
  // Exported helpers

  function relativeUrl(params: Params, clearParams = false): URL {
    const oldLocation = new URL(window.location.href)
    return computeRelativeUrl(oldLocation, params, clearParams)
  }

  function setParams(params: Params) {
    location.value = relativeUrl(params, true)
  }

  function deleteParam(paramName: string): string | null {
    const url = new URL(window.location.href)
    const params = url.searchParams
    const value = params.get(paramName)
    if (value) {
      params.delete(paramName)

      location.value = url
    }
    return value
  }

  function readParam(paramName: string) {
    const url = new URL(window.location.href)
    const params = url.searchParams
    return params.get(paramName)
  }

  // ------------------------------
  // Events

  // TODO: Do we care about removing listeners?
  window.addEventListener('popstate', updateState)
  window.addEventListener('hashchange', updateState)

  function updateState (_event?: Event) {
    const oldLocation = currentLocation.value
    const newLocation = new URL(window.location.href)
    if (oldLocation !== newLocation) {
      currentLocation.value = newLocation
    }
  }

  // ------------------------------
  // Store

  return { location, relativeUrl, setParams, deleteParam, readParam }

// --------------------------------------------------
// Private implementation

  function computeRelativeUrl(oldLocation: URL, params: Params, clearParams = false): URL {
    const url = new URL(oldLocation)

    const sp = baseSearchParams(clearParams, url)
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        if (value) {
          sp.set(name, value.toString())
        }
      }
    }
    url.search = sp.toString()

    return url
  }

  // TODO: Something less hacky
  function baseSearchParams(clearParams: boolean, url: URL) {
    const currentParams = url.searchParams
    if (!clearParams) {
      return currentParams
    }
    const newParams = new URLSearchParams()
    for (const param of [LOGIN_PARAM, AUTH_TOKEN_PARAM, RESERVE_ITEM_PARAM]) {
      for (const currentVal of currentParams.getAll(param)) {
        newParams.append(param, currentVal)
      }
    }
    return newParams
  }
})
