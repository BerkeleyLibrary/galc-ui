<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useApiStore } from '../stores/api'
import { useWindowLocationStore } from '../stores/window-location'
import { useSessionStore } from '../stores/session'

const { loginUrl } = storeToRefs(useApiStore())
const { location } = storeToRefs(useWindowLocationStore())
const { doLogin } = storeToRefs(useSessionStore())

const loginFormRef: Ref<HTMLFormElement | undefined> = ref()

const triggerSubmit = computed(() => {
  return doLogin.value && !!loginFormRef.value
})

watch(triggerSubmit, (v) => {
  if (v) {
    submitForm()
  }
})

function submitForm () {
  const loginForm = loginFormRef.value
  if (loginForm) {
    loginForm.submit()
  } else {
    console.log('loginForm not initialized')
  }
}
</script>

<template>
  <form v-if="doLogin" ref="loginFormRef" class="galc-admin-login" method="post" :action="loginUrl">
    <input type="hidden" name="origin" :value="location">
    <input type="submit" value="Log in">
  </form>
</template>

<style lang="scss">
form.galc-admin-login {
  position: absolute;
  top: -9999px;
  right: -9999px;
}
</style>
