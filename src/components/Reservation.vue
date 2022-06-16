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
const { loginUrl } = storeToRefs(api)

const reservation = useReservationStore()
const { startReservation, isReserved, reserveItemRedirectUrl } = reservation
const { currentReservation } = storeToRefs(reservation)

// ------------------------------------------------------------
// Properties

const props = defineProps({
  item: { type: Object, default: null },
  available: { type: Boolean, default: false }
})

// TODO: Handle/prevent multiple simultaneous attempted reservations
function tryReserve (event) {
  event.target.blur()
  startReservation(props.item)
}

const reserving = computed(() => {
  const rsvn = currentReservation.value
  return rsvn && rsvn.item.id === props.item.id
})
</script>

<template>
  <!-- TODO: clean this up -->
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
