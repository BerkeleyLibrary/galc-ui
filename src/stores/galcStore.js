import { defineStore } from 'pinia'
import GalcAPI from '../api/index.js'

export const useGalcStore = defineStore('galc', {
  state: () => ({
    items: [],
    facets: [],
    facetTermSelection: {}
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
        this.setTermSelection(facetName, [])
      }
      return this.facetTermSelection[facetName]
    },
    setTermSelection (facetName, termSelection) {
      this.facetTermSelection[facetName] = termSelection
    },
    reloadFacets () {
      GalcAPI.facets()
        .then(this.updateFacets)
        .catch((error) => console.log(error))
    },
    reloadItems () {
      const itemParams = this.itemParams
      GalcAPI.items(itemParams)
        .then(this.updateItems)
        .catch((error) => console.log(error))
    },
    updateFacets ({ data, errors, meta, links }) {
      this.facets = data
    },
    updateItems ({ data, errors, meta, links }) {
      this.items = data
    }
  }
})
