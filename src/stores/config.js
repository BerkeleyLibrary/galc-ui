import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    baseUrl: { type: URL }
  })
})
