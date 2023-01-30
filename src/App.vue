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
// TODO: extract to external CSS file?
section.galc {
  font-variant-numeric: lining-nums;

  $color-california-gold: #fdb515;
  $color-pacific: #46535e;
  $color-bay-fog: #ddd5c7;
  $color-lco-disabled: #6e757c;

  // TODO: share global CSS class with thumbnail?
  .galc-control {
    cursor: pointer;
  }

  .galc-icon {
    display: inline-block;
    height: 1.2rem !important;
    width: 1.2rem;
    border: 3px solid transparent;
    border-radius: 4px;
    margin-bottom: -0.25rem;
    pointer-events: none;
    outline: none !important;
  }

  .galc-action {
    height: 42px;
    padding: 6px 10px;

    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;

    border: none;
    transition: background-color .25s, color .25s;

    &.primary {
      background-color: $color-california-gold;
      color: black;

      &:hover:not(:disabled) {
        background-color: black;
        color: white;
      }
    }

    &.secondary {
      background-color: black;
      color: white;

      &:hover:not(:disabled) {
        background-color: $color-california-gold;
        color: black;
      }
    }

    &:disabled {
      color: white;
      background: $color-lco-disabled;
    }
  }
}
</style>
