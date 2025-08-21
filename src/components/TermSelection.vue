<script setup lang="ts">
import { useSearchStore } from '../stores/search'

const props = defineProps<{
  facet: { name: string }
  term: { id: string | number; value: string; children?: any[] }
}>()

const emit = defineEmits<{
  (e: 'status-changed'): void
}>()

const { selectedTerms } = useSearchStore()
const selected = selectedTerms(props.facet.name)

function onChange() {
  emit('status-changed')  // no message yet
  //const isSelected = selected.value.includes(props.term.value)
  //emit('announce', `${props.facet.name}: ${props.term.value} ${isSelected ? 'applied' : 'removed'}`)

  //emit('announce', isSelected
  //  ? `Filter applied: ${props.term.value}`
   // : `Filter removed: ${props.term.value}`
  //)
}
</script>

<template>
  <div class="galc-term-selection">
    <input
      :id="`term-${term.id}`"
      v-model="selected"
      :value="term.value"
      type="checkbox"
      :aria-label="`Filter by ${term.value}. Currently ${selected.includes(term.value) ? 'selected' : 'not selected'}`"
      @change="onChange"
    >
    <label :for="`term-${term.id}`">{{ term.value }}</label>

    <fieldset v-if="term.children" class="galc-facet-subterms">
      <legend>{{ term.value }}</legend>
      <TermSelection
        v-for="child in term.children"
        :key="child.id"
        :facet="props.facet"
        :term="child"
        @status-changed="emit('status-changed')"
      />
    </fieldset>
  </div>
</template>
