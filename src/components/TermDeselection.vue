<script setup lang="ts">
import { useSearchStore } from '../stores/search'
import { storeToRefs } from 'pinia/dist/pinia'
import { useFacetStore } from '../stores/facets'
import timesCircle from '../assets/times-circle.svg'
import { Term } from "../types/Term"

const { facets } = storeToRefs(useFacetStore())
const { selectedTerms } = useSearchStore()

const props = defineProps({
  idPrefix: {
    type: String,
    default: ''
  }
})

function inputIdFor (term: Term) {
  const baseId = `ds-term-${term.id}`
  const prefix = props.idPrefix
  if (!prefix) {
    return baseId
  }
  return `${prefix}-${baseId}`
}

</script>

<template>
  <fieldset class="galc-term-deselection">
    <legend>Active filters</legend>
    <!-- TODO: clean this up -->
    <template v-for="facet of facets">
      <div v-for="term of facet.terms" :key="inputIdFor(term)" class="ds-term">
        <input
          :id="inputIdFor(term)"
          v-model="selectedTerms(facet.name).value"
          :value="term.value"
          type="checkbox"
        >
        <label class="form-checkboxes" :for="inputIdFor(term)">
          <img :alt="`Deselect ${term.value}`" :src="timesCircle" class="term-deselect-icon">
          {{ facet.name }}: {{ term.value }}
        </label>
      </div>
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

  div.ds-term {
    display: contents;

    input[type=checkbox] {
      display: none;

      $color-pacific: #46535e;
      $color-hours-services: #f2f4f7;
      $color-hours-services-selected: #2c5e77;

      &:checked ~ label {
        display: block;
        font-size: 1rem;
        line-height: 1.75rem;
        font-weight: normal;
        color: white;
        background-color: $color-hours-services-selected;
        padding: 2px 8px;
        margin: 6px 16px 6px 0;
        cursor: pointer;

        transition: border-color .25s, background-color .25s, color .25s;
        border: 1px solid $color-hours-services-selected;

        img.term-deselect-icon {
          height: 1rem;
          width: 1rem;
          filter: invert(100%);
          display: inline;
          margin-bottom: -3px;
          margin-right: 3px;

          transition: filter 0.25s;
        }

        &:hover {
          color: $color-pacific;
          background-color: $color-hours-services;
          border-color: $color-pacific;

          img.term-deselect-icon {
            // convert black to "Founder's Rock" #3b7ea1
            filter: invert(43%) sepia(6%) saturate(3452%) hue-rotate(157deg) brightness(102%) contrast(95%);
          }
        }
      }
    }

    label {
      display: none;
    }
  }
}
</style>
