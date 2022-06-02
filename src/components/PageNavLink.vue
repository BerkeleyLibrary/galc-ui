<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '../stores/config'

const { apiClient } = storeToRefs(useConfigStore())

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
  apiClient.findItems(linkParams) // TODO: make this update search store
}

</script>

<template>
  <li class="page-nav-link">
    <a v-if="link && active" href="#" :rel="rel" :title="title" @click.prevent="navigateTo(link)"><div class="galc-nav-icon">{{ text }}</div></a>
  </li>
</template>

<style lang="scss">
li.page-nav-link {
  a {
    display: block;
    width: 1em;
    text-align: center;
    padding-bottom: 3px;

    .galc-nav-icon {
      font-weight: bold;
      margin-top: -2px;
    }
  }
}
</style>
