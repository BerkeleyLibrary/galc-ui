<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { computeRelativeUrl } from '../helpers/window-location-helper'

import { useSearchStore } from '../stores/search'
import { useWindowLocationStore } from '../stores/window-location'

const props = defineProps({
  id: { type: String, default: null },
  active: { type: Boolean, default: false },
  rel: { type: String, default: null },
  title: { type: String, default: null },
  text: { type: String, default: null },
  page: { type: Number, default: 1 }
})

const { location } = storeToRefs(useWindowLocationStore())

const linkUrl = computed(() => {
  return computeRelativeUrl(location.value, { page: props.page })
})

function navigateTo (newPage) {
  const { page } = storeToRefs(useSearchStore())
  page.value = newPage

  const appElement = document.getElementById('galc-app')
  const boundingClientRect = appElement.getBoundingClientRect()
  if (boundingClientRect.top < 0) {
    appElement.scrollIntoView()
  }
}

</script>

<template>
  <li :key="id" class="page-nav-link">
    <a v-if="page && active" :href="linkUrl" :rel="rel" :title="title" @click.prevent="navigateTo(page)">
      <div class="galc-nav-icon">{{ text }}</div>
    </a>
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
