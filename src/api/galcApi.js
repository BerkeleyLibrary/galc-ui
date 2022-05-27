import JsonApi from 'devour-client'
import { useConfigStore } from '../stores/config'
import { useSearchStore } from '../stores/search'
import { useResultStore } from '../stores/results'

import camelcaseKeys from 'camelcase-keys'

const client = initClient()

function loadFacets () {
  return client.loadFacets()
}

function performSearch (params = client.searchParams) {
  return client.performSearch(params)
}

export { loadFacets, performSearch }

function initClient () {
  return {
    get search () {
      delete this.search
      return (this.search = useSearchStore())
    },

    get results () {
      delete this.results
      return (this.results = useResultStore())
    },

    get jsonApi () {
      delete this.jsonApi
      const jsonApi = initJsonApi()
      return (this.jsonApi = jsonApi)
    },

    get searchParams () {
      return this.search.searchParams
    },

    loadFacets () {
      const search = this.search

      return this.jsonApi
        .findAll('facets', { include: 'terms' })
        .then(search.updateFacets)
        .catch(this.handleError('loadFacets failed'))
    },

    performSearch (params) {
      const results = this.results

      results.loading = true
      return this.jsonApi
        .findAll('items', { include: 'terms', ...params })
        .then(results.updateResults)
        .catch(this.handleError('performSearch failed'))
        .finally(() => { results.loading = false })
    },

    handleError (msg) {
      return (error) => console.log(`${msg}: %o`, error)
    }
  }
}

function initJsonApi () {
  const config = useConfigStore()
  const jsonApi = new JsonApi({ apiUrl: config.baseUrl })
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
