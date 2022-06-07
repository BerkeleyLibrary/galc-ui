import { defineStore } from 'pinia'

export const useResultStore = defineStore('results', {
  state: () => ({
    items: [],
    availability: {},
    pagination: {},
    emptyResult: false,
    loading: false
  }),
  actions: {
    getAvailability (item) {
      return this.availability[item.mmsId]
    },
    updateResults ({ data, meta }) {
      const emptyResult = !(Array.isArray(data) && data.length > 0)
      this.$patch({
        items: data,
        availability: meta.availability,
        pagination: meta.pagination,
        emptyResult: emptyResult
      })
    }
  }
})
