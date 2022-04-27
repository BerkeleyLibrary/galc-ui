<script setup>
import { onMounted, defineProps } from 'vue'
import { useGalcStore } from './stores/galc'
import { useConfigStore } from './stores/config'
import Search from './components/Search.vue'
import Facets from './components/Facets.vue'
import Results from './components/Results.vue'

const props = defineProps({
  apiBaseUrl: { type: String, default: null }
})

const galc = useGalcStore()
const config = useConfigStore()

onMounted(() => {
  config.baseUrl = props.apiBaseUrl
  galc.reloadFacets()
})
</script>

<template>
  <section class="galc">
    <h2 class="galc-title">Search the collection</h2>
    <Search class="galc-search"/>
    <Facets class="galc-facets"/>
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
