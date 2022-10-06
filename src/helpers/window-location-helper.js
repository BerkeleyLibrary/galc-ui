import { storeToRefs } from 'pinia'
import { useWindowLocationStore } from '../stores/window-location'
import { RESERVE_ITEM_PARAM } from '../stores/reservation'
import { AUTH_TOKEN_PARAM } from '../stores/api'

// TODO: merge this back into stores/window-location.js?

function relativeUrl (params, clearParams = false) {
  const oldLocation = window.location.toString()
  return computeRelativeUrl(oldLocation, params, clearParams)
}

function setParams (params, clearParams = []) {
  console.log('setParams(%o)', params)
  const newLocation = relativeUrl(params, true).toString()

  const { location } = storeToRefs(useWindowLocationStore())
  location.value = newLocation
  console.log('location.value = %o', newLocation)
}

function deleteParam (paramName) {
  console.log('deleteParam(%o)', paramName)
  const url = new URL(window.location)
  const params = url.searchParams
  const value = params.get(paramName)
  if (value) {
    const url = new URL(window.location)
    params.delete(paramName)

    const { location } = storeToRefs(useWindowLocationStore())
    location.value = url
    console.log('location.value = %o', url)
  }
  console.log('deleteParam(%o) returning %o', paramName, value)
  return value
}

function computeRelativeUrl (oldLocation, params, clearParams = false) {
  const url = new URL(oldLocation)

  const sp = baseSearchParams(clearParams, url)
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      sp.set(name, value)
    }
  }
  url.search = sp.toString()

  return url
}

// TODO: export an object, so these method names are less confusing/generic?
export { relativeUrl, setParams, deleteParam, computeRelativeUrl }

// --------------------------------------------------
// Private implementation

// TODO: Something less hacky

function baseSearchParams (clearParams, url) {
  const currentParams = url.searchParams
  if (!clearParams) {
    return currentParams
  }
  const newParams = new URLSearchParams()
  for (const param of [AUTH_TOKEN_PARAM, RESERVE_ITEM_PARAM]) {
    for (const currentVal of currentParams.getAll(param)) {
      newParams.append(param, currentVal)
    }
  }

  return clearParams ? newParams : currentParams
}
