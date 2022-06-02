import { defineStore } from 'pinia'

// TODO: find a better way to initialize/inject API client
export const useConfigStore = defineStore('config', {
  state: () => ({
    apiClient: null
  })
})
