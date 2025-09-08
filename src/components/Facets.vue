<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useFacetStore } from '../stores/facets'
import { useSessionStore } from '../stores/session'
import { useSearchStore } from '../stores/search'

import filter from '../assets/filter.svg'

import Suppressed from './Suppressed.vue'
import InternalFields from './InternalFields.vue'
import Facet from './Facet.vue'
import TermDeselection from './TermDeselection.vue'

const { facets } = storeToRefs(useFacetStore())
const { isAdmin } = storeToRefs(useSessionStore())

const search = useSearchStore()
const facetsOpen = ref(false)
const isMobile = ref(window.innerWidth <= 700)

function toggleFacets() {
  facetsOpen.value = !facetsOpen.value
}

function handleWindowResize() {
  isMobile.value = window.innerWidth <= 700
  if (isMobile.value) {
    facetsOpen.value = false 
  }
  else {
    facetsOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
  handleWindowResize()
})
onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
})

const liveMessage = computed(() => {
  const parts: string[] = []
  for (const facetName of search.activeFacetNames) {
    const termNames = search.selectedTerms(facetName).value
    if (termNames.length > 0) {
      parts.push(`${facetName}: ${termNames.join(', ')}`)
    }
  }
  return parts.length > 0
    ? `Selected filters – ${parts.join('; ')}.`
    : 'No filters selected.'
})
</script>

<template>
  <div class="galc-facets">
    <TermDeselection id-prefix="facets"/>

    <button
      v-if="isMobile"
      class="show-facets-button"
      type="button"
      @click="toggleFacets"
      :aria-expanded="facetsOpen.toString()"
      aria-controls="facet-form"
    >
      Options
      <img alt="" :src="filter" class="show-facets-icon">
    </button>

    <form
      id="facet-form"
      class="galc-facet-form"
      v-show="facetsOpen || !isMobile"
    >
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
    <span class="sr-only" aria-live="polite" aria-atomic="true">
      {{ liveMessage }}
    </span>
  </div>
</template>

<style lang="scss">

.show-facets-button {
  display: none;
}

@media only screen and (max-width: 700px) {
  .show-facets-button {
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
    border: none;
    border-radius: 4px;
    height: 33px;

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


</style>