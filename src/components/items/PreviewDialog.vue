<script setup>
import { storeToRefs } from 'pinia'
import { usePreviewStore } from '../../stores/preview'

import ItemImage from './ItemImage.vue'

const preview = usePreviewStore()
const { currentPreview } = storeToRefs(preview)
const { endPreview } = preview

</script>

<template>
  <div class="galc-item-preview">
    <ItemImage class="galc-item-preview-image" :image-uri="currentPreview.imageUri" :alt="`preview “${currentPreview.title}” by ${currentPreview.artist}`"/>
    <button @click="endPreview">Close</button>
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

  button {
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
