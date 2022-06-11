import JsonApi from 'devour-client'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import camelcaseKeys from 'camelcase-keys'

import { useFacetStore } from './facets'
import { useResultStore } from './results'
import { useSearchStore } from './search'

// ------------------------------------------------------------
// Store definition

// TODO: is there an advantage to using a Pinia store over a globally
//       exported constant?

export const useApiStore = defineStore('api', () => {
  // --------------------------------------------------
  // State

  const jsonApi = ref(null)
  const apiBaseUrl = ref('')
  const loadingFacets = ref(false)
  const loadingItems = ref(false)
  const reservingItem = ref(null)
  const pendingItem = ref(null)
  const loggedIn = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  const loading = computed(() => loadingFacets.value || loadingItems.value || reservingItem.value)

  function init (apiUrl) {
    apiBaseUrl.value = apiUrl
    const reserveItemId = getReserveItemFromWindowLocation()

    const authToken = getAuthTokenFromWindowLocation()
    if (authToken) {
      clearAuthTokenFromWindowLocation()
    }
    jsonApi.value = newJsonApi(apiUrl, authToken)
    loggedIn.value = !!authToken

    return loadFacets().then(() => {
      const search = useSearchStore()
      search.init() // TODO: should this live here instead?

      if (reserveItemId) {
        clearReserveItemFromWindowLocation()
        reserveItem({ id: reserveItemId })
      }
    })
  }

  function loadFacets () {
    loadingFacets.value = true

    const api = jsonApi.value
    return api
      .findAll('facets', { include: 'terms' })
      .then(facetsLoaded)
      .catch(handleError('loadFacets() failed'))
      .finally(() => { loadingFacets.value = false })
  }

  function performSearch (params) {
    loadingItems.value = true

    const api = jsonApi.value

    return api
      .findAll('items', { include: 'terms', ...params })
      .then(resultsFound)
      .catch(handleError('performSearch() failed'))
      .finally(() => { loadingItems.value = false })
  }

  function reserveItem (item) {
    reservingItem.value = item

    const api = jsonApi.value

    return api
      .create('reservation', { item })
      .catch((error) => {
        // TODO: something more elegant
        const err0 = error[0]
        if (err0 && (err0.title === 'Unauthorized')) {
          pendingItem.value = item
        } else {
          const handle = handleError(`reserveItem(${item.id}) failed`)
          return handle(error)
        }
      })
      .finally(() => { reservingItem.value = null })
  }

  const reserveItemRedirectUrl = computed(() => {
    const item = pendingItem.value
    const url = item && getReserveItemRedirectUrl(item.id)
    console.log('reserveItemRedirectUrl() -> item = %o, url = %o', item, url)
    return url
  })

  const loginUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/auth/calnet', baseUrl)
  })

  const logoutUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/logout', baseUrl)
  })

  const exported = { init, loading, loadFacets, performSearch, reserveItem, loggedIn, loginUrl, logoutUrl, reserveItemRedirectUrl, reservingItem, pendingItem }

  // --------------------------------------------------
  // Internal functions and properties

  function resultsFound (payload) {
    const { updateResults } = useResultStore()
    updateResults(payload)
  }

  function facetsLoaded ({ data }) {
    const facets = useFacetStore()
    facets.facets = data
  }

  // --------------------------------------------------
  // Store definition

  return exported
})

// ------------------------------------------------------------
// Private implementation

const AUTH_TOKEN_PARAM = 'token'
const RESERVE_ITEM_PARAM = 'reserve'

// TODO: share window location manipulation w/search.js

function getAuthTokenFromWindowLocation () {
  const params = new URL(window.location).searchParams
  return params.get(AUTH_TOKEN_PARAM)
}

function getReserveItemFromWindowLocation () {
  const params = new URL(window.location).searchParams
  const itemVal = params.get(RESERVE_ITEM_PARAM)
  return parseInt(itemVal) || 0
}

function clearAuthTokenFromWindowLocation () {
  const url = new URL(window.location)
  const params = url.searchParams
  params.delete(AUTH_TOKEN_PARAM)
  const newSearch = params.toString()
  if (url.search !== newSearch) {
    url.search = newSearch
    window.history.pushState(null, '', url)
  }
}

function clearReserveItemFromWindowLocation () {
  const url = new URL(window.location)
  const params = url.searchParams
  params.delete(RESERVE_ITEM_PARAM)
  const newSearch = params.toString()
  if (url.search !== newSearch) {
    url.search = newSearch
    window.history.pushState(null, '', url)
  }
}

function getReserveItemRedirectUrl (itemId) {
  const url = new URL(window.location)
  const params = url.searchParams
  params.set(RESERVE_ITEM_PARAM, itemId)
  const newSearch = params.toString()
  url.search = newSearch
  return url
}

function newJsonApi (apiUrl, authToken) {
  const options = authToken ? { apiUrl: apiUrl, bearer: authToken } : { apiUrl }
  const jsonApi = new JsonApi(options)
  jsonApi.insertMiddlewareBefore('response', camelcaseMiddleware)
  for (const [name, attrs] of Object.entries(models)) {
    jsonApi.define(name, attrs)
  }
  return jsonApi
}

const models = {
  item: {
    image: '',
    thumbnail: '',
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
    createdAt: null,
    updatedAt: null,
    permalinkUri: null,
    terms: { jsonApi: 'hasMany', type: 'term' }
  },
  term: {
    value: '',
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
    email: ''
  }
}

// TODO: do this on server side with JSONAPI::Serializer.set_key_transform
const camelcaseMiddleware = {
  name: 'camelcase-middleware',
  res: (payload) => {
    const axiosData = payload.res.data
    axiosData.data = camelcaseKeys(axiosData.data, { deep: true })
    return payload
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
