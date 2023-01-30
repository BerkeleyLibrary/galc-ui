<script setup lang="ts">
import { storeToRefs } from 'pinia/dist/pinia'
import { useSearchStore } from '../stores/search'
import { useFacetStore } from '../stores/facets'
import { Facet } from "../types/Facet"

import TermDeselectionButton from "./TermDeselectionButton.vue"

const { facets } = storeToRefs(useFacetStore())
const { selectedTerms } = useSearchStore()

const props = defineProps<{ idPrefix: string }>()

function inputIdFor(facet: Facet, termValue: string) {
  const elems = ['deselect', facet.name, termValue]
  const prefix = props.idPrefix
  if (prefix) {
    elems.splice(0, 0, prefix)
  }
  return elems.join('-')
}

function termValuesFor(facet: Facet) {
  return selectedTerms(facet.name).value
}

</script>

<template>
  <fieldset class="galc-term-deselection">
    <legend>Active filters</legend>
    <template v-for="facet of facets">
      <TermDeselectionButton
        v-for="termValue of termValuesFor(facet)"
        :key="inputIdFor(facet, termValue)"
        :input-id="inputIdFor(facet, termValue)"
        :facet-name="facet.name"
        :term-value="termValue"
      />
    </template>
  </fieldset>
</template>

<style lang="scss">
fieldset.galc-term-deselection {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  border: 0;
  margin: 0;
  padding: 0;

  legend {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
}
</style>
