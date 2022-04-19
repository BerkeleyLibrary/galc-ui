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
  <Search/>
  <Facets/>
  <Results/>
</template>

<style>
</style>
