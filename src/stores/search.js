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
    state.value = initState
    console.log('search.init(): initState = %o', initState)

    watch(state, (state) => {
      console.log('search.state => %o', state)
      writeWindowLocation()
      doSearch()
    }, { deep: true, immediate: true, flush: 'post' })
  }

  const keywords = computed({
    get () {
      console.log('search.keywords.get() => %o', state.value.search.keywords)
      return state.value.search.keywords
    },
    set (v) {
      console.log('search.keywords.set(%o)', v)
      state.value = {
        search: { keywords: v },
        page: DEFAULT_PAGE
      }
      console.log('new state: %o', state.value)
    }
  })

  function selectedTerms (facetName) {
    let termSelection = computedTermSelections[facetName]
    if (!termSelection) {
      termSelection = computed({
        get () {
          const terms = state.value.search[facetName] || []
          console.log('selectedTerms(%o).get() => %o', facetName, terms)
          return terms
        },
        set (v) {
          console.log('selectedTerms(%o).set(%o)', facetName, v)
          state.value.search[facetName] = v
        }
      })
      computedTermSelections[facetName] = termSelection
    }
    return termSelection
  }

  const exported = { init, keywords, selectedTerms }

  // --------------------------------------------------
  // Internal functions and properties

  // ------------------------------
  // Internal state

  const state = ref({
    search: {},
    page: DEFAULT_PAGE
  })

  const computedTermSelections = {}

  // ------------------------------
  // Internal functions

  function readWindowLocation () {
    const params = new URL(window.location).searchParams
    return {
      search: searchFrom(params),
      page: pageFrom(params)
    }
  }

  function writeWindowLocation () {
    const params = searchParamsFrom(state.value.search)
    addPageParam(params, state.value.page)
    const newSearch = params.toString()
    console.log('writeWindowLocation(): newSearch = %o', newSearch)

    const url = new URL(window.location)
    if (url.search !== newSearch) {
      url.search = newSearch
      console.log('pushing new state to window history: %o', url)

      window.history.pushState(null, '', url)
    } else {
      console.log('search is unchanged; window history not modified')
    }
  }

  function doSearch () {
    const params = filterParamsFrom(state.value.search)
    addPageNumber(params, state.value.page)

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
// Window location query parsing

function searchFrom (urlSearchParams) {
  const newSearch = {}

  const keywordsVal = urlSearchParams.get(KEYWORDS_PARAM)
  if (keywordsVal) {
    newSearch.keywords = keywordsVal
  }

  const { facetNames } = storeToRefs(useFacetStore())
  for (const facetName of facetNames.value) {
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

  const { facetNames } = storeToRefs(useFacetStore())
  for (const facetName of facetNames.value) {
    const termValues = search[facetName]
    if (termValues && termValues.length > 0) {
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
