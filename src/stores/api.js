import JsonApi from 'devour-client'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import camelcaseKeys from 'camelcase-keys'

import { useFacetStore } from './facets'
import { useResultStore } from './results'
import { useSearchStore } from './search'
import { useSessionStore } from './session'
import { useReservationStore } from './reservation'

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
  const reservingItem = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  const loading = computed(() => {
    return loadingFacets.value || loadingItems.value || reservingItem.value
  })

  async function init (apiUrl) {
    await initApi(apiUrl)
    await loadFacets()
    await initStores()
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

  function fetchItem (itemId) {
    const api = jsonApi.value
    return api.find('item', itemId, { include: 'terms' })
  }

  function reserveItem (itemId) {
    console.log('reserveItem(%o)', itemId)

    reservingItem.value = true

    const { itemReserved } = useReservationStore()

    const api = jsonApi.value
    return api
      .create('reservation', { item: { id: itemId } })
      .then(itemReserved)
      .catch(handleError(`reserveItem(${itemId}) failed`))
      .finally(() => { reservingItem.value = false })
  }

  const loginUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/auth/calnet', baseUrl)
  })

  const logoutUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/logout', baseUrl)
  })

  const exported = { init, loading, fetchItem, loadFacets, performSearch, reserveItem, loginUrl, logoutUrl }

  // --------------------------------------------------
  // Internal functions and properties

  async function initApi (apiUrl) {
    apiBaseUrl.value = apiUrl

    jsonApi.value = newJsonApi(apiUrl)
    await initSession()
  }

  // This will succeed if we already have a cookie, fail otherwise
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
      useSearchStore(),
      useReservationStore()
    ]
    for (const store of stores) {
      store.init()
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
    galcAdmin: false,
    debug: ''
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
