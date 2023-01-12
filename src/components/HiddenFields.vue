<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '../stores/admin'

const { showHiddenFields } = storeToRefs(useAdminStore())

const expanded = ref(true)

function onToggle (event: Event) {
  const open = (event.target as HTMLDetailsElement).open
  if (expanded.value !== open) {
    expanded.value = open
  }
}

const showHidden = computed({
  get () {
    return showHiddenFields.value
  },
  set (v) {
    showHiddenFields.value = v
  }
})

</script>

<!-- TODO: share code w/Facet, TermSelection, Suppressed -->
<template>
  <fieldset class="galc-facet">
    <legend>Hidden fields</legend>
    <details :open="expanded" @toggle="onToggle">
      <summary>Hidden fields</summary>
      <template v-if="expanded">
        <div class="galc-term-selection">
          <input id="galc-show-hidden-fields" v-model="showHidden" type="checkbox">
          <label for="galc-show-hidden-fields">show hidden fields</label>
        </div>
      </template>
    </details>
  </fieldset>
</template>

<style lang="scss">
// TODO: share styles w/Facet, TermSelection, Suppressed

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
