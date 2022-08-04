<script setup>
import spinnerUrl from '../assets/circle-notch.svg'
</script>

<template>
  <img class="galc-spinner" alt="loading…" :src="spinnerUrl">
</template>

<style lang="scss">
img.galc-spinner {
  $img-size: 24px;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  height: $img-size !important;
  width: $img-size !important;
  display: block;
  margin-left: auto;
  margin-right: auto;

  animation: spin 1.5s linear infinite;
  //opacity: 1 !important;
  //filter: invert(1);
}
</style>
