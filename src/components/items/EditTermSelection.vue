<!-- TODO: share code w/TermSelection -->
<script setup>
import { useItemsStore } from '../../stores/items'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

// ------------------------------------------------------------
// Properties

const props = defineProps({
  facet: { type: Object, default: null },
  term: { type: Object, default: null }
})

// ------------------------------------------------------------
// Stores

const items = useItemsStore()
const { itemPatch } = storeToRefs(items)

// ------------------------------------------------------------
// Computed properties

const selected = computed({
  get () {
    const facet = props.facet
    const patch = itemPatch.value
    const selectedTerms = patch.terms.filter((t) => t.facet.id === facet.id)
    const selectedValues = selectedTerms.map((t) => t.value)
    console.log('selected(%o) => %o', facet.name, selectedValues)
    return selectedValues
  },
  set (v) {
    const facet = props.facet
    const patch = itemPatch.value
    const otherTerms = patch.terms.filter((t) => t.facet.id !== facet.id)
    const uniqueTerms = new Set(otherTerms.concat(...v))
    patch.terms = [...uniqueTerms]
    console.log(patch.terms)
  }
})
</script>

<template>
  <div class="galc-term-selection">
    <input
      :id="`term-${term.id}`"
      v-model="selected"
      :value="term.value"
      type="checkbox"
    >
    <label :for="`term-${term.id}`">{{ term.value }}</label>
    <fieldset v-if="term.children" class="galc-facet-subterms">
      <legend>{{ term.value }}</legend>
      <EditTermSelection v-for="child in term.children" :key="child.id" :facet="props.facet" :term="child"/>
    </fieldset>
  </div>
</template>

<style lang="scss">
div.galc-term-selection {
  display: contents;

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
    display: contents;
  }
}
</style>
