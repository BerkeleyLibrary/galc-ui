<script setup>
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galcStore'
import Result from './Result.vue'
import Spinner from './Spinner.vue'

const galcStore = useGalcStore()
const { items, loading, searchPerformed } = storeToRefs(galcStore)

</script>

<template>
  <div class="galc-results">
    <Spinner v-if="loading"/>
    <div v-if="searchPerformed && items.length === 0" class="galc-no-results">
      <h3>Your search yielded no results</h3>
      <ul>
        <li>
          Check whether your spelling is correct.
        </li>
        <li>
          Consider loosening your query by reducing the number of keywords, or eliminating
          advanced search filters.
        </li>
      </ul>
    </div>
    <ul v-else class="galc-results-list">
      <li v-for="item in items" :key="item.id">
        <Result :item="item"/>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
div.galc-no-results {
  p, ul, li {
    line-height: 1.15em;
    margin-top: 0;
    font-size: 1rem;
  }

  h3 {
    margin-bottom: 0.5em;
  }
}

ul.galc-results-list {
  display: block;
  list-style-type: none;
  padding-left: 0;
  margin-top: 0;

  li {
    display: block;

    &:not(:last-of-type) {
      margin-bottom: 1rem;

      //border-bottom: 1px solid #ddd5c7;

      .galc-result-details {
        //margin-bottom: 1rem;
      }
    }

    &:not(:first-of-type) {
      border-top: 1px solid #ddd5c7;
      padding-top: 0.5rem;
    }
  }
}
</style>
