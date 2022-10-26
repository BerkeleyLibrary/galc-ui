<script setup>
import { computed } from 'vue'
import { useFacetStore } from '../../stores/facets'
import { storeToRefs } from 'pinia'
import { useItemsStore } from '../../stores/items'

const items = useItemsStore()
const { itemPatch } = storeToRefs(items)

const facetStore = useFacetStore()
const { facetForName } = facetStore

const props = defineProps({
  attr: { type: String, default: null },
  label: { type: String, default: null }
})

const facet = computed(() => facetForName(props.label))

const isFacet = computed(() => !!facet.value)

const attrValue = computed({
  get () {
    return itemPatch.value[props.attr]
  },
  set (v) {
    itemPatch.value[props.attr] = v
  }
})

const termSelection = computed({
  get () {
    const facet = facetForName(props.label)
    if (!facet) {
      return
    }
    const patch = itemPatch.value
    const termsForFacet = patch.terms.filter((t) => {
      return t.facet.id === facet.id
    })
    console.log('termSelection(%o) => %o', props.label, termsForFacet)
    return termsForFacet
  },
  set (v) {
    const facet = facetForName(props.label)
    if (!facet) {
      return
    }

    const patch = itemPatch.value
    const otherTerms = patch.terms.filter((t) => {
      return t.facet.id !== facet.id
    })
    const uniqueTerms = new Set(otherTerms.concat(...v))
    patch.terms = [...uniqueTerms]
    console.log(patch.terms)
  }
})

const maxSelectLines = 4

const selectHeightPx = computed(() => {
  if (!facet.value) {
    return 0
  }
  const terms = facet.value.terms
  const termCount = terms.length
  const lines = Math.min(termCount, maxSelectLines)

  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const heightPx = (lines + 1) * remInPx

  return heightPx
})

</script>

<template>
  <div class="galc-item-attribute-field">
    <select v-if="isFacet" v-model="termSelection" :style="`height: ${selectHeightPx}px;`" multiple>
      <option v-for="term in facet.terms" :key="`term-option-${term.id}`" :value="term">{{ term.value }}</option>
    </select>
    <input v-else v-model="attrValue" type="text">
  </div>
</template>

<style lang="scss">
.galc-item-attribute-field {
  display: contents;

  select {
    margin-bottom: 20px;
  }
}
</style>
