<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useApiStore } from '../stores/api'
import { useReservationStore } from '../stores/reservation'

import Spinner from './Spinner.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const { loading } = storeToRefs(useApiStore())
const { currentReservation } = storeToRefs(useReservationStore())

const activeModal = computed(() => {
  if (loading.value) {
    return Spinner
  }
  const rsvn = currentReservation.value
  if (rsvn && !rsvn.confirmed) {
    return ConfirmDialog
  }
  return null
})

</script>

<template>
  <div v-if="activeModal" class="galc-modal-overlay">
    <component :is="activeModal" class="galc-modal"/>
  </div>
</template>

<style lang="scss">
.galc-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  z-index: 999;

  backdrop-filter: contrast(0.25) brightness(2) grayscale(1);
  -webkit-backdrop-filter: contrast(0.25) brightness(2) grayscale(1);

  .galc-modal {
    margin: 0 auto auto;
  }
}
</style>
