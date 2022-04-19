<script setup>
</script>

<template>
  <section>
    <h2>Search the collection</h2>
    <div class="library-search-form-container">
      <form id="galc-search-form" @submit.prevent>
        <label for="galc-search-terms">Search Terms</label>
        <input id="galc-search-terms" type="text" placeholder="Search by artist, title, genre, medium, size, etc.">
        <button id="galc-search-terms-submit" type="button">Search</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
</style>
