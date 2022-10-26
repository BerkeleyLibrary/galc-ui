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
    itemPatch[props.attr] = v
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
    const patch = itemPatch.value
    const uniqueTerms = new Set(patch.terms.concat(...v))
    patch.terms = [...uniqueTerms]
  }
})

</script>

<template>
  <select v-if="isFacet" v-model="termSelection" multiple>
    <option v-for="term in facet.terms" :value="term">{{ term.value }}</option>
  </select>
  <input v-else v-model="attrValue" type="text">
</template>
