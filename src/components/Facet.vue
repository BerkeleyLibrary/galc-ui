<script setup>
import { computed, defineProps } from 'vue'
import { useGalcStore } from '../stores/galcStore'

const { getTermSelection, setTermSelection } = useGalcStore()

// ------------------------------------------------------------
// Properties

const props = defineProps({
  facet: { type: Object, default: null }
})

// ------------------------------------------------------------
// Local state

const facetName = computed(() => props.facet.name)
const rootTerms = computed(() => props.facet.terms.filter(t => !t.parent))

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
  <fieldset class="galc-facet">
    <details>
      <summary>{{ facetName }}</summary>
      <template v-for="term in rootTerms" :key="term.id">
        <!-- TODO: extract a TermSelection component -->
        <input
          :id="`term-${term.id}`"
          v-model="currentSelection"
          :value="term.value"
          type="checkbox"
        >
        <label :for="`term-${term.id}`">{{ term.value }}</label>
        <fieldset v-if="term.children" class="galc-facet-subterms">
          <template v-for="child in term.children" :key="child.id">
            <!-- TODO: extract a TermSelection component -->
            <input
              :id="`child-${child.id}`"
              v-model="currentSelection"
              :value="child.value"
              type="checkbox"
            >
            <label :for="`child-${child.id}`">{{ child.value }}</label>
          </template>
        </fieldset>
      </template>
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

    label {
      white-space: nowrap;
      height: min-content;
      font-weight: normal;
    }

    fieldset.galc-facet-subterms {
      display: contents;
    }
  }
}
</style>
