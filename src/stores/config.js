import { defineStore } from 'pinia'

// TODO: rename to APIstore or something
export const useConfigStore = defineStore('config', {
  state: () => ({
    apiClient: null
  }),
  actions: {
    loadFacets () {
      const apiClient = this.apiClient
      if (apiClient) {
        apiClient.loadFacets()
      }
    },
    performSearch (params) {
      const apiClient = this.apiClient
      if (apiClient) {
        apiClient.findItems(params)
      }
    }
  }

})
