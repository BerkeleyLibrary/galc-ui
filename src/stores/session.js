import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { readParam } from '../helpers/window-location-helper'

export const LOGIN_PARAM = 'login'

export const useSessionStore = defineStore('session', () => {
  // --------------------------------------------------
  // State

  const user = ref(null)
  const loginSet = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    // TODO: don't clear this on login
    const login = readParam(LOGIN_PARAM)
    loginSet.value = !!login
  }

  const doLogin = computed(() => {
    if (isAuthenticated.value) {
      return false
    }
    return loginSet.value
  })

  const isAuthenticated = computed(() => !!user.value)

  const isAdmin = computed(() => {
    const userObj = user.value
    return userObj && userObj.galcAdmin
  })

  const email = computed(() => {
    const userObj = user.value
    return userObj && userObj.email
  })

  function updateUser ({ data }) {
    user.value = data
  }

  const exported = { init, doLogin, user, email, isAuthenticated, isAdmin, updateUser }

  // --------------------------------------------------
  // Store definition

  return exported
})
