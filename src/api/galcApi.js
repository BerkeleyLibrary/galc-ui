import JsonApi from 'devour-client'
import camelcaseKeys from 'camelcase-keys'

import { useFacetStore } from '../stores/facets'
import { useResultStore } from '../stores/results'

export function createClient (apiUrl) {
  const jsonApi = newJsonApi(apiUrl)

  return {
    handleError (msg) {
      return (error) => {
        console.log(`${msg}: %o`, error)
        return Promise.resolve({})
      }
    },
    loadFacets () {
      const facets = useFacetStore()
      jsonApi
        .findAll('facets', { include: 'terms' })
        .then(({ data }) => { facets.facets = data })
        .catch(this.handleError('loadFacets failed'))
    },
    findItems (params) {
      const results = useResultStore()
      results.loading = true
      return jsonApi
        .findAll('items', { include: 'terms', ...params })
        .then(results.updateResults)
        .catch(this.handleError('findItems failed'))
        .finally(() => { results.loading = false })
    }
  }
}

// ------------------------------------------------------------
// Private implementation

function newJsonApi (apiUrl) {
  const jsonApi = new JsonApi({ apiUrl: apiUrl })
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
