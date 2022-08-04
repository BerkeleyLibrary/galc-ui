<script setup>
import spinnerUrl from '../assets/circle-notch.svg'
</script>

<template>
  <div class="galc-spinner-container">
    <img class="galc-spinner" alt="loading…" :src="spinnerUrl">
  </div>
</template>

<style lang="scss">
div.galc-spinner-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

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

    animation: spin 1.5s linear infinite;
    //opacity: 1 !important;
    //filter: invert(1);
  }
}
</style>
