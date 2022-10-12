<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { startCase } from 'lodash/string'
import { formatPlainDate } from '../../helpers/date-helper'
import { useClosuresStore } from '../../stores/closures'

import angleDown from '../../assets/angle-down.svg'
import angleUp from '../../assets/angle-up.svg'
import editIcon from '../../assets/edit.svg'
import deleteIcon from '../../assets/trash-alt.svg'

// --------------------------------------------------
// Stores

const closuresStor = useClosuresStore()
const { currentClosures, pastClosures } = storeToRefs(closuresStor)
const { editClosure, deleteClosure } = closuresStor

// --------------------------------------------------
// Local state

const showPast = ref(false)

const sortAttr = ref('startDate')
const sortDir = ref(1)

const sortIndicator = computed(() => {
  return sortDir.value === -1 ? angleUp : angleDown
})
const sortIndicatorAlt = computed(() => {
  return `sorted ${sortDir.value === -1 ? 'descending' : 'ascending'}`
})

const attrs = ['startDate', 'endDate', 'note']

function setSortAttr (attr) {
  if (attr === sortAttr.value) {
    const sortDirVal = sortDir.value
    sortDir.value = -sortDirVal
  } else {
    sortAttr.value = attr
  }
}

const closures = computed(() => {
  const current = currentClosures.value
  const cc = [...current]
  if (showPast.value) {
    const past = pastClosures.value
    cc.push(...past)
  }
  const attr = sortAttr.value
  if (attr) {
    const sortDirVal = sortDir.value
    const attrCompare = comparatorFor(attr)
    const compareFn = (a, b) => { return sortDirVal * attrCompare(a, b) }
    cc.sort(compareFn)
  }
  return cc
})

function comparatorFor (attr) {
  return (a, b) => {
    const aVal = a ? a[attr] : null
    const bVal = b ? b[attr] : null
    compare(aVal, bVal)
  }
}

function compare (a, b) {
  if (a === b) {
    return 0
  }
  if (a && b) {
    return a > b ? 1 : -1
  }
  return a ? -1 : 1
}

function formatVal (val) {
  return val instanceof Date ? formatPlainDate(val) : val
}

function editHandler (closure) {
  return (event) => {
    event.target.blur()
    editClosure(closure)
  }
}

// TODO: confirmation
function deleteHandler (closure) {
  return (event) => {
    event.target.blur()
    deleteClosure(closure)
  }
}

</script>

<template>
  <section class="galc-closures">
    <h3>GALC Closures</h3>
    <table class="galc-closures-table">
      <thead>
        <tr>
          <th>
            Edit
          </th>
          <th v-for="attr of attrs" :key="attr" scope="col" class="galc-control" @click="setSortAttr(attr)">
            {{ startCase(attr) }}
            <img v-if="attr === sortAttr" class="galc-icon" :src="sortIndicator" :alt="sortIndicatorAlt">
          </th>
          <th>
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- TODO: create button -->
        <tr v-for="closure of closures" :key="closure.id">
          <td class="galc-control">
            <button @click="editHandler(closure)">
              <img class="galc-icon" :alt="`edit closure ${closure.id}`" :src="editIcon">
            </button>
          </td>
          <td v-for="attr of attrs" :key="`${closure.id}-${attr}`" class="galc-attrval">
            {{ formatVal(closure[attr]) }}
          </td>
          <td class="galc-control">
            <button @click="deleteHandler(closure)">
              <img class="galc-icon" :alt="`delete closure ${closure.id}`" :src="deleteIcon">
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style lang="scss">
// TODO: share global CSS class with thumbnail?
.galc-control {
  cursor: pointer;
}

img.galc-icon {
  display: inline-block;
  height: 1.3rem !important;
  width: 1.3rem;
  border: 3px solid transparent;
  border-radius: 4px;
  margin-bottom: -0.2rem;
}

table.galc-closures-table {
  th, td {
    padding: 0.5rem;
    border: 1px solid blue;
  }

  td.galc-attrval {
    width: 25%;
  }

  td.galc-control {
    button {
      background-color: transparent;

      &:hover, &:focus {
        img.galc-icon {
          border: 3px solid #fdb515;
          background-color: #fdb515;
        }
      }
    }
  }
}

</style>
