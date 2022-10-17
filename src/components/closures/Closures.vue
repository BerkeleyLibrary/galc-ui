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

const closuresStore = useClosuresStore()
const { currentClosures, pastClosures } = storeToRefs(closuresStore)
const { editClosure, deleteClosure } = closuresStore

// --------------------------------------------------
// Local state

const showPast = ref(true)

const sortAttr = ref('startDate')
const sortDir = ref(1)

const sortIndicator = computed(() => {
  return sortDir.value === -1 ? angleUp : angleDown
})
const sortIndicatorAlt = computed(() => {
  return `sorted ${sortDir.value === -1 ? 'descending' : 'ascending'}`
})

const attrs = ['startDate', 'endDate', 'note']

function setSortAttr (attr, event) {
  event.target.blur()
  if (attr === sortAttr.value) {
    const sortDirVal = sortDir.value
    sortDir.value = -sortDirVal
  } else {
    sortAttr.value = attr
  }
}

// TODO: separate future & active
const allClosures = computed(() => {
  const current = currentClosures.value
  const cc = [{ current: true, closures: current }]
  if (showPast.value) {
    const past = pastClosures.value
    cc.push({ current: false, closures: past })
  }
  const attr = sortAttr.value
  if (attr) {
    const sortDirVal = sortDir.value
    const attrCompare = comparatorFor(attr)
    const compareFn = (a, b) => { return sortDirVal * attrCompare(a, b) }
    for (const { closures } of cc) {
      closures.sort(compareFn)
    }
  }
  return cc
})

function comparatorFor (attr) {
  return (a, b) => {
    const aVal = a ? a[attr] : null
    const bVal = b ? b[attr] : null
    return compare(aVal, bVal)
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

function editHandler (closure, event) {
  event.target.blur()
  editClosure(closure)
}

// TODO: get delete working
// TODO: confirmation
function deleteHandler (closure, event) {
  event.target.blur()
  deleteClosure(closure)
}

</script>

<template>
  <section class="galc-closures">
    <form class="galc-closures-selection">
      <h3>GALC Closures</h3>
      <input id="show-past-closures" v-model="showPast" type="checkbox">
      <label for="show-past-closures">Show past closures</label>
    </form>
    <div v-for="{current, closures} of allClosures" :key="`galc-closures-${current ? 'active' : 'past'}`" class="galc-closures-table-outer">
      <h4>{{ current ? 'Active closures' : 'Past closures' }}</h4>
      <table class="galc-closures-table">
        <thead>
          <tr>
            <th class="galc-control" scope="col">
              Edit
            </th>
            <th v-for="attr of attrs" :key="attr" :class="{ 'galc-note-attr': attr === 'note' }" scope="col">
              <button @click="setSortAttr(attr, $event)">
                {{ startCase(attr) }}
                <img v-if="attr === sortAttr" class="galc-icon" :src="sortIndicator" :alt="sortIndicatorAlt">
                <img v-else class="galc-icon galc-icon-hidden" :src="sortIndicator" :alt="`Sort by ${startCase(attr)}`">
              </button>
            </th>
            <th class="galc-control" scope="col">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- TODO: create button -->
          <tr v-for="closure of closures" :key="closure.id" :class="{ 'galc-active-closure': closure.current }">
            <td class="galc-control">
              <button @click="editHandler(closure, $event)">
                <img class="galc-icon" :alt="`edit closure ${closure.id}`" :src="editIcon">
              </button>
            </td>
            <td v-for="attr of attrs" :key="`${closure.id}-${attr}`" class="galc-attrval" :class="{ 'galc-note-attr': attr === 'note' }">
              {{ formatVal(closure[attr]) }}
            </td>
            <td class="galc-control">
              <button @click="deleteHandler(closure, $event)">
                <img class="galc-icon" :alt="`delete closure ${closure.id}`" :src="deleteIcon">
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss">
.galc-closures {
  display: grid;
  grid-template-columns: min-content minmax(0, 1fr);
  align-items: start;
  justify-items: start;

  h3, h4 {
    font-size: 1.125rem;
    border-bottom: 1px solid #ddd5c7;
    width: 100%;
    margin-bottom: 0.5em;
    margin-top: 0;
  }

  h3 {
    font-weight: normal;
  }

  form.galc-closures-selection {
    display: grid;
    grid-template-columns: min-content max-content;
    column-gap: 0.5rem;
    margin-right: 2rem;
    width: 150px;

    h3 {
      grid-column: 1 / 3;
      grid-row: 1;
    }

    input[type=checkbox] {
      grid-column: 1;
      grid-row: 2;
      margin-top: 0.15rem;

      @media only screen and (max-width: 700px) {
        -webkit-transform: scale(1.25);
      }
    }

    label {
      grid-column: 2;
      grid-row: 2;
      display: block;
      white-space: nowrap;
      height: min-content;
      font-weight: normal;
      line-height: 1.15;
      cursor: pointer;
    }

  }

  div.galc-closures-table-outer {
    grid-column: 2;
    width: 100%;
  }

  table.galc-closures-table {
    width: 100%;
    margin-bottom: 1.5rem;

    display: grid;
    grid-template-columns: min-content auto auto minmax(0, 1fr) min-content;
    column-gap: 1rem;
    row-gap: 0.25rem;

    thead, tbody, tr {
      display: contents;
    }

    thead {
      th {
        padding: 2px;
        border-bottom: 1px solid #ddd5c7;
        font-weight: normal;

        button {
          height: 1.3rem !important;
          display: block;
          appearance: none;

          text-align: left;
          padding: 0;
          width: auto;

          text-decoration: none;
          text-decoration-color: white;
          transition: text-decoration .25s;

          &:hover {
            text-decoration: underline;
            text-decoration-color: #fdb515;
            text-decoration-skip-ink: none;
            text-decoration-thickness: 3px;
          }

          img.galc-icon-hidden {
            opacity: 0;
          }
        }
      }
    }

    th, td {
      padding-left: 0.25rem;
      text-align: left;

      &.galc-control {
        text-align: center;
      }

      &:not(.galc-note-attr) {
        white-space: nowrap;
      }

      button {
        background-color: transparent;
      }
    }

    td.galc-control {
      button {
        padding: 0;
      }
    }

    tbody {
      button {
        display: block;
        appearance: none;
        border: 3px solid transparent;
        border-radius: 4px;
        height: min-content;

        &:hover, &:focus {
          img {
            background-color: #fdb515;
          }
        }

        &:focus {
          img {
            border: 3px solid transparent;
          }
        }

        img {
          margin-bottom: 0;
          display: block;
        }
      }
    }
  }
}

// TODO: share global CSS class with thumbnail?
.galc-control {
  cursor: pointer;
}

.galc-icon {
  display: inline-block;
  height: 1.3rem !important;
  width: 1.3rem;
  border: 3px solid transparent;
  border-radius: 4px;
  margin-bottom: -0.2rem;
  pointer-events: none;
  outline: none !important;
}

</style>
