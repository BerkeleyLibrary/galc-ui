<script setup>
import { computed, ref } from 'vue'
import { useClosuresStore } from '../../stores/closures'
import { dateToDateInput, ensureDate } from '../../helpers/date-helper'
import { storeToRefs } from 'pinia'

// ------------------------------------------------------------
// Stores

const closures = useClosuresStore()
const { applyEdit, cancelEdit } = closures
const { editingClosure } = storeToRefs(closures)

// ------------------------------------------------------------
// Local state

const closure = {
  id: editingClosure.id,
  note: editingClosure.note,
  startDate: editingClosure.startDate,
  endDate: editingClosure.endDate
}
const title = closure.id ? 'Editing Closure' : 'New Closure'

const hasEndDate = ref(!!closure.endDate)

const startDateInputModel = dateInputModel('startDate')
const endDateInputModel = dateInputModel('endDate')

// ------------------------------------------------------------
// Helper functions

function dateInputModel (dateAttr) {
  return computed({
    get () {
      const date = closure[dateAttr]
      return date ? dateToDateInput(date) : null
    },
    set (v) {
      // TODO: is this right?
      closure[dateAttr] = ensureDate(v)
    }
  })
}

// ------------------------------------------------------------
// Actions

function saveChanges () {
  applyEdit(closure)
}

</script>

<template>
  <section class="galc-closure-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-closure-title" aria-describedby="galc-closure-desc">
    <h2 id="galc-closure-title">{{ title }}</h2>
    <div id="galc-closure-desc">
      <ul>
        <li>Closures must have a start date.</li>
        <li>The end date is optional; a closure without an end date will close GALC till further notice.</li>
        <li>The note is optional.</li>
      </ul>
    </div>
    <form v-if="closure" id="galc-closure-form" class="galc-closure-form">
      <table>
        <tr>
          <th scope="row">Start date</th>
          <td>
            <input id="galc-closure-start-date" v-model.lazy="startDateInputModel" type="date" required>
          </td>
        </tr>
        <tr>
          <th scope="row">Has end date?</th>
          <td>
            <input id="galc-closure-has-end-date`" v-model="hasEndDate" type="checkbox">
          </td>
        </tr>
        <tr>
          <th scope="row">End date</th>
          <td>
            <input v-if="hasEndDate" id="galc-closure-end-date" v-model.lazy="endDateInputModel" type="date" required>
            <input v-else id="galc-closure-end-date" type="date" :value="endDateInputModel" disabled>
          </td>
        </tr>
      </table>
    </form>
    <div class="galc-closure-actions">
      <button class="galc-closure-cancel" @click="cancelEdit">Cancel</button>
      <button class="galc-closure-confirm" @click="saveChanges">Save Changes</button>
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
        border: 1px solid #fdb515;

        &:hover {
          border-color: black;
          background-color: #000;
          color: #fff;
        }
      }
    }
  }
}
</style>
