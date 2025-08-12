<!-- TODO: share code w/EditTermSelection -->
<script setup lang="ts">
import { useSearchStore } from '../stores/search'

// ------------------------------------------------------------
// Properties

const props = defineProps({
  facet: { type: Object, default: null },
  term: { type: Object, default: null }
})

// ------------------------------------------------------------
// Stores

const { selectedTerms } = useSearchStore()

const selected = selectedTerms(props.facet.name)

</script>

<template>
  <div class="galc-term-selection">
    <input
      :id="`term-${term.id}`"
      v-model="selected"
      :value="term.value"
      type="checkbox"
      :aria-label="`Filter by ${term.value}. Currently ${selected.includes(term.value) ? 'selected' : 'not selected'}`"
    >
    <label :for="`term-${term.id}`">{{ term.value }}</label>
    <fieldset v-if="term.children" class="galc-facet-subterms">
      <legend>{{ term.value }}</legend>
      <TermSelection v-for="child in term.children" :key="child.id" :facet="props.facet" :term="child"/>
    </fieldset>
  </div>
</template>

<style lang="scss">
div.galc-term-selection {
  border: none;
  display: grid;
  grid-template-columns: 18px 3fr;
  column-gap: 0.5em;
  margin-left: 0;
  padding-left: 0;

  @media only screen and (max-width: 700px) {
    font-size: 1.125rem;
  }

  input[type=checkbox] {
    margin-bottom: 0.25em;

    @media only screen and (max-width: 700px) {
      -webkit-transform: scale(1.25);
    }
  }

  label {
    white-space: nowrap;
    height: min-content;
    font-weight: normal;
    line-height: 1.15;
    margin-bottom: 0.25em;
    cursor: pointer;
  }

  fieldset.galc-facet-subterms {
    display: block;
    border: 0;
  }
}
</style>
