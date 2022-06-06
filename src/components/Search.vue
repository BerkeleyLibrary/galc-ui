<script setup>
import { useSearchStore } from '../stores/search'
import { ref, watchEffect } from 'vue'

// NOTE: We deliberately don't bind to the stored keyword value,
//       as we only want to update it on an explicit submit
const search = useSearchStore()
const keywords = ref('')
watchEffect(() => {
  console.log('keywords.value = %o', search.keywords)
  keywords.value = search.keywords
})

function apply (event) {
  event.target.blur()
  console.log('apply(): search.keywords = %o', keywords.value)
  search.keywords = keywords.value
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
