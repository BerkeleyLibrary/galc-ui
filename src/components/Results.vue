<script setup>
import { storeToRefs } from 'pinia'
import { useGalcStore } from '../stores/galc'

const galc = useGalcStore()
const { items } = storeToRefs(galc)

// TODO: make this configurable
const imageBase = 'https://digitalassets.lib.berkeley.edu/galc/ucb/images/'

function thumbnailFor (item) {
  return new URL(item.image, imageBase)
}

</script>

<template>
  <table>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>
          <img :src="thumbnailFor(item)" :alt="item.title" class="thumbnail">
        </td>
        <td>
          <table class="metadata">
            <thead>
              <tr>
                <th colspan="2">{{ item.title }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Artist</th>
                <td>{{ item.artist }}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
img.thumbnail {
  width: 180px;
}
</style>
