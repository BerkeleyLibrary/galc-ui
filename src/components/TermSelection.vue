<script setup>
import { useSearchStore } from '../stores/search'

// ------------------------------------------------------------
// Properties

const props = defineProps({
  facet: { type: Object, default: null },
  term: { type: Object, default: null }
})

// ------------------------------------------------------------
// Local state

const search = useSearchStore()

// TODO: figure out how to cache this so it's called once per facet instead of once per term
const selectedTerms = search.selectedTerms(props.facet.name)

</script>

<template>
  <div class="galc-term-selection">
    <input
      :id="`term-${term.id}`"
      v-model="selectedTerms"
      :value="term.value"
      type="checkbox"
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
  display: contents;

  label {
    white-space: nowrap;
    height: min-content;
    font-weight: normal;
    line-height: 1.15;
  }

  fieldset.galc-facet-subterms {
    display: contents;
  }
}
</style>
