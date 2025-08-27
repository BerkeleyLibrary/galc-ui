<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFacetStore } from '../stores/facets'
import { useSessionStore } from '../stores/session'

import filter from '../assets/filter.svg'

import Suppressed from './Suppressed.vue'
import InternalFields from './InternalFields.vue'
import Facet from './Facet.vue'
import TermDeselection from './TermDeselection.vue'

import { useSearchStore } from '../stores/search'
import { computed } from 'vue'

const { facets } = storeToRefs(useFacetStore())
const { isAdmin } = storeToRefs(useSessionStore())
//import { watch } from 'vue'
import { ref } from 'vue'

const search = useSearchStore()

//watch(() => search.activeFacetNames, (val) => {
// console.log("Active facets:", val)
//}, { immediate: true })

//console.log('search store11112:', search.selectedTerms('Size').value.join(', '))


const liveMessage = computed(() => {
  const parts: string[] = []
  //console.log('selected FacetName888', search.activeFacetNames.join(', '))

  for (const facetName of search.activeFacetNames) {
    const termNames = search.selectedTerms(facetName).value
    if (termNames.length > 0) {
      //console.log('selected terms8888', `${facetName}: ${termNames.join(', ')}`)
      parts.push(`${facetName}: ${termNames.join(', ')}`)
    }
  }

  return parts.length > 0
    ? `Selected filters 2222– ${parts.join('; ')}.`
    : 'No filters selected.'
})




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
      <InternalFields v-if="isAdmin"/>
      <Facet
        v-for="facet in facets"
        :id="`galc-facet-${facet.name}`"
        :key="facet.name"
        :facet="facet"
        
      />
    </form>

    <!-- Accessible live region -->
    <span class="sr-only" aria-live="polite" aria-atomic="true">{{ liveMessage }}</span>

  </div>
</template>

<style lang="scss">
div.galc-facets {

  input#show-facets {
    display: none;
  }

  @media only screen and (min-width: 700px) {
    margin-right: 1em;
    
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
    grid-template-columns: 1fr;
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
      padding-bottom: 0;
      width: 100%;

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
            grid-column: 1;
          }

          label {
            grid-column: 2 / 4;
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

  .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
  }
} 

</style>
