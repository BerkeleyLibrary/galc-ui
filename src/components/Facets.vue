<script setup>
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galc'
import Facet from './Facet.vue'

const galc = useGalcStore()
const { facets } = storeToRefs(galc)
const getSelectedTerms = galc.getSelectedTerms
</script>

<template>
  <form class="galc-facets">
    <fieldset v-for="facet in facets" :key="facet.id">
      <Facet :facet="facet" :selected-terms="getSelectedTerms(facet)"/>
    </fieldset>
  </form>
</template>

<!-- TODO: figure out how to use scoped styles & still style subcomponent here -->
<style lang="scss">
form.galc-facets {
  display: grid;
  grid-template-columns: min-content min-content minmax(0, 1fr);
  column-gap: 0.25rem; // TODO: something sensible
  row-gap: 0.5rem; // TODO: something sensible

  > fieldset {
    display: contents;

    details {
      display: contents;

      summary {
        grid-column: 1 / 4;
        list-style: none;

        &::-webkit-details-marker {
          display: none;
        }

        &::after {
          content: ' ';
          padding-left: 1em;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 1em 1em;
          background-image: url('../assets/angle-down.svg');
          width: 2em;
        }
      }

      &[open] {
        summary::after {
          background-image: url('../assets/angle-up.svg');
        }
      }

      input {
        grid-column: 1;
      }

      label {
        grid-column: 2 / 4;
      }

      fieldset {
        display: contents;

        input {
          grid-column: 2;
        }

        label {
          grid-column: 3 / 4;
        }
      }
    }
  }
}
</style>
