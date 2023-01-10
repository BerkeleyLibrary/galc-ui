<script setup>
import { storeToRefs } from 'pinia'
import { useFacetStore } from '../../stores/facets'
import { computed } from 'vue'
import { useSessionStore } from '../../stores/session'
import { useAdminStore } from '../../stores/admin'

// ------------------------------------------------------------
// Store

const { facets } = storeToRefs(useFacetStore())
const { isAdmin } = storeToRefs(useSessionStore())
const { showHiddenFields } = storeToRefs(useAdminStore())

// ------------------------------------------------------------
// Properties

const props = defineProps({
  item: { type: Object, default: null }
})

// ------------------------------------------------------------
// Helper functions

const metadata = computed(() => {
  return {
    Date: props.item.date || 'No Date',
    Decade: facetValue('Decade'),
    Size: facetValue('Size'),
    Dimensions: props.item.dimensions,
    Genre: facetValue('Genre'),
    Appearance: facetValue('Appearance'),
    Series: props.item.series
  }
})

const adminMetadata = computed(() => {
  if (!(isAdmin.value && showHiddenFields.value)) {
    return {}
  }
  return {
    'MMS ID': props.item.mmsId,
    Barcode: props.item.barcode,
    Circulation: props.item.circulation,
    Location: props.item.location,
    Value: props.item.value,
    'Appraisal Date': props.item.appraisalDate,
    Notes: props.item.notes,
    'Suppressed?': props.item.suppressed ? 'yes' : 'no'
  }
})

const facetTerms = computed(() => {
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
})

function facetValue (facetName) {
  const terms = facetTerms.value[facetName]
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
  <div class="galc-item-details">
    <div class="galc-item-header">
      <p class="galc-item-medium">{{ facetValue('Medium') }}</p>
      <h3 class="galc-item-title">{{ item.title }}</h3>
      <p class="galc-item-artist">
        <a v-if="item.artistUrl" :href="item.artistUrl" target="_blank" rel="noopener">{{ item.artist }}</a>
        <template v-else>{{ item.artist }}</template>
      </p>
      <p class="galc-item-metadata">{{ item.description }}</p>
    </div>
    <div class="galc-item-body">
      <table class="galc-item-metadata">
        <template v-for="(v, k) in metadata" :key="k">
          <tr v-if="v || isAdmin">
            <th scope="row">{{ k }}</th>
            <td v-if="v">{{ v }}</td>
            <td v-else class="galc-empty-field">—none—</td>
          </tr>
        </template>
        <template v-for="(v, k) in adminMetadata" :key="k">
          <tr>
            <th scope="row">{{ k }}</th>
            <td v-if="v">{{ v }}</td>
            <td v-else class="galc-empty-field">—none—</td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.galc-item-details {

  .galc-item-metadata {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  h3 {
    margin: 0;
    color: inherit;
    font-weight: bold;
  }

  h3, p {
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

  p.galc-item-medium {
    font-size: 0.75em;
    line-height: 1em;
    text-transform: uppercase;
    margin: 0;
  }

  table.galc-item-metadata {
    font-size: 1rem;
    line-height: 1.25rem;
    margin-top: 1rem;
    margin-bottom: 1rem;

    th {
      text-align: left;
      white-space: nowrap;
    }

    td {
      padding-left: 0.5em;
      padding-right: 1em;
    }

    @media only screen and (min-width: 700px) {
      display: grid;
      width: auto;
      grid-template-columns: min-content auto min-content auto;

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

  .galc-empty-field {
    color: #6c3302;
  }
}

</style>
