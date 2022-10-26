import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { setParams } from '../helpers/window-location-helper'

import { useFacetStore } from './facets'
import { useApiStore } from './api'

// ------------------------------------------------------------
// Store definition

export const useSearchStore = defineStore('search', () => {
  // --------------------------------------------------
  // External state

  const facets = useFacetStore()
  const { facetNames } = storeToRefs(facets)
  const { expandAll, collapseAll } = facets

  // --------------------------------------------------
  // State

  // NOTE: We encapsulate the search state in one ref() so we can update it atomically
  // TODO: Is that really necessary?
  const state = ref(emptyState())

  const computedTermSelections = {}

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    // console.log('search.init()')
    state.value = readWindowLocation()
    expandAll(activeFacetNames.value)
    watch(state, doSearch, { deep: true, immediate: true, flush: 'post' })
  }

  const keywords = computed({
    get () {
      return state.value.search.keywords
    },
    set (v) {
      state.value = {
        search: { keywords: v },
        page: DEFAULT_PAGE
      }
      collapseAll()
    }
  })

  const page = computed({
    get () {
      return state.value.page || DEFAULT_PAGE
    },
    set (v) {
      const newPage = parseInt(v) || DEFAULT_PAGE
      state.value.page = newPage
      // if (newPage !== DEFAULT_PAGE) {
      //   setParams({ page: newPage })
      // }
    }
  })

  function selectedTerms (facetName) {
    let termSelection = computedTermSelections[facetName]
    if (!termSelection) {
      termSelection = computed({
        get () {
          const terms = state.value.search[facetName] || []
          return terms
        },
        set (v) {
          const search = { ...state.value.search }
          search[facetName] = v
          state.value = {
            search: search,
            page: DEFAULT_PAGE
          }
        }
      })
      computedTermSelections[facetName] = termSelection
    }
    return termSelection
  }

  function canResetSearch () {
    const params = currentSearchParams()
    return params && Object.keys(params).length > 0
  }

  function resetSearch () {
    state.value = emptyState()
  }

  function refreshSearch () {
    return doSearch(state)
  }

  const exported = { init, keywords, page, selectedTerms, refreshSearch, resetSearch, canResetSearch }

  // --------------------------------------------------
  // Internal functions and properties

  function emptyState () {
    return {
      // TODO: separate keywords from terms?
      search: {},
      page: DEFAULT_PAGE
    }
  }

  const activeFacetNames = computed(() => {
    const currentSearch = state.value.search
    return facetNames.value.filter((facetName) => {
      const termValues = currentSearch[facetName]
      return termValues && termValues.length
    })
  })

  function readWindowLocation () {
    const params = new URL(window.location).searchParams
    return {
      search: searchFrom(params),
      page: pageFrom(params)
    }
  }

  function doSearch (state) {
    const { performSearch } = useApiStore()

    const searchParams = currentSearchParams()
    const filterParams = jsonizeParams(searchParams)

    setParams(searchParams)
    return performSearch(filterParams)
  }

  // TODO: share code with searchFrom()?
  function currentSearchParams () {
    const params = {}

    const search = state.value.search

    const keywordsVal = search.keywords
    if (keywordsVal) {
      params.keywords = keywordsVal
    }

    const { facetNames } = storeToRefs(useFacetStore())
    for (const facetName of facetNames.value) {
      const termValues = search[facetName]
      if (termValues && termValues.length > 0) {
        params[facetName] = termValues.join(',')
      }
    }

    const page = state.value.page
    if (page !== DEFAULT_PAGE) {
      params.page = page
    }

    return params
  }

  // --------------------------------------------------
  // Event handling

  window.addEventListener('popstate', () => { state.value = readWindowLocation() })

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

// TODO: share code with currentSearchParams()?
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
// API query creation

function jsonizeParamName (name) {
  if (name === 'page') {
    return 'page[number]'
  } else {
    return `filter[${name}]`
  }
}

function jsonizeParams (params) {
  const jsonized = {}
  for (const [name, value] of Object.entries(params)) {
    const jsonizedName = jsonizeParamName(name)
    jsonized[jsonizedName] = value
  }
  return jsonized
}
