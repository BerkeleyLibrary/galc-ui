<script setup>
defineProps({
  imageUri: { type: String, default: null },
  alt: { type: String, default: null }
})

</script>

<template>
  <img v-if="imageUri" :key="imageUri" :src="imageUri" :alt="alt">
</template>

<style lang="scss">

</style>
