<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useReservationStore } from '../stores/reservation'
import { useApiStore } from '../stores/api'

import Result from './Result.vue'

const reservation = useReservationStore()
const { currentReservation } = storeToRefs(reservation)

const api = useApiStore()
const { reserveItem } = api

const session = useSessionStore()
const { email } = storeToRefs(session)

function cancelReservation () {
  currentReservation.value = null
}

function confirmReservation () {
  const rsvn = currentReservation.value
  rsvn.confirmed = true

  const itemId = rsvn.item.id
  reserveItem(itemId)
}

const doConfirm = computed(() => {
  const rsvn = currentReservation.value
  return rsvn && !rsvn.confirmed
})

const item = computed(() => {
  const rsvn = currentReservation.value
  console.log('item: %o', rsvn)
  return rsvn && rsvn.item
})

</script>

<template>
  <div v-if="doConfirm" class="galc-confirm-overlay">
    <div class="galc-confirm-dialog">
      <h3>You are reserving:</h3>

      <Result :item="item" :actions="false"/>
      <p>
        You may only reserve two prints per semester. You may have no more than two prints charged out at any time.
      </p>
      <p>
        You will receive an email from the Morrison Library at <strong>{{ email }}</strong> when your print is ready for pick up.
      </p>

      <div class="galc-confirm-actions">
        <button class="galc-confirm-cancel" @click="cancelReservation">Cancel</button>
        <button class="galc-confirm-confirm" @click="confirmReservation">Reserve print</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.galc-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 999;

  backdrop-filter: contrast(0.25) brightness(2) grayscale(1);
  -webkit-backdrop-filter: contrast(0.25) brightness(2) grayscale(1);

  .galc-confirm-dialog {
    margin: auto;
    padding: 2em;
    border: 1px solid black;
    background-color: white;
  }

  .galc-confirm-actions {

    display: flex;
    justify-content: center;
    gap: 1em;

    button {
      width: 180px;
      white-space: nowrap;
      text-transform: uppercase;
      font-weight: 700;
      height: 42px;
      padding: 6px 10px;
      transition: background-color .25s, color .25s, border .25s;
      color: #000;
      font-size: 1rem;

      &.galc-confirm-confirm {
        border: 1px solid #fdb515;

        &:hover {
          border-color: black;
          background-color: #000;
          color: #fff;
        }
      }

      &.galc-confirm-cancel {
        background-color: white;
        border: 1px solid black;

        &:hover {
          background-color: #000;
          color: #fff;
        }
      }
    }

  }
}
</style>
