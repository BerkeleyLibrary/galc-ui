<script setup lang="ts">
import { computed } from 'vue'
import { useFacetStore } from '../stores/facets'

import { Facet } from '../types/Facet'
import TermSelection from './TermSelection.vue'

// ------------------------------------------------------------
// Properties

const props = defineProps<{ facet: Facet }>()

// ------------------------------------------------------------
// Local state

const facetName = computed(() => props.facet.name)
const rootTerms = computed(() => props.facet.terms.filter(t => !t.parent))

// ------------------------------------------------------------
// Store

const facets = useFacetStore()
const expanded = facets.expanded(facetName.value)

function onToggle (event: Event) {
  const open = (event.target as HTMLDetailsElement).open
  if (expanded.value !== open) {
    expanded.value = open
  }
}

</script>

<template>
  <fieldset class="galc-facet">
    <legend>{{ facetName }}</legend>
    <details :open="expanded" :aria-expanded="expanded" @toggle="onToggle">
      <summary>{{ facetName }}</summary>
      <template v-if="expanded">
        <TermSelection v-for="term in rootTerms" :key="term.id" :facet="props.facet" :term="term"/>
      </template>
    </details>
  </fieldset>
</template>

<style lang="scss">
fieldset.galc-facet {
  display: inherit;
  border: none;

  legend {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }

  details {
    display: inherit;
    border: none;

    summary {
      list-style: none;
      white-space: nowrap;
      display: block;
      height: min-content;
      font-size: 1.125rem;
      border-bottom: 1px solid #ddd5c7;
      width: 100%;
      margin-bottom: 0.5em;
      cursor: pointer;

      &::-webkit-details-marker {
        display: none;
      }

      &::after {
        content: ' ';
        padding-left: 1.5em;
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

  &:not(:first-of-type) {
    summary {
      margin-top: 1em;
    }
  }
}
</style>
