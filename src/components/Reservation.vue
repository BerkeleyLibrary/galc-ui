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

function cancelPendingReservation () {
  pendingItem.value = null
}
</script>

<template>
  <button v-if="reserving">Reserving…</button>
  <button v-else-if="available" @click="tryReserve">Reserve print</button>
  <button v-else disabled>Item unavailable</button>
  <div v-if="pending" class="galc-reserve-login-form">
    <form method="post" :action="loginUrl">
      <p>TODO: login message</p>
      <input type="hidden" name="origin" :value="reserveItemRedirectUrl">
      <input type="submit" value="Login">
      <button @click="cancelPendingReservation">Cancel</button>
    </form>
  </div>
</template>

<style lang="scss">
.galc-reserve-login-form {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;

  backdrop-filter: contrast(0.25) brightness(2) grayscale(1);
  -webkit-backdrop-filter: contrast(0.25) brightness(2) grayscale(1);

  form {
    display: block;
    padding: 1rem;
    background-color: white;
    border: 1px solid #ddd5c7;
    height: min-content;
  }
}
</style>
