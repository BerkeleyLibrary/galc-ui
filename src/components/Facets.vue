<script setup>
import { defineEmits, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galc'

const galc = useGalcStore()
const { facets } = storeToRefs(galc)

const terms = ref([])

const emit = defineEmits(['applied'])
const apply = () => {
  emit('applied', terms.value)
}

function rootTerms (facet) {
  return facet.terms.filter(t => !t.parent)
}
</script>

<template>
  <form class="facets">
    <fieldset v-for="facet in facets" :key="facet.id">
      <details>
        <summary>{{ facet.name }}</summary>
        <template v-for="term in rootTerms(facet)" :key="term.id">
          <input :id="`term-${term.id}`" v-model="terms" :value="term.id" type="checkbox" @change="apply()">
          <label :for="`term-${term.id}`">{{ term.value }}</label>
          <fieldset v-if="term.children">
            <template v-for="child in term.children" :key="child.id">
              <input :id="`child-${child.id}`" v-model="terms" :value="child.id" type="checkbox" @change="apply()">
              <label :for="`child-${child.id}`">{{ child.value }}</label>
            </template>
          </fieldset>
        </template>
      </details>
    </fieldset>
  </form>
</template>

<style scoped lang="scss">
.facets {
  display: grid;
  grid-template-columns: min-content min-content minmax(0, 1fr);
  column-gap: 0.25rem; // TODO: something sensible
  row-gap: 0.5rem; // TODO: something sensible

  > fieldset {
    display: contents;

    details {
      display: contents;

      summary {
        grid-column: 1 / 4;
        list-style: none;

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

    input {
      grid-column: 1;
    }

    label {
      grid-column: 2 / 4;
    }

    fieldset {
      display: contents;

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
