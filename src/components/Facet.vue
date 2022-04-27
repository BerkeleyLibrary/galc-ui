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
  const payload = { facet: props.facet, selectedTerms: this.currentSelection }
  emit('applied', payload)
}
</script>

<template>
  <fieldset class="galc-facet">
    <details>
      <summary>{{ facet.name }}</summary>
      <template v-for="term in rootTerms" :key="term.id">
        <input :id="`term-${term.id}`" v-model="currentSelection" :value="term" type="checkbox" @change="apply()">
        <label :for="`term-${term.id}`">{{ term.value }}</label>
        <fieldset v-if="term.children" class="galc-facet-subterms">
          <template v-for="child in term.children" :key="child.id">
            <input
              :id="`child-${child.id}`"
              v-model="currentSelection"
              :value="child"
              type="checkbox"
              @change="apply()"
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
    }

    fieldset.galc-facet-subterms {
      display: contents;
    }
  }
}
</style>
