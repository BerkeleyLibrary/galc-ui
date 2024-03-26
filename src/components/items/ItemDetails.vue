<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFacetStore } from '../../stores/facets'
import { computed } from 'vue'
import { useSessionStore } from '../../stores/session'
import { Term } from "../../types/Term"
import { Item } from "../../types/Item"

// ------------------------------------------------------------
// Store

const { facets } = storeToRefs(useFacetStore())
const { isAdmin } = storeToRefs(useSessionStore())

// ------------------------------------------------------------
// Properties

const props = defineProps<{item: Item, showInternalFields: boolean}>()

// ------------------------------------------------------------
// Helper functions

const metadata = computed(() => {
  return {
    Date: props.item.date || 'No Date',
    Dimensions: props.item.dimensions,

    Decade: facetValue('Decade'),
    Size: facetValue('Size'),

    Genre: facetValue('Genre'),
    Appearance: facetValue('Appearance'),

    Series: props.item.series
  }
})

const showInternalFields = computed(() => isAdmin.value && props.showInternalFields)

const internalFields = computed(() => {
  if (!showInternalFields.value) {
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

type FacetTerms = { [key: string]: string[] }

const facetTerms = computed(() => {
  const item = props.item
  const terms: FacetTerms = {}
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

function facetValue (facetName: string): string | undefined {
  const terms = facetTerms.value[facetName]
  if (terms) {
    return terms.join(', ')
  }
}

// TODO: something less awful; inflate term facet on load? index terms by ID in store?
function getFacetName (term: Term): string {
  const facetId = term.facet.id
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const facet = facets.value.find((f) => f.id === facetId)!
  return facet.name
}

</script>

<template>
  <div class="galc-item-details">
    <div class="galc-item-header">
      <p class="galc-item-medium">{{ facetValue('Medium') || '\u202f' }}</p>
      <h3 class="galc-item-title">{{ item.title || '\u202f' }}</h3>
      <p class="galc-item-artist">
        <a v-if="item.artistUrl" :href="item.artistUrl" target="_blank" rel="noopener">{{ item.artist || '\u202f' }}</a>
        <template v-else>{{ item.artist || '\u202f' }}</template>
      </p>
      <p class="galc-item-metadata">{{ item.description || '\u202f' }}</p>
    </div>
    <div class="galc-item-body">
      <table class="galc-item-metadata">
        <tbody>
          <template v-for="(v, k) in metadata" :key="k">
            <tr v-if="v || isAdmin">
              <th scope="row">{{ k }}</th>
              <td v-if="v">{{ v }}</td>
              <td v-else class="galc-empty-field">—none—</td>
            </tr>
          </template>
        </tbody>
        <tbody v-if="showInternalFields" class="galc-admin-metadata">
          <tr>
            <th scope="rowgroup">Internal fields</th>
          </tr>
          <template v-for="(v, k) in internalFields" :key="k">
            <tr>
              <th scope="row">{{ k }}</th>
              <td v-if="v">{{ v }}</td>
              <td v-else class="galc-empty-field">—none—</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.galc-item-details {

  .galc-item-metadata {
    font-size: 1rem;
    line-height: 1.5rem;
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
    font-size: 1rem;
    line-height: 1.5em;
    //text-transform: uppercase;
    margin: 0;
  }

  table.galc-item-metadata {
    font-size: 1rem;
    line-height: 1.25rem;
    margin-top: 1rem;
    margin-bottom: 1rem;

    tbody {
      display: contents;

      &.galc-admin-metadata {
        th[scope="rowgroup"] {
          grid-column: 1 / 5;
          margin-top: 1rem;
          font-weight: normal;
          font-size: 1rem;
          line-height: 1.15em;
          border-bottom: 1px solid #ddd5c7;
          margin-bottom: 0.25em;
        }
      }
    }

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
