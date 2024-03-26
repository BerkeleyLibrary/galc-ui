<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PageNavLink from './PageNavLink.vue'
import { usePaginationStore } from "../stores/pagination"

defineProps<{ name: string }>()

// ------------------------------------------------------------
// Store

const { fromItem, toItem, totalItems, current, prev, next, last } = storeToRefs(usePaginationStore())


</script>

<template>
  <nav v-if="totalItems > 0" class="page-nav" :aria-label="`${name} page navigation`">
    <p class="page-nav-items"><span class="page-nav-items-total">{{ totalItems }}</span> records found</p>
    <ul class="page-nav-links">
      <PageNavLink v-if="current > 1" :id="`page-nav-${name}-first`" text="«" rel="first" title="First page" :page="1"/>
      <PageNavLink v-if="prev" :id="`page-nav-${name}-prev`" text="‹" rel="prev" title="Previous page" :page="prev"/>
      <li>{{ fromItem }}–{{ toItem }}</li>
      <PageNavLink v-if="next" :id="`page-nav-${name}-next`" text="›" rel="next" title="Next page" :page="next"/>
      <PageNavLink v-if="last" :id="`page-nav-${name}-last`" text="»" rel="last" title="Last page" :page="last"/>
    </ul>
  </nav>
</template>

<style lang="scss">
nav.page-nav {
  display: flex;
  margin-top: 0.375em;
  margin-bottom: 0.625em;
  justify-content: center;

  .page-nav-items-total {
    font-weight: bold
  }

  ul, p.page-nav-items {
    font-size: 1.25rem;
    line-height: 1.5em;
    margin: 0;
  }

  ul.page-nav-links {
    display: none;
  }

  @media only screen {
    ul.page-nav-links {
      display: flex;
      gap: 0.25em;
      padding: 0 0 0 0.25em;

      li {
        display: inline-block;
      }
    }
  }
}
</style>
