<script setup>
import { useApiStore } from '../stores/api'

// ------------------------------------------------------------
// Store

const { reserveItem } = useApiStore()

// ------------------------------------------------------------
// Properties

const props = defineProps({
  item: { type: Object, default: null },
  available: { type: Boolean, default: false }
})

function tryReserve (event) {
  event.target.blur()
  reserveItem(props.item)
}
</script>

<template>
  <button v-if="available" @click="tryReserve">Reserve print</button>
  <button v-else disabled>Item unavailable</button>
</template>

<style lang="scss">
</style>
