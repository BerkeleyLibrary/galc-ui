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
  const loadingFacets = ref(false)
  const loadingItems = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  const loading = computed(() => loadingFacets.value || loadingItems.value)

  function init (apiUrl) {
    jsonApi.value = newJsonApi(apiUrl)

    return loadFacets().then(() => {
      const search = useSearchStore()
      search.init() // TODO: should this live here instead?
    })
  }

  function loadFacets () {
    loadingFacets.value = true

    const api = jsonApi.value
    return api
      .findAll('facets', { include: 'terms' })
      .then(facetsLoaded)
      .catch(handleError('loadFacets() failed'))
  }

  function performSearch (params) {
    loadingItems.value = true

    const api = jsonApi.value

    return api
      .findAll('items', { include: 'terms', ...params })
      .then(resultsFound)
      .catch(handleError('performSearch() failed'))
  }

  const exported = { init, loading, loadFacets, performSearch }

  // --------------------------------------------------
  // Internal functions and properties

  function resultsFound (payload) {
    const { updateResults } = useResultStore()
    updateResults(payload)

    loadingItems.value = false
  }

  function facetsLoaded ({ data }) {
    const facets = useFacetStore()
    facets.facets = data

    loadingFacets.value = false
  }

  // --------------------------------------------------
  // Store definition

  return exported
})

// ------------------------------------------------------------
// Private implementation

function newJsonApi (apiUrl) {
  const jsonApi = new JsonApi({ apiUrl })
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
