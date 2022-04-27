<script setup>
import { useGalcStore } from '../stores/galc'

const galc = useGalcStore()

const apply = () => {
  // TODO: actually search
  galc.reloadItems()
}
</script>

<template>
  <div class="library-search-form-container">
    <form id="galc-search-form" @submit.prevent>
      <label for="galc-search-terms">Search Terms</label>
      <input
        id="galc-search-terms"
        type="text"
        placeholder="Search by artist, title, genre, medium, size, etc."
        @keydown.enter.prevent
        @keyup.enter="apply()"
        @search="apply()"
      >
      <button id="galc-search-terms-submit" type="button" @click="$event.target.blur(); apply();">Search</button>
    </form>
  </div>
</template>

<style scoped>
</style>
