// @ts-ignore
import JsonApi from 'devour-client'
import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'
import decamelize from 'decamelize'
import camelcaseKeys from 'camelcase-keys'
import mapObject from 'map-obj'
import axios from 'axios'

import { deleteParam } from '../helpers/window-location-helper'

import { useFacetStore } from './facets'
import { useResultStore } from './results'
import { useSearchStore } from './search'
import { useSessionStore } from './session'
import { useReservationStore } from './reservation'
import { useClosuresStore } from './closures'
import { Params } from "../types/Params"
import { Item } from "../types/Item"
import { Closure } from "../types/Closure"
import { Image } from "../types/Image"
import { ImageApi } from "../types/ImageApi"
import { ItemResults } from "../types/ItemResults"
import { GalcApi, Result } from "../types/GalcApi"
import { Facet } from "../types/Facet"
import { ClosureResults } from "../types/ClosureResults"

// ------------------------------------------------------------
// Store definition

export const AUTH_TOKEN_PARAM = 'token'

export const useApiStore = defineStore('api', () => {
  // --------------------------------------------------
  // State

  const jsonApi: Ref<GalcApi | undefined> = ref()
  const imageApi: Ref<ImageApi | undefined> = ref()
  const apiBaseUrl = ref('')
  const loadCount = ref(0)

  const initialized = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  const loading = computed(() => {
    if (!initialized.value) {
      return true
    }
    return loadCount.value > 0
  })

  async function init(apiUrl: string) {
    await initApi(apiUrl)
    await loadFacets() // TODO: move this to facet store initializer?
    await initStores()

    initialized.value = true
  }

  function loadFacets(): Promise<void> {
    incrementLoadCount()

    return galcApi()
      .findAll('facets', { include: 'terms' })
      .then(facetsLoaded)
      .catch(handleError('loadFacets() failed'))
      .finally(decrementLoadCount)
  }

  function performSearch(params: Params): Promise<void> {
    incrementLoadCount()

    return galcApi()
      .findAll('items', { include: 'image,terms', ...params })
      .then(resultsFound)
      .catch(handleError('performSearch() failed'))
      .finally(decrementLoadCount)
  }

  function reserveItem(itemId: string): Promise<void> {
    incrementLoadCount()
    const { reservationSuccessful } = useReservationStore()

    return galcApi()
      .create('reservation', { item: { id: itemId } })
      .then(reservationSuccessful)
      .catch(handleError(`reserveItem(${itemId}) failed`))
      .finally(decrementLoadCount)
  }

  function loadClosures(params = {}): Promise<ClosureResults> {
    incrementLoadCount()
    return galcApi()
      .findAll('closures', params)
      .catch(handleError<ClosureResults>(`loadClosures(${params}) failed`))
      .finally(decrementLoadCount)
  }

  function fetchItem(itemId: string): Promise<Result<Item>> {
    return galcApi()
      .find('item', itemId, { include: 'terms' })
      .catch(handleError(`fetchItem(${itemId}) failed`))
  }

  function saveItem(item: Item): Promise<Result<Item>> {
    const api = galcApi()
    if (item.id) {
      return api.one('item', item.id).patch(item)
    } else {
      return api.create('item', item)
    }
  }

  function saveClosure(closure: Closure): Promise<Result<Closure>> {
    const api = galcApi()
    if (closure.id) {
      return api.one('closure', closure.id).patch(closure)
    } else {
      return api.create('closure', closure)
    }
  }

  function deleteClosure(closure: Closure): Promise<void> {
    if (closure.id) {
      return galcApi().destroy('closure', closure.id)
    } else {
      return Promise.resolve()
    }
  }

  function fetchImage(imageId: string): Promise<Result<Image>> {
    return galcApi()
      .find('image', imageId)
      .catch(handleError(`fetchImage(${imageId}) failed`))
  }

  function deleteImage(image: { id: string }) {
    return galcApi().destroy('image', image.id)
  }

  const loginUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return baseUrl && new URL('/auth/calnet', baseUrl)
  })

  const logoutUrl = computed(() => {
    const baseUrl = apiBaseUrl.value
    return new URL('/logout', baseUrl)
  })

  function logout() {
    const url = logoutUrl.value
    // @ts-ignore // see https://github.com/microsoft/TypeScript/issues/48949
    window.location = url.toString()
  }

  const exported = {
    apiBaseUrl,
    imageApi,
    init,
    loading,
    fetchItem,
    loadClosures,
    saveClosure,
    saveItem,
    deleteClosure,
    loadFacets,
    performSearch,
    reserveItem,
    fetchImage,
    deleteImage,
    loginUrl,
    logoutUrl,
    logout
  }

  // --------------------------------------------------
  // Internal functions and properties

  function galcApi() {
    return <GalcApi>jsonApi.value
  }

  async function initApi(apiUrl: string) {
    apiBaseUrl.value = apiUrl

    const authToken = deleteParam(AUTH_TOKEN_PARAM)

    if (authToken) {
      jsonApi.value = newJsonApi(apiUrl, authToken)

      imageApi.value = newImageApi(apiUrl, authToken)

      await initSession()
    } else {
      jsonApi.value = newJsonApi(apiUrl)
    }
  }

  // This will succeed if we already have an auth token, fail otherwise
  async function initSession() {
    const { updateUser } = useSessionStore()

    await galcApi().one('user', 'current')
      .get()
      .then(updateUser)
      .catch(handleError('initSession() failed'))
  }

  async function initStores() {
    const stores = [
      useSessionStore(),
      useClosuresStore(),
      useReservationStore(),
      useSearchStore()
    ]

    for (const store of stores) {
      await store.init()
    }
  }

  function resultsFound(payload: ItemResults) {
    const { updateResults } = useResultStore()
    updateResults(payload)
  }

  function facetsLoaded({ data }: Result<Facet[]>) {
    if (data) {
      const facets = useFacetStore()
      facets.facets = data
    }
  }

  function incrementLoadCount() {
    loadCount.value++
  }

  function decrementLoadCount() {
    loadCount.value--
  }

  function newImageApi(apiUrl: string, authToken: string): ImageApi {
    const imageApiEndpoint = `${apiUrl}/images`
    const headers = { Authorization: `Bearer ${authToken}` }
    return {
      url: imageApiEndpoint,
      timeout: 10000,
      headers: headers,
      withCredentials: true,
      // FilePond's default revert()/DELETE passes the ID in the request body
      // instead of using a RESTful URL, so we need a custom implementation here
      revert: (id, load, error) => {
        const imageUrl = `${imageApiEndpoint}/${id}`
        // TODO: just use deleteImage()?
        axios.delete(imageUrl, { headers })
          .then((_resp) => load())
          .catch((err) => {
            const msg = err.message
            handleError(msg)
            return error(msg)
          })
      }
    }
  }

  // --------------------------------------------------
  // Store definition

  return exported
})

// ------------------------------------------------------------
// Private implementation

function newJsonApi(apiUrl: string, authToken?: string | null) {
  const options = authToken ? { apiUrl: apiUrl, bearer: authToken } : { apiUrl }
  const jsonApi = new JsonApi(options)
  jsonApi.axios.defaults.withCredentials = true
  jsonApi.insertMiddlewareBefore('response', camelcaseMiddleware)
  jsonApi.insertMiddlewareBefore('axios-request', decamelizeMiddleware)
  for (const [name, attrs] of Object.entries(models)) {
    jsonApi.define(name, attrs)
  }
  return jsonApi
}

const models = {
  item: {
    thumbnailUri: null,
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
    suppressed: false,
    createdAt: null,
    updatedAt: null,
    permalinkUri: null,
    terms: { jsonApi: 'hasMany', type: 'term' },
    image: { jsonApi: 'hasOne', type: 'image' }
  },
  term: {
    value: '',
    ord: null,
    facet: { jsonApi: 'hasOne', type: 'facet' },
    parent: { jsonApi: 'hasOne', type: 'term' },
    children: { jsonApi: 'hasMany', type: 'term' }
  },
  facet: {
    name: '',
    allowMultiple: false,
    terms: { jsonApi: 'hasMany', type: 'term' }
  },
  reservation: {
    confirmed: true,
    user: { jsonApi: 'hasOne', type: 'user' },
    item: { jsonApi: 'hasOne', type: 'item' }
  },
  image: {
    thumbnail: '',
    basename: ''
  },
  user: {
    uid: '',
    displayName: '',
    email: '',
    galcAdmin: false,
    debug: ''
  },
  closure: {
    note: null,
    startDate: null,
    endDate: null,
    createdAt: null,
    updatedAt: null,
    current: false,
    past: false,
    future: false
  }
}

// TODO: display errors
function handleError<T = void>(msg: string): (error: any) => Promise<T> {
  // TODO: transition to error state
  return (error: any) => {
    console.log(`${msg}: %o`, error)
    return Promise.resolve(<T>{})
  }
}

// ------------------------------------------------------------
// Camelization/Decamelization

type ResponsePayload<T> = {
  res: Result<T>
}

type RequestPayload<T> = {
  req: Result<T>
}

// TODO: do this on server side with JSONAPI::Serializer.set_key_transform
const camelcaseMiddleware = {
  name: 'camelcase-middleware',
  res: (payload: ResponsePayload<any>) => {
    const axiosData = payload.res.data
    if (typeof axiosData === 'object') {
      axiosData.data = camelcaseKeys(axiosData.data, { deep: true })
    }
    return payload
  }
}

const decamelizeMiddleware = {
  name: 'decamelize-middleware',
  req: (payload: RequestPayload<any>) => {
    const axiosData = payload.req.data
    if (axiosData) {
      axiosData.data = decamelizeKeys(axiosData.data)
    }
    return payload
  }
}

function decamelizeKeys(data: any): any {
  if (Array.isArray(data)) {
    return data.map(d => decamelizeKeys(d))
  }
  if (!isObject(data)) {
    return data
  }
  return mapObject(data, (k, v) => {
    const key = decamelize(<string>k)
    const value = decamelizeKeys(v)
    return [key, value]
  })
}

function isObject(value: any): boolean {
  return typeof value === 'object' &&
    value !== null &&
    !(value instanceof RegExp) &&
    !(value instanceof Error) &&
    !(value instanceof Date)
}
