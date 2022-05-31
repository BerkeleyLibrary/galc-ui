import { defineStore } from 'pinia'
import { performSearch } from '../api/galcApi'

export const useSearchStore = defineStore('search', {
  state: () => ({
    facets: [],
    facetTermSelection: {}, // private
    facetExpanded: {}, // replace with getter?
    keywords: ''
  }),
  getters: {
    searchParams (state) {
      const params = {}
      // TODO: centralize parameter-management code
      for (const [facetName, termValues] of Object.entries(state.facetTermSelection)) {
        if (termValues && termValues.length) {
          params[`filter[${facetName}]`] = termValues.join(',')
        }
      }
      const keywords = state.keywords && state.keywords.trim()
      if (keywords) {
        params['filter[keywords]'] = keywords
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
      performSearch()
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
      performSearch()
    },
    clearTermSelection () {
      this.facetTermSelection = {}
      for (const facet of this.facets) {
        const facetName = facet.name
        this.facetExpanded[facetName] = false
      }
    },
    updateFacets ({ data }) {
      this.facets = data
    }
  }
})
