<script setup>
import { storeToRefs } from 'pinia/dist/pinia'
import { useSessionStore } from '../stores/session'
import { useApiStore } from '../stores/api'

const { authenticated } = storeToRefs(useSessionStore())
const { logoutUrl } = storeToRefs(useApiStore())

</script>

<template>
  <nav v-if="authenticated" class="galc-toolbar-nav">
    <ul>
      <li>
        <a :href="logoutUrl">Log out</a>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.galc-toolbar-nav {
  ul {
    display: flex;
    justify-content: end;
    gap: 0.25em;
    padding: 0;
    margin-top: 0;

    li {
      display: inline-block;
    }
  }
}
</style>
