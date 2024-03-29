<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { startCase } from "lodash"
import { formatPlainDate } from '../../helpers/date-helper'
import { useClosuresStore } from '../../stores/closures'

import { Closure } from "../../types/Closure"

import editIcon from '../../assets/edit.svg'
import deleteIcon from '../../assets/trash-alt.svg'
import angleDown from '../../assets/angle-down.svg'
import angleUp from '../../assets/angle-up.svg'

// --------------------------------------------------
// Stores

const closuresStore = useClosuresStore()
const { closures } = storeToRefs(closuresStore)
const { editClosure, deleteClosure } = closuresStore

// --------------------------------------------------
// Constants

const attrs = ['startDate', 'endDate'] as const

// --------------------------------------------------
// Local state

type Period = 'future' | 'current' | 'past'
type ShowFlags = { [K in Period]: boolean }
type FlagEntry = [Period, boolean]
type ClosuresByPeriod = { [K in Period]?: Array<Closure> }
type SortAttr = typeof attrs[number]
type SortVal = string | Date | undefined

const showFlags: Ref<ShowFlags> = ref({
  future: true,
  current: true,
  past: true
})


const sortAttrRef: Ref<SortAttr> = ref('startDate')
const sortDirRef = ref(1)

// --------------------------------------------------
// Computed properties

const sortIndicator = computed(() => {
  return sortDirRef.value === -1 ? angleUp : angleDown
})
const sortIndicatorAlt = computed(() => {
  return `sorted ${sortDirRef.value === -1 ? 'descending' : 'ascending'}`
})

const closuresToShow: ComputedRef<ClosuresByPeriod> = computed(() => {
  const allClosures = closures.value
  const groupedClosures: ClosuresByPeriod = {}
  const flagEntries = Object.entries(showFlags.value) as Array<FlagEntry>
  for (const [period, flag] of flagEntries) {
    if (flag) {
      const cls = allClosures.filter(c => c[period])
      const sortAttr = sortAttrRef.value
      if (sortAttr) {
        const sortDir = sortDirRef.value
        const attrCompare = comparatorFor(sortAttr)
        cls.sort((a, b) => sortDir * attrCompare(a, b))
      }
      groupedClosures[period] = cls
    }
  }
  return groupedClosures
})

// --------------------------------------------------
// Event handlers

function setSortAttr(sortAttr: SortAttr, event: MouseEvent) {
  (event.target as HTMLButtonElement).blur()
  if (sortAttr === sortAttrRef.value) {
    const sortDir = sortDirRef.value
    sortDirRef.value = -sortDir
  } else {
    sortAttrRef.value = sortAttr
  }
}

function editHandler(closure: Closure, event: MouseEvent) {
  (event.target as HTMLButtonElement).blur()
  editClosure(closure)
}

// TODO: get delete working
// TODO: confirmation
function deleteHandler(closure: Closure, event: MouseEvent) {
  (event.target as HTMLButtonElement).blur()
  deleteClosure(closure)
}

// --------------------------------------------------
// Helper functions

function comparatorFor(attr: SortAttr) {
  return (a: Closure, b: Closure) => {
    const aVal = a ? a[attr] : undefined
    const bVal = b ? b[attr] : undefined
    return compare(aVal, bVal)
  }
}

function compare(a: SortVal, b: SortVal) {
  if (a === b) {
    return 0
  }
  if (a && b) {
    return a > b ? 1 : -1
  }
  return a ? -1 : 1
}

function formatVal(val: Date | string) {
  return val instanceof Date ? formatPlainDate(val) : val
}

</script>

<template>
  <section class="galc-closures">
    <form class="galc-closures-selection">
      <h3>GALC Closures</h3>
      <ul class="galc-show-closures-controls">
        <li v-for="(flag, period) in showFlags" :key="`show-${period}-closures`">
          <input :id="`show-${period}-closures`" v-model="showFlags[period]" type="checkbox">
          <label :for="`show-${period}-closures`">{{ startCase(period) }}</label>
        </li>
      </ul>
    </form>
    <div v-for="(cls, period) of closuresToShow" :key="`galc-closures-${period}`" class="galc-closures-table-outer">
      <table class="galc-closures-table">
        <thead>
          <tr class="galc-closures-table-section">
            <th scope="col" colspan="4">
              <h4>{{ startCase(period) }} closures</h4>
            </th>
          </tr>
          <tr>
            <th scope="col">
              Edit
            </th>
            <th v-for="attr of attrs" :key="attr" :class="{ 'galc-note-attr': attr === 'note' }" scope="col">
              <button @click="setSortAttr(attr, $event)">
                {{ startCase(attr) }}
                <img v-if="attr === sortAttrRef" class="galc-icon" :src="sortIndicator" :alt="sortIndicatorAlt">
                <img v-else class="galc-icon galc-icon-hidden" :src="sortIndicator" :alt="`Sort by ${startCase(attr)}`">
              </button>
            </th>
            <th scope="col">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- TODO: create button -->
          <tr v-for="closure of cls" :key="closure.id" :class="{ 'galc-active-closure': closure.current }">
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

    ul.galc-show-closures-controls {
      display: contents;
      font-size: 1rem;

      li {
        display: contents;
      }
    }

    input[type=checkbox] {
      grid-column: 1;
      margin-top: 0.15rem;

      @media only screen and (max-width: 700px) {
        -webkit-transform: scale(1.25);
      }
    }

    label {
      grid-column: 2;
      display: block;
      white-space: nowrap;
      height: min-content;
      font-weight: normal;
      line-height: 1.15;
    }

  }

  div.galc-closures-table-outer {
    grid-column: 2;
    width: 100%;
  }

  table.galc-closures-table {
    width: max-content;
    margin-bottom: 1.5rem;

    display: grid;
    grid-template-columns: min-content auto auto min-content;
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

        &[colspan="4"] {
          grid-column: 1 / span 4;
          border-bottom: none;
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

</style>
