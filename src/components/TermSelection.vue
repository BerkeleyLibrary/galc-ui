<script setup>
import { computed, defineProps } from 'vue'
import { useGalcStore } from '../stores/galcStore'

const { getTermSelection, setTermSelection } = useGalcStore()

// ------------------------------------------------------------
// Properties

const props = defineProps({
  facet: { type: Object, default: null },
  term: { type: Object, default: null }
})

// ------------------------------------------------------------
// Local state

const facetName = computed(() => props.facet.name)
const term = computed(() => props.term)
const currentSelection = computed({
  get () {
    return getTermSelection(facetName.value)
  },
  set (selection) {
    setTermSelection(facetName.value, selection)
  }
})

</script>

<template>
  <div class="galc-term-selection">
    <input
      :id="`term-${term.id}`"
      v-model="currentSelection"
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
