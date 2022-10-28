<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'

const { suppressed } = storeToRefs(useSearchStore())

const expanded = ref(true)

function onToggle (event) {
  const open = event.target.open
  if (expanded.value !== open) {
    expanded.value = open
  }
}

</script>

<!-- TODO: share code w/Facet, TermSelection -->
<template>
  <fieldset class="galc-facet">
    <legend>Suppressed</legend>
    <details :open="expanded" @toggle="onToggle">
      <summary>Suppressed</summary>
      <template v-if="expanded">
        <div class="galc-term-selection">
          <input id="galc-show-suppressed-true" v-model="suppressed" :value="[true]" type="radio">
          <label for="galc-show-suppressed-true">suppressed only</label>
        </div>
        <div class="galc-term-selection">
          <input id="galc-show-suppressed-false" v-model="suppressed" :value="[false]" type="radio">
          <label for="galc-show-suppressed-false">unsuppressed only</label>
        </div>
        <div class="galc-term-selection">
          <input id="galc-show-suppressed-true" v-model="suppressed" :value="[true,false]" type="radio">
          <label for="galc-show-suppressed-true">both</label>
        </div>
      </template>
    </details>
  </fieldset>
</template>

<style lang="scss">
// TODO: share styles w/Facet, TermSelection

fieldset.galc-facet {
  display: contents;

  legend {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }

  details {
    display: contents;

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

div.galc-term-selection {
  display: contents;

  @media only screen and (max-width: 700px) {
    font-size: 1.125rem;
  }

  input[type=radio] {
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
    display: contents;
  }
}

</style>
