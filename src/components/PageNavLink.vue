<script setup>
import { performSearch } from '../api/galcApi'

defineProps({
  active: { type: Boolean, default: false },
  rel: { type: String, default: null },
  title: { type: String, default: null },
  link: { type: String, default: null },
  text: { type: String, default: null }
})

function navigateTo (link) {
  const linkUrl = new URL(link)
  const linkParams = Object.fromEntries(linkUrl.searchParams)
  performSearch(linkParams)
}

</script>

<template>
  <li class="page-nav-link">
    <a v-if="link && active" href="#" :rel="rel" :title="title" @click.prevent="navigateTo(link)">{{ text }}</a>
    <template v-else>{{ text }}</template>
  </li>
</template>

<style lang="scss">
li.page-nav-link {
  position: relative;
  top: -0.0625em;
}
</style>
