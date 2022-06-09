<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useApiStore } from '../stores/api'

// ------------------------------------------------------------
// Store

const api = useApiStore()
const { reserveItem } = api
const { loginUrl, reserveItemRedirectUrl, reservingItem, pendingItem } = storeToRefs(api)

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

const reserving = computed(() => {
  const reserving = reservingItem.value
  return reserving && reserving.id === props.item.id
})
const pending = computed(() => {
  const pending = pendingItem.value
  return pending && pending.id === props.item.id
})
</script>

<template>
  <button v-if="reserving">Reserving…</button>
  <button v-else-if="available" @click="tryReserve">Reserve print</button>
  <button v-else disabled>Item unavailable</button>
  <form v-if="pending" method="post" :action="loginUrl">
    <input type="hidden" name="origin" :value="reserveItemRedirectUrl">
    <input type="submit" value="Login">
  </form>
</template>

<style lang="scss">
</style>
