<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useResultStore } from '../stores/results'

import PageNavLink from './PageNavLink.vue'

defineProps({
  name: { type: String, default: '' }
})

// ------------------------------------------------------------
// Store

const results = useResultStore()
const { items, pagination } = storeToRefs(results)

const fromItem = computed(() => {
  const paging = pagination.value
  const currentPage = paging.current || 0
  const itemsPerPage = paging.limit || 0
  return ((currentPage - 1) * itemsPerPage) + 1
})
const toItem = computed(() => fromItem.value + items.value.length - 1)
const totalItems = computed(() => pagination.value.records || 0)

</script>

<template>
  <nav v-if="totalItems > 0" class="page-nav" :aria-label="`${name} page navigation`">
    <p class="page-nav-items"><span class="page-nav-items-total">{{ totalItems }}</span> records found</p>
    <ul class="page-nav-links">
      <PageNavLink :id="`page-nav-${name}-first`" text="«" :active="pagination.current > 1" rel="first" title="First page" :page="1"/>
      <PageNavLink :id="`page-nav-${name}-prev`" text="‹" :active="pagination.current > 1" rel="prev" title="Previous page" :page="pagination.prev"/>
      <li>{{ fromItem }}–{{ toItem }}</li>
      <PageNavLink :id="`page-nav-${name}-next`" text="›" :active="pagination.current < pagination.last" rel="next" title="Next page" :page="pagination.next"/>
      <PageNavLink :id="`page-nav-${name}-last`" text="»" :active="pagination.current < pagination.last" rel="last" title="Last page" :page="pagination.last"/>
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
    line-height: 1.25em;
    margin: 0;
  }

  ul.page-nav-links {
    display: none;
  }

  @media only screen {
    ul.page-nav-links {
      display: flex;
      gap: 0.25em;
      padding: 0;

      li {
        display: inline-block;
      }
    }
  }
}
</style>
