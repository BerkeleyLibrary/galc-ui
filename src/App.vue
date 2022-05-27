<script setup>
/* global defineProps */

import { onMounted } from 'vue'
import { useSearchStore } from './stores/search'
import { useConfigStore } from './stores/config'
import Search from './components/Search.vue'
import Results from './components/Results.vue'

const props = defineProps({
  apiBaseUrl: { type: String, default: null }
})

const search = useSearchStore()
const config = useConfigStore()

onMounted(() => {
  config.baseUrl = props.apiBaseUrl
  search.loadFacets()
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
