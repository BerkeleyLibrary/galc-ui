<script setup>
import spinnerUrl from '../assets/circle-notch.svg'
</script>

<template>
  <div class="galc-spinner-overlay">
    <img alt="" :src="spinnerUrl">
  </div>
</template>

<style lang="scss">
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

div.galc-spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;

  img {
    height: 24px !important;
    width: 24px !important;
    display: block;
    margin: auto;

    animation: spin 1.5s linear infinite;
    filter: invert(0.75);
  }
}
</style>
