<script setup>
/* global defineProps */

import { onMounted } from 'vue'
import { useSearchStore } from './stores/search'
import { createClient } from './api/galcApi'
import Search from './components/Search.vue'
import Results from './components/Results.vue'
import { useConfigStore } from './stores/config'

const props = defineProps({
  apiBaseUrl: { type: String, default: null }
})

onMounted(() => {
  // TODO: find a better way to initialize/inject API client

  const apiClient = createClient(props.apiBaseUrl)
  const config = useConfigStore()
  config.apiClient = apiClient

  apiClient.loadFacets()

  // TODO: seriously, shouldn't this be in the store?
  const query = useSearchStore()

  // TODO: can we just watch(apiQueryParams)?
  query.$subscribe((mutation, state) => {
    const params = state.apiQueryParams
    apiClient.findItems(params)
  })

  query.$subscribe((mutation, state) => {
    query.writeWindowLocation()
  })
})
</script>

<template>
  <section class="galc">
    <h2 class="galc-title">Search the collection</h2>
    <Search class="galc-search"/>
    <Results class="galc-results"/>
  </section>
</template>

<style lang="scss">
section.galc {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: start;

  .galc-title, .galc-search {
    grid-column: 1 / span 2;
  }

  .galc-facets {
    grid-column: 1;
  }

  .galc-results {
    grid-column: 2;
  }
}
</style>
