import { storeToRefs } from 'pinia'
import { useWindowLocationStore } from '../stores/window-location'

// TODO: merge this back into stores/window-location.js?

function relativeUrl (params, clearParams = false) {
  const oldLocation = window.location.toString()
  return computeRelativeUrl(oldLocation, params, clearParams)
}

function setParams (params) {
  console.log('setParams(%o, %o)', params)
  const newLocation = relativeUrl(params, true).toString()

  const { location } = storeToRefs(useWindowLocationStore())
  location.value = newLocation
}

function deleteParam (paramName) {
  const url = new URL(window.location)
  const params = url.searchParams
  const value = params.get(paramName)
  if (value) {
    const url = new URL(window.location)
    params.delete(paramName)

    const { location } = storeToRefs(useWindowLocationStore())
    location.value = url
  }
  return value
}

function computeRelativeUrl (oldLocation, params, clearParams = false) {
  const url = new URL(oldLocation)

  const sp = clearParams ? new URLSearchParams() : url.searchParams
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
