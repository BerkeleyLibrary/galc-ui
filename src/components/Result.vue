<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useResultStore } from '../stores/results'
import { useFacetStore } from '../stores/facets'

import Reservation from './Reservation.vue'

// ------------------------------------------------------------
// Misc. constants

// TODO: make this configurable
const IMAGE_BASE = 'https://digitalassets.lib.berkeley.edu/galc/ucb/images/'

// ------------------------------------------------------------
// Store

const { facets } = storeToRefs(useFacetStore())
const { getAvailability } = useResultStore()

// ------------------------------------------------------------
// Properties

const props = defineProps({
  item: { type: Object, default: null },
  actions: { type: Boolean, default: true }
})

// ------------------------------------------------------------
// Local state

// TODO: does this need to be reactive?
const facetTerms = getFacetTerms()

const available = computed(() => getAvailability(props.item))

// const imageUrl = computed(() => {
//   const image = props.item.image
//   return new URL(image, IMAGE_BASE)
// })

const thumbnailUrl = computed(() => {
  const thumbnail = props.item.thumbnail
  return thumbnail && new URL(thumbnail, IMAGE_BASE)
})

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
    <div class="galc-result-thumbnail">
      <img v-if="thumbnailUrl" :key="thumbnailUrl" :src="thumbnailUrl" :alt="`thumbnail of “${item.title}” by ${item.artist}`" class="galc-thumbnail">
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
        </table>
      </div>
    </div>
    <!-- Find less hacky way to share code w/ConfirmDialog -->
    <div v-if="actions" class="galc-result-actions">
      <Reservation :item="item" :available="available"/>
    </div>
  </section>
</template>

<style lang="scss">
.galc-result {
  display: grid;
  grid-template-columns: min(180px, 45%) minmax(0, 1fr);
  grid-column-gap: 0.75rem;

  @media only screen and (max-width: 700px) {
    .galc-result-actions {
      grid-column: 1 / 3;
    }
  }

  @media only screen and (min-width: 700px) {
    .galc-result-thumbnail {
      grid-column: 1;
      grid-row: 1 / 3;
    }

    .galc-result-actions {
      width: 160px;
      justify-self: end;
    }
  }

  button, input[type=submit] {
    width: 100%;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 700;
    height: 42px;
    padding: 6px 10px;
    margin-bottom: 0.5em;
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

  .galc-result-details {

    .galc-result-metadata {
      font-size: 1rem;
      line-height: 1.25rem;
    }

    h4 {
      margin: 0;
    }

    h4, p {
      line-height: 1.15em;
    }

    p {
      margin-top: 0;

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

    table.galc-result-metadata {
      font-size: 1rem;
      line-height: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 1rem;

      th {
        text-align: left;
      }

      td {
        padding-left: 0.5em;
        padding-right: 1em;
      }

      @media only screen and (min-width: 700px) {
        display: grid;
        width: auto;
        grid-template-columns: min-content min-content min-content minmax(0, 1fr);

        tr {
          display: contents;

          th {
            display: block;
          }

          td {
            display: block;
          }
        }
      }
    }
  }
}
</style>
