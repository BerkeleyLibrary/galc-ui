<script setup>
import { useGalcStore } from '../stores/galc'

const galc = useGalcStore()

const apply = () => {
  // TODO: actually search
  galc.reloadItems()
}
</script>

<template>
  <section>
    <h2>Search the collection</h2>
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
  </section>
</template>

<style scoped>
</style>
