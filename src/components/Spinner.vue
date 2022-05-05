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
  //position: absolute;
  //top: 0;
  //left: 0;
  //width: 100vw;
  //height: 100vh;
  //border: 1px solid magenta;
  //display: flex;
  //justify-content: center;
  //align-items: center;
  //background-color: #DDD5C7;
  //opacity: 25%;
  display: contents;

  img {
    height: 24px !important;
    width: 24px !important;

    animation: spin 1.5s linear infinite;
    filter: invert(0.75);
  }
}
</style>
