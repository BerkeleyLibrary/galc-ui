<script setup lang="ts">
import { storeToRefs } from 'pinia'

import ItemDetails from './ItemDetails.vue'
import ItemImage from './ItemImage.vue'
import { useItemsStore } from "../../stores/items"

const itemsStore = useItemsStore()
const { itemToDelete: item } = storeToRefs(itemsStore)
const { confirmDelete, cancelDelete, thumbnailUriFor } = itemsStore

</script>

<template>
  <section class="galc-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-dialog-title" aria-describedby="galc-delete-message">
    <h2 id="galc-dialog-title">You are deleting “{{ item.title }}”</h2>

    <section class="galc-delete-item">
      <div class="galc-result-thumbnail">
        <ItemImage :image-uri="thumbnailUriFor(item)" :alt="`thumbnail of “${item.title}” by ${item.artist}`"/>
      </div>
      <ItemDetails :item="item"/>

      <div class="galc-delete-message">
        <p class="galc-delete-warning">
          This action cannot be undone.
        </p>
      </div>
    </section>

    <div class="galc-delete-actions">
      <button class="galc-delete-cancel" @click="cancelDelete">Cancel</button>
      <button class="galc-delete-confirm" @click="confirmDelete">Delete print</button>
    </div>
  </section>
</template>

<style lang="scss">
// TODO: share dialog styles
.galc-delete-dialog {
  padding: 2em;
  border: 1px solid black;
  background-color: white;
  max-width: 1075px;

  .galc-delete-item {
    display: grid;
    grid-template-columns: min(180px, 45%) minmax(0, 1fr);
    grid-column-gap: 0.75rem;

    .galc-delete-message {
      grid-column: 2;
      grid-row: 2;
    }

    @media only screen and (min-width: 700px) {
      .galc-item-details {
        margin-right: auto;
      }
    }
  }

  .galc-delete-warning {
    font-weight: bold;
    color: #c00000;

    &::before {
      content: '⚠️';
      //font-size: 0.75rem;
      margin-right: 0.25rem;
      vertical-align: top;
    }
  }

  .galc-delete-actions {
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

      &.galc-delete-cancel {
        background-color: white;
        border: 1px solid black;

        &:hover {
          background-color: #000;
          color: #fff;
        }
      }

      &.galc-delete-confirm {
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
