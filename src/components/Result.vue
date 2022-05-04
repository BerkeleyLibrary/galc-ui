<script setup>
import { defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galcStore'

// ------------------------------------------------------------
// Misc. constants

// TODO: make this configurable
const imageBase = 'https://digitalassets.lib.berkeley.edu/galc/ucb/images/'

// ------------------------------------------------------------
// Store

const galcStore = useGalcStore()
const { facets } = storeToRefs(galcStore)

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

const medium = facetValue('Medium')
const genre = facetValue('Genre')
const size = facetValue('Size')
const colors = facetValue('Colors')

const metadata = {
  Date: props.item.date || 'No Date',
  Decade: facetValue('Decade'),
  Size: size,
  Dimensions: props.item.dimensions,
  Genre: genre,
  Colors: colors,
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
      <img :src="thumbnailUrl" alt="thumbnail" class="galc-thumbnail">
    </div>
    <div class="galc-result-details">
      <p class="galc-result-medium">{{ medium }}</p>
      <h4 class="galc-result-title">{{ item.title }}</h4>
      <p class="galc-result-artist">{{ item.artist }}</p>
      <p class="galc-result-description">{{ item.description }}</p>
      <table class="galc-result-metadata">
        <template v-for="(v, k) in metadata" :key="k">
          <tr v-if="v">
            <th>{{ k }}</th>
            <td>{{ v }}</td>
          </tr>
        </template>
      </table>
    </div>
    <!-- TODO: availability -->
    <!-- TODO: request button -->
  </section>
</template>

<style lang="scss">
.galc-result {
  display: grid;
  grid-template-columns: max-content  minmax(0, 1fr);
  grid-column-gap: 0.5em;
  align-items: start;
  justify-items: start;

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

    h4, p {
      line-height: 1.15em;
      margin-top: 0;
    }

    p {
      margin-bottom: 0.25em;
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

    p.galc-result-artist {

    }

    p.galc-result-description {
      font-size: 1rem;
    }

    table.galc-result-metadata {
      display: grid;
      width: 100%;
      grid-template-columns: min-content min-content min-content minmax(0, 1fr);
      font-size: 1rem;
      line-height: 1.25rem;
      margin-top: 1rem;

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
