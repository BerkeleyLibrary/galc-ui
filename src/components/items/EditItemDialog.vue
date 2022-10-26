<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useItemsStore } from '../../stores/items'

import ItemDetails from './ItemDetails.vue'
import ItemImage from './ItemImage.vue'

// ------------------------------------------------------------
// Stores

const items = useItemsStore()
const { applyEdit, cancelEdit } = items
const { itemPatch } = storeToRefs(items)

// ------------------------------------------------------------
// Local state

const title = computed(() => itemPatch.value.id ? 'Editing Print' : 'New Print')

// TODO: track whether we've changed anything, disable save if not

function saveChanges () {
  const patch = { ...itemPatch.value }
  applyEdit(patch)
}

</script>

<template>
  <section class="galc-edit-item-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-dialog-title" aria-describedby="galc-edit-item-message">
    <h2 id="galc-dialog-title">{{ title }}</h2>

    <section class="galc-edit-item-item">
      <div class="galc-result-thumbnail">
        <ItemImage :image-uri="itemPatch.thumbnailUri" :alt="`thumbnail of “${itemPatch.title}” by ${itemPatch.artist}`"/>
      </div>
      <ItemDetails :item="itemPatch"/>
    </section>

    <div class="galc-edit-item-actions">
      <button class="galc-edit-item-cancel" @click="cancelEdit">Cancel</button>
      <button class="galc-edit-item-confirm" @click="saveChanges">Save changes</button>
    </div>
  </section>
</template>

<style lang="scss">
// TODO: share dialog styles
.galc-edit-item-dialog {
  padding: 2em;
  border: 1px solid black;
  background-color: white;
  max-width: 1075px;

  .galc-edit-item-item {
    display: grid;
    grid-template-columns: min(180px, 45%) minmax(0, 1fr);
    grid-column-gap: 0.75rem;

    @media only screen and (min-width: 700px) {
      .galc-item-details {
        margin-right: auto;
      }
    }
  }

  .galc-edit-item-actions {
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

      &.galc-edit-item-cancel {
        background-color: white;
        border: 1px solid black;

        &:hover {
          background-color: #000;
          color: #fff;
        }
      }

      &.galc-edit-item-confirm {
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
