import JsonApi from 'devour-client'
import camelcaseKeys from 'camelcase-keys'
import { defineStore } from 'pinia'

import { useFacetStore } from './facets'
import { useResultStore } from './results'
import { ref } from 'vue'

// ------------------------------------------------------------
// Store definition

// TODO: is there an advantage to using a Pinia store over a globally
//       exported constant?

export const useApiStore = defineStore('api', () => {
  const jsonApi = ref(null)

  function init (apiUrl) {
    jsonApi.value = newJsonApi(apiUrl)
    return loadFacets()
  }

  function loadFacets () {
    const api = jsonApi.value
    if (!api) {
      console.log('loadFacets(): API not initialized')
      return
    }

    const facets = useFacetStore()
    return api
      .findAll('facets', { include: 'terms' })
      .then(({ data }) => { facets.facets = data })
      .catch(handleError('loadFacets() failed'))
  }

  function performSearch (params) {
    const api = jsonApi.value
    if (!api) {
      console.log('performSearch(): API not initialized')
      return
    }

    const results = useResultStore()
    results.loading = true
    return api
      .findAll('items', { include: 'terms', ...params })
      .then(results.updateResults)
      .catch(handleError('performSearch() failed'))
      .finally(() => { results.loading = false })
  }

  return { init, loadFacets, performSearch }
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
  return (error) => {
    console.log(`${msg}: %o`, error)
    return Promise.resolve({})
  }
}
