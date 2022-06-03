import JsonApi from 'devour-client'
import camelcaseKeys from 'camelcase-keys'
import { defineStore } from 'pinia'

import { useFacetStore } from './facets'
import { useResultStore } from './results'

// ------------------------------------------------------------
// Store definition

// TODO: is there an advantage to using a Pinia store over a globally
//       exported constant?

// TODO: get rid of apiClient, just use jsonApi (and setup function)
export const useApiStore = defineStore('api', {
  state: () => ({
    apiClient: null
  }),
  actions: {
    init (apiUrl) {
      this.apiClient = createClient(apiUrl)
      this.loadFacets()
    },
    loadFacets () {
      const apiClient = this.apiClient
      if (apiClient) {
        apiClient.loadFacets()
      }
    },
    performSearch (params) {
      const apiClient = this.apiClient
      if (apiClient) {
        apiClient.findItems(params)
      }
    }
  }
})

// ------------------------------------------------------------
// Private implementation

function createClient (apiUrl) {
  const jsonApi = newJsonApi(apiUrl)

  return {
    loadFacets () {
      const facets = useFacetStore()
      jsonApi
        .findAll('facets', { include: 'terms' })
        .then(({ data }) => { facets.facets = data })
        .catch(handleError('loadFacets failed'))
    },
    findItems (params) {
      const results = useResultStore()
      results.loading = true
      return jsonApi
        .findAll('items', { include: 'terms', ...params })
        .then(results.updateResults)
        .catch(handleError('findItems failed'))
        .finally(() => { results.loading = false })
    }
  }
}

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

function handleError (msg) {
  return (error) => {
    console.log(`${msg}: %o`, error)
    return Promise.resolve({})
  }
}
