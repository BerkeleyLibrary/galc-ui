<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { FocusTrap } from 'focus-trap-vue'

import { useApiStore } from '../stores/api'
import { useReservationStore } from '../stores/reservation'
import { usePreviewStore } from '../stores/preview'
import { useClosuresStore } from '../stores/closures'

import Spinner from './Spinner.vue'
import ReserveDialog from './ReserveDialog.vue'
import PreviewDialog from './PreviewDialog.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import EditClosureDialog from './closures/EditClosureDialog.vue'

const { loading } = storeToRefs(useApiStore())
const { closurePatch } = storeToRefs(useClosuresStore())
const { currentReservation, completedReservation } = storeToRefs(useReservationStore())
const { currentPreview } = storeToRefs(usePreviewStore())

const activeModal = computed(() => {
  if (loading.value) {
    // console.log('Spinning')
    return Spinner
  }
  if (closurePatch.value) {
    return EditClosureDialog
  }
  const completedRsvn = completedReservation.value
  // console.log('completedRsvn: %o', completedRsvn)
  if (completedRsvn) {
    return ConfirmationDialog
  }
  const currentRsvn = currentReservation.value
  // console.log('currentRsvn: %o', currentRsvn)
  if (currentRsvn) {
    const confirmed = currentRsvn.confirmed
    // console.log('confirmed: %o', confirmed)
    if (!confirmed) {
      return ReserveDialog
    }
  }
  const currentPrv = currentPreview.value
  // console.log('currentPreview: %o', currentPrv)
  if (currentPrv) {
    return PreviewDialog
  }
  // console.log('No modals')
  return null
})

const enableFocusTrap = computed({
  get () {
    const modal = activeModal.value
    return !!modal && modal !== Spinner // can't trap focus in non-focusable spinner
  },
  set (v) {
    // necessary, but ignored
  }
})

</script>

<template>
  <div v-if="activeModal" class="galc-modal">
    <div class="galc-modal-overlay"/>
    <focus-trap v-model:active="enableFocusTrap">
      <div class="galc-modal-container">
        <component :is="activeModal" class="galc-modal-component"/>
      </div>
    </focus-trap>
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
