<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApiStore } from '../../stores/api'

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
</template>

<style lang="scss">

</style>
