<script setup>
import { storeToRefs } from 'pinia/dist/pinia'
import { useSessionStore } from '../stores/session'
import { useApiStore } from '../stores/api'

const { isAuthenticated } = storeToRefs(useSessionStore())
const { logoutUrl } = storeToRefs(useApiStore())

</script>

<template>
  <nav v-if="isAuthenticated" class="galc-toolbar-nav">
    <ul>
      <li>
        <a :href="logoutUrl">Log out</a>
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
    gap: 0.25em;
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;

    li {
      display: inline-block;
    }
  }
}
</style>
