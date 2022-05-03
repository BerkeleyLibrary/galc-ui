<script setup>
import { computed, defineProps } from 'vue'
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
</script>

<template>
  <fieldset class="galc-facet">
    <details>
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
