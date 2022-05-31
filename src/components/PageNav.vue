<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useResultStore } from '../stores/results'

import PageNavLink from './PageNavLink.vue'

// ------------------------------------------------------------
// Store

const results = useResultStore()
const { items, pagination, links } = storeToRefs(results)

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
  <nav v-if="totalItems > 0" class="page-nav">
    <p class="page-nav-items"><span class="page-nav-items-total">{{ totalItems }}</span> records found</p>
    <ul>
      <PageNavLink text="«" :active="pagination.current > 1" rel="first" title="First page" :link="links.first"/>
      <PageNavLink text="‹" :active="pagination.current > 1" rel="prev" title="Previous page" :link="links.prev"/>
      <li>{{ fromItem }}–{{ toItem }}</li>
      <PageNavLink text="›" :active="pagination.current < pagination.last" rel="next" title="Next page" :link="links.next"/>
      <PageNavLink text="»" :active="pagination.current < pagination.last" rel="last" title="Last page" :link="links.last"/>
    </ul>
  </nav>
</template>

<style lang="scss">
nav.page-nav {
  display: flex;
  width: 100%;
  margin-top: 0.375em;
  margin-bottom: 0.625em;

  &:first-of-type {
    justify-content: end;
  }

  &:last-of-type {
    justify-content: center;
  }

  .page-nav-items-total {
    font-weight: bold
  }

  ul, p.page-nav-items {
    font-size: 1.25rem;
    line-height: 1.25em;
    font-variant-numeric: lining-nums;
    margin: 0;
  }

  //p.page-nav-items {
  //  margin-top: 0;
  //  margin-right: 0.5em;
  //  margin-bottom: 0;
  //}
  //
  ul {
    display: flex;
    gap: 0.25em;
    padding: 0;

    li {
      display: inline-block;
    }
  }
}
</style>
