<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useApiStore } from '../../stores/api'
import { useSessionStore } from '../../stores/session'
import { useReservationStore } from '../../stores/reservation'
import formatInTimeZone from 'date-fns-tz/formatInTimeZone'
import { useClosuresStore } from '../../stores/closures'
import { Item } from "../../types/Item"

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

const props = defineProps<{item: Item, available: boolean}>()

function tryReserve (event: MouseEvent) {
  (event.target as HTMLButtonElement).blur()
  const item = props.item
  startReservation(item)
}

const reservingThisItem = computed(() => {
  const rsvn = currentReservation.value
  if (rsvn) {
    return rsvn.item.id === props.item.id
  }
  return false
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
  return undefined
})

const canReserve = computed(() => {
  const item = props.item

  return props.available && !(
    closed.value ||
    item.suppressed ||
    reservingThisItem.value ||
    reservingAnyItem.value ||
    isReserved(item)
  )
})

const buttonMsg = computed(() => {
  const isClosed = closed.value
  if (isClosed) {
    return closureMessage.value
  }

  if (!props.available) {
    return 'Item unavailable'
  }

  const item = props.item
  if (item.suppressed) {
    return 'Suppressed'
  }

  if (reservingThisItem.value) {
    return 'Reserving…'
  }

  if (isReserved(item)) {
    return 'Reserved'
  }

  return 'Reserve print'
})

</script>

<template>
  <button v-if="!canReserve" disabled>{{ buttonMsg }}</button>
  <button v-else-if="isAuthenticated" @click="tryReserve">{{ buttonMsg }}</button>
  <form v-else method="post" class="galc-reserve-button-form" :action="loginUrl">
    <input type="hidden" name="origin" :value="reserveItemRedirectUrl(item)">
    <input type="submit" class="galc-action primary" value="Reserve print">
  </form>
</template>

<style lang="scss">
.galc-reserve-button-form {
  display: contents;
}
</style>
