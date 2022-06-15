<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useApiStore } from '../stores/api'
import { useSessionStore } from '../stores/session'
import { useReservationStore } from '../stores/reservation'

// ------------------------------------------------------------
// Store

const { isAuthenticated } = storeToRefs(useSessionStore())

const api = useApiStore()
const { reserveItem } = api
const { loginUrl } = storeToRefs(api)

const reservation = useReservationStore()
const { isReserved, reserveItemRedirectUrl } = reservation
const { inProgressItem } = storeToRefs(reservation)

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
  const reserving = inProgressItem.value
  return reserving && reserving.id === props.item.id
})
</script>

<template>
  <button v-if="reserving" disabled>Reserving…</button>
  <button v-else-if="isReserved(item)" disabled>Reserved</button>
  <template v-else-if="available">
    <button v-if="isAuthenticated" @click="tryReserve">Reserve print</button>
    <form v-else method="post" class="galc-reserve-button-form" :action="loginUrl">
      <input type="hidden" name="origin" :value="reserveItemRedirectUrl(item)">
      <input type="submit" value="Reserve print">
    </form>
  </template>
  <button v-else disabled>Item unavailable</button>
</template>

<style lang="scss">
.galc-reserve-button-form {
  display: contents;

  input {
    font-size: 1rem;
  }
}
</style>
