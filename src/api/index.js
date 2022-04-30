import JsonApi from 'devour-client'
import { useConfigStore } from '../stores/config'
import camelcaseKeys from 'camelcase-keys'

export default {
  facets () {
    return allFacets()
  },
  items (params = {}) {
    return allItems(params)
  }
}

function allFacets () {
  return jsonApi().findAll('facets', { include: 'terms' })
}

function allItems (params = {}) {
  return jsonApi().findAll('items', params)
}

// TODO: encapsulate all this in an object?

let _jsonApi = null

function jsonApi () {
  if (!_jsonApi) {
    _jsonApi = initJsonApi()
  }
  return _jsonApi
}

function initJsonApi () {
  const jsonApi = new JsonApi({ apiUrl: apiBaseUrl() })
  jsonApi.insertMiddlewareBefore('response', camelcaseMiddleware)

  // noinspection JSUnusedGlobalSymbols
  jsonApi.define(
    'facet',
    {
      name: '',
      terms: { jsonApi: 'hasMany', type: 'term' } // TODO: should this be plural?
    }
  )

  jsonApi.define(
    'term',
    {
      value: '',
      facet: { jsonApi: 'hasOne', type: 'facet' },
      parent: { jsonApi: 'hasOne', type: 'term' },
      children: { jsonApi: 'hasMany', type: 'term' } // TODO: should this be plural?
    })

  jsonApi.define(
    'item',
    {
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
      terms: { jsonApi: 'hasMany', type: 'term' }
    }
  )
  return jsonApi
}

function apiBaseUrl () {
  return config().baseUrl
}

let _config = null

function config () {
  if (!_config) {
    _config = useConfigStore()
  }
  return _config
}

const camelcaseMiddleware = {
  name: 'camelcase-middleware',
  res: (payload) => {
    const axiosData = payload.res.data
    axiosData.data = camelcaseKeys(axiosData.data, { deep: true })
    return payload
  }
}
