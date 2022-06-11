<script setup>
/* global defineProps */

import { onMounted } from 'vue'
import { useApiStore } from './stores/api'
import Search from './components/Search.vue'
import Results from './components/Results.vue'
import { storeToRefs } from 'pinia'

const props = defineProps({
  apiBaseUrl: { type: String, default: null }
})

onMounted(() => {
  const api = useApiStore()
  api.init(props.apiBaseUrl)
})

const { loggedIn, logoutUrl } = storeToRefs(useApiStore())

</script>

<template>
  <section class="galc">
    <h2 class="galc-title">Search the collection</h2>
    <Search class="galc-search"/>
    <p v-if="loggedIn">
      <a :href="logoutUrl">Log out</a>
    </p>
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
