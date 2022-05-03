<script setup>
import { useGalcStore } from '../stores/galcStore'

const galc = useGalcStore()

const apply = () => {
  // TODO: actually search
  galc.performSearch()
}
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
      <input id="galc-search-terms-submit" type="submit" value="Search" @click="$event.target.blur(); apply();">
    </form>
  </div>
</template>

<style scoped>
</style>
