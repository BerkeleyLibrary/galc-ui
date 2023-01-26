import axios from 'axios'
// @ts-ignore: no type information provided
import JsonApi from 'devour-client'
import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'

import { useFacetStore } from './facets'
import { useResultStore } from './results'
import { useSearchStore } from './search'
import { useSessionStore } from './session'
import { useReservationStore } from './reservation'
import { useClosuresStore } from './closures'
import { useWindowLocationStore } from "./window-location"
import { Params } from "../types/Params"
import { Item } from "../types/Item"
import { Closure } from "../types/Closure"
import { Image } from "../types/Image"
import { ImageApi } from "../types/ImageApi"
import { ItemResults } from "../types/ItemResults"
import { GalcApi, Result } from "../types/GalcApi"
import { Facet } from "../types/Facet"
import { ClosureResults } from "../types/ClosureResults"
import { AUTH_TOKEN_PARAM } from "../helpers/params"
import { camelizePayload, decamelizePayload } from "../helpers/camelize-helper"
import { handleError } from "../helpers/handle-error"

// ------------------------------------------------------------
// Store definition

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
      .finally(decrementLoadCount)
  }

  function fetchItem(itemId: string): Promise<Result<Item>> {
    return galcApi()
      .find('item', itemId, { include: 'image,terms' })
  }

  function saveItem(item: Item): Promise<Result<Item>> {
    const api = galcApi()
    if (item.id) {
      return api.one('item', item.id).patch(item)
    } else {
      return api.create('item', item)
    }
  }

  function deleteItem(item: Item): Promise<void> {
    const itemId = item.id
    if (itemId) {
      return galcApi().destroy('item', itemId)
    } else {
      return Promise.resolve()
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
    const closureId = closure.id
    if (closureId) {
      return galcApi().destroy('closure', closureId)
    } else {
      return Promise.resolve()
    }
  }

  function fetchImage(imageId: string): Promise<Result<Image>> {
    return galcApi()
      .find('image', imageId)
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
    deleteItem,
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
    const { deleteParam } = useWindowLocationStore()
    const authToken = deleteParam(AUTH_TOKEN_PARAM)

    apiBaseUrl.value = apiUrl

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
    const search = useSearchStore()

    const stores = [
      useSessionStore(),
      useClosuresStore(),
      useReservationStore(),
      search
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
    const facets = useFacetStore()
    facets.facets = data
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
      headers,
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
  const options = authToken ? { apiUrl, bearer: authToken } : { apiUrl }
  const jsonApi = new JsonApi(options)
  jsonApi.axios.defaults.withCredentials = true
  jsonApi.insertMiddlewareBefore('response', camelizeMiddleware)
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

// ------------------------------------------------------------
// Camelization/Decamelization

// TODO: do this on server side with JSONAPI::Serializer.set_key_transform

// Decamelize request data
const decamelizeMiddleware = {
  name: 'decamelize-middleware',
  req: decamelizePayload
}

// Camelize response data
const camelizeMiddleware = {
  name: 'camelize-middleware',
  res: camelizePayload
}
