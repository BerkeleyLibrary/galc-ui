<script setup>
import { storeToRefs } from 'pinia'

import { useResultStore } from '../stores/results'
import { useApiStore } from '../stores/api'

import Facets from './Facets.vue'
import PageNav from './PageNav.vue'
import Result from './Result.vue'
import Spinner from './Spinner.vue'

// TODO: do getters need storeToRefs?
const { items, hasResults, showingResults } = storeToRefs(useResultStore())
const { loading } = storeToRefs(useApiStore())
</script>

<template>
  <div class="galc-results">
    <Spinner v-if="loading"/>
    <template v-if="showingResults">
      <Facets class="galc-facets"/>
      <div v-if="hasResults">
        <PageNav class="galc-page-nav"/>
        <ul class="galc-results-list">
          <li v-for="item in items" :key="item.id">
            <Result :item="item"/>
          </li>
        </ul>
        <PageNav class="galc-page-nav"/>
      </div>
      <div v-else class="galc-results-list galc-no-results">
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
    </template>
  </div>
</template>

<style lang="scss">
div.galc-results {
  position: relative;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: start;
  min-height: 24px;

  .galc-facets {
    grid-column: 1;
  }

  .galc-results-list {
    grid-column: 2;
  }

}

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
    border-bottom: 1px solid #ddd5c7;
    padding-bottom: 0.5rem;

    &:not(:last-of-type) {
      margin-bottom: 1rem;
    }
  }
}
</style>
