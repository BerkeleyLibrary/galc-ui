<script setup>
import { useGalcStore } from '../stores/galc'

const galc = useGalcStore()
</script>

<template>
  <table v-if="galc.items">
    <tbody>
      <tr v-for="item in galc.items" :key="item.id">
        <th>{{ item.title }}</th>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
</style>
