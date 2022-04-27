<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue'

// ------------------------------------------------------------
// Properties

const props = defineProps({
  facet: { type: Object, default: null },
  selectedTerms: { type: Array, default: () => [] }
})

// ------------------------------------------------------------
// Local state

const rootTerms = computed(() => props.facet.terms.filter(t => !t.parent))
const currentSelection = ref(props.selectedTerms)

// ------------------------------------------------------------
// Events

const emit = defineEmits(['applied'])

function apply () {
  const payload = { facet: this.facet, selectedTerms: this.selectedTerms }
  emit('applied', payload)
}
</script>

<template>
  <details open>
    <summary>{{ facet.name }}</summary>
    <template v-for="term in rootTerms" :key="term.id">
      <input :id="`term-${term.id}`" v-model="currentSelection" :value="term" type="checkbox" @change="apply()">
      <label :for="`term-${term.id}`">{{ term.value }}</label>
      <fieldset v-if="term.children">
        <template v-for="child in term.children" :key="child.id">
          <input :id="`child-${child.id}`" v-model="currentSelection" :value="child" type="checkbox" @change="apply()">
          <label :for="`child-${child.id}`">{{ child.value }}</label>
        </template>
      </fieldset>
    </template>
  </details>
</template>
