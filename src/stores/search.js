import { defineStore } from 'pinia'
import { performSearch } from '../api/galcApi'

// TODO: include paging in query string maniuplation (move paging to search store?)

function setWindowQueryParams (queryParams) {
  const url = new URL(window.location)
  url.search = queryParams.toString()
  window.history.pushState(null, '', url)
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    facets: [],
    facetTermSelection: {}, // private
    facetExpanded: {}, // replace with getter?
    keywords: ''
  }),
  getters: {
    // TODO: centralize parameter-management code
    searchParams (state) {
      const params = {}
      const queryParams = state.queryParams
      queryParams.forEach((value, key) => {
        params[`filter[${key}]`] = value
      })
      // for (const [facetName, termValues] of Object.entries(state.facetTermSelection)) {
      //   if (termValues && termValues.length) {
      //     params[`filter[${facetName}]`] = termValues.join(',')
      //   }
      // }
      // const keywords = state.keywords && state.keywords.trim()
      // if (keywords) {
      //   params['filter[keywords]'] = keywords
      // }
      return params
    },
    queryParams (state) {
      const params = new URLSearchParams()
      for (const [facetName, termValues] of Object.entries(state.facetTermSelection)) {
        if (termValues && termValues.length) {
          params.set(facetName, termValues.join(','))
        }
      }
      const keywords = state.keywords && state.keywords.trim()
      if (keywords) {
        params.set('keywords', keywords)
      }
      return params
    }
  },
  actions: {
    getTermSelection (facetName) {
      if (!(facetName in this.facetTermSelection)) {
        return []
      }
      return this.facetTermSelection[facetName]
    },
    setTermSelection (facetName, termSelection) {
      this.facetTermSelection[facetName] = termSelection
      this.updateQueryString() // TODO: better way to trigger this
      performSearch() // TODO: better way to trigger this
    },
    // TODO: centralize parameter-management code
    setFromQueryParams (params) {
      const facetExpanded = { ...this.facetExpanded }
      const facetTermSelection = {}
      for (const facet of this.facets) {
        const facetName = facet.name
        const paramValue = params.get(facetName)
        if (paramValue) {
          facetTermSelection[facetName] = paramValue.split(',')
          facetExpanded[facetName] = true
        }
      }
      const keywords = params.get('keywords') || ''
      this.$patch({ facetTermSelection, facetExpanded, keywords })
      performSearch() // TODO: better way to trigger this
    },
    updateQueryString () {
      setWindowQueryParams(this.queryParams)
    },
    clearTermSelection () {
      this.facetTermSelection = {}
      for (const facet of this.facets) {
        const facetName = facet.name
        this.facetExpanded[facetName] = false
      }
      this.updateQueryString() // TODO: better way to trigger this
    },
    updateFacets ({ data }) {
      this.facets = data
    }
  }
})
