<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import vueFilePond from 'vue-filepond'
import { FilePond as FilePondInstance, FilePondErrorDescription, FilePondFile } from 'filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'

import timesCircle from '../../assets/times-circle.svg'

import { newEmptyImage, useItemsStore } from '../../stores/items'
import { useApiStore } from '../../stores/api'
import { handleError } from "../../helpers/handle-error"

import ItemDetails from './ItemDetails.vue'
import ItemImage from './ItemImage.vue'
import ItemAttributeField from './ItemAttributeField.vue'

// ------------------------------------------------------------
// Stores

const items = useItemsStore()
const { itemForId, applyEdit, revertEdit, cancelEdit, thumbnailUriFor } = items
const { itemPatch } = storeToRefs(items)

const apiStore = useApiStore()
const { imageApi } = storeToRefs(apiStore)
const { fetchImage, deleteImage } = apiStore

// ------------------------------------------------------------
// Constants

// TODO: real i18n
const publicAttrs = {
  title: 'Title',
  description: 'Description',
  artist: 'Artist',
  artistUrl: 'Artist URL',

  date: 'Date',
  dimensions: 'Dimensions',

  decade: 'Decade',
  size: 'Size',

  genre: 'Genre',
  medium: 'Medium',

  appearance: 'Appearance',
  series: 'Series',
}

// TODO: real i18n
const adminAttrs = {
  mmsId: 'MMS ID',
  barcode: 'Barcode',
  circulation: 'Circulation',
  location: 'Location',
  value: 'Value',
  appraisalDate: 'Appraisal Date',
  notes: 'Notes',
}

// ------------------------------------------------------------
// Image uploads

const FilePond = vueFilePond(
  FilePondPluginFileValidateType
)

// ------------------------------------------------------------
// Local state

const originalItem = computed(() => itemForId(itemPatch.value?.id))
const originalImageId = computed(() => originalItem.value?.image?.id)

const title = computed(() => {
  const item = originalItem.value
  return item ? `Editing ‘${item.title}’` : 'New Print'
})

const image = computed(() => itemPatch.value?.image || newEmptyImage())

// TODO: track whether we've changed anything, disable save if not

function saveChanges() {
  const patch = itemPatch.value
  if (patch) {
    applyEdit({ ...patch })
  }
}

const files = ref([])

function setImageId(imageId: string | undefined) {
  const patch = itemPatch.value
  if (!patch) {
    return
  }

  if (imageId) {
    fetchImage(imageId)
      .then(({ data }) => { patch.image = data })
      .catch(handleError(`fetchImage(${imageId}) failed`))
  } else {
    patch.image = newEmptyImage()

  }
}

function resetImageId() {
  setImageId(originalImageId.value)
}

function clearImageId() {
  setImageId(undefined)
}

function onProcessFile(err: FilePondErrorDescription | null, img: FilePondFile) {
  if (err) {
    console.log('Error processing file: %o', err)
    return
  }
  if (!img) {
    console.log('No image returned')
    return
  }
  // TODO: Load the whole image from the server as JSONAPI, and set it on itemPatch
  const imageId = img.serverId
  console.log('Processed file, id = %o', imageId)
  setImageId(imageId)
}

const uploadImageLabel = 'Drag new TIFF, JPEG, or PNG image here, or click to upload'

const validationErrors = computed(() => {
  const errors: { [key: string]: string } = {}
  const patch = itemPatch.value
  if (patch) {
    if (!patch.title) {
      errors.title = 'Print must have a title'
    }
    if (!patch.suppressed) {
      if (!patch.mmsId) {
        errors.mmsId = 'Print must have an MMS ID, or be suppressed'
      }
      if (!patch.image?.id) {
        errors.image = 'Print must have an image, or be suppressed'
      }
    }
  }
  return errors
})

// TODO: share code w/closures
const canSave = computed(() => {
  return Object.keys(validationErrors.value).length === 0
})

function cancel() {
  const patch = itemPatch.value
  if (patch) {
    if (!patch.id) { // creating a new item
      const image = patch.image
      const imageId = image?.id
      if (imageId) {
        deleteImage({ id: imageId })
      }
    }
  }
  cancelEdit()
}

const pond: Ref<FilePondInstance | undefined> = ref()

function revert() {
  revertEdit()

  const filepond = pond.value
  if (filepond) {
    const uploadedFile = filepond.getFile()
    if (uploadedFile) {
      filepond.removeFile()
      deleteImage({ id: uploadedFile.serverId })
    }
  }
}

onMounted(() => {
  const header = document.getElementById('galc-dialog-title')
  if (header) {
    header.scrollIntoView()
  }
  // TODO: something more general — focus on first error?
  const titleError = !!validationErrors.value.title
  if (titleError) {
    const titleField = document.getElementById('galc-title-input')
    if (titleField) {
      titleField.focus()
    }
  }
})

</script>

<template>
  <section class="galc-edit-item-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-dialog-title" aria-describedby="galc-dialog-title">
    <h2 id="galc-dialog-title">{{ title }}</h2>

    <section class="galc-edit-item-preview">
      <h3>Preview</h3>
      <div class="galc-result-thumbnail">
        <ItemImage :image-uri="thumbnailUriFor(itemPatch)" :alt="`thumbnail of “${itemPatch.title}” by ${itemPatch.artist}`"/>
      </div>
      <ItemDetails :item="itemPatch" :show-internal-fields="true"/>
      <section class="galc-validation-errors">
        <p v-for="(validationError, attr) of validationErrors" :key="`validation-error-${attr}`" class="galc-validation-error">
          {{ validationError }}
        </p>
      </section>
    </section>


    <form class="galc-edit-item-form">
      <h3>Image</h3>
      <table class="galc-edit-attributes-table">
        <tr :class="{ 'galc-item-invalid': !!validationErrors['image'] }" :title="validationErrors['image']">
          <th scope="row"><label for="galc-image-input">Image</label></th>
          <td class="galc-edit-image-upload">
            <button v-if="image.basename" class="galc-edit-image-remove" @click="clearImageId">
              <img alt="Remove current image" :src="timesCircle" class="galc-edit-image-remove-icon">
              <span class="galc-edit-image-remove-label">Remove</span>
            </button>
            <input type="text" id="galc-image-input" :value="image.basename" disabled>
            <file-pond
              ref="pond"
              class-name="galc-edit-image-uploader"
              name="file"
              :label-idle="uploadImageLabel"
              accepted-file-types="image/jpeg, image/png, image/tiff"
              :allow-multiple="false"
              :server="imageApi"
              :files="files"
              @processfile="onProcessFile"
              @processfilerevert="resetImageId"
            />
          </td>
        </tr>
      </table>
      <h3>Metadata</h3>
      <table class="galc-edit-attributes-table">
        <!-- TODO: extract an ItemAttributeRow component -->
        <tr v-for="(label, attr) in publicAttrs" :key="`${attr}-row`" :class="{ 'galc-item-invalid': !!validationErrors[attr] }" :title="validationErrors[attr]">
          <!-- TODO: don't generate labels for facet fieldsets -->
          <th scope="row"><label :for="`galc-${attr}-input`">{{ label }}</label></th>
          <td>
            <ItemAttributeField :id="`galc-${attr}-field`" :attr="attr" :label="label"/>
          </td>
        </tr>
      </table>
      <h4>Internal fields</h4>
      <table class="galc-edit-attributes-table">
        <!-- TODO: extract an ItemAttributeRow component -->
        <tr v-for="(label, attr) in adminAttrs" :key="`${attr}-row`" :class="{ 'galc-item-invalid': !!validationErrors[attr] }" :title="validationErrors[attr]">
          <th scope="row"><label :for="`galc-${attr}-input`">{{ label }}</label></th>
          <td>
            <ItemAttributeField :id="`galc-${attr}-field`" :attr="attr" :label="label"/>
          </td>
        </tr>
        <tr>
          <th scope="row"><label for="galc-suppressed-input">Suppressed?</label></th>
          <td style="vertical-align: center;">
            <input v-model="itemPatch.suppressed" id="galc-suppressed-input" type="checkbox">
          </td>
        </tr>
      </table>
    </form>

    <div class="galc-edit-item-actions">
      <button class="galc-action secondary" @click="cancel">Cancel</button>
      <button class="galc-action secondary" @click="revert">Revert</button>
      <button v-if="canSave" class="galc-action primary" @click="saveChanges">Save changes</button>
      <button v-else  class="galc-action primary" disabled>Save Changes</button>
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

  h2 {
    scroll-margin-top: 2em;
  }

  h3:not(.galc-item-title) {
    border-bottom: 1px solid #ddd5c7;
  }

  h4 {
    //color: #46535e;
    font-size: 1.2rem;
    border-bottom: 1px solid #ddd5c7;
  }

  .galc-edit-item-preview {
    display: grid;
    grid-template-columns: min(180px, 45%) minmax(0, 1fr) auto;
    grid-column-gap: 0.75rem;

    h3 {
      grid-column: 1 / 4;
    }

    @media only screen and (min-width: 700px) {
      .galc-item-details {
        margin-right: auto;
      }
    }
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

      &.galc-item-invalid {
        th {
          color: #d00000;
        }

        input {
          border: 3px solid red;
        }
      }
    }
  }

  // TODO: share code w/closures
  p.galc-validation-error {
    margin-left: 1rem;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: bold;
    color: #d00000;

    &::before {
      content: '❌';
      font-size: 0.75rem;
      margin-right: 0.25rem;
      vertical-align: top;
    }
  }

  .galc-edit-item-actions {
    display: flex;
    justify-content: center;
    gap: 1em;
    margin-top: 1rem;

    button {
      width: 180px;
    }
  }

  .galc-edit-image-upload {
    padding-bottom: 0.5rem;
    position: relative;

    button.galc-edit-image-remove {
      position: absolute;
      right: 5px;
      top: 5px;

      display: flex;
      align-items: center;

      width: auto;
      height: 32px;
      border-radius: 0.5em;

      // TODO: share w/other icon styles
      img.galc-edit-image-remove-icon {
        height: 0.9rem;
        width: 0.9rem;
        display: inline;
        margin-bottom: -2px;
        margin-right: 4px;
        margin-left: 4px;
      }

      .galc-edit-image-remove-label {
        font-weight: bold;
        margin-right: 4px;
      }
    }

    .galc-edit-image-uploader {
      min-height: 5rem;
      border-radius: 0.5em;
      cursor: pointer;

      .filepond--drop-label {

        label {
          cursor: pointer;
          margin-right: 1rem;
        }

        &:before {
          content: url('../../assets/file-image.svg');
          display: inline-block;
          width: 2rem;
          height: 2rem;
          margin-left: 1rem;
          filter: opacity(0.7);
        }
      }

      &:not(:hover) {
        border: 2px solid transparent;
      }

      &:hover {
        border: 2px solid #fdb515;

        .filepond--drop-label {
          label {
            //text-decoration-line: underline;
            //text-decoration-thickness: 3px;
            //text-decoration-color: #fdb515;
          }
        }
      }
    }

    // --------------------------------------------------
    // FilePond overrides

    .filepond--root {
      font-family: inherit;

      .filepond--panel-root {
        //border-radius: 0 !important;
      }

      .filepond--drop-label {
        label {
          font-weight: bold;
        }
      }

      .filepond--credits {
        display: none;
      }

    }
  }

  // --------------------------------------------------
  // Desktop margins

  @media only screen and (min-width: 700px) {
    .galc-result {
      margin-left: 1em;
      margin-right: 1em;
    }
  }
}
</style>
