import { defineStore } from 'pinia'

export const useResultStore = defineStore('results', {
  state: () => ({
    items: [],
    availability: {},
    pagination: {},
    links: {},
    searchPerformed: false, // TODO: rename or move this
    loading: false
  }),
  actions: {
    getAvailability (item) {
      return this.availability[item.mmsId]
    },
    updateResults ({ data, meta, links }) {
      this.$patch({
        searchPerformed: true,
        items: data,
        availability: meta.availability,
        pagination: meta.pagination,
        links: links
      })
    },
  }
})
