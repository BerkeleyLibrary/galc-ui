<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClosuresStore } from '../../stores/closures'
import { ensureDate, formatPlainDate, validateDateRange } from '../../helpers/date-helper'
import { storeToRefs } from 'pinia'
import { DateRangeAttr } from "../../types/DateRange"

// ------------------------------------------------------------
// Stores

const closures = useClosuresStore()
const { applyEdit, cancelEdit } = closures
const { closurePatch } = storeToRefs(closures)

// ------------------------------------------------------------
// Local state

const title = computed(() => closurePatch.value?.id ? 'Editing Closure' : 'New Closure')

const hasEndDate = ref(!!closurePatch.value?.endDate)

const startDateInputModel = dateInputModel('startDate')
const endDateInputModel = dateInputModel('endDate')

// ------------------------------------------------------------
// Validation

const validationErrors = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patch = closurePatch.value!
  return validateDateRange(patch.startDate, patch.endDate)
})

const canSave = computed(() => {
  return Object.keys(validationErrors.value).length === 0
})

// ------------------------------------------------------------
// Helper functions

function dateInputModel(dateAttr: DateRangeAttr) {
  return computed({
    get() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const patch = closurePatch.value!
      const date = patch[dateAttr]
      return formatPlainDate(date) ?? ''
    },
    set(v: string) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const patch = closurePatch.value!
      const vActual = ensureDate(v)
      patch[dateAttr] = vActual
    }
  })
}

// ------------------------------------------------------------
// Actions

function saveChanges() {
  const patch = { ...closurePatch.value }
  if (!hasEndDate.value) {
    delete patch.endDate
  }
  applyEdit(patch)
}

</script>

<template>
  <section class="galc-closure-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-closure-title" aria-describedby="galc-closure-desc">
    <h2 id="galc-closure-title">{{ title }}</h2>
    <p id="galc-closure-desc">
      Close GALC either until further notice, or until a specified reopening date.
    </p>
    <form id="galc-closure-form" class="galc-closure-form">
      <table class="galc-closure-form-outer">
        <tbody :class="{ 'galc-closure-invalid': !!validationErrors.startDate }">
          <tr>
            <th scope="row">
              <label for="galc-closure-start-date">Close GALC from:</label>
            </th>
            <td>
              <input id="galc-closure-start-date" v-model.lazy="startDateInputModel" type="date" required>
            </td>
          </tr>
        </tbody>
        <tbody :class="{ 'galc-closure-invalid': !!validationErrors.endDate }">
          <tr>
            <th scope="row" rowspan="2">
              <label for="galc-closure-end-date">Until:</label>
            </th>
            <td>
              <input id="galc-closure-indefinite" v-model="hasEndDate" type="radio" :value="false">
              <label for="galc-closure-indefinite">further notice</label>
            </td>
          </tr>
          <tr>
            <td>
              <input id="galc-closure-definite" v-model="hasEndDate" type="radio" :value="true">
              <label for="galc-closure-end-date">specified date:</label>
              <input v-if="hasEndDate" id="galc-closure-end-date" v-model.lazy="endDateInputModel" type="date" required>
              <input v-else id="galc-closure-end-date" type="date" :value="endDateInputModel" disabled>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    <p v-for="(validationError, attr) of validationErrors" :key="`validation-error-${attr}`" class="galc-validation-error">
      {{ validationError }}
    </p>
    <div class="galc-closure-actions">
      <button class="galc-action secondary" @click="cancelEdit">Cancel</button>
      <button v-if="canSave" class="galc-action primary" @click="saveChanges">Save Changes</button>
      <button v-else class="galc-action primary" disabled>Save Changes</button>
    </div>
  </section>
</template>

<style lang="scss">
// TODO: share dialog styles
.galc-closure-dialog {
  padding: 2em;
  border: 1px solid black;
  background-color: white;
  max-width: 1075px;

  p#galc-closure-desc {
    margin-left: 1rem;
    font-size: 1rem;
  }

  form.galc-closure-form {
    margin-left: 1rem;
    margin-bottom: 1rem;

    label {
      display: inline-block;
      margin-right: 0.5rem;
    }

    table {

      th {
        text-align: right;
        //padding-right: 0.5rem;
      }

      th, td {
        vertical-align: top;
        //border: 1px solid blue;
        line-height: 2rem;

        white-space: nowrap;
      }
    }

    input[type="date"], input[type="text"] {
      margin-top: auto;
      margin-bottom: auto;
      width: auto;

      display: inline-block;

      &:disabled {
        color: #3b7ea1;
      }
    }

    input[type="radio"] {
      vertical-align: middle;
      height: 40px;
      margin-bottom: 2px;
      margin-right: 0.25rem;
    }

    .galc-closure-invalid {
      input[type="date"] {
        border: 3px solid red;
      }
    }
  }

  p.galc-validation-error {
    margin-left: 1rem;
    font-size: 1rem;
    font-weight: bold;
    color: #c00000;

    &::before {
      content: '❌';
      font-size: 0.75rem;
      margin-right: 0.25rem;
      vertical-align: top;
    }
  }

  .galc-closure-actions {
    display: flex;
    justify-content: center;
    gap: 1em;

    button {
      width: 180px;
    }
  }
}
</style>
