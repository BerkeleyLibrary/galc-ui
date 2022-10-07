<script setup>
import { storeToRefs } from 'pinia/dist/pinia'
import { useSessionStore } from '../stores/session'
import { useApiStore } from '../stores/api'
import { useSearchStore } from '../stores/search'
import { useClosuresStore } from '../stores/closures'

// Log out

const { isAuthenticated, isAdmin } = storeToRefs(useSessionStore())
const { logout } = useApiStore()

// Reset search

const { resetSearch } = useSearchStore()

function doReset (event) {
  event.target.blur()
  resetSearch()
}

// Admin

const closures = useClosuresStore()
const { createClosure, editActiveClosure } = closures
const { closed } = storeToRefs(closures)

</script>

<template>
  <nav class="galc-toolbar-nav">
    <ul>
      <template v-if="isAdmin">
        <li>
          <button v-if="closed" @click="editActiveClosure">Edit Closure</button>
        </li>
        <li>
          <button @click="createClosure">Create closure</button>
        </li>
      </template>
      <li>
        <button v-if="isAuthenticated" @click="logout">Log out</button>
      </li>
      <li>
        <button @click="doReset">Reset</button>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.galc-toolbar-nav {
  @media only screen and (max-width: 700px) {
    margin-bottom: -36px; // overlap show/hide facets button
  }

  ul {
    display: flex;
    justify-content: end;
    gap: 2em;
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;

    li {
      display: flex;
      flex-direction: column;
      justify-content: start;

      button {
        line-height: inherit;
        font-size: 1rem;
        line-height: 1.15;

        // cf. input[type=Submit], input[value=Reset]
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 20px;
        background-color: transparent;
        height: 24px;
        padding: 0;
        width: auto;
        transition: background-color .25s, color .25s;

        // TODO: Do we ever do this?
        &:disabled {
          color: #ddd;
        }

        &:not(:disabled) {
          color: #000;
          text-decoration: underline;
          text-decoration-color: #fdb515;
          text-decoration-skip-ink: none;
          text-decoration-thickness: 3px;

          &:hover {
            background-color: #000 !important;
            color: #fff !important;
            text-decoration: none !important;
          }
        }
      }
    }
  }
}
</style>
