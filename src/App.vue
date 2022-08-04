<script setup>
import { onMounted } from 'vue'
import { useApiStore } from './stores/api'
import Search from './components/Search.vue'
import Results from './components/Results.vue'
import Toolbar from './components/Toolbar.vue'

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
  </section>
</template>

<style lang="scss">
section.galc {
  font-variant-numeric: lining-nums;
}
</style>
