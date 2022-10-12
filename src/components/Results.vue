<script setup>
import { storeToRefs } from 'pinia'

import { useResultStore } from '../stores/results'

import Facets from './Facets.vue'
import PageNav from './PageNav.vue'
import Result from './Result.vue'
import TermDeselection from './TermDeselection.vue'

const { items, hasResults, searchPerformed } = storeToRefs(useResultStore())
</script>

<template>
  <div class="galc-results">
    <template v-if="searchPerformed">
      <Facets class="galc-facets"/>
      <div class="galc-results-block">
        <template v-if="hasResults">
          <div class="galc-results-list-header">
            <TermDeselection id-prefix="results"/>
            <PageNav name="header" class="galc-page-nav"/>
          </div>
          <ul class="galc-results-list">
            <li v-for="item of items" :key="item.id">
              <Result :item="item"/>
            </li>
          </ul>
          <div class="galc-results-list-footer">
            <PageNav name="footer" class="galc-page-nav"/>
          </div>
        </template>
        <template v-else>
          <TermDeselection id-prefix="results"/>
          <div class="galc-no-results">
            <h3>Your search yielded no results</h3>
            <ul>
              <li>
                Check whether your spelling is correct.
              </li>
              <li>
                Consider loosening your query by reducing the number of keywords, or eliminating
                search filters.
              </li>
            </ul>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
div.galc-results {
  @media only screen and (min-width: 700px) {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    align-items: start;

    .galc-facets {
      grid-column: 1;
    }

    .galc-results-block {
      grid-column: 2;
    }
  }

  .galc-results-block {
    @media only screen and (max-width: 700px) {
      // TODO: less hacky way to place this differently on desktop and mobile
      .galc-term-deselection {
        display: none;
      }
    }

    div.galc-results-list-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) max-content;
      margin-bottom: 10px;

      @media only screen and (max-width: 700px) {
        ul.page-nav-links {
          display: none;
        }
      }

      nav.page-nav {
        justify-content: end;
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
  }
}

</style>
