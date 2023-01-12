<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApiStore } from '../../stores/api'

import fileImage from '../../assets/file-image.svg'

const props = defineProps({
  imageUri: { type: String, default: null },
  alt: { type: String, default: null }
})

const { apiBaseUrl } = storeToRefs(useApiStore())

const imageUrl = computed(() => {
  const imageUri = props.imageUri
  if (imageUri) {
    return new URL(imageUri, apiBaseUrl.value)
  }
  return null
})

</script>

<template>
  <img v-if="imageUrl" :key="imageUrl" :src="imageUrl" :alt="alt">
  <img v-else :src="fileImage" alt="No image" class="galc-image-placeholder">
</template>

<style lang="scss">
  img.galc-image-placeholder {
    opacity: 25%;
    border: 1em solid transparent;
  }
</style>
