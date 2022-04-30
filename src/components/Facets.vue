<script setup>
import { storeToRefs } from 'pinia'
import { stringify } from 'flatted'
import { useGalcStore } from '../stores/galcStore'
import Facet from './Facet.vue'

const galcStore = useGalcStore()
const { facets } = storeToRefs(galcStore)
const { getSelectedTerms, setSelectedTerms } = galcStore

function applySelection (payload) {
  console.log(`applySelection(${stringify(payload)})`)
  const { facet, selectedTerms } = payload
  setSelectedTerms(facet, selectedTerms)
}

</script>

<template>
  <form class="galc-facet-form">
    <Facet
      v-for="facet in facets"
      :id="`galc-facet-${facet.name}`"
      :key="facet.name"
      :facet="facet"
      :selected-terms="getSelectedTerms(facet)"
      @applied="applySelection"
    />
  </form>
</template>

<!-- TODO: figure out how to use scoped styles & still style subcomponent here -->
<style lang="scss">
form.galc-facet-form {
  display: grid;
  grid-template-columns: min-content max-content minmax(0, 1fr);
  column-gap: 0.25rem; // TODO: something sensible
  row-gap: 0.5rem; // TODO: something sensible
  align-items: start;

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
  }
}
</style>
