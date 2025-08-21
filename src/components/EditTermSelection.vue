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
