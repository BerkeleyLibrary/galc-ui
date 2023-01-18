<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClosuresStore } from '../../stores/closures'
import { dateToDateInput, ensureDate } from '../../helpers/date-helper'
import { storeToRefs } from 'pinia'

// ------------------------------------------------------------
// Stores

const closures = useClosuresStore()
const { applyEdit, cancelEdit } = closures
const { closurePatch } = storeToRefs(closures)

// ------------------------------------------------------------
// Local state

const title = computed(() => closurePatch.value.id ? 'Editing Closure' : 'New Closure')

const hasEndDate = ref(!!closurePatch.value.endDate)

const startDateInputModel = dateInputModel('startDate')
const endDateInputModel = dateInputModel('endDate')

// ------------------------------------------------------------
// Validation

const validationErrors = computed(() => {
  const errors = {}
  const patch = closurePatch.value
  const startDateValid = isValidDate(patch.startDate)
  if (!startDateValid) {
    errors.startDate = 'You must specify a start date.'
  }
  if (hasEndDate.value) {
    const endDateValid = isValidDate(patch.endDate)
    if (!endDateValid) {
      errors.endDate = 'You must specify an end date.'
    } else if (startDateValid && !isDateRangeValid()) {
      errors.startDate = 'The start date must be at least one day after the end date.'
      errors.endDate = 'The end date must be at least one day after the start date.'
    }
  }

  console.log('validationErrors: %o', errors)
  return errors
})

const canSave = computed(() => {
  return Object.keys(validationErrors.value).length === 0
})

// ------------------------------------------------------------
// Helper functions

function dateInputModel (dateAttr) {
  return computed({
    get () {
      const patch = closurePatch.value
      const date = patch[dateAttr]
      const result = date ? dateToDateInput(date) : null
      return result
    },
    set (v) {
      // TODO: is this right?
      const vActual = ensureDate(v)
      const patch = closurePatch.value
      patch[dateAttr] = vActual
    }
  })
}

function isDateRangeValid () {
  const patch = closurePatch.value
  if (patch) {
    const startDate = ensureDate(patch.startDate)
    const endDate = ensureDate(patch.endDate)
    return startDate < endDate
  }
  return false
}

function isValidDate (date) {
  try {
    if (date) {
      const dateActual = ensureDate(date)
      if (dateActual instanceof Date) {
        return !isNaN(dateActual.getTime())
      }
    }
  } catch (e) {
    console.log(e)
  }
  return false
}

// ------------------------------------------------------------
// Actions

function saveChanges () {
  const patch = { ...closurePatch.value }
  if (!hasEndDate.value) {
    patch.endDate = null
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
      <button class="galc-closure-cancel" @click="cancelEdit">Cancel</button>
      <button v-if="canSave" class="galc-closure-confirm" @click="saveChanges">Save Changes</button>
      <button v-else class="galc-closure-confirm" disabled>Save Changes</button>
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
    color: #d00000;

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

      &.galc-closure-cancel {
        background-color: white;
        border: 1px solid black;

        &:hover {
          background-color: #000;
          color: #fff;
        }
      }

      &.galc-closure-confirm {
        border: 1px solid transparent;

        &:hover {
          border-color: black;
          background-color: #000;
          color: #fff;
        }

        &:disabled {
          color: #46535e;
          background-color: #eeeeee;
        }
      }
    }
  }
}
</style>
