<script setup>
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galcStore'
import Result from './Result.vue'

const galcStore = useGalcStore()
const { items } = storeToRefs(galcStore)
</script>

<template>
  <ul class="galc-results-list">
    <li v-for="item in items" :key="item.id">
      <Result :item="item"/>
    </li>
  </ul>
</template>

<style lang="scss">
ul.galc-results-list {
  display: block;
  list-style-type: none;
  padding-left: 0;

  li {
    display: block;
    margin-bottom: 1rem;
  }
}
</style>
