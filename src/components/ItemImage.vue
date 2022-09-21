<script setup>
import { computed } from 'vue'

// TODO: use image_uri and thumbnail_uri from server
const IMAGE_BASE = 'https://digitalassets.lib.berkeley.edu/galc/ucb/images/'

const props = defineProps({
  filename: { type: String, default: null },
  alt: { type: String, default: null }
})

const imageUrl = computed(() => {
  const filename = props.filename
  return filename && new URL(filename, IMAGE_BASE)
})

</script>

<template>
  <img v-if="imageUrl" :key="imageUrl" :src="imageUrl" :alt="alt">
</template>

<style lang="scss">

</style>
