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
const item = props.item
const facetTerms = getFacetTerms()

const thumbnailUrl = new URL(item.image, imageBase)

const media = facetTerms['Medium']
const date = itemDate()
const genre = itemGenre()
const size = itemSize()
const colors = itemColors()
// const metadata = extractMetadata()

// ------------------------------------------------------------
// Helper functions

function getFacetTerms () {
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

// const attrKeys = ['Date', 'Decade', 'Medium', 'Genre', 'Dimensions', 'Size', 'Colors', 'Series', 'Description']

// TODO: DRY these
function itemGenre () {
  const genreTerms = facetTerms['Genre']
  if (genreTerms) {
    return genreTerms.join(', ')
  }
}

// TODO: DRY these
function itemSize () {
  const sizeTerms = facetTerms['Size']
  if (sizeTerms) {
    return sizeTerms.join(', ')
  }
}

// TODO: DRY these
function itemColors () {
  const colorsTerms = facetTerms['Colors']
  if (colorsTerms) {
    return colorsTerms.join(', ')
  }
}

// TODO: DRY these
function itemDate () {
  const date = item.date
  if (date) {
    console.log('Returning item date %o', date)
    return date
  }
  const decadeTerms = facetTerms['Decade']
  if (decadeTerms) {
    const decade = decadeTerms.join(', ')
    if (decade.length > 0 && decade !== 'No Date') {
      console.log('Returning decade %o', decade)
      return decade
    }
  }
  console.log('No date found')
}

// function extractMetadata () {
//   const metadata = {}
//   for (const attrKey of attrKeys) {
//     const facetValues = facetTerms[attrKey]
//     if (facetValues) {
//       metadata[attrKey] = facetValues.sort()
//     } else {
//       const attrVal = item[attrKey.toLowerCase()]
//       if (attrVal) {
//         metadata[attrKey] = [attrVal]
//       }
//     }
//   }
//   console.log('metdata: %o', metadata)
//   return metadata
// }

function getFacetName (term) {
  const facetId = term.facet.id
  // TODO: something less awful; inflate term facet on load? index terms by ID in store?
  const facet = facets.value.find((f) => f.id === facetId)
  return facet && facet.name
}

</script>

<template>
  <section class="galc-result">
    <img :src="thumbnailUrl" alt="thumbnail" class="galc-thumbnail">

    <ul class="galc-result-medium">
      <li v-for="medium in media" :key="medium">{{ medium }}</li>
    </ul>
    <h4 class="galc-result-title">{{ item.title }}</h4>
    <p class="galc-result-artist">
      {{ item.artist }}
    </p>
    <ul class="galc-result-metadata">
      <!-- TODO: DRY these -->
      <li v-if="date">{{ date }}</li>
      <li v-if="genre">{{ genre }}</li>
      <li v-if="item.dimensions">{{ item.dimensions }}</li>
      <li v-if="size">{{ size }}</li>
      <li v-if="colors">{{ colors }}</li>
      <li v-if="item.series">{{ item.series }}</li>
      <li v-if="item.description">{{ item.description }}</li>
    </ul>
    <!-- TODO: availability -->
    <!-- TODO: request button -->
  </section>
</template>

<style lang="scss">
.galc-result {
  display: grid;
  grid-template-columns: max-content  minmax(0, 1fr);
  grid-template-rows: min-content min-content min-content minmax(0, 1fr);
  align-items: start;
  justify-items: start;

  h4, p {
    margin: 0;
    line-height: 1em;
  }

  // TODO: rationalize these measurements
  column-gap: 0.5rem;
  row-gap: 0;

  img.galc-thumbnail {
    width: 120px;
    grid-column: 1;
    grid-row: 1 / 5;
    margin-right: 0.5rem;
  }

  ul.galc-result-medium {
    grid-column: 2;
    grid-row: 1;

    list-style-type: none;
    padding-left: 0;
    font-size: 0.75em;
    line-height: 1em;

    li {
      display: inline-block;
      text-transform: uppercase;
      margin: 0;

      &:not(:first-of-type) {
        &::before {
          content: ', ';
        }
      }
    }
  }

  ul.galc-result-metadata {
    display: block;
    list-style-type: none;
    padding-left: 0;
    font-size: 1rem;
    line-height: 1.15em;
    margin-top: 0.35em;

    li {
      display: inline;

      // TODO: handle trailing periods in description better
      &:not(:last-of-type) {
        &::after {
          content: '. '
        }
      }
    }
  }

}
</style>
