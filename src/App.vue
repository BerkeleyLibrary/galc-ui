<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useApiStore } from './stores/api'
import { MODE_CLOSURES, useAdminStore } from './stores/admin'
import { useSessionStore } from './stores/session'

import Modals from './components/Modals.vue'
import Search from './components/Search.vue'
import Results from './components/Results.vue'
import Toolbar from './components/Toolbar.vue'
import AutoLogin from './components/AutoLogin.vue'

import Closures from './components/closures/Closures.vue'

const props = defineProps({
  apiBaseUrl: { type: String, default: null }
})

const { isAdmin } = storeToRefs(useSessionStore())
const { adminMode } = storeToRefs(useAdminStore())

const mainComponent = computed(() => {
  if (isAdmin.value) {
    if (adminMode.value === MODE_CLOSURES) {
      return Closures
    }
  }
  return Results
})

onMounted(() => {
  const api = useApiStore()
  api.init(props.apiBaseUrl)
})
</script>

<template>
  <section class="galc">
    <Modals/>
    <h2 class="galc-title">Search the collection</h2>
    <Search/>
    <Toolbar/>
    <component :is="mainComponent"/>
    <AutoLogin/>
  </section>
</template>

<style lang="scss">
section.galc {
  font-variant-numeric: lining-nums;
}
</style>
