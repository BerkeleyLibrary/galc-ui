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
  const paramsActual = { include: 'terms', ...params }
  return jsonApi().findAll('items', paramsActual)
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
  defineFacet(jsonApi)
  defineTerm(jsonApi)
  defineItem(jsonApi)
  return jsonApi
}

function defineFacet (jsonApi) {
  jsonApi.define(
    'facet',
    {
      name: '',
      terms: { jsonApi: 'hasMany', type: 'term' }
    }
  )
}

function defineTerm (jsonApi) {
  jsonApi.define(
    'term',
    {
      value: '',
      facet: { jsonApi: 'hasOne', type: 'facet' },
      parent: { jsonApi: 'hasOne', type: 'term' },
      children: { jsonApi: 'hasMany', type: 'term' }
    })
}

function defineItem (jsonApi) {
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
      permalinkUri: null,
      terms: { jsonApi: 'hasMany', type: 'term' }
    }
  )
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

// TODO: do this on server side with JSONAPI::Serializer.set_key_transform
const camelcaseMiddleware = {
  name: 'camelcase-middleware',
  res: (payload) => {
    const axiosData = payload.res.data
    axiosData.data = camelcaseKeys(axiosData.data, { deep: true })
    return payload
  }
}
