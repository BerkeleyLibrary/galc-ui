<script setup lang="ts">
import { useSearchStore } from '../stores/search'
import { Ref, ref, watchEffect } from 'vue'

// NOTE: We deliberately don't bind to the stored keyword value,
//       as we only want to update it on an explicit submit
const search = useSearchStore()
const keywords: Ref<string | undefined> = ref('')
watchEffect(() => {
  keywords.value = search.keywords
})

// TODO: make this work when somebody doesn't hit "search"
//       (e.g. type keywords, then click facets)
function apply (event: Event) {
  (event.target as HTMLInputElement).blur()
  search.keywords = keywords.value
}
</script>

<template>
  <div class="library-search-form-container galc-search">
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
}
</style>
