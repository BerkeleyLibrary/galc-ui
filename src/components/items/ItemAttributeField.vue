<script setup lang="ts">
import { computed, onMounted, onUpdated } from 'vue'
import { storeToRefs } from "pinia"
import { useFacetStore } from '../../stores/facets'
import { useItemsStore } from '../../stores/items'

import EditTermSelection from './EditTermSelection.vue'
import { ItemAttrs } from "../../types/Item"

const items = useItemsStore()
const { itemPatch } = storeToRefs(items)
const facetStore = useFacetStore()
const { facetForName } = facetStore

const props = defineProps<{
  attr: string,
  label: string,
  required?: boolean
}>()

const facet = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return facetForName(props.label)!
})

const isFacet = computed(() => !!facet.value)

const attrValue = computed({
  get () {
    // TODO: pass in item?
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const patch = itemPatch.value!
    // TODO: split facet value & plain attribute fields so we don't have to do this
    const attr = props.attr as keyof ItemAttrs
    return patch[attr]
  },
  set (v: string | undefined) {
    // TODO: pass in item?
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const patch = itemPatch.value!
    // TODO: split facet value & plain attribute fields so we don't have to do this
    const attr = props.attr as keyof ItemAttrs
    patch[attr] = v
  }
})

// ------------------------------------------------------------
// Hooks

onUpdated(() => {
  scrollFirstSelectedTermIntoView()
})

onMounted(() => {
  scrollFirstSelectedTermIntoView()
})

function scrollFirstSelectedTermIntoView () {
  const currentFacet = facet.value
  if (!currentFacet) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchTermIds = itemPatch.value!.terms.map((t2) => t2.id)
  const firstSelectedTerm = currentFacet.terms.find((t) => patchTermIds.includes(t.id))
  if (!firstSelectedTerm) {
    return
  }
  const input = document.getElementById(`term-${firstSelectedTerm.id}`)
  if (!input) {
    return
  }
  input.scrollIntoView({ block: 'center', inline: 'nearest' })
}

const rootTerms = computed(() => facet.value && facet.value.terms.filter(t => !t.parent))

</script>

<template>
  <div class="galc-item-attribute-field">
    <fieldset v-if="isFacet" :id="`galc-item-term-selection-${facet.name}`" class="galc-item-term-selection">
      <legend>{{ facet.name }}</legend>
      <EditTermSelection v-for="term in rootTerms" :key="`term-option-${term.id}`" :facet="facet" :term="term"/>
    </fieldset>
    <input v-else v-model="attrValue" type="text" :required="required">
  </div>
</template>

<style lang="scss">
.galc-item-attribute-field {
  display: contents;

  select {
    margin-bottom: 20px;
  }

  input, select {
    width: available;
  }

  fieldset.galc-item-term-selection {
    legend {
      position: absolute;
      left: -9999px;
      top: -9999px;
    }

    display: grid;
    grid-template-columns: min-content max-content minmax(0, 1fr);
    align-items: center;
    justify-items: start;
    border: 1px solid #ddd;
    padding: 12px 16px;
    max-height: 126px; // 3×42px height of input[type=text] (incl. padding & borders)
    overflow-y: scroll;

    // TODO: rationalize these measurements
    column-gap: 0.5rem;
    row-gap: 0;

    margin: 0 0 20px;

    input {
      grid-column: 1;
      height: auto !important;
    }

    label {
      grid-column: 2 / 4;
    }

    fieldset {

      input {
        grid-column: 2;
      }

      label {
        grid-column: 3 / 4;
      }
    }
  }
}
</style>
