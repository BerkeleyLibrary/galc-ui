<script setup lang="ts">
import { computed } from 'vue'
import { useSearchStore } from '../stores/search'
import { ref } from 'vue'
import TermSelection from './TermSelection.vue'

const props = defineProps<{
  facet: { name: string }
  terms: { id: string | number; value: string; children?: any[] }[]
}>()


const { selectedTerms } = useSearchStore()
const liveMessage = ref("")

function handleStatusChanged() {
  // Compute current status for this facet
  const selected = selectedTerms(props.facet.name).value  // array of selected term values
  // Build a live message summarizing all selected terms
  if (selected.length > 0) {
    liveMessage.value = `Selected filters: ${selected.join(', ')}`
  } else {
    liveMessage.value = `No filters selected`
  }
}


//function handleAnnounce(message: string) {
//  liveMessage.value = message
//}
</script>

<template>
  <div class="edit-term-selection">
    <TermSelection
      v-for="term in props.terms"
      :key="term.id"
      :facet="props.facet"
      :term="term"
      @status-changed="handleStatusChanged"
    />

    <!-- Single global live region -->
   <span class="sr-only" aria-live="polite" data-testid="live-region">
  {{ liveMessage || '\u00A0' }}
</span>
  </div>
</template>

<style lang="scss">
div.galc-term-selection {
  border: none;
  display: grid;
  grid-template-columns: 18px 1fr;
  column-gap: 0.5em;
  margin-left: 0;
  padding-left: 0;

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
    display: block;
    border: 0;
    margin-left: 1.5em;
  }
}

/* Screen-reader-only text */
.sr-only {
  position: absolute;
  width: auto;    /* must allow perceivable width */
  height: auto;   /* must allow perceivable height */
  padding: 0;
  margin: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>
