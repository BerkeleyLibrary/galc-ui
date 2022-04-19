import { defineStore } from 'pinia'
import GalcAPI from '../api/index.js'

export const useGalcStore = defineStore('galc', {
  state: () => ({
    items: [],
    facets: []
  }),
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
