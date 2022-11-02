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

// TODO: something less awful (can we use term objects instead of values?)
const selected = computed({
  get () {
    const facet = props.facet
    const patch = itemPatch.value
    const selectedTerms = patch.terms.filter((t) => t.facet.id === facet.id)
    const selectedValues = selectedTerms.map((t) => t.value)
    return selectedValues
  },
  set (v) {
    const facet = props.facet
    const patch = itemPatch.value
    const vTerms = facet.terms.filter((t) => v.includes(t.value))
    const otherTerms = patch.terms.filter((t) => t.facet.id !== facet.id)
    const uniqueTerms = new Set(otherTerms.concat(...vTerms))
    patch.terms = [...uniqueTerms]
  }
})

const inputType = computed(() => props.facet.allowMultiple ? 'checkbox' : 'radio')
const inputValue = computed(() => props.facet.allowMultiple ? props.term.value : [props.term.value])

</script>

<template>
  <div class="galc-edit-term-selection">
    <input :id="`term-${term.id}`" v-model="selected" :value="inputValue" :type="inputType">
    <label :for="`term-${term.id}`">{{ term.value }}</label>
    <fieldset v-if="term.children" class="galc-facet-subterms">
      <legend>{{ term.value }}</legend>
      <EditTermSelection v-for="child in term.children" :key="child.id" :facet="props.facet" :term="child"/>
    </fieldset>
  </div>
</template>

<style lang="scss">
div.galc-edit-term-selection {
  display: contents;

  @media only screen and (max-width: 700px) {
    font-size: 1.125rem;
  }

  input[type=checkbox], input[type=radio] {
    margin-top: 0.25rem;
    margin-bottom: 0;

    @media only screen and (max-width: 700px) {
      -webkit-transform: scale(1.25);
    }
  }

  label {
    white-space: nowrap;
    height: min-content;
    font-weight: normal;
    line-height: 1.15;
    cursor: pointer;

    margin-top: 0.25rem;
    margin-bottom: 0;
  }

  fieldset.galc-facet-subterms {
    display: contents;
  }
}
</style>
