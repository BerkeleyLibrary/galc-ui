import JsonApi from 'devour-client'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import camelcaseKeys from 'camelcase-keys'
import mapObject from 'map-obj'

import { deleteParam } from '../helpers/window-location-helper'

import { useFacetStore } from './facets'
import { useResultStore } from './results'
import { useSearchStore } from './search'
import { useSessionStore } from './session'
import { useReservationStore } from './reservation'
import { useClosuresStore } from './closures'
import decamelize from 'decamelize'

// ------------------------------------------------------------
// Store definition

export const AUTH_TOKEN_PARAM = 'token'

export const useApiStore = defineStore('api', () => {
  // --------------------------------------------------
  // State

  const jsonApi = ref(null)
  const apiBaseUrl = ref('')
  const loadCount = ref(0)

  const initialized = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  const loading = computed(() => {
    if (!initialized.value) {
      return true
    }
    return loadCount.value > 0
  })

  async function init (apiUrl) {
    await initApi(apiUrl)
    await loadFacets() // TODO: move this to facet store initializer?
    await initStores()

    initialized.value = true
  }

  function loadFacets () {
    incrementLoadCount()

    const api = jsonApi.value
    return api
      .findAll('facets', { include: 'terms' })
      .then(facetsLoaded)
      .catch(handleError('loadFacets() failed'))
      .finally(decrementLoadCount)
  }

  function performSearch (params) {
    incrementLoadCount()

    return jsonApi.value
      .findAll('items', { include: 'terms', ...params })
      .then(resultsFound)
      .catch(handleError('performSearch() failed'))
      .finally(decrementLoadCount)
  }

  function reserveItem (itemId) {
    // console.log('reserveItem(%o)', itemId)

    loadCount.value++

    const { itemReserved } = useReservationStore()

    return jsonApi.value
      .create('reservation', { item: { id: itemId } })
      .then(itemReserved)
      .catch(handleError(`reserveItem(${itemId}) failed`))
      .finally(decrementLoadCount)
  }

  function loadClosures (params = {}) {
    incrementLoadCount()

    return jsonApi.value
      .findAll('closures', params)
      .finally(decrementLoadCount)
  }

  function fetchItem (itemId) {
    return jsonApi.value
      .find('item', itemId, { include: 'terms' })
      .catch(handleError(`fetchItem(${itemId}) failed`))
  }

  function saveClosure (closure) {
    const api = jsonApi.value
    if (closure.id) {
      return api.one('closure', closure.id).patch(closure)
    } else {
      return api.create('closure', closure)
    }
  }

  const loginUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/auth/calnet', baseUrl)
  })

  const logoutUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/logout', baseUrl)
  })

  function logout () {
    const url = logoutUrl.value
    window.location = url
  }

  const exported = {
    init,
    loading,
    fetchItem,
    loadClosures,
    saveClosure,
    loadFacets,
    performSearch,
    reserveItem,
    loginUrl,
    logoutUrl,
    logout
  }

  // --------------------------------------------------
  // Internal functions and properties

  async function initApi (apiUrl) {
    apiBaseUrl.value = apiUrl

    const authToken = deleteParam(AUTH_TOKEN_PARAM)

    if (authToken) {
      jsonApi.value = newJsonApi(apiUrl, authToken)

      await initSession()
    } else {
      jsonApi.value = newJsonApi(apiUrl)
    }
  }

  // This will succeed if we already have an auth token, fail otherwise
  async function initSession () {
    const api = jsonApi.value
    const { updateUser } = useSessionStore()

    await api.one('user', 'current')
      .get()
      .then(updateUser)
      .catch(handleError('initSession() failed'))
  }

  async function initStores () {
    const stores = [
      useSessionStore(),
      useClosuresStore(),
      useReservationStore(),
      useSearchStore()
    ]

    for (const store of stores) {
      await store.init()
    }
  }

  function resultsFound (payload) {
    const { updateResults } = useResultStore()
    updateResults(payload)
  }

  function facetsLoaded ({ data }) {
    const facets = useFacetStore()
    facets.facets = data
  }

  function incrementLoadCount () {
    loadCount.value++
  }

  function decrementLoadCount () {
    loadCount.value--
  }

  // --------------------------------------------------
  // Store definition

  return exported
})

// ------------------------------------------------------------
// Private implementation

function newJsonApi (apiUrl, authToken = null) {
  const options = authToken ? { apiUrl: apiUrl, bearer: authToken } : { apiUrl }
  const jsonApi = new JsonApi(options)
  jsonApi.axios.defaults.withCredentials = true
  jsonApi.insertMiddlewareBefore('response', camelcaseMiddleware)
  jsonApi.insertMiddlewareBefore('axios-request', decamelizeMiddleware)
  for (const [name, attrs] of Object.entries(models)) {
    jsonApi.define(name, attrs)
  }
  return jsonApi
}

const models = {
  item: {
    image: '',
    imageUri: null,
    thumbnail: '',
    thumbnailUri: null,
    title: '',
    artist: '',
    artistUrl: '',
    date: '',
    description: '',
    dimensions: '',
    series: '',
    mmsId: '',
    barcode: '',
    circulation: '',
    location: '',
    value: '',
    appraisalDate: '',
    notes: '',
    reserveDate: null,
    suppressed: false,
    createdAt: null,
    updatedAt: null,
    permalinkUri: null,
    terms: { jsonApi: 'hasMany', type: 'term' }
  },
  term: {
    value: '',
    ord: null,
    facet: { jsonApi: 'hasOne', type: 'facet' },
    parent: { jsonApi: 'hasOne', type: 'term' },
    children: { jsonApi: 'hasMany', type: 'term' }
  },
  facet: {
    name: '',
    terms: { jsonApi: 'hasMany', type: 'term' }
  },
  reservation: {
    user: { jsonApi: 'hasOne', type: 'user' },
    item: { jsonApi: 'hasOne', type: 'item' }
  },
  user: {
    uid: '',
    displayName: '',
    email: '',
    galcAdmin: false,
    debug: ''
  },
  closure: {
    note: null,
    startDate: null,
    endDate: null,
    createdAt: null,
    updatedAt: null,
    current: false,
    past: false,
    future: false
  }
}

// TODO: display errors
function handleError (msg) {
  // TODO: transition to error state
  return (error) => {
    console.log(`${msg}: %o`, error)
    return Promise.resolve({})
  }
}

// ------------------------------------------------------------
// Camelization/Decamelization

// TODO: do this on server side with JSONAPI::Serializer.set_key_transform
const camelcaseMiddleware = {
  name: 'camelcase-middleware',
  res: (payload) => {
    const axiosData = payload.res.data
    axiosData.data = camelcaseKeys(axiosData.data, { deep: true })
    return payload
  }
}

const decamelizeMiddleware = {
  name: 'decamelize-middleware',
  req: (payload) => {
    const axiosData = payload.req.data
    if (axiosData) {
      console.log('axiosData: %o', axiosData)
      axiosData.data = decamelizeKeys(axiosData.data)
    }
    return payload
  }
}

function decamelizeKeys (data) {
  console.log('decamelizing %o', data)
  if (Array.isArray(data)) {
    return data.map(d => decamelizeKeys(d))
  }
  if (!isObject(data)) {
    return data
  }
  return mapObject(data, (k, v) => {
    const key = decamelize(k)
    const value = decamelizeKeys(v)
    console.log('%o: %o => %o: %o', k, v, key, value)
    return [key, value]
  })
}

function isObject (value) {
  return typeof value === 'object' &&
    value !== null &&
    !(value instanceof RegExp) &&
    !(value instanceof Error) &&
    !(value instanceof Date)
}
