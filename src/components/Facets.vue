<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFacetStore } from '../stores/facets'
import { useSessionStore } from '../stores/session'

import filter from '../assets/filter.svg'

import Suppressed from './Suppressed.vue'
import HiddenFields from './HiddenFields.vue'
import Facet from './Facet.vue'
import TermDeselection from './TermDeselection.vue'

const { facets } = storeToRefs(useFacetStore())
const { isAdmin } = storeToRefs(useSessionStore())

</script>

<template>
  <div class="galc-facets">
    <TermDeselection id-prefix="facets"/>
    <input id="show-facets" type="checkbox">
    <label class="show-facets-label" for="show-facets">
      Options
      <img alt="Options" :src="filter" class="show-facets-icon">
    </label>
    <form class="galc-facet-form">
      <Suppressed v-if="isAdmin"/>
      <HiddenFields v-if="isAdmin"/>
      <Facet
        v-for="facet in facets"
        :id="`galc-facet-${facet.name}`"
        :key="facet.name"
        :facet="facet"
      />
    </form>
  </div>
</template>

<style lang="scss">
div.galc-facets {

  input#show-facets {
    display: none;
  }

  @media only screen and (min-width: 700px) {
    // TODO: less hacky way to place this differently on desktop and mobile
    .galc-term-deselection {
      display: none;
    }

    label.show-facets-label {
      display: none;
    }

    form.galc-facet-form {
      width: 150px;
    }
  }

  @media only screen and (max-width: 700px) {
    input#show-facets {
      ~ form.galc-facet-form {
        display: none;
      }

      &:checked ~ form.galc-facet-form {
        display: grid;
      }
    }

    label.show-facets-label {
      display: block;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: normal;
      color: white;
      background-color: #46535e;
      padding: 2px 8px;
      margin: 6px 16px 6px 0;
      width: fit-content;
      cursor: pointer;

      img.show-facets-icon {
        height: 0.9rem;
        width: 0.9rem;
        filter: invert(100%);
        display: inline;
        margin-bottom: -2px;
        margin-left: 4px;
      }
    }
  }

  form.galc-facet-form {
    display: grid;
    grid-template-columns: min-content max-content minmax(0, 1fr);
    align-items: center;
    justify-items: start;

    // TODO: rationalize these measurements
    column-gap: 0.5rem;
    row-gap: 0;
    margin-right: 2rem;

    .galc-facet-title {
      white-space: nowrap;
      grid-column: 1 / 4;
      margin-bottom: 0.25em;
    }

    > fieldset {

      details {
        summary {
          grid-column: 1 / 4;
        }

        input {
          grid-column: 1;
        }

        label {
          grid-column: 2 / 4;
        }

        fieldset {

          input {
            grid-column: 2;
          }

          label {
            grid-column: 3 / 4;
          }
        }
      }

      &:not(:first-of-type) {
        summary {
          margin-top: 0.25em;
        }
      }
    }
  }
}
</style>
