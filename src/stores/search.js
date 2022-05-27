import { defineStore } from 'pinia'
import { useResultStore } from './results.js'
import GalcAPI from '../api/galcApi'

function handleError (msg) {
  return (error) => console.log(`${msg}: %o`, error)
}

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
      this.performSearch()
    },
    clearTermSelection () {
      this.facetTermSelection = {}
      for (const facetName of this.facets.map(f => f.name)) {
        this.facetExpanded[facetName] = false
      }
    },
    updateFacets ({ data }) {
      this.facets = data
    },
    loadFacets () {
      GalcAPI.facets()
        .then(this.updateFacets)
        .catch(handleError('loadFacets failed'))
    },
    performSearch (searchParams = this.searchParams) {
      const results = useResultStore()
      results.loading = true
      GalcAPI.items(searchParams)
        .then(results.updateResults)
        .catch(handleError('performSearch failed'))
        .finally(() => (results.loading = false))
    }
  }
})
