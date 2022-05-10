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

  $img-size: 24px;

  position: absolute;
  width: 100%;
  height: 100%;
  min-height: $img-size;
  display: flex;
  pointer-events: none;

  backdrop-filter: contrast(0.25) brightness(2) grayscale(1);

  img {
    height: $img-size !important;
    width: $img-size !important;
    display: block;
    margin-left: auto;
    margin-right: auto;

    animation: spin 1.5s linear infinite;
    //opacity: 1 !important;
    //filter: invert(1);
  }
}
</style>
