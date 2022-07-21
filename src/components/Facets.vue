<script setup>
import { storeToRefs } from 'pinia'
import { useFacetStore } from '../stores/facets'

import Facet from './Facet.vue'

const { facets } = storeToRefs(useFacetStore())

</script>

<template>
  <form class="galc-facet-form">
    <Facet
      v-for="facet in facets"
      :id="`galc-facet-${facet.name}`"
      :key="facet.name"
      :facet="facet"
    />
  </form>
</template>

<style lang="scss">
form.galc-facet-form {
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
