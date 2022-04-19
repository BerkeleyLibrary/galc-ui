<script setup>
import { onMounted, defineProps } from 'vue'
import SearchBox from './components/SearchBox.vue'
import Facets from './components/Facets.vue'
import { useGalcStore } from './stores/galc'
import { useConfigStore } from './stores/config'

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
  <SearchBox/>
  <Facets/>
</template>

<style>
</style>
