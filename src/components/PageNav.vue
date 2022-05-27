<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
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
    <ul>
      <PageNavLink text="«" :active="pagination.current > 1" rel="first" title="First page" :link="links.first"/>
      <PageNavLink text="‹" :active="pagination.current > 1" rel="prev" title="Previous page" :link="links.prev"/>
      <li>Page {{ pagination.current }} of {{ pagination.last || pagination.current }}</li>
      <PageNavLink text="›" :active="pagination.current < pagination.last" rel="next" title="Next page" :link="links.next"/>
      <PageNavLink text="»" :active="pagination.current < pagination.last" rel="last" title="Last page" :link="links.last"/>
    </ul>
    <p class="page-nav-items">Viewing items {{ fromItem }} to {{ toItem }} of {{ totalItems }}</p>
  </nav>
</template>

<style lang="scss">
nav.page-nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.375em;
  margin-bottom: 0.625em;

  ul, p.page-nav-items {
    font-size: 1rem;
    line-height: 1.25rem;
    font-variant-numeric: lining-nums;
    margin: 0;
  }

  ul {
    display: flex;
    gap: 0.5em;
    padding: 0;

    li {
      display: inline-block;
    }
  }
}
</style>
