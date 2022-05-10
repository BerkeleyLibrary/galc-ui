<script setup>
import { computed, defineProps } from 'vue'
import { useGalcStore } from '../stores/galcStore'
import TermSelection from './TermSelection.vue'

// ------------------------------------------------------------
// Properties

const props = defineProps({
  facet: { type: Object, default: null }
})

// ------------------------------------------------------------
// Local state

const facetName = computed(() => props.facet.name)
const rootTerms = computed(() => props.facet.terms.filter(t => !t.parent))

// ------------------------------------------------------------
// Store

const galcStore = useGalcStore()
const { facetExpanded } = galcStore

// TODO: figure out why this is all more complicated than it ought to be
const expanded = computed({
  get: () => {
    const rawValue = facetExpanded[facetName.value]
    const value = !!rawValue
    console.log('facetExpanded[%o] => %o => %o', facetName.value, rawValue, value)
    return value
  },
  set: (v) => {
    console.log('facetExpanded[%o] = %o', facetName.value, v)
    facetExpanded[facetName.value] = v
  }
})

// TODO: figure out why setting facetExpanded = false in galcStore.clearTermSelection() only works if we're also doing this
function onToggle (event) {
  console.log('onToggle(%o); expanded = %o', event, expanded.value)
  expanded.value = event.target.open
}

</script>

<template>
  <fieldset class="galc-facet">
    <details :open="expanded" @toggle="onToggle">
      <summary>{{ facetName }}</summary>
      <TermSelection v-for="term in rootTerms" :key="term.id" :facet="props.facet" :term="term"/>
    </details>
  </fieldset>
</template>

<style lang="scss">
fieldset.galc-facet {
  display: contents;

  details {
    display: contents;

    summary {
      list-style: none;
      white-space: nowrap;
      display: block;
      height: min-content;
      font-weight: bold;

      &::-webkit-details-marker {
        display: none;
      }

      &::after {
        content: ' ';
        padding-left: 1em;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 1em 1em;
        background-image: url('../assets/angle-down.svg');
        width: 2em;
      }
    }

    &[open] {
      summary::after {
        background-image: url('../assets/angle-up.svg');
      }
    }

  }
}
</style>
