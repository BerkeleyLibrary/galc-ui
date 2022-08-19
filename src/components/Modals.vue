<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useApiStore } from '../stores/api'
import { useReservationStore } from '../stores/reservation'

import Spinner from './Spinner.vue'
import ReserveDialog from './ReserveDialog.vue'
import PreviewDialog from './PreviewDialog.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'

const { loading } = storeToRefs(useApiStore())
const { currentReservation, completedReservation, currentPreview } = storeToRefs(useReservationStore())

const activeModal = computed(() => {
  if (loading.value) {
    return Spinner
  }
  const completedRsvn = completedReservation.value
  if (completedRsvn) {
    return ConfirmationDialog
  }
  const currentRsvn = currentReservation.value
  if (currentRsvn && !currentRsvn.confirmed) {
    return ReserveDialog
  }
  if (currentPreview.value) {
    return PreviewDialog
  }
  return null
})

</script>

<template>
  <div v-if="activeModal" class="galc-modal">
    <div class="galc-modal-overlay"/>
    <div class="galc-modal-container">
      <component :is="activeModal" class="galc-modal-component"/>
    </div>
  </div>
</template>

<style lang="scss">
.galc-modal {
  .galc-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;

    backdrop-filter: contrast(0.25) brightness(2) grayscale(1);
    -webkit-backdrop-filter: contrast(0.25) brightness(2) grayscale(1);
  }

  .galc-modal-container {
    position: fixed;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    display: flex;
    z-index: 1000;
  }

  .galc-modal-component {
    margin: 0 auto auto;
  }

}
</style>
