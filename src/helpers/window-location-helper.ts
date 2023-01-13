import { storeToRefs } from 'pinia'
import { useWindowLocationStore } from '../stores/window-location'
import { RESERVE_ITEM_PARAM } from '../stores/reservation'
import { AUTH_TOKEN_PARAM } from '../stores/api'
import { LOGIN_PARAM } from '../stores/session'
import { Params } from "../types/Params";

// TODO: merge this back into stores/window-location.js?

function relativeUrl(params: Params, clearParams = false): URL {
  const oldLocation = new URL(window.location.href)
  return computeRelativeUrl(oldLocation, params, clearParams)
}

function setParams(params: Params) {
  const newLocation = relativeUrl(params, true)

  const { location } = storeToRefs(useWindowLocationStore())
  location.value = newLocation
}

function deleteParam(paramName: string): string | null {
  const { location } = storeToRefs(useWindowLocationStore())

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

function computeRelativeUrl(oldLocation: URL, params: Params, clearParams = false): URL {
  const url = new URL(oldLocation)

  const sp = baseSearchParams(clearParams, url)
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      sp.set(name, value.toString())
    }
  }
  url.search = sp.toString()

  return url
}

// TODO: export an object, so these method names are less confusing/generic?
export { relativeUrl, setParams, deleteParam, readParam, computeRelativeUrl }

// --------------------------------------------------
// Private implementation

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

  return clearParams ? newParams : currentParams
}
