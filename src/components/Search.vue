<script setup>
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galcStore'
import Spinner from './Spinner.vue'

const galcStore = useGalcStore()

const { performSearch } = galcStore

// TODO: figure out why this doesn't work
const { loading } = storeToRefs(galcStore)
</script>

<template>
  <div class="library-search-form-container">
    <form id="galc-search-form" class="library-search-form" @submit.prevent>
      <label for="galc-search-terms">Search Terms</label>
      <input
        id="galc-search-terms"
        name="search_terms"
        type="text"
        placeholder="Search by artist, title, genre, medium, size, etc."
        @keydown.enter.prevent
        @keyup.enter="apply()"
        @search="apply()"
      >
      <input id="galc-search-terms-submit" type="submit" value="Search" @click="$event.target.blur(); performSearch();">
    </form>
    <Spinner v-if="loading"/>
  </div>
</template>

<style scoped>
</style>
