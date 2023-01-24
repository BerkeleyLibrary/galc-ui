import { defineStore, storeToRefs } from 'pinia'
import { computed, Ref, ref, WritableComputedRef } from 'vue'

import { useApiStore } from './api'
import { useFacetStore } from './facets'
import { useSessionStore } from './session'
import { useWindowLocationStore } from "./window-location"

import { Params } from "../types/Params"

// ------------------------------------------------------------
// Store definition

type Search = {
  keywords?: string;
  suppressed?: boolean[];
  // TODO: separate keywords, suppressed, facet names
  [key: string]: string[] | boolean[] | string | undefined;
}

type SearchState = {
  search: Search
  page: number
}

export const useSearchStore = defineStore('search', () => {
  // --------------------------------------------------
  // External state

  const facets = useFacetStore()
  const { facetNames } = storeToRefs(facets)
  const { expandAll, collapseAll } = facets

  const { isAdmin } = storeToRefs(useSessionStore())

  // --------------------------------------------------
  // State

  // NOTE: We encapsulate the search state in one ref() so we can update it atomically
  // TODO: Now that we're triggering searches explicitly in setters, do we still need that?
  const state: Ref<SearchState> = ref(emptyState())

  const computedTermSelections: { [key: string]: WritableComputedRef<string[]> } = {}

  // --------------------------------------------------
  // Exported functions and properties

  async function init() {
    state.value = readWindowLocation()
    expandAll(activeFacetNames.value)
    return refreshSearch()
  }

  const keywords: WritableComputedRef<string | undefined> = computed({
    get() {
      return state.value.search.keywords
    },
    set(v) {
      collapseAll()
      setState({
        search: { keywords: v },
        page: DEFAULT_PAGE
      })
    }
  })

  const suppressed: WritableComputedRef<boolean[]> = computed({
    get() {
      return state.value.search.suppressed || [false]
    },
    set(v) {
      if (!isAdmin.value) {
        return
      }
      const search = { ...state.value.search }
      search.suppressed = v
      setState({
        search: search,
        page: DEFAULT_PAGE
      })
    }
  })

  const page: WritableComputedRef<number> = computed({
    get() {
      return state.value.page || DEFAULT_PAGE
    },
    set(v) {
      const newState = { ...state.value }
      // @ts-ignore
      newState.page = parseInt(v) || DEFAULT_PAGE
      setState(newState)
    }
  })

  function selectedTerms(facetName: string) {
    let termSelection: WritableComputedRef<string[]> = computedTermSelections[facetName]
    if (!termSelection) {
      termSelection = computed({
        get() {
          const terms = <string[]>state.value.search[facetName] || []
          return terms
        },
        set(v: string[]) {
          const search: Search = { ...state.value.search }
          search[facetName] = v
          setState({
            search: search,
            page: DEFAULT_PAGE
          })
        }
      })
      computedTermSelections[facetName] = termSelection
    }
    return termSelection
  }

  // TODO: make this a computed property
  function canResetSearch() {
    const params = currentSearchParams()
    return params && Object.keys(params).length > 0
  }

  function resetSearch() {
    return setState(emptyState())
  }

  function refreshSearch() {
    return doSearch(state.value)
  }

  const exported = { init, keywords, suppressed, page, selectedTerms, refreshSearch, resetSearch, canResetSearch }

  // --------------------------------------------------
  // Internal functions and properties

  function emptyState(): SearchState {
    return {
      // TODO: separate keywords from terms?
      search: {},
      page: DEFAULT_PAGE
    }
  }

  // TODO: something less messy
  function setState(newState: SearchState) {
    state.value = newState
    return refreshSearch()
  }

  const activeFacetNames = computed(() => {
    const currentSearch = state.value.search
    return facetNames.value.filter((facetName) => {
      const termValues = currentSearch[facetName]
      return termValues && termValues.length
    })
  })

  function readWindowLocation(): SearchState {
    // TODO: use helper
    const params = new URL(window.location.href).searchParams
    return {
      search: searchFrom(params),
      page: pageFrom(params)
    }
  }

  function doSearch(_state: SearchState) {
    const searchParams = currentSearchParams()
    const { setParams } = useWindowLocationStore()
    setParams(searchParams)

    const filterParams = jsonizeParams(searchParams)
    const { performSearch } = useApiStore()
    return performSearch(filterParams)
  }

  // TODO: share code with searchFrom()?
  function currentSearchParams() {
    const params: Params = {}

    const search = state.value.search

    const keywordsVal = search.keywords
    if (keywordsVal) {
      params.keywords = <string> keywordsVal
    }

    if (isAdmin.value) {
      const suppressedVal = search.suppressed
      if (Array.isArray(suppressedVal) && suppressedVal.length > 0) {
        params.suppressed = suppressedVal.join(',')
      }
    }

    const { facetNames } = storeToRefs(useFacetStore())
    for (const facetName of facetNames.value) {
      const termValues = <string[]> search[facetName]
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

  window.addEventListener('popstate', () => {
    const newState = readWindowLocation()
    setState(newState)
  })

  // --------------------------------------------------
  // Store definition

  return exported
})

// ------------------------------------------------------------
// Misc. constants

const DEFAULT_PAGE = 1
const KEYWORDS_PARAM = 'keywords'
const SUPPRESSED_PARAM = 'suppressed'
const PAGE_PARAM = 'page'

// ------------------------------------------------------------
// Window location query parsing

// TODO: share code with currentSearchParams()?
function searchFrom(urlSearchParams: URLSearchParams): Search {
  const newSearch: Search = {}

  const keywordsVal = urlSearchParams.get(KEYWORDS_PARAM)
  if (keywordsVal) {
    newSearch.keywords = keywordsVal
  }

  const { isAdmin } = storeToRefs(useSessionStore())
  if (isAdmin.value) {
    const suppressedVal = urlSearchParams.get(SUPPRESSED_PARAM)
    if (suppressedVal) {
      const suppressed = toBooleans(suppressedVal)
      newSearch.suppressed = suppressed.length != 0 ? suppressed : [false]
    }
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

function toBooleans(strList: string): boolean[] {
  const strVals = strList.split(',')
  const booleans: boolean[] = []
  for (const b of [true, false]) {
    if (strVals.includes(b.toString())) {
      booleans.push(b)
    }
  }
  return booleans
}

function pageFrom(urlSearchParams: URLSearchParams): number {
  const pageVal = urlSearchParams.get(PAGE_PARAM)
  // @ts-ignore
  return parseInt(pageVal) || DEFAULT_PAGE
}

// ------------------------------------------------------------
// API query creation

function jsonizeParamName(name: string): string {
  if (name === 'page') {
    return 'page[number]'
  } else {
    return `filter[${name}]`
  }
}

function jsonizeParams(params: Params): Params {
  const jsonized: Params = {}
  for (const [name, value] of Object.entries(params)) {
    const jsonizedName = jsonizeParamName(name)
    jsonized[jsonizedName] = value
  }
  return jsonized
}
