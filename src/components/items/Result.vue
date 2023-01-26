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

// ------------------------------------------------------------
// Store

const { startPreview } = usePreviewStore()
const { getAvailability } = useResultStore()
const { isAdmin } = storeToRefs(useSessionStore())
const { thumbnailUriFor } = useItemsStore()

// ------------------------------------------------------------
// Properties

const props = defineProps<{item: Item}>()

// ------------------------------------------------------------
// Local state

const available = computed(() => getAvailability(props.item))

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
    <ItemDetails :item="item"/>
    <div class="galc-result-actions">
      <template v-if="isAdmin">
        <EditItemButton :item="item"/>
        <DeleteItemButton :item="item"/>
      </template>
      <ReserveButton :item="item" :available="available"/>
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
      justify-self: end;
      align-self: end;
    }
  }

  @media only screen and (min-width: 960px) {
    grid-template-columns: min(180px, 45%) minmax(0, 1fr) 180px;

    .galc-result-actions {
      grid-column: 3;
      grid-row: 1 / 3;
    }
  }

  // TODO: share button styles
  button, input[type=submit] {
    width: 100%;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 700;
    height: 42px;
    padding: 6px 10px;
    margin-bottom: 0.5em;
    transition: background-color .25s, color .25s;
    color: #000;
    font-size: 1rem;

    &:hover {
      background-color: #000;
      color: #fff;
    }

    &:disabled {
      color: #46535e;
      background-color: #eeeeee;
    }
  }
}
</style>
