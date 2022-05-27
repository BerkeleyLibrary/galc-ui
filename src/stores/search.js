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
    clearTermSelection () {
      this.facetTermSelection = {}
      for (const facetName of this.facets.map(f => f.name)) {
        this.facetExpanded[facetName] = false
      }
    },
    updateFacets ({ data }) {
      this.facets = data
    }
  }
})
