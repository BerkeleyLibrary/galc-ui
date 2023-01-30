<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePreviewStore } from '../../stores/preview'

import ItemImage from './ItemImage.vue'
import { useItemsStore } from "../../stores/items"

const preview = usePreviewStore()
const { currentPreview } = storeToRefs(preview)
const { endPreview } = preview
const { imageUriFor } = useItemsStore()

</script>

<template>
  <div class="galc-item-preview">
    <ItemImage class="galc-item-preview-image" :image-uri="imageUriFor(currentPreview)" :alt="`preview “${currentPreview.title}” by ${currentPreview.artist}`"/>
    <button  class="galc-action primary" @click="endPreview">Close</button>
  </div>
</template>

<style lang="scss">
.galc-item-preview {
  display: grid;
  gap: 1rem;
  grid-template-rows: minmax(0, 1fr) auto;

  padding: 1em;
  border: 1px solid black;
  background-color: white;
  max-height: 100%;

  .galc-item-preview-image {
    max-height: 100%;
    width: fit-content;
    // TODO: Figure out how to size image block properly w/o aspect ratio problems
    object-fit: contain;
  }
}
</style>
