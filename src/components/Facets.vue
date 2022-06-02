<script setup>
import { storeToRefs } from 'pinia'
import { useResultStore } from '../stores/results'
import { useFacetStore } from '../stores/facets'

import Facet from './Facet.vue'

const { facets } = storeToRefs(useFacetStore())
const { searchPerformed } = storeToRefs(useResultStore())

</script>

<template>
  <form v-if="searchPerformed" class="galc-facet-form">
    <h3 class="galc-facet-title">Refine your results</h3>
    <Facet
      v-for="facet in facets"
      :id="`galc-facet-${facet.name}`"
      :key="facet.name"
      :facet="facet"
    />
  </form>
</template>

<!-- TODO: figure out how to use scoped styles & still style subcomponent here -->
<style lang="scss">
form.galc-facets {
  display: grid;
  grid-template-columns: min-content max-content minmax(0, 1fr);
  align-items: center;
  justify-items: start;

  // TODO: rationalize these measurements
  column-gap: 0.5rem;
  row-gap: 0;
  margin-right: 2rem;

  .galc-facet-title {
    white-space: nowrap;
    grid-column: 1 / 4;
    margin-bottom: 0.25em;
  }

  > fieldset {

    details {
      summary {
        grid-column: 1 / 4;
      }

      input {
        grid-column: 1;
      }

      label {
        grid-column: 2 / 4;
      }

      fieldset {

        input {
          grid-column: 2;
        }

        label {
          grid-column: 3 / 4;
        }
      }
    }

    &:not(:first-of-type) {
      summary {
        margin-top: 0.25em;
      }
    }
  }
}
</style>
