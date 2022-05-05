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
  margin-top: 0;

  li {
    display: block;

    &:not(:last-of-type) {
      margin-bottom: 1rem;

      //border-bottom: 1px solid #ddd5c7;

      .galc-result-details {
        //margin-bottom: 1rem;
      }
    }

    &:not(:first-of-type) {
      border-top: 1px solid #ddd5c7;
      padding-top: 0.5rem;
    }
  }
}
</style>
