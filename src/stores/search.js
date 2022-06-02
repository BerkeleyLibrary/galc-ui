import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useFacetStore } from './facets'

// ------------------------------------------------------------
// Store definition

// TODO: missing functionality?

export const useSearchStore = defineStore('search', {
  state: () => {
    const params = new URL(window.location).searchParams

    return {
      search: searchFrom(params),
      page: pageFrom(params)
    }
  },
  getters: {
    selectedTerms (state) {
      return (facetName) => computed({
        get () {
          return state.search[facetName] || []
        },
        set (v) {
          state.search[facetName] = v
        }
      })
    },
    windowQueryParams (state) {
      const params = searchParamsFrom(state.search)
      addPageParam(params, state.page)
      return params
    },
    apiQueryParams (state) {
      const params = filterParamsFrom(state.search)
      addPageNumber(params, state.page)
      return params
    }
  },
  actions: {
    newKeywordSearch (keywords) {
      // TODO: collapse facets?
      this.$state = {
        search: { keywords },
        page: DEFAULT_PAGE
      }
    },
    writeWindowLocation () {
      const url = new URL(window.location)
      url.search = this.windowQueryParams.toString()
      window.history.pushState(null, '', url)
    }
  }
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

function addPageNumber (params, page) {
  if (page !== DEFAULT_PAGE) {
    params['page[number]'] = page
  }
}
