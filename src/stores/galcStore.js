import { defineStore } from 'pinia'
import { stringify } from 'flatted'
import GalcAPI from '../api/index.js'

export const useGalcStore = defineStore('galc', {
  state: () => ({
    items: [],
    facets: [],
    selectedTermsByFacetName: {}
  }),
  getters: {
    itemParams (state) {
      const params = {}
      for (const [facetName, terms] of Object.entries(state.selectedTermsByFacetName)) {
        if (terms && terms.length) {
          params[`filter[${facetName}]`] = terms.map(t => t.value).join(',')
        }
      }
      return params
    }
  },
  actions: {
    // TODO: explicitly use facet names and term values
    getSelectedTerms (facet) {
      if (!(facet.name in this.selectedTermsByFacetName)) {
        this.setSelectedTerms(facet, [])
      }
      return this.selectedTermsByFacetName[facet.name]
    },
    // TODO: explicitly use facet names and term values
    setSelectedTerms (facet, selectedTerms) {
      const newSelection = Object.assign({}, this.selectedTermsByFacetName)
      newSelection[facet.name] = selectedTerms
      this.selectedTermsByFacetName = newSelection
    },
    reloadFacets () {
      GalcAPI.facets()
        .then(this.updateFacets)
        .catch((error) => console.log(error))
    },
    reloadItems () {
      const itemParams = this.itemParams
      console.log(`reloadItems(): itemParams: ${stringify(itemParams)}`)
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
