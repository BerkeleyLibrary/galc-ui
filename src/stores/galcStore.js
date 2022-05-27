import { defineStore } from 'pinia'
import GalcAPI from '../api/galcApi.js'

function handleError (msg) {
  return (error) => console.log(`${msg}: %o`, error)
}

export const useGalcStore = defineStore('galc', {
  state: () => ({
    items: [],
    availability: {},
    pagination: {},
    links: {},
    facets: [],
    facetTermSelection: {},
    facetExpanded: {},
    keywords: '',
    searchPerformed: false,
    loading: false
  }),
  getters: {
    itemParams (state) {
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
    getAvailability (item) {
      return this.availability[item.mmsId]
    },
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
    loadFacets () {
      GalcAPI.facets()
        .then(this.updateFacets)
        .catch(handleError('loadFacets failed'))
    },
    performSearch (searchParams = this.itemParams) {
      this.startLoading()
      GalcAPI.items(searchParams)
        .then(this.updateResults)
        .catch(handleError('performSearch failed'))
        .finally(this.stopLoading)
    },
    startLoading () {
      console.log('startLoading()')
      this.loading = true
    },
    stopLoading () {
      console.log('stopLoading()')
      this.loading = false
    },
    updateFacets ({ data }) {
      this.facets = data
    },
    updateResults ({ data, meta, links }) {
      this.$patch({
        searchPerformed: true,
        items: data,
        availability: meta.availability,
        pagination: meta.pagination,
        links: links
      })
    }
  }
})
