<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useSearchStore } from '../stores/search'
import { useWindowLocationStore } from '../stores/window-location'

const props = defineProps<{
  id: string,
  rel: string,
  title: string,
  text: string,
  page: number
}>()

const { relativeUrl } = useWindowLocationStore()

const linkUrl = computed(() => {
  return relativeUrl({ page: props.page })
})

function navigateTo(newPage: number) {
  const { page } = storeToRefs(useSearchStore())
  page.value = newPage

  const appElement = document.getElementById('galc-app')
  if (appElement) {
    const boundingClientRect = appElement.getBoundingClientRect()
    if (boundingClientRect.top < 0) {
      appElement.scrollIntoView()
    }
  }
}

</script>

<template>
  <li :key="id" class="page-nav-link">
    <a :href="linkUrl" :rel="rel" :title="title" @click.prevent="navigateTo(page)">
      <div class="galc-nav-icon">
        {{ text }}
      </div>
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
