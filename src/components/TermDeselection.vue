<script setup>
import { useSearchStore } from '../stores/search'
import { storeToRefs } from 'pinia/dist/pinia'
import { useFacetStore } from '../stores/facets'
import timesCircle from '../assets/times-circle.svg'

const { facets } = storeToRefs(useFacetStore())
const { selectedTerms } = useSearchStore()

const props = defineProps({
  idPrefix: {
    type: String,
    default: ''
  }
})

function inputIdFor (term) {
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
        // slight tweak from official "Founder's Rock" RGB to increase contrast
        background-color: #3b7da1;
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
