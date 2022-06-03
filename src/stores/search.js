import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useFacetStore } from './facets'
import { useApiStore } from './api'

// ------------------------------------------------------------
// Store definition

// TODO: missing functionality?

export const useSearchStore = defineStore('search', () => {
  // --------------------------------------------------
  // Exported functions and properties

  function init () {
    const initState = readWindowLocation()
    console.log('search.init(): initState = %o', initState)

    state.value = initState

    // On page load, we only perform a search if we have a non-empty query
    if (Object.keys(initState.search).length > 0 || initState.page !== DEFAULT_PAGE) {
      console.log('performing initial search')
      doSearch()
    }

    watch(state, (state) => {
      console.log('search: state changed: %o', state)
      writeWindowLocation()
      doSearch()
    })
  }

  const keywords = computed({
    get () {
      return search.value.keywords
    },
    set (v) {
      state.value = {
        search: { keywords },
        page: DEFAULT_PAGE
      }
    }
  })

  const selectedTerms = computed(() => {
    return (facetName) => computed({
      get () {
        return search.value[facetName] || []
      },
      set (v) {
        search.value[facetName] = v
      }
    })
  })

  const exported = { init, keywords, selectedTerms }

  // --------------------------------------------------
  // Internal functions and properties

  // ------------------------------
  // State

  const state = ref({
    search: {},
    page: DEFAULT_PAGE
  })

  const search = computed(() => state.value.search)
  const page = computed(() => state.value.page)

  function readWindowLocation () {
    const params = new URL(window.location).searchParams
    return {
      search: searchFrom(params),
      page: pageFrom(params)
    }
  }

  function writeWindowLocation () {
    const params = searchParamsFrom(search.value)
    addPageParam(params, page.value)

    const url = new URL(window.location)
    url.search = params.toString()

    window.history.pushState(null, '', url)
  }

  function doSearch () {
    const params = filterParamsFrom(search.value)
    addPageNumber(params, page.value)

    const api = useApiStore()
    api.performSearch(params)
  }

  // --------------------------------------------------
  // Store definition

  return exported
})

// ------------------------------------------------------------
// Misc. constants

const DEFAULT_PAGE = 1
const KEYWORDS_PARAM = 'keywords'
const PAGE_PARAM = 'page'

// ------------------------------------------------------------
// External state

function getFacetNames () {
  const { facetNames } = storeToRefs(useFacetStore())
  return facetNames.value // TODO: do we really need to unwrap this?
}

// ------------------------------------------------------------
// Window location query parsing

function searchFrom (urlSearchParams) {
  const newSearch = {}

  const keywordsVal = urlSearchParams.get(KEYWORDS_PARAM)
  if (keywordsVal) {
    newSearch.keywords = keywordsVal
  }

  for (const facetName of getFacetNames()) {
    const facetVal = urlSearchParams.get(facetName)
    if (facetVal) {
      newSearch[facetName] = facetVal.split(',')
    }
  }

  return newSearch
}

function pageFrom (urlSearchParams) {
  const pageVal = urlSearchParams.get(PAGE_PARAM)
  return parseInt(pageVal) || DEFAULT_PAGE
}

// ------------------------------------------------------------
// Window location query creation

function searchParamsFrom (search) {
  const params = new URLSearchParams()
  const keywordsVal = search.keywords
  if (keywordsVal) {
    params.set(KEYWORDS_PARAM, keywordsVal)
  }

  for (const facetName of getFacetNames()) {
    const termValues = search[facetName]
    if (termValues) {
      params.set(facetName, termValues.join(','))
    }
  }
  return params
}

// TODO: better naming (see addPageNumber)
function addPageParam (params, page) {
  if (page !== DEFAULT_PAGE) {
    params.set(PAGE_PARAM, page)
  }
}

// ------------------------------------------------------------
// API query creation

function filterParamsFrom (search) {
  const filterParams = {}
  const searchParams = searchParamsFrom(search)
  searchParams.forEach((value, key) => {
    filterParams[`filter[${key}]`] = value
  })
  return filterParams
}

// TODO: better naming (see addPageParam)
function addPageNumber (params, page) {
  if (page !== DEFAULT_PAGE) {
    params['page[number]'] = page
  }
}
