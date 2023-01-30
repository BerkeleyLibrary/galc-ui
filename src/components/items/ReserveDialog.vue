<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../../stores/session'
import { useReservationStore } from '../../stores/reservation'

import ItemDetails from './ItemDetails.vue'
import ItemImage from './ItemImage.vue'
import { useItemsStore } from "../../stores/items"

const reservation = useReservationStore()
const { currentReservation } = storeToRefs(reservation)
const { cancelReservation, confirmReservation } = reservation

const session = useSessionStore()
const { email } = storeToRefs(session)

const { thumbnailUriFor } = useItemsStore()

const item = computed(() => {
  const rsvn = currentReservation.value
  return rsvn && rsvn.item
})

</script>

<template>
  <section class="galc-reserve-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-dialog-title" aria-describedby="galc-reserve-message">
    <h2 id="galc-dialog-title">You are reserving “{{ item.title }}”</h2>

    <section class="galc-reserve-item">
      <div class="galc-result-thumbnail">
        <ItemImage :image-uri="thumbnailUriFor(item)" :alt="`thumbnail of “${item.title}” by ${item.artist}`"/>
      </div>
      <ItemDetails :item="item"/>
    </section>

    <div id="galc-reserve-message">
      <p>
        You may only reserve two prints per semester. You may have no more than two prints charged out at any time.
      </p>
      <p>
        You will receive an email from the Morrison Library at <strong>{{ email }}</strong> when your print is ready for pick up.
      </p>
    </div>

    <div class="galc-reserve-actions">
      <button class="galc-action secondary" @click="cancelReservation">Cancel</button>
      <button  class="galc-action primary" @click="confirmReservation">Reserve print</button>
    </div>
  </section>
</template>

<style lang="scss">
// TODO: share dialog styles
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

    button {
      width: 180px;
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
