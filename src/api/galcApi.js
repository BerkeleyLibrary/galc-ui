import JsonApi from 'devour-client'
import { useConfigStore } from '../stores/config'
import camelcaseKeys from 'camelcase-keys'

export default {
  facets () {
    return this.jsonApi.findAll('facets', { include: 'terms' })
  },

  items (params = {}) {
    return this.jsonApi.findAll('items', { include: 'terms', ...params })
  },

  get jsonApi () {
    delete this.jsonApi
    const jsonApi = initJsonApi()
    return (this.jsonApi = jsonApi)
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
