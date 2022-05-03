<script setup>
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galcStore'

const galcStore = useGalcStore()
const { items, facets } = storeToRefs(galcStore)

// TODO: make this configurable
const imageBase = 'https://digitalassets.lib.berkeley.edu/galc/ucb/images/'

function getThumbnail (item) {
  return new URL(item.image, imageBase)
}

const attrKeys = ['Date', 'Decade', 'Medium', 'Genre', 'Dimensions', 'Size', 'Colors', 'Series', 'Description']

function itemMetadata (item) {
  const facetTerms = getTermsByFacet(item)

  const metadata = {}
  for (const attrKey of attrKeys) {
    const facetValues = facetTerms[attrKey]
    if (facetValues) {
      metadata[attrKey] = facetValues.sort().join(', ')
    } else {
      const attrVal = item[attrKey.toLowerCase()]
      if (attrVal) {
        metadata[attrKey] = attrVal
      }
    }
  }
  return metadata
}

function getTermsByFacet (item) {
  const terms = {}
  for (const term of item.terms) {
    const facetName = getFacetName(term)
    if (!terms[facetName]) {
      terms[facetName] = []
    }
    terms[facetName].push(term.value)
  }
  return terms
}

function getFacetName (term) {
  const facetId = term.facet.id
  // TODO: something less awful; inflate term facet on load? index terms by ID in store?
  const facet = facets.value.find((f) => f.id === facetId)
  return facet && facet.name
}
</script>

<template>
  <table>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>
          <img :src="getThumbnail(item)" :alt="item.title" class="thumbnail">
        </td>
        <td>
          <table class="galc-metadata">
            <thead>
              <tr>
                <th colspan="2">{{ item.title }}</th>
              </tr>
              <tr>
                <th colspan="2">{{ item.artist }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, name) in itemMetadata(item)" :key="name">
                <th>{{ name }}</th>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
table.galc-results {
  img.thumbnail {
    width: 180px;
  }
}
</style>
