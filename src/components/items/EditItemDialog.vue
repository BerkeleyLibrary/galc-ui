<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

import { useItemsStore } from '../../stores/items'

import ItemDetails from './ItemDetails.vue'
import ItemImage from './ItemImage.vue'
import ItemAttributeField from './ItemAttributeField.vue'
import { useApiStore } from '../../stores/api'

// ------------------------------------------------------------
// Stores

const items = useItemsStore()
const { itemForId, applyEdit, cancelEdit } = items
const { itemPatch } = storeToRefs(items)

const { imageApi } = storeToRefs(useApiStore())

// ------------------------------------------------------------
// Constants

// TODO: real i18n
const attrs = {
  mmsId: 'MMS ID',
  barcode: 'Barcode',
  artist: 'Artist',
  artistUrl: 'Artist URL',
  title: 'Title',
  date: 'Date',
  description: 'Description',
  dimensions: 'Dimensions',
  decade: 'Decade',
  medium: 'Medium',
  genre: 'Genre',
  size: 'Size',
  appearance: 'Appearance',
  series: 'Series',
  circulation: 'Circulation',
  location: 'Location',
  value: 'Value',
  appraisalDate: 'Appraisal Date',
  notes: 'Notes',
  image: 'Image Filename'
}

// ------------------------------------------------------------
// Image uploads

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview // TODO: make this not suck
)

// ------------------------------------------------------------
// Local state

const originalItem = computed(() => itemForId(itemPatch.value.id))
const title = computed(() => {
  const item = originalItem.value
  return item ? `Editing ‘${item.title}’` : 'New Print'
})

const image = computed(() => itemPatch.value?.image)

// TODO: Cleaner way to encapsulate links
const thumbnailUri = computed(() => image.value?.links.icon.href)

// TODO: track whether we've changed anything, disable save if not

function saveChanges () {
  const patch = { ...itemPatch.value }
  applyEdit(patch)
}

const files = ref([])

function onProcessFile (err, img) {
  if (err) {
    console.log('Error processing file: %o', err)
    return
  }
  if (!img) {
    console.log('No image returned')
    return
  }
  // TODO: Load this from the server as JSONAPI, and set it on itemPatch
  const id = img.serverId
  console.log('Processed file, id = %o', id)
}

</script>

<template>
  <section class="galc-edit-item-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-dialog-title" aria-describedby="galc-edit-item-message">
    <h2 id="galc-dialog-title">{{ title }}</h2>

    <!--    <section v-if="originalItem" class="galc-edit-item-original">-->
    <!--      <div class="galc-result-thumbnail">-->
    <!--        <ItemImage :image-uri="originalItem.thumbnailUri" :alt="`thumbnail of “${originalItem.title}” by ${itemPatch.artist}`"/>-->
    <!--      </div>-->
    <!--      <ItemDetails :item="originalItem"/>-->
    <!--    </section>-->

    <section class="galc-edit-item-preview">
      <h3>Preview</h3>
      <div class="galc-result-thumbnail">
        <ItemImage :image-uri="thumbnailUri" :alt="`thumbnail of “${itemPatch.title}” by ${itemPatch.artist}`"/>
      </div>
      <ItemDetails :item="itemPatch"/>
    </section>

    <form class="galc-edit-item-form">
      <h3>Upload image</h3>

      <!-- TODO: make this pretty -->
      <file-pond
        ref="pond"
        name="file"
        label-idle="Drop new image here"
        accepted-file-types="image/jpeg, image/png, image/tiff"
        :allow-multiple="false"
        :server="imageApi"
        :files="files"
        @processfile="onProcessFile"
      />

      <h3>Edit Attributes</h3>
      <table class="galc-edit-attributes-table">
        <tr v-for="(label, attr) in attrs" :key="`${attr}-row`">
          <th scope="row"><label for="`galc-${attr}-field`">{{ label }}</label></th>
          <td>
            <ItemAttributeField :id="`galc-${attr}-field`" :attr="attr" :label="label"/>
          </td>
        </tr>
        <tr>
          <th scope="row">Suppressed?</th>
          <td style="vertical-align: center;">
            <input v-model="itemPatch.suppressed" type="checkbox">
          </td>
        </tr>
      </table>
    </form>

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
  max-height: 100%;
  overflow-y: scroll;
  width: 100%;

  h3:not(.galc-item-title) {
    border-bottom: 1px solid #ddd5c7;
  }

  .galc-edit-item-form {
    padding-top: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #ddd5c7;
  }

  table.galc-edit-attributes-table {
    display: grid;
    grid-template-columns: 14% 36% 14% 36%;

    tr {
      display: contents;

      th {
        display: block;
        text-align: right;
        vertical-align: top;
        padding: 0.5rem;
        //white-space: nowrap;
      }

      td {
        display: block;

        input[type=checkbox] {
          height: 44px;
        }
      }
    }
  }

  .galc-edit-item-original, .galc-edit-item-preview {
    display: grid;
    grid-template-columns: min(180px, 45%) minmax(0, 1fr);
    grid-column-gap: 0.75rem;

    h3 {
      grid-column: 1 / 3;
    }

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

      &.galc-edit-item-cancel, &.galc-edit-item-revert {
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
