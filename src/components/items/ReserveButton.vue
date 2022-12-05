<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useApiStore } from '../../stores/api'
import { useSessionStore } from '../../stores/session'
import { useReservationStore } from '../../stores/reservation'
import formatInTimeZone from 'date-fns-tz/formatInTimeZone'
import { useClosuresStore } from '../../stores/closures'

// ------------------------------------------------------------
// Store

const { isAuthenticated } = storeToRefs(useSessionStore())

const api = useApiStore()
const { loginUrl } = storeToRefs(api)

const reservation = useReservationStore()
const { startReservation, isReserved, reserveItemRedirectUrl } = reservation
const { currentReservation } = storeToRefs(reservation)

const { closed, reopenDate } = storeToRefs(useClosuresStore())

// ------------------------------------------------------------
// Properties

const props = defineProps({
  item: { type: Object, default: null },
  available: { type: Boolean, default: false }
})

// TODO: Handle/prevent multiple simultaneous attempted reservations
function tryReserve (event) {
  // console.log('tryReserve(%o)', event)
  event.target.blur()
  const item = props.item
  // console.log('tryReserve(%o)', item)
  startReservation(item)
}

const reservingThisItem = computed(() => {
  const rsvn = currentReservation.value
  return rsvn && rsvn.item.id === props.item.id
})

const reservingAnyItem = computed(() => {
  const rsvn = currentReservation.value
  return !!rsvn
})

const closureMessage = computed(() => {
  const cls = closed.value
  if (cls) {
    const endDate = reopenDate.value
    if (endDate) {
      const formattedDate = formatInTimeZone(endDate, 'America/Los_Angeles', 'M/d')
      return `Reopening ${formattedDate}`
    } else {
      return 'Closed'
    }
  }
  return null
})

</script>

<template>
  <!-- TODO: clean this up -->
  <button v-if="item.suppressed" disabled>Suppressed</button>
  <button v-else-if="reservingThisItem" disabled>Reserving…</button>
  <button v-else-if="closureMessage" disabled>{{ closureMessage }}</button>
  <button v-else-if="isReserved(item)" disabled>Reserved</button>
  <template v-else-if="available">
    <button v-if="reservingAnyItem" disabled>Reserve print</button>
    <button v-else-if="isAuthenticated" @click="tryReserve">Reserve print</button>
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