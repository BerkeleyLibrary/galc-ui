<script setup>
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'
import { computed } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
  rel: { type: String, default: null },
  title: { type: String, default: null },
  text: { type: String, default: null },
  page: { type: Number, default: 1 }
})

const linkUrl = computed(() => {
  const url = new URL(window.location)
  const params = url.searchParams
  params.set('page', props.page)
  return url
})

function navigateTo (newPage) {
  const { page } = storeToRefs(useSearchStore())
  page.value = newPage
}

</script>

<template>
  <li class="page-nav-link">
    <a v-if="page && active" :href="linkUrl" :rel="rel" :title="title" @click.prevent="navigateTo(page)"><div class="galc-nav-icon">{{ text }}</div></a>
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
