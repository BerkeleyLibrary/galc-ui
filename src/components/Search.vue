<script setup>
import { storeToRefs } from 'pinia'
import { performSearch } from '../api/galcApi'
import { useSearchStore } from '../stores/search'

const search = useSearchStore()
const { clearTermSelection } = search
const { keywords } = storeToRefs(search)

function apply (event) {
  event.target.blur()
  clearTermSelection() // TODO: don't depend on side effect to update query string
  performSearch()
}
</script>

<template>
  <div class="library-search-form-container">
    <form id="galc-search-form" class="library-search-form" @submit.prevent>
      <label for="galc-search-terms">Search Terms</label>
      <input
        id="galc-search-terms"
        v-model="keywords"
        name="search_terms"
        type="text"
        placeholder="Search by artist, title, genre, medium, size, etc."
        @keydown.enter.prevent
        @keyup.enter="apply"
        @search="apply"
      >
      <input id="galc-search-terms-submit" type="submit" value="Search" @click="apply">
    </form>
  </div>
</template>

<style lang="scss">
form#galc-search-form {
  position: relative;
  margin-bottom: 0.5rem;

  input {
    margin-bottom: 0;
  }
}
</style>
