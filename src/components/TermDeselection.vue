<script setup>
import { useSearchStore } from '../stores/search'
import { storeToRefs } from 'pinia/dist/pinia'
import { useFacetStore } from '../stores/facets'
import timesCircle from '../assets/times-circle.svg'

const { facets } = storeToRefs(useFacetStore())
const { selectedTerms } = useSearchStore()

</script>

<template>
  <fieldset class="galc-term-deselection">
    <!-- TODO: clean this up -->
    <template v-for="facet of facets">
      <div v-for="term of facet.terms" :key="`ds-term-${term.id}`" class="ds-term">
        <input
          :id="`ds-term-${term.id}`"
          v-model="selectedTerms(facet.name).value"
          :value="term.value"
          type="checkbox"
        >
        <label class="form-checkboxes" :for="`ds-term-${term.id}`">
          <img :alt="`Deselect ${term.value}`" :src="timesCircle" class="term-deselect-icon">
          {{ facet.name }}: {{ term.value }}
        </label>
      </div>
    </template>
  </fieldset>
</template>

<style lang="scss">
.galc-term-deselection {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  border: 0;
  margin: 0;
  padding: 0;

  img.term-deselect-icon {
    height: 0.9rem;
    width: 0.9rem;
    filter: invert(100%);
    display: inline;
    margin-bottom: -2px;
    margin-right: 4px;
  }

  div.ds-term {
    display: contents;

    input[type=checkbox] {
      display: none;

      &:checked ~ label {
        display: block;
        font-size: 1rem;
        line-height: 1.75rem;
        font-weight: normal;
        color: white;
        background-color: #3b7ea1;
        padding: 2px 8px;
        margin: 6px 16px 6px 0;
        cursor: pointer;
      }
    }

    label {
      display: none;
    }
  }
}
</style>
