import { defineStore } from 'pinia'
import GalcAPI from '../api/index.js'

export const useGalcStore = defineStore('galc', {
  state: () => ({
    items: [],
    availability: {},
    facets: [],
    facetTermSelection: {},
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
    getAvailability (item) {
      return this.availability[item.mmsId]
    },
    setTermSelection (facetName, termSelection) {
      this.facetTermSelection[facetName] = termSelection
      this.performSearch()
    },
    loadFacets () {
      GalcAPI.facets()
        .then(this.updateFacets)
        .catch((error) => console.log(error))
    },
    performSearch () {
      const itemParams = this.itemParams
      console.log('performSearch: %o', itemParams)
      this.startLoading()
      GalcAPI.items(itemParams)
        .then(this.updateResults)
        .catch((error) => console.log(error))
        .finally(this.stopLoading)
    },
    startLoading () {
      this.loading = true
    },
    stopLoading () {
      this.loading = false
    },
    updateFacets ({ data, errors, meta, links }) {
      this.facets = data
    },
    updateResults ({ data, errors, meta, links }) {
      console.log('availability: %o', meta.availability)
      this.$patch({
        searchPerformed: true,
        items: data,
        availability: meta.availability
      })
    }
  }
})
