<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import ItemDetails from './ItemDetails.vue'
import ItemImage from './ItemImage.vue'
import EditItemButton from './EditItemButton.vue'
import ReserveButton from './ReserveButton.vue'
import { usePreviewStore } from '../../stores/preview'
import { useResultStore } from '../../stores/results'
import { useSessionStore } from '../../stores/session'
import { Item } from "../../types/Item"
import DeleteItemButton from "./DeleteItemButton.vue"
import { useItemsStore } from "../../stores/items"
import { useAdminStore } from "../../stores/admin"

// ------------------------------------------------------------
// Store

const { startPreview } = usePreviewStore()
const { getAvailability } = useResultStore()
const { isAdmin } = storeToRefs(useSessionStore())
const { thumbnailUriFor } = useItemsStore()
const { showInternalFields } = storeToRefs(useAdminStore())

// ------------------------------------------------------------
// Properties

const props = defineProps<{item: Item}>()

// ------------------------------------------------------------
// Local state

const available = computed(() => getAvailability(props.item))

const showAdmin = computed(() => {
  return isAdmin.value && showInternalFields.value
})

// ------------------------------------------------------------
// Actions

function showPreview (_event: MouseEvent) {
  startPreview(props.item)
}

</script>

<template>
  <section class="galc-result">
    <div class="galc-result-thumbnail">
      <ItemImage :image-uri="thumbnailUriFor(item)" :alt="`thumbnail of “${item.title}” by ${item.artist}`" @click="showPreview"/>
    </div>
    <ItemDetails :item="item" :show-internal-fields="showAdmin"/>
    <div class="galc-result-actions">
      <template v-if="isAdmin">
        <EditItemButton class="galc-action primary" :item="item"/>
        <DeleteItemButton class="galc-action secondary" :item="item"/>
      </template>
      <ReserveButton class="galc-action primary" :item="item" :available="available"/>
    </div>
  </section>
</template>

<style lang="scss">
.galc-result {
  display: grid;
  grid-template-columns: min(180px, 45%) minmax(0, 1fr);
  grid-column-gap: 0.75rem;

  .galc-result-thumbnail {
    img {
      cursor: pointer;
    }
  }

  .galc-result-actions {
    display: flex;
    flex-direction: column;
  }

  @media only screen and (max-width: 700px) {
    .galc-result-actions {
      grid-column: 1 / 3;
    }
  }

  @media only screen and (min-width: 700px) {

    .galc-result-thumbnail {
      grid-column: 1;
      grid-row: 1 / 3;
    }

    .galc-item-details {
      margin-right: auto;
    }

    .galc-result-actions {
      width: 160px;
      height: 100%;
      justify-content: end;
    }
  }

  @media only screen and (min-width: 960px) {
    grid-template-columns: min(180px, 45%) minmax(0, 1fr) 180px;

    .galc-result-actions {
      grid-column: 3;
      grid-row: 1 / 3;
    }
  }

  .galc-action {
    margin-bottom: 0.5em;
    margin-top: 0.5em;
  }

}
</style>
