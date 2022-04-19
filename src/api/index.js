import JsonApi from 'devour-client'
import { useConfigStore } from '../stores/config'

export default {
  facets () {
    return allFacets()
  },
  items () {
    return allItems()
  }
}

function allFacets () {
  return jsonApi().findAll('facets', { include: 'terms' })
}

function allItems () {
  return jsonApi().findAll('items')
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

