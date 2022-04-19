<script setup>
import { onMounted } from 'vue'
import SearchBox from './components/SearchBox.vue'
import Facets from './components/Facets.vue'
import { useGalcStore } from './stores'
import { useConfigStore } from './stores/config'

const galc = useGalcStore()
const config = useConfigStore()

onMounted(() => {
  config.baseUrl = new URL('http://localhost:3000/') // TODO: inject this
  galc.reloadFacets()
})
</script>

<template>
  <SearchBox/>
  <Facets/>
</template>

<style>
</style>
