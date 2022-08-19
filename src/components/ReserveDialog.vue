<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useReservationStore } from '../stores/reservation'

import ItemDetails from './ItemDetails.vue'
import ItemImage from './ItemImage.vue'

const reservation = useReservationStore()
const { currentReservation } = storeToRefs(reservation)
const { cancelReservation, confirmReservation } = reservation

const session = useSessionStore()
const { email } = storeToRefs(session)

const item = computed(() => {
  const rsvn = currentReservation.value
  return rsvn && rsvn.item
})
</script>

<template>
  <div class="galc-reserve-dialog">
    <h3>You are reserving:</h3>

    <section class="galc-reserve-item">
      <div class="galc-result-thumbnail">
        <ItemImage :filename="item.thumbnail" :alt="`thumbnail of “${item.title}” by ${item.artist}`"/>
      </div>
      <ItemDetails :item="item"/>
    </section>

    <p>
      You may only reserve two prints per semester. You may have no more than two prints charged out at any time.
    </p>
    <p>
      You will receive an email from the Morrison Library at <strong>{{ email }}</strong> when your print is ready for pick up.
    </p>

    <div class="galc-reserve-actions">
      <button class="galc-reserve-cancel" @click="cancelReservation">Cancel</button>
      <button class="galc-reserve-confirm" @click="confirmReservation">Reserve print</button>
    </div>
  </div>
</template>

<style lang="scss">
.galc-reserve-dialog {
  padding: 2em;
  border: 1px solid black;
  background-color: white;
  max-width: 1075px;

  .galc-reserve-item {
    display: grid;
    grid-template-columns: min(180px, 45%) minmax(0, 1fr);
    grid-column-gap: 0.75rem;

    @media only screen and (min-width: 700px) {
      .galc-item-details {
        margin-right: auto;
      }
    }
  }

  .galc-reserve-actions {
    display: flex;
    justify-content: center;
    gap: 1em;

    // TODO: share button styles
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

      &.galc-reserve-cancel {
        background-color: white;
        border: 1px solid black;

        &:hover {
          background-color: #000;
          color: #fff;
        }
      }

      &.galc-reserve-confirm {
        border: 1px solid #fdb515;

        &:hover {
          border-color: black;
          background-color: #000;
          color: #fff;
        }
      }
    }

  }

  @media only screen and (min-width: 700px) {
    .galc-result {
      margin-left: 1em;
      margin-right: 1em;
    }
  }
}
</style>
