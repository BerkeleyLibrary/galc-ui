<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useResultStore } from '../stores/results'
import { useSearchStore } from '../stores/search'

// ------------------------------------------------------------
// Misc. constants

// TODO: make this configurable
const imageBase = 'https://digitalassets.lib.berkeley.edu/galc/ucb/images/'

// ------------------------------------------------------------
// Store

const search = useSearchStore()
const { facets } = storeToRefs(search)
const results = useResultStore()
const { getAvailability } = results

// ------------------------------------------------------------
// Properties

const props = defineProps({
  item: { type: Object, default: null }
})

// ------------------------------------------------------------
// Local state

// TODO: does this need to be reactive?
const facetTerms = getFacetTerms()

const thumbnailUrl = new URL(props.item.image, imageBase)
const available = computed(() => getAvailability(props.item))

const metadata = {
  Date: props.item.date || 'No Date',
  Decade: facetValue('Decade'),
  Size: facetValue('Size'),
  Dimensions: props.item.dimensions,
  Genre: facetValue('Genre'),
  Colors: facetValue('Colors'),
  Series: props.item.series
}

// ------------------------------------------------------------
// Helper functions

function getFacetTerms () {
  const item = props.item
  const terms = {}
  if (item.terms) {
    for (const term of item.terms) {
      const facetName = getFacetName(term)
      if (!terms[facetName]) {
        terms[facetName] = []
      }
      terms[facetName].push(term.value)
    }
  }
  return terms
}

function facetValue (facetName) {
  const terms = facetTerms[facetName]
  if (terms) {
    return terms.join(', ')
  }
}

function getFacetName (term) {
  const facetId = term.facet.id
  // TODO: something less awful; inflate term facet on load? index terms by ID in store?
  const facet = facets.value.find((f) => f.id === facetId)
  return facet && facet.name
}
</script>

<template>
  <section class="galc-result">
    <!-- {{ item.mmsId }} -->
    <div class="galc-result-thumbnail">
      <img :key="thumbnailUrl" :src="thumbnailUrl" :alt="`thumbnail of “${item.title}” by ${item.artist}`" class="galc-thumbnail">
    </div>
    <div class="galc-result-details">
      <div class="galc-result-header">
        <p class="galc-result-medium">{{ facetValue('Medium') }}</p>
        <h4 class="galc-result-title">{{ item.title }}</h4>
        <p class="galc-result-artist">
          <a v-if="item.artistUrl" :href="item.artistUrl" target="_blank" rel="noopener">{{ item.artist }}</a>
          <template v-else>{{ item.artist }}</template>
        </p>
        <p class="galc-result-metadata">{{ item.description }}</p>
      </div>
      <div class="galc-result-body">
        <table class="galc-result-metadata">
          <template v-for="(v, k) in metadata" :key="k">
            <tr v-if="v">
              <th>{{ k }}</th>
              <td>{{ v }}</td>
            </tr>
          </template>
          <tr>
            <th>Available</th>
            <td>{{ available }}</td>
          </tr>
        </table>
      </div>
      <div class="galc-result-actions">
        <!-- TODO: make this do something -->
        <button v-if="available">Request this item</button>
        <button v-else disabled>Item unavailable</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.galc-result {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  grid-column-gap: 0.5em;
  align-items: start;
  justify-items: start;

  button {
    align-self: end;
    width: 180px;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 700;
    height: 42px;
    padding: 6px 10px;
    transition: background-color .25s, color .25s;
    color: #000;
    font-size: 1rem;

    &:hover {
      background-color: #000;
      color: #fff;
    }

    &:disabled {
      color: #46535e;
      background-color: #eeeeee;
    }
  }

  .galc-result-thumbnail {
    grid-column: 1;

    img.galc-thumbnail {
      width: 180px;
      grid-column: 1;
      grid-row: 1 / 6;
      margin-right: 0.5rem;
    }
  }

  .galc-result-details {
    grid-column: 2;
    width: 100%;

    display: grid;
    grid-template-columns: minmax(0, 1fr) 180px;
    align-items: end;

    div.galc-result-header, div.galc-result-footer {
      grid-column: 1 / 3;
    }

    div.galc-result-body {
      grid-column: 1;
    }

    div.galc-result-actions {
      grid-column: 2;
    }

    .galc-result-metadata {
      font-size: 1rem;
      line-height: 1.25rem;
    }

    h4, p {
      line-height: 1.15em;
      margin-top: 0;
    }

    p {
      &:last-of-type {
        margin-bottom: 0;
      }
      &:not(:last-of-type) {
        margin-bottom: 0.25em;
      }
    }

    p.galc-result-medium {
      font-size: 0.75em;
      line-height: 1em;
      text-transform: uppercase;
      margin: 0;
    }

    h4.galc-result-title {
      margin: 0;
    }

    table.galc-result-metadata {
      display: grid;
      width: 100%;
      grid-template-columns: min-content min-content min-content minmax(0, 1fr);
      font-size: 1rem;
      line-height: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 1rem;

      tr {
        display: contents;

        th {
          display: block;
        }

        td {
          display: block;
          padding-left: 0.5em;
          padding-right: 1em;
        }
      }
    }
  }

}
</style>
