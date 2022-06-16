<script setup>
import { onMounted } from 'vue'
import { useApiStore } from './stores/api'
import Search from './components/Search.vue'
import Results from './components/Results.vue'
import Toolbar from './components/Toolbar.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const props = defineProps({
  apiBaseUrl: { type: String, default: null }
})

onMounted(() => {
  const api = useApiStore()
  api.init(props.apiBaseUrl)
})
</script>

<template>
  <section class="galc">
    <h2 class="galc-title">Search the collection</h2>
    <Search class="galc-search"/>
    <Toolbar class="galc-toolbar"/>
    <Results class="galc-results"/>
    <ConfirmDialog/>
  </section>
</template>

<style lang="scss">
section.galc {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: start;

  .galc-title, .galc-search, .galc-toolbar {
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
