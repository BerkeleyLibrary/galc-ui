import { defineStore } from 'pinia'
import GalcAPI from '../api/index.js'

export const useGalcStore = defineStore('galc', {
  state: () => ({
    items: [],
    facets: [],
    selectedTermsByFacet: {}
  }),
  getters: {
    getSelectedTerms: (state) => {
      return (facet) => {
        let selectedTerms = state.selectedTermsByFacet[facet]
        if (!selectedTerms) {
          // TODO: can we get away with mutating the state here?
          selectedTerms = []
          state.selectedTermsByFacet[facet] = selectedTerms
        }
        return selectedTerms
      }
    }
  },
  actions: {
    reloadFacets () {
      const store = this
      GalcAPI.facets()
        .then(({ data, errors, meta, links }) => { store.facets = data })
        .catch((error) => console.log(error))
    },
    reloadItems () {
      const store = this
      GalcAPI.items()
        .then(({ data, errors, meta, links }) => { store.items = data })
        .catch((error) => console.log(error))
    }
  }
})
