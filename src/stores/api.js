import JsonApi from 'devour-client'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import camelcaseKeys from 'camelcase-keys'

import { useFacetStore } from './facets'
import { useResultStore } from './results'
import { useSearchStore } from './search'
import { useSessionStore } from './session'

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
  const reservedItemIds = ref([])

  // --------------------------------------------------
  // Exported functions and properties

  const loading = computed(() => loadingFacets.value || loadingItems.value || reservingItem.value)

  function init (apiUrl) {
    apiBaseUrl.value = apiUrl

    const authToken = getAuthTokenFromWindowLocation()
    jsonApi.value = newJsonApi(apiUrl, authToken)

    // TODO: DRY this
    if (authToken) {
      clearAuthTokenFromWindowLocation()
      return initSession().then(() => loadFacets().then(initSearch))
    } else {
      return loadFacets().then(initSearch)
    }
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
    console.log('reserveItem(%o)', item)
    reservingItem.value = item

    const api = jsonApi.value

    return api
      .create('reservation', { item })
      .then(itemReserved).catch(handleError(`reserveItem(${item.id}) failed`))
      .finally(() => { reservingItem.value = null })
  }

  function isReserved (item) {
    const reservedIds = reservedItemIds.value
    return reservedIds.includes(item.id)
  }

  function reserveItemRedirectUrl (item) {
    const url = new URL(window.location)
    const params = url.searchParams
    params.set(RESERVE_ITEM_PARAM, item.id)
    const newSearch = params.toString()
    url.search = newSearch
    return url
  }

  const loginUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/auth/calnet', baseUrl)
  })

  const logoutUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/logout', baseUrl)
  })

  // TODO: extract a ReservationStore
  const exported = { init, loading, loadFacets, performSearch, reserveItem, isReserved, loginUrl, logoutUrl, reserveItemRedirectUrl, reservingItem }

  // --------------------------------------------------
  // Internal functions and properties

  function itemReserved ({ data }) {
    console.log('Created reservation: { %o }', data)
    const item = data.item
    reservedItemIds.value.push(item.id)
  }

  function resultsFound (payload) {
    const { updateResults } = useResultStore()
    updateResults(payload)
  }

  function facetsLoaded ({ data }) {
    const facets = useFacetStore()
    facets.facets = data
  }

  function initSession () {
    const api = jsonApi.value
    return api.one('user', 'current')
      .get()
      .then(({ data }) => {
        console.log('Initializing session with { %o }', data)
        const { user } = storeToRefs(useSessionStore())
        user.value = data
      })
      .catch(handleError('initSession() failed'))
  }

  function initSearch () {
    const reserveItemId = getReserveItemFromWindowLocation()
    console.log('initSearch(): reserveItemId = %o', reserveItemId)

    const search = useSearchStore()
    search.init() // TODO: should this live here instead?

    if (reserveItemId) {
      clearReserveItemFromWindowLocation()
      reserveItem({ id: reserveItemId })
    }
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
    email: '',
    galcAdmin: false
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
